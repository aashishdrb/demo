import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Menu, ShoppingBag, X, Heart, User, Sparkles, MessageCircle, Gift, Info, ShieldAlert, Award } from 'lucide-react';

export default function Header() {
  const { cart, currentPage, setCurrentPage, toggleWishlist } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  const menuItems = [
    { name: 'Home', page: 'home', icon: Sparkles },
    { name: 'Shop All', page: 'shop', icon: Gift },
    { name: 'Offers & Sale', page: 'offers', icon: Award },
    { name: 'About Brand', page: 'about', icon: Info },
    { name: 'Customer Support', page: 'support', icon: MessageCircle },
    { name: 'User Dashboard', page: 'dashboard', icon: User },
    { name: 'Admin Dashboard', page: 'admin', icon: ShieldAlert },
  ];

  return (
    <>
      <header className="app-header">
        <button className="header-icon-btn" onClick={() => setMenuOpen(true)}>
          <Menu size={22} color="var(--text-dark)" />
        </button>
        
        <div className="logo-text" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
          LUMIÈRE
        </div>

        <button className="header-icon-btn" onClick={() => setCurrentPage('cart')} style={{ position: 'relative' }}>
          <ShoppingBag size={22} color="var(--text-dark)" />
          {totalItems > 0 && (
            <span className="cart-badge-indicator">{totalItems}</span>
          )}
        </button>
      </header>

      {/* Slide-out Navigation Drawer */}
      {menuOpen && (
        <div className="menu-overlay animate-fade-in" onClick={() => setMenuOpen(false)}>
          <div className="menu-drawer animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="logo-text">LUMIÈRE</span>
              <button onClick={() => setMenuOpen(false)}>
                <X size={24} color="var(--text-dark)" />
              </button>
            </div>
            
            <div className="drawer-divider"></div>
            
            <nav className="drawer-nav">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.page}
                    className={`drawer-link ${currentPage === item.page ? 'active' : ''}`}
                    onClick={() => navigateTo(item.page)}
                  >
                    <IconComponent size={20} className="drawer-icon" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="drawer-footer">
              <p>Premium Skincare & Cosmetics</p>
              <span>Cruelty Free • 100% Vegan</span>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for Header and Drawer */}
      <style>{`
        .header-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: var(--radius-full);
        }
        .header-icon-btn:active {
          background-color: var(--bg-pink);
        }
        .cart-badge-indicator {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: var(--primary);
          color: var(--bg-white);
          font-size: 10px;
          font-weight: 600;
          width: 16px;
          height: 16px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--bg-white);
        }
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(107, 83, 76, 0.4);
          backdrop-filter: blur(4px);
          z-index: 999;
          display: flex;
          justify-content: flex-start;
        }
        .menu-drawer {
          width: 80%;
          max-width: 320px;
          height: 100%;
          background-color: var(--bg-white);
          box-shadow: var(--shadow-lg);
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .drawer-divider {
          height: 1px;
          background-color: var(--border);
          margin-bottom: 20px;
        }
        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .drawer-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: var(--radius-md);
          font-size: 15px;
          font-weight: 500;
          color: var(--text-medium);
          text-align: left;
          width: 100%;
          transition: var(--transition);
        }
        .drawer-link.active {
          background-color: var(--bg-pink);
          color: var(--primary);
          font-weight: 600;
        }
        .drawer-icon {
          color: var(--text-light);
        }
        .drawer-link.active .drawer-icon {
          color: var(--primary);
        }
        .drawer-footer {
          margin-top: auto;
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }
        .drawer-footer p {
          font-family: var(--font-serif);
          font-size: 14px;
          color: var(--primary);
          margin-bottom: 4px;
        }
        .drawer-footer span {
          font-size: 11px;
          color: var(--text-light);
          letter-spacing: 0.5px;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-in {
          animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}
