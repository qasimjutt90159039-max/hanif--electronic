import mongoose from 'mongoose';

// User Schema
export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: 'Lahore' },
  savedAddresses: [{
    label: String,
    address: String,
    city: String,
    phone: String,
  }],
}, { timestamps: true });

// Product Schema
export const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, default: '' },
  sku: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: 0 },
  discountPercentage: { type: Number, default: 0 },
  stock: { type: Number, default: 10 },
  stockStatus: { type: String, enum: ['in_stock', 'low_stock', 'out_of_stock'], default: 'in_stock' },
  images: [{ type: String }],
  thumbnail: { type: String, required: true },
  specifications: { type: Map, of: String },
  features: [{ type: String }],
  warranty: { type: String, default: '1 Year Official Warranty' },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isDeal: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 12 },
  weight: { type: String, default: '' },
  dimensions: { type: String, default: '' },
  color: { type: String, default: '' },
  capacity: { type: String, default: '' },
  model: { type: String, default: '' },
  installationAvailable: { type: Boolean, default: true },
  deliveryAvailable: { type: Boolean, default: true },
}, { timestamps: true });

// Category Schema
export const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  icon: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

// Brand Schema
export const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  logo: { type: String, default: '' },
  description: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

// Order Schema
export const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, default: '' },
    postalCode: { type: String, default: '54000' },
    notes: { type: String, default: '' },
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    thumbnail: { type: String, default: '' },
    brand: { type: String, default: '' },
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  couponCode: { type: String, default: '' },
  paymentMethod: { type: String, enum: ['cod', 'bank_transfer', 'call_confirmation'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Pending',
  },
  statusHistory: [{
    status: { type: String, required: true },
    note: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
  }],
  userId: { type: String, default: null },
}, { timestamps: true });

// Review Schema
export const ReviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: String, default: null },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
}, { timestamps: true });

// Coupon Schema
export const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  amount: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 10000 },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Contact Message Schema
export const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
}, { timestamps: true });

// Installment Inquiry Schema
export const InstallmentInquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  productId: { type: String, default: '' },
  productName: { type: String, required: true },
  plan: { type: String, required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'approved', 'rejected'], default: 'new' },
}, { timestamps: true });

// Site Settings Schema
export const SiteSettingSchema = new mongoose.Schema({
  businessName: { type: String, default: 'Hanif Centre Electronics Online Store' },
  logo: { type: String, default: '' },
  phone1: { type: String, default: '0305-7245533' },
  phone2: { type: String, default: '0300-9409477' },
  phone3: { type: String, default: '0326-7245533' },
  email: { type: String, default: 'haneefcentre@gmail.com' },
  address: { type: String, default: 'Yasin Mansion, Patiala Ground, 2 Link McLeod Road, near Hall Road, Lahore 54000, Pakistan' },
  branch2: { type: String, default: 'Near Sui Gas Interchange/Ring Road near Phase 4 DHA Lahore' },
  whatsapp: { type: String, default: '923057245533' },
  openingHours: { type: String, default: 'Mon–Sat: 11:00 AM – 8:30 PM | Sunday: Closed' },
  deliveryPolicy: { type: String, default: 'Delivery options available according to product weight and location across Lahore and nationwide.' },
  returnPolicy: { type: String, default: '7-day replacement warranty for manufacturing defects with original packaging and invoice.' },
  warrantyPolicy: { type: String, default: 'Official brand warranty covered at authorized service centers nationwide.' },
  facebookUrl: { type: String, default: '' },
  announcementBar: { type: String, default: '🔥 Ramadan & Summer Deals on Inverter ACs & Refrigerators | Call 0305-7245533 for Best Price' },
  heroTitle: { type: String, default: 'Smart Electronics. Better Living.' },
  heroSubtitle: { type: String, default: 'Discover quality electronics and home appliances from trusted brands at Hanif Centre.' },
}, { timestamps: true });
