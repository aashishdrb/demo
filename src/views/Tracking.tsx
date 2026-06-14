'use client';

import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Phone, MessageSquare, Search, AlertCircle, Clock, ClipboardList, ShieldCheck, Box, Truck, MapPin, CheckCircle2 } from 'lucide-react';
import { Order } from '@/lib/db';

export default function Tracking() {
  const context = useContext(AppContext);
  const [lookupId, setLookupId] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  if (!context) return null;
  const { orders, trackingOrderId, setTrackingOrderId, setCurrentPage } = context;

  // Track order resolution priority:
  // 1. FetchedOrder (from active lookup search)
  // 2. Active trackingOrderId state
  // 3. Fallback to latest customer order
  let activeOrder: Order | null = fetchedOrder;

  if (!activeOrder && trackingOrderId) {
    activeOrder = orders.find((o) => o.order_id === trackingOrderId) || null;
  }
  if (!activeOrder && orders.length > 0) {
    activeOrder = orders[0];
  }

  // Fetch order from server if lookup trigger runs
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setFetchedOrder(null);
    const cleanedId = lookupId.trim().toUpperCase();

    if (!cleanedId) {
      setLookupError('Please enter a valid Order ID.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${cleanedId}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setFetchedOrder(data.order);
        setTrackingOrderId(data.order.order_id);
        setLookupId('');
      } else {
        setLookupError(data.error || 'No order found with this Tracking ID.');
      }
    } catch (err) {
      setLookupError('Network error. Failed to retrieve order details.');
    }
    setLoading(false);
  };

  const getStepStatus = (stepName: Order['order_status']) => {
    if (!activeOrder) return 'upcoming';
    
    const statusSequence: Order['order_status'][] = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIdx = statusSequence.indexOf(activeOrder.order_status);
    const stepIdx = statusSequence.indexOf(stepName);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'upcoming';
  };

  const getTimelineDate = (stepName: Order['order_status']) => {
    if (!activeOrder) return '';
    const dateStr = new Date(activeOrder.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const timeStr = new Date(activeOrder.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    if (stepName === 'Placed') return `${dateStr}, ${timeStr}`;
    if (stepName === 'Confirmed') return activeOrder.payment_status === 'Verified' ? `${dateStr}, ${timeStr}` : 'Pending Manual Verify';
    if (stepName === 'Packed' && getStepStatus('Packed') !== 'upcoming') return `${dateStr}, ${timeStr}`;
    if (stepName === 'Shipped' && getStepStatus('Shipped') !== 'upcoming') return `${dateStr}, ${timeStr}`;
    if (stepName === 'Out for Delivery' && getStepStatus('Out for Delivery') !== 'upcoming') return 'Expected today';
    if (stepName === 'Delivered' && getStepStatus('Delivered') !== 'upcoming') return 'Delivered successfully';
    
    return 'Arrival pending';
  };

  const statusSequence: Order['order_status'][] = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentIdx = activeOrder ? statusSequence.indexOf(activeOrder.order_status) : 0;
  const progressPercentage = Math.max(0, Math.min(100, (currentIdx / (statusSequence.length - 1)) * 100));

  const renderStepIndicator = (stepName: Order['order_status']) => {
    const status = getStepStatus(stepName);
    
    let IconComponent = ClipboardList;
    if (stepName === 'Confirmed') IconComponent = ShieldCheck;
    else if (stepName === 'Packed') IconComponent = Box;
    else if (stepName === 'Shipped') IconComponent = Truck;
    else if (stepName === 'Out for Delivery') IconComponent = MapPin;
    else if (stepName === 'Delivered') IconComponent = CheckCircle2;

    const baseClasses = "absolute -left-[36px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 border";

    if (status === 'completed') {
      return (
        <div className={`${baseClasses} bg-primary border-primary text-white shadow-[0_2px_6px_rgba(107,83,76,0.15)]`}>
          <IconComponent size={14} className="stroke-[2.5]" />
        </div>
      );
    }
    if (status === 'active') {
      return (
        <div className={`${baseClasses} bg-gradient-to-r from-[#6B534C] to-[#83675E] border-primary text-white shadow-[0_0_0_4px_rgba(107,83,76,0.25)] animate-pulse`}>
          <IconComponent size={14} className="stroke-[2.5]" />
        </div>
      );
    }
    return (
      <div className={`${baseClasses} bg-white border-border-lumi text-text-light`}>
        <IconComponent size={14} className="stroke-[2]" />
      </div>
    );
  };

  if (!activeOrder) {
    return (
      <div className="max-w-md mx-auto w-full px-4 py-6 text-left flex flex-col gap-6 min-h-[70vh] animate-fade-up">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-serif font-medium text-text-dark">Track Your Order</h1>
          <p className="text-xs sm:text-sm text-text-light mt-1">Enter your Indian order code (e.g. A260613O001) below.</p>
        </div>

        <form onSubmit={handleLookup} className="w-full flex border border-border-lumi bg-bg-cream rounded-xl overflow-hidden shadow-inner">
          <input 
            type="text" 
            placeholder="Order ID (e.g. A260613O001)" 
            className="flex-grow px-4 py-3 bg-transparent border-none text-xs font-semibold tracking-wider text-text-dark focus:outline-none placeholder-text-light uppercase"
            value={lookupId}
            onChange={(e) => {
              setLookupId(e.target.value);
              setLookupError('');
            }}
          />
          <button type="submit" className="px-5 bg-primary text-white flex items-center justify-center cursor-pointer select-none">
            <Search size={16} />
          </button>
        </form>
        {lookupError && <p className="text-xs text-danger font-medium mt-1">{lookupError}</p>}
        {loading && <p className="text-xs text-text-light mt-1 animate-pulse">Retrieving live data...</p>}

        <div className="bg-bg-peach border border-border-lumi rounded-2xl p-6 flex flex-col items-center gap-2 mt-4">
          <AlertCircle size={24} className="text-primary animate-pulse" />
          <h3 className="text-xs sm:text-sm font-semibold text-text-dark">No Active Shipments Found</h3>
          <p className="text-[10px] sm:text-xs text-text-light">Have you placed an order? Sign in to save addresses, track orders, and view history.</p>
          <button className="btn btn-secondary w-fit mt-3 px-6 py-2.5 text-xs font-semibold" onClick={() => setCurrentPage('shop')}>
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  const isCancelled = activeOrder.order_status === 'Cancelled';

  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 flex flex-col gap-6 text-left animate-fade-up">
      
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-border-lumi pb-4">
        <span className="text-[10px] font-bold text-text-light tracking-wider uppercase">ORDER #{activeOrder.order_id}</span>
        <h1 className="text-2xl font-serif font-medium text-text-dark leading-tight">
          {isCancelled ? 'Order Cancelled' : 'Your glow is on its way!'}
        </h1>
      </div>

      {isCancelled && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl p-4 flex items-center gap-2.5 animate-fade-up shadow-sm">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 animate-pulse" />
          <span>This order has been cancelled. Refund processing details have been dispatched to your email.</span>
        </div>
      )}

      {/* Map ETA Card */}
      <div className="border border-border-lumi rounded-3xl overflow-hidden bg-bg-cream shadow-sm relative h-48">
        <svg viewBox="0 0 400 200" className="w-full h-full text-border-lumi">
          <path d="M0,40 h400 M0,80 h400 M0,120 h400 M0,160 h400 M40,0 v200 M80,0 v200 M120,0 v200 M160,0 v200 M200,0 v200 M240,0 v200 M280,0 v200 M320,0 v200 M360,0 v200" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M 20 20 C 100 20, 150 120, 250 80 S 320 160, 380 140" fill="none" stroke="#F4ECE6" strokeWidth="12" strokeLinecap="round" />
          <path d="M 20 20 C 100 20, 150 120, 250 80 S 320 160, 380 140" fill="none" stroke="#D8C6BD" strokeWidth="2" strokeDasharray="3,3" strokeLinecap="round" />
          <path d="M 100 120 L 300 30" fill="none" stroke="#F4ECE6" strokeWidth="10" strokeLinecap="round" />
          <path d="M 100 120 L 300 30" fill="none" stroke="#D8C6BD" strokeWidth="2" strokeDasharray="3,3" strokeLinecap="round" />
          <circle cx="210" cy="88" r="7" fill={isCancelled ? "var(--color-danger)" : "var(--color-primary)"} />
          {!isCancelled && (
            <circle cx="210" cy="88" r="14" fill="none" stroke="var(--color-primary)" strokeWidth="1" className="animate-ping" style={{ transformOrigin: '210px 88px' }} />
          )}
        </svg>
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[10px] font-bold text-text-dark px-3 py-1.5 rounded-full shadow-sm">
          {activeOrder.order_status === 'Delivered' ? 'Delivered' : isCancelled ? 'Cancelled' : 'ETA: 2-3 Days'}
        </div>
      </div>

      {/* Driver Card */}
      <div className="bg-white border border-border-lumi rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-bg-cream flex-shrink-0">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Marcus Reed" className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-xs sm:text-sm text-text-dark">MARCUS REED</h3>
          <span className="text-[10px] text-text-light block">Premium Courier Service</span>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-bg-cream hover:bg-bg-pink flex items-center justify-center text-text-dark border border-border-lumi active:scale-90" onClick={() => alert("Calling Courier dispatch (+91 98765 43210)...")}>
            <Phone size={16} />
          </button>
          <button className="w-9 h-9 rounded-full bg-bg-cream hover:bg-bg-pink flex items-center justify-center text-text-dark border border-border-lumi active:scale-90" onClick={() => alert("Opening live courier support desk...")}>
            <MessageSquare size={16} />
          </button>
        </div>
      </div>

      {/* Mini search bar */}
      <div className="flex flex-col gap-2">
        <form onSubmit={handleLookup} className="flex border border-border-lumi bg-bg-cream rounded-xl overflow-hidden shadow-inner">
          <input 
            type="text" 
            placeholder="Track another order ID" 
            className="flex-grow px-3 py-2.5 bg-transparent border-none text-[11px] text-text-dark focus:outline-none placeholder-text-light uppercase font-semibold"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
          />
          <button type="submit" className="px-3 text-text-medium"><Search size={14} /></button>
        </form>
        {lookupError && <p className="text-[11px] text-danger font-medium pl-2">{lookupError}</p>}
      </div>

      {/* Live tracking timeline */}
      <div className="bg-white border border-border-lumi p-6 rounded-2xl shadow-sm flex flex-col gap-6 relative">
        {/* Track timeline list */}
        <div className="relative flex flex-col gap-8 pl-10 text-left">
          {/* Timeline background line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-border-lumi"></div>
          {/* Dynamic accent progress line */}
          <div 
            className="absolute left-[19px] top-4 w-[2px] bg-gradient-to-b from-[#6B534C] to-[#83675E] transition-all duration-500 ease-in-out"
            style={{ height: `${progressPercentage}%` }}
          ></div>

          {/* Placed */}
          <div className="relative text-left min-h-[36px]">
            {renderStepIndicator('Placed')}
            <div className="flex flex-col gap-0.5">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${getStepStatus('Placed') !== 'upcoming' ? 'text-primary' : 'text-text-light'}`}>ORDER PLACED</h3>
              <span className="text-[11px] text-text-light">{getTimelineDate('Placed')}</span>
            </div>
          </div>

          {/* Confirmed */}
          <div className="relative text-left min-h-[36px]">
            {renderStepIndicator('Confirmed')}
            <div className="flex flex-col gap-0.5">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${getStepStatus('Confirmed') !== 'upcoming' ? 'text-primary' : 'text-text-light'}`}>ORDER CONFIRMED</h3>
              <span className="text-[11px] text-text-light">{getTimelineDate('Confirmed')}</span>
            </div>
          </div>

          {/* Packed */}
          <div className="relative text-left min-h-[36px]">
            {renderStepIndicator('Packed')}
            <div className="flex flex-col gap-0.5">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${getStepStatus('Packed') !== 'upcoming' ? 'text-primary' : 'text-text-light'}`}>PACKED</h3>
              <span className="text-[11px] text-text-light">{getTimelineDate('Packed')}</span>
            </div>
          </div>

          {/* Shipped */}
          <div className="relative text-left min-h-[36px]">
            {renderStepIndicator('Shipped')}
            <div className="flex flex-col gap-0.5">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${getStepStatus('Shipped') !== 'upcoming' ? 'text-primary' : 'text-text-light'}`}>SHIPPED</h3>
              <span className="text-[11px] text-text-light">{getTimelineDate('Shipped')}</span>
            </div>
          </div>

          {/* Out for Delivery */}
          <div className="relative text-left min-h-[36px]">
            {renderStepIndicator('Out for Delivery')}
            <div className="flex flex-col gap-0.5">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${getStepStatus('Out for Delivery') !== 'upcoming' ? 'text-primary' : 'text-text-light'}`}>OUT FOR DELIVERY</h3>
              <span className="text-[11px] text-text-light">{getTimelineDate('Out for Delivery')}</span>
            </div>
          </div>

          {/* Delivered */}
          <div className="relative text-left min-h-[36px]">
            {renderStepIndicator('Delivered')}
            <div className="flex flex-col gap-0.5">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${getStepStatus('Delivered') !== 'upcoming' ? 'text-primary' : 'text-text-light'}`}>DELIVERED</h3>
              <span className="text-[11px] text-text-light">{getTimelineDate('Delivered')}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Concierge support */}
      <div className="bg-bg-pink border border-dashed border-primary p-5 rounded-2xl flex flex-col gap-3 text-center">
        <p className="text-xs text-text-medium leading-relaxed">Need assistance? Our concierge is here to help you.</p>
        <button className="btn btn-primary py-2.5 text-xs font-semibold" onClick={() => setCurrentPage('support')}>
          CHAT WITH US
        </button>
      </div>

    </div>
  );
}
