'use client';

import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/db';

export default function ProductCard({ product }: { product: Product }) {
  const context = useContext(AppContext);
  if (!context) return null;

  const { wishlist, toggleWishlist, addToCart, setCurrentPage, setSelectedProductId, setBuyNowItem } = context;
  
  const isWishlisted = wishlist.includes(product.id);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setCurrentPage('product-detail');
    window.scrollTo(0, 0);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      alert(`Added 1 unit of ${product.name} to cart.`);
    } else {
      alert('This product is currently out of stock.');
    }
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock > 0) {
      const selectedSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0].label : 'Standard';
      setBuyNowItem({ product, quantity: 1, selectedSize });
      setCurrentPage('checkout');
      window.scrollTo(0, 0);
    } else {
      alert('This product is currently out of stock.');
    }
  };

  const hasDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <div 
      className="bg-white border border-border-lumi rounded-2xl overflow-hidden relative cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(107,83,76,0.12)] hover:border-primary-light flex flex-col group"
      onClick={handleCardClick}
    >
      {/* Discount Percentage Badge */}
      {hasDiscount && (
        <span className="absolute top-3 left-3 z-10 bg-primary text-white text-[9px] font-bold py-1 px-2.5 rounded-lg shadow-sm">
          {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
        </span>
      )}

      {/* Wishlist Heart Button */}
      <button 
        className={`absolute top-3 right-3 z-10 rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all active:scale-90 ${
          isWishlisted ? 'bg-bg-pink text-primary border border-primary/20' : 'bg-white/90 backdrop-blur-xs text-text-dark hover:bg-bg-pink border border-border-lumi'
        }`}
        onClick={handleWishlistClick}
        aria-label="Toggle Wishlist"
      >
        <Heart size={16} fill={isWishlisted ? 'var(--color-primary)' : 'none'} />
      </button>

      {/* Product Image Frame */}
      <div className="relative w-full aspect-square bg-bg-cream overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Out of Stock Tag */}
        {product.stock === 0 ? (
          <span className="absolute bottom-3 left-3 bg-danger text-white text-[9px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
            Out of Stock
          </span>
        ) : product.stock <= 6 ? (
          <span className="absolute bottom-3 left-3 bg-warning text-white text-[9px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
            Only {product.stock} Left
          </span>
        ) : null}
      </div>

      {/* Product Metadata Info */}
      <div className="p-4 flex flex-col flex-grow gap-2 text-left">
        <span className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="font-sans text-sm font-medium text-text-dark leading-snug line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
        
        {/* Ratings & Size */}
        <div className="flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center gap-1">
            <Star size={12} fill="var(--color-accent-gold)" className="text-accent-gold" />
            <span className="text-[11px] font-semibold text-text-medium">{product.rating || 4.8}</span>
            <span className="text-[10px] text-text-light font-medium">({product.reviewsCount || 10})</span>
          </div>
          <div className="text-[10px] bg-bg-cream border border-border-lumi text-text-medium font-medium px-2 py-0.5 rounded-md">
            {product.sizes && product.sizes.length > 0 ? product.sizes[0].label : 'Standard'}
          </div>
        </div>

        {/* Pricing Layout */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          {hasDiscount ? (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-text-dark">₹{product.discount_price}</span>
                <span className="text-[11px] text-text-light line-through font-medium">₹{product.price}</span>
              </div>
              <span className="text-[9px] font-bold text-success">
                Save ₹{product.price - product.discount_price}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-text-dark">₹{product.price}</span>
          )}
        </div>

        {/* Action Buttons Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-border-lumi">
          <button 
            className={`flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all select-none border border-primary/20 w-full ${
              product.stock > 0 
                ? 'bg-bg-pink text-primary hover:bg-primary hover:text-white' 
                : 'bg-bg-cream text-text-light cursor-not-allowed border-none'
            }`}
            onClick={handleQuickAdd} 
            disabled={product.stock === 0}
            aria-label="Add to Cart"
          >
            Add to Cart
          </button>
          <button 
            className={`flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all select-none w-full ${
              product.stock > 0 
                ? 'bg-primary text-white hover:bg-primary-light shadow-xs active:scale-[0.98]' 
                : 'bg-bg-cream text-text-light cursor-not-allowed'
            }`}
            onClick={handleQuickBuy} 
            disabled={product.stock === 0}
            aria-label="Buy Now"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
