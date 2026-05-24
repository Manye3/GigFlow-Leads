import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';
import LeadTable from '../components/LeadTable';
import LeadModal from '../components/LeadModal';
import { LogOut, Moon, Sun, Plus, Download, Search } from 'lucide-react';
import { format } from 'date-fns';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortOption, setSortOption] = useState('latest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/leads', {
        params: {
          page,
          limit: 10,
          search: debouncedSearchTerm,
          status: statusFilter,
          source: sourceFilter,
          sort: sortOption,
        },
      });
      setLeads(data.leads);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearchTerm, statusFilter, sourceFilter, sortOption]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setPage(1); // Reset to page 1 on filter change
  }, [debouncedSearchTerm, statusFilter, sourceFilter, sortOption]);

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/leads/export/csv', {
        params: {
          search: debouncedSearchTerm,
          status: statusFilter,
          source: sourceFilter,
          sort: sortOption,
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const openCreateModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <span className="font-bold text-xl leading-none">GF</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">GigFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:block">
              {user?.name} ({user?.role})
            </span>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={logout} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Leads Management</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and track your potential clients</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={openCreateModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary-600 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-primary-700 transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Lead
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-1 md:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <LeadTable
          leads={leads}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} leads
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm disabled:opacity-50 text-slate-700 dark:text-slate-200"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm disabled:opacity-50 text-slate-700 dark:text-slate-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <LeadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchLeads}
          lead={editingLead}
        />
      )}
    </div>
  );
};

export default Dashboard;
