import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, PhoneCall, AlertTriangle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, discount, deliveryFee, total, couponCode, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const { error, success } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || 'Lahore',
    area: '',
    postalCode: '54000',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'call_confirmation'>('cod');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 font-['Outfit']">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500">Add products to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#1261A0] text-white text-xs font-bold rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      error('Please fill in all required delivery fields.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customer: formData,
        items: items.map(item => ({
          productId: item.product.id || item.product._id,
          quantity: item.quantity
        })),
        paymentMethod,
        couponCode: couponCode || undefined
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.data) {
        success(`Order #${res.data.orderNumber} successfully booked!`);
        clearCart();
        navigate('/order-success', { state: { order: res.data } });
      } else {
        error(res.message || 'Failed to place order');
      }
    } catch (err: any) {
      error(err.message || 'An error occurred during order processing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">Secure Checkout</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Complete your delivery details for Hanif Centre order confirmation
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT: CUSTOMER & PAYMENT DETAILS ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Contact & Delivery Address */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 font-['Outfit'] border-b border-gray-100 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#1261A0]" />
              Delivery Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Mohammad Bilal"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone Number (Active for Call Confirmation) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0300-1234567"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="bilal@example.com"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0] font-semibold"
                >
                  <option value="Lahore">Lahore (Same/Next Day Delivery)</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Gujranwala">Gujranwala</option>
                  <option value="Sialkot">Sialkot</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Other">Other Pakistani City</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Complete Street Address (House/Plaza, Street, Sector) *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. House 14, Street 6, Sector Y, DHA Phase 3"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Area / Neighborhood
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. DHA / Gulberg / Johar Town"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Order Notes / Special Delivery Instructions
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Call 1 hour prior to arrival; unboxing inspection requested"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                ></textarea>
              </div>
            </div>
          </div>

          {/* 2. Payment Method Options */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 font-['Outfit'] border-b border-gray-100 pb-3 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-[#1261A0]" />
              Payment Method
            </h3>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  paymentMethod === 'cod' ? 'border-[#1261A0] bg-sky-50/50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-[#1261A0]"
                />
                <div>
                  <span className="font-bold text-sm text-gray-900 block">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-xs text-gray-500">
                    Pay in cash at the time of delivery after inspecting your appliance carton and warranty seals.
                  </span>
                </div>
              </label>

              {/* Option 2: Bank Transfer */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  paymentMethod === 'bank_transfer' ? 'border-[#1261A0] bg-sky-50/50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 text-[#1261A0]"
                />
                <div>
                  <span className="font-bold text-sm text-gray-900 block">
                    Direct Bank Transfer / Online Banking
                  </span>
                  <span className="text-xs text-gray-500 block mb-2">
                    Transfer directly to Hanif Centre's verified business account. We dispatch upon payment confirmation.
                  </span>
                  {paymentMethod === 'bank_transfer' && (
                    <div className="p-3 bg-white border border-gray-200 rounded-xl text-xs space-y-1 font-mono text-gray-700">
                      <p><strong>Bank:</strong> Habib Bank Limited (HBL) / Meezan Bank</p>
                      <p><strong>Account Title:</strong> Hanif Centre Electronics</p>
                      <p><strong>Branch:</strong> McLeod Road Branch, Lahore</p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        *Account number and IBAN will be texted to your phone immediately upon order submission.
                      </p>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: WhatsApp / Phone Confirmation */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  paymentMethod === 'call_confirmation' ? 'border-[#1261A0] bg-sky-50/50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'call_confirmation'}
                  onChange={() => setPaymentMethod('call_confirmation')}
                  className="mt-1 text-[#1261A0]"
                />
                <div>
                  <span className="font-bold text-sm text-gray-900 block">
                    Phone / WhatsApp Confirmation (Pay after showroom call)
                  </span>
                  <span className="text-xs text-gray-500">
                    Submit your order request and have a Hanif Centre salesperson call you back to confirm availability and discuss convenient payment terms.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: ORDER REVIEW & CONFIRM BUTTON ================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 font-['Outfit'] border-b border-gray-100 pb-3">
              Order Review
            </h3>

            {/* Items scroll */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-100">
              {items.map(({ product, quantity }) => (
                <div key={product.id || product._id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 max-w-[180px]">
                    <span className="font-bold text-gray-500">{quantity}x</span>
                    <span className="truncate font-semibold text-gray-800">{product.name}</span>
                  </div>
                  <span className="font-bold text-gray-900 font-mono">
                    Rs. {(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs border-t border-gray-100 pt-4 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold text-gray-900">
                  {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100 text-sm font-black text-[#071A2B] font-['Outfit']">
                <span>Grand Total</span>
                <span className="text-lg">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Mandatory Price & Availability Warning */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Hanif Centre will contact you at <strong>{formData.phone || 'your phone'}</strong> to re-verify prices, stock, and delivery time before dispatch.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#1261A0] hover:bg-[#0D2B45] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{submitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
