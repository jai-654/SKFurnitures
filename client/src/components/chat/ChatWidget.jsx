import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, ShoppingBag } from 'lucide-react';
import { sendChatMessage, createConversation } from '../../services/chatService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Generate or retrieve session ID for guest users
        let sid = localStorage.getItem('chat_session_id');
        if (!sid) {
            sid = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
            localStorage.setItem('chat_session_id', sid);
        }
        setSessionId(sid);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleOpenChat = async () => {
        setIsOpen(true);

        if (!conversationId) {
            try {
                const response = await createConversation(sessionId);
                setConversationId(response.data._id);

                // Add welcome message
                setMessages([
                    {
                        role: 'assistant',
                        content: 'Hello! I\'m SK Assistant, your personal furniture shopping helper. 😊\n\nHow can I assist you today? I can help you:\n• Find the perfect furniture\n• Track your orders\n• Answer product questions\n• Guide you through checkout',
                        timestamp: new Date()
                    }
                ]);
            } catch (error) {
                toast.error('Failed to start conversation');
            }
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim()) return;

        const userMessage = {
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(conversationId, inputMessage);

            const assistantMessage = {
                role: 'assistant',
                content: response.data.message,
                timestamp: new Date(),
                products: response.data.products
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            toast.error('Failed to send message');

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again in a moment.',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={handleOpenChat}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 hover:scale-110"
                aria-label="Open chat"
            >
                <MessageCircle size={28} />
            </button>
        );
    }

    return (
        <div
            className={`fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all ${isMinimized ? 'h-16' : 'h-[600px]'
                }`}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold">SK Assistant</h3>
                        <p className="text-xs opacity-90">Online • AI-Powered</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="hover:bg-white/20 p-2 rounded-lg transition"
                        aria-label="Minimize chat"
                    >
                        <Minimize2 size={18} />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="hover:bg-white/20 p-2 rounded-lg transition"
                        aria-label="Close chat"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                        : 'bg-white text-gray-900 shadow-sm border border-gray-100'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                    {/* Show products if available */}
                                    {msg.products && msg.products.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                                <ShoppingBag size={12} />
                                                <span>Product Recommendations:</span>
                                            </div>
                                            {msg.products.map(product => (
                                                <button
                                                    key={product._id}
                                                    onClick={() => handleProductClick(product._id)}
                                                    className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 p-3 rounded-lg shadow-sm transition-all text-left border border-purple-200"
                                                >
                                                    <div className="flex gap-2">
                                                        {product.images?.[0] && (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="text-xs font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                                                            <p className="text-xs text-purple-600 font-bold">₹{product.price.toLocaleString()}</p>
                                                            {product.averageRating > 0 && (
                                                                <p className="text-xs text-gray-500">⭐ {product.averageRating}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-xs opacity-70 mt-2">
                                        {new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputMessage.trim()}
                                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Send message"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default ChatWidget;
