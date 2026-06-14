import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Home, Search, Heart, User, ShoppingBag } from 'lucide-react';

export default function BottomNav() {
  const { currentPage, setCurrentPage, cart } = useContext(AppContext);

  const navItems = [
    { name: 'Home', page: 'home', icon: Home },
    { name: 'Shop', page: 'shop', icon: Search },
    { name: 'Wishlist', page: 'wishlist', icon: Heart },
    { name: 'Account', page: 'dashboard', icon: User },
  ];

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="bottom-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.page || 
            (item.page === 'dashboard' && currentPage === 'login') ||
            (item.page === 'shop' && currentPage === 'product-detail');
          
          return (
            <button
              key={item.page}
              className={`bottom-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.page)}
            >
              <div className="icon-wrapper">
                <IconComponent size={20} />
                {item.page === 'cart' && totalItems > 0 && (
                  <span className="badge-count">{totalItems}</span>
                )}
              </div>
              <span className="bottom-nav-text">{item.name}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: var(--app-max-width);
          height: 64px;
          background-color: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          border-top: 1px solid var(--border);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          align-items: center;
          justify-items: center;
          z-index: 990;
          box-shadow: 0 -4px 16px rgba(107, 83, 76, 0.04);
        }
        .bottom-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: var(--text-light);
          width: 100%;
          height: 100%;
          transition: var(--transition);
        }
        .bottom-nav-btn:active {
          color: var(--primary);
        }
        .bottom-nav-btn.active {
          color: var(--primary);
        }
        .icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bottom-nav-text {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2px;
        }
        .bottom-nav-btn.active .bottom-nav-text {
          font-weight: 600;
        }
        .badge-count {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: var(--primary);
          color: var(--bg-white);
          font-size: 9px;
          font-weight: 600;
          width: 14px;
          height: 14px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
