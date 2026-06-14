'use client';

import React, { useContext } from 'react';
import { AppContext } from '@/context/AppContext';

// Layout Elements
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import WhatsAppButton from '@/components/WhatsAppButton';
import InstagramButton from '@/components/InstagramButton';
import Footer from '@/components/Footer';

// Page Views
import Home from '@/views/Home';
import Shop from '@/views/Shop';
import ProductDetail from '@/views/ProductDetail';
import Cart from '@/views/Cart';
import Checkout from '@/views/Checkout';
import Payment from '@/views/Payment';
import Tracking from '@/views/Tracking';
import Login from '@/views/Login';
import Dashboard from '@/views/Dashboard';
import Wishlist from '@/views/Wishlist';
import Contact from '@/views/Contact';
import AboutBrand from '@/views/AboutBrand';
import OffersSale from '@/views/OffersSale';
import CustomerSupport from '@/views/CustomerSupport';
import Admin from '@/views/Admin';
import BackButton from '@/components/BackButton';


function AppContent() {
  const context = useContext(AppContext);
  if (!context) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-bg-cream">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { currentPage } = context;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'shop':
        return <Shop />;
      case 'product-detail':
        return <ProductDetail />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'payment-screen':
        return <Payment />;
      case 'tracking':
        return <Tracking />;
      case 'login':
        return <Login />;
      case 'dashboard':
        return <Dashboard />;
      case 'wishlist':
        return <Wishlist />;
      case 'contact':
        return <Contact />;
      case 'about':
        return <AboutBrand />;
      case 'offers':
        return <OffersSale />;
      case 'support':
        return <CustomerSupport />;
      case 'admin':
        return <Admin />;
      default:
        return <Home />;
    }
  };

  // Layout Controls (match original Vite App.jsx logic)
  const showHeader = !['login', 'admin'].includes(currentPage);
  const showBottomNav = !['checkout', 'payment-screen', 'login', 'admin', 'product-detail'].includes(currentPage);
  const showFooter = !['checkout', 'payment-screen', 'login', 'admin'].includes(currentPage);

  return (
    <div className="flex flex-col min-h-screen max-w-full overflow-x-clip">
      {showHeader && <Header />}
      {currentPage !== 'home' && currentPage !== 'login' && currentPage !== 'admin' && <BackButton />}
      
      {/* 
        Add bottom padding on mobile if sticky BottomNav is shown 
        to prevent overlap with the bottom content.
      */}
      <main className={`flex-1 ${showBottomNav ? 'pb-16 md:pb-0' : ''}`}>
        {renderPage()}
      </main>

      <WhatsAppButton />
      <InstagramButton />
      
      {showFooter && <Footer />}
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default function page() {
  return <AppContent />;
}
