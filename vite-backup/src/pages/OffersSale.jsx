import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Gift, Percent, Copy, Check, Sparkles } from 'lucide-react';

export default function OffersSale() {
  const { coupons } = useContext(AppContext);
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const salesCampaigns = [
    { title: 'Monsoon Glow Sale', discount: 'Flat 20% Off', desc: 'Refresh your skincare routine with hydration serums and foaming cleansers.', code: 'GLOW20' },
    { title: 'Welcome Special', discount: '₹100 Off', desc: 'Flat discount on your first order. Valid on all category products.', code: 'WELCOME100' }
  ];

  return (
    <>
      <div className="offers-page-container animate-fade-up">
        {/* Header */}
        <div className="offers-header">
          <Gift size={28} color="var(--primary)" />
          <h1>Offers & Campaigns</h1>
          <p>Treat your skin cells to premium rituals with exclusive voucher codes.</p>
        </div>

        {/* Promo Coupons list */}
        <div className="offers-section">
          <h2>Active Promos</h2>
          
          <div className="offers-cards-list">
            {coupons.filter(c => c.active).map((coupon, idx) => (
              <div key={idx} className="offer-code-card">
                <div className="offer-badge-circle">
                  <Percent size={18} color="var(--primary)" />
                </div>
                
                <div className="offer-details">
                  <h3>{coupon.type === 'percentage' ? `${coupon.value}% Discount` : `₹${coupon.value} Off`}</h3>
                  <p>Applicable store-wide on all luxury skincare categories.</p>
                  
                  <div className="code-copy-row">
                    <code>{coupon.code}</code>
                    <button className="copy-btn-mini" onClick={() => handleCopy(coupon.code)}>
                      {copiedCode === coupon.code ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                      <span>{copiedCode === coupon.code ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales campaigns list */}
        <div className="offers-section" style={{ marginTop: '16px' }}>
          <h2>Current Campaigns</h2>
          
          <div className="campaign-banners-list">
            {salesCampaigns.map((camp, idx) => (
              <div key={idx} className="campaign-banner-card">
                <div className="banner-content">
                  <span className="banner-sale-tag">LIMITED TIME OFFER</span>
                  <h3>{camp.title}</h3>
                  <p>{camp.desc}</p>
                  <strong className="campaign-discount">{camp.discount}</strong>
                  
                  <div className="banner-code-box">
                    <span>Use Code: <strong>{camp.code}</strong></span>
                    <button className="banner-copy-btn" onClick={() => handleCopy(camp.code)}>
                      {copiedCode === camp.code ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free Shipping Alert */}
        <div className="shipping-offer-banner">
          <Sparkles size={16} color="var(--primary)" />
          <span>Get <strong>FREE SHIPPING</strong> on all orders above ₹999! No code required.</span>
        </div>
      </div>

      <style>{`
        .offers-page-container {
          padding: 20px 16px 32px;
          text-align: left;
        }
        .offers-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .offers-header h1 {
          font-size: 24px;
          font-weight: 500;
          margin-top: 8px;
          margin-bottom: 4px;
        }
        .offers-header p {
          font-size: 13px;
          color: var(--text-light);
          line-height: 1.4;
          max-width: 280px;
          margin: 0 auto;
        }

        .offers-section h2 {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 14px;
        }

        /* Promo cards */
        .offers-cards-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .offer-code-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background-color: var(--bg-white);
          box-shadow: var(--shadow-sm);
        }
        .offer-badge-circle {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          background-color: var(--bg-pink);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .offer-details h3 {
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 2px;
        }
        .offer-details p {
          font-size: 12px;
          color: var(--text-medium);
          line-height: 1.4;
          margin-bottom: 8px;
        }
        .code-copy-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .code-copy-row code {
          background-color: var(--bg-cream);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 600;
          color: var(--primary);
        }
        .copy-btn-mini {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 500;
          color: var(--text-light);
        }

        /* Campaign cards */
        .campaign-banners-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .campaign-banner-card {
          border-radius: var(--radius-lg);
          padding: 20px;
          background: linear-gradient(135deg, var(--bg-peach) 0%, var(--bg-pink) 100%);
          border: 1px solid var(--border-focus);
          position: relative;
          box-shadow: var(--shadow-sm);
        }
        .banner-sale-tag {
          font-size: 9px;
          font-weight: 600;
          background-color: var(--primary);
          color: var(--bg-white);
          padding: 2px 6px;
          border-radius: var(--radius-full);
          letter-spacing: 0.5px;
        }
        .campaign-banner-card h3 {
          font-size: 18px;
          font-weight: 600;
          margin-top: 8px;
          margin-bottom: 4px;
        }
        .campaign-banner-card p {
          font-size: 12px;
          color: var(--text-medium);
          line-height: 1.4;
          margin-bottom: 12px;
          max-width: 240px;
        }
        .campaign-discount {
          font-size: 20px;
          color: var(--primary);
          display: block;
          margin-bottom: 14px;
        }
        .banner-code-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          border-top: 1px dashed var(--border-focus);
          padding-top: 10px;
        }
        .banner-code-box strong {
          color: var(--primary);
        }
        .banner-copy-btn {
          font-size: 11px;
          font-weight: 600;
          color: var(--primary);
          text-decoration: underline;
        }

        /* Free Shipping banner */
        .shipping-offer-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--bg-cream);
          padding: 12px;
          border-radius: var(--radius-md);
          margin-top: 24px;
          border: 1px solid var(--border);
        }
        .shipping-offer-banner span {
          font-size: 12px;
          color: var(--text-medium);
        }
      `}</style>
    </>
  );
}
