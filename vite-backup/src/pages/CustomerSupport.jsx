import React, { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, HelpCircle, Phone, Mail } from 'lucide-react';

export default function CustomerSupport() {
  const [openFaq, setOpenFaq] = useState({ 0: true });

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
      a: "We offer a premium 30-Day Money-Back Guarantee. If you are not satisfied with your purchase, you can return sealed, unused products for a full refund. Contact our support team to schedule a reverse pickup."
    },
    {
      q: "Are your products safe for sensitive skin?",
      a: "Yes! All Lumière products are dermatologically tested and hypoallergenic. We formulate without parabens, synthetic fragrances, silicones, or toxic sulfates."
    }
  ];

  const toggleFaq = (idx) => {
    setOpenFaq(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSupportTicket = (e) => {
    e.preventDefault();
    alert("Support ticket created! A Lumière concierge will contact you via email or phone within 4 hours.");
  };

  return (
    <>
      <div className="support-page-container animate-fade-up">
        {/* Header */}
        <div className="support-header">
          <HelpCircle size={28} color="var(--primary)" />
          <h1>Customer Care & Support</h1>
          <p>Read our FAQs below or contact a Lumière concierge for direct assistance.</p>
        </div>

        {/* FAQs Accordion */}
        <div className="support-section">
          <h2>Frequently Asked Questions</h2>
          
          <div className="support-faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = !!openFaq[idx];
              return (
                <div key={idx} className="support-faq-item">
                  <button className="faq-header" onClick={() => toggleFaq(idx)}>
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div className="faq-body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact details */}
        <div className="support-section" style={{ marginTop: '16px' }}>
          <h2>Direct Support Help</h2>
          
          <div className="support-quick-cards">
            <a href="https://wa.me/919876543210?text=I%20need%20help%20with%20my%20order" target="_blank" rel="noopener noreferrer" className="support-quick-card">
              <MessageSquare size={18} />
              <div>
                <strong>Live Chat Support</strong>
                <span>Instant help on WhatsApp</span>
              </div>
            </a>
            <div className="support-quick-card" onClick={() => alert("Calling customer support helpline: 1800-LUMIERE (1800-586-4373)...")}>
              <Phone size={18} />
              <div>
                <strong>1800-LUMIERE</strong>
                <span>Toll-free (Mon-Sat, 9AM-7PM)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support ticket submission form */}
        <div className="support-section" style={{ marginTop: '16px' }}>
          <h2>Submit a Support Ticket</h2>
          <form onSubmit={handleSupportTicket} className="support-ticket-form">
            <div className="input-group">
              <label>Order Number (Optional)</label>
              <input type="text" className="input-field" placeholder="LM882910" />
            </div>
            <div className="input-group">
              <label>How can we help you?</label>
              <textarea className="input-field ticket-area" placeholder="Describe your issue in detail..." required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Submit Ticket</button>
          </form>
        </div>
      </div>

      <style>{`
        .support-page-container {
          padding: 20px 16px 32px;
          text-align: left;
        }
        .support-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .support-header h1 {
          font-size: 24px;
          font-weight: 500;
          margin-top: 8px;
          margin-bottom: 4px;
        }
        .support-header p {
          font-size: 13px;
          color: var(--text-light);
          line-height: 1.4;
          max-width: 280px;
          margin: 0 auto;
        }

        .support-section h2 {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 14px;
        }

        /* FAQ Accordion list */
        .support-faq-list {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: var(--bg-white);
        }
        .support-faq-item {
          border-bottom: 1px solid var(--border);
        }
        .support-faq-item:last-child {
          border-bottom: none;
        }
        .faq-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-dark);
          text-align: left;
          background-color: var(--bg-cream);
        }
        .faq-body {
          padding: 16px;
          background-color: var(--bg-white);
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-medium);
        }

        /* Support quick cards link options */
        .support-quick-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .support-quick-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background-color: var(--bg-white);
          color: var(--text-dark);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
        }
        .support-quick-card:active {
          background-color: var(--bg-pink);
        }
        .support-quick-card strong {
          font-size: 13px;
          display: block;
        }
        .support-quick-card span {
          font-size: 11px;
          color: var(--text-light);
        }

        .ticket-area {
          height: 80px;
          resize: none;
        }
      `}</style>
    </>
  );
}
