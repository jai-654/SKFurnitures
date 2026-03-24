import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import MapEmbed from '../common/MapEmbed';

const Footer = () => {
    return (
        <footer className="relative bg-white mt-10 text-gray-800 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
            </div>

            {/* Main Footer Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* About Section */}
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-gray-900 text-2xl font-bold mb-3">
                                About Us
                            </h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4"></div>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Transform your living space with exquisite furniture that combines timeless elegance with modern comfort. Crafted for homes that inspire.
                        </p>
                        <div>
                            <p className="text-sm text-gray-700 mb-3 font-semibold">Follow Us</p>
                            <div className="flex gap-3">
                                <a href="#" className="group w-10 h-10 rounded-lg bg-gray-100 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                                    <Facebook size={18} className="text-gray-700 group-hover:text-white group-hover:scale-110 transition-all" />
                                </a>
                                <a href="#" className="group w-10 h-10 rounded-lg bg-gray-100 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                                    <Instagram size={18} className="text-gray-700 group-hover:text-white group-hover:scale-110 transition-all" />
                                </a>
                                <a href="#" className="group w-10 h-10 rounded-lg bg-gray-100 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                                    <Twitter size={18} className="text-gray-700 group-hover:text-white group-hover:scale-110 transition-all" />
                                </a>
                                <a href="#" className="group w-10 h-10 rounded-lg bg-gray-100 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                                    <Linkedin size={18} className="text-gray-700 group-hover:text-white group-hover:scale-110 transition-all" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-gray-900 text-2xl font-bold mb-3">
                                Quick Links
                            </h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4"></div>
                        </div>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="group inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all duration-300">
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="group inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all duration-300">
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    <span>Collection</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="group inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all duration-300">
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    <span>Cart</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="group inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all duration-300">
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    <span>My Orders</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-gray-900 text-2xl font-bold mb-3">
                                Contact Us
                            </h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4"></div>
                        </div>
                        <ul className="space-y-4">
                            <li className="group">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <MapPin size={18} className="text-white" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-gray-900 font-semibold">SK Furniture</p>
                                        <p className="text-gray-600">Erode, Tamil Nadu</p>
                                        <p className="text-gray-600">India - 638001</p>
                                    </div>
                                </div>
                            </li>
                            <li className="group">
                                <a href="tel:+919876543210" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <Phone size={18} className="text-white" />
                                    </div>
                                    <span className="text-gray-900 hover:text-purple-600 transition-colors font-semibold text-sm">
                                        +91 97505 67100
                                    </span>
                                </a>
                            </li>
                            <li className="group">
                                <a href="mailto:skfurniture2024@gmail.com" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <Mail size={18} className="text-white" />
                                    </div>
                                    <span className="text-gray-900 hover:text-purple-600 transition-colors font-semibold text-sm break-all">
                                        skfurniture2024@gmail.com
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Business Hours */}
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-gray-900 text-2xl font-bold mb-3">
                                Business Hours
                            </h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4"></div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <Clock size={18} className="text-white" />
                                </div>
                                <span className="font-semibold text-gray-900 text-sm">Opening Times</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Mon - Fri</span>
                                    <span className="font-semibold text-gray-900">9 AM - 8 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Sat - Sun</span>
                                    <span className="font-semibold text-gray-900">10 AM - 6 PM</span>
                                </div>
                                <div className="pt-3 mt-3 border-t border-gray-200">
                                    <span className="inline-flex items-center gap-2 text-green-600 font-semibold text-xs bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        Currently Open
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map - Right Side */}
                    <div className="space-y-5 lg:col-span-1">
                        <div>
                            <h3 className="text-gray-900 text-2xl font-bold mb-3">
                                Find Us
                            </h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4"></div>
                        </div>
                        <div className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>
                            <MapEmbed />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar with Gradient Border */}
            <div className="relative border-t border-gray-200 bg-gray-50">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-gray-600 text-sm">
                                © {new Date().getFullYear()} <span className="font-semibold text-gray-900">SK Furniture</span>. All rights reserved.
                            </p>
                            <p className="text-gray-500 text-xs mt-1">Crafting dreams into reality</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                            <Link to="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300 relative group">
                                Privacy Policy
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <span className="text-gray-400">•</span>
                            <Link to="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300 relative group">
                                Terms of Service
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <span className="text-gray-400">•</span>
                            <Link to="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300 relative group">
                                Return Policy
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
