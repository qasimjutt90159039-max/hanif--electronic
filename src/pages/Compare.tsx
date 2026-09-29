import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Trash2, ShoppingCart, Check, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { getProductImageUrl, handleProductImageError } from '../utils/productImages';

export const Compare: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto text-[#1261A0]">
          <Scale className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 font-['Outfit']">No Products to Compare</h2>
        <p className="text-sm text-gray-500">You can add up to 4 products to compare their specs side-by-side.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#1261A0] text-white text-xs font-bold rounded-xl shadow-sm">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">Product Comparison</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Comparing {compareItems.length} products</p>
        </div>
        <button
          onClick={clearCompare}
          className="text-xs font-bold text-rose-600 hover:underline"
        >
          Clear Comparison
        </button>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-xs sm:text-sm min-w-[650px]">
          <tbody>
            {/* 1. Images & Titles Row */}
            <tr className="border-b border-gray-100">
              <td className="p-4 font-bold text-gray-500 w-48 bg-gray-50/50">Product</td>
              {compareItems.map((p) => {
                const id = p.id || p._id || '';
                return (
                  <td key={id} className="p-4 text-center align-top relative min-w-[200px]">
                    <button
                      onClick={() => removeFromCompare(id)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-rose-600"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-32 h-32 mx-auto bg-gray-50 rounded-xl p-2 flex items-center justify-center mb-2">
                      <img
                        src={getProductImageUrl(p)}
                        alt={p.name}
                        onError={(e) => handleProductImageError(e, p)}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#1261A0] uppercase block">{p.brand}</span>
                    <Link to={`/product/${p.slug}`} className="font-bold text-gray-900 hover:text-[#1261A0] line-clamp-2 mt-1">
                      {p.name}
                    </Link>
                    <p className="text-sm font-black text-[#071A2B] mt-2 font-['Outfit']">Rs. {p.price.toLocaleString()}</p>
                    <button
                      onClick={() => addToCart(p)}
                      className="mt-3 w-full py-2 bg-[#1261A0] hover:bg-[#0D2B45] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </td>
                );
              })}
            </tr>

            {/* Category */}
            <tr className="border-b border-gray-100">
              <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Category</td>
              {compareItems.map((p) => (
                <td key={p.id || p._id} className="p-4 text-center font-medium text-gray-900">{p.category}</td>
              ))}
            </tr>

            {/* Model & SKU */}
            <tr className="border-b border-gray-100">
              <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Model / SKU</td>
              {compareItems.map((p) => (
                <td key={p.id || p._id} className="p-4 text-center font-mono text-gray-600">
                  {p.model || '-'} / {p.sku}
                </td>
              ))}
            </tr>

            {/* Capacity */}
            <tr className="border-b border-gray-100">
              <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Capacity / Size</td>
              {compareItems.map((p) => (
                <td key={p.id || p._id} className="p-4 text-center font-semibold text-gray-900">{p.capacity || '-'}</td>
              ))}
            </tr>

            {/* Warranty */}
            <tr className="border-b border-gray-100">
              <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Official Warranty</td>
              {compareItems.map((p) => (
                <td key={p.id || p._id} className="p-4 text-center text-emerald-700 font-semibold">{p.warranty || '1 Year Warranty'}</td>
              ))}
            </tr>

            {/* Stock Status */}
            <tr className="border-b border-gray-100">
              <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Availability</td>
              {compareItems.map((p) => (
                <td key={p.id || p._id} className="p-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    p.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {p.stock > 0 ? `In Stock (${p.stock})` : 'Out of Stock'}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
