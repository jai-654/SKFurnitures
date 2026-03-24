import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, calculateTotals } from '../../store/slices/cartSlice';
import { Plus, Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { items } = useSelector(state => state.cart);
    const inCart = items.find(i => i.productId === product._id);
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.stock === 0) {
            toast.error('Product is out of stock');
            return;
        }

        const cartItem = {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0],
            quantity: 1
        };

        dispatch(addToCart(cartItem));
        dispatch(calculateTotals());
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <Link
            to={`/products/${product._id}`}
            className="block group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                {/* Image Container */}
                <div className="relative h-64 -mx-6 -mt-6 mb-4 overflow-hidden bg-gray-100">
                    <img
                        src={product.images?.[0] || 'https://placehold.co/400x300?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Stock Badge */}
                    {product.stock < 10 && product.stock > 0 && (
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 animate-pulse">
                            Only {product.stock} left
                        </div>
                    )}

                    {product.stock === 0 && (
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Out of Stock
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                        {product.category}
                    </div>

                    {/* Hover Actions */}
                        <div
                            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:scale-110 cursor-pointer"
                            title="View Details"
                        >
                            <Eye size={20} className="text-gray-700" />
                        </div>
                    </div>

                    {/* In Cart Indicator */}
                    {inCart && (
                        <div className="absolute bottom-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <ShoppingCart size={14} />
                            In Cart ({inCart.quantity})
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-gray-700 transition">
                        {product.name}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Rating */}
                    {product.averageRating > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={i < Math.floor(product.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                                {product.averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                                ({product.totalReviews || 0})
                            </span>
                        </div>
                    )}

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                ₹{product.price.toLocaleString()}
                            </p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`
                                inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95
                                ${inCart ? '!bg-green-600 hover:!bg-green-600' : ''}
                                ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            title={product.stock === 0 ? 'Out of Stock' : inCart ? 'Add More' : 'Add to Cart'}
                        >
                            <Plus size={16} />
                            {product.stock === 0 ? 'Sold Out' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
