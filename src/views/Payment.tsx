'use client';

import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, Copy, Check, Upload, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Payment() {
  const context = useContext(AppContext);
  const [orderData, setOrderData] = useState<any>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
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
      context?.setCurrentPage('cart');
    }
  }, [context]);

  if (!context) return null;
  const { placeOrder, clearCart, setCurrentPage, setTrackingOrderId, buyNowItem, setBuyNowItem } = context;

  if (!orderData) return <div className="p-12 text-center text-sm font-semibold">Loading UPI details...</div>;

  const totalToPay = orderData.chargesBreakdown.total;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(demoUpiId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string); // Base64 data url
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAppPay = (appName: string) => {
    const upiLink = `upi://pay?pa=${demoUpiId}&pn=Lumiere%20India&am=${totalToPay}&cu=INR&tn=Lumiere%20Order`;
    window.location.href = upiLink;
    alert(`Redirecting to ${appName}... If the app doesn't launch, please scan the QR or pay manually to ${demoUpiId}.`);
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot) {
      alert('Please upload a screenshot of your payment receipt.');
      return;
    }

    setSubmitting(true);

    const finalOrderData = {
      ...orderData,
      screenshotUrl: screenshot
    };

    const res = await placeOrder(finalOrderData);
    if (res.success && res.order) {
      localStorage.removeItem('lumi_temp_checkout');
      if (buyNowItem) {
        setBuyNowItem(null);
      } else {
        clearCart();
      }
      setTrackingOrderId(res.order.order_id);
      setCurrentPage('tracking');
      window.scrollTo(0, 0);
    } else {

      alert(res.error || 'Failed to submit payment verification.');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 flex flex-col gap-6 text-left animate-fade-up">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border-lumi pb-4">
        <button onClick={() => setCurrentPage('checkout')} className="p-2 hover:bg-bg-pink rounded-full text-text-dark">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-serif font-semibold text-text-dark">UPI Payment Gateway</h2>
        <div style={{ width: 40 }}></div>
      </div>

      {/* Bill Box */}
      <div className="bg-bg-pink border border-border-lumi p-4 rounded-xl flex justify-between items-center shadow-inner">
        <span className="text-xs font-semibold text-text-medium uppercase tracking-wider">Amount to Pay</span>
        <span className="text-2xl font-bold text-primary">₹{totalToPay}</span>
      </div>

      {/* UPI Intent Apps Grid */}
      <div className="bg-white border border-border-lumi p-5 rounded-2xl shadow-sm flex flex-col gap-4">
        <div>
          <h3 className="font-serif text-sm font-semibold text-text-dark">Pay via installed UPI App</h3>
          <p className="text-[10px] text-text-light mt-0.5">Clicking will redirect to your selected payment app.</p>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <button className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform" onClick={() => handleAppPay('Google Pay')}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#4285F4] to-[#34A853] flex items-center justify-center text-white font-bold text-base shadow-sm">G</div>
            <span className="text-[9px] font-semibold text-text-medium">GPay</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform" onClick={() => handleAppPay('PhonePe')}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5F259F] to-[#8247E5] flex items-center justify-center text-white font-bold text-base shadow-sm">P</div>
            <span className="text-[9px] font-semibold text-text-medium">PhonePe</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform" onClick={() => handleAppPay('Paytm')}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#00B9F5] to-[#002E6E] flex items-center justify-center text-white font-bold text-base shadow-sm">Py</div>
            <span className="text-[9px] font-semibold text-text-medium">Paytm</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform" onClick={() => handleAppPay('BHIM')}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#F37021] to-[#009345] flex items-center justify-center text-white font-bold text-base shadow-sm">B</div>
            <span className="text-[9px] font-semibold text-text-medium">BHIM</span>
          </button>
        </div>
      </div>

      {/* Manual QR & details */}
      <div className="bg-white border border-border-lumi p-5 rounded-2xl shadow-sm flex flex-col gap-4">
        <div>
          <h3 className="font-serif text-sm font-semibold text-text-dark">Scan Merchant QR Code</h3>
          <p className="text-[10px] text-text-light mt-0.5">Scan using any UPI application to complete payment.</p>
        </div>

        <div className="bg-bg-cream rounded-xl p-4 flex flex-col items-center gap-2 border border-border-lumi">
          {/* SVG QR */}
          <svg viewBox="0 0 100 100" className="w-32 h-32 text-primary">
            <path d="M5,5 h30 v30 h-30 z M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z" fill="currentColor" />
            <path d="M65,5 h30 v30 h-30 z M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z" fill="currentColor" />
            <path d="M5,65 h30 v30 h-30 z M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" fill="currentColor" />
            <path d="M45,5 h5 v5 h-5 z M55,5 h5 v5 h-5 z M45,15 h5 v10 h-5 z M55,15 h10 v5 h-10 z M45,30 h15 v5 h-15 z
                     M5,45 h10 v5 h-10 z M25,45 h5 v15 h-5 z M15,55 h5 v5 h-5 z
                     M45,45 h10 v5 h-10 z M60,45 h5 v5 h-5 z M70,45 h25 v5 h-25 z M50,55 h15 v5 h-15 z M80,55 h10 v5 h-10 z
                     M45,65 h5 v15 h-5 z M55,65 h10 v5 h-10 z M75,65 h5 v15 h-5 z M85,65 h10 v5 h-10 z
                     M55,75 h5 v5 h-5 z M65,75 h5 v15 h-5 z M85,75 h5 v5 h-5 z
                     M45,90 h10 v5 h-10 z M60,90 h5 v5 h-5 z M75,90 h20 v5 h-20 z" fill="currentColor" />
          </svg>
          <span className="bg-primary text-white text-[8px] font-bold py-1 px-3 rounded-full uppercase tracking-wider">LUMIÈRE SECURE</span>
        </div>

        <div className="flex flex-col gap-2.5 pt-2 border-t border-border-lumi">
          <div className="flex justify-between items-center text-xs text-text-medium">
            <div>
              <span className="text-[10px] text-text-light uppercase tracking-wider block">Merchant UPI ID</span>
              <span className="font-semibold text-text-dark">{demoUpiId}</span>
            </div>
            <button className="p-2 bg-bg-cream rounded-full hover:bg-bg-pink transition-colors active:scale-95" onClick={handleCopyUpiId}>
              {copiedId ? <Check size={14} className="text-success" /> : <Copy size={14} className="text-text-dark" />}
            </button>
          </div>
          <div className="text-xs text-text-medium">
            <span className="text-[10px] text-text-light uppercase tracking-wider block">UPI Phone Number</span>
            <span className="font-semibold text-text-dark">+91 {demoPhone}</span>
          </div>
        </div>
      </div>

      {/* Screenshot Verification */}
      <div className="bg-white border border-border-lumi p-5 rounded-2xl shadow-sm flex flex-col gap-4">
        <div>
          <h3 className="font-serif text-sm font-semibold text-text-dark">Upload Payment Screenshot</h3>
          <p className="text-[10px] text-text-light mt-0.5">Required for manual billing verification.</p>
        </div>

        <form onSubmit={handleSubmitVerification} className="flex flex-col gap-4">
          <div className="border-2 border-dashed border-border-focus rounded-xl bg-bg-peach hover:border-primary transition-colors cursor-pointer relative">
            <input 
              type="file" 
              id="screenshot-uploader" 
              accept="image/*" 
              onChange={handleScreenshotChange}
              className="hidden"
            />
            <label htmlFor="screenshot-uploader" className="flex flex-col items-center gap-2 p-6 cursor-pointer text-center w-full">
              {screenshot ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={screenshot} alt="Receipt Preview" className="max-h-36 rounded-lg object-contain border border-border-lumi shadow-sm" />
                  <span className="text-xs font-semibold text-primary underline underline-offset-3">Replace Screenshot</span>
                </div>
              ) : (
                <>
                  <Upload size={24} className="text-text-light" />
                  <strong className="text-xs text-text-dark font-semibold">Choose Receipt Photo</strong>
                  <span className="text-[10px] text-text-light">JPG, PNG, PDF receipt exports</span>
                </>
              )}
            </label>
          </div>
          {screenshotName && <p className="text-[10px] text-text-medium text-center truncate">{screenshotName}</p>}

          <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 flex gap-2 text-[10px] sm:text-xs text-text-medium leading-relaxed">
            <AlertCircle size={14} className="text-warning shrink-0" />
            <span>Orders will enter a <strong>Payment Pending</strong> queue. Verification typically completes within 1-2 hours.</span>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider"
            disabled={submitting}
          >
            {submitting ? 'Submitting Receipt...' : 'Submit Receipt Proof'}
          </button>
        </form>
      </div>

    </div>
  );
}
