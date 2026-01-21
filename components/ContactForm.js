import { useState } from 'react'
import { leadsAPI } from '../utils/api'
import { Mail, Phone, User, MessageSquare } from 'lucide-react'

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await leadsAPI.create({
                ...formData,
                source: 'contact_form'
            })

            setSuccess(true)
            setFormData({ name: '', email: '', phone: '', message: '' })

            setTimeout(() => setSuccess(false), 5000)
        } catch (error) {
            setError('Failed to send message. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-green-600 mb-2">
                    <MessageSquare className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-700">
                    Thank you for your inquiry. We'll get back to you within 24 hours.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Your full name"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="your@email.com"
                        />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about your property requirements..."
                    ></textarea>
                </div>
            </div>

            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="mt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Sending...' : 'Send Message'}
                </button>
            </div>
        </form>
    )
}