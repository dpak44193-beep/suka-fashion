import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import { Button } from '../../components/common/Button';
import { toast } from 'sonner';
import { BrandLogo } from '../../components/common/BrandLogo';
import { createAdminUser, verifyAdminCredentials } from '../../lib/auth';

export const AdminLoginPage: React.FC = () => {
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
      if (verifyAdminCredentials(email, password)) {
        dispatch(loginSuccess(createAdminUser(email)));
        toast.success('Welcome, Store Owner');
        setLoading(false);
        navigate('/admin');
        return;
      }

      toast.error('Invalid owner credentials');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--sidebar)] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <BrandLogo size="lg" className="mx-auto mb-3 object-center" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary-foreground)] text-sm font-semibold mb-3">
              <Shield className="w-4 h-4" />
              Owner Admin Portal
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Admin Sign In
            </h2>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
              Store owner access only. Customers should use the{' '}
              <Link to="/login" className="text-[var(--primary)] font-semibold hover:underline">
                customer login
              </Link>
              .
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Owner Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dpak44193@gmail.com"
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

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Sign In as Admin
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
            <Link to="/" className="text-[var(--primary)] hover:underline">
              ← Back to store
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

