import fs from 'fs';
import path from 'path';

// Define DB File Path for local persistence fallback
const DB_FILE_PATH = path.join(process.cwd(), 'lumi_database.json');

// Interface Definitions
export interface Address {
  id: string;
  tag: string;
  name: string;
  addressLine: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string; // bcrypt hash
  role: 'Super Admin' | 'Admin' | 'Staff' | 'Customer';
  addresses: Address[];
  created_at: string;
}

export interface ProductSize {
  id: string;
  label: string; // e.g. "50ml", "100ml", "200ml", "15ml", "30ml", "60ml", "25g", "50g", "100g"
  price: number;
  discount_price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discount_price: number;
  stock: number;
  image: string;
  ingredients: string[];
  bestSeller?: boolean;
  science?: { title: string; text: string }[];
  rating?: number;
  reviewsCount?: number;
  created_at: string;
  tags?: string[];
  hidden?: boolean;
  sizes?: ProductSize[];
}


export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedBuyer: boolean;
  created_at: string;
}


export interface OrderItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface ChargesBreakdown {
  mrpSubtotal: number;
  productDiscount: number;
  sellingSubtotal: number;
  discount: number;
  deliveryCharge: number;
  codFee: number;
  gstIncluded: number;
  total: number;
  customFees: { name: string; amount: number }[];
  subtotal?: number;
  handlingFee?: number;
  packagingFee?: number;
  festivalFee?: number;
}


export interface Order {
  order_id: string; // ORD-IND-2026-XXXX
  user_id: string;
  products: OrderItem[];
  subtotal: number;
  delivery_charge: number;
  handling_charge: number;
  total_amount: number;
  payment_method: 'UPI' | 'COD';
  payment_status: 'Pending' | 'Verified' | 'Failed';
  order_status: 'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  shipping_address: Address;
  chargesBreakdown: ChargesBreakdown;
  couponApplied: string | null;
  screenshotUrl?: string | null;
  created_at: string;
}

export interface Payment {
  payment_id: string;
  order_id: string;
  screenshot: string; // base64 or URL
  verification_status: 'Pending' | 'Approved' | 'Rejected';
  verified_by: string | null; // admin user_id
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  query: string;
  image: string;
  banner: string;
  description: string;
}

export interface CustomFee {
  id: string;
  name: string;
  amount: number;
  enabled: boolean;
}

export interface ChargesConfig {
  deliveryEnabled: boolean;
  deliveryCharge: number;
  deliveryThreshold: number;
  handlingEnabled?: boolean;
  handlingFee?: number;
  packagingEnabled?: boolean;
  packagingFee?: number;
  festivalEnabled?: boolean;
  festivalFee?: number;
  codEnabled: boolean;
  codFee: number;
  taxRate: number;
  customFees?: CustomFee[];
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
}

