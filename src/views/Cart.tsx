'use client';

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Trash2, Plus, Minus, Ticket, Sparkles, ChevronRight, ShoppingBag, ChevronDown } from 'lucide-react';
import { getProductSizeDetails } from '@/lib/productUtils';

export default function Cart() {
  const context = useContext(AppContext);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [activeDropdownKey, setActiveDropdownKey] = useState<string | null>(null);

  if (!context) return null;
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    updateCartItemSize,
    activeCoupon, 
    setActiveCoupon, 
    coupons, 
    calculateTotals, 
    setCurrentPage,
    setBuyNowItem,
    isScrollingDown
  } = context;

  const { 
    mrpSubtotal, 
    productDiscount, 
    sellingSubtotal, 
    discount, 
    deliveryCharge, 
    gstIncluded, 
    total, 
    customFees 
  } = calculateTotals();

  const totalSavings = productDiscount + discount;

  const [isProceeding, setIsProceeding] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const trimmedCode = couponInput.trim().toUpperCase();
    const coupon = coupons.find(c => c.code === trimmedCode && c.active);

    if (!coupon) {
      setCouponError('Invalid coupon code.');
      return;
    }

    setActiveCoupon(coupon);
    setCouponSuccess(`Coupon "${coupon.code}" applied!`);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  const handleProceedToCheckout = () => {
    if (isProceeding) return;
    setIsProceeding(true);
    setBuyNowItem(null);
    setTimeout(() => {
      setCurrentPage('checkout');
      window.scrollTo(0, 0);
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center justify-center gap-4 min-h-[60vh] animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-bg-pink flex items-center justify-center text-primary mb-2 shadow-sm">
          <ShoppingBag size={38} />
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-medium text-text-dark">Your Bag is Empty</h2>
        <p className="text-xs sm:text-sm text-text-medium leading-relaxed max-w-[280px]">
          Looks like you haven't added any products to your skincare ritual yet.
        </p>
        <button className="btn btn-primary w-fit mt-4 px-8 py-3 text-xs" onClick={() => setCurrentPage('shop')}>
          Explore Products
        </button>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 text-left pb-36 md:pb-24 lg:pb-6">
      <h1 className="text-2xl sm:text-3xl font-serif font-medium text-text-dark mb-2">
        Shopping Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
      </h1>
      
      {/* Main Grid: Left Items list, Right Billing Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Cart items list (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {cart.map((item, index) => {
            const sizeDetails = getProductSizeDetails(item.product, item.selectedSize);
            const itemPrice = sizeDetails.discount_price || sizeDetails.price;
            const itemOriginalPrice = sizeDetails.price;
            const hasItemDiscount = itemPrice < itemOriginalPrice;

            const dropdownKey = `${item.product.id}-${item.selectedSize}`;

            return (
              <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-4 p-4 bg-white border border-border-lumi rounded-2xl shadow-sm animate-fade-in">
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-bg-cream flex-shrink-0 border border-border-lumi">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-col flex-grow text-left">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-sans text-sm font-semibold text-text-dark leading-snug line-clamp-2">{item.product.name}</h3>
                    <button 
                      className="text-text-light hover:text-danger p-1 transition-colors"
                      onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {item.product.sizes && item.product.sizes.length > 0 ? (
                    <div className="flex items-center gap-1.5 mt-1.5 mb-auto">
                      <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">Size:</span>
                      <div className="relative inline-block">
                        <button 
                          onClick={() => setActiveDropdownKey(activeDropdownKey === dropdownKey ? null : dropdownKey)}
                          className="flex items-center gap-1.5 bg-bg-peach hover:bg-bg-pink border border-border-lumi text-[11px] font-bold text-text-dark pl-3 pr-7 py-1 rounded-full outline-none hover:border-primary-light transition-all cursor-pointer select-none relative"
                        >
                          <span>{item.selectedSize}</span>
                          <ChevronDown size={10} className={`text-text-medium transition-transform duration-300 ${activeDropdownKey === dropdownKey ? 'rotate-180' : ''} absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none`} />
                        </button>
                        
                        {activeDropdownKey === dropdownKey && (
                          <>
                            {/* Overlay to close dropdown when clicking outside */}
                            <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownKey(null)} />
                            
                            {/* Floating Custom Dropdown Option Card */}
                            <div className="absolute left-0 mt-1.5 w-24 bg-white border border-border-lumi rounded-xl shadow-[0_8px_30px_rgba(107,83,76,0.1)] z-50 py-1.5 flex flex-col gap-0.5 animate-fade-up">
                              {item.product.sizes.map((sz) => {
                                const isSelected = sz.label === item.selectedSize;
                                return (
                                  <button
                                    key={sz.id}
                                    onClick={() => {
                                      updateCartItemSize(item.product.id, item.selectedSize, sz.label);
                                      setActiveDropdownKey(null);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-bg-pink text-primary border-l-2 border-primary'
                                        : 'text-text-medium hover:bg-bg-peach hover:text-text-dark'
                                    }`}
                                  >
                                    {sz.label}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] font-semibold text-text-light uppercase tracking-wider mt-1 mb-auto">
                      Size: {item.selectedSize}
                    </span>
                  )}
                  
                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-border-lumi">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-text-dark">₹{itemPrice * item.quantity}</span>
                      {hasItemDiscount && (
                        <span className="text-[10px] text-text-light line-through font-medium">₹{itemOriginalPrice * item.quantity}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center border border-border-lumi bg-bg-cream p-0.5 rounded-full shadow-inner">
                      <button 
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-border-lumi text-text-dark"
                        onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                      <button 
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-border-lumi text-text-dark"
                        onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Coupon Code & Bill Breakdown Pane (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Coupon Code Block */}
          <div className="bg-white border border-border-lumi p-5 rounded-2xl shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary font-serif font-semibold border-b border-border-lumi pb-2">
              <Ticket size={16} />
              <span>Apply Promo Code</span>
            </div>
            
            {activeCoupon ? (
              <div className="flex justify-between items-center bg-bg-pink border border-dashed border-primary p-3 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-text-dark">
                  <Sparkles size={13} className="text-primary animate-pulse" />
                  <span>Coupon <strong>{activeCoupon.code}</strong> applied ({activeCoupon.type === 'percentage' ? `${activeCoupon.value}%` : `₹${activeCoupon.value}`} off)</span>
                </div>
                <button className="text-xs font-bold text-danger" onClick={handleRemoveCoupon}>Remove</button>
              </div>
            ) : (
              <form className="flex gap-2" onSubmit={handleApplyCoupon}>
                <input 
                  type="text" 
                  placeholder="Enter promo code (GLOW20, LUMIERE15)"
                  className="flex-grow px-4 py-2 border border-border-lumi bg-bg-cream rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white text-text-dark"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    setCouponError('');
                  }}
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform">
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-[11px] text-danger font-medium mt-1">{couponError}</p>}
            {couponSuccess && <p className="text-[11px] text-success font-medium mt-1">{couponSuccess}</p>}
          </div>

          {/* Pricing breakdown */}
          <div className="bg-white border border-border-lumi p-6 rounded-2xl shadow-sm flex flex-col gap-3">
            <h3 className="font-serif text-base font-semibold border-b border-border-lumi pb-3 text-text-dark uppercase tracking-wider">Bill Details</h3>
            
            <div className="flex justify-between text-xs text-text-medium mt-1">
              <span>Items Total (MRP)</span>
              <span>₹{mrpSubtotal}</span>
            </div>

            {productDiscount > 0 && (
              <div className="flex justify-between text-xs text-success font-semibold">
                <span>Product Discount Savings</span>
                <span>- ₹{productDiscount}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between text-xs text-success font-semibold">
                <span>Coupon Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-text-medium">
              <span>Delivery Charges</span>
              <span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : <span className="text-success font-semibold">FREE</span>}</span>
            </div>

            {customFees.map(fee => (
              <div key={fee.name} className="flex justify-between text-xs text-text-medium">
                <span>{fee.name}</span>
                <span>₹{fee.amount}</span>
              </div>
            ))}

            <div className="flex justify-between text-[10px] text-text-light">
              <span>Estimated GST Included (18%)</span>
              <span>₹{gstIncluded}</span>
            </div>

            <div className="h-[1px] bg-border-lumi my-2"></div>

            <div className="flex justify-between items-baseline grand-total-row text-text-dark mb-2">
              <span className="font-serif text-base font-semibold">Total to pay</span>
              <span className="text-xl font-bold">₹{total}</span>
            </div>

            {totalSavings > 0 && (
              <div className="text-[11px] font-bold text-success text-center mb-2">
                🎉 Total Savings: ₹{totalSavings}
              </div>
            )}

            {/* Desktop Proceed Button */}
            <button 
              className={`hidden md:flex w-full py-3.5 mt-4 text-sm font-semibold uppercase tracking-widest items-center justify-center gap-2 select-none shadow-md rounded-xl transition-all duration-300 transform ${
                isProceeding 
                  ? 'bg-text-light text-white cursor-not-allowed opacity-80' 
                  : 'bg-gradient-to-r from-[#6B534C] via-[#83675E] to-[#6B534C] hover:from-[#5C4B45] hover:to-[#6B534C] text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
              }`}
              onClick={handleProceedToCheckout}
              disabled={isProceeding}
            >
              {isProceeding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Securing checkout...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Sticky summary (Hidden on Desktop lg:hidden) */}
      <div className={`lg:hidden fixed left-0 right-0 border-t border-border-lumi flex justify-between items-center z-50 shadow-lg transition-all duration-300 ${
        isScrollingDown 
          ? 'bottom-[50px] p-2 bg-white/80 backdrop-blur-lg opacity-85' 
          : 'bottom-16 md:bottom-0 p-3 bg-white/95 backdrop-blur-md opacity-100'
      }`}>
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-bold text-text-light tracking-wider uppercase">Total to Pay</span>
          <span className="text-lg font-bold text-text-dark">₹{total}</span>
        </div>
        <button 
          className={`py-2 px-5 text-xs font-semibold uppercase tracking-widest flex items-center gap-2 w-auto shadow-md rounded-xl transition-all duration-300 transform ${
            isProceeding 
              ? 'bg-text-light text-white cursor-not-allowed opacity-80' 
              : 'bg-gradient-to-r from-[#6B534C] via-[#83675E] to-[#6B534C] hover:from-[#5C4B45] hover:to-[#6B534C] text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
          }`}
          onClick={handleProceedToCheckout}
          disabled={isProceeding}
        >
          {isProceeding ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Checkout</span>
              <ChevronRight size={14} />
            </>
          )}
        </button>
      </div>


    </div>
  );
}
