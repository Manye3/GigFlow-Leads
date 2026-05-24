import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserPlus, Moon, Sun } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Sales User']),
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Sales User',
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      const response = await api.post('/auth/register', data);
      login(response.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12">
      <div className="absolute top-4 right-4 cursor-pointer p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition" onClick={toggleTheme}>
        {theme === 'light' ? <Moon className="w-6 h-6 text-slate-800" /> : <Sun className="w-6 h-6 text-yellow-400" />}
      </div>
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden p-8 border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="mx-auto bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-primary-600 dark:text-primary-300" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Join GigFlow today</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              {...register('name')}
              className={`mt-1 block w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white transition-colors`}
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className={`mt-1 block w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white transition-colors`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              {...register('password')}
              className={`mt-1 block w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border ${errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white transition-colors`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
            <select
              {...register('role')}
              className={`mt-1 block w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border ${errors.role ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white transition-colors`}
            >
              <option value="Sales User">Sales User</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
