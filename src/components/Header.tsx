'use client';

import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Menu, ShoppingBag, X, Heart, User, Search, Award, Info, MessageCircle, Sparkles, ShieldAlert, LogOut, ChevronDown } from 'lucide-react';

export default function Header() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { 
    cart, 
    wishlist, 
    currentPage, 
    setCurrentPage, 
    currentUser, 
    setCurrentUser, 
    products, 
    searchQuery, 
    setSearchQuery,
    isScrollingDown
  } = context;

  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) {
        setShowSuggestionsList(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowSuggestionsList(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setShowSuggestionsList(true);
    // If user starts searching, automatically go to the Shop page to show results
    if (val.trim().length > 0 && currentPage !== 'shop') {
      setCurrentPage('shop');
    }
  };

  const handleSelectCategorySuggestion = (category: string) => {
    setSearchQuery(category);
    setShowSuggestionsList(false);
    if (currentPage !== 'shop') {
      setCurrentPage('shop');
    }
  };

  const handleSelectProductSuggestion = (productId: string) => {
    context.setSelectedProductId(productId);
    setSearchQuery('');
    setShowSuggestionsList(false);
    setCurrentPage('product-detail');
    window.scrollTo(0, 0);
  };

  const matchingCategories = searchQuery.trim().length > 1
    ? ['Facewash', 'Sunscreen', 'Serum', 'Moisturizer', 'Lip Care', 'Hair Care', 'Makeup', 'Body Wash']
        .filter(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const matchingProducts = searchQuery.trim().length > 1
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const showSuggestions = searchQuery.trim().length > 1 && (matchingCategories.length > 0 || matchingProducts.length > 0);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setCurrentPage('home');
      setUserDropdownOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const menuItems = [
    { name: 'Home', page: 'home', icon: Sparkles },
    { name: 'Shop All', page: 'shop', icon: ShoppingBag },
    { name: 'Wishlist', page: 'wishlist', icon: Heart },
    { name: 'Cart', page: 'cart', icon: ShoppingBag },
    { name: 'Account', page: 'dashboard', icon: User },
    { name: 'Support', page: 'support', icon: MessageCircle },
  ];


  return (
    <>
      {/* Stick Top Navbar for BOTH Mobile & Desktop */}
      <header className={`sticky top-0 z-50 w-full border-b border-border-lumi transition-all duration-300 ${
        isScrollingDown ? 'bg-white/80 backdrop-blur-lg shadow-xs opacity-90' : 'bg-white/95 backdrop-blur-md'
      }`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${
          isScrollingDown ? 'h-11 md:h-16' : 'h-16'
        }`}>
          
          {/* LEFT: Mobile hamburger / Desktop Logo */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 rounded-full active:bg-bg-pink text-text-dark" 
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div 
              className={`font-serif font-semibold tracking-[3px] text-text-dark cursor-pointer select-none transition-all duration-300 ${
                isScrollingDown ? 'text-sm md:text-2xl' : 'text-lg md:text-2xl'
              }`} 
              onClick={() => navigateTo('home')}
            >
              LUMIÈRE
            </div>
          </div>

          {/* MIDDLE: Desktop Navigation Links (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <button
                key={item.page}
                className={`text-sm font-medium tracking-wider uppercase transition-colors hover:text-primary ${
                  currentPage === item.page ? 'text-primary font-semibold border-b-2 border-primary py-1' : 'text-text-medium'
                }`}
                onClick={() => navigateTo(item.page)}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* RIGHT: Search, Wishlist, Cart, Profile */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Desktop Search Bar (hidden on mobile) */}
            <div className="hidden lg:flex items-center relative w-60" ref={desktopSearchRef}>
              <input 
                type="text" 
                placeholder="Search beauty rituals..." 
                className="w-full pl-9 pr-8 py-2 border border-border-lumi bg-bg-cream rounded-full text-xs font-sans focus:outline-none focus:border-primary focus:bg-white transition-all text-text-dark"
                value={searchQuery}
                onFocus={() => setShowSuggestionsList(true)}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <Search size={14} className="absolute left-3 text-text-light" />
              {searchQuery && (
                <button 
                  onClick={() => handleSearchChange('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-dark"
                >
                  <X size={12} />
                </button>
              )}
              
              {/* Suggestions dropdown */}
              {showSuggestionsList && showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border-lumi rounded-2xl shadow-xl z-50 p-3 max-h-80 overflow-y-auto animate-fade-up">
                  {matchingCategories.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[10px] font-bold text-text-light uppercase tracking-wider block mb-1">Categories</span>
                      <div className="flex flex-col gap-1">
                        {matchingCategories.map(cat => (
                          <button 
                            key={cat}
                            className="text-left text-xs font-semibold text-text-medium hover:text-primary hover:bg-bg-pink px-2.5 py-1.5 rounded-lg transition-colors"
                            onClick={() => handleSelectCategorySuggestion(cat)}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {matchingProducts.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-text-light uppercase tracking-wider block mb-1">Products</span>
                      <div className="flex flex-col gap-1">
                        {matchingProducts.map(p => (
                          <button 
                            key={p.id}
                            className="text-left text-xs text-text-medium hover:text-primary hover:bg-bg-pink px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-2 w-full"
                            onClick={() => handleSelectProductSuggestion(p.id)}
                          >
                            <img src={p.image} alt="" className="w-6 h-6 rounded-md object-cover border border-border-lumi" />
                            <span className="truncate">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Link (hidden on mobile top header, bottom nav handles it) */}
            <button 
              onClick={() => navigateTo('wishlist')} 
              className="hidden md:flex p-2 rounded-full hover:bg-bg-pink text-text-dark relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button 
              onClick={() => navigateTo('cart')} 
              className="p-2 rounded-full hover:bg-bg-pink text-text-dark relative"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Desktop Account Menu Dropdown (hidden on mobile, bottom nav handles account tab) */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              {currentUser ? (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)} 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-bg-pink text-text-dark transition-colors font-medium text-sm"
                  >
                    <User size={16} />
                    <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-border-lumi rounded-xl shadow-lg py-2 z-50 animate-fade-up">
                      <div className="px-4 py-2 border-b border-border-lumi text-xs text-text-light">
                        Signed in as <br />
                        <strong className="text-text-dark truncate block">{currentUser.email}</strong>
                      </div>
                      
                      <button 
                        onClick={() => navigateTo('dashboard')} 
                        className="w-full text-left px-4 py-2.5 text-sm text-text-medium hover:bg-bg-pink hover:text-primary flex items-center gap-2"
                      >
                        <User size={14} /> My Profile
                      </button>

                      {['Super Admin', 'Admin', 'Staff'].includes(currentUser.role) && (
                        <button 
                          onClick={() => navigateTo('admin')} 
                          className="w-full text-left px-4 py-2.5 text-sm text-text-medium hover:bg-bg-pink hover:text-primary flex items-center gap-2 font-semibold"
                        >
                          <ShieldAlert size={14} /> Admin Portal
                        </button>
                      )}
                      
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/10 flex items-center gap-2 border-t border-border-lumi"
                      >
                        <LogOut size={14} /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => navigateTo('login')}
                  className="px-4 py-2 rounded-full border border-primary text-primary font-semibold text-xs tracking-wider uppercase hover:bg-bg-pink transition-all"
                >
                  Sign In
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Search Bar - sticky below header (visible on sm/md, hidden on lg) */}
      <div 
        className={`lg:hidden w-full transition-all duration-300 border-b border-border-lumi sticky z-30 ${
          isScrollingDown 
            ? 'top-11 py-1.5 bg-white/80 backdrop-blur-lg opacity-85 shadow-xs px-4' 
            : 'top-16 py-2.5 bg-white opacity-100 shadow-xs px-4'
        }`} 
        ref={mobileSearchRef}
      >
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Search beauty rituals..." 
            className="w-full pl-9 pr-8 py-2 border border-border-lumi bg-bg-cream rounded-full text-xs font-sans focus:outline-none focus:border-primary focus:bg-white transition-all text-text-dark"
            value={searchQuery}
            onFocus={() => setShowSuggestionsList(true)}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
          {searchQuery && (
            <button 
              onClick={() => handleSearchChange('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-dark"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Suggestions dropdown for mobile */}
        {showSuggestionsList && showSuggestions && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-border-lumi rounded-2xl shadow-xl z-50 p-3 max-h-60 overflow-y-auto animate-fade-up">
            {matchingCategories.length > 0 && (
              <div className="mb-3">
                <span className="text-[9px] font-bold text-text-light uppercase tracking-wider block mb-1">Categories</span>
                <div className="flex flex-col gap-1">
                  {matchingCategories.map(cat => (
                    <button 
                      key={cat}
                      className="text-left text-xs font-semibold text-text-medium hover:text-primary hover:bg-bg-pink px-2.5 py-1.5 rounded-lg transition-colors"
                      onClick={() => handleSelectCategorySuggestion(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {matchingProducts.length > 0 && (
              <div>
                <span className="text-[9px] font-bold text-text-light uppercase tracking-wider block mb-1">Products</span>
                <div className="flex flex-col gap-1">
                  {matchingProducts.map(p => (
                    <button 
                      key={p.id}
                      className="text-left text-xs text-text-medium hover:text-primary hover:bg-bg-pink px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-2 w-full"
                      onClick={() => handleSelectProductSuggestion(p.id)}
                    >
                      <img src={p.image} alt="" className="w-6 h-6 rounded-md object-cover border border-border-lumi" />
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Drawer (hidden on desktop screens) */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-text-dark/40 backdrop-blur-xs flex animate-fade-in" onClick={() => setMenuOpen(false)}>
          <div className="w-[280px] h-full bg-white shadow-2xl p-6 flex flex-col gap-6 animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <span className="text-xl font-serif tracking-[2.5px] text-text-dark">LUMIÈRE</span>
              <button onClick={() => setMenuOpen(false)}>
                <X size={22} className="text-text-dark" />
              </button>
            </div>
            
            <div className="h-[1px] bg-border-lumi"></div>
            
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.page}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                      currentPage === item.page ? 'bg-bg-pink text-primary font-semibold' : 'text-text-medium hover:bg-bg-cream'
                    }`}
                    onClick={() => navigateTo(item.page)}
                  >
                    <Icon size={18} className={currentPage === item.page ? 'text-primary' : 'text-text-light'} />
                    <span>{item.name}</span>
                  </button>
                );
              })}

              {/* Show admin route on mobile if logged in */}
              {currentUser && ['Super Admin', 'Admin', 'Staff'].includes(currentUser.role) && (
                <button
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-colors ${
                    currentPage === 'admin' ? 'bg-bg-pink text-primary' : 'text-text-medium hover:bg-bg-cream'
                  }`}
                  onClick={() => navigateTo('admin')}
                >
                  <ShieldAlert size={18} className="text-text-light" />
                  <span>Admin Portal</span>
                </button>
              )}
            </nav>

            <div className="mt-auto border-t border-border-lumi pt-4 text-center">
              {currentUser ? (
                <div className="flex flex-col gap-3">
                  <div className="text-xs text-text-medium">
                    Logged in as <strong>{currentUser.name}</strong>
                  </div>
                  <button onClick={handleLogout} className="btn btn-secondary flex items-center justify-center gap-2 text-danger border-danger/20 bg-danger/5">
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              ) : (
                <button onClick={() => navigateTo('login')} className="btn btn-primary">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
