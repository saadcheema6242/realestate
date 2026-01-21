import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import ImageGallery from '../../components/ImageGallery'
import { propertiesAPI } from '../../utils/api'
import { MapPin, Bed, Bath, Square, Calendar } from 'lucide-react'

export default function PropertyDetail() {
    const router = useRouter()
    const { id } = router.query
    const [property, setProperty] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showBookingForm, setShowBookingForm] = useState(false)

    useEffect(() => {
        if (id) {
            fetchProperty()
        }
    }, [id])

    const fetchProperty = async () => {
        try {
            const response = await propertiesAPI.getById(id)
            setProperty(response.data)
        } catch (error) {
            console.error('Error fetching property:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
                        <div className="h-8 bg-gray-300 rounded mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h1>
                        <button
                            onClick={() => router.push('/properties')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Back to Properties
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{property.title} - Real Estate Platform</title>
                <meta name="description" content={property.description} />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="container mx-auto px-4 py-8">
                    {/* Property Images */}
                    <div className="mb-8">
                        <ImageGallery images={property.images} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Property Details */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h1 className="text-3xl font-bold text-gray-800 mb-4">{property.title}</h1>

                                <div className="flex items-center text-gray-600 mb-4">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    <span>{property.location}</span>
                                </div>

                                <div className="flex items-center space-x-6 mb-6">
                                    <div className="flex items-center">
                                        <Bed className="h-5 w-5 mr-2 text-gray-500" />
                                        <span>{property.bedrooms} Bedrooms</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Bath className="h-5 w-5 mr-2 text-gray-500" />
                                        <span>{property.bathrooms} Bathrooms</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Square className="h-5 w-5 mr-2 text-gray-500" />
                                        <span>{property.area} sq ft</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold mb-3">Features</h2>
                                    <ul className="grid grid-cols-2 gap-2 text-gray-700">
                                        <li>• Modern Kitchen</li>
                                        <li>• Parking Space</li>
                                        <li>• Garden/Balcony</li>
                                        <li>• Security System</li>
                                        <li>• Air Conditioning</li>
                                        <li>• High Speed Internet</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Booking Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                <div className="text-center mb-6">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">
                                        ${property.price?.toLocaleString()}
                                    </div>
                                    <div className="text-gray-600">Total Price</div>
                                </div>

                                <button
                                    onClick={() => setShowBookingForm(!showBookingForm)}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-4"
                                >
                                    <Calendar className="inline h-5 w-5 mr-2" />
                                    Book a Visit
                                </button>

                                {showBookingForm && (
                                    <div className="border-t pt-4">
                                        <form className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            <input
                                                type="date"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            <textarea
                                                placeholder="Message (optional)"
                                                rows="3"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            ></textarea>
                                            <button
                                                type="submit"
                                                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                                            >
                                                Submit Booking Request
                                            </button>
                                        </form>
                                    </div>
                                )}

                                <div className="mt-6 pt-6 border-t">
                                    <h3 className="font-semibold mb-3">Contact Agent</h3>
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p>📞 +92 300 1234567</p>
                                        <p>✉️ agent@realestate.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}