import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Phone, MessageSquare, Search, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Tracking() {
  const { orders, trackingOrderId, setTrackingOrderId, setCurrentPage } = useContext(AppContext);
  const [lookupId, setLookupId] = useState('');
  const [lookupError, setLookupError] = useState('');

  // Find tracking order
  let order = null;
  if (trackingOrderId) {
    order = orders.find((o) => o.id === trackingOrderId);
  } else if (orders.length > 0) {
    // Default to latest order if none specified
    order = orders[0];
  }

  const handleLookup = (e) => {
    e.preventDefault();
    setLookupError('');
    const match = orders.find((o) => o.id.trim().toUpperCase() === lookupId.trim().toUpperCase());
    if (match) {
      setTrackingOrderId(match.id);
      setLookupId('');
    } else {
      setLookupError('No order found with this Tracking ID.');
    }
  };

  const getStepStatus = (stepName) => {
    if (!order) return 'upcoming';
    
    const statusSequence = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIdx = statusSequence.indexOf(order.status);
    const stepIdx = statusSequence.indexOf(stepName);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'upcoming';
  };

  // Helper dates (mocked for visual timeline styling)
  const getTimelineDate = (stepName) => {
    if (!order) return '';
    const dateStr = order.date;
    
    if (stepName === 'Placed') return `${dateStr}, ${order.time}`;
    if (stepName === 'Confirmed') return order.paymentStatus === 'Verified' ? `${dateStr}, ${order.time}` : 'Pending Verification';
    if (stepName === 'Packed' && getStepStatus('Packed') !== 'upcoming') return `${dateStr}, ${order.time}`;
    if (stepName === 'Shipped' && getStepStatus('Shipped') !== 'upcoming') return `${dateStr}, ${order.time}`;
    if (stepName === 'Out for Delivery' && getStepStatus('Out for Delivery') !== 'upcoming') return 'Expected today';
    if (stepName === 'Delivered' && getStepStatus('Delivered') !== 'upcoming') return 'Delivered successfully';
    
    return 'Arrival pending';
  };

  // If no order exists and no lookup, render fallback search view
  if (!order) {
    return (
      <div className="tracking-fallback animate-fade-up">
        <div className="fallback-header">
          <h1>Track Your Order</h1>
          <p>Enter your 8-digit order number (e.g., LM123456) to get live tracking updates.</p>
        </div>

        <form onSubmit={handleLookup} className="lookup-search-form">
          <input 
            type="text" 
            placeholder="Order ID (e.g. LM882910)" 
            className="input-field lookup-input"
            value={lookupId}
            onChange={(e) => {
              setLookupId(e.target.value);
              setLookupError('');
            }}
          />
          <button type="submit" className="btn btn-primary lookup-submit-btn">
            <Search size={16} />
            <span>Track Order</span>
          </button>
        </form>
        {lookupError && <p className="error-text">{lookupError}</p>}

        <div className="no-orders-banner">
          <AlertCircle size={20} color="var(--primary)" />
          <h3>No Orders Found</h3>
          <p>Have you placed an order? Make sure you are logged in or browse our catalog to purchase.</p>
          <button className="btn btn-secondary" onClick={() => setCurrentPage('shop')} style={{ marginTop: '12px' }}>
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="tracking-container animate-fade-up">
        {/* Header */}
        <div className="tracking-header">
          <span className="tracking-order-num">ORDER #{order.id}</span>
          <h1>Your glow is on its way!</h1>
        </div>

        {/* Mock Map / ETA Card (image_3.png) */}
        <div className="tracking-map-card">
          <div className="map-canvas">
            {/* Draw a stylish abstract map path inside SVG */}
            <svg viewBox="0 0 400 200" className="map-vector">
              {/* Grid pattern lines */}
              <path d="M0,40 h400 M0,80 h400 M0,120 h400 M0,160 h400 M40,0 v200 M80,0 v200 M120,0 v200 M160,0 v200 M200,0 v200 M240,0 v200 M280,0 v200 M320,0 v200 M360,0 v200" stroke="#E6DDD6" strokeWidth="0.5" fill="none" />
              {/* Map roads */}
              <path d="M 20 20 C 100 20, 150 120, 250 80 S 320 160, 380 140" fill="none" stroke="#F4ECE6" strokeWidth="12" strokeLinecap="round" />
              <path d="M 20 20 C 100 20, 150 120, 250 80 S 320 160, 380 140" fill="none" stroke="#D8C6BD" strokeWidth="2" strokeDasharray="3,3" strokeLinecap="round" />
              
              <path d="M 100 120 L 300 30" fill="none" stroke="#F4ECE6" strokeWidth="10" strokeLinecap="round" />
              <path d="M 100 120 L 300 30" fill="none" stroke="#D8C6BD" strokeWidth="2" strokeDasharray="3,3" strokeLinecap="round" />

              {/* Delivery vehicle marker dot */}
              <circle cx="210" cy="88" r="7" fill="var(--primary)" />
              <circle cx="210" cy="88" r="14" fill="none" stroke="var(--primary)" strokeWidth="1" className="radar-circle-anim" />
            </svg>
            <div className="map-eta-badge">ETA: {order.status === 'Delivered' ? 'Delivered' : '2-3 Days'}</div>
          </div>
        </div>

        {/* Courier Driver Info Card (image_3.png) */}
        <div className="courier-driver-card">
          <div className="driver-avatar">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Marcus Reed Courier" />
          </div>
          <div className="driver-details">
            <h3>MARCUS REED</h3>
            <span>Premium Courier Service</span>
          </div>
          <div className="driver-actions">
            <button className="driver-icon-btn" onClick={() => alert("Calling driver Marcus Reed (+91 98765 43210)...")}>
              <Phone size={18} />
            </button>
            <button className="driver-icon-btn" onClick={() => alert("Opening chat with courier service...")}>
              <MessageSquare size={18} />
            </button>
          </div>
        </div>

        {/* Search tool for other orders */}
        <div className="lookup-mini-bar">
          <form onSubmit={handleLookup} className="lookup-mini-form">
            <input 
              type="text" 
              placeholder="Track other order ID" 
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
            />
            <button type="submit"><Search size={16} /></button>
          </form>
          {lookupError && <p className="error-text" style={{ paddingLeft: '8px' }}>{lookupError}</p>}
        </div>

        {/* Vertical Timeline (image_3.png) */}
        <div className="tracking-timeline-box">
          <div className="timeline-list">
            
            {/* Step 1: ORDER CONFIRMED */}
            <div className={`timeline-step ${getStepStatus('Confirmed')}`}>
              <div className="timeline-node">
                <div className="node-dot"></div>
              </div>
              <div className="timeline-info">
                <h3>ORDER CONFIRMED</h3>
                <span>{getTimelineDate('Confirmed')}</span>
              </div>
            </div>

            {/* Step 2: PACKED */}
            <div className={`timeline-step ${getStepStatus('Packed')}`}>
              <div className="timeline-node">
                <div className="node-dot"></div>
              </div>
              <div className="timeline-info">
                <h3>PACKED</h3>
                <span>{getTimelineDate('Packed')}</span>
              </div>
            </div>

            {/* Step 3: SHIPPED */}
            <div className={`timeline-step ${getStepStatus('Shipped')}`}>
              <div className="timeline-node">
                <div className="node-dot"></div>
              </div>
              <div className="timeline-info">
                <h3>SHIPPED</h3>
                <span>{getTimelineDate('Shipped')}</span>
              </div>
            </div>

            {/* Step 4: OUT FOR DELIVERY */}
            <div className={`timeline-step ${getStepStatus('Out for Delivery')}`}>
              <div className="timeline-node">
                <div className="node-dot"></div>
              </div>
              <div className="timeline-info">
                <h3>OUT FOR DELIVERY</h3>
                <span>{getTimelineDate('Out for Delivery')}</span>
              </div>
            </div>

            {/* Step 5: DELIVERED */}
            <div className={`timeline-step ${getStepStatus('Delivered')}`}>
              <div className="timeline-node">
                <div className="node-dot"></div>
              </div>
              <div className="timeline-info">
                <h3>DELIVERED</h3>
                <span>{getTimelineDate('Delivered')}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Need assistance card (image_3.png) */}
        <div className="assistance-blush-box">
          <p>Need assistance? Our concierge is here to help you.</p>
          <button className="btn btn-primary assistance-chat-btn" onClick={() => setCurrentPage('support')}>
            CHAT WITH US
          </button>
        </div>
      </div>

      <style>{`
        .tracking-container {
          padding: 20px 16px 32px;
          text-align: left;
        }
        .tracking-header {
          margin-bottom: 24px;
        }
        .tracking-order-num {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-light);
          letter-spacing: 0.8px;
        }
        .tracking-header h1 {
          font-size: 26px;
          font-weight: 500;
          color: var(--text-dark);
          line-height: 1.2;
          margin-top: 4px;
        }

        /* Map Canvas */
        .tracking-map-card {
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
          background-color: var(--bg-cream);
          margin-bottom: 20px;
          box-shadow: var(--shadow-sm);
        }
        .map-canvas {
          position: relative;
          height: 180px;
          width: 100%;
        }
        .map-vector {
          width: 100%;
          height: 100%;
        }
        .map-eta-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(4px);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-dark);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          box-shadow: var(--shadow-sm);
        }
        .radar-circle-anim {
          transform-origin: 210px 88px;
          animation: radar 2s infinite ease-out;
        }
        @keyframes radar {
          0% {
            transform: scale(0.4);
            opacity: 1;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        /* Courier driver profile card */
        .courier-driver-card {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          box-shadow: var(--shadow-sm);
        }
        .driver-avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          overflow: hidden;
          background-color: var(--bg-cream);
          flex-shrink: 0;
        }
        .driver-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .driver-details {
          flex-grow: 1;
        }
        .driver-details h3 {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-dark);
        }
        .driver-details span {
          font-size: 11px;
          color: var(--text-light);
        }
        .driver-actions {
          display: flex;
          gap: 8px;
        }
        .driver-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          background-color: var(--bg-cream);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dark);
        }
        .driver-icon-btn:active {
          background-color: var(--border-focus);
        }

        /* Lookup search bars */
        .lookup-mini-bar {
          margin-bottom: 24px;
        }
        .lookup-mini-form {
          display: grid;
          grid-template-columns: 1fr 40px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background-color: var(--bg-cream);
          overflow: hidden;
        }
        .lookup-mini-form input {
          border: none;
          background: none;
          padding: 10px 14px;
          font-family: var(--font-sans);
          font-size: 13px;
          outline: none;
        }
        .lookup-mini-form button {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--primary);
          color: var(--bg-white);
        }

        /* Fallback View */
        .tracking-fallback {
          padding: 40px 20px;
          text-align: center;
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .fallback-header h1 {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .fallback-header p {
          font-size: 14px;
          color: var(--text-medium);
          max-width: 280px;
        }
        .lookup-search-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }
        .lookup-input {
          text-align: center;
          text-transform: uppercase;
        }
        .lookup-submit-btn {
          font-weight: 600;
        }
        .no-orders-banner {
          background-color: var(--bg-cream);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px 16px;
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .no-orders-banner h3 {
          font-size: 15px;
          font-weight: 600;
        }
        .no-orders-banner p {
          font-size: 12px;
          color: var(--text-light);
        }

        /* Timeline timeline list */
        .tracking-timeline-box {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 20px 16px;
          margin-bottom: 24px;
        }
        .timeline-list {
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .timeline-list::before {
          content: '';
          position: absolute;
          top: 8px;
          left: 9px;
          bottom: 12px;
          width: 2px;
          background-color: var(--border);
        }
        .timeline-step {
          display: flex;
          gap: 16px;
          padding-bottom: 28px;
          position: relative;
        }
        .timeline-step:last-child {
          padding-bottom: 0;
        }
        .timeline-node {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-white);
          z-index: 5;
        }
        .node-dot {
          width: 10px;
          height: 10px;
          border-radius: var(--radius-full);
          background-color: var(--border-focus);
          transition: var(--transition);
        }
        
        /* Step Status styling */
        .timeline-step.completed .node-dot {
          background-color: var(--primary);
        }
        .timeline-step.completed .timeline-info h3 {
          color: var(--primary);
          font-weight: 600;
        }
        .timeline-step.completed .timeline-info span {
          color: var(--text-medium);
        }

        .timeline-step.active .node-dot {
          background-color: var(--primary);
          box-shadow: 0 0 0 4px var(--bg-pink);
          animation: pulseNode 1.5s infinite;
        }
        .timeline-step.active .timeline-info h3 {
          color: var(--primary);
          font-weight: 700;
        }
        .timeline-step.active .timeline-info span {
          color: var(--primary);
          font-weight: 500;
        }

        .timeline-step.upcoming .timeline-info h3 {
          color: var(--text-light);
          font-weight: 500;
        }
        .timeline-step.upcoming .timeline-info span {
          color: var(--text-light);
        }

        @keyframes pulseNode {
          0% {
            box-shadow: 0 0 0 0px rgba(107, 83, 76, 0.4);
          }
          100% {
            box-shadow: 0 0 0 8px rgba(107, 83, 76, 0);
          }
        }

        .timeline-info h3 {
          font-family: var(--font-sans);
          font-size: 13px;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .timeline-info span {
          font-size: 11px;
        }

        /* Concierge help card */
        .assistance-blush-box {
          background-color: var(--bg-pink);
          border-radius: var(--radius-lg);
          padding: 20px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 14px;
          border: 1px dashed var(--primary);
        }
        .assistance-blush-box p {
          font-size: 13px;
          color: var(--text-medium);
          line-height: 1.4;
        }
        .assistance-chat-btn {
          font-weight: 600;
          font-size: 13px;
        }
      `}</style>
    </>
  );
}
