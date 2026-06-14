import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Heart, Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist, addToCart, setCurrentPage, setSelectedProductId } = useContext(AppContext);
  
  const isWishlisted = wishlist.includes(product.id);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setCurrentPage('product-detail');
    window.scrollTo(0, 0);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <>
      <div className="product-card animate-fade-up" onClick={handleCardClick}>
        {/* Wishlist Heart Icon */}
        <button 
          className={`wishlist-icon-btn ${isWishlisted ? 'liked' : ''}`}
          onClick={handleWishlistClick}
          aria-label="Toggle Wishlist"
        >
          <Heart size={18} fill={isWishlisted ? 'var(--primary)' : 'none'} color={isWishlisted ? 'var(--primary)' : 'var(--text-dark)'} />
        </button>

        {/* Product Image */}
        <div className="product-img-wrapper">
          <img src={product.image} alt={product.name} loading="lazy" />
          {product.stock <= 6 && (
            <span className="product-stock-tag">Only {product.stock} left</span>
          )}
        </div>

        {/* Product Meta */}
        <div className="product-info-wrapper">
          <span className="product-card-category">{product.category}</span>
          <h3 className="product-card-title">{product.name}</h3>
          
          <div className="product-card-rating">
            <Star size={13} fill="var(--accent)" color="var(--accent)" />
            <span>{product.rating} ({product.reviewsCount} reviews)</span>
          </div>

          <div className="product-card-footer">
            <span className="product-card-price">₹{product.price}</span>
            <button className="quick-add-btn" onClick={handleQuickAdd} aria-label="Add to Cart">
              <ShoppingCart size={15} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .product-card {
          min-width: 175px;
          width: 100%;
          background-color: var(--bg-white);
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-focus);
        }
        .wishlist-icon-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          border-radius: var(--radius-full);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }
        .wishlist-icon-btn.liked {
          background-color: var(--bg-pink);
        }
        .product-img-wrapper {
          position: relative;
          width: 100%;
          height: 190px;
          background-color: var(--bg-cream);
          overflow: hidden;
        }
        .product-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .product-card:hover .product-img-wrapper img {
          transform: scale(1.06);
        }
        .product-stock-tag {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background-color: var(--danger-light);
          color: var(--danger);
          font-size: 9px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .product-info-wrapper {
          padding: 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .product-card-category {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
        }
        .product-card-title {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-dark);
          margin-bottom: 6px;
          line-height: 1.3;
          height: 36px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-card-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
        }
        .product-card-rating span {
          font-size: 11px;
          color: var(--text-light);
          font-weight: 500;
        }
        .product-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .product-card-price {
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 600;
          color: var(--text-dark);
        }
        .quick-add-btn {
          background-color: var(--bg-pink);
          color: var(--primary);
          border-radius: var(--radius-full);
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .quick-add-btn:active {
          background-color: var(--primary);
          color: var(--bg-white);
        }
      `}</style>
    </>
  );
}
