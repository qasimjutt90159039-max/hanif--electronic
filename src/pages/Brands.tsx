import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award } from 'lucide-react';
import { api } from '../services/api';
import { Brand } from '../types';

export const Brands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await api.getBrands();
        if (res.success) setBrands(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBrands();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div>
        <span className="text-xs font-bold text-[#1261A0] uppercase tracking-wider block mb-1">
          Authorized Showroom Partners
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 font-['Outfit']">
          Featured Electronics Brands
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
          Shop products backed by official manufacturer warranties from the most respected electronics brands in Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {brands.map((b) => (
          <Link
            key={b.id || b._id}
            to={`/shop?brand=${b.slug}`}
            className="bg-white rounded-2xl border border-gray-200/80 hover:border-[#1261A0] p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform overflow-hidden">
              <Award className="w-8 h-8 text-[#1261A0]" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#1261A0] transition-colors font-['Outfit']">
              {b.name}
            </h3>
            <span className="text-[11px] text-gray-400 mt-1 flex items-center gap-0.5">
              <span>View catalog</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
