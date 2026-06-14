'use client';

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { ArrowDownAZ, Filter } from 'lucide-react';
import { Product } from '@/lib/db';

export default function Shop() {
  const context = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  if (!context) return null;
  const { products, searchQuery, setSearchQuery } = context;

  const categories = [
    'All',
    'Facewash',
    'Sunscreen',
    'Moisturizer',
    'Serum',
    'Lip Care',
    'Lipstick',
    'Hair Care',
    'Body Wash',
    'Beauty Kits',
    'Makeup'
  ];

  // Filter products by category and search query
  const filteredProducts = products.filter((p: Product) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // Default/recommended
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      
      {/* Page Header */}
      <div className="text-left border-b border-border-lumi pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-text-dark">Rituals Catalog</h1>
        <p className="text-xs sm:text-sm text-text-light mt-1">Formulated with biocompatible ingredients and dermatological science.</p>
      </div>

      {/* Main Grid: Sidebar Filters (Desktop) + Product Catalog */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT: Sidebar Filters (Visible on Desktop only) */}
        <aside className="hidden md:flex flex-col gap-6 w-60 shrink-0 border-r border-border-lumi pr-6 text-left">
          <div className="flex items-center gap-2 text-primary font-serif font-semibold border-b border-border-lumi pb-2">
            <Filter size={16} />
            <span>Category Filters</span>
          </div>
          <nav className="flex flex-col gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-text-medium hover:bg-bg-pink hover:text-primary'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>
        </aside>

        {/* Categories Pills scroll for Mobile/Tablet only */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-3 scrollbar-none select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-primary text-white border-primary shadow-sm' 
                  : 'bg-white border-border-lumi text-text-medium active:bg-bg-pink'
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* RIGHT: Catalog Results & Grid */}
        <div className="flex-grow flex flex-col gap-4">
          
          {/* Catalog Toolbar */}
          <div className="flex items-center justify-between border-b border-border-lumi pb-4">
            <span className="text-xs sm:text-sm font-semibold text-text-medium">
              Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
            </span>

            <div className="flex items-center gap-2 bg-bg-peach border border-border-lumi py-1.5 px-3 rounded-xl">
              <ArrowDownAZ size={14} className="text-text-light" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-semibold text-text-dark cursor-pointer font-sans"
                aria-label="Sort products by"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid list of Products */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-up">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-border-lumi rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-md mx-auto mt-8">
              <p className="text-sm text-text-medium font-medium">
                {searchQuery.trim() 
                  ? `No products found matching "${searchQuery}"` 
                  : "No products found in this category."}
              </p>
              <button 
                className="btn btn-primary text-xs" 
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
