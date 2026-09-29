import { ALL_SEED_PRODUCTS, SEED_COUPONS, DEFAULT_SITE_SETTINGS } from '../../server/seed/products';
import { SEED_CATEGORIES, SEED_BRANDS } from '../../server/seed/data';
import { Product, Category, Brand, SiteSettings } from '../types';

// Initialize products with unique IDs and standard shape
const INITIAL_PRODUCTS: Product[] = ALL_SEED_PRODUCTS.map((p, i) => {
  const prodId = `prd_${i + 1}`;
  return {
    ...p,
    _id: prodId,
    id: prodId,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  };
});

const INITIAL_CATEGORIES: Category[] = SEED_CATEGORIES.map((c, i) => ({
  ...c,
  _id: `cat_${i + 1}`,
  id: `cat_${i + 1}`,
  status: 'active'
}));

const INITIAL_BRANDS: Brand[] = SEED_BRANDS.map((b, i) => ({
  ...b,
  _id: `brd_${i + 1}`,
  id: `brd_${i + 1}`
}));

// Local storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'hc_local_products',
  ORDERS: 'hc_local_orders',
  SETTINGS: 'hc_local_settings',
  REVIEWS: 'hc_local_reviews',
  MESSAGES: 'hc_local_messages',
  INSTALLMENTS: 'hc_local_installments'
};

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

export function getLocalProducts(params: Record<string, any> = {}) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || 20);

  let list: Product[] = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  if (!list || list.length === 0) {
    list = INITIAL_PRODUCTS;
  }

  // 1. Search Query
  if (params.search) {
    const q = String(params.search).toLowerCase().trim();
    list = list.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      (p.model && p.model.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))
    );
  }

  // 2. Category Filter (matches slug or category name case-insensitively)
  if (params.category && params.category !== 'all') {
    const catSlug = String(params.category).toLowerCase().trim();
    list = list.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const matchedCat = INITIAL_CATEGORIES.find(
        c => c.slug === catSlug || c.name.toLowerCase() === catSlug
      );
      return pCat === catSlug || (matchedCat && pCat === matchedCat.name.toLowerCase());
    });
  }

  // 3. Brand Filter (matches slug or brand name)
  if (params.brand && params.brand !== 'all') {
    const bSlug = String(params.brand).toLowerCase().trim();
    list = list.filter(p => {
      const pBrand = (p.brand || '').toLowerCase();
      const matchedBrand = INITIAL_BRANDS.find(
        b => b.slug === bSlug || b.name.toLowerCase() === bSlug
      );
      return pBrand === bSlug || (matchedBrand && pBrand === matchedBrand.name.toLowerCase());
    });
  }

  // 4. Price Filter
  if (params.minPrice !== undefined && params.minPrice !== '' && !isNaN(Number(params.minPrice))) {
    list = list.filter(p => p.price >= Number(params.minPrice));
  }
  if (params.maxPrice !== undefined && params.maxPrice !== '' && !isNaN(Number(params.maxPrice))) {
    list = list.filter(p => p.price <= Number(params.maxPrice));
  }

  // 5. Stock Filter
  if (params.inStock === true || params.inStock === 'true') {
    list = list.filter(p => p.stock > 0 && p.stockStatus !== 'out_of_stock');
  }

  // 6. Flags (Featured, Deal, New)
  if (params.isFeatured === true || params.isFeatured === 'true') {
    list = list.filter(p => p.isFeatured);
  }
  if (params.isDeal === true || params.isDeal === 'true') {
    list = list.filter(p => p.isDeal);
  }
  if (params.isNew === true || params.isNew === 'true') {
    list = list.filter(p => p.isNew);
  }

  // 7. Sort
  const sort = params.sort || 'featured';
  if (sort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    list.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  } else if (sort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === 'discount') {
    list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
  } else {
    list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const offset = (page - 1) * limit;
  const paginated = list.slice(offset, offset + limit);

  return {
    success: true,
    data: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages
    }
  };
}

export function getLocalProductBySlug(slug: string) {
  const list = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const found = list.find(p => p.slug === slug || p.id === slug || p._id === slug);
  if (found) {
    return { success: true, data: found };
  }
  return { success: false, message: 'Product not found' };
}

export function getLocalProductById(id: string) {
  const list = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const found = list.find(p => p.id === id || p._id === id || p.slug === id);
  if (found) {
    return { success: true, data: found };
  }
  return { success: false, message: 'Product not found' };
}

export function getLocalCategories() {
  return { success: true, data: INITIAL_CATEGORIES };
}

export function getLocalBrands() {
  return { success: true, data: INITIAL_BRANDS };
}

export function getLocalSettings(): { success: boolean; data: SiteSettings } {
  const settings = getStored<SiteSettings>(STORAGE_KEYS.SETTINGS, {
    businessName: "Hanif Centre Electronics Online Store",
    logo: "",
    phone1: "0305-7245533",
    phone2: "0300-9409477",
    phone3: "0326-7245533",
    email: "haneefcentre@gmail.com",
    address: "Yasin Mansion, Patiala Ground, 2 Link McLeod Road, near Hall Road, Lahore 54000, Pakistan",
    branch2: "Near Sui Gas Interchange/Ring Road near Phase 4 DHA Lahore",
    whatsapp: "923057245533",
    openingHours: "Mon–Sat: 11:00 AM – 8:30 PM | Sunday: Closed",
    deliveryPolicy: "Delivery options available according to product weight and location across Lahore and nationwide via safe logistics.",
    returnPolicy: "7-day replacement warranty for manufacturing defects with original packaging and invoice.",
    warrantyPolicy: "100% Genuine electronics backed by official brand warranties at authorized customer service centers.",
    facebookUrl: "",
    announcementBar: "🔥 Summer Inverter AC & Refrigerator Deals | Call 0305-7245533 for Price Confirmation & Fast Lahore Delivery",
    heroTitle: "Smart Electronics. Better Living.",
    heroSubtitle: "Discover quality electronics and home appliances from trusted brands at Hanif Centre — Lahore's verified electronics landmark."
  });
  return { success: true, data: settings };
}

export function validateLocalCoupon(code: string, subtotal: number) {
  const cpn = SEED_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
  if (!cpn) {
    return { success: false, message: 'Invalid or expired coupon code' };
  }
  if (subtotal < cpn.minOrder) {
    return { success: false, message: `Minimum order amount of Rs. ${cpn.minOrder.toLocaleString()} required` };
  }
  const discount = cpn.discountType === 'percentage'
    ? Math.min((subtotal * cpn.amount) / 100, cpn.maxDiscount)
    : cpn.amount;
  return {
    success: true,
    data: {
      ...cpn,
      discount
    }
  };
}
