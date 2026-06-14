'use client';

import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  BarChart3, ShieldCheck, Truck, Percent, ShoppingBag, 
  CheckCircle, XCircle, Edit, Save, Trash2, HelpCircle, 
  Loader2, AlertCircle, ArrowLeft, Tag, Layers, Plus, Eye, EyeOff,
  ChevronDown
} from 'lucide-react';
import { Order, Product, Coupon, ChargesConfig, Category, CustomFee, ProductSize } from '@/lib/db';

export default function Admin() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { 
    products, 
    orders, 
    charges, 
    coupons, 
    currentUser, 
    setCurrentPage,
    updateOrderStatusAPI, 
    updateOrderPaymentAPI, 
    deleteOrderAPI,
    saveGlobalChargesAPI,
    saveProductAPI,
    deleteProductAPI,
    categories,
    saveCategoryAPI,
    deleteCategoryAPI
  } = context;

  // Protect Admin Route: check role
  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'Super Admin' && currentUser.role !== 'Admin' && currentUser.role !== 'Staff')) {
      setCurrentPage('login');
      window.scrollTo(0, 0);
    }
  }, [currentUser]);

  const [activeAdminTab, setActiveAdminTab] = useState('metrics'); // metrics, payments, shipping, charges, inventory
  const [screenshotModalUrl, setScreenshotModalUrl] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Custom dropdown & loading states for order status changer
  const [activeStatusDropdownKey, setActiveStatusDropdownKey] = useState<string | null>(null);
  const [updatingOrderStatusId, setUpdatingOrderStatusId] = useState<string | null>(null);
  const [justUpdatedOrderId, setJustUpdatedOrderId] = useState<string | null>(null);

  const getStatusStyles = (status: Order['order_status']) => {
    switch (status) {
      case 'Confirmed':
        return { bg: 'bg-blue-50/80 text-blue-700 border-blue-200/60', dot: 'bg-blue-500' };
      case 'Packed':
        return { bg: 'bg-amber-50/80 text-amber-700 border-amber-200/60', dot: 'bg-amber-500' };
      case 'Shipped':
        return { bg: 'bg-purple-50/80 text-purple-700 border-purple-200/60', dot: 'bg-purple-500' };
      case 'Out for Delivery':
        return { bg: 'bg-cyan-50/80 text-cyan-700 border-cyan-200/60', dot: 'bg-cyan-500' };
      case 'Delivered':
        return { bg: 'bg-green-50/80 text-green-700 border-green-200/60', dot: 'bg-green-500' };
      case 'Cancelled':
        return { bg: 'bg-red-50/80 text-red-700 border-red-200/60', dot: 'bg-red-500' };
      case 'Placed':
      default:
        return { bg: 'bg-gray-50/80 text-gray-700 border-gray-200/60', dot: 'bg-gray-500' };
    }
  };

  // Charges state form bindings
  const [deliveryEnabled, setDeliveryEnabled] = useState(charges?.deliveryEnabled ?? true);
  const [deliveryCharge, setDeliveryCharge] = useState(charges?.deliveryCharge ?? 99);
  const [deliveryThreshold, setDeliveryThreshold] = useState(charges?.deliveryThreshold ?? 999);
  const [codEnabled, setCodEnabled] = useState(charges?.codEnabled ?? true);
  const [codFee, setCodFee] = useState(charges?.codFee ?? 49);
  const [taxRate, setTaxRate] = useState(charges?.taxRate ?? 18);
  const [customFeesList, setCustomFeesList] = useState<CustomFee[]>([]);

  // Sync charges form if context loads late
  useEffect(() => {
    if (charges) {
      setDeliveryEnabled(charges.deliveryEnabled);
      setDeliveryCharge(charges.deliveryCharge);
      setDeliveryThreshold(charges.deliveryThreshold);
      setCodEnabled(charges.codEnabled);
      setCodFee(charges.codFee);
      setTaxRate(charges.taxRate);
      if (charges.customFees) {
        setCustomFeesList(charges.customFees);
      }
    }
  }, [charges]);

  // Category CRUD states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catQuery, setCatQuery] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catBanner, setCatBanner] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [reassignCategoryQuery, setReassignCategoryQuery] = useState('');

  // Advanced Product Editor states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductDetail, setEditingProductDetail] = useState<Product | null>(null); // null = Add New
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCat, setProdCat] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodDiscountPrice, setProdDiscountPrice] = useState(0);
  const [prodStock, setProdStock] = useState(0);
  const [prodImage, setProdImage] = useState('');
  const [prodIngredients, setProdIngredients] = useState('');
  const [prodTags, setProdTags] = useState('');
  const [prodHidden, setProdHidden] = useState(false);
  const [prodSizes, setProdSizes] = useState<ProductSize[]>([]);

  // Safe product delete confirmation
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<Product | null>(null);
  const [deleteInput, setDeleteInput] = useState('');

  // Coupon creation states
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(0);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');

  // Metrics calculations
  const totalOrders = orders.length;
  const verifiedOrders = orders.filter(o => o.payment_status === 'Verified');
  const pendingPayments = orders.filter(o => o.payment_status === 'Pending' && o.payment_method === 'UPI').length;
  const lowStockProducts = products.filter(p => p.stock <= 6).length;

  let totalMrp = 0;
  let totalProductDiscount = 0;
  let totalCouponDiscount = 0;
  let totalSellingPrice = 0;
  let totalFees = 0;
  let totalGrossRevenue = 0;

  verifiedOrders.forEach(o => {
    const breakdown = o.chargesBreakdown;
    const gross = o.total_amount || 0;
    totalGrossRevenue += gross;

    if (breakdown) {
      totalMrp += breakdown.mrpSubtotal || 0;
      totalProductDiscount += breakdown.productDiscount || 0;
      totalCouponDiscount += breakdown.discount || 0;
      totalSellingPrice += breakdown.sellingSubtotal || 0;
      const customSum = (breakdown.customFees || []).reduce((s, f) => s + f.amount, 0);
      totalFees += (breakdown.deliveryCharge || 0) + (breakdown.codFee || 0) + customSum;
    } else {
      const orderSubtotal = o.subtotal || gross;
      totalMrp += orderSubtotal;
      totalSellingPrice += orderSubtotal;
    }
  });

  const cogs = Math.round(totalSellingPrice * 0.5);
  const netProfit = totalGrossRevenue - cogs;
  const totalDiscounts = totalProductDiscount + totalCouponDiscount;

  // Category revenue breakdown
  const categoryRevenue: Record<string, number> = {};
  verifiedOrders.forEach(o => {
    o.products.forEach(item => {
      const catName = item.product.category || 'Uncategorized';
      const itemRev = (item.product.discount_price || item.product.price) * item.quantity;
      categoryRevenue[catName] = (categoryRevenue[catName] || 0) + itemRev;
    });
  });

  // Product Leaderboard
  const productQuantitySold: Record<string, { product: Product; quantity: number }> = {};
  verifiedOrders.forEach(o => {
    o.products.forEach(item => {
      const pid = item.product.id;
      if (!productQuantitySold[pid]) {
        productQuantitySold[pid] = { product: item.product, quantity: 0 };
      }
      productQuantitySold[pid].quantity += item.quantity;
    });
  });

  const productLeaderboard = Object.values(productQuantitySold)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const triggerToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 4000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  const handleSaveCharges = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);
    const newCharges: ChargesConfig = {
      deliveryEnabled,
      deliveryCharge: Number(deliveryCharge),
      deliveryThreshold: Number(deliveryThreshold),
      codEnabled,
      codFee: Number(codFee),
      taxRate: Number(taxRate),
      customFees: customFeesList
    };
    
    const success = await saveGlobalChargesAPI(newCharges, coupons);
    setApiLoading(false);
    if (success) {
      triggerToast('Global charges configurations updated successfully!');
    } else {
      triggerToast('Failed to save charges configuration.', true);
    }
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatQuery(cat.query);
    setCatImage(cat.image);
    setCatBanner(cat.banner || cat.image);
    setCatDescription(cat.description || '');
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null);
    setCatName('');
    setCatQuery('');
    setCatImage('');
    setCatBanner('');
    setCatDescription('');
  };

  const handleSaveCategoryModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catQuery.trim() || !catImage.trim()) {
      triggerToast('Name, Query string, and Image URL are required.', true);
      return;
    }
    setApiLoading(true);
    const categoryData = {
      id: editingCategory ? editingCategory.id : 'cat-' + Math.floor(100 + Math.random() * 900),
      name: catName.trim(),
      query: catQuery.trim(),
      image: catImage.trim(),
      banner: catBanner.trim() || catImage.trim(),
      description: catDescription.trim()
    };
    const success = await saveCategoryAPI(categoryData);
    setApiLoading(false);
    if (success) {
      handleCancelCategoryEdit();
      triggerToast('Category saved successfully!');
    } else {
      triggerToast('Failed to save category.', true);
    }
  };

  const handleDeleteCategoryClick = (cat: Category) => {
    const associatedProducts = products.filter(p => p.category.toLowerCase() === cat.query.toLowerCase());
    if (associatedProducts.length > 0) {
      setDeletingCategory(cat);
      const otherCats = categories.filter(c => c.id !== cat.id);
      setReassignCategoryQuery(otherCats[0]?.query || '');
    } else {
      if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
        performDeleteCategory(cat.id);
      }
    }
  };

  const performDeleteCategory = async (catId: string) => {
    setApiLoading(true);
    const success = await deleteCategoryAPI(catId);
    setApiLoading(false);
    if (success) {
      triggerToast('Category deleted successfully.');
    } else {
      triggerToast('Failed to delete category.', true);
    }
  };

  const handleConfirmReassignAndDeleteCategory = async (action: 'reassign' | 'deleteProducts') => {
    if (!deletingCategory) return;
    setApiLoading(true);

    const associatedProducts = products.filter(p => p.category.toLowerCase() === deletingCategory.query.toLowerCase());

    if (action === 'reassign') {
      if (!reassignCategoryQuery) {
        setApiLoading(false);
        triggerToast('Please select a destination category.', true);
        return;
      }
      for (const p of associatedProducts) {
        await saveProductAPI({ ...p, category: reassignCategoryQuery });
      }
    } else if (action === 'deleteProducts') {
      for (const p of associatedProducts) {
        await deleteProductAPI(p.id);
      }
    }

    const success = await deleteCategoryAPI(deletingCategory.id);
    setApiLoading(false);
    setDeletingCategory(null);
    if (success) {
      triggerToast('Category deleted successfully.');
    } else {
      triggerToast('Failed to delete category.', true);
    }
  };

  const handleStartEditProduct = (p: Product) => {
    setEditingProductDetail(p);
    setProdName(p.name);
    setProdDesc(p.description || '');
    setProdCat(p.category || '');
    setProdPrice(p.price);
    setProdDiscountPrice(p.discount_price || p.price);
    setProdStock(p.stock);
    setProdImage(p.image);
    setProdIngredients(p.ingredients ? p.ingredients.join(', ') : '');
    setProdTags(p.tags ? p.tags.join(', ') : '');
    setProdHidden(p.hidden || false);
    setProdSizes(p.sizes || []);
    setShowProductModal(true);
  };

  const handleAddProductClick = () => {
    setEditingProductDetail(null);
    setProdName('');
    setProdDesc('');
    setProdCat(categories[0]?.query || '');
    setProdPrice(0);
    setProdDiscountPrice(0);
    setProdStock(0);
    setProdImage('');
    setProdIngredients('');
    setProdTags('');
    setProdHidden(false);
    setProdSizes([]);
    setShowProductModal(true);
  };

  const handleSaveProductModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodImage.trim() || !prodCat) {
      triggerToast('Product Name, Category and Image URL are required.', true);
      return;
    }
    
    // Calculate fallback base pricing and stock from sizes if variants exist
    const finalPrice = prodSizes.length > 0 ? Number(prodSizes[0].price) : Number(prodPrice);
    const finalDiscountPrice = prodSizes.length > 0 ? Number(prodSizes[0].discount_price) : (Number(prodDiscountPrice) || Number(prodPrice));
    const finalStock = prodSizes.length > 0 ? prodSizes.reduce((sum, s) => sum + Number(s.stock), 0) : Number(prodStock);

    setApiLoading(true);
    const productData = {
      id: editingProductDetail ? editingProductDetail.id : 'lumi-' + Math.floor(100 + Math.random() * 900),
      name: prodName.trim(),
      description: prodDesc.trim(),
      category: prodCat,
      price: finalPrice,
      discount_price: finalDiscountPrice,
      stock: finalStock,
      image: prodImage.trim(),
      ingredients: prodIngredients.split(',').map(s => s.trim()).filter(Boolean),
      tags: prodTags.split(',').map(s => s.trim()).filter(Boolean),
      hidden: prodHidden,
      sizes: prodSizes.length > 0 ? prodSizes : undefined,
      created_at: editingProductDetail ? editingProductDetail.created_at : new Date().toISOString()
    };
    const success = await saveProductAPI(productData);
    setApiLoading(false);
    if (success) {
      setShowProductModal(false);
      triggerToast(editingProductDetail ? 'Product updated successfully!' : 'New product created successfully!');
    } else {
      triggerToast('Failed to save product.', true);
    }
  };

  const handleDeleteProductClick = (p: Product) => {
    setConfirmDeleteProduct(p);
    setDeleteInput('');
  };

  const handleConfirmDeleteProduct = async () => {
    if (!confirmDeleteProduct) return;
    setApiLoading(true);
    const success = await deleteProductAPI(confirmDeleteProduct.id);
    setApiLoading(false);
    setConfirmDeleteProduct(null);
    if (success) {
      triggerToast('Product deleted successfully.');
    } else {
      triggerToast('Failed to delete product.', true);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || newCouponValue <= 0) return;
    
    setApiLoading(true);
    const newC: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      type: newCouponType,
      value: Number(newCouponValue),
      active: true
    };
    const updatedCoupons = [newC, ...coupons];
    
    if (charges) {
      const success = await saveGlobalChargesAPI(charges, updatedCoupons);
      setApiLoading(false);
      if (success) {
        setNewCouponCode('');
        setNewCouponValue(0);
        triggerToast(`Coupon code "${newC.code}" created successfully!`);
      } else {
        triggerToast('Failed to create coupon code.', true);
      }
    } else {
      setApiLoading(false);
      triggerToast('Charges configuration unavailable.', true);
    }
  };

  const handleToggleCoupon = async (code: string) => {
    setApiLoading(true);
    const updatedCoupons = coupons.map(c => c.code === code ? { ...c, active: !c.active } : c);
    if (charges) {
      const success = await saveGlobalChargesAPI(charges, updatedCoupons);
      setApiLoading(false);
      if (success) {
        triggerToast(`Coupon "${code}" state toggled.`);
      } else {
        triggerToast('Failed to update coupon state.', true);
      }
    } else {
      setApiLoading(false);
      triggerToast('Charges configuration unavailable.', true);
    }
  };

  const handleVerifyPayment = async (orderId: string, status: Order['payment_status']) => {
    setApiLoading(true);
    const success = await updateOrderPaymentAPI(orderId, status);
    setApiLoading(false);
    if (success) {
      triggerToast(`Order #${orderId} payment marked as ${status}.`);
    } else {
      triggerToast(`Failed to update payment status for #${orderId}.`, true);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['order_status']) => {
    setUpdatingOrderStatusId(orderId);
    setApiLoading(true);
    const success = await updateOrderStatusAPI(orderId, status);
    setApiLoading(false);
    setUpdatingOrderStatusId(null);
    if (success) {
      setJustUpdatedOrderId(orderId);
      setTimeout(() => setJustUpdatedOrderId(null), 1500);
      triggerToast(`Order #${orderId} status advanced to ${status}.`);
    } else {
      triggerToast(`Failed to update shipment status for #${orderId}.`, true);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm(`Are you sure you want to cancel and delete order #${orderId}?`)) {
      setApiLoading(true);
      const success = await deleteOrderAPI(orderId);
      setApiLoading(false);
      if (success) {
        triggerToast(`Order #${orderId} deleted successfully.`);
      } else {
        triggerToast(`Failed to cancel order #${orderId}.`, true);
      }
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex-1 bg-bg-cream min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Floating Messages */}
        {successMessage && (
          <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-up text-xs font-semibold">
            <CheckCircle size={16} />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="fixed top-6 right-6 z-50 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-up text-xs font-semibold">
            <XCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Back Link */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setCurrentPage('dashboard')} 
            className="flex items-center gap-2 text-text-medium hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            <span>Back to Account</span>
          </button>
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Role: {currentUser.role}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 text-left border-b border-border-lumi pb-6">
          <h1 className="text-3xl font-serif font-medium text-text-dark">Rituals Control Panel</h1>
          <p className="text-xs sm:text-sm text-text-light mt-1">System configuration, order processing & inventory logs</p>
        </div>

        {/* Tab Navigation Grid */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin border-b border-border-lumi">
          {[
            { id: 'metrics', label: 'Metrics', icon: BarChart3 },
            { id: 'payments', label: `UPI Verify (${pendingPayments})`, icon: ShieldCheck },
            { id: 'shipping', label: 'Shipments', icon: Truck },
            { id: 'charges', label: 'Charges & Fees', icon: Percent },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'inventory', label: 'Inventory & Coupons', icon: ShoppingBag }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all select-none border border-border-lumi ${
                  activeAdminTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-text-medium hover:bg-bg-pink/50'
                }`}
                onClick={() => setActiveAdminTab(tab.id)}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading Overlay */}
        <div className="mt-8 relative min-h-[400px]">
          {apiLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center z-10 rounded-3xl">
              <Loader2 size={36} className="text-primary animate-spin" />
            </div>
          )}

          {/* METRICS PANEL */}
          {activeAdminTab === 'metrics' && (
            <div className="flex flex-col gap-6 animate-fade-up text-left">
              <div>
                <h2 className="text-lg font-serif font-bold text-text-dark">Fulfillment Analytics</h2>
                <p className="text-xs text-text-light mt-0.5">Overview of verified order revenue, profit margin (assume 50% procurement cost base), and category performance.</p>
              </div>
              
              {/* Financial KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-bg-peach border border-primary/20 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span className="text-[10px] text-text-light font-bold uppercase tracking-wider">Gross Sales (Verified)</span>
                  <strong className="text-3xl font-serif text-primary">₹{totalGrossRevenue}</strong>
                  <span className="text-[9px] text-text-medium mt-1">Include custom fees & shipping</span>
                </div>
                <div className="bg-green-50/50 border border-green-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span className="text-[10px] text-green-800 font-bold uppercase tracking-wider">Net Profit</span>
                  <strong className="text-3xl font-serif text-green-700">₹{netProfit}</strong>
                  <span className="text-[9px] text-green-600 mt-1">Margin: {totalGrossRevenue > 0 ? Math.round((netProfit / totalGrossRevenue) * 100) : 0}%</span>
                </div>
                <div className="bg-red-50/40 border border-red-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span className="text-[10px] text-red-800 font-bold uppercase tracking-wider">Total Discounts Given</span>
                  <strong className="text-3xl font-sans text-red-600 font-bold">₹{totalDiscounts}</strong>
                  <span className="text-[9px] text-red-500 mt-1">MRP discount + Coupon usage</span>
                </div>
                <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">Low Stock / Pending</span>
                  <div className="flex gap-4 items-baseline">
                    <strong className="text-3xl text-amber-700 font-bold">{lowStockProducts}</strong>
                    <span className="text-xs text-text-medium">/ {pendingPayments} UPI</span>
                  </div>
                  <span className="text-[9px] text-amber-600 mt-1">Low stocks under 6 units</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Detailed Profit Breakdown Table */}
                <div className="bg-white border border-border-lumi rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border-lumi pb-2">Financial Profit & COGS</h3>
                  <div className="flex flex-col gap-3 text-xs text-text-medium flex-grow">
                    <div className="flex justify-between">
                      <span>Items Subtotal (MRP Value)</span>
                      <span>₹{totalMrp}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Product Ex-Factory Discounts</span>
                      <span>- ₹{totalProductDiscount}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Promo Coupon Discounts</span>
                      <span>- ₹{totalCouponDiscount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Live Surcharges & Shipping Fees</span>
                      <span>₹{totalFees}</span>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-border-lumi pt-2 font-bold text-text-dark">
                      <span>Gross Net Sales</span>
                      <span>₹{totalGrossRevenue}</span>
                    </div>
                    <div className="flex justify-between text-text-light">
                      <span>Cost of Goods Sold (COGS - 50% Base)</span>
                      <span>- ₹{cogs}</span>
                    </div>
                    <div className="h-[1px] bg-border-lumi mt-2"></div>
                    <div className="flex justify-between items-baseline font-serif text-sm font-bold text-green-700 pt-1">
                      <span>Net Operating Profit</span>
                      <span className="text-base">₹{netProfit}</span>
                    </div>
                  </div>
                </div>

                {/* Category Revenue Shares */}
                <div className="bg-white border border-border-lumi rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border-lumi pb-2">Category Performance Share</h3>
                  <div className="flex flex-col gap-3 flex-grow justify-center">
                    {Object.keys(categoryRevenue).length === 0 ? (
                      <p className="text-xs text-text-light text-center py-6">No categorised items sold yet.</p>
                    ) : (
                      Object.entries(categoryRevenue).map(([cat, rev]) => {
                        const pct = totalGrossRevenue > 0 ? Math.round((rev / totalGrossRevenue) * 100) : 0;
                        return (
                          <div key={cat} className="flex flex-col gap-1 text-xs">
                            <div className="flex justify-between font-semibold text-text-dark">
                              <span>{cat}</span>
                              <span>₹{rev} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-bg-cream border border-border-lumi rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Leaderboard and Recent Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Leaderboard */}
                <div className="bg-white border border-border-lumi rounded-3xl p-6 shadow-sm lg:col-span-1 flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border-lumi pb-2">Top Sellers</h3>
                  <div className="flex flex-col gap-3 flex-grow">
                    {productLeaderboard.length === 0 ? (
                      <p className="text-xs text-text-light text-center py-8">No products verified sold.</p>
                    ) : (
                      productLeaderboard.map((item, idx) => (
                        <div key={item.product.id} className="flex items-center gap-3 text-xs py-1">
                          <span className="font-serif font-bold text-primary w-4">#{idx+1}</span>
                          <img src={item.product.image} alt={item.product.name} className="w-8 h-10 rounded-md object-cover bg-bg-cream border border-border-lumi flex-shrink-0" />
                          <div className="flex-grow text-left truncate">
                            <span className="font-bold text-text-dark block truncate max-w-[140px]">{item.product.name}</span>
                            <span className="text-[10px] text-text-light">{item.quantity} units sold</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Logs */}
                <div className="bg-white border border-border-lumi rounded-3xl p-6 shadow-sm lg:col-span-2 flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border-lumi pb-2">Recent Order Logs</h3>
                  {orders.length === 0 ? (
                    <p className="text-xs text-text-light py-8 text-center">No transactions logged on system yet.</p>
                  ) : (
                    <div className="flex flex-col divide-y divide-border-lumi max-h-48 overflow-y-auto">
                      {orders.slice(0, 8).map((o) => (
                        <div key={o.order_id} className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-primary">#{o.order_id}</span>
                            <span className="text-text-medium">
                              {o.shipping_address.name} ({o.payment_method}) - Total ₹{o.chargesBreakdown?.total ?? o.total_amount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-3">
                            <span className="text-[10px] text-text-light">{new Date(o.created_at).toLocaleDateString('en-IN')}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              o.order_status === 'Delivered' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-primary/5 text-primary border border-primary/15'
                            }`}>
                              {o.order_status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* MANUAL UPI PAYMENT VERIFICATION QUEUE */}
          {activeAdminTab === 'payments' && (
            <div className="flex flex-col gap-6 animate-fade-up text-left">
              <div>
                <h2 className="text-lg font-serif font-bold text-text-dark">UPI Receipt Verification Queue</h2>
                <p className="text-xs text-text-light mt-0.5">Review uploaded screenshots from customers and confirm matching UPI payloads.</p>
              </div>

              {orders.filter(o => o.payment_method === 'UPI').length === 0 ? (
                <p className="text-xs text-text-light py-12 text-center bg-white border border-border-lumi rounded-3xl">
                  No UPI orders placed on the system yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {orders.filter(o => o.payment_method === 'UPI').map((order) => (
                    <div key={order.order_id} className="bg-white border border-border-lumi rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                      
                      <div className="flex justify-between items-start border-b border-border-lumi pb-4">
                        <div className="flex flex-col gap-0.5">
                          <h3 className="text-sm font-bold text-text-dark">ORDER #{order.order_id}</h3>
                          <span className="text-xs text-text-light">{order.shipping_address.name} ({order.shipping_address.phone})</span>
                          <span className="text-[10px] text-text-light mt-1">
                            Placed: {new Date(order.created_at).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.payment_status === 'Verified'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : order.payment_status === 'Failed'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {order.payment_status}
                        </span>
                      </div>

                      {/* Info and Price Breakdown */}
                      <div className="text-xs text-text-medium flex flex-col gap-1.5">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>₹{order.chargesBreakdown?.subtotal ?? order.subtotal}</span>
                        </div>
                        <div className="flex justify-between font-bold text-primary border-t border-dashed border-border-lumi pt-1.5 mt-1 text-sm">
                          <span>Total Amount:</span>
                          <span>₹{order.chargesBreakdown?.total ?? order.total_amount}</span>
                        </div>
                      </div>

                      {/* Receipt Screenshot Box */}
                      <div className="border border-border-lumi rounded-2xl overflow-hidden bg-bg-cream flex flex-col items-center justify-center min-h-[160px] relative">
                        {order.screenshotUrl ? (
                          <div 
                            className="w-full h-[160px] overflow-hidden cursor-zoom-in group relative" 
                            onClick={() => setScreenshotModalUrl(order.screenshotUrl || null)}
                          >
                            <img src={order.screenshotUrl} alt="Receipt Screenshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="bg-white text-text-dark font-bold text-[10px] px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                                Click to Zoom
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-6 flex flex-col items-center gap-1.5 text-text-light">
                            <HelpCircle size={24} className="text-amber-500" />
                            <span className="text-xs font-semibold">No screenshot uploaded by customer.</span>
                            <span className="text-[10px]">Payment verification requires manual UPI bank match.</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <button 
                          className="py-2.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                          onClick={() => handleVerifyPayment(order.order_id, 'Failed')}
                          disabled={order.payment_status === 'Failed'}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <button 
                          className="py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all disabled:opacity-50 shadow-sm"
                          onClick={() => handleVerifyPayment(order.order_id, 'Verified')}
                          disabled={order.payment_status === 'Verified'}
                        >
                          <CheckCircle size={14} /> Verify & Approve
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
            <div className="flex flex-col gap-6 animate-fade-up text-left">
              <div>
                <h2 className="text-lg font-serif font-bold text-text-dark">Shipment & Dispatch Updates</h2>
                <p className="text-xs text-text-light mt-0.5">Advance tracking states and manage live customer fulfillment timelines.</p>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-text-light py-12 text-center bg-white border border-border-lumi rounded-3xl">
                  No active orders to process shipping.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.map((order) => (
                    <div key={order.order_id} className="bg-white border border-border-lumi rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                      
                      <div className="flex justify-between items-start border-b border-border-lumi pb-3">
                        <div>
                          <span className="text-[10px] text-text-light font-bold uppercase tracking-wider block">Fulfillment Node</span>
                          <strong className="text-sm font-bold text-text-dark">ORDER #{order.order_id}</strong>
                        </div>
                        <span className="text-sm font-bold text-primary">₹{order.chargesBreakdown?.total ?? order.total_amount}</span>
                      </div>

                      {/* Ship details */}
                      <div className="text-xs text-text-medium flex flex-col gap-1">
                        <span><strong>Recipient:</strong> {order.shipping_address.name}</span>
                        <span><strong>Phone:</strong> {order.shipping_address.phone}</span>
                        <span><strong>Shipping Destination:</strong> {order.shipping_address.addressLine}, {order.shipping_address.district}, {order.shipping_address.state} - {order.shipping_address.pincode}</span>
                        <span><strong>Payment:</strong> {order.payment_method} ({order.payment_status})</span>
                      </div>

                      {/* Timeline status changer */}
                      <div className="flex items-center justify-between bg-bg-peach border border-border-lumi rounded-xl p-3 relative">
                        <label className="text-xs font-bold text-text-dark">Status:</label>
                        <div className="relative inline-block text-left w-48">
                          
                          {/* Trigger Button */}
                          <button
                            onClick={() => setActiveStatusDropdownKey(activeStatusDropdownKey === order.order_id ? null : order.order_id)}
                            disabled={updatingOrderStatusId === order.order_id}
                            className={`w-full flex items-center justify-between gap-2 bg-white text-xs font-semibold px-3 py-2 border rounded-lg text-text-dark outline-none cursor-pointer transition-all duration-300 disabled:opacity-75 disabled:pointer-events-none select-none ${
                              justUpdatedOrderId === order.order_id
                                ? 'border-success ring-2 ring-success/15 animate-pulse'
                                : 'border-border-lumi hover:border-primary-light/40 hover:shadow-xs'
                            }`}
                          >
                            {updatingOrderStatusId === order.order_id ? (
                              <div className="flex items-center gap-1.5 text-text-light">
                                <Loader2 size={12} className="animate-spin text-primary" />
                                <span>Updating...</span>
                              </div>
                            ) : justUpdatedOrderId === order.order_id ? (
                              <div className="flex items-center gap-1.5 text-success font-bold">
                                <CheckCircle size={12} className="animate-pulse" />
                                <span>Updated!</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${getStatusStyles(order.order_status).dot}`}></span>
                                <span>{order.order_status}</span>
                              </div>
                            )}
                            
                            <ChevronDown size={12} className={`text-text-light transition-transform duration-300 ${activeStatusDropdownKey === order.order_id ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Options Dropdown list */}
                          {activeStatusDropdownKey === order.order_id && (
                            <>
                              {/* Backdrop overlay */}
                              <div className="fixed inset-0 z-40" onClick={() => setActiveStatusDropdownKey(null)} />
                              
                              <div className="absolute right-0 mt-1.5 w-full bg-white border border-border-lumi rounded-xl shadow-[0_8px_30px_rgba(107,83,76,0.12)] z-50 py-1.5 flex flex-col gap-0.5 animate-fade-up max-h-60 overflow-y-auto">
                                {(['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] as Order['order_status'][]).map((statusOption) => {
                                  const isSelected = statusOption === order.order_status;
                                  const styles = getStatusStyles(statusOption);
                                  return (
                                    <button
                                      key={statusOption}
                                      onClick={() => {
                                        if (statusOption === 'Cancelled') {
                                          handleCancelOrder(order.order_id);
                                        } else {
                                          handleUpdateOrderStatus(order.order_id, statusOption);
                                        }
                                        setActiveStatusDropdownKey(null);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                                        isSelected 
                                          ? 'bg-bg-pink text-primary font-semibold border-l-2 border-primary' 
                                          : 'text-text-medium hover:bg-bg-peach hover:text-text-dark'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
                                        <span>{statusOption === 'Placed' ? 'Order Placed' : statusOption}</span>
                                      </div>
                                      
                                      {isSelected && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90">Active</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Cancel button */}
                      <button 
                        onClick={() => handleCancelOrder(order.order_id)}
                        className="self-end text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 mt-1 transition-colors"
                      >
                        <Trash2 size={13} /> Cancel & Delete Order
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CHARGES MATRIX CONFIGURATION */}
          {activeAdminTab === 'charges' && (
            <div className="flex flex-col gap-6 animate-fade-up text-left">
              <div>
                <h2 className="text-lg font-serif font-bold text-text-dark">Fulfillment Charge Matrix</h2>
                <p className="text-xs text-text-light mt-0.5">Configure live delivery fees, COD surcharges, GST, and custom transaction fees.</p>
              </div>

              <form onSubmit={handleSaveCharges} className="bg-white border border-border-lumi rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                
                {/* Delivery Fee Section */}
                <div className="flex flex-col gap-3 pb-6 border-b border-border-lumi">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-text-dark">Delivery Fee</h3>
                      <p className="text-[11px] text-text-light">Apply shipping surcharge on low value checkout baskets</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={deliveryEnabled}
                      onChange={(e) => setDeliveryEnabled(e.target.checked)}
                      className="w-5 h-5 rounded border-border-lumi text-primary focus:ring-primary accent-primary"
                    />
                  </div>
                  {deliveryEnabled && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Delivery Fee (₹)</label>
                        <input 
                          type="number" 
                          className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white"
                          value={deliveryCharge} 
                          onChange={(e) => setDeliveryCharge(Number(e.target.value))} 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Free Shipping Threshold (₹)</label>
                        <input 
                          type="number" 
                          className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white"
                          value={deliveryThreshold} 
                          onChange={(e) => setDeliveryThreshold(Number(e.target.value))} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* COD Surcharge */}
                <div className="flex flex-col gap-3 pb-6 border-b border-border-lumi">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-text-dark">Cash On Delivery Fee</h3>
                      <p className="text-[11px] text-text-light">Additional fee for processing cash orders</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={codEnabled}
                      onChange={(e) => setCodEnabled(e.target.checked)}
                      className="w-5 h-5 rounded border-border-lumi text-primary focus:ring-primary accent-primary"
                    />
                  </div>
                  {codEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">COD Fee (₹)</label>
                        <input 
                          type="number" 
                          className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white"
                          value={codFee} 
                          onChange={(e) => setCodFee(Number(e.target.value))} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* GST Tax Config */}
                <div className="flex flex-col gap-3 pb-6 border-b border-border-lumi">
                  <h3 className="text-sm font-bold text-text-dark">GST Tax Configuration</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Estimated GST Rate (%)</label>
                      <input 
                        type="number" 
                        className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white"
                        value={taxRate} 
                        onChange={(e) => setTaxRate(Number(e.target.value))} 
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Custom Fees Builder */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-text-dark">Dynamic Checkout Surcharges</h3>
                    <p className="text-[11px] text-text-light mt-0.5">Define custom fees (e.g. handling fee, premium packaging fee, peak-demand surcharge) applied to orders.</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {customFeesList.map((fee, idx) => (
                      <div key={fee.id || idx} className="grid grid-cols-12 gap-3 items-center bg-bg-cream border border-border-lumi p-3.5 rounded-2xl">
                        
                        {/* Name Input (col-span-5) */}
                        <div className="col-span-6 sm:col-span-5 flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-text-light uppercase tracking-wider">Fee Name</label>
                          <input 
                            type="text" 
                            className="text-xs font-semibold py-2 px-3 bg-white border border-border-lumi rounded-xl outline-none focus:border-primary"
                            placeholder="E.g., Handling Fee"
                            value={fee.name}
                            onChange={(e) => {
                              const updated = [...customFeesList];
                              updated[idx].name = e.target.value;
                              setCustomFeesList(updated);
                            }}
                          />
                        </div>

                        {/* Amount Input (col-span-3) */}
                        <div className="col-span-3 flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-text-light uppercase tracking-wider">Amount (₹)</label>
                          <input 
                            type="number" 
                            className="text-xs font-semibold py-2 px-3 bg-white border border-border-lumi rounded-xl outline-none focus:border-primary text-center"
                            placeholder="0"
                            value={fee.amount}
                            onChange={(e) => {
                              const updated = [...customFeesList];
                              updated[idx].amount = Number(e.target.value);
                              setCustomFeesList(updated);
                            }}
                          />
                        </div>

                        {/* Enabled Checkbox (col-span-2) */}
                        <div className="col-span-2 flex flex-col items-center gap-1.5">
                          <label className="text-[9px] font-bold text-text-light uppercase tracking-wider">Enabled</label>
                          <input 
                            type="checkbox"
                            checked={fee.enabled}
                            onChange={(e) => {
                              const updated = [...customFeesList];
                              updated[idx].enabled = e.target.checked;
                              setCustomFeesList(updated);
                            }}
                            className="w-5 h-5 accent-primary cursor-pointer"
                          />
                        </div>

                        {/* Actions (col-span-1/2) */}
                        <div className="col-span-1 sm:col-span-2 flex justify-end pt-4 sm:pt-0">
                          <button 
                            type="button" 
                            onClick={() => {
                              const updated = customFeesList.filter((_, i) => i !== idx);
                              setCustomFeesList(updated);
                            }}
                            className="p-2 border border-red-200 hover:bg-red-50 rounded-xl text-red-600 transition-colors"
                            aria-label="Delete Fee"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button 
                      type="button"
                      onClick={() => {
                        setCustomFeesList([...customFeesList, { id: 'fee-' + Date.now(), name: 'New Checkout Surcharge', amount: 0, enabled: true }]);
                      }}
                      className="w-full sm:w-fit py-2.5 px-5 border border-dashed border-primary/45 hover:border-primary text-primary hover:bg-bg-pink/15 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>Add Custom Fee</span>
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <button 
                  type="submit" 
                  className="w-full sm:w-fit py-3.5 px-8 bg-primary hover:bg-primary-light text-white rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 mt-4"
                >
                  Save Configurations
                </button>
              </form>
            </div>
          )}

          {/* INVENTORY & PROMO COUPONS */}
          {activeAdminTab === 'inventory' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up text-left">
              
              {/* Product Stock Table */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="bg-white border border-border-lumi rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6 border-b border-border-lumi pb-4">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Stock Levels Management</h3>
                    <button 
                      type="button" 
                      onClick={handleAddProductClick}
                      className="py-2 px-4 bg-primary hover:bg-primary-light text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Product</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-col divide-y divide-border-lumi">
                    {products.map((p) => (
                      <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        
                        {/* Thumbnail metadata */}
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-12 rounded-lg object-cover bg-bg-cream border border-border-lumi flex-shrink-0" />
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-text-dark line-clamp-1 max-w-[200px]">{p.name}</h4>
                              {p.hidden && (
                                <span className="flex items-center gap-0.5 text-[8px] bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                  <EyeOff size={8} className="text-red-500" /> Hidden
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-text-light uppercase tracking-wider">Category: {p.category}</span>
                          </div>
                        </div>

                        {/* Editable fields */}
                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          <div className="flex flex-col text-right">
                            {p.sizes && p.sizes.length > 0 ? (
                              <div className="flex flex-col gap-0.5 text-left sm:text-right border-l sm:border-l-0 sm:border-r border-border-lumi/30 pl-2 sm:pl-0 sm:pr-3 my-1">
                                {p.sizes.map((sz) => (
                                  <span key={sz.id} className="text-[10px] font-medium text-text-medium block whitespace-nowrap">
                                    {sz.label}: <strong className="text-text-dark font-semibold">₹{sz.discount_price || sz.price}</strong> ({sz.stock} units)
                                  </span>
                                ))}
                              </div>
                            ) : p.discount_price && p.discount_price < p.price ? (
                              <>
                                <span className="text-xs font-bold text-text-dark">₹{p.discount_price}</span>
                                <span className="text-[9px] text-text-light line-through">₹{p.price}</span>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-text-dark">₹{p.price}</span>
                            )}
                          </div>
                          
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            p.stock <= 6 
                              ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse' 
                              : 'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                            {p.stock} units
                          </span>

                          <div className="flex gap-2">
                            <button 
                              type="button"
                              className="p-2 border border-border-lumi hover:border-primary rounded-xl text-text-light hover:text-primary transition-all cursor-pointer bg-bg-peach" 
                              onClick={() => handleStartEditProduct(p)}
                              title="Edit Product"
                            >
                              <Edit size={13} />
                            </button>
                            <button 
                              type="button"
                              className="p-2 border border-red-100 hover:border-red-500 rounded-xl text-text-light hover:text-red-600 transition-all cursor-pointer bg-red-50/20" 
                              onClick={() => handleDeleteProductClick(p)}
                              title="Delete Product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promo Coupon Creator */}
              <div className="flex flex-col gap-6">
                <div className="bg-white border border-border-lumi rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Promo Coupon Codes</h3>
                  
                  {/* Creation form */}
                  <form onSubmit={handleCreateCoupon} className="flex flex-col gap-4 border-b border-border-lumi pb-6 mb-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Coupon Code</label>
                      <input 
                        type="text" 
                        className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white uppercase placeholder-text-light font-bold"
                        placeholder="E.g., FESTIVAL50" 
                        value={newCouponCode} 
                        onChange={(e) => setNewCouponCode(e.target.value)} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Discount Type</label>
                        <select 
                          className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none"
                          value={newCouponType} 
                          onChange={(e) => setNewCouponType(e.target.value as 'percentage' | 'fixed')}
                        >
                          <option value="percentage">Percent (%)</option>
                          <option value="fixed">Fixed (₹)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Discount Value</label>
                        <input 
                          type="number" 
                          className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none"
                          value={newCouponValue} 
                          onChange={(e) => setNewCouponValue(Number(e.target.value))} 
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-3 bg-text-dark text-white rounded-xl font-semibold text-xs tracking-wider uppercase hover:bg-black transition-all shadow-sm active:scale-95"
                    >
                      Create Coupon
                    </button>
                  </form>

                  {/* List active coupons */}
                  <h4 className="text-xs font-bold text-text-medium uppercase tracking-wider mb-3">Active Coupons</h4>
                  <div className="flex flex-col gap-2">
                    {coupons.map((c, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between p-3.5 border rounded-xl transition-all ${
                          c.active 
                            ? 'border-primary-light/35 bg-bg-pink/40' 
                            : 'border-border-lumi bg-white opacity-60'
                        }`}
                      >
                        <div className="text-left">
                          <strong className="text-xs font-bold tracking-wider text-text-dark block">{c.code}</strong>
                          <span className="text-[10px] text-text-light">
                            {c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`} off cart value
                          </span>
                        </div>
                        <button 
                          className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-all border ${
                            c.active 
                              ? 'border-primary text-primary bg-white hover:bg-bg-cream' 
                              : 'border-border-lumi text-text-light bg-bg-peach hover:bg-white'
                          }`}
                          onClick={() => handleToggleCoupon(c.code)}
                        >
                          {c.active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* CATEGORIES PANEL */}
          {activeAdminTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up text-left">
              {/* Category list */}
              <div className="lg:col-span-2 bg-white border border-border-lumi rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-border-lumi pb-4">Categories List</h3>
                <div className="flex flex-col divide-y divide-border-lumi">
                  {categories.map((c) => (
                    <div key={c.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={c.image} alt={c.name} className="w-10 h-10 rounded-full object-cover bg-bg-cream border border-border-lumi flex-shrink-0" />
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-text-dark">{c.name}</h4>
                          <span className="text-[10px] text-text-light font-mono block">Query: {c.query}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => handleStartEditCategory(c)}
                          className="p-2 border border-border-lumi hover:border-primary rounded-xl text-text-light hover:text-primary transition-all cursor-pointer bg-bg-peach"
                        >
                          <Edit size={13} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteCategoryClick(c)}
                          className="p-2 border border-red-100 hover:border-red-500 rounded-xl text-text-light hover:text-red-600 transition-all cursor-pointer bg-red-50/20"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Category Form */}
              <div className="bg-white border border-border-lumi rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-border-lumi pb-4">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h3>
                <form onSubmit={handleSaveCategoryModal} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Category Name</label>
                    <input 
                      type="text" 
                      className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white focus:border-primary text-text-dark"
                      placeholder="E.g., Facewashes"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Query Filter String</label>
                    <input 
                      type="text" 
                      className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white focus:border-primary text-text-dark"
                      placeholder="E.g., Facewash"
                      value={catQuery}
                      onChange={(e) => setCatQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Thumbnail Image URL</label>
                    <input 
                      type="text" 
                      className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white focus:border-primary text-text-dark"
                      placeholder="Image URL"
                      value={catImage}
                      onChange={(e) => setCatImage(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Category Banner URL (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white focus:border-primary text-text-dark"
                      placeholder="Banner URL"
                      value={catBanner}
                      onChange={(e) => setCatBanner(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Description</label>
                    <textarea 
                      className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white focus:border-primary text-text-dark h-20 resize-none"
                      placeholder="Provide category description..."
                      value={catDescription}
                      onChange={(e) => setCatDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    {editingCategory && (
                      <button 
                        type="button" 
                        onClick={handleCancelCategoryEdit}
                        className="flex-grow py-3 bg-bg-peach border border-border-lumi text-text-dark hover:bg-white rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="flex-grow py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      Save Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Category Reassign/Delete Overlay */}
        {deletingCategory && (
          <div className="fixed inset-0 bg-text-dark/70 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fade-up">
            <div className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl relative p-6 text-left">
              <h3 className="font-serif text-base font-semibold text-text-dark border-b border-border-lumi pb-3 uppercase tracking-wider">
                Safety Category Deletion
              </h3>
              <div className="flex flex-col gap-4 mt-4">
                <p className="text-xs text-text-medium leading-relaxed">
                  The category <strong>"{deletingCategory.name}"</strong> has active products associated with it. To prevent orphaned product listings, please choose one of the following safety measures:
                </p>

                <div className="bg-bg-pink border border-primary/25 rounded-2xl p-4 flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">Option 1: Reassign products to:</label>
                  <select 
                    className="w-full text-xs py-2 px-3 bg-white border border-border-lumi rounded-xl outline-none focus:border-primary"
                    value={reassignCategoryQuery}
                    onChange={(e) => setReassignCategoryQuery(e.target.value)}
                  >
                    <option value="">-- Choose Category --</option>
                    {categories
                      .filter(c => c.id !== deletingCategory.id)
                      .map(c => (
                        <option key={c.id} value={c.query}>{c.name}</option>
                      ))
                    }
                  </select>
                  <button 
                    type="button" 
                    onClick={() => handleConfirmReassignAndDeleteCategory('reassign')}
                    className="w-full py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer animate-pulse-slow"
                    disabled={!reassignCategoryQuery}
                  >
                    Reassign & Delete Category
                  </button>
                </div>

                <div className="h-[1px] bg-border-lumi my-1"></div>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Option 2: Safe-delete all products</span>
                  <p className="text-[9px] text-red-600">This will remove all products in this category permanently from inventory.</p>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (confirm("Are you absolutely sure you want to delete all products in this category?")) {
                        handleConfirmReassignAndDeleteCategory('deleteProducts');
                      }
                    }}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Delete Products & Category
                  </button>
                </div>

                <button 
                  type="button" 
                  onClick={() => setDeletingCategory(null)}
                  className="w-full py-3 border border-border-lumi hover:bg-bg-cream text-text-medium text-xs font-bold uppercase tracking-wider rounded-xl transition-all mt-2 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Product modal editor */}
        {showProductModal && (
          <div className="fixed inset-0 bg-text-dark/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto animate-fade-up">
            <div className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl relative my-8">
              <div className="flex justify-between items-center px-6 py-4 border-b border-border-lumi bg-bg-cream">
                <h3 className="text-sm font-serif font-bold text-text-dark uppercase tracking-wider">
                  {editingProductDetail ? `Edit Product: ${editingProductDetail.name}` : 'Add New Product'}
                </h3>
                <button 
                  type="button" 
                  className="text-2xl text-text-light hover:text-text-dark cursor-pointer font-light" 
                  onClick={() => setShowProductModal(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSaveProductModal} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto text-left">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Product Name</label>
                    <input 
                      type="text" 
                      className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white text-text-dark font-semibold"
                      placeholder="Product Name"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Category</label>
                    <select 
                      className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white text-text-dark cursor-pointer"
                      value={prodCat}
                      onChange={(e) => setProdCat(e.target.value)}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.query}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Image URL</label>
                  <input 
                    type="text" 
                    className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white text-text-dark"
                    placeholder="Unsplash image link..."
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Description</label>
                  <textarea 
                    className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white text-text-dark h-20 resize-none"
                    placeholder="Describe the formulation benefits..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">MRP Price (₹)</label>
                    <input 
                      type="number" 
                      className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white text-text-dark"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Discount Price (₹)</label>
                    <input 
                      type="number" 
                      className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white text-text-dark"
                      value={prodDiscountPrice}
                      onChange={(e) => setProdDiscountPrice(Number(e.target.value))}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Stock Qty</label>
                    <input 
                      type="number" 
                      className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white text-text-dark"
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Live Price discount preview */}
                {prodPrice > 0 && prodDiscountPrice < prodPrice && (
                  <div className="text-[11px] bg-green-50 border border-green-200 text-green-700 px-3.5 py-2 rounded-xl font-bold">
                    🎉 Live Preview: Discount: {Math.round(((prodPrice - prodDiscountPrice) / prodPrice) * 100)}% off. User saves ₹{prodPrice - prodDiscountPrice} per item!
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Ingredients (Comma separated)</label>
                  <input 
                    type="text" 
                    className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white text-text-dark"
                    placeholder="Bio-Silk protein network, Vitamin E, Sugarcane squalane"
                    value={prodIngredients}
                    onChange={(e) => setProdIngredients(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Tags (Comma separated)</label>
                  <input 
                    type="text" 
                    className="w-full text-xs py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white text-text-dark"
                    placeholder="best-seller, vegan, premium"
                    value={prodTags}
                    onChange={(e) => setProdTags(e.target.value)}
                  />
                </div>

                {/* Product Variants / Sizes Section */}
                <div className="flex flex-col gap-3 border-t border-border-lumi pt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider">Product Variants / Sizes</label>
                    <button 
                      type="button"
                      onClick={() => setProdSizes([...prodSizes, { id: 'size-' + Date.now(), label: '', price: 0, discount_price: 0, stock: 0 }])}
                      className="text-xs text-primary font-bold hover:text-primary-light flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus size={12} /> Add Size Option
                    </button>
                  </div>

                  {prodSizes.length === 0 ? (
                    <p className="text-[11px] text-text-light bg-bg-cream border border-border-lumi rounded-xl p-3 text-center">
                      No sizes defined. Product will use the base price and stock above.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {prodSizes.map((sz, idx) => (
                        <div key={sz.id || idx} className="grid grid-cols-12 gap-2 items-center bg-bg-cream border border-border-lumi p-3 rounded-2xl">
                          <div className="col-span-3 flex flex-col gap-1">
                            <label className="text-[8px] font-bold text-text-light uppercase tracking-wider">Size (e.g. 50ml, 25g)</label>
                            <input 
                              type="text"
                              required
                              placeholder="e.g. 50ml"
                              className="text-xs py-1.5 px-2 bg-white border border-border-lumi rounded-lg outline-none focus:border-primary text-text-dark font-semibold"
                              value={sz.label}
                              onChange={(e) => {
                                const updated = [...prodSizes];
                                updated[idx].label = e.target.value;
                                setProdSizes(updated);
                              }}
                            />
                          </div>
                          <div className="col-span-3 flex flex-col gap-1">
                            <label className="text-[8px] font-bold text-text-light uppercase tracking-wider">Price (MRP ₹)</label>
                            <input 
                              type="number"
                              required
                              min="0"
                              className="text-xs py-1.5 px-2 bg-white border border-border-lumi rounded-lg outline-none focus:border-primary text-text-dark font-semibold text-center"
                              value={sz.price}
                              onChange={(e) => {
                                const updated = [...prodSizes];
                                updated[idx].price = Number(e.target.value);
                                setProdSizes(updated);
                              }}
                            />
                          </div>
                          <div className="col-span-3 flex flex-col gap-1">
                            <label className="text-[8px] font-bold text-text-light uppercase tracking-wider">Discount Price (₹)</label>
                            <input 
                              type="number"
                              required
                              min="0"
                              className="text-xs py-1.5 px-2 bg-white border border-border-lumi rounded-lg outline-none focus:border-primary text-text-dark font-semibold text-center"
                              value={sz.discount_price}
                              onChange={(e) => {
                                const updated = [...prodSizes];
                                updated[idx].discount_price = Number(e.target.value);
                                setProdSizes(updated);
                              }}
                            />
                          </div>
                          <div className="col-span-2 flex flex-col gap-1">
                            <label className="text-[8px] font-bold text-text-light uppercase tracking-wider">Stock Qty</label>
                            <input 
                              type="number"
                              required
                              min="0"
                              className="text-xs py-1.5 px-2 bg-white border border-border-lumi rounded-lg outline-none focus:border-primary text-text-dark font-semibold text-center"
                              value={sz.stock}
                              onChange={(e) => {
                                const updated = [...prodSizes];
                                updated[idx].stock = Number(e.target.value);
                                setProdSizes(updated);
                              }}
                            />
                          </div>
                          <div className="col-span-1 flex justify-end pt-3">
                            <button 
                              type="button"
                              onClick={() => setProdSizes(prodSizes.filter((_, i) => i !== idx))}
                              className="p-1.5 border border-red-200 hover:bg-red-50 rounded-lg text-red-600 transition-colors cursor-pointer"
                              title="Remove Size"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hiding/restoring status check */}
                <div className="flex items-center gap-3 bg-bg-cream border border-border-lumi p-3 rounded-2xl mt-1">
                  <input 
                    type="checkbox"
                    id="prodHiddenCheck"
                    checked={prodHidden}
                    onChange={(e) => setProdHidden(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                  <label htmlFor="prodHiddenCheck" className="text-xs font-semibold text-text-dark cursor-pointer select-none flex items-center gap-1.5">
                    {prodHidden ? <EyeOff size={14} className="text-red-500" /> : <Eye size={14} className="text-green-600" />}
                    <span>Hide this product from customer catalog (Archived status)</span>
                  </label>
                </div>

                <div className="flex gap-4 border-t border-border-lumi pt-4 mt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowProductModal(false)}
                    className="flex-grow py-3 bg-bg-peach border border-border-lumi hover:bg-white text-text-medium rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-grow py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Save Product
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Product deletion safety confirmation modal */}
        {confirmDeleteProduct && (
          <div className="fixed inset-0 bg-text-dark/70 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fade-up">
            <div className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl relative p-6 text-left border border-red-200">
              <h3 className="font-serif text-base font-semibold text-red-700 border-b border-red-100 pb-3 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle size={18} />
                <span>Secure Product Deletion</span>
              </h3>
              
              <div className="flex flex-col gap-4 mt-4 text-xs">
                <p className="text-text-medium leading-relaxed">
                  This action is irreversible. It will permanently remove <strong>"{confirmDeleteProduct.name}"</strong> (ID: {confirmDeleteProduct.id}) from the database.
                </p>
                
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-[11px] text-red-700">
                  To confirm deletion, type <strong className="font-mono bg-red-100 px-1 py-0.5 rounded text-red-900">DELETE</strong> below.
                </div>

                <input 
                  type="text" 
                  className="w-full text-xs font-semibold py-2.5 px-3 bg-bg-peach border border-border-lumi rounded-xl outline-none focus:bg-white uppercase text-center text-text-dark"
                  placeholder="Type 'DELETE' to confirm"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button 
                    type="button" 
                    onClick={() => setConfirmDeleteProduct(null)}
                    className="py-3 bg-bg-peach border border-border-lumi hover:bg-white text-text-medium font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleConfirmDeleteProduct}
                    className="py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                    disabled={deleteInput.toUpperCase() !== 'DELETE'}
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screenshot Zoom Modal */}
      {screenshotModalUrl && (
        <div 
          className="fixed inset-0 bg-text-dark/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 cursor-zoom-out animate-fade-up" 
          onClick={() => setScreenshotModalUrl(null)}
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden w-full max-w-lg shadow-2xl relative" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-lumi">
              <h3 className="text-xs font-bold text-text-dark uppercase tracking-widest">Customer Payment Receipt</h3>
              <button 
                className="text-2xl text-text-light hover:text-text-dark transition-colors font-light" 
                onClick={() => setScreenshotModalUrl(null)}
              >
                ×
              </button>
            </div>
            <div className="p-4 bg-bg-cream flex justify-center items-center max-h-[75vh] overflow-y-auto">
              <img src={screenshotModalUrl} alt="Receipt Preview zoomed" className="max-w-full max-h-[60vh] rounded-2xl object-contain border border-border-lumi" />
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
