import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: Product[];
  count: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('hc_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { success, toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('hc_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId || p._id === productId);
  };

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id || (product as any)._id)) {
      setWishlist(prev => [...prev, product]);
      success(`Added ${product.name} to wishlist`);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(p => p.id !== productId && p._id !== productId));
    toast('Removed from wishlist', 'info');
  };

  const toggleWishlist = (product: Product) => {
    const id = product.id || (product as any)._id;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      count: wishlist.length,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
