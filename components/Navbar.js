import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, X, Home, Building, Phone } from 'lucide-react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const navigation = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Properties', href: '/properties', icon: Building },
        { name: 'Contact', href: '#contact', icon: Phone },
    ]

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-blue-600 text-white p-2 rounded-lg">
                            <Building className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">RealEstate</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${router.pathname === item.href
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}

                        <Link
                            href="/admin"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Admin
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${router.pathname === item.href
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}

                            <Link
                                href="/admin"
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <span>Admin</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}