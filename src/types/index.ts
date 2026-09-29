export interface Product {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory?: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  stock: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  images: string[];
  thumbnail: string;
  specifications?: Record<string, string>;
  features?: string[];
  warranty?: string;
  tags?: string[];
  isFeatured?: boolean;
  isDeal?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  weight?: string;
  dimensions?: string;
  color?: string;
  capacity?: string;
  model?: string;
  installationAvailable?: boolean;
  deliveryAvailable?: boolean;
  createdAt?: string;
}

export interface Category {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  sortOrder?: number;
  status?: 'active' | 'inactive';
}

export interface Brand {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  thumbnail: string;
  brand: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  area?: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  _id?: string;
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode?: string;
  paymentMethod: 'cod' | 'bank_transfer' | 'call_confirmation';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  statusHistory: Array<{
    status: string;
    note: string;
    updatedAt: string;
  }>;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  role: 'customer' | 'admin';
  savedAddresses?: Array<{
    label: string;
    address: string;
    city: string;
    phone: string;
  }>;
}

export interface SiteSettings {
  businessName: string;
  logo?: string;
  phone1: string;
  phone2: string;
  phone3: string;
  email: string;
  address: string;
  branch2?: string;
  whatsapp: string;
  openingHours: string;
  deliveryPolicy: string;
  returnPolicy: string;
  warrantyPolicy: string;
  facebookUrl?: string;
  announcementBar: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface Review {
  _id?: string;
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
