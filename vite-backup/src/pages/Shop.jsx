import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, ArrowDownAZ } from 'lucide-react';

export default function Shop() {
  const { products } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  const categories = [
    'All',
    'Facewash',
    'Sunscreen',
    'Moisturizer',
    'Serum',
    'Lip Balm',
    'Lipstick',
    'Hair Care',
    'Body Wash',
    'Beauty Kits',
    'Makeup'
  ];

  // Filter products by category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // Default/recommended (original order)
  });

  return (
    <>
      <div className="shop-container animate-fade-up">
        {/* Shop Header */}
        <div className="shop-header">
          <h1>Rituals Catalog</h1>
          <p>Luxurious clean beauty formulated with modern dermatological science.</p>
        </div>

        {/* Categories Pills (Horizontal Scroll) */}
        <div className="category-pills-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters and sorting panel */}
        <div className="shop-toolbar">
          <span className="results-count">
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
          </span>
          
          <div className="sort-selector-wrapper">
            <ArrowDownAZ size={16} color="var(--text-medium)" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-dropdown"
              aria-label="Sort products by"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="products-grid">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-shop-state">
            <p>No products found in this category.</p>
            <button className="btn btn-primary" onClick={() => setSelectedCategory('All')}>
              Show All Products
            </button>
          </div>
        )}
      </div>

      <style>{`
        .shop-container {
          padding: 20px 16px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .shop-header h1 {
          font-size: 26px;
          margin-bottom: 4px;
        }
        .shop-header p {
          font-size: 13px;
          color: var(--text-light);
          line-height: 1.4;
        }

        /* Category Pills scrollable row */
        .category-pills-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 4px 0 10px;
          scrollbar-width: none;
        }
        .category-pills-row::-webkit-scrollbar {
          display: none;
        }
        .category-pill {
          padding: 8px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          background-color: var(--bg-white);
          color: var(--text-medium);
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          transition: var(--transition);
        }
        .category-pill.active {
          background-color: var(--primary);
          color: var(--bg-white);
          border-color: var(--primary);
          box-shadow: 0 4px 10px rgba(107, 83, 76, 0.15);
        }

        /* Toolbar */
        .shop-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .results-count {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-medium);
        }
        .sort-selector-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: var(--bg-cream);
          padding: 6px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
        }
        .sort-dropdown {
          border: none;
          background: none;
          font-family: var(--font-sans);
          font-size: 13px;
          color: var(--text-dark);
          font-weight: 500;
          outline: none;
          cursor: pointer;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Empty shop state */
        .empty-shop-state {
          padding: 48px 16px;
          text-align: center;
          background-color: var(--bg-cream);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .empty-shop-state p {
          color: var(--text-medium);
          font-size: 15px;
        }
      `}</style>
    </>
  );
}
