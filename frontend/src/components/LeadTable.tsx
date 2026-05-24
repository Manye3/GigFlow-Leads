import React from 'react';
import { Lead } from '../pages/Dashboard';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Qualified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Lost: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const sourceColors = {
  Website: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Instagram: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  Referral: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
};

const LeadTable: React.FC<LeadTableProps> = ({ leads, loading, onEdit, onDelete }) => {
  const { user } = useAuth();
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden p-6 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 mb-4 items-center">
            <div className="w-1/4 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="w-1/4 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="w-1/6 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="w-1/6 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="w-1/6 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No leads found</h3>
        <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-900/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lead Info</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Source</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{lead.name}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceColors[lead.source]}`}>
                  {lead.source}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                {format(new Date(lead.createdAt), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-3">
                  <button onClick={() => onEdit(lead)} className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {user?.role === 'Admin' && (
                    <button onClick={() => onDelete(lead._id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
