import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import ContactForm from '../components/ContactForm';
import { propertiesAPI } from '../utils/api';

const Home = () => {
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProperties = async () => {
            try {
                const response = await propertiesAPI.getAll();
                const featured = response.data.filter(property => property.featured).slice(0, 3);
                setFeaturedProperties(featured);
            } catch (error) {
                console.error('Error fetching featured properties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProperties();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div
                    className="relative bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200)',
                        backgroundBlendMode: 'overlay'
                    }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                Find Your Dream Home with AI
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                                Discover the perfect property with our AI-powered real estate assistant.
                                Get instant property recommendations and book visits seamlessly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/properties"
                                    className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <Search className="h-5 w-5 mr-2" />
                                    Browse Properties
                                </Link>
                                <button
                                    onClick={() => {
                                        const chatButton = document.querySelector('[title="AI Assistant"]');
                                        if (chatButton) chatButton.click();
                                    }}
                                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                                >
                                    Chat with AI Assistant
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Why Choose Our AI Real Estate Platform?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Experience the future of property hunting with our intelligent features
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">AI-Powered Search</h3>
                            <p className="text-gray-600">
                                Our AI understands your preferences and finds properties that match your exact needs
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="h-8 w-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Instant Property Info</h3>
                            <p className="text-gray-600">
                                Get detailed property information, pricing, and availability in real-time
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="h-8 w-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                            <p className="text-gray-600">
                                Schedule property visits with just a few clicks through our seamless booking system
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Properties Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Featured Properties
                            </h2>
                            <p className="text-lg text-gray-600">
                                Discover our handpicked premium properties
                            </p>
                        </div>
                        <Link
                            to="/properties"
                            className="btn-primary flex items-center"
                        >
                            View All Properties
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="card animate-pulse">
                                    <div className="bg-gray-300 h-48 w-full"></div>
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
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Ready to Find Your Dream Property?
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Get personalized property recommendations from our real estate experts.
                                Fill out the form and we'll contact you within 24 hours with properties
                                that match your requirements.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Free property consultation</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Personalized recommendations</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Expert market insights</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">No obligation, completely free</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Find Your Perfect Home?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Start your property search today with our AI assistant and discover amazing properties tailored to your needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/properties"
                            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                        >
                            Start Searching
                        </Link>
                        <button
                            onClick={() => {
                                const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent("Hi! I'm interested in your real estate properties. Can you help me?")}`;
                                window.open(whatsappUrl, '_blank');
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                        >
                            Chat on WhatsApp
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;