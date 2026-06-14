'use client';

import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

export default function Wishlist() {
  const context = useContext(AppContext);
  if (!context) return null;
  const { products, wishlist, setCurrentPage } = context;

  const favoritedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-up text-left font-sans">
      
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-2 mb-8">
        <Heart size={28} className="text-primary fill-primary animate-pulse" />
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-text-dark">Your Favorites</h1>
        <p className="text-xs sm:text-sm text-text-light max-w-md">
          Curated list of premium products you\'ve added to your ritual.
        </p>
      </div>

      {favoritedProducts.length === 0 ? (
        <div className="bg-white border border-border-lumi rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-bg-peach flex items-center justify-center text-text-light border border-border-lumi shadow-inner">
            <Heart size={28} />
          </div>
          <h3 className="text-base font-bold text-text-dark">Your Wishlist is Empty</h3>
          <p className="text-xs text-text-medium max-w-xs leading-relaxed">
            Tap the heart icon on any product card in the catalog to save it here for later.
          </p>
          <button 
            className="btn btn-primary mt-2 px-8 py-3 text-xs font-semibold uppercase tracking-wider" 
            onClick={() => setCurrentPage('shop')}
          >
            Explore Shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoritedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
