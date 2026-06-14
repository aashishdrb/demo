'use client';

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Gift, Percent, Copy, Check, Sparkles } from 'lucide-react';

export default function OffersSale() {
  const context = useContext(AppContext);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!context) return null;
  const { coupons } = context;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const salesCampaigns = [
    { title: 'Monsoon Glow Sale', discount: 'Flat 20% Off', desc: 'Refresh your skincare routine with hydration serums and foaming cleansers.', code: 'GLOW20' },
    { title: 'Welcome Special', discount: '₹100 Off', desc: 'Flat discount on your first order. Valid on all category products.', code: 'WELCOME100' }
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-up text-left font-sans">
      
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-2 mb-10">
        <Gift size={28} className="text-primary animate-bounce" />
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-text-dark">Offers & Campaigns</h1>
        <p className="text-xs sm:text-sm text-text-light max-w-md">
          Treat your skin cells to premium rituals with exclusive voucher codes.
        </p>
      </div>

      {/* Main Grid: Promos and Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Active Promos List */}
        <div className="flex flex-col gap-5">
          <h2 className="text-lg font-serif font-medium text-text-dark border-b border-border-lumi pb-3">Active Promos</h2>
          
          <div className="flex flex-col gap-4">
            {coupons.filter(c => c.active).map((coupon, idx) => (
              <div key={idx} className="bg-white border border-border-lumi rounded-3xl p-5 shadow-xs flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-bg-pink flex items-center justify-center text-primary flex-shrink-0 border border-border-lumi">
                  <Percent size={18} />
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider">
                    {coupon.type === 'percentage' ? `${coupon.value}% Discount` : `₹${coupon.value} Off`}
                  </h3>
                  <p className="text-xs text-text-medium leading-relaxed mt-0.5">
                    Applicable store-wide on all luxury skincare categories.
                  </p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <code className="bg-bg-peach px-2.5 py-1 rounded-lg text-xs font-bold text-primary border border-border-lumi">
                      {coupon.code}
                    </code>
                    <button 
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-text-light hover:text-primary transition-all cursor-pointer"
                      onClick={() => handleCopy(coupon.code)}
                    >
                      {copiedCode === coupon.code ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                      <span>{copiedCode === coupon.code ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Campaigns List */}
        <div className="flex flex-col gap-5">
          <h2 className="text-lg font-serif font-medium text-text-dark border-b border-border-lumi pb-3">Current Campaigns</h2>
          
          <div className="flex flex-col gap-4">
            {salesCampaigns.map((camp, idx) => (
              <div key={idx} className="rounded-3xl p-6 bg-gradient-to-br from-bg-peach to-bg-pink border border-border-lumi relative shadow-xs text-left">
                <span className="inline-block text-[9px] font-bold bg-primary text-white px-2.5 py-0.5 rounded-full tracking-wider uppercase mb-3">
                  LIMITED TIME OFFER
                </span>
                <h3 className="text-base font-bold text-text-dark">{camp.title}</h3>
                <p className="text-xs text-text-medium leading-relaxed mt-1 mb-4 max-w-sm">{camp.desc}</p>
                <strong className="text-2xl font-serif text-primary block mb-4">{camp.discount}</strong>
                
                <div className="flex justify-between items-center border-t border-dashed border-primary-light/25 pt-4">
                  <span className="text-xs text-text-medium">Use Code: <strong className="text-primary font-bold">{camp.code}</strong></span>
                  <button 
                    className="text-xs font-bold text-primary underline underline-offset-4 hover:text-primary-light transition-all cursor-pointer"
                    onClick={() => handleCopy(camp.code)}
                  >
                    {copiedCode === camp.code ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Free Shipping Alert banner */}
      <div className="mt-8 p-4 bg-white border border-border-lumi rounded-2xl flex items-center gap-3 shadow-xs max-w-2xl mx-auto">
        <Sparkles size={16} className="text-accent-gold fill-accent-gold" />
        <span className="text-xs text-text-medium">
          Get <strong>FREE SHIPPING</strong> on all orders above ₹999! No code required.
        </span>
      </div>

    </div>
  );
}
