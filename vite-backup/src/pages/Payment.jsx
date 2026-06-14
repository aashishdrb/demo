import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, Copy, Check, Upload, Smartphone, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Payment() {
  const { createOrder, clearCart, setCurrentPage, setTrackingOrderId } = useContext(AppContext);
  const [orderData, setOrderData] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotName, setScreenshotName] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const demoUpiId = 'lumiere@okaxis';
  const demoPhone = '9876543210';

  useEffect(() => {
    const temp = localStorage.getItem('lumi_temp_checkout');
    if (temp) {
      setOrderData(JSON.parse(temp));
    } else {
      // If no checkout data, go back to cart
      setCurrentPage('cart');
    }
  }, [setCurrentPage]);

  if (!orderData) return <div style={{ padding: 48, textAlign: 'center' }}>Loading payment details...</div>;

  const totalToPay = orderData.chargesBreakdown.total;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(demoUpiId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result); // Base64 representation of image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAppPay = (appName) => {
    // UPI Intent Deep Link URL
    const upiLink = `upi://pay?pa=${demoUpiId}&pn=Lumiere%20India&am=${totalToPay}&cu=INR&tn=Lumiere%20Order`;
    
    // Attempt to open deep link
    window.location.href = upiLink;
    
    // Inform user in UI
    alert(`Redirecting to ${appName}... If the app doesn't open automatically, please scan the QR code or pay manually to ${demoUpiId}.`);
  };

  const handleSubmitVerification = (e) => {
    e.preventDefault();
    if (!screenshot) {
      alert('Please upload a screenshot of your payment receipt.');
      return;
    }

    setSubmitting(true);

    // Mock upload delay
    setTimeout(() => {
      // Add screenshot URL to order data
      const finalOrderData = {
        ...orderData,
        screenshotUrl: screenshot,
        paymentStatus: 'Pending' // Payment Pending State
      };

      const newOrder = createOrder(finalOrderData);
      
      // Clear temporary storage
      localStorage.removeItem('lumi_temp_checkout');
      clearCart();
      
      setTrackingOrderId(newOrder.id);
      setCurrentPage('tracking');
      window.scrollTo(0, 0);
    }, 1500);
  };

  return (
    <>
      <div className="payment-container animate-fade-up">
        {/* Header */}
        <div className="payment-page-header">
          <button onClick={() => setCurrentPage('checkout')} className="back-btn">
            <ArrowLeft size={20} />
          </button>
          <h2>UPI Payment</h2>
          <div style={{ width: 24 }}></div>
        </div>

        {/* Bill Summary */}
        <div className="payment-bill-box">
          <span>Amount to Pay</span>
          <span className="pay-amount">₹{totalToPay}</span>
        </div>

        {/* UPI Intent Apps Row */}
        <div className="payment-section">
          <h3>Pay via installed UPI App</h3>
          <p className="subtext">Clicking will redirect to your selected payment app.</p>
          
          <div className="upi-apps-grid">
            <button className="upi-app-btn" onClick={() => handleAppPay('Google Pay')}>
              <div className="app-icon gpay">G</div>
              <span>Google Pay</span>
            </button>
            <button className="upi-app-btn" onClick={() => handleAppPay('PhonePe')}>
              <div className="app-icon phonepe">P</div>
              <span>PhonePe</span>
            </button>
            <button className="upi-app-btn" onClick={() => handleAppPay('Paytm')}>
              <div className="app-icon paytm">Py</div>
              <span>Paytm</span>
            </button>
            <button className="upi-app-btn" onClick={() => handleAppPay('BHIM')}>
              <div className="app-icon bhim">B</div>
              <span>BHIM</span>
            </button>
          </div>
        </div>

        {/* Manual Payment Option (QR + Details) */}
        <div className="payment-section">
          <h3>Scan QR Code to pay</h3>
          <p className="subtext">Scan using GPay, PhonePe, Paytm, or any UPI app.</p>

          <div className="qr-code-showcase-box">
            {/* Elegant Vector SVG QR Code */}
            <svg viewBox="0 0 100 100" className="demo-qr-svg">
              <path d="M5,5 h30 v30 h-30 z M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z" fill="var(--primary)" />
              <path d="M65,5 h30 v30 h-30 z M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z" fill="var(--primary)" />
              <path d="M5,65 h30 v30 h-30 z M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" fill="var(--primary)" />
              {/* QR noise pattern dots */}
              <path d="M45,5 h5 v5 h-5 z M55,5 h5 v5 h-5 z M45,15 h5 v10 h-5 z M55,15 h10 v5 h-10 z M45,30 h15 v5 h-15 z
                       M5,45 h10 v5 h-10 z M25,45 h5 v15 h-5 z M15,55 h5 v5 h-5 z
                       M45,45 h10 v5 h-10 z M60,45 h5 v5 h-5 z M70,45 h25 v5 h-25 z M50,55 h15 v5 h-15 z M80,55 h10 v5 h-10 z
                       M45,65 h5 v15 h-5 z M55,65 h10 v5 h-10 z M75,65 h5 v15 h-5 z M85,65 h10 v5 h-10 z
                       M55,75 h5 v5 h-5 z M65,75 h5 v15 h-5 z M85,75 h5 v5 h-5 z
                       M45,90 h10 v5 h-10 z M60,90 h5 v5 h-5 z M75,90 h20 v5 h-20 z" fill="var(--primary)" />
            </svg>
            <div className="qr-badge">LUMIÈRE SECURE</div>
          </div>

          <div className="upi-details-card">
            <div className="detail-row">
              <div>
                <span className="label">UPI ID</span>
                <span className="value">{demoUpiId}</span>
              </div>
              <button className="copy-btn" onClick={handleCopyUpiId}>
                {copiedId ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="detail-row">
              <div>
                <span className="label">UPI Mobile Number</span>
                <span className="value">+91 {demoPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Screenshot Form */}
        <div className="payment-section">
          <h3>Manual Verification System</h3>
          <p className="subtext">Upload proof of payment to complete your order verification.</p>
          
          <form onSubmit={handleSubmitVerification} className="screenshot-upload-form">
            <div className="upload-dropzone">
              <input 
                type="file" 
                id="screenshot-file" 
                accept="image/*" 
                onChange={handleScreenshotChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="screenshot-file" className="dropzone-label">
                {screenshot ? (
                  <div className="screenshot-preview-box">
                    <img src={screenshot} alt="Payment Proof" />
                    <span>Change File</span>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="upload-icon" />
                    <strong>Upload Payment Screenshot</strong>
                    <span>Supports JPG, PNG, PDF receipts</span>
                  </>
                )}
              </label>
            </div>
            {screenshotName && <p className="uploaded-file-name">{screenshotName}</p>}

            <div className="security-notice">
              <AlertCircle size={14} color="var(--warning)" />
              <span>Orders will remain in <strong>Payment Pending</strong> until manually approved by the administrator.</span>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary submit-verify-btn"
              disabled={submitting}
            >
              {submitting ? 'Submitting Verification...' : `Submit Payment Verification`}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .payment-container {
          padding: 20px 16px 40px;
          text-align: left;
        }
        .payment-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .payment-page-header h2 {
          font-size: 20px;
          font-weight: 500;
        }
        .back-btn {
          padding: 4px;
        }

        /* Bill box */
        .payment-bill-box {
          background-color: var(--bg-pink);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .payment-bill-box span {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-medium);
        }
        .pay-amount {
          font-size: 24px !important;
          font-weight: 700 !important;
          color: var(--primary) !important;
        }

        /* Sections */
        .payment-section {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 18px 16px;
          margin-bottom: 20px;
        }
        .payment-section h3 {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .subtext {
          font-size: 12px;
          color: var(--text-light);
          margin-bottom: 16px;
        }

        /* Intent Apps */
        .upi-apps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .upi-app-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .app-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--bg-white);
          font-weight: 700;
          font-size: 16px;
          box-shadow: var(--shadow-sm);
        }
        .gpay {
          background: linear-gradient(135deg, #4285F4, #34A853);
        }
        .phonepe {
          background: linear-gradient(135deg, #5F259F, #8247E5);
        }
        .paytm {
          background: linear-gradient(135deg, #00B9F5, #002E6E);
        }
        .bhim {
          background: linear-gradient(135deg, #F37021, #009345);
        }
        .upi-app-btn span {
          font-size: 10px;
          font-weight: 500;
          color: var(--text-medium);
        }

        /* QR Showcase */
        .qr-code-showcase-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background-color: var(--bg-cream);
          border-radius: var(--radius-md);
          margin-bottom: 16px;
        }
        .demo-qr-svg {
          width: 140px;
          height: 140px;
        }
        .qr-badge {
          font-size: 9px;
          font-weight: 600;
          background-color: var(--primary);
          color: var(--bg-white);
          padding: 3px 8px;
          border-radius: var(--radius-full);
          letter-spacing: 0.8px;
        }

        /* UPI Details list */
        .upi-details-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-top: 1px solid var(--border);
          padding-top: 16px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .detail-row .label {
          font-size: 11px;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
        }
        .detail-row .value {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dark);
        }
        .copy-btn {
          padding: 6px;
          border-radius: var(--radius-full);
          background-color: var(--bg-cream);
        }
        .copy-btn:active {
          background-color: var(--border-focus);
        }

        /* Screenshot upload zone */
        .upload-dropzone {
          border: 2px dashed var(--border-focus);
          border-radius: var(--radius-md);
          background-color: var(--bg-peach);
          cursor: pointer;
          transition: var(--transition);
        }
        .upload-dropzone:hover {
          border-color: var(--primary);
        }
        .dropzone-label {
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
          width: 100%;
          cursor: pointer;
        }
        .upload-icon {
          color: var(--text-light);
        }
        .dropzone-label strong {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-dark);
        }
        .dropzone-label span {
          font-size: 11px;
          color: var(--text-light);
        }
        .screenshot-preview-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .screenshot-preview-box img {
          max-width: 100%;
          max-height: 180px;
          border-radius: var(--radius-sm);
          object-fit: contain;
          border: 1px solid var(--border);
        }
        .screenshot-preview-box span {
          font-size: 12px;
          font-weight: 600;
          color: var(--primary);
          text-decoration: underline;
        }
        .uploaded-file-name {
          font-size: 11px;
          color: var(--text-medium);
          margin-top: 6px;
          text-align: center;
        }

        .security-notice {
          display: flex;
          gap: 8px;
          background-color: var(--warning-light);
          padding: 10px 12px;
          border-radius: var(--radius-md);
          margin: 16px 0;
          border: 1px solid rgba(194, 148, 93, 0.2);
        }
        .security-notice span {
          font-size: 11px;
          line-height: 1.4;
          color: var(--text-medium);
        }
        .submit-verify-btn {
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
