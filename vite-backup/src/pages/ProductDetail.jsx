import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, Star, Heart, CheckCircle2, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { 
    products, 
    selectedProductId, 
    setCurrentPage, 
    addToCart, 
    wishlist, 
    toggleWishlist 
  } = useContext(AppContext);

  // Find selected product
  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'Default');
  const [openAccordions, setOpenAccordions] = useState({ 0: true }); // First accordian open by default
  const [addedMessage, setAddedMessage] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  // Toggle accordian panels
  const toggleAccordion = (index) => {
    setOpenAccordions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Find related products (same category or best sellers, excluding current)
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 2);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, 1, selectedSize);
    setCurrentPage('checkout');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="detail-container animate-fade-up">
        {/* Back and Wishlist Header */}
        <div className="detail-nav-header">
          <button className="nav-circle-btn" onClick={() => setCurrentPage('shop')}>
            <ArrowLeft size={18} />
          </button>
          <button 
            className={`nav-circle-btn ${isWishlisted ? 'liked' : ''}`} 
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart size={18} fill={isWishlisted ? 'var(--primary)' : 'none'} color={isWishlisted ? 'var(--primary)' : 'var(--text-dark)'} />
          </button>
        </div>

        {/* Product Image */}
        <div className="detail-img-showcase">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Product Specs */}
        <div className="detail-info-section">
          {product.bestSeller && (
            <span className="badge badge-sale detail-bestseller-badge">BEST SELLER</span>
          )}
          
          <div className="title-price-row">
            <h1 className="detail-title">{product.name}</h1>
            <span className="detail-price">₹{product.price}</span>
          </div>

          <div className="detail-rating-row">
            <div className="stars-wrapper">
              <Star size={14} fill="var(--accent)" color="var(--accent)" />
              <span className="rating-score">{product.rating}</span>
            </div>
            <span className="review-count">({product.reviewsCount} reviews)</span>
          </div>

          {/* Stock Notification */}
          {product.stock <= 6 && (
            <div className="stock-alert-banner">
              <ShieldAlert size={14} />
              <span>Only {product.stock} left in stock - order soon!</span>
            </div>
          )}

          <p className="detail-description">{product.description}</p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="size-selector-section">
              <h4>SELECT SIZE</h4>
              <div className="size-pills">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-pill-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* The Science Accordion */}
          <div className="science-accordion-section">
            <h3>The Science</h3>
            <div className="accordion-list">
              {product.science && product.science.map((sci, idx) => {
                const isOpen = !!openAccordions[idx];
                return (
                  <div key={idx} className="accordion-item">
                    <button className="accordion-header" onClick={() => toggleAccordion(idx)}>
                      <span>{sci.title}</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isOpen && (
                      <div className="accordion-content">
                        <p>{sci.text}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real Results Reviews */}
          <div className="results-reviews-section">
            <div className="section-header">
              <h3>Real Results</h3>
              <button className="text-link-btn" onClick={() => alert("Review submissions are coming soon!")}>See All</button>
            </div>
            
            <div className="reviews-slider">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev, idx) => (
                  <div key={idx} className="customer-review-card">
                    <div className="review-card-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill={i < rev.rating ? "var(--accent)" : "none"} color="var(--accent)" />
                      ))}
                    </div>
                    <p className="review-card-text">"{rev.comment}"</p>
                    <div className="review-card-author">
                      <span className="author-initials">{rev.name.split(' ').map(n=>n[0]).join('')}</span>
                      <div>
                        <h4>{rev.name}</h4>
                        {rev.verified && (
                          <span className="verified-purchaser">
                            <CheckCircle2 size={10} color="var(--success)" /> Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="customer-review-card no-reviews">
                  <p>Be the first to leave a review for this product!</p>
                  <div className="review-card-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} color="var(--border-focus)" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Complete Your Routine */}
          <div className="routine-section">
            <h3>Complete Your Routine</h3>
            <div className="routine-grid">
              {relatedProducts.map((p) => (
                <div key={p.id} className="routine-card-wrapper" onClick={() => {
                  setSelectedProductId(p.id);
                  setSelectedSize(p.sizes ? p.sizes[0] : 'Default');
                  window.scrollTo(0, 0);
                }}>
                  <div className="routine-img-box">
                    <img src={p.image} alt={p.name} />
                  </div>
                  <h4>{p.name}</h4>
                  <span>₹{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Success Toast */}
        {addedMessage && (
          <div className="success-toast-message">
            Added {product.name} ({selectedSize}) to cart!
          </div>
        )}

        {/* Fixed Bottom Action Sheet */}
        <div className="sticky-action-sheet">
          <button className="btn btn-secondary action-sheet-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="btn btn-primary action-sheet-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>

      <style>{`
        .detail-container {
          position: relative;
          padding-bottom: 96px; /* Space for the sticky bottom sheet */
        }
        .detail-nav-header {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          z-index: 10;
        }
        .nav-circle-btn {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }
        .nav-circle-btn.liked {
          background-color: var(--bg-pink);
        }
        
        /* Product Image Showcase */
        .detail-img-showcase {
          width: 100%;
          height: 420px;
          background-color: var(--bg-cream);
          overflow: hidden;
        }
        .detail-img-showcase img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Product specs content info */
        .detail-info-section {
          padding: 24px 16px;
          background-color: var(--bg-white);
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          margin-top: -20px;
          position: relative;
          z-index: 5;
          text-align: left;
        }
        .detail-bestseller-badge {
          margin-bottom: 12px;
          font-weight: 600;
        }
        .title-price-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 8px;
        }
        .detail-title {
          font-size: 24px;
          font-weight: 500;
          color: var(--text-dark);
          line-height: 1.2;
        }
        .detail-price {
          font-family: var(--font-sans);
          font-size: 24px;
          font-weight: 600;
          color: var(--text-dark);
        }
        
        .detail-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
        }
        .stars-wrapper {
          display: flex;
          align-items: center;
          gap: 4px;
          background-color: var(--bg-peach);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }
        .rating-score {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-dark);
        }
        .review-count {
          font-size: 12px;
          color: var(--text-light);
          font-weight: 500;
        }
        
        /* Stock alerts */
        .stock-alert-banner {
          background-color: var(--danger-light);
          border: 1px solid rgba(163, 92, 92, 0.2);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--danger);
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .detail-description {
          font-size: 14px;
          color: var(--text-medium);
          line-height: 1.5;
          margin-bottom: 24px;
        }

        /* Size Select */
        .size-selector-section {
          margin-bottom: 28px;
        }
        .size-selector-section h4 {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          color: var(--text-light);
          margin-bottom: 10px;
        }
        .size-pills {
          display: flex;
          gap: 10px;
        }
        .size-pill-btn {
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-dark);
          background-color: var(--bg-white);
        }
        .size-pill-btn.active {
          border-color: var(--primary);
          background-color: var(--primary);
          color: var(--bg-white);
          box-shadow: 0 4px 10px rgba(107, 83, 76, 0.15);
        }

        /* Accordian */
        .science-accordion-section {
          margin-bottom: 28px;
        }
        .science-accordion-section h3 {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .accordion-list {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .accordion-item {
          border-bottom: 1px solid var(--border);
        }
        .accordion-item:last-child {
          border-bottom: none;
        }
        .accordion-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dark);
          background-color: var(--bg-cream);
        }
        .accordion-content {
          padding: 16px;
          background-color: var(--bg-white);
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-medium);
        }

        /* Results / Reviews */
        .results-reviews-section {
          margin-bottom: 28px;
        }
        .results-reviews-section h3 {
          font-size: 18px;
          font-weight: 500;
        }
        .reviews-slider {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 4px 0 16px;
          scrollbar-width: none;
        }
        .reviews-slider::-webkit-scrollbar {
          display: none;
        }
        .customer-review-card {
          min-width: 250px;
          max-width: 250px;
          background-color: var(--bg-cream);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .customer-review-card.no-reviews {
          min-width: 100%;
          align-items: center;
          text-align: center;
        }
        .review-card-stars {
          display: flex;
          gap: 3px;
        }
        .review-card-text {
          font-size: 13px;
          font-style: italic;
          color: var(--text-medium);
          line-height: 1.4;
          height: 54px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .review-card-author {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }
        .author-initials {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background-color: var(--primary);
          color: var(--bg-white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
        }
        .review-card-author h4 {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
        }
        .verified-purchaser {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          color: var(--success);
          font-weight: 500;
        }

        /* Routine Section */
        .routine-section h3 {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .routine-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .routine-card-wrapper {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 8px;
          cursor: pointer;
          transition: var(--transition);
        }
        .routine-img-box {
          height: 110px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background-color: var(--bg-cream);
          margin-bottom: 6px;
        }
        .routine-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .routine-card-wrapper h4 {
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 500;
          color: var(--text-dark);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .routine-card-wrapper span {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-light);
        }

        /* Floating Toast */
        .success-toast-message {
          position: fixed;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(44, 34, 30, 0.95);
          color: var(--bg-white);
          padding: 12px 24px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 500;
          box-shadow: var(--shadow-lg);
          z-index: 1000;
        }

        /* Sticky Action Sheet bottom bar */
        .sticky-action-sheet {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: var(--app-max-width);
          background-color: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(16px);
          border-top: 1px solid var(--border);
          padding: 12px 16px;
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 12px;
          z-index: 995;
          box-shadow: 0 -8px 24px rgba(107, 83, 76, 0.08);
        }
        .action-sheet-btn {
          height: 48px;
          font-weight: 600;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}
