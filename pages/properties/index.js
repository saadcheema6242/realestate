import { useState, useEffect } from 'react'
import Head from 'next/head'
import Navbar from '../../components/Navbar'
import PropertyCard from '../../components/PropertyCard'
import { propertiesAPI } from '../../utils/api'
import { Search, Filter } from 'lucide-react'

export default function Properties() {
    const [properties, setProperties] = useState([])
    const [filteredProperties, setFilteredProperties] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        location: ''
    })

    useEffect(() => {
        fetchProperties()
    }, [])

    useEffect(() => {
        filterProperties()
    }, [properties, searchTerm, filters])

    const fetchProperties = async () => {
        try {
            const response = await propertiesAPI.getAll()
            setProperties(response.data)
        } catch (error) {
            console.error('Error fetching properties:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterProperties = () => {
        let filtered = properties

        if (searchTerm) {
            filtered = filtered.filter(property =>
                property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.location.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (filters.minPrice) {
            filtered = filtered.filter(property => property.price >= parseInt(filters.minPrice))
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(property => property.price <= parseInt(filters.maxPrice))
        }

        if (filters.bedrooms) {
            filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms))
        }

        if (filters.location) {
            filtered = filtered.filter(property =>
                property.location.toLowerCase().includes(filters.location.toLowerCase())
            )
        }

        setFilteredProperties(filtered)
    }

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    return (
        <>
            <Head>
                <title>Properties - Real Estate Platform</title>
                <meta name="description" content="Browse all available properties" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">All Properties</h1>

                    {/* Search and Filters */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search properties..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <input
                                type="number"
                                placeholder="Min Price"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder="Max Price"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            />

                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.bedrooms}
                                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                            >
                                <option value="">Any Bedrooms</option>
                                <option value="1">1+ Bedrooms</option>
                                <option value="2">2+ Bedrooms</option>
                                <option value="3">3+ Bedrooms</option>
                                <option value="4">4+ Bedrooms</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Location"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Properties Grid */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading properties...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <p className="text-gray-600">
                                    Showing {filteredProperties.length} of {properties.length} properties
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProperties.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>

                            {filteredProperties.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-600">No properties found matching your criteria.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}