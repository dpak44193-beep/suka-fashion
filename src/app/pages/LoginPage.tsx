import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { Button } from '../components/common/Button';
import { toast } from 'sonner';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  createDemoCustomerUser,
  isAdminEmail,
  isDemoCustomerEmail,
  verifyAdminCredentials,
  verifyDemoCustomerCredentials,
} from '../lib/auth';
import { DEMO_CUSTOMER } from '../config/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (isAdminEmail(email)) {
        if (verifyAdminCredentials(email, password)) {
          toast.info('Use the admin portal for store owner access', {
            action: {
              label: 'Admin login',
              onClick: () => navigate('/admin/login'),
            },
          });
          setLoading(false);
          navigate('/admin/login');
          return;
        }

        toast.error('This email is reserved for the store owner. Use the admin login page.');
        setLoading(false);
        return;
      }

      if (isDemoCustomerEmail(email)) {
        if (!verifyDemoCustomerCredentials(email, password)) {
          toast.error('Invalid demo account password');
          setLoading(false);
          return;
        }
        dispatch(loginSuccess(createDemoCustomerUser()));
        toast.success('Welcome, demo user!');
        setLoading(false);
        navigate('/');
        return;
      }

      toast.error('For demo access, sign in with the test customer account below.');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-light)] via-white to-[var(--background)] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <BrandLogo size="lg" className="mx-auto mb-3 object-center" />
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Welcome Back
            </h2>
            <p className="text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
              Customer sign in to continue shopping
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="username"
                  className="w-full pl-12 pr-4 py-3 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] transition-colors"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-3 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] transition-colors"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[var(--primary)]" />
                <span className="text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                  Remember me
                </span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[var(--primary)] hover:underline" style={{ fontFamily: 'var(--font-body)' }}>
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            className="w-full py-3 border-2 border-[var(--border)] rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
            <p className="font-semibold text-gray-800 mb-1">Demo customer (testing)</p>
            <p>Email: <span className="font-mono text-xs">{DEMO_CUSTOMER.email}</span></p>
            <p className="mt-1 text-xs text-gray-500">Use your demo password to access checkout, orders, and account.</p>
          </div>

          <p className="text-center mt-4 text-gray-600 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            Store owner?{' '}
            <Link to="/admin/login" className="text-[var(--primary)] font-semibold hover:underline">
              Admin login
            </Link>
          </p>

          <p className="text-center mt-3 text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-[var(--primary)] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

