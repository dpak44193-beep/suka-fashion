// AdminLogin page — /admin/login (Luxury Light Theme Portal)
import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import AuthFashionPanel from '../../components/auth/AuthFashionPanel';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('aditi@sukafashions.com');
  const [password, setPassword] = useState('admin123');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password, remember);
    setLoading(false);
    if (result.success) {
      navigate('/admin');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-b from-brand-cream/30 via-white to-brand-powderLight/20 py-2.5 sm:py-6 px-3 sm:px-6 lg:px-10 flex-1 flex flex-col items-center justify-center min-h-screen select-none">
      <div className="w-full max-w-[460px] md:max-w-[1100px] mx-auto flex items-center justify-between mb-2.5 sm:mb-4">
        <Link to="/" className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-brand-powder/80 text-brand-navy hover:text-brand-teal hover:border-brand-teal text-[11px] sm:text-xs font-sans font-semibold shadow-2xs transition-all">
          <ArrowRight size={13} className="rotate-180" />
          <span>Customer Store</span>
        </Link>
        <span className="font-serif text-sm sm:text-base font-semibold text-brand-navy tracking-wider">
          Suka <span className="text-brand-teal font-normal">Fashions</span>
        </span>
      </div>

      <div className="hidden sm:block text-center max-w-2xl mx-auto mb-5">
        <span className="font-sans text-[9.5px] tracking-[0.35em] text-brand-teal uppercase font-extrabold bg-brand-powderLight/80 border border-brand-powder/60 px-4 py-1.5 rounded-full inline-block mb-2 shadow-2xs">
          SUKA FASHIONS ADMIN PORTAL
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-brand-navy font-light tracking-wide">
          Welcome to Store Operations
        </h1>
        <p className="font-sans text-xs text-brand-navy/60 font-light mt-1 tracking-wide">
          Sign in to manage products, orders, customers, and storefront content.
        </p>
      </div>

      <div className="max-w-[460px] md:max-w-[1100px] w-full mx-auto bg-white border border-brand-powder/60 rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,107,112,0.12)] flex flex-col md:flex-row overflow-hidden lg:min-h-[640px]">
        <AuthFashionPanel />

        <div className="w-full md:w-1/2 lg:w-[58%] flex flex-col bg-white">
          <div className="flex border-b border-brand-powder/60 bg-brand-cream/20">
            <div className="flex-1 py-2.5 sm:py-3.5 text-center font-sans text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-bold border-b-2 border-brand-teal text-brand-teal bg-white shadow-2xs">
              Admin Sign In
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-10 lg:p-12 text-left">
            <div className="mb-5 sm:mb-7">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-brand-teal" />
                <span className="font-sans text-[9px] uppercase tracking-[0.25em] font-extrabold text-brand-teal">
                  SECURE STAFF ACCESS
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-navy font-light mb-1">
                Sign in to your portal
              </h2>
              <p className="font-sans text-[11px] sm:text-xs text-brand-navy/60 font-light">
                Use your authorized Suka Fashions administrator account.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2.5 mb-4 text-[11px] font-sans text-red-700 font-medium">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block font-sans text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-1.5 sm:mb-2">
                  Administrator Email *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sukafashions.com"
                    required
                    className="w-full pl-10 pr-3.5 py-3 sm:py-3.5 bg-brand-cream/15 border border-brand-powder/80 rounded-md text-xs sm:text-sm font-sans text-brand-navy placeholder-brand-navy/35 outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-1.5 sm:mb-2">
                  Security Password *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full pl-10 pr-11 py-3 sm:py-3.5 bg-brand-cream/15 border border-brand-powder/80 rounded-md text-xs sm:text-sm font-sans text-brand-navy placeholder-brand-navy/35 outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-medium"
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-navy/40 hover:text-brand-teal p-1" aria-label="Toggle password visibility">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-[11px] sm:text-xs text-brand-navy/70 select-none">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 border-brand-powder text-brand-teal accent-brand-teal cursor-pointer" />
                  <span>Keep me signed in</span>
                </label>
                <span className="font-sans text-[10px] sm:text-[11px] text-brand-teal font-semibold">Forgot password?</span>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-brand-teal hover:bg-brand-tealDark disabled:opacity-70 text-white font-sans font-extrabold text-[10.5px] sm:text-[11px] tracking-[0.2em] uppercase py-3 sm:py-4 rounded-md transition-all shadow-md hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>SIGN IN TO DASHBOARD <ArrowRight size={16} /></>}
              </button>
            </form>

            <div className="mt-5 p-3 bg-brand-powderLight/60 border border-brand-powder/60 rounded-md">
              <p className="font-sans text-[9.5px] uppercase tracking-wider text-brand-teal font-extrabold text-center mb-2">
                Quick Fill Accounts · Password: admin123
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Super Admin', email: 'suru1@sukafashions.com' },
                  { label: 'Admin', email: 'suru2@sukafashions.com' },
                  { label: 'Manager', email: 'suru3@sukafashions.com' },
                  { label: 'Staff', email: 'suru4@sukafashions.com' },
                ].map((account) => (
                  <button key={account.email} type="button" onClick={() => { setEmail(account.email); setPassword('admin123'); }} className={`p-2 rounded-md border text-[10px] transition-all cursor-pointer ${email === account.email ? 'bg-brand-teal text-white border-brand-teal' : 'bg-white hover:bg-brand-cream text-brand-navy border-brand-powder/80'}`}>
                    <span className="font-bold block leading-tight">{account.label}</span>
                    <span className={`text-[9px] block truncate ${email === account.email ? 'text-brand-powder' : 'text-brand-navy/45'}`}>{account.email}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-brand-powder/40 flex items-center justify-between text-[10px] font-sans text-brand-navy/60">
              <span className="flex items-center gap-1.5 font-medium text-brand-teal"><ShieldCheck size={14} /> Protected admin access</span>
              <Link to="/" className="text-brand-teal font-bold hover:underline">Customer Store</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
