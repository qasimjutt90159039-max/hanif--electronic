import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface CompareContextType {
  compareItems: Product[];
  count: number;
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('hc_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { toast, success, error } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('hc_compare', JSON.stringify(compareItems));
    } catch (e) {
      console.error(e);
    }
  }, [compareItems]);

  const isInCompare = (productId: string) => {
    return compareItems.some(p => p.id === productId || p._id === productId);
  };

  const addToCompare = (product: Product) => {
    const id = product.id || (product as any)._id;
    if (isInCompare(id)) {
      toast('Product is already in your comparison table', 'info');
      return;
    }

    if (compareItems.length >= 4) {
      error('You can compare a maximum of 4 products simultaneously.');
      return;
    }

    // Check sensible category comparison if items already exist
    if (compareItems.length > 0) {
      const existingCategory = compareItems[0].category.toLowerCase();
      const newCategory = product.category.toLowerCase();
      if (existingCategory !== newCategory) {
        toast(`Note: Comparing products across different categories (${compareItems[0].category} vs ${product.category}).`, 'info');
      }
    }

    setCompareItems(prev => [...prev, product]);
    success(`Added ${product.name} to comparison`);
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems(prev => prev.filter(p => p.id !== productId && p._id !== productId));
    toast('Removed from comparison', 'info');
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider value={{
      compareItems,
      count: compareItems.length,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
