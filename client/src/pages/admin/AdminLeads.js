import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Phone, Mail, Calendar } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { leadsAPI } from '../../utils/api';

const AdminLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sourceFilter, setSourceFilter] = useState('all');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await leadsAPI.getAll();
            setLeads(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-800';
            case 'contacted':
                return 'bg-yellow-100 text-yellow-800';
            case 'qualified':
                return 'bg-green-100 text-green-800';
            case 'converted':
                return 'bg-purple-100 text-purple-800';
            case 'lost':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getSourceIcon = (source) => {
        switch (source) {
            case 'chatbot':
                return <MessageCircle className="h-4 w-4" />;
            case 'website':
                return <Mail className="h-4 w-4" />;
            case 'whatsapp':
                return <Phone className="h-4 w-4" />;
            default:
                return <Users className="h-4 w-4" />;
        }
    };

    const getSourceColor = (source) => {
        switch (source) {
            case 'chatbot':
                return 'bg-blue-100 text-blue-800';
            case 'website':
                return 'bg-green-100 text-green-800';
            case 'whatsapp':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredLeads = leads.filter(lead => {
        const statusMatch = filter === 'all' || lead.status === filter;
        const sourceMatch = sourceFilter === 'all' || lead.source === sourceFilter;
        return statusMatch && sourceMatch;
    });

    const updateLeadStatus = async (leadId, newStatus) => {
        try {
            await leadsAPI.update(leadId, { status: newStatus });

            // Update local state after successful API call
            const updatedLeads = leads.map(lead =>
                lead.id === leadId ? { ...lead, status: newStatus, updatedAt: new Date().toISOString() } : lead
            );
            setLeads(updatedLeads);
        } catch (error) {
            console.error('Error updating lead status:', error);
            alert('Failed to update lead status. Please try again.');
        }
    };

    const uniqueSources = [...new Set(leads.map(lead => lead.source))];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                        <p className="text-gray-600">Manage and track your sales leads</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            className="input-field w-auto"
                        >
                            <option value="all">All Sources</option>
                            {uniqueSources.map(source => (
                                <option key={source} value={source}>
                                    {source.charAt(0).toUpperCase() + source.slice(1)}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="input-field w-auto"
                        >
                            <option value="all">All Status</option>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="converted">Converted</option>
                            <option value="lost">Lost</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
                        <div className="text-sm text-gray-600">Total Leads</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-2xl font-bold text-blue-600">
                            {leads.filter(l => l.status === 'new').length}
                        </div>
                        <div className="text-sm text-gray-600">New</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-2xl font-bold text-yellow-600">
                            {leads.filter(l => l.status === 'contacted').length}
                        </div>
                        <div className="text-sm text-gray-600">Contacted</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-2xl font-bold text-green-600">
                            {leads.filter(l => l.status === 'qualified').length}
                        </div>
                        <div className="text-sm text-gray-600">Qualified</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-2xl font-bold text-purple-600">
                            {leads.filter(l => l.status === 'converted').length}
                        </div>
                        <div className="text-sm text-gray-600">Converted</div>
                    </div>
                </div>

                {/* Leads List */}
                {loading ? (
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="px-6 py-4 animate-pulse">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                                        </div>
                                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : filteredLeads.length > 0 ? (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                Leads
                                <span className="ml-2 text-sm text-gray-500">({filteredLeads.length})</span>
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {filteredLeads.map((lead) => (
                                <div key={lead.id} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4 mb-2">
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="font-medium text-gray-900">
                                                        {lead.name || 'Anonymous Lead'}
                                                    </span>
                                                </div>

                                                {lead.email && (
                                                    <div className="flex items-center">
                                                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                                        <span className="text-sm text-gray-600">{lead.email}</span>
                                                    </div>
                                                )}

                                                {lead.phone && (
                                                    <div className="flex items-center">
                                                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                        <span className="text-sm text-gray-600">{lead.phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-4 mb-2">
                                                <div className="flex items-center">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                                                        {getSourceIcon(lead.source)}
                                                        <span className="ml-1">{lead.source}</span>
                                                    </span>
                                                </div>

                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-600">{formatDate(lead.createdAt)}</span>
                                                </div>
                                            </div>

                                            {lead.message && (
                                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded mt-2">
                                                    <strong>Message:</strong> {lead.message}
                                                </div>
                                            )}

                                            {lead.context && Object.keys(lead.context).length > 0 && (
                                                <div className="text-xs text-gray-500 mt-2">
                                                    <strong>Context:</strong> {JSON.stringify(lead.context, null, 2)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-3 ml-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                                                {lead.status}
                                            </span>

                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                            >
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="qualified">Qualified</option>
                                                <option value="converted">Converted</option>
                                                <option value="lost">Lost</option>
                                            </select>

                                            {lead.phone && (
                                                <a
                                                    href={`tel:${lead.phone}`}
                                                    className="p-2 text-green-600 hover:text-green-700 transition-colors"
                                                    title="Call Lead"
                                                >
                                                    <Phone className="h-4 w-4" />
                                                </a>
                                            )}

                                            {lead.email && (
                                                <a
                                                    href={`mailto:${lead.email}`}
                                                    className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                                                    title="Email Lead"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {filter === 'all' && sourceFilter === 'all'
                                ? 'No leads yet'
                                : 'No leads match your filters'
                            }
                        </h3>
                        <p className="text-gray-600">
                            {filter === 'all' && sourceFilter === 'all'
                                ? 'Leads will appear here when customers interact with your chatbot or website.'
                                : 'Try adjusting your filters to see more leads.'
                            }
                        </p>
                        {(filter !== 'all' || sourceFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setFilter('all');
                                    setSourceFilter('all');
                                }}
                                className="mt-4 btn-primary"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminLeads;