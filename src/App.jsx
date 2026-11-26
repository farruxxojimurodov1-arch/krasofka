import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';

/* ============================================================================
   1. MAHSULOTLAR VA DO'KON BAZASI
   ============================================================================ */

export const CATEGORIES = ['All', 'Running', 'Street', 'Basketball', 'Limited'];

export const ALL_SIZES = [38, 39, 40, 41, 42, 43, 44, 45, 46];

export const PROMO_CODES = {
  VELOX20: { code: 'VELOX20', percent: 20, label: '20% VIP Chegirma' },
  DROP10: { code: 'DROP10', percent: 10, label: '10% Birinchi xarid' },
  CARBON30: { code: 'CARBON30', percent: 30, label: '30% Pro Club' },
};

export const SNEAKERS = [
  {
    id: 'velox-aeropulse-x1',
    sku: 'VLX-01-VLT',
    name: 'VELOX AeroPulse X1',
    category: 'Running',
    badge: 'LIMITED DROP',
    badgeType: 'limited',
    price: 265,
    oldPrice: 310,
    rating: 4.9,
    reviews: 342,
    weightGrams: 204,
    dropMm: 8,
    silhouette: 'aero',
    featured: true,
    tagline: 'Karbon plastinkali ultra-yengil marafon flagmani.',
    description:
      'AeroPulse X1 — ikki qatlamli azotli ko‘pik va to‘liq uzunlikdagi T800 karbon plastinkasi bilan jihozlangan. Har bir qadamda 94% gacha energiya qaytarish qobiliyatiga ega.',
    sizes: [39, 40, 41, 42, 43, 44, 45],
    specs: { lightness: 97, cushion: 93, stability: 89, energyReturn: 96 },
    colorways: [
      { id: 'volt-noir', name: 'Cyber Volt', primary: '#151923', secondary: '#262d3f', accent: '#c8ff00', sole: '#e9edf5', glow: '#c8ff00' },
      { id: 'arctic-cyan', name: 'Arctic Pulse', primary: '#111b27', secondary: '#1c3247', accent: '#00e5ff', sole: '#dff7ff', glow: '#00e5ff' },
      { id: 'crimson-core', name: 'Solar Crimson', primary: '#1e1218', secondary: '#381b28', accent: '#ff2e5b', sole: '#f5e8ec', glow: '#ff2e5b' },
    ],
  },
  {
    id: 'velox-phantom-gt',
    sku: 'VLX-02-PHM',
    name: 'VELOX Phantom GT-9',
    category: 'Street',
    badge: 'BESTSELLER',
    badgeType: 'hot',
    price: 220,
    oldPrice: null,
    rating: 4.8,
    reviews: 289,
    weightGrams: 278,
    dropMm: 10,
    silhouette: 'chunky',
    featured: true,
    tagline: 'Neo-Tokyo streetwear estetikasidagi futuristik siluet.',
    description:
      'Suv o‘tkazmaydigan Ripstop mato, reflektiv 3M chiziqlar va qalin geometrik taglik shahar ritmi uchun maksimal qulaylik yaratadi.',
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    specs: { lightness: 82, cushion: 95, stability: 94, energyReturn: 85 },
    colorways: [
      { id: 'obsidian-cyan', name: 'Obsidian Ghost', primary: '#14161c', secondary: '#2a2f3d', accent: '#00e5ff', sole: '#1d212b', glow: '#00e5ff' },
      { id: 'sand-amber', name: 'Dune Mirage', primary: '#352f28', secondary: '#564c3f', accent: '#ffaa00', sole: '#e7dfd3', glow: '#ffaa00' },
      { id: 'stealth-volt', name: 'Night Acid', primary: '#101217', secondary: '#1f232e', accent: '#c8ff00', sole: '#262b36', glow: '#c8ff00' },
    ],
  },
  {
    id: 'velox-apex-dunk',
    sku: 'VLX-03-APX',
    name: 'VELOX Apex Gravity Pro',
    category: 'Basketball',
    badge: 'PRO SERIES',
    badgeType: 'default',
    price: 245,
    oldPrice: 280,
    rating: 4.9,
    reviews: 196,
    weightGrams: 312,
    dropMm: 6,
    silhouette: 'hightop',
    featured: true,
    tagline: 'Yuqori sakrash va keskin burilishlar uchun 360° fiksatsiya.',
    description:
      'Baland yoqali kevlar-to‘r konstruksiyasi to‘piqni ishonchli himoya qiladi, ikki zonali Air-Pod kapsulalari zarbani yumshatadi.',
    sizes: [40, 41, 42, 43, 44, 45, 46],
    specs: { lightness: 79, cushion: 96, stability: 98, energyReturn: 91 },
    colorways: [
      { id: 'crimson-black', name: 'Infrared Dunk', primary: '#1c1216', secondary: '#3b1824', accent: '#ff2e5b', sole: '#f0f2f7', glow: '#ff2e5b' },
      { id: 'electric-violet', name: 'Hyper Violet', primary: '#1a1529', secondary: '#312452', accent: '#a855f7', sole: '#e8e4f5', glow: '#a855f7' },
      { id: 'gold-obsidian', name: 'Championship Gold', primary: '#18181b', secondary: '#2d2a24', accent: '#ffaa00', sole: '#f2ece1', glow: '#ffaa00' },
    ],
  },
  {
    id: 'velox-hyperion-zero',
    sku: 'VLX-04-HYP',
    name: 'VELOX Hyperion Zero',
    category: 'Limited',
    badge: 'ONLY 250 PAIRS',
    badgeType: 'limited',
    price: 340,
    oldPrice: null,
    rating: 5.0,
    reviews: 118,
    weightGrams: 192,
    dropMm: 7,
    silhouette: 'aero',
    featured: true,
    tagline: '3D bosib chiqarilgan panjarali taglikka ega kolleksiya modeli.',
    description:
      'Har bir jufti individual seriya raqami bilan ishlab chiqariladi. 3D-lattice midsole havo oqimini 360 darajada o‘tkazadi.',
    sizes: [40, 41, 42, 43, 44],
    specs: { lightness: 99, cushion: 94, stability: 92, energyReturn: 98 },
    colorways: [
      { id: 'titanium-volt', name: 'Titanium Volt', primary: '#232732', secondary: '#3c4354', accent: '#c8ff00', sole: '#181c26', glow: '#c8ff00' },
      { id: 'liquid-silver', name: 'Liquid Chrome', primary: '#2e3440', secondary: '#525c70', accent: '#38bdf8', sole: '#d8dee9', glow: '#38bdf8' },
      { id: 'plasma-pink', name: 'Plasma Core', primary: '#1d1424', secondary: '#3a224a', accent: '#f43f5e', sole: '#17121c', glow: '#f43f5e' },
    ],
  },
  {
    id: 'velox-stratos-run',
    sku: 'VLX-05-STR',
    name: 'VELOX Stratos Knit 4',
    category: 'Running',
    badge: 'NEW 2026',
    badgeType: 'default',
    price: 185,
    oldPrice: 215,
    rating: 4.7,
    reviews: 231,
    weightGrams: 224,
    dropMm: 9,
    silhouette: 'runner',
    featured: true,
    tagline: 'Kundalik yugurish va uzoq masofalar uchun nafas oluvchi Knit.',
    description:
      'Choksiz FlyWeave ustki qismi oyoq shaklini mukammal takrorlaydi, CloudFoam yostiqchasi esa tizzaga tushadigan yukni kamaytiradi.',
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    specs: { lightness: 92, cushion: 90, stability: 86, energyReturn: 89 },
    colorways: [
      { id: 'cobalt-flash', name: 'Cobalt Flash', primary: '#122038', secondary: '#1e3a66', accent: '#00e5ff', sole: '#edf5ff', glow: '#00e5ff' },
      { id: 'emerald-pulse', name: 'Emerald Velocity', primary: '#0f241f', secondary: '#194238', accent: '#34d399', sole: '#e6f7f1', glow: '#34d399' },
      { id: 'ash-orange', name: 'Ash Blaze', primary: '#26282e', secondary: '#3d414a', accent: '#fb923c', sole: '#f3f4f6', glow: '#fb923c' },
    ],
  },
  {
    id: 'velox-monolith-v2',
    sku: 'VLX-06-MNL',
    name: 'VELOX Monolith V2',
    category: 'Street',
    badge: 'TRENDING',
    badgeType: 'hot',
    price: 235,
    oldPrice: null,
    rating: 4.8,
    reviews: 174,
    weightGrams: 295,
    dropMm: 11,
    silhouette: 'chunky',
    featured: true,
    tagline: 'Brutalist arxitekturadan ilhomlangan qatlamli ko‘cha krasofkasi.',
    description:
      'Tabiiy nubuk va ballistik neylon uyg‘unligi, kengaytirilgan protektor bilan har qanday ob-havoga chidamli.',
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    specs: { lightness: 76, cushion: 92, stability: 95, energyReturn: 82 },
    colorways: [
      { id: 'graphite-amber', name: 'Graphite Ember', primary: '#1d1f24', secondary: '#333742', accent: '#ffaa00', sole: '#262932', glow: '#ffaa00' },
      { id: 'bone-mint', name: 'Chalk Mint', primary: '#3d4147', secondary: '#5b616b', accent: '#5eead4', sole: '#e5e7eb', glow: '#5eead4' },
      { id: 'shadow-crimson', name: 'Shadow Pulse', primary: '#131318', secondary: '#262630', accent: '#ff2e5b', sole: '#1b1b24', glow: '#ff2e5b' },
    ],
  },
  {
    id: 'velox-kyoto-drift',
    sku: 'VLX-07-KYO',
    name: 'VELOX Kyoto Drift SE',
    category: 'Limited',
    badge: 'LIMITED DROP',
    badgeType: 'limited',
    price: 315,
    oldPrice: 360,
    rating: 4.9,
    reviews: 145,
    weightGrams: 256,
    dropMm: 8,
    silhouette: 'runner',
    featured: false,
    tagline: 'Tokio tungi neonlaridan ilhomlangan maxsus kolleksiya.',
    description:
      'Lazer bilan kesilgan zamsh panellari va qorong‘uda yorug‘lik taratuvchi fosforli chiziqlarga ega eksklyuziv nashr.',
    sizes: [39, 40, 41, 42, 43, 44],
    specs: { lightness: 88, cushion: 91, stability: 90, energyReturn: 88 },
    colorways: [
      { id: 'sakura-neon', name: 'Neon Sakura', primary: '#221426', secondary: '#40214a', accent: '#ff4d8d', sole: '#f5ebf2', glow: '#ff4d8d' },
      { id: 'cyber-jade', name: 'Cyber Jade', primary: '#102226', secondary: '#1c3e45', accent: '#2dd4bf', sole: '#e6f5f4', glow: '#2dd4bf' },
      { id: 'midnight-volt', name: 'Shibuya Volt', primary: '#121622', secondary: '#252d42', accent: '#c8ff00', sole: '#eef2f7', glow: '#c8ff00' },
    ],
  },
  {
    id: 'velox-vortex-court',
    sku: 'VLX-08-VTX',
    name: 'VELOX Vortex Court 7',
    category: 'Basketball',
    badge: 'COURT READY',
    badgeType: 'default',
    price: 210,
    oldPrice: null,
    rating: 4.7,
    reviews: 162,
    weightGrams: 304,
    dropMm: 7,
    silhouette: 'hightop',
    featured: false,
    tagline: 'Parketda sirpanmaydigan mikro-tishli taglik va tezkor start.',
    description:
      'Dinamik bog‘ich qulflari va yon tomondagi karbon qanotchalari keskin to‘xtash paytida oyoqni mukammal ushlab turadi.',
    sizes: [40, 41, 42, 43, 44, 45, 46],
    specs: { lightness: 81, cushion: 93, stability: 96, energyReturn: 90 },
    colorways: [
      { id: 'ice-blue', name: 'Glacier Ice', primary: '#142230', secondary: '#243c54', accent: '#38bdf8', sole: '#e0f2fe', glow: '#38bdf8' },
      { id: 'lava-red', name: 'Magma Core', primary: '#261414', secondary: '#4a2020', accent: '#ff453a', sole: '#f5e9e9', glow: '#ff453a' },
      { id: 'onyx-volt', name: 'Onyx Strike', primary: '#141518', secondary: '#2a2c33', accent: '#c8ff00', sole: '#e5e7eb', glow: '#c8ff00' },
    ],
  },
  {
    id: 'velox-zenith-glide',
    sku: 'VLX-09-ZNT',
    name: 'VELOX Zenith Glide',
    category: 'Running',
    badge: 'ULTRA LIGHT',
    badgeType: 'default',
    price: 175,
    oldPrice: 199,
    rating: 4.6,
    reviews: 204,
    weightGrams: 198,
    dropMm: 8,
    silhouette: 'aero',
    featured: false,
    tagline: 'Havo kabi yengil kundalik sprint va fitnes hamrohi.',
    description:
      'Bir qismli monofilament to‘r ustki qismi issiq kunlarda ham maksimal shamollatish beradi.',
    sizes: [38, 39, 40, 41, 42, 43, 44],
    specs: { lightness: 96, cushion: 88, stability: 84, energyReturn: 90 },
    colorways: [
      { id: 'mint-storm', name: 'Mint Storm', primary: '#122624', secondary: '#1f423e', accent: '#2ee6a6', sole: '#ecfdf5', glow: '#2ee6a6' },
      { id: 'solar-gold', name: 'Solar Flare', primary: '#241e12', secondary: '#45381f', accent: '#facc15', sole: '#fefce8', glow: '#facc15' },
      { id: 'slate-cyan', name: 'Slate Aero', primary: '#1b2029', secondary: '#30394a', accent: '#00e5ff', sole: '#f1f5f9', glow: '#00e5ff' },
    ],
  },
  {
    id: 'velox-eclipse-mid',
    sku: 'VLX-10-ECL',
    name: 'VELOX Eclipse Mid',
    category: 'Street',
    badge: 'NEW DROP',
    badgeType: 'hot',
    price: 205,
    oldPrice: 240,
    rating: 4.8,
    reviews: 158,
    weightGrams: 286,
    dropMm: 9,
    silhouette: 'hightop',
    featured: false,
    tagline: 'Minimalistik qora siluet va kontrastli neon aksentlar.',
    description:
      'Shahar garderobiga har qanday uslubda mos tushuvchi o‘rta balandlikdagi krasofka. Namlikdan himoyalovchi qoplama bilan.',
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    specs: { lightness: 80, cushion: 91, stability: 93, energyReturn: 84 },
    colorways: [
      { id: 'eclipse-volt', name: 'Eclipse Volt', primary: '#111318', secondary: '#242936', accent: '#c8ff00', sole: '#1c2029', glow: '#c8ff00' },
      { id: 'copper-dark', name: 'Rust Copper', primary: '#241915', secondary: '#452e25', accent: '#fb923c', sole: '#291f1b', glow: '#fb923c' },
      { id: 'ghost-white', name: 'Ghost Frost', primary: '#3b4252', secondary: '#555e73', accent: '#00e5ff', sole: '#eceff4', glow: '#00e5ff' },
    ],
  },
  {
    id: 'velox-titan-forge',
    sku: 'VLX-11-TTN',
    name: 'VELOX Titan Forge',
    category: 'Limited',
    badge: 'COLLECTOR',
    badgeType: 'limited',
    price: 360,
    oldPrice: null,
    rating: 5.0,
    reviews: 89,
    weightGrams: 268,
    dropMm: 10,
    silhouette: 'chunky',
    featured: false,
    tagline: 'Titan rangli metall qoplama va qo‘lda yig‘ilgan taglik.',
    description:
      'VELOX Lab muhandislari tomonidan cheklangan miqdorda ishlab chiqarilgan bayramona flagman. Maxsus alyuminiy qutida yetkaziladi.',
    sizes: [40, 41, 42, 43, 44, 45],
    specs: { lightness: 85, cushion: 97, stability: 96, energyReturn: 94 },
    colorways: [
      { id: 'forge-gold', name: 'Molten Gold', primary: '#1c1a16', secondary: '#383227', accent: '#ffaa00', sole: '#211f1a', glow: '#ffaa00' },
      { id: 'forge-cyan', name: 'Chrome Ion', primary: '#19212b', secondary: '#2f3e52', accent: '#00e5ff', sole: '#dde7f2', glow: '#00e5ff' },
      { id: 'forge-volt', name: 'Acid Alloy', primary: '#181c1a', secondary: '#2e3632', accent: '#c8ff00', sole: '#1f2421', glow: '#c8ff00' },
    ],
  },
  {
    id: 'velox-nova-sprint',
    sku: 'VLX-12-NVA',
    name: 'VELOX Nova Sprint R2',
    category: 'Basketball',
    badge: 'HOT',
    badgeType: 'hot',
    price: 229,
    oldPrice: 259,
    rating: 4.8,
    reviews: 134,
    weightGrams: 288,
    dropMm: 7,
    silhouette: 'runner',
    featured: false,
    tagline: 'Tezkor himoyachilar uchun past profilli reaktiv model.',
    description:
      'Past profil va kengaytirilgan old taglik maydonda chaqmoqdek tez yo‘nalish o‘zgartirish imkonini beradi.',
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    specs: { lightness: 89, cushion: 92, stability: 93, energyReturn: 95 },
    colorways: [
      { id: 'nova-crimson', name: 'Nova Blaze', primary: '#21121a', secondary: '#451f33', accent: '#ff2e5b', sole: '#f7ecf0', glow: '#ff2e5b' },
      { id: 'nova-volt', name: 'Electric Court', primary: '#131d19', secondary: '#22382f', accent: '#c8ff00', sole: '#eff7f2', glow: '#c8ff00' },
      { id: 'nova-violet', name: 'Ultraviolet', primary: '#19142b', secondary: '#322657', accent: '#a855f7', sole: '#f0ecfa', glow: '#a855f7' },
    ],
  },
];

export const SHOWROOMS = [
  {
    city: 'Tashkent Flagship',
    tag: 'UZBEKISTAN HQ',
    address: 'Tashkent City Boulevard, Block 4, 1-qavat',
    hours: 'Har kuni: 10:00 — 22:00',
    phone: '+998 (71) 200-88-90',
    feature: '3D oyoq skaneri va VIP Fitting Lounge',
  },
  {
    city: 'Tokyo Lab',
    tag: 'DESIGN STUDIO',
    address: 'Shibuya-ku, Jingumae 6-18-4, Tokyo',
    hours: 'Har kuni: 11:00 — 21:00',
    phone: '+81 3-6427-9910',
    feature: 'Limited Drop kapsula va shaxsiylashtirish',
  },
  {
    city: 'Milan Atelier',
    tag: 'EUROPE HUB',
    address: 'Via Montenapoleone 14, 20121 Milano',
    hours: 'Du–Sha: 10:00 — 20:30',
    phone: '+39 02 8941 2201',
    feature: 'Karbon taglik laboratoriyasi',
  },
];

export const SIZE_CHART = [
  { eu: 38, us: 5.5, uk: 5, cm: 24.0 },
  { eu: 39, us: 6.5, uk: 6, cm: 24.5 },
  { eu: 40, us: 7.0, uk: 6.5, cm: 25.0 },
  { eu: 41, us: 8.0, uk: 7, cm: 26.0 },
  { eu: 42, us: 8.5, uk: 7.5, cm: 26.5 },
  { eu: 43, us: 9.5, uk: 8.5, cm: 27.5 },
  { eu: 44, us: 10.5, uk: 9.5, cm: 28.0 },
  { eu: 45, us: 11.5, uk: 10.5, cm: 29.0 },
  { eu: 46, us: 12.0, uk: 11, cm: 30.0 },
];

export const FAQS = [
  {
    q: 'Buyurtma Toshkent va viloyatlarga qancha vaqtda yetib boradi?',
    a: 'Toshkent shahri bo‘ylab tezkor kuryer orqali 2–4 soat ichida, O‘zbekistonning boshqa hududlariga esa 1–2 ish kunida bepul yetkazib beramiz.',
  },
  {
    q: 'O‘lcham to‘g‘ri kelmasa almashtirish mumkinmi?',
    a: 'Ha, 14 kun ichida kiyilmagan va qutisi saqlangan har qanday juftni boshqa o‘lchamga bepul almashtirib beramiz yoki pulingizni 100% qaytaramiz.',
  },
  {
    q: 'Promo-kodlarni qayerdan olsam bo‘ladi?',
    a: 'Hozirning o‘zida savatchada VELOX20 (20% chegirma) yoki DROP10 (10% chegirma) promo-kodlarini sinab ko‘rishingiz mumkin.',
  },
  {
    q: 'VELOX krasofkalariga kafolat beriladimi?',
    a: 'Barcha original VELOX modellari uchun 12 oylik ishlab chiqaruvchi kafolati va taglik amortizatsiya tekshiruvi mavjud.',
  },
];

/* ============================================================================
   2. GLOBAL STORE CONTEXT (SAVATCHA, SEVIMLILAR, MODAL, TOAST)
   ============================================================================ */

