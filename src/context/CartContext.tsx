import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode: string;
  appliedCoupon: any | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hc_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const { toast, success, error } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('hc_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      error(`Sorry, ${product.name} is currently out of stock.`);
      return;
    }

    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id || item.product._id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          toast(`Maximum available stock reached (${product.stock} items).`, 'info');
          return prev.map(item =>
            (item.product.id === product.id || item.product._id === product.id)
              ? { ...item, quantity: product.stock }
              : item
          );
        }
        success(`Updated quantity for ${product.name}`);
        return prev.map(item =>
          (item.product.id === product.id || item.product._id === product.id)
            ? { ...item, quantity: newQty }
            : item
        );
      }
      success(`Added ${product.name} to cart`);
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId && item.product._id !== productId));
    toast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId || item.product._id === productId) {
          const maxStock = item.product.stock || 10;
          if (quantity > maxStock) {
            toast(`Only ${maxStock} items currently available in stock.`, 'info');
            return { ...item, quantity: maxStock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.success && res.data) {
        setAppliedCoupon(res.data);
        setCouponCode(code.toUpperCase());
        success(`Coupon "${code.toUpperCase()}" applied: Rs. ${res.data.discount.toLocaleString()} off!`);
        return true;
      }
      error(res.message || 'Invalid coupon code');
      return false;
    } catch (err: any) {
      error(err.message || 'Failed to apply coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast('Coupon removed', 'info');
  };

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  // Free delivery for orders above Rs. 100,000
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 100000 ? 0 : 1500;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      discount,
      deliveryFee,
      total,
      couponCode,
      appliedCoupon,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
