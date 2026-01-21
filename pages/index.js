import { useState, useEffect } from 'react'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import PropertyCard from '../components/PropertyCard'
import ChatBot from '../components/ChatBot'
import ContactForm from '../components/ContactForm'
import { propertiesAPI } from '../utils/api'

export default function Home() {
    const [properties, setProperties] = useState([])
    const [featuredProperties, setFeaturedProperties] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProperties()
    }, [])

    const fetchProperties = async () => {
        try {
            const response = await propertiesAPI.getAll()
            setProperties(response.data)
            setFeaturedProperties(response.data.filter(p => p.featured))
        } catch (error) {
            console.error('Error fetching properties:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Head>
                <title>Real Estate Platform - Find Your Dream Home</title>
                <meta name="description" content="Discover amazing properties with our AI-powered real estate platform" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <Navbar />

                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl font-bold mb-6">Find Your Dream Home</h1>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Discover amazing properties with our AI-powered platform. Get personalized recommendations and expert assistance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                                Browse Properties
                            </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                                Talk to AI Assistant
                            </button>
                        </div>
                    </div>
                </section>

                {/* Featured Properties */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Featured Properties</h2>
                        {loading ? (
                            <div className="text-center">Loading properties...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredProperties.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
                            <ContactForm />
                        </div>
                    </div>
                </section>

                {/* ChatBot */}
                <ChatBot />
            </div>
        </>
    )
}