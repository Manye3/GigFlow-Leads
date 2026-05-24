import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';
import { Lead } from '../pages/Dashboard';
import { X } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type LeadForm = z.infer<typeof leadSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead: Lead | null;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSuccess, lead }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: 'New',
      source: 'Website',
    }
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      });
    } else {
      reset({
        name: '',
        email: '',
        status: 'New',
        source: 'Website',
      });
    }
  }, [lead, reset]);

  const onSubmit = async (data: LeadForm) => {
    try {
      if (lead) {
        await api.put(`/leads/${lead._id}`, data);
      } else {
        await api.post('/leads', data);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save lead');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
            <input
              type="text"
              {...register('name')}
              className={`mt-1 block w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white transition-colors`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              {...register('email')}
              className={`mt-1 block w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white transition-colors`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select
              {...register('status')}
              className={`mt-1 block w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border ${errors.status ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white transition-colors`}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Source</label>
            <select
              {...register('source')}
              className={`mt-1 block w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border ${errors.source ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white transition-colors`}
            >
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
            {errors.source && <p className="mt-1 text-sm text-red-500">{errors.source.message}</p>}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
