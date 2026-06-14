import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Mail, ShieldCheck, RefreshCw, Heart } from 'lucide-react';

export default function Footer() {
  const { setCurrentPage } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <>
      <footer className="app-footer">
        {/* Newsletter Signup (Join the Inner Circle) */}
        <div className="newsletter-section">
          <h3>Join the Inner Circle</h3>
          <p>Subscribe to receive 15% off your first order, exclusive access to new product drops, and beauty rituals.</p>
          
          {subscribed ? (
            <div className="subscribe-success-alert">
              Thank you for subscribing! Check your email for code: <strong>LUMIERE15</strong>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="newsletter-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary newsletter-btn">
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Quality Badges */}
        <div className="footer-badges">
          <div className="f-badge-item">
            <ShieldCheck size={20} color="var(--primary)" />
            <span>Secure Checkout</span>
          </div>
          <div className="f-badge-item">
            <RefreshCw size={20} color="var(--primary)" />
            <span>30-Day Returns</span>
          </div>
          <div className="f-badge-item">
            <Heart size={20} color="var(--primary)" />
            <span>Cruelty-Free</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="footer-links-grid">
          <div>
            <h4>Rituals</h4>
            <ul>
              <li><button onClick={() => setCurrentPage('shop')}>Shop All</button></li>
              <li><button onClick={() => setCurrentPage('offers')}>Offers & Sale</button></li>
              <li><button onClick={() => setCurrentPage('about')}>Our Ethos</button></li>
            </ul>
          </div>
          <div>
            <h4>Care</h4>
            <ul>
              <li><button onClick={() => setCurrentPage('support')}>Customer Support</button></li>
              <li><button onClick={() => setCurrentPage('dashboard')}>Track Order</button></li>
              <li><button onClick={() => setCurrentPage('admin')}>Partner Portal</button></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-logo">LUMIÈRE</div>
          <p className="copyright-text">© {new Date().getFullYear()} Lumière India. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .app-footer {
          background-color: var(--bg-cream);
          border-top: 1px solid var(--border);
          padding: 40px 20px 48px;
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          text-align: center;
        }
        .newsletter-section {
          background-color: var(--bg-pink);
          padding: 24px 16px;
          border-radius: var(--radius-lg);
          border: 1px dashed var(--primary);
        }
        .newsletter-section h3 {
          font-family: var(--font-serif);
          font-size: 20px;
          color: var(--primary);
          margin-bottom: 8px;
        }
        .newsletter-section p {
          font-size: 13px;
          color: var(--text-medium);
          margin-bottom: 16px;
          line-height: 1.4;
        }
        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .newsletter-input {
          padding: 12px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          background-color: var(--bg-white);
          font-family: var(--font-sans);
          font-size: 14px;
          text-align: center;
          outline: none;
        }
        .newsletter-input:focus {
          border-color: var(--primary);
        }
        .newsletter-btn {
          font-size: 13px;
          padding: 12px;
        }
        .subscribe-success-alert {
          background-color: var(--bg-white);
          border: 1px solid var(--success);
          color: var(--text-dark);
          padding: 12px;
          border-radius: var(--radius-md);
          font-size: 13px;
        }
        .footer-badges {
          display: flex;
          justify-content: space-around;
          padding: 16px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .f-badge-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .f-badge-item span {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-medium);
        }
        .footer-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          text-align: left;
          padding: 0 10px;
        }
        .footer-links-grid h4 {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          color: var(--primary);
        }
        .footer-links-grid ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .footer-links-grid button {
          font-size: 13px;
          color: var(--text-medium);
          text-align: left;
        }
        .footer-links-grid button:hover {
          color: var(--primary);
        }
        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
        }
        .footer-logo {
          font-family: var(--font-serif);
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 3px;
          color: var(--primary);
        }
        .copyright-text {
          font-size: 11px;
          color: var(--text-light);
        }
      `}</style>
    </>
  );
}
