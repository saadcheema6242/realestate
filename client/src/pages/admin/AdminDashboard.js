import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Calendar, Users, TrendingUp, Eye, Plus } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { dashboardAPI, bookingsAPI, leadsAPI } from '../../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProperties: 0,
        totalLeads: 0,
        totalBookings: 0,
        featuredProperties: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [recentLeads, setRecentLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsResponse, bookingsResponse, leadsResponse] = await Promise.all([
                    dashboardAPI.getStats(),
                    bookingsAPI.getAll(),
                    leadsAPI.getAll()
                ]);

                setStats(statsResponse.data);
                setRecentBookings(bookingsResponse.data.slice(0, 5));
                setRecentLeads(leadsResponse.data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const StatCard = ({ title, value, icon: Icon, color, link }) => (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="text-lg font-medium text-gray-900">{value}</dd>
                        </dl>
                    </div>
                </div>
            </div>
            {link && (
                <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                        <Link to={link} className="font-medium text-primary-700 hover:text-primary-900">
                            View all
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <AdminLayout>
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white overflow-hidden shadow rounded-lg p-5">
                                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                                <div className="h-8 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="h-6 bg-gray-300 rounded mb-4"></div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-4 bg-gray-300 rounded"></div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="h-6 bg-gray-300 rounded mb-4"></div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-4 bg-gray-300 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome back! Here's what's happening with your real estate business.</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link to="/" className="btn-secondary flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            View Site
                        </Link>
                        <Link to="/admin/properties" className="btn-primary flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Property
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Properties"
                        value={stats.totalProperties}
                        icon={Building}
                        color="text-blue-600"
                        link="/admin/properties"
                    />
                    <StatCard
                        title="Total Bookings"
                        value={stats.totalBookings}
                        icon={Calendar}
                        color="text-green-600"
                        link="/admin/bookings"
                    />
                    <StatCard
                        title="Total Leads"
                        value={stats.totalLeads}
                        icon={Users}
                        color="text-purple-600"
                        link="/admin/leads"
                    />
                    <StatCard
                        title="Featured Properties"
                        value={stats.featuredProperties}
                        icon={TrendingUp}
                        color="text-orange-600"
                    />
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Bookings */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
                                <Link to="/admin/bookings" className="text-sm text-primary-600 hover:text-primary-700">
                                    View all
                                </Link>
                            </div>
                        </div>
                        <div className="px-6 py-4">
                            {recentBookings.length > 0 ? (
                                <div className="space-y-4">
                                    {recentBookings.map((booking) => (
                                        <div key={booking.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{booking.name}</p>
                                                <p className="text-sm text-gray-500">{booking.propertyTitle}</p>
                                                <p className="text-xs text-gray-400">
                                                    {formatDate(booking.date)} at {booking.time}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : booking.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No recent bookings</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Leads */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Recent Leads</h3>
                                <Link to="/admin/leads" className="text-sm text-primary-600 hover:text-primary-700">
                                    View all
                                </Link>
                            </div>
                        </div>
                        <div className="px-6 py-4">
                            {recentLeads.length > 0 ? (
                                <div className="space-y-4">
                                    {recentLeads.map((lead) => (
                                        <div key={lead.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {lead.name || 'Anonymous'}
                                                </p>
                                                <p className="text-sm text-gray-500">{lead.phone || lead.email}</p>
                                                <p className="text-xs text-gray-400">
                                                    From {lead.source} • {formatDate(lead.createdAt)}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.status === 'new'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : lead.status === 'contacted'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {lead.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No recent leads</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link
                            to="/admin/properties"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Building className="h-8 w-8 text-primary-600 mr-3" />
                            <div>
                                <p className="font-medium text-gray-900">Manage Properties</p>
                                <p className="text-sm text-gray-500">Add, edit, or delete properties</p>
                            </div>
                        </Link>

                        <Link
                            to="/admin/bookings"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Calendar className="h-8 w-8 text-green-600 mr-3" />
                            <div>
                                <p className="font-medium text-gray-900">View Bookings</p>
                                <p className="text-sm text-gray-500">Manage property visits</p>
                            </div>
                        </Link>

                        <Link
                            to="/admin/leads"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Users className="h-8 w-8 text-purple-600 mr-3" />
                            <div>
                                <p className="font-medium text-gray-900">Review Leads</p>
                                <p className="text-sm text-gray-500">Follow up with prospects</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;