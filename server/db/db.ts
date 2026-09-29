import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {
  UserSchema,
  ProductSchema,
  CategorySchema,
  BrandSchema,
  OrderSchema,
  ReviewSchema,
  CouponSchema,
  ContactMessageSchema,
  InstallmentInquirySchema,
  SiteSettingSchema
} from '../models/schemas';
import { ALL_SEED_PRODUCTS, SEED_COUPONS, DEFAULT_SITE_SETTINGS } from '../seed/products';
import { SEED_CATEGORIES, SEED_BRANDS } from '../seed/data';

const DATA_DIR = path.resolve(process.cwd(), 'server_data');
const STORE_FILE = path.join(DATA_DIR, 'db_store.json');

// Mongoose Models
export let UserModel: any = null;
export let ProductModel: any = null;
export let CategoryModel: any = null;
export let BrandModel: any = null;
export let OrderModel: any = null;
export let ReviewModel: any = null;
export let CouponModel: any = null;
export let ContactMessageModel: any = null;
export let InstallmentInquiryModel: any = null;
export let SiteSettingModel: any = null;

let isMongooseConnected = false;

// Fallback In-Memory/File Store
interface StoreData {
  users: any[];
  products: any[];
  categories: any[];
  brands: any[];
  orders: any[];
  reviews: any[];
  coupons: any[];
  contactMessages: any[];
  installmentInquiries: any[];
  siteSettings: any;
}

let memoryStore: StoreData = {
  users: [],
  products: [],
  categories: [],
  brands: [],
  orders: [],
  reviews: [],
  coupons: [],
  contactMessages: [],
  installmentInquiries: [],
  siteSettings: DEFAULT_SITE_SETTINGS
};

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function persistStore() {
  try {
    ensureDataDirectory();
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write database store:', err);
  }
}

export async function initDatabase() {
  ensureDataDirectory();

  // Load from local store file if exists
  if (fs.existsSync(STORE_FILE)) {
    try {
      const content = fs.readFileSync(STORE_FILE, 'utf8');
      memoryStore = JSON.parse(content);
    } catch (err) {
      console.warn('Could not parse local store, re-seeding...', err);
    }
  }

  // Check if store needs initial seed
  if (!memoryStore.products || memoryStore.products.length === 0) {
    await seedMemoryStore();
  }

  // Try Mongo URI if provided
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri && mongoUri.startsWith('mongodb')) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
      console.log('MongoDB connected successfully');
      isMongooseConnected = true;

      UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
      ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
      CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);
      BrandModel = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
      OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
      ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
      CouponModel = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
      ContactMessageModel = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
      InstallmentInquiryModel = mongoose.models.InstallmentInquiry || mongoose.model('InstallmentInquiry', InstallmentInquirySchema);
      SiteSettingModel = mongoose.models.SiteSetting || mongoose.model('SiteSetting', SiteSettingSchema);

      // Seed MongoDB if empty
      const prodCount = await ProductModel.countDocuments();
      if (prodCount === 0) {
        console.log('Seeding MongoDB Atlas collection...');
        await seedMongo();
      }
    } catch (err) {
      console.warn('MongoDB connection failed or skipped. Using persistent JSON data store.', err);
      isMongooseConnected = false;
    }
  } else {
    console.log('Using persistent local JSON database engine.');
  }
}

