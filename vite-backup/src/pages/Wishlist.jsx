import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export default function Wishlist() {
  const { products, wishlist, setCurrentPage } = useContext(AppContext);

  const favoritedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <>
      <div className="wishlist-page-container animate-fade-up">
        <div className="wishlist-page-header">
          <Heart size={28} color="var(--primary)" fill="var(--primary)" />
          <h1>Your Favorites</h1>
          <p>Curated list of premium products you've added to your ritual.</p>
        </div>

        {favoritedProducts.length === 0 ? (
          <div className="empty-wishlist-box">
            <div className="empty-wishlist-icon">
              <Heart size={38} color="var(--text-light)" />
            </div>
            <h3>Your Wishlist is Empty</h3>
            <p>Tap the heart icon on any product to save it here for later.</p>
            <button className="btn btn-primary" onClick={() => setCurrentPage('shop')}>
              Explore Shop
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {favoritedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .wishlist-page-container {
          padding: 20px 16px 32px;
          text-align: left;
        }
        .wishlist-page-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .wishlist-page-header h1 {
          font-size: 24px;
          font-weight: 500;
          margin-top: 8px;
          margin-bottom: 4px;
        }
        .wishlist-page-header p {
          font-size: 13px;
          color: var(--text-light);
          line-height: 1.4;
          max-width: 280px;
          margin: 0 auto;
        }
        
        .wishlist-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .empty-wishlist-box {
          padding: 48px 16px;
          text-align: center;
          background-color: var(--bg-cream);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .empty-wishlist-icon {
          width: 70px;
          height: 70px;
          border-radius: var(--radius-full);
          background-color: var(--bg-white);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }
        .empty-wishlist-box h3 {
          font-size: 16px;
          font-weight: 600;
        }
        .empty-wishlist-box p {
          font-size: 13px;
          color: var(--text-medium);
          max-width: 220px;
        }
      `}</style>
    </>
  );
}
