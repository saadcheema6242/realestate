import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import BookVisit from './pages/BookVisit';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminBookings from './pages/admin/AdminBookings';
import AdminLeads from './pages/admin/AdminLeads';
import ChatBot from './components/ChatBot';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={
                            <>
                                <Navbar />
                                <Home />
                                <ChatBot />
                            </>
                        } />
                        <Route path="/properties" element={
                            <>
                                <Navbar />
                                <Properties />
                                <ChatBot />
                            </>
                        } />
                        <Route path="/properties/:id" element={
                            <>
                                <Navbar />
                                <PropertyDetail />
                                <ChatBot />
                            </>
                        } />
                        <Route path="/book-visit/:id" element={
                            <>
                                <Navbar />
                                <BookVisit />
                                <ChatBot />
                            </>
                        } />

                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/properties" element={
                            <ProtectedRoute>
                                <AdminProperties />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/bookings" element={
                            <ProtectedRoute>
                                <AdminBookings />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/leads" element={
                            <ProtectedRoute>
                                <AdminLeads />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;