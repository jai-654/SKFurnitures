import { Product, Review } from '../models/index.js';

export const getAllProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, size, search, sort = '-createdAt', page = 1, limit = 12 } = req.query;

        const filter = { isActive: true };

        if (category) filter.category = category;
        if (size) filter.size = size;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const products = await Product.find(filter)
            .sort(sort)
            .limit(Number(limit))
            .skip(skip);

        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            data: products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const reviews = await Review.find({ product: req.params.id })
            .populate('user', 'name profileImage')
            .sort('-createdAt')
            .limit(10);

        res.json({
            success: true,
            data: { ...product.toObject(), reviews }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, size } = req.body;


        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => file.path);
        }

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock) || 0,
            size,
            images: imageUrls
        };

        const product = await Product.create(productData);

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, size } = req.body;

        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        let imageUrls = existingProduct.images || [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => file.path);
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price: Number(price),
                category,
                stock: Number(stock),
                size,
                images: imageUrls
            },
            { new: true, runValidators: true }
        );

        res.json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await Review.deleteMany({ product: req.params.id });

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
