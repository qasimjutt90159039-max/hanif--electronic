import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, Truck, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

export const TrackOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTrack = async (num: string, ph: string) => {
    if (!num.trim() || !ph.trim()) {
      setErrorMsg('Please enter both Order Number and Phone Number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.trackOrder(num.trim(), ph.trim());
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setErrorMsg(res.message || 'No matching order found.');
        setOrder(null);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to track order. Please verify your order number and phone.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber && phone) {
      fetchTrack(orderNumber, phone);
    }
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrack(orderNumber, phone);
  };

  const steps = [
    { key: 'Pending', label: 'Order Placed' },
    { key: 'Confirmed', label: 'Confirmed' },
    { key: 'Processing', label: 'Processing' },
    { key: 'Shipped', label: 'Shipped' },
    { key: 'Delivered', label: 'Delivered' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Processing':
      case 'Packed': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#1261A0] uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full">
          Real-Time Tracking
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 font-['Outfit']">
          Track Your Hanif Centre Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Enter your order reference code (e.g. HC-2026-000001) and phone number to monitor current dispatch status.
        </p>
      </div>

      {/* Tracking Search Form */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Order Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. HC-2026-000001"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0] font-mono font-semibold"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 0321-4455667"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#1261A0] hover:bg-[#0D2B45] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Track Order'}</span>
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Tracking Result View */}
      {order && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-8 shadow-sm animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block font-mono">Order Number</span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-['Outfit']">
                {order.orderNumber}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                order.orderStatus === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.orderStatus === 'Cancelled'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-sky-100 text-[#1261A0]'
              }`}>
                Current Status: {order.orderStatus}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                Booked on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Interactive Progress Timeline */}
          <div className="py-4">
            <div className="relative">
              {/* Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 hidden sm:block"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-[#1261A0] -translate-y-1/2 z-0 transition-all duration-500 hidden sm:block"
                style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
              ></div>

              {/* Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                {steps.map((st, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={st.key} className="flex sm:flex-col items-center gap-3 sm:text-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                          isDone
                            ? 'bg-[#1261A0] text-white shadow-md'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                        } ${isCurrent ? 'ring-4 ring-sky-100' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                          {st.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status History Timeline */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 font-['Outfit']">
                Status Activity Log
              </h4>
              <div className="space-y-3">
                {order.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs bg-gray-50 p-3 rounded-xl">
                    <Clock className="w-4 h-4 text-[#1261A0] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-900 mr-2">{h.status}</span>
                      <span className="text-gray-600">{h.note}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0">
                      {new Date(h.updatedAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items Summary */}
          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 font-['Outfit']">
              Ordered Products
            </h4>
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
                        className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1 border shrink-0"
                      />
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-gray-400 font-mono">Qty: {item.quantity} | SKU: {item.sku}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between text-sm font-black text-[#071A2B] font-['Outfit']">
              <span>Total Value:</span>
              <span>Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
