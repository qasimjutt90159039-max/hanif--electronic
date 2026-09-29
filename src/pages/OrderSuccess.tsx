import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, MessageCircle, Phone, Printer } from 'lucide-react';
import { Order } from '../types';
import { useSettings } from '../context/SettingsContext';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const { settings } = useSettings();
  const order: Order | undefined = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const whatsappMessage = encodeURIComponent(
    `Hello Hanif Centre, I have placed order #${order.orderNumber} on your online store for Rs. ${order.total.toLocaleString()}.\n\nCustomer: ${order.customer.name}\nPhone: ${order.customer.phone}\n\nPlease confirm order receipt.`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Celebration Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 text-center space-y-4 shadow-sm">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          Order Successfully Received
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 font-['Outfit']">
          Thank You For Shopping at Hanif Centre!
        </h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
          Your order reference number is{' '}
          <strong className="text-[#1261A0] font-mono text-base">{order.orderNumber}</strong>.
          Our team in Lahore is preparing your order and will contact you via phone shortly.
        </p>

        {/* WhatsApp & Call Follow-up */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <a
            href={`https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white text-transparent" />
            <span>Send Order via WhatsApp</span>
          </a>

          <Link
            to={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}&phone=${encodeURIComponent(order.customer.phone)}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#071A2B] hover:bg-[#1261A0] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Status</span>
          </Link>
        </div>
      </div>

      {/* Order Details Receipt */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-gray-900 font-['Outfit']">Order Summary</h3>
            <p className="text-xs text-gray-400 font-mono">Date: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Receipt
          </button>
        </div>

        {/* Customer & Shipping info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-2xl">
          <div>
            <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">Customer:</span>
            <p className="font-bold text-gray-900">{order.customer.name}</p>
            <p className="text-gray-600">{order.customer.phone}</p>
            <p className="text-gray-600">{order.customer.email}</p>
          </div>
          <div>
            <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">Delivery Address:</span>
            <p className="text-gray-900 font-medium">{order.customer.address}</p>
            <p className="text-gray-600">{order.customer.city} {order.customer.area && `(${order.customer.area})`}</p>
            <p className="text-gray-600">Payment: <strong className="uppercase">{order.paymentMethod.replace('_', ' ')}</strong></p>
          </div>
        </div>

        {/* Items */}
        <div className="divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/products/test.svg';
                    }}
                    className="w-12 h-12 object-contain rounded-lg border bg-white p-1 shrink-0"
                  />
                )}
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-gray-400 font-mono">SKU: {item.sku} | Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-gray-900 text-sm font-mono">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-100 pt-4 space-y-1.5 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-bold text-gray-900">Rs. {order.subtotal.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount ({order.couponCode}):</span>
              <span>- Rs. {order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery:</span>
            <span className="font-bold text-gray-900">{order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee.toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100 text-base font-black text-[#071A2B] font-['Outfit']">
            <span>Total Amount:</span>
            <span>Rs. {order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1261A0] hover:underline"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
