'use client';

import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Home as HomeIcon, CheckCircle2, ChevronDown, ChevronUp, Tag, ShieldCheck, RefreshCw, Heart, Briefcase, MapPin, Trash2, Edit2, Plus, Loader2 } from 'lucide-react';
import { Address } from '@/lib/db';
import statesDistrictsData from '@/lib/states-districts.json';

export default function Checkout() {
  const context = useContext(AppContext);
  
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPincode, setFormPincode] = useState('');
  const [formState, setFormState] = useState<string>('');
  const [formDistrict, setFormDistrict] = useState<string>('');
  const [formPhone, setFormPhone] = useState('');
  const [formTag, setFormTag] = useState('Home');
  
  const [stateSearch, setStateSearch] = useState('');
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const stateDropdownRef = useRef<HTMLDivElement>(null);

  const [districtSearch, setDistrictSearch] = useState('');
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const districtDropdownRef = useRef<HTMLDivElement>(null);

  const [pincodeValidating, setPincodeValidating] = useState(false);
  const [pincodeSuccess, setPincodeSuccess] = useState<boolean | null>(null);
  const [apiPincodeData, setApiPincodeData] = useState<any>(null);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('UPI');
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const statesList = statesDistrictsData.states;

  useEffect(() => {
    if (context?.currentUser) {
      const addresses = context.currentUser.addresses;
      if (addresses.length > 0) {
        setUseSavedAddress(true);
        const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
        setSelectedAddressId(defaultAddr.id);
        setShowNewAddressForm(false);
      } else {
        setUseSavedAddress(false);
        setShowNewAddressForm(true);
      }
    }
  }, [context?.currentUser]);

  const checkPincode = async (pincodeVal: string) => {
    if (!/^\d{6}$/.test(pincodeVal)) {
      setPincodeSuccess(null);
      return;
    }

    setPincodeValidating(true);
    setErrors(prev => {
      const n = { ...prev };
      delete n.pincode;
      return n;
    });

    try {
      const res = await fetch(`/api/pincode?pincode=${pincodeVal}`);
      const data = await res.json();

      if (data.success) {
        if (data.offlineFallback) {
          setPincodeSuccess(true);
          return;
        }

        setPincodeSuccess(true);
        setApiPincodeData(data);

        // Normalize matching with local database
        let matchedState = data.state;
        let matchedDistrict = data.district;

        const localStateObj = statesList.find(s => s.state.toLowerCase() === data.state.toLowerCase());
        if (localStateObj) {
          matchedState = localStateObj.state;
          const localDist = localStateObj.districts.find(d => d.toLowerCase() === data.district.toLowerCase());
          if (localDist) {
            matchedDistrict = localDist;
          }
        }

        // Auto fill state and district if empty, otherwise validate match
        if (!formState) {
          setFormState(matchedState);
          setStateSearch(matchedState);
        } else if (formState.toLowerCase() !== data.state.toLowerCase()) {
          setErrors(prev => ({
            ...prev,
            pincode: `Pincode belongs to ${data.state}, but you selected ${formState}.`
          }));
          setPincodeSuccess(false);
        }

        if (!formDistrict) {
          setFormDistrict(matchedDistrict);
          setDistrictSearch(matchedDistrict);
        } else if (formDistrict.toLowerCase() !== data.district.toLowerCase()) {
          const stateObj = statesList.find(s => s.state.toLowerCase() === data.state.toLowerCase());
          if (stateObj && !stateObj.districts.some(d => d.toLowerCase() === formDistrict.toLowerCase())) {
            setErrors(prev => ({
              ...prev,
              pincode: `Pincode belongs to ${data.district} District, but you selected ${formDistrict}.`
            }));
            setPincodeSuccess(false);
          }
        }
      } else {
        setPincodeSuccess(false);
        setErrors(prev => ({
          ...prev,
          pincode: data.error || 'Pincode not found in Indian Postal database.'
        }));
      }
    } catch (err) {
      console.error(err);
      setPincodeSuccess(true); // Graceful offline bypass
    } finally {
      setPincodeValidating(false);
    }
  };

  useEffect(() => {
    if (formPincode && formPincode.length === 6) {
      checkPincode(formPincode);
    } else {
      setPincodeSuccess(null);
    }
  }, [formPincode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setStateDropdownOpen(false);
      }
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target as Node)) {
        setDistrictDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!context) return null;
  const { 
    cart, 
    currentUser, 
    activeCoupon, 
    calculateTotals, 
    placeOrder,
    setCurrentPage,
    setTrackingOrderId,
    updateUserAddressesAPI,
    buyNowItem,
    setBuyNowItem,
    charges,
    isScrollingDown
  } = context;

  const checkoutItems = buyNowItem ? [buyNowItem] : cart;

  const availableDistricts = formState ? (statesList.find(s => s.state.toLowerCase() === formState.toLowerCase())?.districts || []) : [];

  const { 
    mrpSubtotal, 
    productDiscount, 
    sellingSubtotal, 
    discount, 
    deliveryCharge, 
    total: baseTotal,
    customFees 
  } = calculateTotals(checkoutItems);
  
  // Calculate final total based on payment method (add COD charge if applicable)
  const codFee = (paymentMethod === 'COD' && sellingSubtotal > 0 && charges?.codEnabled) ? charges.codFee : 0;
  const totalToPay = baseTotal + codFee;
  const totalSavings = productDiscount + discount;

  const handleDeleteAddress = async (addrId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (confirm("Are you sure you want to delete this address?")) {
      const updated = currentUser.addresses.filter(a => a.id !== addrId);
      await updateUserAddressesAPI(updated);
      if (selectedAddressId === addrId && updated.length > 0) {
        setSelectedAddressId(updated[0].id);
      } else if (updated.length === 0) {
        setSelectedAddressId(null);
        setUseSavedAddress(false);
        setShowNewAddressForm(true);
      }
    }
  };

  const handleSetDefaultAddress = async (addrId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    const updated = currentUser.addresses.map(a => ({
      ...a,
      isDefault: a.id === addrId
    }));
    const defaultIdx = updated.findIndex(a => a.id === addrId);
    if (defaultIdx > -1) {
      const [defaultAddr] = updated.splice(defaultIdx, 1);
      updated.unshift(defaultAddr);
    }
    await updateUserAddressesAPI(updated);
  };

  const handleEditAddress = (addr: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    setFormName(addr.name);
    setFormAddress(addr.addressLine);
    setFormPincode(addr.pincode);
    setFormState(addr.state);
    setStateSearch(addr.state);
    setFormDistrict(addr.district);
    setDistrictSearch(addr.district);
    setFormPhone(addr.phone);
    setFormTag(addr.tag || 'Home');
    setShowNewAddressForm(true);
    setUseSavedAddress(false);
  };

  const handleCancelAddressForm = () => {
    setEditingAddressId(null);
    setFormName('');
    setFormAddress('');
    setFormPincode('');
    setFormState('');
    setStateSearch('');
    setFormDistrict('');
    setDistrictSearch('');
    setFormPhone('');
    setFormTag('Home');
    setPincodeSuccess(null);
    setErrors({});
    if (currentUser && currentUser.addresses.length > 0) {
      setShowNewAddressForm(false);
      setUseSavedAddress(true);
    }
  };

  const handleSaveAddressForm = async () => {
    if (!validateForm()) {
      return;
    }
    
    if (!currentUser) return;
    
    const newAddressObj: Address = {
      id: editingAddressId || `addr-${Math.floor(Math.random() * 10000)}`,
      tag: formTag,
      name: formName,
      addressLine: formAddress,
      district: formDistrict,
      state: formState,
      pincode: formPincode,
      phone: formPhone,
      isDefault: editingAddressId 
        ? (currentUser.addresses.find(a => a.id === editingAddressId)?.isDefault || false) 
        : currentUser.addresses.length === 0
    };
    
    let updatedAddresses = [];
    if (editingAddressId) {
      updatedAddresses = currentUser.addresses.map(a => a.id === editingAddressId ? newAddressObj : a);
    } else {
      updatedAddresses = [...currentUser.addresses, newAddressObj];
    }
    
    const success = await updateUserAddressesAPI(updatedAddresses);
    if (success) {
      setSelectedAddressId(newAddressObj.id);
      setUseSavedAddress(true);
      handleCancelAddressForm();
    } else {
      alert("Failed to save address.");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 1. State selected
    if (!formState) {
      newErrors.state = 'Please select a valid state from the list.';
    } else {
      const stateExists = statesList.some(s => s.state.toLowerCase() === formState.toLowerCase());
      if (!stateExists) {
        newErrors.state = 'Invalid state selection.';
      }
    }

    // 2. District filtered accordingly
    if (!formDistrict) {
      newErrors.district = 'Please select a valid district.';
    } else if (formState) {
      const selectedStateData = statesList.find(s => s.state.toLowerCase() === formState.toLowerCase());
      if (!selectedStateData) {
        newErrors.district = 'Invalid state selection.';
      } else {
        const districtExists = selectedStateData.districts.some(d => d.toLowerCase() === formDistrict.toLowerCase());
        if (!districtExists) {
          newErrors.district = `District "${formDistrict}" does not belong to selected State "${formState}".`;
        }
      }
    }

    // 3. Pincode validated
    if (!formPincode) {
      newErrors.pincode = 'Pincode is required.';
    } else if (!/^\d{6}$/.test(formPincode)) {
      newErrors.pincode = 'Pincode must be exactly 6 digits.';
    } else if (pincodeSuccess === false) {
      newErrors.pincode = errors.pincode || 'Pincode validation failed.';
    }

    // 4. Mobile number validated
    if (!formPhone) {
      newErrors.phone = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formPhone)) {
      newErrors.phone = 'Mobile must be 10 digits starting with 6, 7, 8, or 9.';
    }

    // 5. Full address validated
    if (!formAddress.trim()) {
      newErrors.address = 'Full street address is required.';
    } else if (formAddress.trim().length < 8) {
      newErrors.address = 'Address is too short. Please provide flat/house/street details.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmOrder = async () => {
    setPlacingOrder(true);
    let orderAddress: Address | null = null;

    if (useSavedAddress && currentUser) {
      orderAddress = currentUser.addresses.find(a => a.id === selectedAddressId) || null;
    } else {
      if (!validateForm()) {
        setPlacingOrder(false);
        window.scrollTo(0, 150);
        return;
      }
      
      const newAddress: Address = {
        id: `addr-${Math.floor(Math.random() * 10000)}`,
        tag: 'Home',
        name: formName,
        addressLine: formAddress,
        district: formDistrict,
        state: formState,
        pincode: formPincode,
        phone: formPhone,
        isDefault: currentUser ? currentUser.addresses.length === 0 : true
      };

      // If user is logged in, save to database
      if (currentUser) {
        const updatedAddresses = [...currentUser.addresses, newAddress];
        await updateUserAddressesAPI(updatedAddresses);
      }
      orderAddress = newAddress;
    }

    if (!orderAddress) {
      alert('Could not determine shipping address.');
      setPlacingOrder(false);
      return;
    }

    const orderData = {
      items: checkoutItems,
      address: orderAddress,
      paymentMethod: paymentMethod,
      chargesBreakdown: {
        mrpSubtotal,
        productDiscount,
        sellingSubtotal,
        discount,
        deliveryCharge,
        codFee,
        gstIncluded: Math.round((Math.max(0, sellingSubtotal - discount) * (charges?.taxRate ?? 18)) / (100 + (charges?.taxRate ?? 18))),
        total: totalToPay,
        customFees: customFees
      },
      couponApplied: activeCoupon ? activeCoupon.code : null
    };

    if (paymentMethod === 'COD') {
      const res = await placeOrder(orderData);
      if (res.success && res.order) {
        setOrderSuccess(true);
        await new Promise((resolve) => setTimeout(resolve, 1200));
        localStorage.removeItem('lumi_temp_checkout');
        if (buyNowItem) {
          setBuyNowItem(null);
        } else {
          context.clearCart();
        }
        setTrackingOrderId(res.order.order_id);
        setCurrentPage('tracking');
        window.scrollTo(0, 0);
      } else {
        alert(res.error || 'Failed to place COD order.');
      }
      setPlacingOrder(false);
      setOrderSuccess(false);
    } else {
      // UPI Intent Flow
      // Store temporary checkout details to order state so the payment screen can complete it
      setOrderSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem('lumi_temp_checkout', JSON.stringify(orderData));
      setCurrentPage('payment-screen');
      window.scrollTo(0, 0);
      setPlacingOrder(false);
      setOrderSuccess(false);
    }

  };

  const renderButtonContent = () => {
    if (orderSuccess) {
      return (
        <span className="flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
          <span>Order Placed Successfully!</span>
        </span>
      );
    }
    if (placingOrder) {
      return (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Processing Order...</span>
        </span>
      );
    }
    return <span>Confirm & Place Order</span>;
  };

  const getButtonClasses = (isMobile: boolean) => {
    const base = "w-full py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-xl flex items-center justify-center gap-2 select-none shadow-md";

    if (orderSuccess) {
      return `${base} bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white shadow-md`;
    }
    if (placingOrder) {
      return `${base} bg-text-light text-white cursor-not-allowed opacity-80`;
    }
    return `${base} bg-gradient-to-r from-[#6B534C] via-[#83675E] to-[#6B534C] hover:from-[#5C4B45] hover:to-[#6B534C] text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer`;
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 text-left pb-24 lg:pb-6">
      
      {/* Header and steps */}
      <div className="flex flex-col gap-4 border-b border-border-lumi pb-4">
        <div className="flex items-center justify-between">
          <span className="logo-text font-serif font-semibold tracking-[3.5px] hidden sm:inline">LUMIÈRE</span>
          <div className="w-12 sm:w-20"></div>
        </div>

        {/* Steps */}
        <div className="flex justify-between items-center max-w-sm mx-auto w-full px-6 mt-2">
          <div className="flex flex-col items-center gap-1.5">
            <span className="w-7 h-7 rounded-full bg-bg-pink border border-primary text-primary flex items-center justify-center text-[10px] font-bold">✓</span>
            <span className="text-[10px] font-semibold text-primary">Shipping</span>
          </div>
          <div className="h-[1px] bg-primary flex-grow mx-2 mb-4"></div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="w-7 h-7 rounded-full bg-bg-pink border border-primary text-primary flex items-center justify-center text-[10px] font-bold">2</span>
            <span className="text-[10px] font-semibold text-primary">Payment</span>
          </div>
          <div className="h-[1px] bg-border-lumi flex-grow mx-2 mb-4"></div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="w-7 h-7 rounded-full bg-white border border-border-lumi text-text-light flex items-center justify-center text-[10px] font-bold">3</span>
            <span className="text-[10px] font-medium text-text-light">Review</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left), Order breakdown totals (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Shipping & Payment (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Order Summary at the Top (Always visible, showing BEFORE address pane) */}
          <div className="bg-white border border-border-lumi p-5 rounded-2xl shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-dark mb-4 border-b border-border-lumi pb-2">Order Summary</h2>
            <div className="flex flex-col gap-4">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-14 h-16 rounded-xl overflow-hidden bg-bg-cream border border-border-lumi flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow text-left">
                    <h3 className="text-xs font-semibold text-text-dark leading-snug line-clamp-1">{item.product.name}</h3>
                    <span className="text-[10px] text-text-light uppercase tracking-wider block mt-0.5">Size: {item.selectedSize}</span>
                    <span className="text-xs text-text-medium block mt-1 font-semibold">Qty: {item.quantity}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-text-dark block">₹{(item.product.discount_price || item.product.price) * item.quantity}</span>
                    {item.product.discount_price && item.product.discount_price < item.product.price && (
                      <span className="text-[10px] text-text-light line-through block">₹{item.product.price * item.quantity}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Detailed summary inside this block */}
            <div className="border-t border-border-lumi mt-4 pt-4 flex flex-col gap-2.5">
              <div className="flex justify-between text-xs text-text-medium">
                <span>Total Items price (MRP)</span>
                <span>₹{mrpSubtotal}</span>
              </div>
              {productDiscount > 0 && (
                <div className="flex justify-between text-xs text-success font-semibold">
                  <span>Product Discount Savings</span>
                  <span>- ₹{productDiscount}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-xs text-success font-semibold">
                  <span>Promo Coupon Discount</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-text-medium">
                <span>Delivery Charges</span>
                <span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : <span className="text-success font-semibold">FREE</span>}</span>
              </div>
              {customFees.map(fee => (
                <div key={fee.name} className="flex justify-between text-xs text-text-medium">
                  <span>{fee.name}</span>
                  <span>₹{fee.amount}</span>
                </div>
              ))}
              {codFee > 0 && (
                <div className="flex justify-between text-xs text-text-medium font-semibold">
                  <span>COD Surcharge</span>
                  <span>₹{codFee}</span>
                </div>
              )}
              <div className="border-t border-border-lumi mt-2 pt-2 flex justify-between items-baseline grand-total-row text-text-dark">
                <span className="font-serif text-sm font-semibold">Payable Total</span>
                <span className="text-base font-bold text-primary">₹{totalToPay}</span>
              </div>
              {totalSavings > 0 && (
                <div className="bg-bg-pink/30 border border-primary/10 rounded-xl p-2.5 text-center mt-1">
                  <span className="text-[11px] font-bold text-primary">🎉 You save ₹{totalSavings} on this order!</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address Pane */}
          <div className="bg-white border border-border-lumi p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-serif font-semibold text-text-dark">Delivery Address</h2>
              {currentUser && currentUser.addresses.length > 0 && !showNewAddressForm && (
                <button 
                  onClick={() => {
                    setEditingAddressId(null);
                    setFormName('');
                    setFormAddress('');
                    setFormPincode('');
                    setFormState('');
                    setStateSearch('');
                    setFormDistrict('');
                    setDistrictSearch('');
                    setFormPhone('');
                    setPincodeSuccess(null);
                    setErrors({});
                    setShowNewAddressForm(true);
                    setUseSavedAddress(false);
                  }}
                  className="text-xs font-bold text-primary border border-primary/30 px-3.5 py-1.5 rounded-full hover:bg-bg-pink hover:border-primary transition-all flex items-center gap-1 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Plus size={12} className="stroke-[2.5]" />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            {useSavedAddress && currentUser && currentUser.addresses.length > 0 && !showNewAddressForm ? (
              // Saved Address Card List
              <div className="flex flex-col gap-4">
                <div className="flex flex-row overflow-x-auto gap-4 py-2 scrollbar-thin select-none snap-x snap-mandatory">
                  {currentUser.addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div 
                        key={addr.id} 
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`min-w-[260px] sm:min-w-[280px] p-4 border rounded-2xl cursor-pointer transition-all duration-300 relative snap-start text-left flex flex-col justify-between ${
                          isSelected 
                            ? 'border-primary bg-bg-pink/10 shadow-md ring-2 ring-primary/10' 
                            : 'border-border-lumi bg-white hover:border-primary-light hover:shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {addr.tag === 'Office' || addr.tag === 'Work' ? (
                              <Briefcase size={14} className="text-primary-light" />
                            ) : (
                              <HomeIcon size={14} className="text-primary-light" />
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-medium">{addr.tag}</span>
                            {addr.isDefault && (
                              <span className="text-[9px] font-bold text-white bg-primary-light/80 px-2 py-0.5 rounded-md">Default</span>
                            )}
                            {isSelected && (
                              <CheckCircle2 size={16} className="text-primary ml-auto flex-shrink-0" />
                            )}
                          </div>
                          
                          <div className="text-xs text-text-medium leading-relaxed mb-4">
                            <h4 className="font-bold text-text-dark">{addr.name}</h4>
                            <p className="line-clamp-2 mt-1">{addr.addressLine}</p>
                            <p>{addr.district}, {addr.state} - {addr.pincode}</p>
                            <p className="font-medium mt-1">Phone: +91 {addr.phone}</p>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center gap-2.5 pt-3 border-t border-border-lumi mt-auto">
                          <button
                            type="button"
                            onClick={(e) => handleEditAddress(addr, e)}
                            className="text-[10px] font-bold text-primary hover:text-primary-light uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit2 size={10} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteAddress(addr.id, e)}
                            className="text-[10px] font-bold text-text-light hover:text-danger uppercase tracking-wider flex items-center gap-1 transition-colors ml-auto cursor-pointer"
                          >
                            <Trash2 size={10} />
                            <span>Delete</span>
                          </button>
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={(e) => handleSetDefaultAddress(addr.id, e)}
                              className="text-[9px] font-bold text-text-light hover:text-primary border border-border-lumi px-2 py-1 rounded-lg transition-all cursor-pointer"
                            >
                              Set Default
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Address Entry/Edit Form
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-border-lumi pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-medium">
                    {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                  </h3>
                  {currentUser && currentUser.addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={handleCancelAddressForm}
                      className="text-xs text-text-light hover:text-text-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                
                {/* Full Name */}
                <div className="relative">
                  <input 
                    type="text" 
                    id="formName"
                    placeholder=" "
                    className={`peer block w-full px-4 pt-6 pb-2 text-sm text-text-dark bg-bg-cream rounded-xl border transition-all ${
                      errors.name 
                        ? 'border-danger focus:border-danger' 
                        : formName.trim() 
                          ? 'border-success focus:border-success' 
                          : 'border-border-lumi focus:border-primary'
                    } appearance-none focus:outline-none focus:ring-0 focus:bg-white`}
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (errors.name) {
                        setErrors(prev => {
                          const n = { ...prev };
                          delete n.name;
                          return n;
                        });
                      }
                    }}
                  />
                  <label 
                    htmlFor="formName"
                    className="absolute text-xs sm:text-sm text-text-light duration-200 transform -translate-y-3 scale-90 top-4 z-10 origin-[0] start-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none"
                  >
                    Recipient Full Name
                  </label>
                  {errors.name && <span className="text-[10px] text-danger font-medium mt-1 pl-2 block">{errors.name}</span>}
                </div>

                {/* State & District row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* State Selectable Searchable Dropdown */}
                  <div className="relative" ref={stateDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                      className={`w-full flex justify-between items-center px-4 py-4 text-xs font-semibold rounded-xl border transition-all bg-bg-cream ${
                        errors.state 
                          ? 'border-danger text-danger' 
                          : formState 
                            ? 'border-success text-text-dark' 
                            : 'border-border-lumi text-text-light'
                      }`}
                    >
                      <span>{formState || 'Select State'}</span>
                      <ChevronDown size={14} />
                    </button>
                    {errors.state && <span className="text-[10px] text-danger font-medium mt-1 pl-2 block">{errors.state}</span>}

                    {stateDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1 z-30 bg-white border border-border-lumi rounded-xl shadow-lg max-h-56 overflow-y-auto p-2">
                        <input
                          type="text"
                          placeholder="Search state..."
                          className="w-full text-xs p-2 bg-bg-cream border border-border-lumi rounded-lg mb-2 focus:outline-none focus:border-primary text-text-dark"
                          value={stateSearch}
                          onChange={(e) => setStateSearch(e.target.value)}
                        />
                        <div className="flex flex-col gap-0.5">
                          {statesList
                            .filter(s => s.state.toLowerCase().includes(stateSearch.toLowerCase()))
                            .map((s) => (
                              <button
                                key={s.state}
                                type="button"
                                className="text-left text-xs px-3 py-2 rounded-lg hover:bg-bg-peach text-text-dark cursor-pointer"
                                onClick={() => {
                                  setFormState(s.state);
                                  setFormDistrict(''); // reset district
                                  setDistrictSearch('');
                                  setStateSearch('');
                                  setStateDropdownOpen(false);
                                  if (errors.state) {
                                    setErrors(prev => {
                                      const n = { ...prev };
                                      delete n.state;
                                      return n;
                                    });
                                  }
                                }}
                              >
                                {s.state}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* District Selectable Searchable Dropdown */}
                  <div className="relative" ref={districtDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!formState) {
                          alert('Please select a state first.');
                          return;
                        }
                        setDistrictDropdownOpen(!districtDropdownOpen);
                      }}
                      className={`w-full flex justify-between items-center px-4 py-4 text-xs font-semibold rounded-xl border transition-all bg-bg-cream ${
                        errors.district 
                          ? 'border-danger text-danger' 
                          : formDistrict 
                            ? 'border-success text-text-dark' 
                            : 'border-border-lumi text-text-light'
                      } ${!formState ? 'opacity-60 cursor-not-allowed' : ''}`}
                      disabled={!formState}
                    >
                      <span>{formDistrict || 'Select District'}</span>
                      <ChevronDown size={14} />
                    </button>
                    {errors.district && <span className="text-[10px] text-danger font-medium mt-1 pl-2 block">{errors.district}</span>}

                    {districtDropdownOpen && formState && (
                      <div className="absolute left-0 right-0 mt-1 z-30 bg-white border border-border-lumi rounded-xl shadow-lg max-h-56 overflow-y-auto p-2">
                        <input
                          type="text"
                          placeholder="Search district..."
                          className="w-full text-xs p-2 bg-bg-cream border border-border-lumi rounded-lg mb-2 focus:outline-none focus:border-primary text-text-dark"
                          value={districtSearch}
                          onChange={(e) => setDistrictSearch(e.target.value)}
                        />
                        <div className="flex flex-col gap-0.5">
                          {availableDistricts
                            .filter(d => d.toLowerCase().includes(districtSearch.toLowerCase()))
                            .map((d) => (
                              <button
                                key={d}
                                type="button"
                                className="text-left text-xs px-3 py-2 rounded-lg hover:bg-bg-peach text-text-dark cursor-pointer"
                                onClick={() => {
                                  setFormDistrict(d);
                                  setDistrictSearch('');
                                  setDistrictDropdownOpen(false);
                                  if (errors.district) {
                                    setErrors(prev => {
                                      const n = { ...prev };
                                      delete n.district;
                                      return n;
                                    });
                                  }
                                }}
                              >
                                {d}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div className="relative">
                  <textarea 
                    id="formAddress"
                    placeholder=" "
                    rows={2}
                    className={`peer block w-full px-4 pt-6 pb-2 text-sm text-text-dark bg-bg-cream rounded-xl border transition-all ${
                      errors.address 
                        ? 'border-danger focus:border-danger' 
                        : formAddress.trim().length >= 8 
                          ? 'border-success focus:border-success' 
                          : 'border-border-lumi focus:border-primary'
                    } appearance-none focus:outline-none focus:ring-0 focus:bg-white resize-none`}
                    value={formAddress}
                    onChange={(e) => {
                      setFormAddress(e.target.value);
                      if (errors.address) {
                        setErrors(prev => {
                          const n = { ...prev };
                          delete n.address;
                          return n;
                        });
                      }
                    }}
                  />
                  <label 
                    htmlFor="formAddress"
                    className="absolute text-xs sm:text-sm text-text-light duration-200 transform -translate-y-3 scale-90 top-4 z-10 origin-[0] start-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none"
                  >
                    Flat/House No, Building, Street Details
                  </label>
                  {errors.address && <span className="text-[10px] text-danger font-medium mt-1 pl-2 block">{errors.address}</span>}
                </div>

                {/* Pincode & Mobile row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pincode */}
                  <div className="relative">
                    <input 
                      type="text" 
                      id="formPincode"
                      maxLength={6}
                      placeholder=" "
                      className={`peer block w-full px-4 pt-6 pb-2 text-sm text-text-dark bg-bg-cream rounded-xl border transition-all ${
                        errors.pincode 
                          ? 'border-danger focus:border-danger' 
                          : pincodeSuccess 
                            ? 'border-success focus:border-success' 
                            : 'border-border-lumi focus:border-primary'
                      } appearance-none focus:outline-none focus:ring-0 focus:bg-white`}
                      value={formPincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setFormPincode(val);
                        if (errors.pincode) {
                          setErrors(prev => {
                            const n = { ...prev };
                            delete n.pincode;
                            return n;
                          });
                        }
                        if (val.length === 6) {
                          checkPincode(val);
                        } else {
                          setPincodeSuccess(null);
                        }
                      }}
                    />
                    <label 
                      htmlFor="formPincode"
                      className="absolute text-xs sm:text-sm text-text-light duration-200 transform -translate-y-3 scale-90 top-4 z-10 origin-[0] start-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none"
                    >
                      6-Digit PIN Code
                    </label>
                    {pincodeValidating && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-text-light">
                        <Loader2 size={12} className="animate-spin text-primary" />
                        <span>Verifying...</span>
                      </div>
                    )}
                    {pincodeSuccess && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-success font-semibold">Verified ✓</span>
                    )}
                    {errors.pincode && <span className="text-[10px] text-danger font-medium mt-1 pl-2 block">{errors.pincode}</span>}
                  </div>
                </div>

                {/* Mobile Phone */}
                <div className="relative">
                  <input 
                    type="text" 
                    id="formPhone"
                    maxLength={10}
                    placeholder=" "
                    className={`peer block w-full px-4 pt-6 pb-2 text-sm text-text-dark bg-bg-cream rounded-xl border transition-all ${
                      errors.phone 
                        ? 'border-danger focus:border-danger' 
                        : formPhone.trim().length === 10 
                          ? 'border-success focus:border-success' 
                          : 'border-border-lumi focus:border-primary'
                    } appearance-none focus:outline-none focus:ring-0 focus:bg-white`}
                    value={formPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormPhone(val);
                      if (errors.phone) {
                        setErrors(prev => {
                          const n = { ...prev };
                          delete n.phone;
                          return n;
                        });
                      }
                    }}
                  />
                  <label 
                    htmlFor="formPhone"
                    className="absolute text-xs sm:text-sm text-text-light duration-200 transform -translate-y-3 scale-90 top-4 z-10 origin-[0] start-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none"
                  >
                    10-Digit Mobile Number
                  </label>
                  {errors.phone && <span className="text-[10px] text-danger font-medium mt-1 pl-2 block">{errors.phone}</span>}
                </div>

                {/* Address Tag Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-text-medium uppercase tracking-wider text-left">Address Label</label>
                  <div className="flex gap-2 text-left">
                    {['Home', 'Work', 'Other'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setFormTag(tag)}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          formTag === tag 
                            ? 'border-primary bg-bg-pink/15 text-primary' 
                            : 'border-border-lumi bg-white text-text-medium hover:bg-bg-peach'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Form Actions */}
                <button
                  type="button"
                  onClick={handleSaveAddressForm}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-light text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer mt-4"
                >
                  {editingAddressId ? 'Update Address' : 'Deliver to this address'}
                </button>

              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-border-lumi p-5 rounded-2xl shadow-sm">
            <h2 className="text-base sm:text-lg font-serif font-semibold text-text-dark mb-4">Payment Method</h2>
            
            <div className="flex flex-col gap-3">
              {/* UPI Option */}
              <label 
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'UPI' ? 'border-primary bg-bg-pink/10 shadow-sm' : 'border-border-lumi hover:bg-bg-cream'
                }`}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value="UPI" 
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="hidden"
                />
                <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'UPI' ? 'border-primary' : 'border-border-lumi'
                }`}>
                  {paymentMethod === 'UPI' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                </div>
                <div className="flex flex-col text-left">
                  <strong className="text-xs sm:text-sm font-semibold text-text-dark">UPI Payment Intent</strong>
                  <span className="text-[10px] sm:text-xs text-text-light mt-0.5">Google Pay, PhonePe, Paytm, BHIM Apps</span>
                </div>
              </label>

              {/* COD Option */}
              <label 
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'COD' ? 'border-primary bg-bg-pink/10 shadow-sm' : 'border-border-lumi hover:bg-bg-cream'
                }`}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD" 
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="hidden"
                />
                <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'COD' ? 'border-primary' : 'border-border-lumi'
                }`}>
                  {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                </div>
                <div className="flex flex-col text-left">
                  <strong className="text-xs sm:text-sm font-semibold text-text-dark">Cash on Delivery (COD)</strong>
                  <span className="text-[10px] sm:text-xs text-text-light mt-0.5">Pay at your doorstep (+₹49 COD fee)</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Order Items & Pricing Summary (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Order Summary Collapsible */}
          <div className="bg-white border border-border-lumi rounded-2xl shadow-sm overflow-hidden">
            <button 
              className="w-full flex justify-between items-center p-4 bg-bg-peach font-serif text-sm font-semibold text-text-dark text-left"
              onClick={() => setOrderSummaryExpanded(!orderSummaryExpanded)}
            >
              <div className="flex items-center gap-2">
                <span>Order Summary</span>
                <span className="bg-bg-pink text-primary text-[9px] font-bold py-0.5 px-2.5 rounded-full uppercase tracking-wider">
                  {cart.reduce((sum, i)=>sum+i.quantity, 0)} Items
                </span>
              </div>
              {orderSummaryExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {orderSummaryExpanded && (
              <div className="p-4 border-t border-border-lumi flex flex-col gap-3 max-h-60 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-text-medium">
                    <span className="max-w-[200px] truncate">{item.product.name} ({item.selectedSize}) × {item.quantity}</span>
                    <span>₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing detail bill card */}
          <div className="bg-white border border-border-lumi p-6 rounded-2xl shadow-sm flex flex-col gap-3">
            <h3 className="font-serif text-base font-semibold border-b border-border-lumi pb-3 text-text-dark uppercase tracking-wider">Order Billing</h3>
            
            <div className="flex justify-between text-xs text-text-medium mt-1">
              <span>Items Total (MRP)</span>
              <span>₹{mrpSubtotal}</span>
            </div>

            {productDiscount > 0 && (
              <div className="flex justify-between text-xs text-success font-semibold">
                <span>Product Discount Savings</span>
                <span>- ₹{productDiscount}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between text-xs text-success font-semibold">
                <span>Promo Coupon Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-text-medium">
              <span>Delivery Charges</span>
              <span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : <span className="text-success font-semibold">FREE</span>}</span>
            </div>

            {customFees.map(fee => (
              <div key={fee.name} className="flex justify-between text-xs text-text-medium">
                <span>{fee.name}</span>
                <span>₹{fee.amount}</span>
              </div>
            ))}

            {paymentMethod === 'COD' && codFee > 0 && (
              <div className="flex justify-between text-xs text-text-medium">
                <span>Cash on Delivery Surcharge</span>
                <span>₹{codFee}</span>
              </div>
            )}

            <div className="h-[1px] bg-border-lumi my-2"></div>

            <div className="flex justify-between items-baseline grand-total-row text-text-dark mb-2">
              <span className="font-serif text-base font-semibold">Grand Total</span>
              <span className="text-xl font-bold">₹{totalToPay}</span>
            </div>

            {totalSavings > 0 && (
              <div className="text-[11px] font-bold text-success text-center mb-2">
                🎉 Total Savings: ₹{totalSavings}
              </div>
            )}

            {/* Verification badges */}
            <div className="flex justify-between border-t border-b border-border-lumi py-4 mb-4 text-text-light text-[10px] font-semibold tracking-wider uppercase">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={16} />
                <span>SECURE SSL</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw size={16} />
                <span>NO RETURNS</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Heart size={16} />
                <span>VEGAN CARE</span>
              </div>
            </div>

            {/* Desktop Pay Button */}
            <div className="hidden md:block w-full">
              <button 
                className={getButtonClasses(false)}
                onClick={handleConfirmOrder}
                disabled={placingOrder || orderSuccess}
              >
                {renderButtonContent()}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Sticky summary (Hidden on Desktop lg:hidden) */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 border-t border-border-lumi flex justify-between items-center z-50 shadow-lg gap-4 transition-all duration-300 ${
        isScrollingDown 
          ? 'p-2 bg-white/80 backdrop-blur-lg opacity-85' 
          : 'p-3.5 bg-white/95 backdrop-blur-md opacity-100'
      }`}>
        <div className="flex flex-col text-left flex-shrink-0">
          <span className="text-[9px] font-bold text-text-light tracking-wider uppercase">Grand Total</span>
          <span className="text-lg font-bold text-text-dark">₹{totalToPay}</span>
        </div>
        <div className="flex-grow max-w-[240px]">
          <button 
            className={getButtonClasses(true)}
            onClick={handleConfirmOrder}
            disabled={placingOrder || orderSuccess}
          >
            {renderButtonContent()}
          </button>
        </div>
      </div>

    </div>
  );
}
