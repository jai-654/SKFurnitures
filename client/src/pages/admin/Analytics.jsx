import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { BarChart, TrendingUp, Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [ordersRes, productsRes] = await Promise.all([
                api.get('/admin/orders'),
                api.get('/products')
            ]);
            setOrders(ordersRes.data.data || []);
            setProducts(productsRes.data.data || []);
        } catch (err) {
            toast.error('Failed to fetch analytics data');
        }
        setLoading(false);
    };

    // Calculate statistics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Order Status Distribution
    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});

    const orderStatusData = {
        labels: Object.keys(statusCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [{
            label: 'Orders by Status',
            data: Object.values(statusCounts),
            backgroundColor: [
                'rgba(251, 191, 36, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(99, 102, 241, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
                'rgb(251, 191, 36)',
                'rgb(59, 130, 246)',
                'rgb(168, 85, 247)',
                'rgb(99, 102, 241)',
                'rgb(34, 197, 94)',
                'rgb(239, 68, 68)',
            ],
            borderWidth: 2,
        }]
    };

    // Monthly Sales Trend (Last 6 months)
    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return date.toLocaleString('default', { month: 'short' });
    });

    const monthlySales = last6Months.map((month) => {
    return orders
        .filter(order => {
            const orderMonth = new Date(order.createdAt)
                .toLocaleString('default', { month: 'short' });
            return orderMonth === month;
        })
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
});

    const salesTrendData = {
        labels: last6Months,
        datasets: [{
            label: 'Revenue (₹)',
            data: monthlySales,
            fill: true,
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            borderColor: 'rgb(147, 51, 234)',
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: 'rgb(147, 51, 234)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
        }]
    };

    // Category-wise Product Distribution
    const categoryCounts = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {});

    const categoryData = {
        labels: Object.keys(categoryCounts),
        datasets: [{
            label: 'Products by Category',
            data: Object.values(categoryCounts),
            backgroundColor: [
                'rgba(168, 85, 247, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(251, 191, 36, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(99, 102, 241, 0.8)',
            ],
            borderWidth: 0,
        }]
    };

    // Top Selling Products (by order count - demo data)
    const topProducts = products.slice(0, 5).map(p => p.name);
    const topProductsSales = products.slice(0, 5).map(() => Math.floor(Math.random() * 50) + 10);

    const topProductsData = {
        labels: topProducts,
        datasets: [{
            label: 'Units Sold',
            data: topProductsSales,
            backgroundColor: 'rgba(147, 51, 234, 0.8)',
            borderColor: 'rgb(147, 51, 234)',
            borderWidth: 1,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            },
        },
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart className="text-purple-600" size={36} />
                        <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Sales <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">Analytics</span>
                        </h1>
                    </div>
                    <p className="text-gray-600">Comprehensive insights into your business performance</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                            </div>
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                <Package className="text-pink-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Avg. Order Value</p>
                                <p className="text-2xl font-bold text-gray-900">₹{Math.round(avgOrderValue).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Trend Chart */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend (Last 3 Months)</h3>
                        <div className="h-80">
                            <Line data={salesTrendData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Order Status Pie Chart */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status Distribution</h3>
                        <div className="h-80">
                            <Pie data={orderStatusData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Top Products Bar Chart */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Top 5 Products</h3>
                        <div className="h-80">
                            <Bar data={topProductsData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Category Distribution Doughnut */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Products by Category</h3>
                        <div className="h-80">
                            <Doughnut data={categoryData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
