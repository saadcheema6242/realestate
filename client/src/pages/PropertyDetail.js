import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Calendar, ArrowLeft, Phone } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import ImageGallery from '../components/ImageGallery';
import { propertiesAPI } from '../utils/api';

const PropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await propertiesAPI.getById(id);
                setProperty(response.data);
            } catch (error) {
                setError('Property not found');
                console.error('Error fetching property:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const openWhatsApp = () => {
        const message = `Hi! I'm interested in the property: ${property.title} (${formatPrice(property.price)}). Can you provide more details?`;
        const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
                        <div className="bg-gray-300 h-96 rounded-lg mb-8"></div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </div>
                            <div className="bg-gray-300 h-64 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
                    <p className="text-gray-600 mb-8">The property you're looking for doesn't exist.</p>
                    <Link to="/properties" className="btn-primary">
                        Back to Properties
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link
                    to="/properties"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Properties
                </Link>

                {/* Property Images */}
                <div className="mb-8">
                    <ImageGallery
                        images={property.images || [property.image].filter(Boolean)}
                        title={property.title}
                    />
                    {property.featured && (
                        <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-md font-medium z-10">
                            Featured Property
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Property Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {property.title}
                            </h1>

                            <div className="flex items-center text-gray-600 mb-6">
                                <MapPin className="h-5 w-5 mr-2" />
                                <span className="text-lg">{property.location}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mb-6">
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <Bed className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                                    <div className="text-sm text-gray-600">Bedrooms</div>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <Bath className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                                    <div className="text-sm text-gray-600">Bathrooms</div>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <Square className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{property.area}</div>
                                    <div className="text-sm text-gray-600">Sq Ft</div>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {property.description}
                                </p>
                            </div>
                        </div>

                        {/* Additional Features */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Features</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Modern Kitchen</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Parking Available</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Air Conditioning</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Security System</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="mt-6">
                            <ContactForm
                                propertyId={property.id}
                                propertyTitle={property.title}
                            />
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <div className="text-3xl font-bold text-primary-600 mb-6">
                                {formatPrice(property.price)}
                            </div>

                            <div className="space-y-4 mb-6">
                                <Link
                                    to={`/book-visit/${property.id}`}
                                    className="w-full btn-primary flex items-center justify-center"
                                >
                                    <Calendar className="h-5 w-5 mr-2" />
                                    Book a Visit
                                </Link>

                                <button
                                    onClick={openWhatsApp}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <Phone className="h-5 w-5 mr-2" />
                                    WhatsApp Inquiry
                                </button>

                                <button
                                    onClick={() => {
                                        const chatButton = document.querySelector('[title="AI Assistant"]');
                                        if (chatButton) chatButton.click();
                                    }}
                                    className="w-full btn-secondary flex items-center justify-center"
                                >
                                    Ask AI Assistant
                                </button>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div>Phone: +1 (234) 567-8900</div>
                                    <div>Email: info@realestate-ai.com</div>
                                    <div>Available: 9 AM - 6 PM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;