'use client';

import React, { useContext } from 'react';
import { AppContext } from '@/context/AppContext';

export default function InstagramButton() {
  const context = useContext(AppContext);
  const handleInstagramClick = () => {
    window.open('https://instagram.com', '_blank');
  };

  const currentPage = context ? context.currentPage : 'home';
  const isScrollingDown = context ? context.isScrollingDown : false;
  if (currentPage === 'product-detail') return null;
  const showBottomNav = !['checkout', 'payment-screen', 'login', 'admin', 'product-detail'].includes(currentPage);
  
  // If bottom nav is visible (mobile only), offset it to bottom-20. Otherwise bottom-6.
  const bottomClass = showBottomNav ? 'bottom-20 md:bottom-6' : 'bottom-6';

  return (
    <>
      <button 
        className={`fixed ${bottomClass} left-6 w-12 h-12 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shadow-[0_4px_16px_rgba(238,42,123,0.3)] z-40 transition-all duration-300 active:scale-95 group ${
          isScrollingDown ? 'opacity-40 scale-90 hover:opacity-100 hover:scale-100' : 'opacity-100'
        }`}
        onClick={handleInstagramClick} 
        aria-label="Visit Instagram Community"
      >
        <svg className="w-5.5 h-5.5 text-white fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
        <span className="absolute left-14 bg-text-dark text-white text-[10px] font-medium py-1 px-2.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Join Community
        </span>
      </button>
    </>
  );
}
