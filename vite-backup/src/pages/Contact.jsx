import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919876543210?text=Hi%20LUMIERE%20support!', '_blank');
  };

  return (
    <>
      <div className="contact-page-container animate-fade-up">
        <div className="contact-header">
          <h1>Connect With Us</h1>
          <p>We are here to assist you with order inquiries, product recommendations, or collaborations.</p>
        </div>

        {/* Support Grid Contact details */}
        <div className="contact-info-cards">
          <div className="contact-info-card" onClick={handleWhatsApp}>
            <MessageCircle size={20} color="var(--primary)" />
            <div>
              <h3>WhatsApp Chat</h3>
              <p>+91 98765 43210</p>
              <span>Instant Support (10 AM - 7 PM)</span>
            </div>
          </div>

          <div className="contact-info-card">
            <Mail size={20} color="var(--primary)" />
            <div>
              <h3>Email Support</h3>
              <p>support@lumiere.in</p>
              <span>Response within 24 hours</span>
            </div>
          </div>

          <div className="contact-info-card">
            <MapPin size={20} color="var(--primary)" />
            <div>
              <h3>Head Office</h3>
              <p>Lumière India Pvt Ltd</p>
              <span>Sector 62, Noida, UP - 201301</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Send a Message</h2>
          {submitted ? (
            <div className="success-toast-message" style={{ position: 'static', transform: 'none', width: '100%', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              Your message has been sent successfully! We will get back to you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="input-group">
                <label>Your Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="sarah.j@lumiere.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label>Your Message</label>
                <textarea 
                  className="input-field message-area" 
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary submit-contact-btn">
                <Send size={14} />
                <span>Submit Query</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .contact-page-container {
          padding: 20px 16px 32px;
          text-align: left;
        }
        .contact-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .contact-header h1 {
          font-size: 24px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .contact-header p {
          font-size: 13px;
          color: var(--text-light);
          line-height: 1.4;
          max-width: 280px;
          margin: 0 auto;
        }

        /* Info Cards */
        .contact-info-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }
        .contact-info-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background-color: var(--bg-white);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: var(--transition);
        }
        .contact-info-card:active {
          background-color: var(--bg-pink);
        }
        .contact-info-card h3 {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 2px;
        }
        .contact-info-card p {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary);
        }
        .contact-info-card span {
          font-size: 11px;
          color: var(--text-light);
          display: block;
          margin-top: 2px;
        }

        /* Form */
        .contact-form-section h2 {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 16px;
        }
        .contact-form {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          box-shadow: var(--shadow-sm);
        }
        .message-area {
          height: 100px;
          resize: none;
        }
        .submit-contact-btn {
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
