import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, RotateCcw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { Button } from '../components/common/Button';
import { OtpInput } from '../components/auth/OtpInput';
import { BrandLogo } from '../components/common/BrandLogo';
import { toast } from 'sonner';
import { createCustomerUser } from '../lib/auth';
import { sendOtpToEmail, verifyOtp, getOtpRemainingTime } from '../lib/otp';

type SignupStep = 'email-password' | 'otp-verification' | 'success';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Step 1: Email & Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: OTP
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [otpCode, setOtpCode] = useState('');

  // State management
  const [step, setStep] = useState<SignupStep>('email-password');
  const [loading, setLoading] = useState(false);
  const [otpTimeLeft, setOtpTimeLeft] = useState(0);

  // Timer for OTP
  React.useEffect(() => {
    if (step === 'otp-verification' && email) {
      const timer = setInterval(() => {
        const remaining = getOtpRemainingTime(email);
        setOtpTimeLeft(remaining);
        if (remaining === 0) {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, email]);

  // Email validation
  const isValidEmail = (e: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e);
  };

  // Password validation
  const isValidPassword = (p: string) => {
    return p.length >= 8;
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      toast.error('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      // Send OTP
      try {
        const generatedOtp = sendOtpToEmail(email);
        setOtpCode(generatedOtp);
        toast.success(`OTP sent to ${email}. Check console for demo OTP.`, {
          description: `Demo OTP: ${generatedOtp}`,
          duration: 10000,
        });
        setStep('otp-verification');
        setLoading(false);
      } catch (error) {
        toast.error('Failed to send OTP. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (verifyOtp(email, otpString)) {
        // Create user account
        const user = createCustomerUser(email);
        dispatch(loginSuccess(user));
        toast.success('Account created successfully!');
        setStep('success');
        setLoading(false);
      } else {
        toast.error('Invalid OTP. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  const handleResendOtp = () => {
    try {
      const generatedOtp = sendOtpToEmail(email);
      setOtp(['', '', '', '', '', '']);
      setOtpCode(generatedOtp);
      toast.success(`New OTP sent to ${email}. Check console for demo OTP.`, {
        description: `Demo OTP: ${generatedOtp}`,
        duration: 10000,
      });
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--primary-light)] via-white to-[var(--background)] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-6"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            </motion.div>

            <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Welcome to Suka!
            </h2>
            <p className="text-gray-600 mb-8" style={{ fontFamily: 'var(--font-body)' }}>
              Your account has been created and verified successfully.
            </p>

            <div className="bg-[var(--background)] rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                Email: <span className="font-semibold text-gray-900">{email}</span>
              </p>
            </div>

            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="w-full"
            >
              Start Shopping
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

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
              {step === 'email-password' ? 'Create Account' : 'Verify Email'}
            </h2>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
              {step === 'email-password'
                ? 'Join Suka for the best fashion deals'
                : `We sent a code to ${email}`}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-2 mb-8">
            <div className={`h-1 flex-1 rounded-full transition-colors ${step !== 'email-password' ? 'bg-green-500' : 'bg-[var(--primary)]'}`} />
            <div className={`h-1 flex-1 rounded-full transition-colors ${step === 'email-password' ? 'bg-gray-200' : 'bg-[var(--primary)]'}`} />
          </div>

          {/* Step 1: Email & Password */}
          {step === 'email-password' && (
            <form onSubmit={handleSignupSubmit} className="space-y-5">
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
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                  Minimum 8 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] transition-colors"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[var(--primary)] rounded" required />
                <span className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                  I agree to the{' '}
                  <a href="#" className="text-[var(--primary)] hover:underline font-semibold">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[var(--primary)] hover:underline font-semibold">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <Button type="submit" size="lg" className="w-full" loading={loading}>
                Create Account
              </Button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp-verification' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                  Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
                </p>

                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  disabled={loading}
                  autoFocus
                />
              </div>

              {otpTimeLeft > 0 && (
                <div className="text-center text-sm text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
                  Code expires in <span className="font-semibold">{otpTimeLeft}s</span>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" loading={loading}>
                Verify & Create Account
              </Button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || otpTimeLeft > 300}
                className="w-full py-3 text-[var(--primary)] font-semibold hover:bg-[var(--background)] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <RotateCcw className="w-4 h-4" />
                Resend Code
              </button>
            </form>
          )}

          <p className="text-center mt-6 text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--primary)] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
