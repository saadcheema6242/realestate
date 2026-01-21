import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import {
    Home,
    Building,
    Users,
    Calendar,
    Menu,
    X,
    LogOut,
    BarChart3
} from 'lucide-react'

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, logout } = useAuth()
    const router = useRouter()

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: BarChart3 },
        { name: 'Properties', href: '/admin/properties', icon: Building },
        { name: 'Leads', href: '/admin/leads', icon: Users },
        { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    ]

    const handleLogout = () => {
        logout()
        router.push('/admin/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="bg-blue-600 text-white p-2 rounded-lg">
                            <Building className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">Admin Panel</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="mt-8">
                    <div className="px-4 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const isActive = router.pathname === item.href

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <div className="px-4">
                            <Link
                                href="/"
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <Home className="h-5 w-5" />
                                <span>View Website</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* User info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.name || 'Admin'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Welcome back, {user?.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}