const StoreContext = createContext(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore faqat StoreProvider ichida ishlatilishi kerak');
  }
  return ctx;
}

function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('velox_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('velox_wish_v1');
      return saved ? JSON.parse(saved) : ['velox-aeropulse-x1'];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('velox_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('velox_wish_v1', JSON.stringify(wishlist));
    } catch {
      // ignore storage quota errors
    }
  }, [wishlist]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (title, message = '', type = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, message, type }]);
      setTimeout(() => dismissToast(id), 3400);
    },
    [dismissToast]
  );

  const addToCart = useCallback(
    (product, size, colorway) => {
      const chosenSize = size || product.sizes[Math.floor(product.sizes.length / 2)];
      const chosenColor = colorway || product.colorways[0];
      const key = `${product.id}__${chosenSize}__${chosenColor.id}`;

      setCart((prev) => {
        const existing = prev.find((item) => item.key === key);
        if (existing) {
          return prev.map((item) =>
            item.key === key ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [
          ...prev,
          {
            key,
            productId: product.id,
            name: product.name,
            price: product.price,
            silhouette: product.silhouette,
            size: chosenSize,
            colorway: chosenColor,
            qty: 1,
          },
        ];
      });

      pushToast(
        'Savatchaga qo‘shildi',
        `${product.name} • EU ${chosenSize} (${chosenColor.name})`,
        'success'
      );
    },
    [pushToast]
  );

  const updateCartQty = useCallback((key, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  }, []);

  const removeFromCart = useCallback((key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedPromo(null);
  }, []);

  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        const exists = prev.includes(product.id);
        if (exists) {
          pushToast('Sevimlilardan olib tashlandi', product.name);
          return prev.filter((id) => id !== product.id);
        }
        pushToast('Sevimlilarga saqlandi', product.name, 'success');
        return [...prev, product.id];
      });
    },
    [pushToast]
  );

  const applyPromoCode = useCallback(
    (rawCode) => {
      const clean = rawCode.trim().toUpperCase();
      const found = PROMO_CODES[clean];
      if (!found) {
        pushToast('Promo-kod topilmadi', 'Sinab ko‘ring: VELOX20 yoki DROP10', 'error');
        return false;
      }
      setAppliedPromo(found);
      pushToast('Promo-kod faollashdi!', `${found.code} — ${found.label}`, 'success');
      return true;
    },
    [pushToast]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return Math.round((subtotal * appliedPromo.percent) / 100);
  }, [subtotal, appliedPromo]);

  const total = Math.max(0, subtotal - discountAmount);

  const value = {
    cart,
    wishlist,
    cartCount,
    subtotal,
    discountAmount,
    total,
    appliedPromo,
    isCartOpen,
    setIsCartOpen,
    quickViewProduct,
    setQuickViewProduct,
    toasts,
    pushToast,
    dismissToast,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    applyPromoCode,
    setAppliedPromo,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/* ============================================================================
   3. ROUTER VA ASOSIY APP SHELL
   ============================================================================ */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function ToastStack() {
  const { toasts, dismissToast } = useStore();
  if (!toasts.length) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-${toast.type || 'info'}`}
          onClick={() => dismissToast(toast.id)}
        >
          <span className="toast-dot" />
          <div className="toast-body">
            <strong>{toast.title}</strong>
            {toast.message && <p>{toast.message}</p>}
          </div>
          <span className="toast-close">✕</span>
        </div>
      ))}
    </div>
  );
}

function AppShell() {
  return (
    <div className="velox-app">
      <ScrollToTop />

      <div className="ambient-layer" aria-hidden="true">
        <div className="ambient-grid" />
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
      </div>

      <Navbar />

      <main className="main-viewport">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <ToastStack />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}