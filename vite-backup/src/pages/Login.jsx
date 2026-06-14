import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, User, Mail, Phone, Lock, Sparkles } from 'lucide-react';

export default function Login() {
  const { setCurrentUser, setCurrentPage } = useContext(AppContext);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [errors, setErrors] = useState({});

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

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

    // Mock Login Success
    const loggedUser = {
      name: isSignUp ? name : 'Sarah Jenkins',
      email: email,
      phone: isSignUp ? phone : '9876543210',
      addresses: isSignUp ? [] : [
        {
          id: 'addr-1',
          tag: 'Home',
          name: 'Sarah Jenkins',
          addressLine: 'Flat 4B, Rosewood Terrace, Sector 62',
          district: 'Noida',
          state: 'Uttar Pradesh',
          pincode: '201301',
          phone: '9876543210',
          isDefault: true
        }
      ]
    };

    setCurrentUser(loggedUser);
    setCurrentPage('dashboard');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="login-container animate-fade-up">
        {/* Navigation back */}
        <button onClick={() => setCurrentPage('home')} className="back-home-btn" aria-label="Go back to home">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        {/* Branding header */}
        <div className="login-brand-header">
          <span className="logo-text">LUMIÈRE</span>
          <h1>Join the Ritual</h1>
          <p>Dermatologically formulated. Pure. Mindful. Luxury.</p>
        </div>

        {/* Form Container */}
        <div className="login-form-card">
          <div className="form-toggle-headers">
            <button 
              className={`toggle-tab-btn ${!isSignUp ? 'active' : ''}`}
              onClick={() => {
                setIsSignUp(false);
                setErrors({});
              }}
            >
              Sign In
            </button>
            <button 
              className={`toggle-tab-btn ${isSignUp ? 'active' : ''}`}
              onClick={() => {
                setIsSignUp(true);
                setErrors({});
              }}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="auth-form-body">
            {isSignUp && (
              <div className="input-group">
                <label>Full Name</label>
                <div className="field-icon-wrapper">
                  <User size={16} className="field-icon" />
                  <input 
                    type="text" 
                    placeholder="Sarah Jenkins" 
                    className={`input-field icon-pad ${errors.name ? 'error' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
            )}

            <div className="input-group">
              <label>Email Address</label>
              <div className="field-icon-wrapper">
                <Mail size={16} className="field-icon" />
                <input 
                  type="email" 
                  placeholder="sarah.j@lumiere.in" 
                  className={`input-field icon-pad ${errors.email ? 'error' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {isSignUp && (
              <div className="input-group">
                <label>Mobile Number</label>
                <div className="field-icon-wrapper">
                  <Phone size={16} className="field-icon" />
                  <input 
                    type="tel" 
                    maxLength={10}
                    placeholder="9876543210" 
                    className={`input-field icon-pad ${errors.phone ? 'error' : ''}`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            )}

            <div className="input-group">
              <label>Password</label>
              <div className="field-icon-wrapper">
                <Lock size={16} className="field-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className={`input-field icon-pad ${errors.password ? 'error' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn">
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials Help */}
          <div className="demo-credentials-help">
            <Sparkles size={14} color="var(--primary)" />
            <span><strong>Demo Mode</strong>: Enter any 6-character password to test.</span>
          </div>
        </div>
      </div>

      <style>{`
        .login-container {
          padding: 24px 16px 40px;
          text-align: left;
          min-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .back-home-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-medium);
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
        }
        
        .login-brand-header {
          text-align: center;
          margin-bottom: 28px;
        }
        .login-brand-header h1 {
          font-size: 28px;
          font-weight: 500;
          margin-top: 8px;
          margin-bottom: 6px;
        }
        .login-brand-header p {
          font-size: 13px;
          color: var(--text-light);
          line-height: 1.4;
          max-width: 280px;
          margin: 0 auto;
        }

        /* Form Card Layout */
        .login-form-card {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        .form-toggle-headers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid var(--border);
        }
        .toggle-tab-btn {
          padding: 16px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-light);
          background-color: var(--bg-cream);
        }
        .toggle-tab-btn.active {
          background-color: var(--bg-white);
          color: var(--primary);
          border-bottom: 2px solid var(--primary);
        }
        
        .auth-form-body {
          padding: 24px 16px;
        }
        .field-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-icon {
          position: absolute;
          left: 12px;
          color: var(--text-light);
        }
        .input-field.icon-pad {
          padding-left: 38px;
          width: 100%;
        }
        .auth-submit-btn {
          font-weight: 600;
          margin-top: 8px;
        }

        .demo-credentials-help {
          background-color: var(--bg-pink);
          padding: 12px;
          text-align: center;
          font-size: 12px;
          color: var(--text-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-top: 1px solid var(--border);
        }
      `}</style>
    </>
  );
}
