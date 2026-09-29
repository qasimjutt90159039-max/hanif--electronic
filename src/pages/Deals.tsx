import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';

export const Deals: React.FC = () => {
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await api.getProducts({ isDeal: true, limit: 30 });
        if (res.success) {
          setDeals(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-red-800 to-amber-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Limited Stock Promotions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit']">
            Hot Deals & Discount Offers
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
            Special seasonal savings on DC Inverter Air Conditioners, 4K Smart TVs, and Kitchen Appliances from trusted manufacturers.
          </p>
        </div>
      </div>

      {/* Deals Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-['Outfit']">
            Available Discount Deals ({deals.length})
          </h2>
          <span className="text-xs text-gray-500 font-medium">Prices subject to confirmation</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : deals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {deals.map((p) => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-500">
            No active deals right now. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
};
