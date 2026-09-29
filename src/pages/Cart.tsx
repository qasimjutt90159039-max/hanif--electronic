import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { getProductImageUrl, handleProductImageError } from '../utils/productImages';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    deliveryFee,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon
  } = useCart();
  const { settings } = useSettings();

  const [inputCode, setInputCode] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setApplying(true);
    await applyCoupon(inputCode.trim());
    setApplying(false);
    setInputCode('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 font-['Outfit']">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Explore Hanif Centre's extensive collection of DC Inverter ACs, Smart TVs, and Home Appliances.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#1261A0] hover:bg-[#0D2B45] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">Shopping Cart</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Review your selected appliances ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= ITEMS LIST ================= */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
            {items.map(({ product, quantity }) => {
              const id = product.id || product._id || '';
              return (
                <div key={id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={getProductImageUrl(product)}
                      alt={product.name}
                      onError={(e) => handleProductImageError(e, product)}
                      className="w-20 h-20 object-contain rounded-xl bg-gray-50 p-2 border border-gray-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[#1261A0] uppercase tracking-wider block">
                        {product.brand} • {product.category}
                      </span>
                      <Link to={`/product/${product.slug}`} className="hover:text-[#1261A0]">
                        <h3 className="text-sm font-bold text-gray-900 truncate max-w-xs font-['Outfit']">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">SKU: {product.sku}</p>
                      <p className="text-sm font-black text-[#071A2B] mt-1 sm:hidden">
                        Rs. {(product.price * quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50">
                      <button
                        onClick={() => updateQuantity(id, quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(id, quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right hidden sm:block min-w-[100px]">
                      <span className="text-sm font-black text-[#071A2B] block font-['Outfit']">
                        Rs. {(product.price * quantity).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-gray-400 block">
                        Rs. {product.price.toLocaleString()} each
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(id)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center px-2">
            <Link to="/shop" className="text-xs font-bold text-[#1261A0] hover:underline">
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Clear Entire Cart
            </button>
          </div>
        </div>

        {/* ================= ORDER SUMMARY CARD ================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-gray-900 font-['Outfit'] pb-3 border-b border-gray-100">
              Order Summary
            </h3>

            {/* Coupon Application */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Discount Coupon Code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div>
                    <span className="font-bold text-emerald-800 uppercase block">{appliedCoupon.code}</span>
                    <span className="text-emerald-700">Rs. {appliedCoupon.discount.toLocaleString()} savings applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME5 or HANIF1000"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0] uppercase font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={applying || !inputCode.trim()}
                    className="px-4 py-2.5 bg-[#071A2B] hover:bg-[#1261A0] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {applying ? 'Checking...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-sm text-gray-600 divide-y divide-gray-100">
              <div className="flex justify-between pt-2">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between pt-2 text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <div className="flex flex-col">
                  <span>Delivery Charges</span>
                  <span className="text-[10px] text-gray-400">
                    {subtotal >= 100000 ? 'Free Delivery (Promo)' : 'Standard City Delivery'}
                  </span>
                </div>
                <span className="font-bold text-gray-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `Rs. ${deliveryFee.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between pt-3 text-base font-black text-[#071A2B] font-['Outfit']">
                <span>Estimated Total</span>
                <span className="text-xl">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Price & Availability Notice */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Final price and delivery slot will be re-confirmed by phone call prior to dispatch.
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#1261A0] hover:bg-[#0D2B45] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
