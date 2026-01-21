import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Calendar } from 'lucide-react';

const PropertyCard = ({ property }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
                <img
                    src={property.images?.[0] || property.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                />
                {property.featured && (
                    <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                        Featured
                    </div>
                )}
                {property.images && property.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                        +{property.images.length - 1} more
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
                    <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.bathrooms} bath</span>
                    </div>
                    <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{property.area} sqft</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-primary-600">
                        {formatPrice(property.price)}
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            to={`/properties/${property.id}`}
                            className="btn-secondary text-sm"
                        >
                            View Details
                        </Link>
                        <Link
                            to={`/book-visit/${property.id}`}
                            className="btn-primary text-sm flex items-center"
                        >
                            <Calendar className="h-4 w-4 mr-1" />
                            Book Visit
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;