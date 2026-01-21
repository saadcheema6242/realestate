import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Star, MapPin } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';
import { propertiesAPI } from '../../utils/api';

const AdminProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        images: [],
        description: '',
        featured: false
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await propertiesAPI.getAll();
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const propertyData = {
                ...formData,
                price: parseInt(formData.price),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseInt(formData.bathrooms),
                area: parseInt(formData.area)
            };

            if (editingProperty) {
                await propertiesAPI.update(editingProperty.id, propertyData);
            } else {
                await propertiesAPI.create(propertyData);
            }

            await fetchProperties();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving property:', error);
            alert('Failed to save property. Please try again.');
        }
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        setFormData({
            title: property.title,
            price: property.price.toString(),
            location: property.location,
            bedrooms: property.bedrooms.toString(),
            bathrooms: property.bathrooms.toString(),
            area: property.area.toString(),
            images: property.images || [property.image].filter(Boolean),
            description: property.description,
            featured: property.featured
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await propertiesAPI.delete(id);
                await fetchProperties();
            } catch (error) {
                console.error('Error deleting property:', error);
                alert('Failed to delete property. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            price: '',
            location: '',
            bedrooms: '',
            bathrooms: '',
            area: '',
            images: [],
            description: '',
            featured: false
        });
        setEditingProperty(null);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
                        <p className="text-gray-600">Manage your property listings</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="btn-primary flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Property
                    </button>
                </div>

                {/* Properties Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                                <div className="bg-gray-300 h-48 w-full rounded-t-lg"></div>
                                <div className="p-4">
                                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                                    <div className="flex justify-between">
                                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property) => (
                            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="relative">
                                    <img
                                        src={property.images?.[0] || property.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                                        alt={property.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    {property.featured && (
                                        <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                                            <Star className="h-3 w-3 mr-1" />
                                            Featured
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {property.title}
                                    </h3>

                                    <div className="flex items-center text-gray-600 mb-2">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span className="text-sm">{property.location}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                        <span>{property.bedrooms} bed</span>
                                        <span>{property.bathrooms} bath</span>
                                        <span>{property.area} sqft</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-xl font-bold text-primary-600">
                                            {formatPrice(property.price)}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => window.open(`/properties/${property.id}`, '_blank')}
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                title="View Property"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(property)}
                                                className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                                                title="Edit Property"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(property.id)}
                                                className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                                title="Delete Property"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {properties.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                        <p className="text-gray-600 mb-4">Get started by adding your first property listing.</p>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="btn-primary"
                        >
                            Add Property
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingProperty ? 'Edit Property' : 'Add New Property'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            className="input-field"
                                            placeholder="Property title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price ($) *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            className="input-field"
                                            placeholder="85000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                        className="input-field"
                                        placeholder="E-11, Islamabad"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bedrooms *
                                        </label>
                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={formData.bedrooms}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bathrooms *
                                        </label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={formData.bathrooms}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Area (sqft) *
                                        </label>
                                        <input
                                            type="number"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <ImageUpload
                                    images={formData.images}
                                    onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                                    maxImages={10}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className="input-field"
                                        placeholder="Property description..."
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">
                                        Featured Property
                                    </label>
                                </div>

                                <div className="flex items-center justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                    >
                                        {editingProperty ? 'Update Property' : 'Add Property'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProperties;