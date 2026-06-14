import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '919876543210';
    const text = encodeURIComponent('Hi LUMIÈRE! I need support regarding products/orders.');
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <>
      <button className="whatsapp-floating-btn" onClick={handleWhatsAppClick} aria-label="Chat with WhatsApp Support">
        <MessageCircle size={24} color="#FFF" fill="#FFF" className="whatsapp-icon" />
        <span className="whatsapp-tooltip">Chat with us</span>
      </button>

      <style>{`
        .whatsapp-floating-btn {
          position: fixed;
          bottom: 80px; /* Right above the bottom nav */
          right: 16px;
          width: 50px;
          height: 50px;
          border-radius: var(--radius-full);
          background-color: #25D366; /* Official WhatsApp green */
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.3);
          z-index: 980;
          transition: var(--transition);
        }
        .whatsapp-floating-btn:active {
          transform: scale(0.92);
          background-color: #1ebd56;
        }
        .whatsapp-icon {
          animation: pulse 2s infinite;
        }
        .whatsapp-tooltip {
          position: absolute;
          right: 60px;
          background-color: var(--text-dark);
          color: var(--bg-white);
          font-size: 11px;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        .whatsapp-floating-btn:hover .whatsapp-tooltip {
          opacity: 1;
          visibility: visible;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