export async function seedMemoryStore() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hanifcentre.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2026!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const customerPassword = await bcrypt.hash('customer123', 10);

  memoryStore.users = [
    {
      _id: 'usr_admin_1',
      id: 'usr_admin_1',
      name: 'Hanif Centre Admin',
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      phone: '0305-7245533',
      address: 'Yasin Mansion, McLeod Road, Lahore',
      city: 'Lahore',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_cust_1',
      id: 'usr_cust_1',
      name: 'Ahmed Malik',
      email: 'customer@hanifcentre.com',
      password: customerPassword,
      role: 'customer',
      phone: '0300-9409477',
      address: 'House 42, Sector Y, DHA Phase 3, Lahore',
      city: 'Lahore',
      createdAt: new Date().toISOString()
    }
  ];

  memoryStore.categories = SEED_CATEGORIES.map((c, i) => ({
    _id: `cat_${i + 1}`,
    id: `cat_${i + 1}`,
    ...c,
    createdAt: new Date().toISOString()
  }));

  memoryStore.brands = SEED_BRANDS.map((b, i) => ({
    _id: `brd_${i + 1}`,
    id: `brd_${i + 1}`,
    ...b,
    createdAt: new Date().toISOString()
  }));

  memoryStore.products = ALL_SEED_PRODUCTS.map((p, i) => ({
    _id: `prd_${i + 1}`,
    id: `prd_${i + 1}`,
    ...p,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  }));

  memoryStore.coupons = SEED_COUPONS.map((cpn, i) => ({
    _id: `cpn_${i + 1}`,
    id: `cpn_${i + 1}`,
    ...cpn,
    createdAt: new Date().toISOString()
  }));

  memoryStore.siteSettings = {
    ...DEFAULT_SITE_SETTINGS,
    _id: 'settings_default'
  };

  // Seed sample initial orders
  memoryStore.orders = [
    {
      _id: 'ord_1',
      id: 'ord_1',
      orderNumber: 'HC-2026-000001',
      customer: {
        name: 'Tariq Mehmood',
        email: 'tariq.mehmood@example.com',
        phone: '0321-4455667',
        address: 'Plaza 18, Commercial Broadway, DHA Phase 8',
        city: 'Lahore',
        area: 'DHA',
        postalCode: '54000',
        notes: 'Please call before delivery'
      },
      items: [
        {
          productId: 'prd_1',
          name: 'Hyundai Inverter AC Smart HAC-13T3 Turbo Breeze 1.0 Ton',
          sku: 'HC-AC-001',
          price: 138000,
          quantity: 1,
          thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
          brand: 'Hyundai'
        }
      ],
      subtotal: 138000,
      discount: 0,
      deliveryFee: 1500,
      total: 139500,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'Confirmed',
      statusHistory: [
        { status: 'Pending', note: 'Order placed by customer', updatedAt: new Date(Date.now() - 86400000).toISOString() },
        { status: 'Confirmed', note: 'Customer called and price confirmed', updatedAt: new Date(Date.now() - 43200000).toISOString() }
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: 'ord_2',
      id: 'ord_2',
      orderNumber: 'HC-2026-000002',
      customer: {
        name: 'Usman Ghani',
        email: 'usman.ghani@example.com',
        phone: '0300-8877665',
        address: 'Street 4, Johar Town, Block G',
        city: 'Lahore',
        area: 'Johar Town',
        postalCode: '54000',
        notes: 'Fragile delivery needed'
      },
      items: [
        {
          productId: 'prd_11',
          name: 'TCL 32 Inch QLED Smart Google TV 32S51K',
          sku: 'HC-TV-001',
          price: 52000,
          quantity: 1,
          thumbnail: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
          brand: 'TCL'
        }
      ],
      subtotal: 52000,
      discount: 1000,
      deliveryFee: 1000,
      total: 52000,
      couponCode: 'HANIF1000',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      orderStatus: 'Shipped',
      statusHistory: [
        { status: 'Pending', note: 'Order placed', updatedAt: new Date(Date.now() - 172800000).toISOString() },
        { status: 'Confirmed', note: 'Bank transfer received', updatedAt: new Date(Date.now() - 129600000).toISOString() },
        { status: 'Processing', note: 'Dispatched from Hall Road warehouse', updatedAt: new Date(Date.now() - 86400000).toISOString() },
        { status: 'Shipped', note: 'Courier tracking # TCS-8921734', updatedAt: new Date(Date.now() - 43200000).toISOString() }
      ],
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  // Seed sample reviews
  memoryStore.reviews = [
    {
      _id: 'rev_1',
      id: 'rev_1',
      productId: 'prd_1',
      userId: 'usr_cust_1',
      userName: 'Ahmed Malik',
      userEmail: 'customer@hanifcentre.com',
      rating: 5,
      title: 'Super fast cooling in scorching Lahore heat!',
      comment: 'Got this Hyundai 1 Ton Inverter AC installed in my bedroom. Cooled the room within 10 minutes even when outside temperature was 44°C. Excellent service and original warranty card provided by Hanif Centre.',
      status: 'approved',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      _id: 'rev_2',
      id: 'rev_2',
      productId: 'prd_11',
      userId: 'usr_cust_1',
      userName: 'Zubair Raza',
      userEmail: 'zubair.raza@example.com',
      rating: 5,
      title: 'Best 32 inch QLED colors in Pakistan',
      comment: 'Colors on this TCL QLED are jaw dropping compared to normal LEDs. Sound is loud and Google TV interface is very responsive.',
      status: 'approved',
      createdAt: new Date(Date.now() - 180000000).toISOString()
    }
  ];

  // Seed initial installment inquiry
  memoryStore.installmentInquiries = [
    {
      _id: 'inq_1',
      id: 'inq_1',
      name: 'Mohammad Farooq',
      phone: '0312-9988776',
      city: 'Lahore',
      productId: 'prd_1',
      productName: 'Hyundai Inverter AC Smart HAC-13T3 Turbo Breeze 1.0 Ton',
      plan: '12 Months Easy Plan',
      message: 'Interested in 12 month plan with 30% advance payment.',
      status: 'contacted',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  // Seed initial contact message
  memoryStore.contactMessages = [
    {
      _id: 'msg_1',
      id: 'msg_1',
      name: 'Bilal Aslam',
      email: 'bilal.aslam@example.com',
      phone: '0333-1234567',
      subject: 'Bulk discount for 4 Inverter ACs',
      message: 'Need 4 units of TCL 1.5 Ton for our new office near Gulberg. Please let me know your best package rate.',
      status: 'unread',
      createdAt: new Date(Date.now() - 43200000).toISOString()
    }
  ];

  persistStore();
  console.log(`Database seeded with ${memoryStore.products.length} products, ${memoryStore.categories.length} categories, ${memoryStore.brands.length} brands.`);
}

async function seedMongo() {
  if (!isMongooseConnected) return;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hanifcentre.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2026!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await UserModel.create({
    name: 'Hanif Centre Admin',
    email: adminEmail.toLowerCase(),
    password: hashedPassword,
    role: 'admin',
    phone: '0305-7245533',
    address: 'Yasin Mansion, McLeod Road, Lahore',
    city: 'Lahore'
  });

  await CategoryModel.insertMany(SEED_CATEGORIES);
  await BrandModel.insertMany(SEED_BRANDS);
  await ProductModel.insertMany(ALL_SEED_PRODUCTS);
  await CouponModel.insertMany(SEED_COUPONS);
  await SiteSettingModel.create(DEFAULT_SITE_SETTINGS);
}

// Database helper functions
export const db = {
  // PRODUCTS
  async getProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    isFeatured?: boolean;
    isDeal?: boolean;
    isNew?: boolean;
    sort?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Number(params.limit) || 20);

    let list = [...memoryStore.products];

    // Search query
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.model && p.model.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    // Category filter
    if (params.category && params.category !== 'all') {
      const catSlug = params.category.toLowerCase();
      list = list.filter(p => {
        const cat = memoryStore.categories.find(c => c.slug === catSlug || c.name.toLowerCase() === catSlug);
        return p.category.toLowerCase() === catSlug || (cat && p.category.toLowerCase() === cat.name.toLowerCase());
      });
    }

    // Brand filter
    if (params.brand && params.brand !== 'all') {
      const bSlug = params.brand.toLowerCase();
      list = list.filter(p => p.brand.toLowerCase() === bSlug);
    }

    // Price filter
    if (params.minPrice !== undefined && !isNaN(params.minPrice)) {
      list = list.filter(p => p.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined && !isNaN(params.maxPrice)) {
      list = list.filter(p => p.price <= params.maxPrice!);
    }

    // In Stock
    if (params.inStock) {
      list = list.filter(p => p.stock > 0 && p.stockStatus !== 'out_of_stock');
    }

    // Flags
    if (params.isFeatured) {
      list = list.filter(p => p.isFeatured);
    }
    if (params.isDeal) {
      list = list.filter(p => p.isDeal);
    }
    if (params.isNew) {
      list = list.filter(p => p.isNew);
    }

    // Sort
    const sort = params.sort || 'featured';
    if (sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount') {
      list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    } else {
      // featured default
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    const total = list.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = list.slice(offset, offset + limit);

    return {
      products: paginated,
      total,
      page,
      totalPages,
      hasMore: page < totalPages
    };
  },

  async getProductById(id: string) {
    return memoryStore.products.find(p => p.id === id || p._id === id) || null;
  },

  async getProductBySlug(slug: string) {
    return memoryStore.products.find(p => p.slug.toLowerCase() === slug.toLowerCase()) || null;
  },

  async createProduct(data: any) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newProduct = {
      _id: `prd_${Date.now()}`,
      id: `prd_${Date.now()}`,
      ...data,
      slug,
      stockStatus: data.stock > 5 ? 'in_stock' : data.stock > 0 ? 'low_stock' : 'out_of_stock',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryStore.products.unshift(newProduct);
    persistStore();
    return newProduct;
  },

  async updateProduct(id: string, data: any) {
    const index = memoryStore.products.findIndex(p => p.id === id || p._id === id);
    if (index === -1) return null;

    const updated = {
      ...memoryStore.products[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (updated.stock !== undefined) {
      updated.stockStatus = updated.stock > 5 ? 'in_stock' : updated.stock > 0 ? 'low_stock' : 'out_of_stock';
    }

    memoryStore.products[index] = updated;
    persistStore();
    return updated;
  },

  async deleteProduct(id: string) {
    const prevLen = memoryStore.products.length;
    memoryStore.products = memoryStore.products.filter(p => p.id !== id && p._id !== id);
    persistStore();
    return memoryStore.products.length < prevLen;
  },

  // CATEGORIES
  async getCategories() {
    return memoryStore.categories;
  },

  async createCategory(data: any) {
    const newCat = {
      _id: `cat_${Date.now()}`,
      id: `cat_${Date.now()}`,
      ...data,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString()
    };
    memoryStore.categories.push(newCat);
    persistStore();
    return newCat;
  },

  async updateCategory(id: string, data: any) {
    const index = memoryStore.categories.findIndex(c => c.id === id || c._id === id);
    if (index === -1) return null;
    memoryStore.categories[index] = { ...memoryStore.categories[index], ...data };
    persistStore();
    return memoryStore.categories[index];
  },

  async deleteCategory(id: string) {
    memoryStore.categories = memoryStore.categories.filter(c => c.id !== id && c._id !== id);
    persistStore();
    return true;
  },

  // BRANDS
  async getBrands() {
    return memoryStore.brands;
  },

  async createBrand(data: any) {
    const newBrand = {
      _id: `brd_${Date.now()}`,
      id: `brd_${Date.now()}`,
      ...data,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString()
    };
    memoryStore.brands.push(newBrand);
    persistStore();
    return newBrand;
  },

  async updateBrand(id: string, data: any) {
    const index = memoryStore.brands.findIndex(b => b.id === id || b._id === id);
    if (index === -1) return null;
    memoryStore.brands[index] = { ...memoryStore.brands[index], ...data };
    persistStore();
    return memoryStore.brands[index];
  },

  async deleteBrand(id: string) {
    memoryStore.brands = memoryStore.brands.filter(b => b.id !== id && b._id !== id);
    persistStore();
    return true;
  },

  // ORDERS
  async createOrder(orderData: any) {
    const nextSeq = String(memoryStore.orders.length + 1).padStart(6, '0');
    const orderNumber = `HC-2026-${nextSeq}`;

    const newOrder = {
      _id: `ord_${Date.now()}`,
      id: `ord_${Date.now()}`,
      orderNumber,
      ...orderData,
      orderStatus: 'Pending',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'pending',
      statusHistory: [
        {
          status: 'Pending',
          note: 'Order submitted by customer',
          updatedAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    // Update stock levels
    for (const item of newOrder.items) {
      const prod = memoryStore.products.find(p => p.id === item.productId || p._id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        prod.stockStatus = prod.stock > 5 ? 'in_stock' : prod.stock > 0 ? 'low_stock' : 'out_of_stock';
      }
    }

    memoryStore.orders.unshift(newOrder);
    persistStore();
    return newOrder;
  },

  async getOrders(params?: { userId?: string; orderStatus?: string; search?: string }) {
    let list = [...memoryStore.orders];
    if (params?.userId) {
      list = list.filter(o => o.userId === params.userId);
    }
    if (params?.orderStatus && params.orderStatus !== 'all') {
      list = list.filter(o => o.orderStatus === params.orderStatus);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.email.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getOrderById(id: string) {
    return memoryStore.orders.find(o => o.id === id || o._id === id || o.orderNumber === id) || null;
  },

  async trackOrder(orderNumber: string, phone: string) {
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    return memoryStore.orders.find(o => {
      const orderMatch = o.orderNumber.toUpperCase() === cleanNum;
      const oPhone = (o.customer.phone || '').replace(/[^0-9]/g, '');
      const phoneMatch = oPhone.endsWith(cleanPhone) || cleanPhone.endsWith(oPhone);
      return orderMatch && phoneMatch;
    }) || null;
  },

  async updateOrderStatus(id: string, newStatus: string, note?: string) {
    const order = memoryStore.orders.find(o => o.id === id || o._id === id || o.orderNumber === id);
    if (!order) return null;

    order.orderStatus = newStatus;
    if (newStatus === 'Delivered') {
      order.paymentStatus = 'paid';
    }
    order.statusHistory.push({
      status: newStatus,
      note: note || `Status updated to ${newStatus}`,
      updatedAt: new Date().toISOString()
    });

    persistStore();
    return order;
  },

  // USERS
  async getUserByEmail(email: string) {
    return memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  async getUserById(id: string) {
    return memoryStore.users.find(u => u.id === id || u._id === id) || null;
  },

  async createUser(userData: any) {
    const newUser = {
      _id: `usr_${Date.now()}`,
      id: `usr_${Date.now()}`,
      ...userData,
      email: userData.email.toLowerCase().trim(),
      role: userData.role || 'customer',
      savedAddresses: userData.savedAddresses || [],
      createdAt: new Date().toISOString()
    };
    memoryStore.users.push(newUser);
    persistStore();
    return newUser;
  },

  async updateUser(id: string, data: any) {
    const index = memoryStore.users.findIndex(u => u.id === id || u._id === id);
    if (index === -1) return null;
    memoryStore.users[index] = { ...memoryStore.users[index], ...data };
    persistStore();
    return memoryStore.users[index];
  },

  async getCustomers() {
    return memoryStore.users.map(u => ({
      id: u.id || u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      city: u.city,
      address: u.address,
      role: u.role,
      createdAt: u.createdAt
    }));
  },

  // COUPONS
  async getCoupons() {
    return memoryStore.coupons;
  },

  async validateCoupon(code: string, subtotal: number) {
    const coupon = memoryStore.coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim() && c.isActive);
    if (!coupon) {
      return { valid: false, message: 'Invalid or inactive coupon code' };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: 'Coupon code has expired' };
    }

    if (subtotal < coupon.minOrder) {
      return { valid: false, message: `Minimum order amount of Rs. ${coupon.minOrder.toLocaleString()} required for this coupon` };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.amount) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.amount;
    }

    return {
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        amount: coupon.amount,
        discount
      }
    };
  },

  async createCoupon(data: any) {
    const newCoupon = {
      _id: `cpn_${Date.now()}`,
      id: `cpn_${Date.now()}`,
      ...data,
      code: data.code.toUpperCase().trim(),
      usedCount: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    memoryStore.coupons.push(newCoupon);
    persistStore();
    return newCoupon;
  },

  async deleteCoupon(id: string) {
    memoryStore.coupons = memoryStore.coupons.filter(c => c.id !== id && c._id !== id);
    persistStore();
    return true;
  },

  // REVIEWS
  async getReviews(productId?: string) {
    if (productId) {
      return memoryStore.reviews.filter(r => r.productId === productId && r.status === 'approved');
    }
    return memoryStore.reviews;
  },

  async addReview(data: any) {
    const newReview = {
      _id: `rev_${Date.now()}`,
      id: `rev_${Date.now()}`,
      ...data,
      status: 'approved', // Auto approved for responsive customer UX
      createdAt: new Date().toISOString()
    };
    memoryStore.reviews.unshift(newReview);

    // Update product rating
    const prodReviews = memoryStore.reviews.filter(r => r.productId === data.productId);
    const avgRating = prodReviews.reduce((acc, r) => acc + r.rating, 0) / prodReviews.length;
    const prod = memoryStore.products.find(p => p.id === data.productId || p._id === data.productId);
    if (prod) {
      prod.rating = Number(avgRating.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }

    persistStore();
    return newReview;
  },

  async moderateReview(id: string, status: 'approved' | 'rejected') {
    const rev = memoryStore.reviews.find(r => r.id === id || r._id === id);
    if (!rev) return null;
    rev.status = status;
    persistStore();
    return rev;
  },

  // CONTACT MESSAGES
  async createContactMessage(data: any) {
    const newMsg = {
      _id: `msg_${Date.now()}`,
      id: `msg_${Date.now()}`,
      ...data,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    memoryStore.contactMessages.unshift(newMsg);
    persistStore();
    return newMsg;
  },

  async getContactMessages() {
    return memoryStore.contactMessages;
  },

  async markMessageRead(id: string) {
    const msg = memoryStore.contactMessages.find(m => m.id === id || m._id === id);
    if (msg) {
      msg.status = 'read';
      persistStore();
    }
    return msg;
  },

  // INSTALLMENT INQUIRIES
  async createInstallmentInquiry(data: any) {
    const newInquiry = {
      _id: `inq_${Date.now()}`,
      id: `inq_${Date.now()}`,
      ...data,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    memoryStore.installmentInquiries.unshift(newInquiry);
    persistStore();
    return newInquiry;
  },

  async getInstallmentInquiries() {
    return memoryStore.installmentInquiries;
  },

  async updateInstallmentStatus(id: string, status: string) {
    const inq = memoryStore.installmentInquiries.find(i => i.id === id || i._id === id);
    if (inq) {
      inq.status = status;
      persistStore();
    }
    return inq;
  },

  // SITE SETTINGS
  async getSiteSettings() {
    return memoryStore.siteSettings || DEFAULT_SITE_SETTINGS;
  },

  async updateSiteSettings(data: any) {
    memoryStore.siteSettings = {
      ...memoryStore.siteSettings,
      ...data,
      updatedAt: new Date().toISOString()
    };
    persistStore();
    return memoryStore.siteSettings;
  },

  // ADMIN DASHBOARD STATS
  async getAdminStats() {
    const totalSales = memoryStore.orders.reduce((sum, o) => sum + (o.orderStatus !== 'Cancelled' ? o.total : 0), 0);
    const totalOrders = memoryStore.orders.length;
    const pendingOrders = memoryStore.orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
    const totalProducts = memoryStore.products.length;
    const totalCustomers = memoryStore.users.filter(u => u.role === 'customer').length;
    const lowStock = memoryStore.products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = memoryStore.products.filter(p => p.stock === 0 || p.stockStatus === 'out_of_stock').length;

    // Order status breakdown
    const statusCounts: Record<string, number> = {};
    for (const ord of memoryStore.orders) {
      statusCounts[ord.orderStatus] = (statusCounts[ord.orderStatus] || 0) + 1;
    }

    // Category product counts
    const categoryCounts: Record<string, number> = {};
    for (const prod of memoryStore.products) {
      categoryCounts[prod.category] = (categoryCounts[prod.category] || 0) + 1;
    }

    return {
      totalSales,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalCustomers,
      lowStock,
      outOfStock,
      statusCounts,
      categoryCounts,
      recentOrders: memoryStore.orders.slice(0, 5)
    };
  }
};
