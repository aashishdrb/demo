import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { BarChart3, ShieldCheck, Truck, Percent, ShoppingBag, CheckCircle, XCircle, Edit, Save, Trash2, HelpCircle } from 'lucide-react';

export default function Admin() {
  const { 
    products, 
    setProducts, 
    orders, 
    updateOrderStatus, 
    updateOrderPaymentStatus, 
    deleteOrder,
    charges, 
    setCharges,
    coupons, 
    setCoupons 
  } = useContext(AppContext);

  const [activeAdminTab, setActiveAdminTab] = useState('metrics'); // metrics, payments, shipping, charges, inventory
  const [screenshotModalUrl, setScreenshotModalUrl] = useState(null);

  // Charges state form bindings
  const [deliveryEnabled, setDeliveryEnabled] = useState(charges.deliveryEnabled);
  const [deliveryCharge, setDeliveryCharge] = useState(charges.deliveryCharge);
  const [deliveryThreshold, setDeliveryThreshold] = useState(charges.deliveryThreshold);
  const [handlingEnabled, setHandlingEnabled] = useState(charges.handlingEnabled);
  const [handlingFee, setHandlingFee] = useState(charges.handlingFee);
  const [packagingEnabled, setPackagingEnabled] = useState(charges.packagingEnabled);
  const [packagingFee, setPackagingFee] = useState(charges.packagingFee);
  const [festivalEnabled, setFestivalEnabled] = useState(charges.festivalEnabled);
  const [festivalFee, setFestivalFee] = useState(charges.festivalFee);
  const [codEnabled, setCodEnabled] = useState(charges.codEnabled);
  const [codFee, setCodFee] = useState(charges.codFee);
  const [taxRate, setTaxRate] = useState(charges.taxRate);

  // Inventory editing
  const [editingProductId, setEditingProductId] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);

  // Coupon creation states
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(0);
  const [newCouponType, setNewCouponType] = useState('percentage');

  // Metrics calculations
  const totalOrders = orders.length;
  const verifiedOrders = orders.filter(o => o.paymentStatus === 'Verified');
  const totalRevenue = verifiedOrders.reduce((sum, o) => sum + o.chargesBreakdown.total, 0);
  const pendingPayments = orders.filter(o => o.paymentStatus === 'Pending' && o.paymentMethod === 'UPI').length;
  const lowStockProducts = products.filter(p => p.stock <= 6).length;

  const handleSaveCharges = (e) => {
    e.preventDefault();
    const newCharges = {
      deliveryEnabled,
      deliveryCharge: Number(deliveryCharge),
      deliveryThreshold: Number(deliveryThreshold),
      handlingEnabled,
      handlingFee: Number(handlingFee),
      packagingEnabled,
      packagingFee: Number(packagingFee),
      festivalEnabled,
      festivalFee: Number(festivalFee),
      codEnabled,
      codFee: Number(codFee),
      taxRate: Number(taxRate)
    };
    setCharges(newCharges);
    alert('Global charges configurations updated successfully!');
  };

  const handleStartEditProduct = (p) => {
    setEditingProductId(p.id);
    setEditPrice(p.price);
    setEditStock(p.stock);
  };

  const handleSaveProductEdit = (id) => {
    setProducts(prev => 
      prev.map(p => p.id === id ? { ...p, price: Number(editPrice), stock: Number(editStock) } : p)
    );
    setEditingProductId(null);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode.trim() || newCouponValue <= 0) return;
    const newC = {
      code: newCouponCode.trim().toUpperCase(),
      type: newCouponType,
      value: Number(newCouponValue),
      active: true
    };
    setCoupons(prev => [newC, ...prev]);
    setNewCouponCode('');
    setNewCouponValue(0);
    alert(`Coupon code "${newC.code}" created!`);
  };

  const handleToggleCoupon = (code) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
  };

  return (
    <>
      <div className="admin-container animate-fade-up">
        {/* Title Header */}
        <div className="admin-page-header">
          <h1>Rituals Control Panel</h1>
          <p>System configuration & fulfillment center</p>
        </div>

        {/* Tab Navigation Grid */}
        <div className="admin-tabs-nav">
          <button className={`admin-tab-btn ${activeAdminTab === 'metrics' ? 'active' : ''}`} onClick={() => setActiveAdminTab('metrics')}>
            <BarChart3 size={15} />
            <span>Metrics</span>
          </button>
          <button className={`admin-tab-btn ${activeAdminTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveAdminTab('payments')}>
            <ShieldCheck size={15} />
            <span>UPI Verify ({pendingPayments})</span>
          </button>
          <button className={`admin-tab-btn ${activeAdminTab === 'shipping' ? 'active' : ''}`} onClick={() => setActiveAdminTab('shipping')}>
            <Truck size={15} />
            <span>Shipments</span>
          </button>
          <button className={`admin-tab-btn ${activeAdminTab === 'charges' ? 'active' : ''}`} onClick={() => setActiveAdminTab('charges')}>
            <Percent size={15} />
            <span>Charges</span>
          </button>
          <button className={`admin-tab-btn ${activeAdminTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveAdminTab('inventory')}>
            <ShoppingBag size={15} />
            <span>Inventory</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="admin-content-panel">

          {/* METRICS PANEL */}
          {activeAdminTab === 'metrics' && (
            <div className="admin-view animate-fade-up">
              <h2>Fulfillment Analytics</h2>
              
              <div className="metrics-grid">
                <div className="metric-box box-revenue">
                  <span>Gross Sales (Verified)</span>
                  <strong>₹{totalRevenue}</strong>
                </div>
                <div className="metric-box">
                  <span>Total Placed Orders</span>
                  <strong>{totalOrders}</strong>
                </div>
                <div className="metric-box">
                  <span>UPI Verifications Pending</span>
                  <strong style={{ color: pendingPayments > 0 ? 'var(--warning)' : 'inherit' }}>{pendingPayments}</strong>
                </div>
                <div className="metric-box">
                  <span>Low Stock Warnings</span>
                  <strong style={{ color: lowStockProducts > 0 ? 'var(--danger)' : 'inherit' }}>{lowStockProducts}</strong>
                </div>
              </div>

              {/* Order quick overview */}
              <div className="admin-card" style={{ marginTop: '20px' }}>
                <h3>Recent Activity Logs</h3>
                {orders.length === 0 ? (
                  <p className="no-data">No transactions logged on system yet.</p>
                ) : (
                  <div className="activity-logs-list">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="log-row">
                        <span className="log-tag">ORDER #{o.id}</span>
                        <span className="log-desc">{o.address.name} placed ₹{o.chargesBreakdown.total} order via {o.paymentMethod}</span>
                        <span className="log-status">{o.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MANUAL UPI PAYMENT VERIFICATION QUEUE */}
          {activeAdminTab === 'payments' && (
            <div className="admin-view animate-fade-up">
              <h2>UPI Receipt Verification Queue</h2>
              <p className="subtext">Review uploaded screenshots from customers and change payment states.</p>

              {orders.filter(o => o.paymentMethod === 'UPI').length === 0 ? (
                <p className="no-data">No UPI orders placed yet.</p>
              ) : (
                <div className="payments-queue-list">
                  {orders.filter(o => o.paymentMethod === 'UPI').map((order) => (
                    <div key={order.id} className="payment-review-card">
                      <div className="review-meta">
                        <div>
                          <h3>ORDER #{order.id}</h3>
                          <span>Customer: {order.address.name} ({order.address.phone})</span>
                          <p style={{ marginTop: '4px' }}>Date: {order.date} | Total: <strong>₹{order.chargesBreakdown.total}</strong></p>
                        </div>
                        
                        <div className="receipt-state-badge">
                          <span className={`status-badge pay-${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                        </div>
                      </div>

                      {/* Receipt Screenshot Box */}
                      <div className="review-receipt-box">
                        {order.screenshotUrl ? (
                          <div className="screenshot-thumbnail" onClick={() => setScreenshotModalUrl(order.screenshotUrl)}>
                            <img src={order.screenshotUrl} alt="Receipt Screenshot" />
                            <div className="hover-zoom-overlay">Click to Zoom Receipt</div>
                          </div>
                        ) : (
                          <div className="no-screenshot-error">
                            <HelpCircle size={20} />
                            <span>No screenshot uploaded by customer.</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="verification-actions">
                        <button 
                          className="btn btn-secondary reject-btn"
                          onClick={() => {
                            updateOrderPaymentStatus(order.id, 'Failed');
                            alert(`Order #${order.id} payment rejected.`);
                          }}
                          disabled={order.paymentStatus === 'Failed'}
                        >
                          <XCircle size={14} /> Reject Payment
                        </button>
                        <button 
                          className="btn btn-primary approve-btn"
                          onClick={() => {
                            updateOrderPaymentStatus(order.id, 'Verified');
                            alert(`Order #${order.id} payment verified! Shipping state advanced.`);
                          }}
                          disabled={order.paymentStatus === 'Verified'}
                        >
                          <CheckCircle size={14} /> Approve Payment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SHIPMENT & ORDER TIMELINE UPDATES */}
          {activeAdminTab === 'shipping' && (
            <div className="admin-view animate-fade-up">
              <h2>Shipment & Dispatch Updates</h2>
              <p className="subtext">Update live customer tracking timeline status.</p>

              {orders.length === 0 ? (
                <p className="no-data">No active shipments to configure.</p>
              ) : (
                <div className="shipping-orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="shipping-update-card">
                      <div className="card-header-split">
                        <div>
                          <strong>ORDER #{order.id}</strong>
                          <span>Fulfillment Address: {order.address.district}, {order.address.state}</span>
                        </div>
                        <span className="order-price-label">₹{order.chargesBreakdown.total}</span>
                      </div>
                      
                      <div className="shipping-status-selector-row">
                        <label>Order Dispatch Status:</label>
                        <select 
                          value={order.status}
                          onChange={(e) => {
                            updateOrderStatus(order.id, e.target.value);
                            alert(`Order #${order.id} status updated to: ${e.target.value}`);
                          }}
                          className="input-field status-select-dropdown"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                      <button className="delete-order-btn" onClick={() => {
                        if (confirm(`Are you sure you want to cancel and delete order #${order.id}?`)) {
                          deleteOrder(order.id);
                        }
                      }}><Trash2 size={13} /> Cancel Order</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CHARGE MANAGEMENT CONFIGURATIONS */}
          {activeAdminTab === 'charges' && (
            <div className="admin-view animate-fade-up">
              <h2>Fulfillment Charge Matrix</h2>
              <p className="subtext">Configure packaging, COD, festival charges and tax rates.</p>

              <form onSubmit={handleSaveCharges} className="charges-config-form">
                
                {/* Delivery Fee details */}
                <div className="form-section-group">
                  <div className="checkbox-toggle-row">
                    <h3>Delivery Fee</h3>
                    <input 
                      type="checkbox" 
                      id="delToggle"
                      checked={deliveryEnabled}
                      onChange={(e) => setDeliveryEnabled(e.target.checked)}
                    />
                  </div>
                  {deliveryEnabled && (
                    <div className="form-grid-2">
                      <div className="input-group">
                        <label>Delivery Fee (₹)</label>
                        <input type="number" className="input-field" value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Free Shipping Threshold (₹)</label>
                        <input type="number" className="input-field" value={deliveryThreshold} onChange={(e) => setDeliveryThreshold(e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Handling Fee details */}
                <div className="form-section-group">
                  <div className="checkbox-toggle-row">
                    <h3>Handling Fee</h3>
                    <input 
                      type="checkbox" 
                      id="handToggle"
                      checked={handlingEnabled}
                      onChange={(e) => setHandlingEnabled(e.target.checked)}
                    />
                  </div>
                  {handlingEnabled && (
                    <div className="input-group">
                      <label>Handling Fee Amount (₹)</label>
                      <input type="number" className="input-field" value={handlingFee} onChange={(e) => setHandlingFee(e.target.value)} />
                    </div>
                  )}
                </div>

                {/* Packaging Fee details */}
                <div className="form-section-group">
                  <div className="checkbox-toggle-row">
                    <h3>Premium Box Packaging Fee</h3>
                    <input 
                      type="checkbox" 
                      id="packToggle"
                      checked={packagingEnabled}
                      onChange={(e) => setPackagingEnabled(e.target.checked)}
                    />
                  </div>
                  {packagingEnabled && (
                    <div className="input-group">
                      <label>Packaging Fee Amount (₹)</label>
                      <input type="number" className="input-field" value={packagingFee} onChange={(e) => setPackagingFee(e.target.value)} />
                    </div>
                  )}
                </div>

                {/* Festival Fee details */}
                <div className="form-section-group">
                  <div className="checkbox-toggle-row">
                    <h3>Festival Peak-Demand Surcharge</h3>
                    <input 
                      type="checkbox" 
                      id="festToggle"
                      checked={festivalEnabled}
                      onChange={(e) => setFestivalEnabled(e.target.checked)}
                    />
                  </div>
                  {festivalEnabled && (
                    <div className="input-group">
                      <label>Festival Surcharge Fee (₹)</label>
                      <input type="number" className="input-field" value={festivalFee} onChange={(e) => setFestivalFee(e.target.value)} />
                    </div>
                  )}
                </div>

                {/* COD Fee details */}
                <div className="form-section-group">
                  <div className="checkbox-toggle-row">
                    <h3>Cash on Delivery Fee</h3>
                    <input 
                      type="checkbox" 
                      id="codToggle"
                      checked={codEnabled}
                      onChange={(e) => setCodEnabled(e.target.checked)}
                    />
                  </div>
                  {codEnabled && (
                    <div className="input-group">
                      <label>COD Fee Amount (₹)</label>
                      <input type="number" className="input-field" value={codFee} onChange={(e) => setCodFee(e.target.value)} />
                    </div>
                  )}
                </div>

                {/* Tax Rate */}
                <div className="form-section-group">
                  <h3>GST Tax Configuration</h3>
                  <div className="input-group">
                    <label>Estimated GST tax rate (%)</label>
                    <input type="number" className="input-field" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">Save Configurations</button>
              </form>
            </div>
          )}

          {/* INVENTORY & COUPON MANAGEMENT */}
          {activeAdminTab === 'inventory' && (
            <div className="admin-view animate-fade-up">
              <h2>Inventory Stock Levels & Coupons</h2>
              
              {/* Product Stock Table */}
              <div className="admin-card">
                <h3>Stock Levels Management</h3>
                <div className="inventory-list">
                  {products.map((p) => {
                    const isEditing = editingProductId === p.id;
                    return (
                      <div key={p.id} className="inventory-row-item">
                        <div className="inv-meta">
                          <img src={p.image} alt={p.name} className="inv-thumb" />
                          <div>
                            <h4>{p.name}</h4>
                            <span>Category: {p.category}</span>
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="inv-edit-fields">
                            <div className="inv-input-box">
                              <label>Price (₹)</label>
                              <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                            </div>
                            <div className="inv-input-box">
                              <label>Stock</label>
                              <input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} />
                            </div>
                            <button className="inv-save-btn" onClick={() => handleSaveProductEdit(p.id)}>
                              <Save size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="inv-display-fields">
                            <span>₹{p.price}</span>
                            <span className={`stock-level-num ${p.stock <= 6 ? 'low' : ''}`}>
                              {p.stock} units
                            </span>
                            <button className="inv-edit-btn" onClick={() => handleStartEditProduct(p)}>
                              <Edit size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Promo Coupon Creator */}
              <div className="admin-card" style={{ marginTop: '20px' }}>
                <h3>Coupon Codes Admin</h3>
                
                <form onSubmit={handleCreateCoupon} className="coupon-create-form">
                  <div className="input-group">
                    <label>Coupon Code</label>
                    <input type="text" className="input-field" placeholder="FESTIVAL50" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value)} />
                  </div>
                  <div className="form-grid-2">
                    <div className="input-group">
                      <label>Type</label>
                      <select className="input-field" value={newCouponType} onChange={(e) => setNewCouponType(e.target.value)}>
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Price (₹)</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Discount Value</label>
                      <input type="number" className="input-field" value={newCouponValue} onChange={(e) => setNewCouponValue(e.target.value)} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-secondary">Create Coupon</button>
                </form>

                <div className="coupons-list-panel" style={{ marginTop: '16px' }}>
                  <h4>Active Coupons</h4>
                  <div className="coupons-grid">
                    {coupons.map((c, idx) => (
                      <div key={idx} className={`admin-coupon-pill ${c.active ? 'active' : ''}`}>
                        <div>
                          <strong>{c.code}</strong>
                          <span>{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`} off</span>
                        </div>
                        <button className="coupon-toggle-status-btn" onClick={() => handleToggleCoupon(c.code)}>
                          {c.active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Screenshot Zoom Modal */}
      {screenshotModalUrl && (
        <div className="receipt-zoom-overlay animate-fade-in" onClick={() => setScreenshotModalUrl(null)}>
          <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Receipt Review</h3>
              <button className="modal-close-btn" onClick={() => setScreenshotModalUrl(null)}>×</button>
            </div>
            <div className="modal-body">
              <img src={screenshotModalUrl} alt="Receipt Preview zoomed" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-container {
          padding: 20px 16px 32px;
          text-align: left;
        }
        .admin-page-header {
          margin-bottom: 20px;
        }
        .admin-page-header h1 {
          font-size: 26px;
        }
        .admin-page-header p {
          font-size: 13px;
          color: var(--text-light);
        }

        /* Tab Navigation grid */
        .admin-tabs-nav {
          display: flex;
          overflow-x: auto;
          gap: 8px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
          scrollbar-width: none;
        }
        .admin-tabs-nav::-webkit-scrollbar {
          display: none;
        }
        .admin-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background-color: var(--bg-cream);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-medium);
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }
        .admin-tab-btn.active {
          background-color: var(--primary);
          color: var(--bg-white);
          border-color: var(--primary);
          box-shadow: 0 4px 10px rgba(107, 83, 76, 0.15);
        }

        /* Content panels */
        .admin-content-panel {
          padding-top: 20px;
        }
        .admin-view h2 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-dark);
        }
        
        .admin-card {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          box-shadow: var(--shadow-sm);
        }
        .admin-card h3 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--primary);
        }

        /* Metrics grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .metric-box {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px 12px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .metric-box.box-revenue {
          grid-column: span 2;
          background-color: var(--bg-peach);
          border-color: var(--primary-light);
        }
        .metric-box span {
          font-size: 11px;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .metric-box strong {
          font-size: 20px;
          color: var(--text-dark);
        }
        .metric-box.box-revenue strong {
          font-size: 26px;
          color: var(--primary);
        }
        .no-data {
          font-size: 13px;
          color: var(--text-light);
          text-align: center;
          padding: 16px 0;
        }

        /* Log Table */
        .activity-logs-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .log-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          border-bottom: 1px dashed var(--border);
          padding-bottom: 8px;
        }
        .log-tag {
          font-weight: 600;
          color: var(--primary);
        }
        .log-desc {
          color: var(--text-medium);
          flex-grow: 1;
          margin: 0 12px;
        }
        .log-status {
          font-weight: 500;
          color: var(--text-light);
        }

        /* UPI verify queue cards */
        .payments-queue-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .payment-review-card {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          box-shadow: var(--shadow-sm);
        }
        .review-meta {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
          margin-bottom: 12px;
        }
        .review-meta h3 {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-dark);
        }
        .review-meta span {
          font-size: 12px;
          color: var(--text-light);
        }
        .review-receipt-box {
          margin-bottom: 16px;
        }
        .screenshot-thumbnail {
          width: 100%;
          height: 120px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          position: relative;
          cursor: zoom-in;
          border: 1px solid var(--border-focus);
        }
        .screenshot-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hover-zoom-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(107, 83, 76, 0.4);
          color: var(--bg-white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 500;
          opacity: 0;
          transition: var(--transition);
        }
        .screenshot-thumbnail:hover .hover-zoom-overlay {
          opacity: 1;
        }
        .no-screenshot-error {
          background-color: var(--danger-light);
          border: 1px solid rgba(163, 92, 92, 0.1);
          color: var(--danger);
          padding: 16px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
        }
        .verification-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .verification-actions button {
          font-size: 12px;
          font-weight: 600;
          height: 38px;
          padding: 0;
        }
        .reject-btn {
          border-color: var(--danger);
          color: var(--danger);
        }
        .reject-btn:active {
          background-color: var(--danger-light);
        }
        .approve-btn {
          background-color: var(--success);
          border-color: var(--success);
        }

        /* Shipments dispatch section */
        .shipping-orders-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .shipping-update-card {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          box-shadow: var(--shadow-sm);
        }
        .card-header-split {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        .card-header-split strong {
          font-size: 13px;
          font-weight: 600;
        }
        .card-header-split span {
          font-size: 11px;
          color: var(--text-light);
          display: block;
        }
        .order-price-label {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: var(--primary);
        }
        .shipping-status-selector-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .shipping-status-selector-row label {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-medium);
        }
        .status-select-dropdown {
          margin-bottom: 0;
          padding: 6px 12px;
          font-size: 13px;
          width: 160px;
          background-color: var(--bg-cream);
        }
        .delete-order-btn {
          font-size: 11px;
          color: var(--danger);
          margin-top: 4px;
          float: right;
        }

        /* Charge Config Panel */
        .charges-config-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-section-group {
          background-color: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          box-shadow: var(--shadow-sm);
        }
        .checkbox-toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .checkbox-toggle-row h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dark);
        }
        .checkbox-toggle-row input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: var(--primary);
        }

        /* Inventory Stock management */
        .inventory-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .inventory-row-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 10px;
        }
        .inventory-row-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .inv-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .inv-thumb {
          width: 36px;
          height: 44px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          background-color: var(--bg-cream);
        }
        .inv-meta h4 {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-dark);
          max-width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .inv-meta span {
          font-size: 10px;
          color: var(--text-light);
        }
        .inv-display-fields {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .inv-display-fields span {
          font-size: 13px;
          font-weight: 600;
        }
        .stock-level-num.low {
          color: var(--danger);
        }
        .inv-edit-btn {
          color: var(--text-light);
          padding: 6px;
        }
        .inv-edit-fields {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        .inv-input-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .inv-input-box label {
          font-size: 9px;
          color: var(--text-light);
          text-transform: uppercase;
        }
        .inv-input-box input {
          width: 60px;
          padding: 4px 6px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: var(--font-sans);
          font-size: 12px;
          text-align: center;
        }
        .inv-save-btn {
          background-color: var(--primary);
          color: var(--bg-white);
          padding: 6px;
          border-radius: var(--radius-sm);
        }

        /* Coupon management */
        .coupon-create-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
        }
        .coupons-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .admin-coupon-pill {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--bg-cream);
          border: 1px solid var(--border);
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          opacity: 0.6;
        }
        .admin-coupon-pill.active {
          opacity: 1;
          border-color: var(--primary-light);
          background-color: var(--bg-pink);
        }
        .admin-coupon-pill strong {
          font-size: 13px;
          color: var(--text-dark);
          display: block;
        }
        .admin-coupon-pill span {
          font-size: 11px;
          color: var(--text-light);
        }
        .coupon-toggle-status-btn {
          font-size: 11px;
          font-weight: 600;
          color: var(--primary);
        }

        /* Screenshot Zoom Modal Styles */
        .receipt-zoom-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(44, 34, 30, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .modal-content {
          background-color: var(--bg-white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          width: 100%;
          max-width: 400px;
          box-shadow: var(--shadow-lg);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
        }
        .modal-header h3 {
          font-size: 15px;
          font-weight: 600;
        }
        .modal-close-btn {
          font-size: 24px;
          color: var(--text-light);
        }
        .modal-body {
          padding: 12px;
          text-align: center;
          background-color: var(--bg-cream);
        }
        .modal-body img {
          max-width: 100%;
          max-height: 400px;
          border-radius: var(--radius-sm);
          object-fit: contain;
        }
      `}</style>
    </>
  );
}
