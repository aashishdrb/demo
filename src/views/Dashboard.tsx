'use client';

import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Package, Heart, MapPin, User, LogOut, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Trash2, Plus } from 'lucide-react';
import { INDIAN_STATES_DISTRICTS } from '../context/AppContext';
import { Order, Product, Address } from '@/lib/db';

type DistrictsMap = typeof INDIAN_STATES_DISTRICTS;
type StateNames = keyof DistrictsMap;

export default function Dashboard() {
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses'>('orders');
  const [addressFormOpen, setAddressFormOpen] = useState(false);

  // Address form states
  const [newName, setNewName] = useState('');
  const [newLine, setNewLine] = useState('');
  const [newState, setNewState] = useState<StateNames | ''>('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (context) {
      context.syncUserSession();
    }
  }, []);

  if (!context) return null;
  const { 
    currentUser, 
    setCurrentUser, 
    orders, 
    products, 
    wishlist, 
    setCurrentPage, 
    setTrackingOrderId,
    updateUserAddressesAPI
  } = context;

  const availableDistricts = newState ? INDIAN_STATES_DISTRICTS[newState] : [];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setCurrentPage('login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleTrackOrder = (orderId: string) => {
    setTrackingOrderId(orderId);
    setCurrentPage('tracking');
    window.scrollTo(0, 0);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    const newErrors: Record<string, string> = {};

    if (!newName.trim()) newErrors.name = 'Full name is required.';
    if (!newLine.trim()) newErrors.address = 'Address line is required.';
    if (!/^\d{6}$/.test(newPincode)) newErrors.pincode = 'Pincode must be exactly 6 digits.';
    if (!newState) newErrors.state = 'State is required.';
    if (!newDistrict) newErrors.district = 'District is required.';
    if (!/^[6-9]\d{9}$/.test(newPhone)) newErrors.phone = 'Mobile must start with 6-9 and be 10 digits.';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    if (!currentUser) return;

    const newAddr: Address = {
      id: `addr-${Math.floor(Math.random() * 10000)}`,
      tag: currentUser.addresses.length === 0 ? 'Home' : 'Other',
      name: newName,
      addressLine: newLine,
      district: newDistrict,
      state: newState,
      pincode: newPincode,
      phone: newPhone,
      isDefault: currentUser.addresses.length === 0
    };

    const updatedAddresses = [...currentUser.addresses, newAddr];
    const success = await updateUserAddressesAPI(updatedAddresses);

    if (success) {
      setNewName('');
      setNewLine('');
      setNewState('');
      setNewDistrict('');
      setNewPincode('');
      setNewPhone('');
      setAddressFormOpen(false);
      alert('Address saved to profile.');
    } else {
      alert('Failed to save address to server.');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!currentUser) return;
    const updatedAddresses = currentUser.addresses.filter(a => a.id !== id);
    const success = await updateUserAddressesAPI(updatedAddresses);
    if (success) {
      alert('Address removed.');
    } else {
      alert('Failed to delete address.');
    }
  };

  // Filter products in wishlist
  const wishlistedProducts = products.filter((p: Product) => wishlist.includes(p.id));

  // If user session is empty, redirect to Login
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-left flex flex-col gap-6 min-h-[70vh] justify-center animate-fade-up select-none">
        <div className="bg-gradient-to-br from-white via-bg-peach/30 to-bg-pink/20 border border-border-lumi rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center gap-6 shadow-[0_12px_40px_rgba(107,83,76,0.05)]">
          {/* Luxury icon container */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-bg-pink to-bg-peach border border-border-lumi flex items-center justify-center text-primary relative shadow-inner">
            <span className="absolute inset-1 rounded-full bg-white/50 border border-dashed border-accent-gold/40"></span>
            <User size={24} className="stroke-[1.5] relative z-10" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-serif font-medium tracking-wide text-text-dark">Lumière Portal</h2>
            <p className="text-xs sm:text-sm text-text-medium leading-relaxed max-w-[280px]">
              Sign in to view your order history, track shipments in real-time, and manage your saved beauty delivery profiles.
            </p>
          </div>

          <button 
            className="group relative w-full mt-2 py-4 bg-gradient-to-r from-primary via-primary-light to-primary text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-[0_4px_15px_rgba(107,83,76,0.12)] hover:shadow-[0_8px_25px_rgba(107,83,76,0.22)] hover:scale-103 active:scale-97 transition-all duration-300 ease-out cursor-pointer flex items-center justify-center gap-2" 
            onClick={() => {
              setCurrentPage('login');
              window.scrollTo(0, 0);
            }}
          >
            {/* Soft glow hover effect */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-gold/15 via-transparent to-accent-gold/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></span>
            <span className="relative z-10">Sign In / Create Account</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 text-left relative">
      
      {/* Profile Info Banner */}
      <div className="flex items-center gap-4 bg-bg-peach border border-border-lumi p-5 rounded-2xl shadow-sm">
        <div className="w-12 h-12 rounded-full bg-bg-pink border border-primary flex items-center justify-center text-primary flex-shrink-0">
          <User size={26} />
        </div>
        <div className="flex-grow text-left">
          <h2 className="text-base sm:text-lg font-serif font-semibold text-text-dark">{currentUser.name}</h2>
          <span className="text-[11px] text-text-light">{currentUser.email} • Customer Profile</span>
        </div>
        <button className="p-2 bg-white hover:bg-danger/10 hover:text-danger border border-border-lumi rounded-full transition-colors active:scale-95 text-text-light" onClick={handleLogout} aria-label="Log out">
          <LogOut size={16} />
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="grid grid-cols-3 bg-bg-cream border border-border-lumi p-1 rounded-xl">
        <button 
          className={`py-2 px-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === 'orders' ? 'bg-white text-primary shadow-sm' : 'text-text-medium'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          <Package size={14} />
          <span className="hidden sm:inline">Order Log</span>
        </button>
        <button 
          className={`py-2 px-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === 'wishlist' ? 'bg-white text-primary shadow-sm' : 'text-text-medium'
          }`}
          onClick={() => setActiveTab('wishlist')}
        >
          <Heart size={14} />
          <span className="hidden sm:inline">Favorites</span>
        </button>
        <button 
          className={`py-2 px-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === 'addresses' ? 'bg-white text-primary shadow-sm' : 'text-text-medium'
          }`}
          onClick={() => setActiveTab('addresses')}
        >
          <MapPin size={14} />
          <span className="hidden sm:inline">Addresses</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[40vh]">
        
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <h3 className="text-xs font-bold text-text-light uppercase tracking-wider">Purchase History</h3>
            
            {orders.length === 0 ? (
              <div className="bg-white border border-border-lumi p-8 rounded-2xl text-center flex flex-col items-center gap-3">
                <p className="text-xs sm:text-sm text-text-medium font-medium">You haven't placed any orders yet.</p>
                <button className="btn btn-secondary w-fit px-6 py-2.5 text-xs font-semibold" onClick={() => setCurrentPage('shop')}>Shop Now</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order: Order) => (
                  <div key={order.order_id} className="bg-white border border-border-lumi p-5 rounded-2xl shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start border-b border-border-lumi pb-3">
                      <div>
                        <span className="text-xs font-bold text-text-dark block">ORDER #{order.order_id}</span>
                        <span className="text-[10px] text-text-light mt-0.5 block">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <span className={`inline-flex items-center gap-1 py-1 px-3 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          order.payment_status === 'Verified' ? 'bg-success-light text-success' : 
                          order.payment_status === 'Pending' ? 'bg-warning-light text-warning' : 'bg-danger-light text-danger'
                        }`}>
                          {order.payment_status}
                        </span>
                        <span className="text-[10px] font-semibold text-text-light uppercase tracking-wider">
                          Status: {order.order_status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {order.products.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-text-medium">
                          <span>{item.product.name} ({item.selectedSize})</span>
                          <span>× {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center border-t border-border-lumi pt-3 mt-1">
                      <span className="text-sm font-bold text-text-dark">Amount: ₹{order.chargesBreakdown.total}</span>
                      
                      <button className="text-xs font-bold text-primary flex items-center gap-1 underline underline-offset-3" onClick={() => handleTrackOrder(order.order_id)}>
                        <span>Track Live Status</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <h3 className="text-xs font-bold text-text-light uppercase tracking-wider">Your Favorites</h3>
            
            {wishlistedProducts.length === 0 ? (
              <div className="bg-white border border-border-lumi p-8 rounded-2xl text-center flex flex-col items-center gap-3">
                <p className="text-xs sm:text-sm text-text-medium font-medium">Your wishlist is empty.</p>
                <button className="btn btn-secondary w-fit px-6 py-2.5 text-xs font-semibold" onClick={() => setCurrentPage('shop')}>Explore Catalog</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wishlistedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-text-light uppercase tracking-wider">Saved Addresses</h3>
              {!addressFormOpen && (
                <button className="text-xs font-bold text-primary flex items-center gap-1" onClick={() => setAddressFormOpen(true)}>
                  <Plus size={14} /> Add New
                </button>
              )}
            </div>

            {/* Address Form panel */}
            {addressFormOpen && (
              <form onSubmit={handleSaveAddress} className="bg-bg-peach border border-border-lumi p-5 rounded-2xl flex flex-col gap-4 shadow-inner">
                <div className="input-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Sarah Jenkins"
                    className={`input-field ${formErrors.name ? 'error' : ''}`}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>

                <div className="input-group">
                  <label>Flat / Street Address</label>
                  <input 
                    type="text" 
                    placeholder="Flat 4B, Signature Residency"
                    className={`input-field ${formErrors.address ? 'error' : ''}`}
                    value={newLine}
                    onChange={(e) => setNewLine(e.target.value)}
                  />
                  {formErrors.address && <span className="error-text">{formErrors.address}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="input-group">
                    <label>State</label>
                    <select
                      className={`input-field ${formErrors.state ? 'error' : ''}`}
                      value={newState}
                      onChange={(e) => setNewState(e.target.value as StateNames)}
                    >
                      <option value="">Select State</option>
                      {Object.keys(INDIAN_STATES_DISTRICTS).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {formErrors.state && <span className="error-text">{formErrors.state}</span>}
                  </div>

                  <div className="input-group">
                    <label>District</label>
                    <select
                      className={`input-field ${formErrors.district ? 'error' : ''}`}
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      disabled={!newState}
                    >
                      <option value="">Select District</option>
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {formErrors.district && <span className="error-text">{formErrors.district}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="input-group">
                    <label>Pincode</label>
                    <input 
                      type="tel" 
                      maxLength={6} 
                      placeholder="201301"
                      className={`input-field ${formErrors.pincode ? 'error' : ''}`}
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                    />
                    {formErrors.pincode && <span className="error-text">{formErrors.pincode}</span>}
                  </div>

                  <div className="input-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      maxLength={10} 
                      placeholder="9876543210"
                      className={`input-field ${formErrors.phone ? 'error' : ''}`}
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                    {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button type="button" className="btn btn-secondary w-full" onClick={() => setAddressFormOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary w-full">Save Address</button>
                </div>
              </form>
            )}

            {/* Address Cards grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser.addresses.map((addr) => (
                <div key={addr.id} className="bg-white border border-border-lumi p-5 rounded-2xl shadow-sm relative text-left">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <MapPin size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{addr.tag}</span>
                    <button 
                      className="ml-auto text-text-light hover:text-danger p-1 transition-colors" 
                      onClick={() => handleDeleteAddress(addr.id)}
                      aria-label="Delete address"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-text-medium leading-relaxed">
                    <h3 className="font-semibold text-text-dark">{addr.name}</h3>
                    <p>{addr.addressLine}</p>
                    <p>{addr.district}, {addr.state} - {addr.pincode}</p>
                    <p>+91 {addr.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
