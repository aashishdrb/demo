import React, { useContext, useState, useEffect } from 'react';
import { AppContext, INDIAN_STATES_DISTRICTS } from '../context/AppContext';
import { ArrowLeft, Home as HomeIcon, CheckCircle2, ChevronDown, ChevronUp, Tag, ShieldCheck, RefreshCw, Heart } from 'lucide-react';

export default function Checkout() {
  const { 
    cart, 
    currentUser, 
    setCurrentUser, 
    activeCoupon, 
    calculateTotals, 
    createOrder,
    setCurrentPage,
    setTrackingOrderId
  } = useContext(AppContext);

  // Address form states
  const [useSavedAddress, setUseSavedAddress] = useState(currentUser.addresses.length > 0);
  const [selectedAddressId, setSelectedAddressId] = useState(
    currentUser.addresses.length > 0 ? currentUser.addresses[0].id : null
  );

  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPincode, setFormPincode] = useState('');
  const [formState, setFormState] = useState('');
  const [formDistrict, setFormDistrict] = useState('');
  const [formPhone, setFormPhone] = useState('');
  
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI or COD
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(false);

  // Load districts when state changes
  const availableDistricts = formState ? INDIAN_STATES_DISTRICTS[formState] : [];

  useEffect(() => {
    setFormDistrict('');
  }, [formState]);

  const { subtotal, discount, deliveryCharge, handlingFee, packagingFee, festivalFee, grandTotal } = calculateTotals();
  
  // Calculate final total based on payment method (add COD charge if applicable)
  const codFee = (paymentMethod === 'COD' && calculateTotals().subtotal > 0) ? 49 : 0;
  const totalToPay = calculateTotals().total + codFee;

  const validateForm = () => {
    const newErrors = {};

    if (!formName.trim()) newErrors.name = 'Full name is required.';
    if (!formAddress.trim()) newErrors.address = 'Address line is required.';
    
    // Pincode validation: 6 digits exactly
    if (!/^\d{6}$/.test(formPincode)) {
      newErrors.pincode = 'Pincode must be exactly 6 digits.';
    }

    if (!formState) newErrors.state = 'Please select a state.';
    if (!formDistrict) newErrors.district = 'Please select a district.';

    // Mobile validation: 10 digits starting with 6/7/8/9
    if (!/^[6-9]\d{9}$/.test(formPhone)) {
      newErrors.phone = 'Mobile must be 10 digits starting with 6, 7, 8, or 9.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmOrder = () => {
    let orderAddress = null;

    if (useSavedAddress) {
      orderAddress = currentUser.addresses.find(a => a.id === selectedAddressId);
    } else {
      if (!validateForm()) {
        // Scroll to error
        window.scrollTo(0, 150);
        return;
      }
      // Create new address
      const newAddress = {
        id: `addr-${Math.floor(Math.random() * 10000)}`,
        tag: 'Home',
        name: formName,
        addressLine: formAddress,
        district: formDistrict,
        state: formState,
        pincode: formPincode,
        phone: formPhone,
        isDefault: currentUser.addresses.length === 0
      };

      // Save to user address list
      setCurrentUser(prev => ({
        ...prev,
        addresses: [...prev.addresses, newAddress]
      }));

      orderAddress = newAddress;
    }

    const orderData = {
      items: cart,
      address: orderAddress,
      paymentMethod: paymentMethod,
      chargesBreakdown: {
        subtotal,
        discount,
        deliveryCharge,
        handlingFee,
        packagingFee,
        festivalFee,
        codFee,
        total: totalToPay
      },
      couponApplied: activeCoupon ? activeCoupon.code : null
    };

    if (paymentMethod === 'COD') {
      const createdOrder = createOrder(orderData);
      setTrackingOrderId(createdOrder.id);
      setCurrentPage('tracking');
      window.scrollTo(0, 0);
    } else {
      // UPI Intent Flow
      // Store temporary checkout details to order state so the payment screen can complete it
      localStorage.setItem('lumi_temp_checkout', JSON.stringify(orderData));
      setCurrentPage('payment-screen');
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <div className="checkout-container animate-fade-up">
        {/* Progress Bar & Header */}
        <div className="checkout-header-nav">
          <button onClick={() => setCurrentPage('cart')} className="back-arrow-btn">
            <ArrowLeft size={20} />
          </button>
          <span className="logo-text">LUMIÈRE</span>
          <div style={{ width: 24 }}></div>
        </div>

        {/* Progress Steps Indicator */}
        <div className="checkout-steps-bar">
          <div className="step-item active">
            <span className="step-num">✓</span>
            <span className="step-label">Shipping</span>
          </div>
          <div className="step-line active"></div>
          <div className="step-item active">
            <span className="step-num">2</span>
            <span className="step-label">Payment</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            <span className="step-num">3</span>
            <span className="step-label">Review</span>
          </div>
        </div>

        {/* Order Summary Collapsible Accordian (image_0.png) */}
        <div className="order-summary-collapsible">
          <button 
            className="summary-toggle-btn"
            onClick={() => setOrderSummaryExpanded(!orderSummaryExpanded)}
          >
            <div className="summary-title-badge">
              <ShoppingBag size={18} />
              <span>Order Summary</span>
              <span className="items-count-tag">{cart.reduce((sum, i)=>sum+i.quantity, 0)} ITEMS</span>
            </div>
            {orderSummaryExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {orderSummaryExpanded && (
            <div className="summary-expanded-content">
              {cart.map((item, idx) => (
                <div key={idx} className="summary-item-row">
                  <span>{item.product.name} ({item.selectedSize}) × {item.quantity}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
              <div className="summary-subtotal-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Address Section (image_0.png) */}
        <div className="checkout-section">
          <div className="section-title-row">
            <h2>Delivery Address</h2>
            {useSavedAddress && (
              <button className="change-address-btn" onClick={() => setUseSavedAddress(false)}>Change</button>
            )}
          </div>

          {useSavedAddress ? (
            // Saved Address Card
            <div className="address-saved-card">
              <div className="address-card-header">
                <HomeIcon size={18} color="var(--primary)" />
                <span className="address-tag-text">Home</span>
                <CheckCircle2 size={18} color="var(--primary)" className="address-checked-icon" />
              </div>
              <div className="address-card-body">
                <h3>{currentUser.addresses[0]?.name}</h3>
                <p>{currentUser.addresses[0]?.addressLine}</p>
                <p>{currentUser.addresses[0]?.district}, {currentUser.addresses[0]?.state} - {currentUser.addresses[0]?.pincode}</p>
                <p>+91 {currentUser.addresses[0]?.phone}</p>
              </div>
            </div>
          ) : (
            // Address Entry Form
            <div className="address-entry-form">
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Sarah Jenkins"
                  className={`input-field ${errors.name ? 'error' : ''}`}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="input-group">
                <label>Flat / House No. / Area Address</label>
                <input 
                  type="text" 
                  placeholder="Flat 4B, Signature Residency"
                  className={`input-field ${errors.address ? 'error' : ''}`}
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-grid-2">
                <div className="input-group">
                  <label>Pincode</label>
                  <input 
                    type="tel" 
                    placeholder="201301"
                    maxLength={6}
                    className={`input-field ${errors.pincode ? 'error' : ''}`}
                    value={formPincode}
                    onChange={(e) => setFormPincode(e.target.value)}
                  />
                  {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                </div>

                <div className="input-group">
                  <label>State</label>
                  <select 
                    className={`input-field ${errors.state ? 'error' : ''}`}
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                  >
                    <option value="">Select State</option>
                    {Object.keys(INDIAN_STATES_DISTRICTS).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <span className="error-text">{errors.state}</span>}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="input-group">
                  <label>District</label>
                  <select 
                    className={`input-field ${errors.district ? 'error' : ''}`}
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    disabled={!formState}
                  >
                    <option value="">Select District</option>
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.district && <span className="error-text">{errors.district}</span>}
                </div>

                <div className="input-group">
                  <label>Mobile Number</label>
                  <input 
                    type="tel" 
                    placeholder="9876543210"
                    maxLength={10}
                    className={`input-field ${errors.phone ? 'error' : ''}`}
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
              </div>

              {currentUser.addresses.length > 0 && (
                <button className="text-link-btn" onClick={() => setUseSavedAddress(true)} style={{ marginTop: '8px' }}>
                  Use saved address
                </button>
              )}
            </div>
          )}
        </div>

        {/* Promo code display (image_0.png) */}
        {activeCoupon && (
          <div className="checkout-promo-box">
            <div className="promo-details">
              <Tag size={16} color="var(--primary)" />
              <span>Promo Code <strong>{activeCoupon.code}</strong> Applied</span>
            </div>
            <span>- ₹{discount}</span>
          </div>
        )}

        {/* Payment Method Selector (image_0.png) */}
        <div className="checkout-section">
          <h2>Payment Method</h2>
          
          <div className="radio-tile-group">
            {/* UPI Payment */}
            <label className={`radio-tile-label ${paymentMethod === 'UPI' ? 'checked' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                value="UPI" 
                checked={paymentMethod === 'UPI'}
                onChange={() => setPaymentMethod('UPI')}
                style={{ display: 'none' }}
              />
              <div className="radio-circle"></div>
              <div className="payment-label-text">
                <strong>UPI / Mobile Wallet</strong>
                <span>PhonePe, GPay, Paytm, BHIM</span>
              </div>
            </label>

            {/* Cash on Delivery */}
            <label className={`radio-tile-label ${paymentMethod === 'COD' ? 'checked' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                value="COD" 
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
                style={{ display: 'none' }}
              />
              <div className="radio-circle"></div>
              <div className="payment-label-text">
                <strong>Cash on Delivery</strong>
                <span>Pay at your doorstep (+₹49 COD charges)</span>
              </div>
            </label>
          </div>
        </div>

        {/* Verification badges */}
        <div className="checkout-trust-row">
          <div className="trust-badge">
            <ShieldCheck size={18} />
            <span>SECURE SSL</span>
          </div>
          <div className="trust-badge">
            <RefreshCw size={18} />
            <span>30-DAY RETURNS</span>
          </div>
          <div className="trust-badge">
            <Heart size={18} />
            <span>CRUELTY FREE</span>
          </div>
        </div>

        {/* Sticky bottom pay bar (image_0.png) */}
        <div className="sticky-checkout-summary">
          <div className="summary-text-box">
            <span className="summary-label">TOTAL TO PAY</span>
            <span className="summary-price">₹{totalToPay}</span>
          </div>
          
          <button className="btn btn-primary confirm-pay-btn" onClick={handleConfirmOrder}>
            <span>Confirm & Pay</span>
            <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      </div>

      <style>{`
        .checkout-container {
          padding: 20px 16px 88px;
          text-align: left;
        }
        .checkout-header-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .back-arrow-btn {
          padding: 4px;
        }
        
        /* Steps Bar */
        .checkout-steps-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          margin-bottom: 24px;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          position: relative;
        }
        .step-num {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          background-color: var(--bg-white);
          color: var(--text-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }
        .step-item.active .step-num {
          border-color: var(--primary);
          background-color: var(--bg-pink);
          color: var(--primary);
        }
        .step-label {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-light);
        }
        .step-item.active .step-label {
          color: var(--primary);
          font-weight: 600;
        }
        .step-line {
          height: 1px;
          background-color: var(--border);
          flex-grow: 1;
          margin-bottom: 16px;
        }
        .step-line.active {
          background-color: var(--primary);
        }

        /* Order Summary Collapsible */
        .order-summary-collapsible {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          overflow: hidden;
        }
        .summary-toggle-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background-color: var(--bg-peach);
        }
        .summary-title-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-dark);
        }
        .items-count-tag {
          font-size: 9px;
          font-weight: 600;
          background-color: var(--bg-pink);
          color: var(--primary);
          padding: 2px 6px;
          border-radius: var(--radius-full);
        }
        .summary-expanded-content {
          padding: 16px;
          border-top: 1px solid var(--border);
          background-color: var(--bg-white);
        }
        .summary-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-medium);
          margin-bottom: 8px;
        }
        .summary-subtotal-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 600;
          border-top: 1px solid var(--border);
          padding-top: 8px;
          margin-top: 8px;
        }

        /* General Section */
        .checkout-section {
          margin-bottom: 24px;
        }
        .section-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .checkout-section h2 {
          font-size: 18px;
          font-weight: 500;
        }
        .change-address-btn {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary);
        }

        /* Saved Address Card */
        .address-saved-card {
          border: 1px solid var(--primary);
          border-radius: var(--radius-md);
          background-color: var(--bg-white);
          padding: 16px;
          box-shadow: var(--shadow-sm);
        }
        .address-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .address-tag-text {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dark);
        }
        .address-checked-icon {
          margin-left: auto;
        }
        .address-card-body h3 {
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .address-card-body p {
          font-size: 13px;
          color: var(--text-medium);
          line-height: 1.4;
        }

        /* Form Entry */
        .address-entry-form {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Promo code display */
        .checkout-promo-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--bg-pink);
          border: 1px solid var(--border);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-dark);
          margin-bottom: 24px;
        }
        .promo-details {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Payment Method Radio label styling */
        .payment-label-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }
        .payment-label-text strong {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dark);
        }
        .payment-label-text span {
          font-size: 11px;
          color: var(--text-light);
        }

        /* Trust badges row */
        .checkout-trust-row {
          display: flex;
          justify-content: space-between;
          padding: 16px 8px;
          border-top: 1px solid var(--border);
          margin-bottom: 16px;
        }
        .trust-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-light);
        }
        .trust-badge span {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        /* Pay button */
        .confirm-pay-btn {
          width: auto;
          padding: 12px 28px;
          height: 48px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
