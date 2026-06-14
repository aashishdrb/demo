'use client';

import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Star, Heart, CheckCircle2, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import { Product } from '@/lib/db';
import { getProductSizeDetails } from '@/lib/productUtils';

export default function ProductDetail() {
  const context = useContext(AppContext);
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({ 0: true });
  const [addedMessage, setAddedMessage] = useState(false);

  if (!context) return null;
  const { products, selectedProductId, setCurrentPage, addToCart, wishlist, toggleWishlist, setBuyNowItem, currentUser } = context;

  // Find selected product
  const product = products.find((p: Product) => p.id === selectedProductId) || products[0];

  const activeSizeDetails = getProductSizeDetails(product, selectedSize);
  const currentPrice = activeSizeDetails.price;
  const currentDiscountPrice = activeSizeDetails.discount_price;
  const activeStock = activeSizeDetails.stock;
  const hasDiscount = currentDiscountPrice < currentPrice;
  const discountPercent = hasDiscount ? Math.round(((currentPrice - currentDiscountPrice) / currentPrice) * 100) : 0;
  const savingsAmount = hasDiscount ? currentPrice - currentDiscountPrice : 0;

  const isWishlisted = wishlist.includes(product.id);

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsStats, setReviewsStats] = useState({
    totalCount: 0,
    averageRating: 0.0,
    starBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>
  });
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchReviews = async () => {
    if (!product?.id) return;
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/reviews?productId=${product.id}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setReviewsStats({
          totalCount: data.totalCount,
          averageRating: data.averageRating,
          starBreakdown: data.starBreakdown
        });
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
    setLoadingReviews(false);
  };

  useEffect(() => {
    fetchReviews();
    setUserRating(5);
    setUserComment('');
    setReviewError('');
    setReviewSuccess('');
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0].label);
      } else {
        setSelectedSize('Standard');
      }
    }
  }, [product?.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (userRating < 1 || userRating > 5) {
      setReviewError('Please select a valid rating between 1 and 5.');
      return;
    }
    if (!userComment.trim()) {
      setReviewError('Please write a short comment about your experience.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating: userRating,
          comment: userComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccess('Thank you! Your review has been submitted successfully.');
        setUserComment('');
        setUserRating(5);
        fetchReviews();
      } else {
        setReviewError(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      setReviewError('Network error. Failed to connect to server.');
    }
    setSubmittingReview(false);
  };

  // Toggle accordion panels
  const toggleAccordion = (index: number) => {
    setOpenAccordions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const handleBuyNow = () => {
    setBuyNowItem({
      product,
      quantity: 1,
      selectedSize
    });
    setCurrentPage('checkout');
    window.scrollTo(0, 0);
  };


  // Find related products
  const relatedProducts = products
    .filter((p: Product) => p.id !== product.id)
    .slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 relative pb-24 lg:pb-6">

      {/* Main Grid: Left Image, Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Product Image Showcase (lg:col-span-7) */}
        <div className="lg:col-span-7 w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-bg-cream rounded-3xl overflow-hidden border border-border-lumi">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover select-none pointer-events-none" />
        </div>

        {/* RIGHT: Product Specs & Actions (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          
          <div>
            {product.bestSeller && (
              <span className="bg-bg-pink border border-primary-light/10 text-primary text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider inline-block mb-3">
                BEST SELLER
              </span>
            )}
            
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-text-dark">{product.name}</h1>
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`rounded-full w-10 h-10 flex items-center justify-center border border-border-lumi hover:bg-bg-pink transition-all ${
                  isWishlisted ? 'bg-bg-pink text-primary border-primary-light/15' : 'bg-white text-text-dark'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? 'var(--color-primary)' : 'none'} />
              </button>
            </div>

            {/* Ratings & Price row */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 bg-bg-peach px-2.5 py-1 rounded-lg border border-border-lumi">
                <Star size={14} fill="var(--color-accent-gold)" className="text-accent-gold" />
                <span className="text-xs font-semibold text-text-dark">{product.rating || 4.8}</span>
              </div>
              <span className="text-xs text-text-light font-medium">({product.reviewsCount || 10} customer reviews)</span>
            </div>

            {/* Price section with smooth updates */}
            <div className="mt-4 flex flex-col gap-1.5 transition-all duration-300">
              <div className="flex items-baseline gap-3">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-bold text-text-dark tracking-tight transition-all duration-300 animate-fade-in" key={`${selectedSize}-price`}>
                      ₹{currentDiscountPrice}
                    </span>
                    <span className="text-sm text-text-light line-through font-medium">
                      MRP ₹{currentPrice}
                    </span>
                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/15 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse-slow">
                      {discountPercent}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-text-dark tracking-tight transition-all duration-300 animate-fade-in" key={`${selectedSize}-price`}>
                    ₹{currentPrice}
                  </span>
                )}
              </div>
              
              {hasDiscount && (
                <div className="text-[11px] text-green-700 font-semibold flex items-center gap-1 animate-fade-up">
                  <span>🎉 You save ₹{savingsAmount} on this size!</span>
                </div>
              )}
            </div>
          </div>

          {/* Stock Alerts */}
          {activeStock === 0 ? (
            <div className="bg-danger/10 border border-danger/20 text-danger rounded-xl p-3 flex items-center gap-2 text-xs font-semibold">
              <ShieldAlert size={16} />
              <span>Currently Out of Stock. Join the waitlist or explore other rituals.</span>
            </div>
          ) : activeStock <= 6 ? (
            <div className="bg-warning/10 border border-warning/20 text-warning rounded-xl p-3 flex items-center gap-2 text-xs font-semibold">
              <ShieldAlert size={16} />
              <span>Only {activeStock} left in stock - order soon!</span>
            </div>
          ) : null}

          {/* Product Description */}
          <p className="text-xs sm:text-sm text-text-medium leading-relaxed">{product.description}</p>

          {/* Size Pills Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <h4 className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Select Bottle Size</h4>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz.label;
                  return (
                    <button
                      key={sz.id}
                      className={`px-4.5 py-2.5 border rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-xs active:scale-95 cursor-pointer ${
                        isSelected 
                          ? 'bg-primary text-white border-primary shadow-md scale-105' 
                          : 'bg-white border-border-lumi text-text-medium hover:bg-bg-pink hover:border-primary-light/30'
                      }`}
                      onClick={() => setSelectedSize(sz.label)}
                    >
                      {sz.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Desktop Product Action Pane (Hidden on mobile) */}
          <div className="hidden lg:grid grid-cols-2 gap-4 border-t border-b border-border-lumi py-6">
            <button 
              className="py-4 text-xs font-bold uppercase tracking-widest text-primary border border-primary/30 bg-[#FFF5F6] hover:bg-[#FFF0F2] hover:border-primary/50 rounded-xl shadow-xs hover:shadow-md transition-all duration-300 active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none" 
              onClick={handleAddToCart}
              disabled={activeStock === 0}
            >
              Add to Cart
            </button>
            <button 
              className="py-4 text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-[#6B534C] via-[#83675E] to-[#6B534C] hover:from-[#5C4B45] hover:to-[#6B534C] rounded-xl shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-300 active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none" 
              onClick={handleBuyNow}
              disabled={activeStock === 0}
            >
              Buy Now
            </button>
          </div>


          {/* Accordion Specs */}
          {product.science && (
            <div className="flex flex-col gap-3">
              <h3 className="font-serif text-base font-semibold text-text-dark border-b border-border-lumi pb-2">The Science</h3>
              <div className="border border-border-lumi rounded-2xl overflow-hidden bg-white">
                {product.science.map((sci, idx) => {
                  const isOpen = !!openAccordions[idx];
                  return (
                    <div key={idx} className="border-b border-border-lumi last:border-b-0">
                      <button 
                        className="w-full flex items-center justify-between p-4 bg-bg-cream hover:bg-bg-pink text-xs font-bold uppercase tracking-wider text-text-dark text-left" 
                        onClick={() => toggleAccordion(idx)}
                      >
                        <span>{sci.title}</span>
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      {isOpen && (
                        <div className="p-4 text-xs sm:text-sm text-text-medium leading-relaxed bg-white">
                          <p>{sci.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Related Routine suggestions */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-base font-semibold text-text-dark border-b border-border-lumi pb-2">Complete Your Routine</h3>
            <div className="grid grid-cols-2 gap-4">
              {relatedProducts.map((p) => (
                <div 
                  key={p.id} 
                  className="border border-border-lumi bg-white p-3 rounded-2xl cursor-pointer hover:shadow-sm transition-all"
                  onClick={() => {
                    setCurrentPage('product-detail');
                    // Set selected ID
                    context.setSelectedProductId(p.id);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-bg-cream mb-2">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-xs font-medium text-text-dark truncate">{p.name}</h4>
                  <span className="text-xs font-bold text-text-light">₹{p.price}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <div className="border-t border-border-lumi pt-10 mt-6 flex flex-col gap-8 text-left">
        <h2 className="text-2xl font-serif font-medium text-text-dark">Customer Reviews & Ratings</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Ratings Summary & Star Breakdown (md:col-span-4) */}
          <div className="md:col-span-4 bg-bg-cream border border-border-lumi rounded-3xl p-6 flex flex-col gap-6">
            <div className="text-center md:text-left flex flex-col items-center md:items-start gap-1">
              <span className="text-5xl font-bold text-text-dark">{reviewsStats.averageRating}</span>
              <div className="flex items-center gap-1 my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={18} 
                    fill={star <= Math.round(reviewsStats.averageRating) ? "var(--color-accent-gold)" : "none"} 
                    className={star <= Math.round(reviewsStats.averageRating) ? "text-accent-gold" : "text-text-light"} 
                  />
                ))}
              </div>
              <span className="text-xs text-text-light font-medium">Based on {reviewsStats.totalCount} ratings</span>
            </div>

            {/* Star breakdown progress bars */}
            <div className="flex flex-col gap-3">
              {[5, 4, 3, 2, 1].map((ratingVal) => {
                const count = reviewsStats.starBreakdown[ratingVal] || 0;
                const pct = reviewsStats.totalCount > 0 ? Math.round((count / reviewsStats.totalCount) * 100) : 0;
                return (
                  <div key={ratingVal} className="flex items-center gap-3 text-xs text-text-medium">
                    <span className="w-3 text-right font-bold">{ratingVal}</span>
                    <Star size={11} fill="var(--color-accent-gold)" className="text-accent-gold flex-shrink-0" />
                    <div className="flex-grow h-2 bg-white border border-border-lumi rounded-full overflow-hidden">
                      <div className="h-full bg-accent-gold transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="w-8 text-right text-text-light font-medium">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Write a Review Form & Reviews List (md:col-span-8) */}
          <div className="md:col-span-8 flex flex-col gap-8">
            
            {/* Write a Review Block */}
            <div className="bg-white border border-border-lumi rounded-3xl p-6 flex flex-col gap-4 shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-text-dark">Write your experience</h3>
              
              {currentUser ? (
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  {/* Interactive Stars */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-text-medium uppercase tracking-wider">Select Rating</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                          onClick={() => setUserRating(star)}
                        >
                          <Star 
                            size={24} 
                            fill={star <= userRating ? "var(--color-accent-gold)" : "none"} 
                            className={star <= userRating ? "text-accent-gold" : "text-text-light"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reviewComment" className="text-xs font-semibold text-text-medium uppercase tracking-wider">Your Review Comment</label>
                    <textarea
                      id="reviewComment"
                      rows={3}
                      placeholder="Share details about the texture, fragrance, results, packaging, skin response..."
                      className="w-full px-4 py-3 rounded-xl border border-border-lumi bg-bg-cream text-sm text-text-dark focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                    ></textarea>
                  </div>

                  {reviewError && (
                    <div className="p-4 text-xs font-semibold text-danger bg-red-50/50 border border-red-200/50 rounded-2xl animate-fade-up">
                      {reviewError}
                    </div>
                  )}
                  {reviewSuccess && (
                    <div className="p-4 text-xs font-semibold text-success bg-green-50/50 border border-green-200/50 rounded-2xl animate-fade-up flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping"></span>
                      <span>{reviewSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="group relative bg-gradient-to-r from-[#FCE3E0] via-[#FAF0EC] to-[#EAD6C3] text-primary hover:text-primary-light border border-border-lumi/60 font-bold uppercase tracking-widest text-xs py-3.5 px-10 rounded-full shadow-[0_4px_15px_rgba(107,83,76,0.06)] hover:shadow-[0_8px_25px_rgba(107,83,76,0.15)] hover:scale-103 active:scale-97 transition-all duration-300 ease-out cursor-pointer self-start flex items-center justify-center gap-2 select-none disabled:opacity-75 disabled:pointer-events-none"
                    disabled={submittingReview}
                  >
                    {/* Soft gold/champagne glow background effect on hover */}
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-gold/5 via-transparent to-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></span>

                    {submittingReview ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="relative z-10">Submitting...</span>
                      </>
                    ) : (
                      <span className="relative z-10">Submit Review</span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-gradient-to-br from-bg-pink/40 to-bg-peach/30 border border-border-lumi rounded-3xl p-8 text-center flex flex-col items-center gap-4 shadow-[0_4px_20px_rgba(107,83,76,0.02)]">
                  <p className="text-xs font-medium text-text-medium max-w-sm leading-relaxed">Only registered members can write product reviews. Share your experience by signing in.</p>
                  <button 
                    className="group relative bg-gradient-to-r from-[#FAF4F0] via-[#FFF0F2] to-[#FFF7F2] text-primary hover:text-primary-light border border-border-lumi hover:border-primary-light/30 shadow-[0_4px_12px_rgba(107,83,76,0.04)] hover:shadow-[0_6px_20px_rgba(107,83,76,0.1)] font-semibold uppercase tracking-widest text-[11px] px-8 py-3 rounded-full hover:scale-102 active:scale-98 transition-all duration-300 ease-out cursor-pointer select-none"
                    onClick={() => {
                      setCurrentPage('login');
                      window.scrollTo(0, 0);
                    }}
                  >
                    {/* Soft gold/champagne glow background effect on hover */}
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-gold/5 via-transparent to-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></span>
                    <span className="relative z-10">Login to Write Review</span>
                  </button>
                </div>
              )}
            </div>

            {/* Reviews list */}
            <div className="flex flex-col gap-4">
              <h3 className="font-serif text-lg font-semibold text-text-dark border-b border-border-lumi pb-2">Customer Sentiments</h3>

              {loadingReviews ? (
                <p className="text-xs text-text-light animate-pulse py-4">Fetching live buyer sentiments...</p>
              ) : reviews.length === 0 ? (
                <p className="text-xs text-text-light py-4 italic">No reviews submitted yet for this ritual. Be the first to share!</p>
              ) : (
                // Swipeable on mobile, vertical list on desktop
                <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scroll-smooth snap-x snap-mandatory w-full">
                  {reviews.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="min-w-[280px] max-w-[320px] md:max-w-full flex-shrink-0 md:flex-shrink snap-start bg-white border border-border-lumi p-5 rounded-2xl flex flex-col gap-3 shadow-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-text-dark uppercase tracking-wide truncate max-w-[150px]">{rev.userName}</h4>
                          <span className="text-[10px] text-text-light font-medium">{new Date(rev.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-bg-peach px-2 py-0.5 rounded-lg border border-border-lumi flex-shrink-0">
                          <Star size={11} fill="var(--color-accent-gold)" className="text-accent-gold" />
                          <span className="text-[11px] font-bold text-text-dark">{rev.rating}</span>
                        </div>
                      </div>

                      {rev.verifiedBuyer && (
                        <span className="flex items-center gap-1 text-[10px] text-success font-semibold uppercase tracking-wider">
                          <CheckCircle2 size={11} className="stroke-[2.5]" />
                          <span>Verified Buyer</span>
                        </span>
                      )}

                      <p className="text-xs sm:text-sm text-text-medium leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Floating Success Toast */}
      {addedMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 bg-text-dark text-white text-xs font-medium py-3 px-6 rounded-full shadow-lg z-50 animate-fade-up">
          Added {product.name} to cart.
        </div>
      )}

      {/* Mobile Sticky Action Sheet (Hidden on Desktop lg:hidden) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border-lumi p-4.5 grid grid-cols-2 gap-3.5 z-40 shadow-lg">
        <button 
          className="py-3.5 text-xs font-bold uppercase tracking-widest text-primary border border-primary/30 bg-[#FFF5F6] hover:bg-[#FFF0F2] rounded-xl shadow-xs transition-all active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none" 
          onClick={handleAddToCart}
          disabled={activeStock === 0}
        >
          Add to Cart
        </button>
        <button 
          className="py-3.5 text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-[#6B534C] via-[#83675E] to-[#6B534C] rounded-xl shadow-sm transition-all active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none" 
          onClick={handleBuyNow}
          disabled={activeStock === 0}
        >
          Buy Now
        </button>
      </div>


    </div>
  );
}
