import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="text-7xl sm:text-8xl font-black text-[#1261A0] tracking-tight font-['Outfit']">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">
        Page Not Found
      </h1>
      <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
        The page you are looking for does not exist or may have been relocated. Use the navigation buttons below to return to our electronics catalog.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 bg-[#071A2B] hover:bg-[#1261A0] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>
      </div>
    </div>
  );
};
