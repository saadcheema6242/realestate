import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, MapPin, Eye } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { bookingsAPI } from '../../utils/api';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingsAPI.getAll();
            setBookings(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        return booking.status === filter;
    });

    const updateBookingStatus = async (bookingId, newStatus) => {
        try {
            await bookingsAPI.update(bookingId, { status: newStatus });

            // Update local state after successful API call
            const updatedBookings = bookings.map(booking =>
                booking.id === bookingId ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() } : booking
            );
            setBookings(updatedBookings);
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update booking status. Please try again.');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                        <p className="text-gray-600">Manage property visit bookings</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="input-field w-auto"
                        >
                            <option value="all">All Bookings</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
                        <div className="text-sm text-gray-600">Total Bookings</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-2xl font-bold text-yellow-600">
                            {bookings.filter(b => b.status === 'pending').length}
                        </div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-2xl font-bold text-green-600">
                            {bookings.filter(b => b.status === 'confirmed').length}
                        </div>
                        <div className="text-sm text-gray-600">Confirmed</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-2xl font-bold text-blue-600">
                            {bookings.filter(b => b.status === 'completed').length}
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                    </div>
                </div>

                {/* Bookings List */}
                {loading ? (
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="px-6 py-4 animate-pulse">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                                        </div>
                                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                {filter === 'all' ? 'All Bookings' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Bookings`}
                                <span className="ml-2 text-sm text-gray-500">({filteredBookings.length})</span>
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {filteredBookings.map((booking) => (
                                <div key={booking.id} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4 mb-2">
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="font-medium text-gray-900">{booking.name}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-600">{booking.email}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-600">{booking.phone}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4 mb-2">
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-600">{booking.propertyTitle}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-600">{formatDate(booking.date)}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-600">{formatTime(booking.time)}</span>
                                                </div>
                                            </div>

                                            {booking.message && (
                                                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2">
                                                    <strong>Message:</strong> {booking.message}
                                                </div>
                                            )}

                                            <div className="text-xs text-gray-400 mt-2">
                                                Booked on {formatDate(booking.createdAt)}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>

                                            <div className="flex items-center space-x-1">
                                                <button
                                                    onClick={() => window.open(`/properties/${booking.propertyId}`, '_blank')}
                                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    title="View Property"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>

                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
                        </h3>
                        <p className="text-gray-600">
                            {filter === 'all'
                                ? 'Bookings will appear here when customers schedule property visits.'
                                : `No bookings with ${filter} status found.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminBookings;