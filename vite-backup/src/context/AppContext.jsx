import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Sample premium beauty products dataset
const INITIAL_PRODUCTS = [
  {
    id: 'lumi-01',
    name: 'The Silk Serum',
    category: 'Serum',
    price: 1280,
    rating: 4.9,
    reviewsCount: 124,
    stock: 6, // Badge "Only 6 left in stock"
    description: 'Experience the ultimate skin refinement with our proprietary bio-silk protein complex. A weightless, transformative treatment that blurs imperfections and restores natural radiance overnight.',
    sizes: ['30ml', '50ml', '100ml'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    science: [
      { title: 'Bio-Silk Complex', text: 'A premium network of silk-derived proteins that mimic skin structure, creating a protective breathable mesh that lock in moisture and active botanicals.' },
      { title: 'Vegan Squalane', text: 'Sugarcane-derived squalane deeply hydrates, softens skin texture, and helps reinforce the lipid barrier without clogging pores.' }
    ],
    reviews: [
      { name: 'Sarah M.', rating: 5, comment: 'My skin has never felt this soft, it\'s like an invisible veil of hydration that stays all day.', verified: true },
      { name: 'Janice L.', rating: 5, comment: 'Worth every rupee. The texture is extremely light and the results are visible within 3 days. Already ordered my second bottle!', verified: true }
    ],
    bestSeller: true
  },
  {
    id: 'lumi-02',
    name: 'Gentle Foaming Cleanser',
    category: 'Facewash',
    price: 649,
    rating: 4.7,
    reviewsCount: 88,
    stock: 15,
    description: 'A luxurious, cloud-like foam cleanser that sweeps away impurities, sebum, and pollution while preserving your skin\'s natural protective moisture barrier.',
    sizes: ['100ml', '200ml'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    science: [
      { title: 'Hydrating Amino Acids', text: 'Gentle surfactants derived from coconut amino acids that cleanse deeply without stripping skin lipids.' },
      { title: 'Rosewater & Chamomile', text: 'Calms redness and reduces skin stress, leaving a fresh and floral sensory experience.' }
    ],
    reviews: [
      { name: 'Priya S.', rating: 5, comment: 'Super gentle on my sensitive skin. No tight feeling after washing!', verified: true }
    ],
    bestSeller: true
  },
  {
    id: 'lumi-03',
    name: 'Cloud Ceramide Cream',
    category: 'Moisturizer',
    price: 950,
    rating: 4.8,
    reviewsCount: 145,
    stock: 4,
    description: 'An ultra-nourishing whip moisturizer infused with a triple-ceramide complex and low-molecular hyaluronic acid to restore plumping hydration and bounce.',
    sizes: ['50g', '100g'],
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80',
    science: [
      { title: 'Triple Ceramide NP/AP/EOP', text: 'Replenishes essential skin lipids, sealing cracks in the cellular barrier and enhancing defense against pollution.' },
      { title: 'Gotu Kola (Centella)', text: 'Ancient Ayurvedic herb that stimulates collagen synthesis and accelerates skin healing.' }
    ],
    reviews: [
      { name: 'Anjali M.', rating: 5, comment: 'This cream is a savior for dry winters. Feels like a protective glove.', verified: true }
    ],
    bestSeller: true
  },
  {
    id: 'lumi-04',
    name: 'Daily Hydrashield SPF 50+',
    category: 'Sunscreen',
    price: 780,
    rating: 4.6,
    reviewsCount: 92,
    stock: 22,
    description: 'An invisible, lightweight gel sunscreen that provides broad-spectrum protection against UVA/UVB and blue light. Zero white cast, matte finish, dew-like glow.',
    sizes: ['50ml'],
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
    science: [
      { title: 'New-Age UV Filters', text: 'Photostable organic filters providing reliable, non-irritating SPF and PA++++ defense.' },
      { title: 'Niacinamide (Vitamin B3)', text: 'Controls sebum production and brightens skin, preventing sun-induced hyperpigmentation.' }
    ],
    reviews: [
      { name: 'Rohit K.', rating: 5, comment: 'Finally! A sunscreen that doesn\'t make me sweat or look like a ghost.', verified: true }
    ],
    bestSeller: false
  },
  {
    id: 'lumi-05',
    name: 'Nectar Lip Balm',
    category: 'Lip Balm',
    price: 380,
    rating: 4.8,
    reviewsCount: 110,
    stock: 30,
    description: 'A glossy, nourishing lip butter infused with shea butter and wild rose oil. Instantly heals dry, chapped lips with a soft, natural pink tint.',
    sizes: ['10g'],
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80',
    science: [
      { title: 'Shea Butter & Vitamin E', text: 'Ultra-emollient lipids that form a protective barrier, keeping lips soft for up to 12 hours.' }
    ],
    reviews: [],
    bestSeller: false
  },
  {
    id: 'lumi-06',
    name: 'Crushed Velvet Lipstick',
    category: 'Lipstick',
    price: 890,
    rating: 4.9,
    reviewsCount: 75,
    stock: 12,
    description: 'A weightless matte lipstick that delivers high-impact, long-wearing color. Glides on smoothly and stays comfortable without drying the lips.',
    sizes: ['Standard'],
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
    science: [
      { title: 'Hyaluronic Micro-spheres', text: 'Locks in moisture inside lip cells, preventing feathering or flaking over time.' }
    ],
    reviews: [],
    bestSeller: false
  },
  {
    id: 'lumi-07',
    name: 'Silk Essence Hair Serum',
    category: 'Hair Care',
    price: 1150,
    rating: 4.5,
    reviewsCount: 64,
    stock: 10,
    description: 'An advanced smoothing oil-serum that tames frizz, seals split ends, and leaves hair with a premium glass-like gloss. Formulated with argan and macadamia oils.',
    sizes: ['50ml', '100ml'],
    image: 'https://images.unsplash.com/photo-1527799822367-4786783f9c7b?w=600&auto=format&fit=crop&q=80',
    science: [
      { title: 'Cold-Pressed Argan Oil', text: 'Rich in fatty acids and vitamin E, repairs thermal damage and restores hair elasticity.' }
    ],
    reviews: [],
    bestSeller: false
  },
  {
    id: 'lumi-08',
    name: 'Nourishing Satin Body Wash',
    category: 'Body Wash',
    price: 590,
    rating: 4.7,
    reviewsCount: 43,
    stock: 25,
    description: 'An indulgent, cream-to-oil body cleanser that hydrates as it cleanses. Enriched with almond milk and wild vanilla pod extract.',
    sizes: ['250ml'],
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80',
    science: [
      { title: 'Almond Lipids', text: 'Deeply conditions skin cells during shower, maintaining hydration levels post-wash.' }
    ],
    reviews: [],
    bestSeller: false
  },
  {
    id: 'lumi-09',
    name: 'The Bridal Glow Kit',
    category: 'Beauty Kits',
    price: 2490,
    rating: 5.0,
    reviewsCount: 52,
    stock: 5,
    description: 'A curated ritual containing our Silk Serum (30ml), Cloud Cream (50g), and Foaming Cleanser (100ml) in an elegant vegan-leather cosmetic pouch.',
    sizes: ['Deluxe Kit'],
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    science: [
      { title: 'Combined Glow Synergy', text: 'Three steps designed to work in synergy, prepping, restoring, and locking in your natural bridal glow.' }
    ],
    reviews: [],
    bestSeller: true
  },
  {
    id: 'lumi-10',
    name: 'Radiance Cushion Foundation',
    category: 'Makeup',
    price: 1450,
    rating: 4.8,
    reviewsCount: 39,
    stock: 8,
    description: 'A lightweight foundation cushion that provides buildable medium coverage with a skin-like luminous finish. Protects with SPF 30 PA++.',
    sizes: ['Light Nude', 'Honey Glow', 'Warm Almond'],
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    science: [
      { title: 'Flexible Pigment Mesh', text: 'Adapts to facial movements, preventing creasing, cracking, or setting into fine lines.' }
    ],
    reviews: [],
    bestSeller: false
  }
];

const INITIAL_CHARGES = {
  deliveryEnabled: true,
  deliveryCharge: 99,
  deliveryThreshold: 999, // Free above this
  handlingEnabled: true,
  handlingFee: 29,
  packagingEnabled: true,
  packagingFee: 19,
  codEnabled: true,
  codFee: 49,
  festivalEnabled: true,
  festivalFee: 15,
  taxRate: 18 // GST percentage
};

const INITIAL_COUPONS = [
  { code: 'LUMIERE15', type: 'percentage', value: 15, active: true },
  { code: 'GLOW20', type: 'percentage', value: 20, active: true },
  { code: 'WELCOME100', type: 'fixed', value: 100, active: true }
];

// Address Validation Data: Indian States & Districts
export const INDIAN_STATES_DISTRICTS = {
  'Maharashtra': ['Mumbai', 'Pune', 'Thane', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  'Uttar Pradesh': ['Noida', 'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Ghaziabad'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panchkula', 'Ambala', 'Karnal'],
  'West Bengal': ['Kolkata', 'Howrah', 'Darjeeling', 'Asansol', 'Siliguri']
};

export const AppProvider = ({ children }) => {
  // Database States loaded from LocalStorage
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('lumi_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [charges, setCharges] = useState(() => {
    const saved = localStorage.getItem('lumi_charges');
    return saved ? JSON.parse(saved) : INITIAL_CHARGES;
  });

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('lumi_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('lumi_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Client Session States
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('lumi_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('lumi_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lumi_user');
    // Pre-populate with a demo user
    return saved ? JSON.parse(saved) : {
      name: 'Sarah Jenkins',
      email: 'sarah.j@lumiere.in',
      phone: '9876543210',
      addresses: [
        {
          id: 'addr-1',
          tag: 'Home',
          name: 'Sarah Jenkins',
          addressLine: 'Flat 4B, Rosewood Terrace, Sector 62',
          district: 'Noida',
          state: 'Uttar Pradesh',
          pincode: '201301',
          phone: '9876543210',
          isDefault: true
        }
      ]
    };
  });

  const [activeCoupon, setActiveCoupon] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  // Sync state to local storage on changes
  useEffect(() => {
    localStorage.setItem('lumi_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lumi_charges', JSON.stringify(charges));
  }, [charges]);

  useEffect(() => {
    localStorage.setItem('lumi_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('lumi_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lumi_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lumi_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('lumi_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Cart actions
  const addToCart = (product, quantity = 1, size = null) => {
    setCart((prev) => {
      const selectedSize = size || (product.sizes ? product.sizes[0] : 'Default');
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

  const removeFromCart = (productId, size) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateCartQuantity = (productId, size, quantity) => {
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
  };

  // Wishlist actions
  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Order actions
  const createOrder = (orderData) => {
    const newOrder = {
      id: `LM${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: orderData.items,
      address: orderData.address,
      paymentMethod: orderData.paymentMethod,
      chargesBreakdown: orderData.chargesBreakdown,
      couponApplied: orderData.couponApplied,
      status: 'Placed', // Placed, Confirmed, Packed, Shipped, Out for Delivery, Delivered
      paymentStatus: orderData.paymentMethod === 'COD' ? 'Verified' : 'Pending', // Pending, Verified, Failed
      screenshotUrl: orderData.screenshotUrl || null,
      eta: '2-3 Days'
    };
    
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
  };

  const updateOrderPaymentStatus = (orderId, newPaymentStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          // Auto update shipping status to Confirmed if payment is verified
          const updatedStatus = newPaymentStatus === 'Verified' && order.status === 'Placed' ? 'Confirmed' : order.status;
          return { ...order, paymentStatus: newPaymentStatus, status: updatedStatus };
        }
        return order;
      })
    );
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Pricing calculation utility
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    // Delivery calculations
    let deliveryCharge = 0;
    if (charges.deliveryEnabled) {
      if (subtotal > 0 && subtotal < charges.deliveryThreshold) {
        deliveryCharge = charges.deliveryCharge;
      }
    }

    // Additional charges
    const handlingFee = charges.handlingEnabled ? charges.handlingFee : 0;
    const packagingFee = charges.packagingEnabled ? charges.packagingFee : 0;
    const festivalFee = charges.festivalEnabled ? charges.festivalFee : 0;

    // Discount calculations
    let discount = 0;
    if (activeCoupon) {
      if (activeCoupon.type === 'percentage') {
        discount = Math.round((subtotal * activeCoupon.value) / 100);
      } else if (activeCoupon.type === 'fixed') {
        discount = Math.min(activeCoupon.value, subtotal);
      }
    }

    const subtotalAfterDiscount = Math.max(0, subtotal - discount);

    // Apply GST (Already included in pricing, but displayed for clarity)
    const gstIncluded = Math.round((subtotalAfterDiscount * charges.taxRate) / (100 + charges.taxRate));

    return {
      subtotal,
      discount,
      deliveryCharge,
      handlingFee,
      packagingFee,
      festivalFee,
      gstIncluded,
      total: subtotalAfterDiscount + deliveryCharge + handlingFee + packagingFee + festivalFee
    };
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        charges,
        setCharges,
        coupons,
        setCoupons,
        orders,
        setOrders,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        currentUser,
        setCurrentUser,
        activeCoupon,
        setActiveCoupon,
        currentPage,
        setCurrentPage,
        selectedProductId,
        setSelectedProductId,
        trackingOrderId,
        setTrackingOrderId,
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        deleteOrder,
        calculateTotals
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
