import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Award, Sparkles, Package, CreditCard, Clock, Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import Footer from '../components/layout/Footer';

const Home = () => {
    const { isSignedIn } = useAuth();
    const { user } = useSelector(state => state.auth);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Redirect based on role
    if (isSignedIn && user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
    }

    const features = [
        {
            icon: <Package className="text-primary" size={28} />,
            title: 'Premium Quality',
            desc: 'Handpicked furniture crafted with finest materials'
        },
        {
            icon: <Truck className="text-secondary" size={28} />,
            title: 'Free Delivery',
            desc: 'Complimentary shipping on orders above ₹10,000'
        },
        {
            icon: <Shield className="text-success" size={28} />,
            title: 'Secure Payment',
            desc: 'Safe & secure transactions with Stripe'
        },
        {
            icon: <Award className="text-warning" size={28} />,
            title: '2 Year Warranty',
            desc: 'Quality assured with comprehensive coverage'
        }
    ];

    const categories = [
        { name: 'Living Room', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', count: '150+' },
        { name: 'Bedroom', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500', count: '200+' },
        { name: 'Office', image: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=500', count: '100+' },
        { name: 'Dining', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500', count: '80+' }
    ];

    const stats = [
        { value: '5000+', label: 'Happy Customers' },
        { value: '10,000+', label: 'Products Sold' },
        { value: '4.9', label: 'Average Rating', icon: <Star size={20} fill="currentColor" /> },
        { value: '500+', label: 'Furniture Pieces' }
    ];

    return (
        <div className="min-h-screen bg-white mt-2">
            {/* Hero Section - Full screen with modern design */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50">

                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="text-center">
                        {/* Sparkle Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md mb-6 animate-[fadeIn_0.5s_ease-in]">
                            <Sparkles className="text-yellow-500" size={18} />
                            <span className="text-sm font-semibold text-gray-700">Premium Furniture Collection</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Transform Your
                            <br />
                            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Living Space</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Discover exquisite furniture that combines timeless elegance
                            with modern comfort. Crafted for homes that inspire.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 group">
                                Explore Collection
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                            <Link to="/location" className="inline-flex items-center gap-2 px-8 py-4 text-lg border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-purple-600 hover:text-purple-600 transition-all active:scale-95">
                                Visit Showroom
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center animate-[fadeIn_0.5s_ease-in]" style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className="flex items-center justify-center gap-1 text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                                        {stat.value}
                                        {stat.icon && <span className="text-yellow-400">{stat.icon}</span>}
                                    </div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full p-1">
                        <div className="w-1.5 h-3 bg-gray-400 rounded-full mx-auto"></div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Shop By Category
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            From living rooms to offices, find furniture for every space
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                to="/products"
                                className="group relative h-80 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-200">{category.count} Products</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Why Choose SK Furniture?
                        </h2>
                        <p className="text-lg text-gray-600">Experience luxury, quality, and exceptional service</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="text-center group"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-all group-hover:scale-110">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-white relative overflow-hidden border-t border-b border-gray-200">
                {/* Decorative circles */}
                <div className="absolute top-10 right-10 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Ready to Elevate Your Home?
                    </h2>
                    <p className="text-xl mb-8 text-gray-600">
                        Browse our exclusive collection and bring your dream interior to life
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl active:scale-95 rounded-lg group">
                            Start Shopping
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                        <Link to="/location" className="inline-flex items-center gap-2 px-8 py-4 text-lg border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold rounded-lg transition-all active:scale-95">
                            Visit Our Showroom
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default Home;
