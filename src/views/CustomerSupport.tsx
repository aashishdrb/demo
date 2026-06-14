'use client';

import React, { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, HelpCircle, Phone } from 'lucide-react';

export default function CustomerSupport() {
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({ 0: true });

  const faqs = [
    {
      q: "How long does shipping take?",
      a: "All Lumière orders are dispatched within 24 hours from our Noida fulfillment center. Shipping usually takes 2-3 business days to reach major metro areas across India."
    },
    {
      q: "What payment methods do you support?",
      a: "To streamline payments and keep our checkout secure, we only support two payment options: 1. UPI Payment (GPay, PhonePe, Paytm, BHIM) and 2. Cash on Delivery (COD)."
    },
    {
      q: "How does UPI Manual Verification work?",
      a: "When you choose UPI, you scan our QR code or use a deep link to pay in your UPI app. Take a screenshot of the completed payment receipt and upload it. The administrator reviews and approves the receipt within 1-2 hours, updating your order status to Confirmed automatically."
    },
    {
      q: "What is your returns and refund policy?",
      a: "Due to strict hygienic and safety standards for personal care products, all sales of Lumière products are final. We do not accept returns or exchanges. If your product arrived damaged during transit, please contact our concierge support within 24 hours of delivery with photo proof for verification, and we will arrange a replacement."
    },
    {
      q: "Are your products safe for sensitive skin?",
      a: "Yes! All Lumière products are dermatologically tested and hypoallergenic. We formulate without parabens, synthetic fragrances, silicones, or toxic sulfates."
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Support ticket created! A Lumière concierge will contact you via email or phone within 4 hours.");
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-up text-left font-sans">
      
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-2 mb-10">
        <HelpCircle size={28} className="text-primary animate-pulse" />
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-text-dark">Customer Care & Support</h1>
        <p className="text-xs sm:text-sm text-text-light max-w-md">
          Read our FAQs below or contact a Lumière concierge for direct assistance.
        </p>
      </div>

      {/* Main Grid: FAQ Accordions (Left) & Forms/Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* FAQs Accordion Column (3/5 width) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <h2 className="text-lg font-serif font-medium text-text-dark border-b border-border-lumi pb-3">Frequently Asked Questions</h2>
          
          <div className="border border-border-lumi rounded-3xl overflow-hidden bg-white shadow-xs divide-y divide-border-lumi">
            {faqs.map((faq, idx) => {
              const isOpen = !!openFaq[idx];
              return (
                <div key={idx} className="transition-all">
                  <button 
                    className="w-full flex justify-between items-center p-5 font-semibold text-xs sm:text-sm text-text-dark hover:bg-bg-pink/30 text-left outline-none cursor-pointer"
                    onClick={() => toggleFaq(idx)}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} className="text-text-light" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 bg-white text-xs sm:text-sm text-text-medium leading-relaxed font-light">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact details & Tickets Column (2/5 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Quick Helpline Cards */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif font-medium text-text-dark border-b border-border-lumi pb-3">Direct Support Help</h2>
            
            <a 
              href="https://wa.me/919876543210?text=I%20need%20help%20with%20my%20order" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-4 p-4 border border-border-lumi bg-white hover:border-primary-light/35 rounded-2xl shadow-xs transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-bg-pink flex items-center justify-center text-primary flex-shrink-0 border border-border-lumi">
                <MessageSquare size={16} />
              </div>
              <div className="text-left">
                <strong className="text-xs font-bold text-text-dark block">Live Chat Support</strong>
                <span className="text-[10px] text-text-light">Instant assistance on WhatsApp</span>
              </div>
            </a>

            <div 
              className="flex items-center gap-4 p-4 border border-border-lumi bg-white hover:border-primary-light/35 rounded-2xl shadow-xs transition-all cursor-pointer"
              onClick={() => alert("Calling customer support helpline: 1800-LUMIERE (1800-586-4373)...")}
            >
              <div className="w-9 h-9 rounded-full bg-bg-pink flex items-center justify-center text-primary flex-shrink-0 border border-border-lumi">
                <Phone size={16} />
              </div>
              <div className="text-left">
                <strong className="text-xs font-bold text-text-dark block">1800-LUMIERE</strong>
                <span className="text-[10px] text-text-light font-light">Toll-free (Mon-Sat, 9AM-7PM)</span>
              </div>
            </div>
          </div>

          {/* Ticket Submission Form */}
          <div className="bg-white border border-border-lumi rounded-3xl p-5 shadow-xs flex flex-col gap-4">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-border-lumi pb-2">Submit Support Ticket</h2>
            
            <form onSubmit={handleSupportTicket} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Order Number (Optional)</label>
                <input 
                  type="text" 
                  className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none" 
                  placeholder="E.g., LM882910" 
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">How can we help you?</label>
                <textarea 
                  className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none h-20 resize-none focus:bg-white transition-all" 
                  placeholder="Describe your issue in detail..." 
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-text-dark hover:bg-black text-white rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-sm active:scale-95"
              >
                Submit Ticket
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
