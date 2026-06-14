import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Tracking from './pages/Tracking';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import AboutBrand from './pages/AboutBrand';
import OffersSale from './pages/OffersSale';
import CustomerSupport from './pages/CustomerSupport';
import Admin from './pages/Admin';

function AppContent() {
  const { currentPage } = useContext(AppContext);

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

  // Conditionally render Header, Bottom Nav, and Footer
  const showHeader = !['login', 'admin'].includes(currentPage);
  const showBottomNav = !['checkout', 'payment-screen', 'login', 'admin'].includes(currentPage);
  const showFooter = !['checkout', 'payment-screen', 'login', 'admin'].includes(currentPage);

  return (
    <div className="phone-viewport animate-fade-up">
      {showHeader && <Header />}
      
      <main className="main-content">
        {renderPage()}
      </main>

      <WhatsAppButton />
      
      {showFooter && <Footer />}
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
