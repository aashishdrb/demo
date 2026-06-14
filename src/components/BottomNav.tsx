'use client';

import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Home, Search, Heart, User, ShoppingBag } from 'lucide-react';


export default function BottomNav() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { currentPage, setCurrentPage, wishlist, cart, isScrollingDown } = context;

  const navItems = [
    { name: 'Home', page: 'home', icon: Home },
    { name: 'Shop', page: 'shop', icon: Search },
    { name: 'Cart', page: 'cart', icon: ShoppingBag },
    { name: 'Wishlist', page: 'wishlist', icon: Heart },
    { name: 'Account', page: 'dashboard', icon: User },
  ];

  return (
    <>
      {/* Stick Bottom bar - Hidden on Desktop and Tablet (md:hidden) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t border-border-lumi grid grid-cols-5 items-center justify-items-center z-40 transition-all duration-300 ${
        isScrollingDown 
          ? 'h-[50px] bg-white/80 backdrop-blur-lg opacity-85 shadow-md' 
          : 'h-16 bg-white/96 backdrop-blur-md shadow-lg'
      }`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page || 
            (item.page === 'dashboard' && (currentPage === 'login' || currentPage === 'admin')) ||
            (item.page === 'shop' && currentPage === 'product-detail');
          
          return (
            <button
              key={item.page}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                isScrollingDown ? 'gap-0.5' : 'gap-1'
              } ${isActive ? 'text-primary' : 'text-text-light'}`}
              onClick={() => {
                setCurrentPage(item.page);
                window.scrollTo(0, 0);
              }}
            >
              <div className="relative">
                <Icon size={isScrollingDown ? 17 : 20} className="transition-all duration-300" />
                {item.page === 'wishlist' && wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {wishlist.length}
                  </span>
                )}
                {item.page === 'cart' && cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-wide transition-all duration-300 ${
                isScrollingDown ? 'text-[9px] scale-90' : ''
              } ${isActive ? 'font-semibold text-primary' : 'text-text-light'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

