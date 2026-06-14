'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Product, User, Order, Address, ChargesConfig, Coupon, ChargesBreakdown, Category, CustomFee } from '@/lib/db';
import { getProductSizeDetails } from '@/lib/productUtils';
import dbDataFallback from '../../lumi_database.json';

export const INDIAN_STATES_DISTRICTS = {
  'Andaman and Nicobar Islands': ['Port Blair', 'Nicobar', 'Car Nicobar'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
  'Arunachal Pradesh': ['Itanagar', 'Tawang', 'West Kameng', 'Changlang'],
  'Assam': ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Tezpur'],
  'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'],
  'Chandigarh': ['Chandigarh'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panchkula', 'Ambala', 'Karnal'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Manali', 'Solan', 'Mandi'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Alappuzha'],
  'Ladakh': ['Leh', 'Kargil'],
  'Lakshadweep': ['Kavaratti', 'Agatti', 'Minicoy'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'],
  'Maharashtra': ['Mumbai', 'Pune', 'Thane', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Manipur': ['Imphal', 'Thoubal', 'Churachandpur'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar'],
  'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur'],
  'Uttar Pradesh': ['Noida', 'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Ghaziabad'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Haldwani'],
  'West Bengal': ['Kolkata', 'Howrah', 'Darjeeling', 'Asansol', 'Siliguri']
};



export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  charges: ChargesConfig | null;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  orders: Order[];
  fetchOrders: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string | null) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  updateCartItemSize: (productId: string, oldSize: string, newSize: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  activeCoupon: Coupon | null;
  setActiveCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  goBack: () => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  buyNowItem: CartItem | null;
  setBuyNowItem: React.Dispatch<React.SetStateAction<CartItem | null>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  syncUserSession: () => Promise<void>;
  placeOrder: (orderData: any) => Promise<{ success: boolean; order?: Order; error?: string }>;
  calculateTotals: (items?: CartItem[]) => ChargesBreakdown;
  updateOrderStatusAPI: (orderId: string, status: Order['order_status']) => Promise<boolean>;
  updateOrderPaymentAPI: (orderId: string, status: Order['payment_status']) => Promise<boolean>;
  deleteOrderAPI: (orderId: string) => Promise<boolean>;
  saveGlobalChargesAPI: (chargesConfig: ChargesConfig, couponsConfig: Coupon[]) => Promise<boolean>;
  saveProductAPI: (productData: any) => Promise<boolean>;
  deleteProductAPI: (productId: string) => Promise<boolean>;
  redirectDestination: string | null;
  setRedirectDestination: React.Dispatch<React.SetStateAction<string | null>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  saveCategoryAPI: (categoryData: any) => Promise<boolean>;
  deleteCategoryAPI: (categoryId: string) => Promise<boolean>;
  updateUserAddressesAPI: (addresses: Address[]) => Promise<boolean>;
  isScrollingDown: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(dbDataFallback.products as Product[]);
  const [charges, setCharges] = useState<ChargesConfig | null>(dbDataFallback.charges as ChargesConfig);
  const [coupons, setCoupons] = useState<Coupon[]>(dbDataFallback.coupons as Coupon[]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageHistory, setPageHistory] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [redirectDestination, setRedirectDestination] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(dbDataFallback.categories as Category[]);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  const changePage = (page: string) => {
    if (page === currentPage) return;
    if (['checkout', 'payment-screen'].includes(page) && !currentUser) {
      setRedirectDestination(page);
      setPageHistory((prev) => [...prev, currentPage]);
      setCurrentPage('login');
      window.scrollTo(0, 0);
      return;
    }
    setPageHistory((prev) => [...prev, currentPage]);
    setCurrentPage(page);
  };

  const goBack = () => {
    if (pageHistory.length > 0) {
      const prevPage = pageHistory[pageHistory.length - 1];
      setPageHistory((prev) => prev.slice(0, -1));
      setCurrentPage(prevPage);
    } else {
      setCurrentPage('home');
    }
  };


  // Sync session and initial data on startup
  useEffect(() => {
    syncUserSession();
    fetchCatalogData();
    
    // Load local cart/wishlist
    const savedCart = localStorage.getItem('lumi_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedWish = localStorage.getItem('lumi_wishlist');
    if (savedWish) setWishlist(JSON.parse(savedWish));
  }, []);

  // Sync changes to localStorage
  useEffect(() => {
    localStorage.setItem('lumi_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lumi_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Window scroll handler for smart scroll effect (minimize fixed elements)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollingDown = currentScrollY > lastScrollY && currentScrollY > 50;
          setIsScrollingDown(scrollingDown);
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const syncUserSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        // Fetch orders once user is authenticated
        fetchOrders();
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Failed to sync user session:', err);
    }
  };

  const fetchCatalogData = async () => {
    try {
      const resProd = await fetch('/api/products');
      const dataProd = await resProd.json();
      if (dataProd.products) setProducts(dataProd.products);

      const resCharges = await fetch('/api/charges');
      const dataCharges = await resCharges.json();
      if (dataCharges.charges) setCharges(dataCharges.charges);
      if (dataCharges.coupons) setCoupons(dataCharges.coupons);

      const resCats = await fetch('/api/categories');
      const dataCats = await resCats.json();
      if (dataCats.categories) setCategories(dataCats.categories);
    } catch (err) {
      console.error('Failed to fetch catalog configuration:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, size: string | null = null) => {
    setCart((prev) => {
      let selectedSize = size;
      if (!selectedSize) {
        if (product.sizes && product.sizes.length > 0) {
          selectedSize = product.sizes[0].label;
        } else {
          selectedSize = 'Standard';
        }
      }
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedSize }];
    });
  };

  const updateCartItemSize = (productId: string, oldSize: string, newSize: string) => {
    setCart((prev) => {
      const itemIdx = prev.findIndex(
        (item) => item.product.id === productId && item.selectedSize === oldSize
      );
      if (itemIdx === -1) return prev;

      const itemToUpdate = prev[itemIdx];
      const targetIdx = prev.findIndex(
        (item) => item.product.id === productId && item.selectedSize === newSize
      );

      const updated = [...prev];
      if (targetIdx > -1 && targetIdx !== itemIdx) {
        updated[targetIdx].quantity += itemToUpdate.quantity;
        return updated.filter((_, idx) => idx !== itemIdx);
      } else {
        updated[itemIdx] = { ...itemToUpdate, selectedSize: newSize };
        return updated;
      }
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
    localStorage.removeItem('lumi_cart');
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const updated = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      return updated;
    });
  };

  // REST API Actions
  const placeOrder = async (orderData: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        fetchCatalogData(); // Update stock locally
        return { success: true, order: data.order };
      }
      return { success: false, error: data.error || 'Checkout failed.' };
    } catch (err) {
      return { success: false, error: 'Network communication failure.' };
    }
  };

  const updateOrderStatusAPI = async (orderId: string, order_status: Order['order_status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const updateOrderPaymentAPI = async (orderId: string, payment_status: Order['payment_status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const deleteOrderAPI = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const saveGlobalChargesAPI = async (chargesConfig: ChargesConfig, couponsConfig: Coupon[]) => {
    try {
      const res = await fetch('/api/charges', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chargesConfig, couponsConfig })
      });
      const data = await res.json();
      if (data.success) {
        fetchCatalogData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const saveProductAPI = async (productData: any) => {
    try {
      const method = productData.id && productData.id.startsWith('lumi-') ? 'PUT' : 'POST';
      const endpoint = method === 'PUT' ? `/api/products/${productData.id}` : '/api/products';
      
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.success) {
        fetchCatalogData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const deleteProductAPI = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCatalogData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const saveCategoryAPI = async (categoryData: any) => {
    try {
      const method = categoryData.id && categoryData.id.startsWith('cat-') ? 'PUT' : 'POST';
      const endpoint = method === 'PUT' ? `/api/categories/${categoryData.id}` : '/api/categories';
      
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      const data = await res.json();
      if (data.success) {
        fetchCatalogData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const deleteCategoryAPI = async (categoryId: string) => {
    try {
      const res = await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCatalogData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const updateUserAddressesAPI = async (addresses: Address[]) => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Pricing calculations
  const calculateTotals = (items?: CartItem[]): ChargesBreakdown => {
    const activeItems = items || cart;
    const mrpSubtotal = activeItems.reduce((sum, item) => {
      const sizeDetails = getProductSizeDetails(item.product, item.selectedSize);
      return sum + sizeDetails.price * item.quantity;
    }, 0);
    const sellingSubtotal = activeItems.reduce((sum, item) => {
      const sizeDetails = getProductSizeDetails(item.product, item.selectedSize);
      return sum + sizeDetails.discount_price * item.quantity;
    }, 0);
    const productDiscount = mrpSubtotal - sellingSubtotal;

    if (!charges) {
      return {
        mrpSubtotal,
        productDiscount,
        sellingSubtotal,
        discount: 0,
        deliveryCharge: 0,
        codFee: 0,
        gstIncluded: 0,
        total: sellingSubtotal,
        customFees: [],
        subtotal: sellingSubtotal,
        handlingFee: 0,
        packagingFee: 0,
        festivalFee: 0
      };
    }

    let deliveryCharge = 0;
    if (charges.deliveryEnabled && sellingSubtotal > 0 && sellingSubtotal < charges.deliveryThreshold) {
      deliveryCharge = charges.deliveryCharge;
    }

    const codFee = 0; // Handled dynamically in Checkout based on payment selection

    let discount = 0;
    if (activeCoupon) {
      if (activeCoupon.type === 'percentage') {
        discount = Math.round((sellingSubtotal * activeCoupon.value) / 100);
      } else if (activeCoupon.type === 'fixed') {
        discount = Math.min(activeCoupon.value, sellingSubtotal);
      }
    }

    const subtotalAfterDiscount = Math.max(0, sellingSubtotal - discount);

    // Sum up dynamic custom fees
    const appliedCustomFees = (charges.customFees || [])
      .filter(f => f.enabled)
      .map(f => ({ name: f.name, amount: f.amount }));

    const customFeesTotal = appliedCustomFees.reduce((sum, f) => sum + f.amount, 0);
    const gstIncluded = Math.round((subtotalAfterDiscount * charges.taxRate) / (100 + charges.taxRate));

    return {
      mrpSubtotal,
      productDiscount,
      sellingSubtotal,
      discount,
      deliveryCharge,
      codFee,
      gstIncluded,
      total: subtotalAfterDiscount + deliveryCharge + customFeesTotal,
      customFees: appliedCustomFees,
      subtotal: sellingSubtotal,
      handlingFee: 0,
      packagingFee: 0,
      festivalFee: 0
    };
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        charges,
        coupons,
        setCoupons,
        orders,
        fetchOrders,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartItemSize,
        clearCart,
        wishlist,
        toggleWishlist,
        currentUser,
        setCurrentUser,
        activeCoupon,
        setActiveCoupon,
        currentPage,
        setCurrentPage: changePage,
        goBack,
        selectedProductId,
        setSelectedProductId,
        trackingOrderId,
        setTrackingOrderId,
        buyNowItem,
        setBuyNowItem,
        searchQuery,
        setSearchQuery,
        syncUserSession,
        placeOrder,
        calculateTotals,
        updateOrderStatusAPI,
        updateOrderPaymentAPI,
        deleteOrderAPI,
        saveGlobalChargesAPI,
        saveProductAPI,
        deleteProductAPI,
        redirectDestination,
        setRedirectDestination,
        categories,
        setCategories,
        saveCategoryAPI,
        deleteCategoryAPI,
        updateUserAddressesAPI,
        isScrollingDown
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
