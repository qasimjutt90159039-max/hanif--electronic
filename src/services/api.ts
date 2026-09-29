import {
  getLocalProducts,
  getLocalProductBySlug,
  getLocalProductById,
  getLocalCategories,
  getLocalBrands,
  getLocalSettings,
  validateLocalCoupon
} from './localData';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('hc_auth_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('hc_auth_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('hc_auth_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Not a JSON API response');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Products
  async getProducts(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, String(v));
      }
    });
    try {
      const res = await request<any>(`/products?${query.toString()}`);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res;
      }
      return getLocalProducts(params);
    } catch (e) {
      return getLocalProducts(params);
    }
  },

  async getProductBySlug(slug: string) {
    try {
      const res = await request<any>(`/products/slug/${slug}`);
      if (res && res.success && res.data) return res;
      return getLocalProductBySlug(slug);
    } catch (e) {
      return getLocalProductBySlug(slug);
    }
  },

  async getProductById(id: string) {
    try {
      const res = await request<any>(`/products/${id}`);
      if (res && res.success && res.data) return res;
      return getLocalProductById(id);
    } catch (e) {
      return getLocalProductById(id);
    }
  },

  createProduct(data: any) {
    return request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateProduct(id: string, data: any) {
    return request<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deleteProduct(id: string) {
    return request<any>(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Categories & Brands
  async getCategories() {
    try {
      const res = await request<any>('/categories');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) return res;
      return getLocalCategories();
    } catch (e) {
      return getLocalCategories();
    }
  },

  createCategory(data: any) {
    return request<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateCategory(id: string, data: any) {
    return request<any>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deleteCategory(id: string) {
    return request<any>(`/categories/${id}`, {
      method: 'DELETE'
    });
  },

  async getBrands() {
    try {
      const res = await request<any>('/brands');
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) return res;
      return getLocalBrands();
    } catch (e) {
      return getLocalBrands();
    }
  },

  createBrand(data: any) {
    return request<any>('/brands', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateBrand(id: string, data: any) {
    return request<any>(`/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deleteBrand(id: string) {
    return request<any>(`/brands/${id}`, {
      method: 'DELETE'
    });
  },

  // Orders
  createOrder(orderData: any) {
    return request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  trackOrder(orderNumber: string, phone: string) {
    return request<any>(`/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`);
  },

  getMyOrders() {
    return request<any>('/orders/my-orders');
  },

  getAdminOrders(params: { orderStatus?: string; search?: string } = {}) {
    const q = new URLSearchParams(params as any).toString();
    return request<any>(`/orders/admin/all?${q}`);
  },

  getOrderById(id: string) {
    return request<any>(`/orders/${id}`);
  },

  updateOrderStatus(id: string, orderStatus: string, note?: string) {
    return request<any>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus, note })
    });
  },

  // Coupons
  async validateCoupon(code: string, subtotal: number) {
    try {
      const res = await request<any>('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal })
      });
      if (res && res.success) return res;
      return validateLocalCoupon(code, subtotal);
    } catch (e) {
      return validateLocalCoupon(code, subtotal);
    }
  },

  getCoupons() {
    return request<any>('/coupons');
  },

  createCoupon(data: any) {
    return request<any>('/coupons', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deleteCoupon(id: string) {
    return request<any>(`/coupons/${id}`, {
      method: 'DELETE'
    });
  },

  // Reviews
  getProductReviews(productId: string) {
    return request<any>(`/reviews/product/${productId}`);
  },

  submitReview(data: any) {
    return request<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getAdminReviews() {
    return request<any>('/reviews/admin/all');
  },

  moderateReview(id: string, status: 'approved' | 'rejected') {
    return request<any>(`/reviews/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Contact & Installments
  submitContact(data: any) {
    return request<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getContactMessages() {
    return request<any>('/contact');
  },

  markMessageRead(id: string) {
    return request<any>(`/contact/${id}/read`, {
      method: 'PUT'
    });
  },

  submitInstallmentInquiry(data: any) {
    return request<any>('/installments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getInstallmentInquiries() {
    return request<any>('/installments');
  },

  updateInstallmentStatus(id: string, status: string) {
    return request<any>(`/installments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Settings
  async getSettings() {
    try {
      const res = await request<any>('/settings');
      if (res && res.success && res.data) return res;
      return getLocalSettings();
    } catch (e) {
      return getLocalSettings();
    }
  },

  updateSettings(data: any) {
    return request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Admin Stats & Customers
  getAdminStats() {
    return request<any>('/admin/stats');
  },

  getAdminCustomers() {
    return request<any>('/admin/customers');
  },

  // Auth
  register(data: any) {
    return request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  login(credentials: any) {
    return request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  getMe() {
    return request<any>('/auth/me');
  },

  updateProfile(data: any) {
    return request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};
