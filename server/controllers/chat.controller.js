import { chatCompletion } from '../config/openrouter.js';
import { SYSTEM_PROMPT, buildContextPrompt } from '../config/systemPrompt.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const conversations = new Map();

function generateConversationId() {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
}

function generateSessionId() {
    return 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
}

function extractKeywords(message) {
    const stopWords = ['i', 'want', 'need', 'show', 'me', 'a', 'an', 'the', 'for', 'under', 'above', 'below', 'with', 'in', 'is', 'are', 'can', 'you', 'please', 'help', 'find', 'to', 'see', 'all', 'those', 'some', 'any', 'your', 'what', 'have', 'do', 'get', 'give'];
    const words = message.toLowerCase().split(/\s+/);
    const keywords = words.filter(w => !stopWords.includes(w) && w.length > 2);
    return keywords.join('|');
}

function isGeneralProductQuery(message) {
    const generalPhrases = [
        'all products', 'show products', 'see products', 'list products',
        'what products', 'available products', 'your products', 'any products',
        'show me products', 'show all', 'see all', 'list all',
        'what do you have', 'what do you sell', 'what are you selling',
        'furniture', 'catalog', 'collection', 'inventory', 'browse',
        'products available', 'all items', 'show items', 'see items'
    ];
    const lowerMessage = message.toLowerCase();
    return generalPhrases.some(phrase => lowerMessage.includes(phrase));
}


export const getOrCreateConversation = async (req, res) => {
    try {
        const userId = req.user?._id?.toString();
        const { sessionId } = req.body;

        let conversationId = null;
        let conversation = null;

        for (const [id, conv] of conversations.entries()) {
            if (userId && conv.userId === userId && conv.isActive) {
                conversationId = id;
                conversation = conv;
                break;
            } else if (!userId && sessionId && conv.sessionId === sessionId && conv.isActive) {
                conversationId = id;
                conversation = conv;
                break;
            }
        }

        if (!conversation) {
            conversationId = generateConversationId();
            conversation = {
                userId: userId || null,
                sessionId: userId ? null : (sessionId || generateSessionId()),
                messages: [],
                isActive: true,
                createdAt: new Date(),
                lastMessageAt: new Date()
            };
            conversations.set(conversationId, conversation);
        }

        res.json({
            success: true,
            data: {
                _id: conversationId,
                sessionId: conversation.sessionId,
                messages: conversation.messages,
                createdAt: conversation.createdAt
            }
        });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, message } = req.body;
        const userId = req.user?._id;

        if (!conversationId || !message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Conversation ID and message are required'
            });
        }

        const conversation = conversations.get(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found. Please start a new conversation.'
            });
        }

        conversation.messages.push({
            role: 'user',
            content: message.trim(),
            timestamp: new Date()
        });

        let contextData = {
            user: null,
            orders: null,
            cart: []
        };

        if (userId) {
            contextData.user = req.user;
            contextData.cart = req.user?.cart || [];

            contextData.orders = await Order.find({ user: userId })
                .sort('-createdAt')
                .limit(5)
                .select('orderNumber status paymentStatus totalAmount items createdAt');
        }

        let relevantProducts = [];

        if (isGeneralProductQuery(message)) {

            relevantProducts = await Product.find({ isActive: true })
                .sort('-averageRating -purchaseCount')
                .limit(10)
                .select('name price category stock averageRating totalReviews size images');
        } else {
            const productKeywords = extractKeywords(message);

            if (productKeywords) {
                relevantProducts = await Product.find({
                    $or: [
                        { name: { $regex: productKeywords, $options: 'i' } },
                        { category: { $regex: productKeywords, $options: 'i' } },
                        { description: { $regex: productKeywords, $options: 'i' } }
                    ],
                    isActive: true
                })
                    .limit(10)
                    .select('name price category stock averageRating totalReviews size images');
            }

            if (relevantProducts.length === 0) {
                const productRelatedWords = ['product', 'item', 'buy', 'purchase', 'price', 'cost', 'cheap', 'expensive', 'affordable'];
                const isProductRelated = productRelatedWords.some(word => message.toLowerCase().includes(word));

                if (isProductRelated) {
                    relevantProducts = await Product.find({ isActive: true })
                        .sort('-averageRating -purchaseCount')
                        .limit(5)
                        .select('name price category stock averageRating totalReviews size images');
                }
            }
        }


        const contextPrompt = buildContextPrompt(
            contextData.user,
            relevantProducts,
            contextData.orders,
            contextData.cart
        );

        const combinedSystemPrompt = `${SYSTEM_PROMPT}\n\n---\n\n${contextPrompt}`;
        const aiMessages = [
            { role: 'system', content: combinedSystemPrompt },
            ...conversation.messages.slice(-10).map(m => ({
                role: m.role,
                content: m.content
            }))
        ];


        const aiResponse = await chatCompletion(aiMessages);

        conversation.messages.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
        });

        conversation.lastMessageAt = new Date();

        console.log('✅ [CHAT] Response sent successfully');

        res.json({
            success: true,
            data: {
                message: aiResponse,
                products: relevantProducts,
                conversationId: conversationId,
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('[CHAT] Send message error:', error.message);
        console.error('[CHAT] Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'I apologize, but I encountered an error. Please try again in a moment.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getConversationHistory = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const conversation = conversations.get(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        res.json({
            success: true,
            data: {
                messages: conversation.messages,
                createdAt: conversation.createdAt,
                isActive: conversation.isActive
            }
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// End conversation
export const endConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const conversation = conversations.get(conversationId);

        if (conversation) {
            conversation.isActive = false;
        }

        res.json({
            success: true,
            message: 'Conversation ended successfully'
        });
    } catch (error) {
        console.error('End conversation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const cleanupOldConversations = () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    for (const [id, conv] of conversations.entries()) {
        if (conv.lastMessageAt < oneHourAgo) {
            conversations.delete(id);
        }
    }
};

export default {
    getOrCreateConversation,
    sendMessage,
    getConversationHistory,
    endConversation
};
