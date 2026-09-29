import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 font-['Outfit']">Your Wishlist is Empty</h2>
        <p className="text-sm text-gray-500">Save your favorite appliances to track prices and availability.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#1261A0] text-white text-xs font-bold rounded-xl shadow-sm">
          Explore Electronics
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">My Wishlist</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{wishlist.length} saved products</p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs font-bold text-rose-600 hover:underline"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {wishlist.map((p) => {
          const id = p.id || p._id || '';
          return (
            <div key={id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-4 flex flex-col justify-between">
              <div>
                <div className="h-44 bg-gray-50 rounded-xl p-3 flex items-center justify-center mb-3">
                  <img
                    src={p.thumbnail || (p.images && p.images[0])}
                    alt={p.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span className="text-[10px] font-bold text-[#1261A0] uppercase block">{p.brand}</span>
                <Link to={`/product/${p.slug}`} className="hover:text-[#1261A0]">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 mt-1">{p.name}</h3>
                </Link>
                <p className="text-sm font-black text-[#071A2B] mt-2 font-['Outfit']">Rs. {p.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => addToCart(p)}
                  className="flex-1 py-2 bg-[#1261A0] hover:bg-[#0D2B45] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
                <button
                  onClick={() => removeFromWishlist(id)}
                  className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
