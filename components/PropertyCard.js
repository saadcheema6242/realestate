import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Bed, Bath, Square } from 'lucide-react'

export default function PropertyCard({ property }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
                <Image
                    src={property.images?.[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover"
                />
                {property.featured && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        Featured
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {property.title}
                </h3>

                <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{property.area} sq ft</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-blue-600">
                        ${property.price?.toLocaleString()}
                    </div>
                    <Link
                        href={`/properties/${property.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}