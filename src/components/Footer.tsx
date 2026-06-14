'use client';

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldCheck, RefreshCw, Heart } from 'lucide-react';

export default function Footer() {
  const context = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!context) return null;
  const { setCurrentPage } = context;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full bg-bg-cream border-t border-border-lumi py-12 px-4 md:px-8 mt-12 flex flex-col gap-10">
      
      {/* Upper Grid: Slogan, Newsletter Signup */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Slogan */}
        <div className="flex flex-col gap-2 lg:pr-8">
          <span className="text-xl font-serif tracking-[3px] text-primary">LUMIÈRE</span>
          <p className="text-sm text-text-medium leading-relaxed mt-2">
            Mindful clean skincare formulated with premium botanical extracts and new-age dermatological compounds. Cruelty-free and 100% vegan.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Join Our Beauty Community</span>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white border border-border-lumi hover:border-primary flex items-center justify-center text-text-medium hover:text-primary transition-all duration-300 hover:scale-110 shadow-xs" title="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white border border-border-lumi hover:border-primary flex items-center justify-center text-text-medium hover:text-primary transition-all duration-300 hover:scale-110 shadow-xs" title="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white border border-border-lumi hover:border-primary flex items-center justify-center text-text-medium hover:text-primary transition-all duration-300 hover:scale-110 shadow-xs" title="YouTube">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* Pinterest */}
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white border border-border-lumi hover:border-primary flex items-center justify-center text-text-medium hover:text-primary transition-all duration-300 hover:scale-110 shadow-xs" title="Pinterest">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.176-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.204 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.621 0 11.985-5.367 11.985-11.988C24.005 5.367 18.639 0 12.017 0z" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white border border-border-lumi hover:border-primary flex items-center justify-center text-text-medium hover:text-primary transition-all duration-300 hover:scale-110 shadow-xs" title="Twitter / X">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
            <span className="text-[10px] font-medium text-text-light">Follow us @beautyluxeofficial</span>
          </div>
        </div>

        {/* Newsletter Signup (Join the Inner Circle) */}
        <div className="lg:col-span-2 bg-bg-pink p-6 md:p-8 rounded-2xl border border-dashed border-primary flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left flex flex-col gap-1">
            <h3 className="font-serif text-lg md:text-xl font-medium text-primary">Join the Inner Circle</h3>
            <p className="text-xs md:text-sm text-text-medium leading-relaxed">
              Subscribe to receive 15% off your first order, drops, and skincare advice.
            </p>
          </div>

          {subscribed ? (
            <div className="w-full md:w-auto bg-white border border-success text-success text-xs font-semibold py-3 px-6 rounded-full text-center">
              Check your email for discount code: <strong>LUMIERE15</strong>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="w-full sm:w-64 px-4 py-2.5 rounded-full border border-border-lumi bg-white text-sm focus:outline-none focus:border-primary text-text-dark"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Middle Grid: Quality Trust Badges */}
      <div className="max-w-7xl mx-auto w-full border-t border-b border-border-lumi py-6 flex flex-wrap justify-around gap-6">
        <div className="flex items-center gap-3">
          <ShieldCheck size={22} className="text-primary" />
          <span className="text-xs font-semibold text-text-medium tracking-wide uppercase">Secure SSL Checkout</span>
        </div>
        <div className="flex items-center gap-3">
          <RefreshCw size={22} className="text-primary" />
          <span className="text-xs font-semibold text-text-medium tracking-wide uppercase">No Returns Available</span>
        </div>
        <div className="flex items-center gap-3">
          <Heart size={22} className="text-primary" />
          <span className="text-xs font-semibold text-text-medium tracking-wide uppercase">100% Cruelty-Free</span>
        </div>
      </div>

      {/* Lower Grid: Navigation Columns */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">Shop Rituals</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-text-medium">
            <li><button onClick={() => setCurrentPage('shop')} className="hover:text-primary transition-colors">Facewash & Serums</button></li>
            <li><button onClick={() => setCurrentPage('shop')} className="hover:text-primary transition-colors">Sunscreen & Creams</button></li>
            <li><button onClick={() => setCurrentPage('offers')} className="hover:text-primary transition-colors">Special Kits & Sale</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">Lumière Brand</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-text-medium">
            <li><button onClick={() => setCurrentPage('about')} className="hover:text-primary transition-colors">Our Story & Ethos</button></li>
            <li><button onClick={() => setCurrentPage('about')} className="hover:text-primary transition-colors">Ingredients Glossary</button></li>
            <li><button onClick={() => setCurrentPage('support')} className="hover:text-primary transition-colors">Press & Awards</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">Customer Care</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-text-medium">
            <li><button onClick={() => setCurrentPage('support')} className="hover:text-primary transition-colors">Helpline & FAQ</button></li>
            <li><button onClick={() => setCurrentPage('support')} className="hover:text-primary transition-colors">Track Your Shipment</button></li>
            <li><button onClick={() => setCurrentPage('support')} className="hover:text-primary transition-colors">Refunds & Returns</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">Fulfillment Hub</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-text-medium">
            <li><button onClick={() => setCurrentPage('admin')} className="hover:text-primary transition-colors font-semibold">Admin Panel Portal</button></li>
            <li><button onClick={() => setCurrentPage('support')} className="hover:text-primary transition-colors">Partner Register</button></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto w-full pt-8 border-t border-border-lumi text-center">
        <p className="text-xs text-text-light">
          © {new Date().getFullYear()} Lumière Beauty India Pvt Ltd. All rights reserved. Registered Noida, UP.
        </p>
      </div>

    </footer>
  );
}
