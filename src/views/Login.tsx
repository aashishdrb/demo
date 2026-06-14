'use client';

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, User, Mail, Phone, Lock, Sparkles, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const context = useContext(AppContext);
  if (!context) return null;
  const { setCurrentUser, setCurrentPage, cart, redirectDestination, setRedirectDestination } = context;

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [tempRegisterData, setTempRegisterData] = useState<any>(null);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');
    const newErrors: Record<string, string> = {};

    if (!email.trim() || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (isSignUp) {
      if (!name.trim()) newErrors.name = 'Full name is required.';
      if (!/^[6-9]\d{9}$/.test(phone)) {
        newErrors.phone = 'Mobile must be 10 digits starting with 6, 7, 8, or 9.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isSignUp) {
      // Show OTP verification step before hitting signup endpoint
      setTempRegisterData({ name, email, phone, password });
      setShowOtp(true);
      setOtpInput('');
      setOtpError('');
    } else {
      await performLogin(email, password);
    }
  };

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      if (data.success && data.user) {
        setCurrentUser(data.user);
        if (redirectDestination) {
          setCurrentPage(redirectDestination);
          setRedirectDestination(null);
        } else if (cart.length > 0) {
          setCurrentPage('checkout');
        } else {
          setCurrentPage('dashboard');
        }
        window.scrollTo(0, 0);
      }
    } catch (err: any) {
      setServerError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (otpInput.trim() !== '123456') {
      setOtpError('Invalid OTP code. Please enter 123456 to verify.');
      return;
    }

    if (!tempRegisterData) return;

    setLoading(true);
    setShowOtp(false);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempRegisterData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      if (data.success && data.user) {
        setCurrentUser(data.user);
        if (redirectDestination) {
          setCurrentPage(redirectDestination);
          setRedirectDestination(null);
        } else if (cart.length > 0) {
          setCurrentPage('checkout');
        } else {
          setCurrentPage('dashboard');
        }
        window.scrollTo(0, 0);
      }
    } catch (err: any) {
      setServerError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-cream flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Centered Premium Navigation back to Home */}
        <div className="flex justify-center select-none w-full">
          <button 
            onClick={() => setCurrentPage('home')} 
            className="group relative flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto bg-gradient-to-r from-bg-pink via-bg-peach to-bg-pink border border-border-lumi/80 hover:border-primary-light/30 rounded-full shadow-[0_4px_15px_rgba(107,83,76,0.03)] hover:shadow-[0_8px_25px_rgba(107,83,76,0.08)] text-text-medium hover:text-primary transition-all duration-300 ease-out hover:scale-103 active:scale-97 text-xs font-bold uppercase tracking-widest cursor-pointer md:px-8 md:py-3.5"
          >
            {/* Soft gold/champagne glow background effect on hover */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-gold/5 via-transparent to-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></span>
            
            <ArrowLeft size={13} className="text-text-light group-hover:text-primary transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="relative z-10">Back to Home</span>
          </button>
        </div>

        {/* Branding header */}
        <div className="text-center">
          <span className="font-serif text-3xl sm:text-4xl tracking-[6px] font-light text-primary select-none">LUMIÈRE</span>
          <h1 className="mt-4 text-xl sm:text-2xl font-serif font-medium text-text-dark">
            {isSignUp ? 'Begin Your Skincare Journey' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-text-light">
            Dermatologically formulated. Pure. Mindful. Luxury.
          </p>
        </div>

        {/* Form Card (Glassmorphism inspired) */}
        <div className="bg-white rounded-3xl border border-border-lumi shadow-xl overflow-hidden animate-fade-up">
          
          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 border-b border-border-lumi bg-bg-peach">
            <button 
              className={`py-4 text-center text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all ${
                !isSignUp 
                  ? 'bg-white text-primary border-b-2 border-primary' 
                  : 'text-text-light hover:text-text-medium hover:bg-bg-pink/50'
              }`}
              onClick={() => {
                setIsSignUp(false);
                setErrors({});
                setServerError('');
              }}
            >
              Sign In
            </button>
            <button 
              className={`py-4 text-center text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all ${
                isSignUp 
                  ? 'bg-white text-primary border-b-2 border-primary' 
                  : 'text-text-light hover:text-text-medium hover:bg-bg-pink/50'
              }`}
              onClick={() => {
                setIsSignUp(true);
                setErrors({});
                setServerError('');
              }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="p-6 sm:p-8 flex flex-col gap-5">
            {serverError && (
              <div className="p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl">
                {serverError}
              </div>
            )}

            {isSignUp && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-medium uppercase tracking-wider">Full Name</label>
                <div className="relative flex items-center">
                  <User size={16} className="absolute left-4 text-text-light" />
                  <input 
                    type="text" 
                    placeholder="E.g., Sarah Jenkins" 
                    className={`w-full text-sm py-3 pl-11 pr-4 bg-bg-peach border rounded-xl outline-none transition-all ${
                      errors.name ? 'border-red-400 focus:border-red-500' : 'border-border-lumi focus:border-primary-light focus:bg-white'
                    }`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {errors.name && <span className="text-[11px] text-red-500 font-semibold">{errors.name}</span>}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-medium uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-4 text-text-light" />
                <input 
                  type="email" 
                  placeholder="E.g., sarah.j@lumiere.in" 
                  className={`w-full text-sm py-3 pl-11 pr-4 bg-bg-peach border rounded-xl outline-none transition-all ${
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-border-lumi focus:border-primary-light focus:bg-white'
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              {errors.email && <span className="text-[11px] text-red-500 font-semibold">{errors.email}</span>}
            </div>

            {isSignUp && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-medium uppercase tracking-wider">Mobile Number</label>
                <div className="relative flex items-center">
                  <Phone size={16} className="absolute left-4 text-text-light" />
                  <input 
                    type="tel" 
                    maxLength={10}
                    placeholder="E.g., 9876543210" 
                    className={`w-full text-sm py-3 pl-11 pr-4 bg-bg-peach border rounded-xl outline-none transition-all ${
                      errors.phone ? 'border-red-400 focus:border-red-500' : 'border-border-lumi focus:border-primary-light focus:bg-white'
                    }`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {errors.phone && <span className="text-[11px] text-red-500 font-semibold">{errors.phone}</span>}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-medium uppercase tracking-wider">Password</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-4 text-text-light" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  className={`w-full text-sm py-3 pl-11 pr-12 bg-bg-peach border rounded-xl outline-none transition-all ${
                    errors.password ? 'border-red-400 focus:border-red-500' : 'border-border-lumi focus:border-primary-light focus:bg-white'
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-text-light hover:text-text-medium transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="text-[11px] text-red-500 font-semibold">{errors.password}</span>}
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 py-3.5 bg-gradient-to-r from-primary via-primary-light to-primary text-white rounded-full font-semibold text-xs sm:text-sm tracking-widest uppercase hover:shadow-[0_8px_25px_rgba(107,83,76,0.18)] hover:scale-[1.01] transition-all duration-300 ease-out flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none shadow-md cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Help */}
          <div className="bg-bg-pink/40 border-t border-border-lumi p-4 text-center text-xs text-text-medium flex flex-col gap-1">
            <div className="flex items-center justify-center gap-1">
              <Sparkles size={14} className="text-accent-gold fill-accent-gold" />
              <strong className="text-text-dark">Working Demo Credentials:</strong>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 mt-1 text-[11px] text-text-medium">
              <div>Admin Demo: <span className="font-semibold text-text-dark">admin@beautybrand.com</span> (Pass: <span className="font-mono text-text-dark">Admin@123</span>)</div>
              <div>Customer Demo: <span className="font-semibold text-text-dark">user@beautybrand.com</span> (Pass: <span className="font-mono text-text-dark">User@123</span>)</div>
            </div>
          </div>
        </div>

      </div>

      {/* OTP Verification Modal Overlay */}
      {showOtp && (
        <div className="fixed inset-0 z-50 bg-text-dark/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-border-lumi rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center flex flex-col gap-6 animate-fade-up">
            <div>
              <span className="font-serif text-2xl tracking-[4px] font-light text-primary select-none">LUMIÈRE</span>
              <h2 className="mt-4 text-lg font-serif font-semibold text-text-dark">Security Verification</h2>
              <p className="mt-2 text-xs text-text-light leading-relaxed">
                An OTP has been sent to <strong className="text-text-medium">{tempRegisterData?.email}</strong> and <strong className="text-text-medium">+91 {tempRegisterData?.phone}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyOtpSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 text-left">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="Enter OTP"
                  className="w-full text-center tracking-[8px] text-lg font-bold py-3 border border-border-lumi bg-bg-peach rounded-xl outline-none focus:border-primary focus:bg-white transition-all text-text-dark"
                  value={otpInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setOtpInput(val);
                    setOtpError('');
                  }}
                  required
                />
                <span className="text-[10px] text-text-light font-medium text-center">For testing, please enter verification code: <strong className="text-primary font-bold">123456</strong></span>
                {otpError && <span className="text-xs text-red-500 font-semibold mt-1 text-center block">{otpError}</span>}
              </div>

              <div className="flex gap-3 mt-2">
                <button 
                  type="button" 
                  className="flex-1 py-3 border border-border-lumi text-text-medium rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-bg-peach transition-all duration-300 cursor-pointer active:scale-98"
                  onClick={() => {
                    setShowOtp(false);
                    setTempRegisterData(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:shadow-md transition-all duration-300 cursor-pointer active:scale-98"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
