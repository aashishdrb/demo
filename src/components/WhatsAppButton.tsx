'use client';

import React, { useContext } from 'react';
import { MessageCircle } from 'lucide-react';
import { AppContext } from '@/context/AppContext';

export default function WhatsAppButton() {
  const context = useContext(AppContext);
  const handleWhatsAppClick = () => {
    const phoneNumber = '919876543210';
    const text = encodeURIComponent('Hi LUMIÈRE! I need support regarding products/orders.');
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
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
        className={`fixed ${bottomClass} right-6 w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_16px_rgba(37,211,102,0.3)] z-40 transition-all duration-300 active:scale-95 group ${
          isScrollingDown ? 'opacity-40 scale-90 hover:opacity-100 hover:scale-100' : 'opacity-100'
        }`}
        onClick={handleWhatsAppClick} 
        aria-label="Chat with WhatsApp Support"
      >
        <MessageCircle size={22} color="#FFF" fill="#FFF" className="animate-pulse" />
        <span className="absolute right-14 bg-text-dark text-white text-[10px] font-medium py-1 px-2.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Chat with us
        </span>
      </button>
    </>
  );
}