// Initial seed data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'lumi-01',
    name: 'The Silk Serum',
    description: 'Experience the ultimate skin refinement with our proprietary bio-silk protein complex. A weightless, transformative treatment that blurs imperfections and restores natural radiance overnight.',
    category: 'Serum',
    price: 1280,
    discount_price: 1100,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Bio-Silk Protein Network', 'Sugarcane-Derived Squalane', 'Rosemary Oil'],
    bestSeller: true,
    rating: 4.9,
    reviewsCount: 124,
    science: [
      { title: 'Bio-Silk Complex', text: 'A premium network of silk-derived proteins that mimic skin structure, locking in moisture and active botanicals.' },
      { title: 'Vegan Squalane', text: 'Sugarcane-derived squalane deeply hydrates, softens skin texture, and helps reinforce the lipid barrier without clogging.' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-02',
    name: 'Gentle Foaming Cleanser',
    description: 'A luxurious, cloud-like foam cleanser that sweeps away impurities, sebum, and pollution while preserving your skin\'s natural protective moisture barrier.',
    category: 'Facewash',
    price: 649,
    discount_price: 599,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Coconut Amino Acids', 'Rosewater Distillate', 'Chamomile Leaf Extract'],
    bestSeller: true,
    rating: 4.7,
    reviewsCount: 88,
    science: [
      { title: 'Hydrating Amino Acids', text: 'Gentle surfactants derived from coconut amino acids that cleanse deeply without stripping skin lipids.' },
      { title: 'Rosewater & Chamomile', text: 'Calms redness and reduces skin stress, leaving a fresh and floral sensory experience.' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-03',
    name: 'Cloud Ceramide Cream',
    description: 'An ultra-nourishing whip moisturizer infused with a triple-ceramide complex and low-molecular hyaluronic acid to restore plumping hydration and bounce.',
    category: 'Moisturizer',
    price: 950,
    discount_price: 850,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Ceramide NP/AP/EOP', 'Centella Asiatica (Gotu Kola)', 'Hyaluronic Acid'],
    bestSeller: true,
    rating: 4.8,
    reviewsCount: 145,
    science: [
      { title: 'Triple Ceramide NP/AP/EOP', text: 'Replenishes essential skin lipids, sealing cracks in the cellular barrier and enhancing defense against pollution.' },
      { title: 'Gotu Kola (Centella)', text: 'Ancient Ayurvedic herb that stimulates collagen synthesis and accelerates skin healing.' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-04',
    name: 'Daily Hydrashield SPF 50+',
    description: 'An invisible, lightweight gel sunscreen that provides broad-spectrum protection against UVA/UVB and blue light. Zero white cast, matte finish, dew-like glow.',
    category: 'Sunscreen',
    price: 780,
    discount_price: 720,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Broad Spectrum UV Filters', 'Niacinamide', 'Aloe Vera Leaf Gel'],
    bestSeller: false,
    rating: 4.6,
    reviewsCount: 92,
    science: [
      { title: 'New-Age UV Filters', text: 'Photostable organic filters providing reliable, non-irritating SPF and PA++++ defense.' },
      { title: 'Niacinamide (Vitamin B3)', text: 'Controls sebum production and brightens skin, preventing sun-induced hyperpigmentation.' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-05',
    name: 'Nectar Lip Balm',
    description: 'A glossy, nourishing lip butter infused with shea butter and wild rose oil. Instantly heals dry, chapped lips with a soft, natural pink tint.',
    category: 'Lip Care',
    price: 380,
    discount_price: 340,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Organic Shea Butter', 'Cold-Pressed Wild Rose Oil', 'Vitamin E'],
    bestSeller: false,
    rating: 4.8,
    reviewsCount: 110,
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-06',
    name: 'Crushed Velvet Lipstick',
    description: 'A weightless matte lipstick that delivers high-impact, long-wearing color. Glides on smoothly and stays comfortable without drying the lips.',
    category: 'Makeup',
    price: 890,
    discount_price: 790,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Hyaluronic Acid Spheres', 'Organic Sweet Almond Oil'],
    bestSeller: false,
    rating: 4.9,
    reviewsCount: 75,
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-07',
    name: 'Silk Essence Hair Oil',
    description: 'An advanced smoothing oil-serum that tames frizz, seals split ends, and leaves hair with a premium glass-like gloss. Formulated with argan and macadamia oils.',
    category: 'Hair Care',
    price: 1150,
    discount_price: 990,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1527799822367-4786783f9c7b?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Cold-Pressed Argan Oil', 'Macadamia Nut Kernel Oil'],
    bestSeller: false,
    rating: 4.5,
    reviewsCount: 64,
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-08',
    name: 'Nourishing Satin Body Wash',
    description: 'An indulgent, cream-to-oil body cleanser that hydrates as it cleanses. Enriched with almond milk and wild vanilla pod extract.',
    category: 'Body Wash',
    price: 590,
    discount_price: 520,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Sweet Almond Lipids', 'Madagascar Vanilla Pods'],
    bestSeller: false,
    rating: 4.7,
    reviewsCount: 43,
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-09',
    name: 'Charcoal Detox Cleanser',
    description: 'A deep-cleansing facial wash formulated with activated bamboo charcoal and organic tea tree oil. Sweeps away excess sebum, unclogs pores, and prevents blemishes.',
    category: 'Facewash',
    price: 590,
    discount_price: 490,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Activated Bamboo Charcoal', 'Tea Tree Extract', 'Salicylic Acid (0.5%)'],
    bestSeller: false,
    rating: 4.6,
    reviewsCount: 38,
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-10',
    name: 'Ultra Light Matte SPF 50+',
    description: 'An advanced ultra-sheer sunscreen fluid that shields skin from UVA/UVB rays and infra-red radiation. Super dry-touch, non-comedogenic, and water-resistant.',
    category: 'Sunscreen',
    price: 699,
    discount_price: 620,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1620917670397-dc7bc40e7230?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Tinosorb S/M', 'Hyaluronic Acid', 'Witch Hazel Extract'],
    bestSeller: false,
    rating: 4.8,
    reviewsCount: 52,
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-11',
    name: '10% Niacinamide Clarifying Serum',
    description: 'A powerful blemish-control serum featuring high-purity niacinamide and zinc PCA. Evens skin tone, refines pores, and enhances general barrier resilience.',
    category: 'Serum',
    price: 1199,
    discount_price: 999,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Niacinamide (10%)', 'Zinc PCA (1%)', 'Centella Asiatica Extract'],
    bestSeller: true,
    rating: 4.9,
    reviewsCount: 77,
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-12',
    name: 'Hydra-Bounce Water Jelly',
    description: 'A weightless oil-free moisturizer formulated with mineral-rich thermal water and double hyaluronic acid. Plumps up skin, locks in hydration for 72 hours.',
    category: 'Moisturizer',
    price: 850,
    discount_price: 750,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Mineral Thermal Water', 'Hyaluronic Acid', 'Cucumber Extract'],
    bestSeller: true,
    rating: 4.7,
    reviewsCount: 63,
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-13',
    name: 'Roseate Nourishing Lip Oil',
    description: 'A luxurious lip oil infused with sweet almond lipids and organic honey nectar. Restores moisture, provides a high-gloss finish, and leaves a subtle rosy tint.',
    category: 'Lip Care',
    price: 420,
    discount_price: 380,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Sweet Almond Lipids', 'Honey Nectar', 'Rose Extract'],
    bestSeller: false,
    rating: 4.8,
    reviewsCount: 45,
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-14',
    name: 'Argan Nourishing Hair Mask',
    description: 'An intensive conditioning treatment that repairs dry, damaged hair. Penetrates deep into the hair shafts to lock in moisture, reduce frizz, and add silkiness.',
    category: 'Hair Care',
    price: 950,
    discount_price: 850,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Pure Argan Oil', 'Hydrolyzed Wheat Proteins', 'Panthenol (Vitamin B5)'],
    bestSeller: false,
    rating: 4.6,
    reviewsCount: 39,
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-15',
    name: 'Luminous Liquid Highlighter',
    description: 'A dynamic liquid illuminator that delivers a glass-skin glow. Smooth, blendable formula containing micro-pearl pigments to catch light at every angle.',
    category: 'Makeup',
    price: 1100,
    discount_price: 950,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Micro-Pearl Pigments', 'Vitamin C', 'Coconut Alkanes'],
    bestSeller: true,
    rating: 4.7,
    reviewsCount: 56,
    created_at: new Date().toISOString()
  },
  {
    id: 'lumi-16',
    name: 'Shea Butter Rich Body Polish',
    description: 'A luxurious foaming body scrub containing fine walnut shell particles and organic shea butter. Gently exfoliates dead cells while deeply nourishing skin.',
    category: 'Body Wash',
    price: 650,
    discount_price: 580,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Shea Butter', 'Crushed Walnut Shells', 'Sweet Almond Oil'],
    bestSeller: false,
    rating: 4.8,
    reviewsCount: 29,
    created_at: new Date().toISOString()
  }
];

const DEFAULT_CHARGES: ChargesConfig = {
  deliveryEnabled: true,
  deliveryCharge: 99,
  deliveryThreshold: 999,
  handlingEnabled: true,
  handlingFee: 29,
  packagingEnabled: true,
  packagingFee: 19,
  codEnabled: true,
  codFee: 49,
  festivalEnabled: true,
  festivalFee: 15,
  taxRate: 18
};

const DEFAULT_COUPONS: Coupon[] = [
  { code: 'LUMIERE15', type: 'percentage', value: 15, active: true },
  { code: 'GLOW20', type: 'percentage', value: 20, active: true },
  { code: 'WELCOME100', type: 'fixed', value: 100, active: true }
];

// Seed Admin User (Hashed password for 'Admin@123')
// Seeding Customer User (Hashed password for 'User@123')
const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Lumiere Admin',
    email: 'admin@beautybrand.com',
    phone: '9876543210',
    passwordHash: '$2b$10$Wi2SgKMzORAPj4voPxfHqu.DdjGM3s4f1eSTPmaSOgAuYMpQixd7G',
    role: 'Super Admin',
    addresses: [],
    created_at: new Date().toISOString()
  },
  {
    id: 'usr-customer',
    name: 'Sarah Jenkins',
    email: 'user@beautybrand.com',
    phone: '9876543211',
    passwordHash: '$2b$10$R8awEpd2MQuQnCQj4Aah2Oy4MlxpRQnuw2R0zbEkidH5U7elFFqZa',
    role: 'Customer',
    addresses: [
      {
        id: 'addr-1',
        tag: 'Home',
        name: 'Sarah Jenkins',
        addressLine: 'Flat 4B, Rosewood Terrace, Sector 62',
        district: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        phone: '9876543211',
        isDefault: true
      }
    ],
    created_at: new Date().toISOString()
  }
];


const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'lumi-01',
    userId: 'usr-customer',
    userName: 'Sarah Jenkins',
    rating: 5,
    comment: 'Absolutely stunning serum! My skin feels like pure silk after just three days of use. Extremely lightweight and fast-absorbing.',
    verifiedBuyer: true,
    created_at: '2026-06-01T12:00:00.000Z'
  },
  {
    id: 'rev-02',
    productId: 'lumi-01',
    userId: 'usr-admin',
    userName: 'Lumiere Admin',
    rating: 4,
    comment: 'Very hydrating, and smells lovely. A bit expensive but definitely worth the price for premium results.',
    verifiedBuyer: true,
    created_at: '2026-06-05T15:30:00.000Z'
  },
  {
    id: 'rev-03',
    productId: 'lumi-02',
    userId: 'usr-customer',
    userName: 'Sarah Jenkins',
    rating: 5,
    comment: "Incredibly gentle on my sensitive skin. Doesn't leave my face dry or tight like other cleansers. Perfect daily facewash!",
    verifiedBuyer: true,
    created_at: '2026-06-02T10:15:00.000Z'
  },
  {
    id: 'rev-04',
    productId: 'lumi-03',
    userId: 'usr-customer',
    userName: 'Sarah Jenkins',
    rating: 5,
    comment: 'Highly moisturizing and whipped cream texture is amazing. Rebuilt my skin barrier after a harsh peel.',
    verifiedBuyer: true,
    created_at: '2026-06-03T11:45:00.000Z'
  },
  {
    id: 'rev-05',
    productId: 'lumi-03',
    userId: 'usr-admin',
    userName: 'Lumiere Admin',
    rating: 4,
    comment: 'Great moisturizer for night time. Keeps skin glowing and hydrated till next morning.',
    verifiedBuyer: true,
    created_at: '2026-06-06T14:20:00.000Z'
  }
];

// JSON Database operations Helper
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      const db = {
        users: DEFAULT_USERS,
        products: INITIAL_PRODUCTS,
        orders: [],
        payments: [],
        charges: {
          ...DEFAULT_CHARGES,
          customFees: [
            { id: 'handling', name: 'Handling Fee', amount: 29, enabled: true },
            { id: 'packaging', name: 'Packaging Fee', amount: 19, enabled: true },
            { id: 'festival', name: 'Festival Surcharge', amount: 15, enabled: true }
          ]
        },
        coupons: DEFAULT_COUPONS,
        reviews: DEFAULT_REVIEWS,
        categories: [
          { id: 'cat-1', name: 'Serums', query: 'Serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&auto=format&fit=crop&q=80', description: 'Advanced dermatological serums for active skin repair.' },
          { id: 'cat-2', name: 'Cleansers', query: 'Facewash', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80', description: 'Gentle pH-balanced face washes and cleansers.' },
          { id: 'cat-3', name: 'Moisturizers', query: 'Moisturizer', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=1200&auto=format&fit=crop&q=80', description: 'Barrier-building whips and deep moisturizers.' },
          { id: 'cat-4', name: 'Sun protection', query: 'Sunscreen', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&auto=format&fit=crop&q=80', description: 'Zero white cast, broad-spectrum UV defense.' },
          { id: 'cat-5', name: 'Lip Care', query: 'Lip Care', image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=1200&auto=format&fit=crop&q=80', description: 'Hydrating butter glosses and treatment balms.' },
          { id: 'cat-6', name: 'Hair Care', query: 'Hair Care', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1200&auto=format&fit=crop&q=80', description: 'Revitalizing shampoos, conditioners, and masks.' },
          { id: 'cat-7', name: 'Makeup', query: 'Makeup', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&auto=format&fit=crop&q=80', description: 'Premium formulations blending skincare and color.' },
          { id: 'cat-8', name: 'Body Wash', query: 'Body Wash', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=1200&auto=format&fit=crop&q=80', description: 'Nourishing cleansers for an everyday luxury shower.' }
        ]
      };
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
      return db;
    }
    const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    let dirty = false;

    // Migration: make sure reviews array exists
    if (!parsed.reviews) {
      parsed.reviews = DEFAULT_REVIEWS;
      dirty = true;
    }

    // Migration: make sure customFees exist in charges
    if (parsed.charges && !parsed.charges.customFees) {
      parsed.charges.customFees = [
        { id: 'handling', name: 'Handling Fee', amount: parsed.charges.handlingFee ?? 29, enabled: parsed.charges.handlingEnabled ?? true },
        { id: 'packaging', name: 'Packaging Fee', amount: parsed.charges.packagingFee ?? 19, enabled: parsed.charges.packagingEnabled ?? true },
        { id: 'festival', name: 'Festival Surcharge', amount: parsed.charges.festivalFee ?? 15, enabled: parsed.charges.festivalEnabled ?? true }
      ];
      dirty = true;
    }

    // Migration: make sure categories array exists
    if (!parsed.categories) {
      parsed.categories = [
        { id: 'cat-1', name: 'Serums', query: 'Serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&auto=format&fit=crop&q=80', description: 'Advanced dermatological serums for active skin repair.' },
        { id: 'cat-2', name: 'Cleansers', query: 'Facewash', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80', description: 'Gentle pH-balanced face washes and cleansers.' },
        { id: 'cat-3', name: 'Moisturizers', query: 'Moisturizer', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=1200&auto=format&fit=crop&q=80', description: 'Barrier-building whips and deep moisturizers.' },
        { id: 'cat-4', name: 'Sun protection', query: 'Sunscreen', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&auto=format&fit=crop&q=80', description: 'Zero white cast, broad-spectrum UV defense.' },
        { id: 'cat-5', name: 'Lip Care', query: 'Lip Care', image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=1200&auto=format&fit=crop&q=80', description: 'Hydrating butter glosses and treatment balms.' },
        { id: 'cat-6', name: 'Hair Care', query: 'Hair Care', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=1200&auto=format&fit=crop&q=80', description: 'Revitalizing shampoos, conditioners, and masks.' },
        { id: 'cat-7', name: 'Makeup', query: 'Makeup', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&auto=format&fit=crop&q=80', description: 'Premium formulations blending skincare and color.' },
        { id: 'cat-8', name: 'Body Wash', query: 'Body Wash', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=120&auto=format&fit=crop&q=80', banner: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=1200&auto=format&fit=crop&q=80', description: 'Nourishing cleansers for an everyday luxury shower.' }
      ];
      dirty = true;
    }

    // Migration: ensure all 16 initial products are in parsed products list
    if (parsed.products) {
      INITIAL_PRODUCTS.forEach((prod) => {
        const exists = parsed.products.some((p: any) => p.id === prod.id);
        if (!exists) {
          parsed.products.push(prod);
          dirty = true;
        }
      });
    }

    // Migration: ensure sizes array is populated for variants
    if (parsed.products) {
      parsed.products.forEach((prod: any) => {
        if (!prod.sizes || prod.sizes.length === 0) {
          const categoryLower = (prod.category || '').toLowerCase();
          const basePrice = prod.price || 500;
          const baseDiscount = prod.discount_price || basePrice;
          const baseStock = prod.stock || 10;
          
          if (categoryLower.includes('serum')) {
            prod.sizes = [
              { id: prod.id + '-15ml', label: '15ml', price: Math.round(basePrice * 0.6), discount_price: Math.round(baseDiscount * 0.6), stock: baseStock },
              { id: prod.id + '-30ml', label: '30ml', price: basePrice, discount_price: baseDiscount, stock: baseStock },
              { id: prod.id + '-60ml', label: '60ml', price: Math.round(basePrice * 1.6), discount_price: Math.round(baseDiscount * 1.6), stock: baseStock }
            ];
            dirty = true;
          } else if (categoryLower.includes('wash') || categoryLower.includes('cleanser') || categoryLower.includes('facewash')) {
            prod.sizes = [
              { id: prod.id + '-50ml', label: '50ml', price: Math.round(basePrice * 0.6), discount_price: Math.round(baseDiscount * 0.6), stock: baseStock },
              { id: prod.id + '-100ml', label: '100ml', price: basePrice, discount_price: baseDiscount, stock: baseStock },
              { id: prod.id + '-200ml', label: '200ml', price: Math.round(basePrice * 1.6), discount_price: Math.round(baseDiscount * 1.6), stock: baseStock }
            ];
            dirty = true;
          } else if (categoryLower.includes('screen') || categoryLower.includes('sun')) {
            prod.sizes = [
              { id: prod.id + '-25g', label: '25g', price: Math.round(basePrice * 0.6), discount_price: Math.round(baseDiscount * 0.6), stock: baseStock },
              { id: prod.id + '-50g', label: '50g', price: basePrice, discount_price: baseDiscount, stock: baseStock },
              { id: prod.id + '-100g', label: '100g', price: Math.round(basePrice * 1.6), discount_price: Math.round(baseDiscount * 1.6), stock: baseStock }
            ];
            dirty = true;
          } else if (categoryLower.includes('moisturizer') || categoryLower.includes('cream')) {
            prod.sizes = [
              { id: prod.id + '-50g', label: '50g', price: basePrice, discount_price: baseDiscount, stock: baseStock },
              { id: prod.id + '-100g', label: '100g', price: Math.round(basePrice * 1.6), discount_price: Math.round(baseDiscount * 1.6), stock: baseStock }
            ];
            dirty = true;
          } else if (categoryLower.includes('lip')) {
            prod.sizes = [
              { id: prod.id + '-5g', label: '5g', price: Math.round(basePrice * 0.6), discount_price: Math.round(baseDiscount * 0.6), stock: baseStock },
              { id: prod.id + '-10g', label: '10g', price: basePrice, discount_price: baseDiscount, stock: baseStock }
            ];
            dirty = true;
          } else if (categoryLower.includes('hair') || categoryLower.includes('body')) {
            prod.sizes = [
              { id: prod.id + '-100ml', label: '100ml', price: Math.round(basePrice * 0.6), discount_price: Math.round(baseDiscount * 0.6), stock: baseStock },
              { id: prod.id + '-250ml', label: '250ml', price: basePrice, discount_price: baseDiscount, stock: baseStock }
            ];
            dirty = true;
          } else {
            prod.sizes = [
              { id: prod.id + '-std', label: 'Standard', price: basePrice, discount_price: baseDiscount, stock: baseStock }
            ];
            dirty = true;
          }
        }
      });
    }

    if (dirty) {
      writeDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading filesystem DB, fallback to memory', err);
    return {
      users: DEFAULT_USERS,
      products: INITIAL_PRODUCTS,
      orders: [],
      payments: [],
      charges: DEFAULT_CHARGES,
      coupons: DEFAULT_COUPONS,
      reviews: DEFAULT_REVIEWS,
      categories: []
    };
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to filesystem DB', err);
  }
}

// Global DB Client Layer
export const db = {
  // USERS
  getUsers: async (): Promise<User[]> => {
    return readDb().users;
  },
  getUserByEmail: async (email: string): Promise<User | null> => {
    const users = readDb().users;
    return users.find((u: User) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  getUserById: async (id: string): Promise<User | null> => {
    const users = readDb().users;
    return users.find((u: User) => u.id === id) || null;
  },
  createUser: async (user: User): Promise<User> => {
    const data = readDb();
    data.users.push(user);
    writeDb(data);
    return user;
  },
  updateUserAddresses: async (userId: string, addresses: Address[]): Promise<User | null> => {
    const data = readDb();
    const idx = data.users.findIndex((u: User) => u.id === userId);
    if (idx > -1) {
      data.users[idx].addresses = addresses;
      writeDb(data);
      return data.users[idx];
    }
    return null;
  },

  // PRODUCTS
  getProducts: async (): Promise<Product[]> => {
    return readDb().products;
  },
  getProductById: async (id: string): Promise<Product | null> => {
    const products = readDb().products;
    return products.find((p: Product) => p.id === id) || null;
  },
  createProduct: async (product: Product): Promise<Product> => {
    const data = readDb();
    data.products.push(product);
    writeDb(data);
    return product;
  },
  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product | null> => {
    const data = readDb();
    const idx = data.products.findIndex((p: Product) => p.id === id);
    if (idx > -1) {
      data.products[idx] = { ...data.products[idx], ...productData };
      writeDb(data);
      return data.products[idx];
    }
    return null;
  },
  deleteProduct: async (id: string): Promise<boolean> => {
    const data = readDb();
    const len = data.products.length;
    data.products = data.products.filter((p: Product) => p.id !== id);
    writeDb(data);
    return data.products.length < len;
  },

  // ORDERS
  getOrders: async (): Promise<Order[]> => {
    return readDb().orders;
  },
  getOrderById: async (id: string): Promise<Order | null> => {
    const orders = readDb().orders;
    return orders.find((o: Order) => o.order_id === id) || null;
  },
  getOrdersByUserId: async (userId: string): Promise<Order[]> => {
    const orders = readDb().orders;
    return orders.filter((o: Order) => o.user_id === userId);
  },
  createOrder: async (order: Order): Promise<Order> => {
    const data = readDb();
    data.orders.unshift(order);
    
    // Deduct inventory stock levels
    order.products.forEach((item) => {
      const pIdx = data.products.findIndex((p: Product) => p.id === item.product.id);
      if (pIdx > -1) {
        data.products[pIdx].stock = Math.max(0, data.products[pIdx].stock - item.quantity);
      }
    });

    writeDb(data);
    return order;
  },
  updateOrderStatus: async (orderId: string, status: Order['order_status']): Promise<Order | null> => {
    const data = readDb();
    const idx = data.orders.findIndex((o: Order) => o.order_id === orderId);
    if (idx > -1) {
      data.orders[idx].order_status = status;
      writeDb(data);
      return data.orders[idx];
    }
    return null;
  },
  updateOrderPaymentStatus: async (orderId: string, paymentStatus: Order['payment_status']): Promise<Order | null> => {
    const data = readDb();
    const idx = data.orders.findIndex((o: Order) => o.order_id === orderId);
    if (idx > -1) {
      data.orders[idx].payment_status = paymentStatus;
      if (paymentStatus === 'Verified' && data.orders[idx].order_status === 'Placed') {
        data.orders[idx].order_status = 'Confirmed';
      }
      writeDb(data);
      return data.orders[idx];
    }
    return null;
  },
  deleteOrder: async (orderId: string): Promise<boolean> => {
    const data = readDb();
    const len = data.orders.length;
    data.orders = data.orders.filter((o: Order) => o.order_id !== orderId);
    writeDb(data);
    return data.orders.length < len;
  },

  // PAYMENTS (Screenshots metadata log)
  createPayment: async (payment: Payment): Promise<Payment> => {
    const data = readDb();
    data.payments.push(payment);
    writeDb(data);
    return payment;
  },
  getPayments: async (): Promise<Payment[]> => {
    return readDb().payments;
  },

  // CHARGES CONFIG
  getCharges: async (): Promise<ChargesConfig> => {
    return readDb().charges;
  },
  updateCharges: async (newCharges: ChargesConfig): Promise<ChargesConfig> => {
    const data = readDb();
    data.charges = newCharges;
    writeDb(data);
    return newCharges;
  },

  // COUPONS
  getCoupons: async (): Promise<Coupon[]> => {
    return readDb().coupons;
  },
  createCoupon: async (coupon: Coupon): Promise<Coupon> => {
    const data = readDb();
    data.coupons.push(coupon);
    writeDb(data);
    return coupon;
  },
  updateCoupons: async (coupons: Coupon[]): Promise<Coupon[]> => {
    const data = readDb();
    data.coupons = coupons;
    writeDb(data);
    return coupons;
  },

  // REVIEWS
  getReviewsByProductId: async (productId: string): Promise<Review[]> => {
    const reviews = readDb().reviews || [];
    return reviews.filter((r: Review) => r.productId === productId);
  },
  createOrUpdateReview: async (reviewData: Omit<Review, 'id' | 'created_at'>): Promise<Review> => {
    const data = readDb();
    if (!data.reviews) data.reviews = [];

    // Find if user already reviewed this product
    const idx = data.reviews.findIndex(
      (r: Review) => r.productId === reviewData.productId && r.userId === reviewData.userId
    );

    let finalReview: Review;
    if (idx > -1) {
      data.reviews[idx] = {
        ...data.reviews[idx],
        rating: reviewData.rating,
        comment: reviewData.comment,
        created_at: new Date().toISOString()
      };
      finalReview = data.reviews[idx];
    } else {
      const newReview: Review = {
        id: `rev-${Math.floor(Math.random() * 100000)}`,
        ...reviewData,
        created_at: new Date().toISOString()
      };
      data.reviews.unshift(newReview);
      finalReview = newReview;
    }

    // Recalculate average rating and review count
    const prodReviews = data.reviews.filter((r: Review) => r.productId === reviewData.productId);
    const totalRating = prodReviews.reduce((sum: number, r: Review) => sum + r.rating, 0);
    const avgRating = prodReviews.length > 0 ? Number((totalRating / prodReviews.length).toFixed(1)) : 0;

    const pIdx = data.products.findIndex((p: Product) => p.id === reviewData.productId);
    if (pIdx > -1) {
      data.products[pIdx].rating = avgRating;
      data.products[pIdx].reviewsCount = prodReviews.length;
    }

    writeDb(data);
    return finalReview;
  },

  // CATEGORIES
  getCategories: async (): Promise<Category[]> => {
    return readDb().categories || [];
  },
  createCategory: async (category: Category): Promise<Category> => {
    const data = readDb();
    if (!data.categories) data.categories = [];
    data.categories.push(category);
    writeDb(data);
    return category;
  },
  updateCategory: async (id: string, categoryData: Partial<Category>): Promise<Category | null> => {
    const data = readDb();
    if (!data.categories) data.categories = [];
    const idx = data.categories.findIndex((c: Category) => c.id === id);
    if (idx > -1) {
      data.categories[idx] = { ...data.categories[idx], ...categoryData };
      writeDb(data);
      return data.categories[idx];
    }
    return null;
  },
  deleteCategory: async (id: string): Promise<boolean> => {
    const data = readDb();
    if (!data.categories) data.categories = [];
    const len = data.categories.length;
    data.categories = data.categories.filter((c: Category) => c.id !== id);
    writeDb(data);
    return data.categories.length < len;
  }
};

export function getProductSizeDetails(product: Product, selectedSize: string) {
  if (product.sizes && product.sizes.length > 0) {
    const sizeOpt = product.sizes.find(s => s.label === selectedSize || s.id === selectedSize);
    if (sizeOpt) {
      return {
        price: sizeOpt.price,
        discount_price: sizeOpt.discount_price || sizeOpt.price,
        stock: sizeOpt.stock
      };
    }
  }
  return {
    price: product.price,
    discount_price: product.discount_price || product.price,
    stock: product.stock
  };
}
