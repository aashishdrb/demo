import React, { useContext, useState } from 'react';
import { AppContext, INDIAN_STATES_DISTRICTS } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Package, Heart, MapPin, User, LogOut, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Trash2, Plus } from 'lucide-react';

export default function Dashboard() {
  const { 
    currentUser, 
    setCurrentUser, 
    orders, 
    products, 
    wishlist, 
    setCurrentPage, 
    setTrackingOrderId 
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('orders'); // orders, wishlist, addresses
  const [addressFormOpen, setAddressFormOpen] = useState(false);

  // Address form states
  const [newName, setNewName] = useState('');
  const [newLine, setNewLine] = useState('');
  const [newState, setNewState] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const availableDistricts = newState ? INDIAN_STATES_DISTRICTS[newState] : [];

  const handleLogout = () => {
    // Mock logout: set user to guest/empty or go to login page
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleTrackOrder = (orderId) => {
    setTrackingOrderId(orderId);
    setCurrentPage('tracking');
    window.scrollTo(0, 0);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    setFormErrors({});
    const newErrors = {};

    if (!newName.trim()) newErrors.name = 'Full name is required.';
    if (!newLine.trim()) newErrors.address = 'Address line is required.';
    if (!/^\d{6}$/.test(newPincode)) newErrors.pincode = 'Pincode must be 6 digits.';
    if (!newState) newErrors.state = 'State is required.';
    if (!newDistrict) newErrors.district = 'District is required.';
    if (!/^[6-9]\d{9}$/.test(newPhone)) newErrors.phone = 'Mobile must start with 6-9 and be 10 digits.';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    const newAddr = {
      id: `addr-${Math.floor(Math.random() * 10000)}`,
      tag: 'Other',
      name: newName,
      addressLine: newLine,
      district: newDistrict,
      state: newState,
      pincode: newPincode,
      phone: newPhone,
      isDefault: currentUser.addresses.length === 0
    };

    setCurrentUser(prev => ({
      ...prev,
      addresses: [...prev.addresses, newAddr]
    }));

    // Clear form
    setNewName('');
    setNewLine('');
    setNewState('');
    setNewDistrict('');
    setNewPincode('');
    setNewPhone('');
    setAddressFormOpen(false);
  };

  const handleDeleteAddress = (id) => {
    setCurrentUser(prev => ({
      ...prev,
      addresses: prev.addresses.filter(a => a.id !== id)
    }));
  };

  // Filter products in wishlist
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  // If user is null, redirect to login page (mocked by page toggle)
  if (!currentUser) {
    return (
      <div className="dashboard-guest animate-fade-up">
        <h2>Account Login</h2>
        <p>Log in to save addresses, track orders, and view your skincare history.</p>
        <button className="btn btn-primary" onClick={() => setCurrentPage('login')}>
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-container animate-fade-up">
        {/* User Profile Banner */}
        <div className="user-profile-banner">
          <div className="user-avatar-circle">
            <User size={32} color="var(--primary)" />
          </div>
          <div className="user-meta-info">
            <h2>{currentUser.name}</h2>
            <span>{currentUser.email} • Customer</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} aria-label="Log out">
            <LogOut size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`dash-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={16} />
            <span>Orders</span>
          </button>
          <button 
            className={`dash-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <Heart size={16} />
            <span>Wishlist</span>
          </button>
          <button 
            className={`dash-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <MapPin size={16} />
            <span>Addresses</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="dashboard-content-panel">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="orders-tab-content">
              <h3>Order History</h3>
              {orders.length === 0 ? (
                <div className="empty-dash-state">
                  <p>You haven't placed any orders yet.</p>
                  <button className="btn btn-secondary" onClick={() => setCurrentPage('shop')}>Shop Now</button>
                </div>
              ) : (
                <div className="dashboard-orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="dash-order-card">
                      <div className="order-card-header">
                        <div>
                          <span className="order-id-label">ORDER #{order.id}</span>
                          <span className="order-date-text">{order.date} at {order.time}</span>
                        </div>
                        
                        {/* Payment Status Badges */}
                        <div className="badges-wrapper">
                          <span className={`status-badge pay-${order.paymentStatus.toLowerCase()}`}>
                            {order.paymentStatus === 'Verified' && <CheckCircle2 size={10} />}
                            {order.paymentStatus === 'Pending' && <AlertTriangle size={10} />}
                            {order.paymentStatus === 'Failed' && <XCircle size={10} />}
                            {order.paymentStatus}
                          </span>
                          
                          {/* Order Status Badge */}
                          <span className="status-badge order-status-text">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="order-card-items-preview">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="preview-item-row">
                            <span className="item-name">{item.product.name} ({item.selectedSize})</span>
                            <span className="item-qty">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-card-footer">
                        <span className="order-total-price">Total: ₹{order.chargesBreakdown.total}</span>
                        <button className="track-link-btn" onClick={() => handleTrackOrder(order.id)}>
                          <span>Track Live</span>
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
            <div className="wishlist-tab-content">
              <h3>Your Favorites</h3>
              {wishlistedProducts.length === 0 ? (
                <div className="empty-dash-state">
                  <p>Your wishlist is empty. Explore our catalog to add favorites.</p>
                  <button className="btn btn-secondary" onClick={() => setCurrentPage('shop')}>Browse Shop</button>
                </div>
              ) : (
                <div className="wishlist-products-grid">
                  {wishlistedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="addresses-tab-content">
              <div className="section-header" style={{ marginBottom: '16px' }}>
                <h3>Saved Addresses</h3>
                {!addressFormOpen && (
                  <button className="add-address-btn" onClick={() => setAddressFormOpen(true)}>
                    <Plus size={16} /> Add New
                  </button>
                )}
              </div>

              {/* Add address Form */}
              {addressFormOpen && (
                <form onSubmit={handleSaveAddress} className="address-add-form">
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
                      placeholder="Flat 4B, Rosewood Terrace"
                      className={`input-field ${formErrors.address ? 'error' : ''}`}
                      value={newLine}
                      onChange={(e) => setNewLine(e.target.value)}
                    />
                    {formErrors.address && <span className="error-text">{formErrors.address}</span>}
                  </div>

                  <div className="form-grid-2">
                    <div className="input-group">
                      <label>State</label>
                      <select
                        className={`input-field ${formErrors.state ? 'error' : ''}`}
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
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

                  <div className="form-grid-2">
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

                  <div className="form-action-buttons">
                    <button type="button" className="btn btn-secondary" onClick={() => setAddressFormOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Address</button>
                  </div>
                </form>
              )}

              {/* Saved Address list */}
              <div className="addresses-list">
                {currentUser.addresses.map((addr) => (
                  <div key={addr.id} className="address-saved-card select-none">
                    <div className="address-card-header">
                      <MapPin size={16} color="var(--primary)" />
                      <span className="address-tag-text">{addr.tag}</span>
                      <button 
                        className="delete-address-btn" 
                        onClick={() => handleDeleteAddress(addr.id)}
                        aria-label="Delete address"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="address-card-body" style={{ marginTop: '8px' }}>
                      <h3>{addr.name}</h3>
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

      <style>{`
        .dashboard-container {
          padding: 20px 16px 32px;
          text-align: left;
        }

        /* Profile Banner */
        .user-profile-banner {
          display: flex;
          align-items: center;
          background-color: var(--bg-peach);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 18px 16px;
          gap: 12px;
          margin-bottom: 24px;
        }
        .user-avatar-circle {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-full);
          background-color: var(--bg-pink);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-meta-info {
          flex-grow: 1;
        }
        .user-meta-info h2 {
          font-size: 18px;
          font-weight: 500;
          color: var(--text-dark);
        }
        .user-meta-info span {
          font-size: 12px;
          color: var(--text-light);
        }
        .logout-btn {
          color: var(--text-light);
          padding: 6px;
          border-radius: var(--radius-full);
        }
        .logout-btn:active {
          color: var(--danger);
          background-color: var(--danger-light);
        }

        /* Tabs Nav */
        .dashboard-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          background-color: var(--bg-cream);
          padding: 4px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          border: 1px solid var(--border);
        }
        .dash-tab-btn {
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-medium);
          border-radius: var(--radius-sm);
        }
        .dash-tab-btn.active {
          background-color: var(--bg-white);
          color: var(--primary);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        /* Content panel */
        .dashboard-content-panel h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-dark);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .empty-dash-state {
          padding: 32px 16px;
          text-align: center;
          background-color: var(--bg-cream);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .empty-dash-state p {
          font-size: 13px;
          color: var(--text-medium);
        }

        /* Guest State */
        .dashboard-guest {
          padding: 64px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          min-height: 70vh;
        }
        .dashboard-guest h2 {
          font-size: 22px;
        }
        .dashboard-guest p {
          font-size: 14px;
          color: var(--text-medium);
          max-width: 260px;
        }

        /* Orders list cards */
        .dashboard-orders-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .dash-order-card {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          box-shadow: var(--shadow-sm);
        }
        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border);
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
        .order-id-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-dark);
          display: block;
        }
        .order-date-text {
          font-size: 11px;
          color: var(--text-light);
          display: block;
        }
        .badges-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          font-size: 10px;
          font-weight: 500;
        }
        .pay-pending {
          background-color: var(--warning-light);
          color: var(--warning);
        }
        .pay-verified {
          background-color: var(--success-light);
          color: var(--success);
        }
        .pay-failed {
          background-color: var(--danger-light);
          color: var(--danger);
        }
        .order-status-text {
          background-color: var(--bg-cream);
          color: var(--text-medium);
        }
        .order-card-items-preview {
          margin-bottom: 12px;
        }
        .preview-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-medium);
          margin-bottom: 4px;
        }
        .order-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border);
          padding-top: 10px;
        }
        .order-total-price {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dark);
        }
        .track-link-btn {
          font-size: 12px;
          font-weight: 600;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 3px;
        }

        /* Wishlist products grid */
        .wishlist-products-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Addresses tab */
        .add-address-btn {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .address-add-form {
          background-color: var(--bg-peach);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 20px;
        }
        .form-action-buttons {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 12px;
          margin-top: 8px;
        }
        .form-action-buttons button {
          height: 40px;
        }
        .addresses-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .delete-address-btn {
          margin-left: auto;
          color: var(--text-light);
          padding: 4px;
        }
        .delete-address-btn:active {
          color: var(--danger);
        }
      `}</style>
    </>
  );
}
