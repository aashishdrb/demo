import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Trash2, Plus, Minus, Ticket, Sparkles, ChevronRight, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    activeCoupon, 
    setActiveCoupon, 
    coupons, 
    calculateTotals, 
    setCurrentPage 
  } = useContext(AppContext);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const { subtotal, discount, deliveryCharge, handlingFee, packagingFee, festivalFee, gstIncluded, total } = calculateTotals();

  const handleApplyCoupon = (e) => {
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
    setCouponSuccess(`Coupon "${coupon.code}" applied successfully!`);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart-container animate-fade-up">
        <div className="empty-cart-icon-wrapper">
          <ShoppingBag size={48} color="var(--primary)" />
        </div>
        <h2>Your Bag is Empty</h2>
        <p>Looks like you haven't added any products to your skincare ritual yet.</p>
        <button className="btn btn-primary" onClick={() => setCurrentPage('shop')} style={{ marginTop: '16px' }}>
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="cart-container animate-fade-up">
        <h1 className="cart-page-title">Shopping Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})</h1>

        {/* Cart items list */}
        <div className="cart-items-list">
          {cart.map((item, index) => (
            <div key={`${item.product.id}-${item.selectedSize}`} className="cart-item-card">
              <div className="cart-item-img">
                <img src={item.product.image} alt={item.product.name} />
              </div>
              
              <div className="cart-item-info">
                <div className="item-title-row">
                  <h3>{item.product.name}</h3>
                  <button 
                    className="item-remove-btn" 
                    onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <span className="item-size-label">Size: {item.selectedSize}</span>
                
                <div className="item-price-quantity-row">
                  <span className="item-price">₹{item.product.price * item.quantity}</span>
                  
                  <div className="quantity-controller">
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="qty-indicator">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Code Block */}
        <div className="coupon-card-section">
          <div className="coupon-header">
            <Ticket size={18} color="var(--primary)" />
            <h3>Apply Promo Code</h3>
          </div>
          
          {activeCoupon ? (
            <div className="applied-coupon-box">
              <div className="coupon-details">
                <Sparkles size={14} color="var(--primary)" />
                <span><strong>{activeCoupon.code}</strong> applied ({activeCoupon.type === 'percentage' ? `${activeCoupon.value}%` : `₹${activeCoupon.value}`} off)</span>
              </div>
              <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>Remove</button>
            </div>
          ) : (
            <form className="coupon-form" onSubmit={handleApplyCoupon}>
              <input 
                type="text" 
                placeholder="Enter promo code (GLOW20, LUMIERE15)"
                className={`input-field coupon-input ${couponError ? 'error' : ''}`}
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponError('');
                }}
              />
              <button type="submit" className="btn btn-secondary coupon-apply-btn">
                APPLY
              </button>
            </form>
          )}
          {couponError && <p className="error-text">{couponError}</p>}
          {couponSuccess && <p className="success-text" style={{ color: 'var(--success)', fontSize: '12px', marginTop: '4px' }}>{couponSuccess}</p>}
        </div>

        {/* Price Summary Breakdown */}
        <div className="bill-details-card">
          <h3>Bill Details</h3>
          
          <div className="bill-row">
            <span>Bag Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          {discount > 0 && (
            <div className="bill-row discount-row">
              <span>Coupon Discount</span>
              <span>- ₹{discount}</span>
            </div>
          )}

          <div className="bill-row">
            <span>Delivery Charges</span>
            <span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>}</span>
          </div>

          {handlingFee > 0 && (
            <div className="bill-row">
              <span>Handling Fee</span>
              <span>₹{handlingFee}</span>
            </div>
          )}

          {packagingFee > 0 && (
            <div className="bill-row">
              <span>Nourishing Packaging Fee</span>
              <span>₹{packagingFee}</span>
            </div>
          )}

          {festivalFee > 0 && (
            <div className="bill-row">
              <span>Festival Charge</span>
              <span>₹{festivalFee}</span>
            </div>
          )}

          <div className="bill-row tax-row">
            <span>Estimated GST Included (18%)</span>
            <span>₹{gstIncluded}</span>
          </div>

          <div className="bill-divider"></div>

          <div className="bill-row grand-total-row">
            <span>Total to pay</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Sticky checkout summary panel */}
        <div className="sticky-checkout-summary">
          <div className="summary-text-box">
            <span className="summary-label">TOTAL TO PAY</span>
            <span className="summary-price">₹{total}</span>
          </div>
          <button className="btn btn-primary checkout-action-btn" onClick={() => {
            setCurrentPage('checkout');
            window.scrollTo(0, 0);
          }}>
            <span>Checkout</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .cart-container {
          padding: 20px 16px 88px; /* space for sticky footer */
          text-align: left;
        }
        .cart-page-title {
          font-size: 24px;
          font-weight: 500;
          margin-bottom: 20px;
        }

        /* Cart Empty State */
        .empty-cart-container {
          padding: 64px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-height: 70vh;
        }
        .empty-cart-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background-color: var(--bg-pink);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .empty-cart-container h2 {
          font-size: 22px;
        }
        .empty-cart-container p {
          font-size: 14px;
          color: var(--text-medium);
          max-width: 280px;
        }

        /* Cart items list */
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }
        .cart-item-card {
          display: flex;
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          padding: 12px;
          gap: 12px;
        }
        .cart-item-img {
          width: 80px;
          height: 96px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background-color: var(--bg-cream);
          flex-shrink: 0;
        }
        .cart-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cart-item-info {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .item-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }
        .cart-item-info h3 {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-dark);
          line-height: 1.3;
        }
        .item-remove-btn {
          color: var(--text-light);
          padding: 2px;
        }
        .item-remove-btn:active {
          color: var(--danger);
        }
        .item-size-label {
          font-size: 12px;
          color: var(--text-light);
          margin-top: 4px;
          margin-bottom: auto;
        }
        .item-price-quantity-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }
        .item-price {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-dark);
        }
        .quantity-controller {
          display: flex;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          background-color: var(--bg-cream);
          padding: 2px;
        }
        .quantity-controller button {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dark);
        }
        .quantity-controller button:active {
          background-color: var(--border-focus);
        }
        .qty-indicator {
          font-size: 13px;
          font-weight: 600;
          min-width: 24px;
          text-align: center;
        }

        /* Coupons section */
        .coupon-card-section {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 24px;
        }
        .coupon-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .coupon-header h3 {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-dark);
        }
        .coupon-form {
          display: grid;
          grid-template-columns: 1fr 90px;
          gap: 8px;
        }
        .coupon-input {
          margin-bottom: 0;
          padding: 10px 14px;
          font-size: 13px;
        }
        .coupon-apply-btn {
          padding: 10px;
          font-size: 12px;
          font-weight: 600;
          border-radius: var(--radius-md);
        }
        .applied-coupon-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--bg-pink);
          border: 1px dashed var(--primary);
          padding: 12px;
          border-radius: var(--radius-md);
        }
        .coupon-details {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-dark);
        }
        .remove-coupon-btn {
          font-size: 12px;
          font-weight: 600;
          color: var(--danger);
        }

        /* Bill details */
        .bill-details-card {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 12px;
        }
        .bill-details-card h3 {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 14px;
        }
        .bill-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-medium);
          margin-bottom: 10px;
        }
        .discount-row {
          color: var(--success);
          font-weight: 500;
        }
        .tax-row {
          font-size: 11px;
          color: var(--text-light);
          margin-bottom: 0;
        }
        .bill-divider {
          height: 1px;
          background-color: var(--border);
          margin: 12px 0;
        }
        .grand-total-row {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0;
        }

        /* Sticky footer summary */
        .sticky-checkout-summary {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: var(--app-max-width);
          background-color: var(--bg-white);
          border-top: 1px solid var(--border);
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 995;
          box-shadow: 0 -8px 24px rgba(107, 83, 76, 0.08);
        }
        .summary-text-box {
          display: flex;
          flex-direction: column;
        }
        .summary-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: var(--text-light);
        }
        .summary-price {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-dark);
        }
        .checkout-action-btn {
          width: auto;
          padding: 12px 28px;
          font-weight: 600;
          height: 44px;
        }
      `}</style>
    </>
  );
}
