import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../components/AdminLayout'
import { useAuth } from '../../contexts/AuthContext'
import { dashboardAPI } from '../../utils/api'
import { Home, Users, Calendar, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [stats, setStats] = useState({
        totalProperties: 0,
        totalLeads: 0,
        totalBookings: 0,
        featuredProperties: 0
    })
    const [statsLoading, setStatsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login')
        } else if (user) {
            fetchStats()
        }
    }, [user, loading, router])

    const fetchStats = async () => {
        try {
            const response = await dashboardAPI.getStats()
            setStats(response.data)
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setStatsLoading(false)
        }
    }

    if (loading || !user) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Head>
                <title>Admin Dashboard - Real Estate Platform</title>
            </Head>

            <AdminLayout>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {statsLoading ? '...' : stats.totalProperties}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Home className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {statsLoading ? '...' : stats.totalLeads}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {statsLoading ? '...' : stats.totalBookings}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Calendar className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Featured Properties</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {statsLoading ? '...' : stats.featuredProperties}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <TrendingUp className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => router.push('/admin/properties')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left"
                        >
                            <h3 className="font-semibold text-gray-800">Manage Properties</h3>
                            <p className="text-sm text-gray-600 mt-1">Add, edit, or remove properties</p>
                        </button>

                        <button
                            onClick={() => router.push('/admin/leads')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left"
                        >
                            <h3 className="font-semibold text-gray-800">View Leads</h3>
                            <p className="text-sm text-gray-600 mt-1">Manage customer inquiries</p>
                        </button>

                        <button
                            onClick={() => router.push('/admin/bookings')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left"
                        >
                            <h3 className="font-semibold text-gray-800">View Bookings</h3>
                            <p className="text-sm text-gray-600 mt-1">Manage property visits</p>
                        </button>
                    </div>
                </div>
            </AdminLayout>
        </>
    )
}