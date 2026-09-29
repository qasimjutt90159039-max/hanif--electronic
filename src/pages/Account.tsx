import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, Heart, LogOut, Clock, MapPin, Phone, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Order } from '../types';

export const Account: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isAdmin } = useAuth();
  const { success, error } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  // Edit profile state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Lahore');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadOrders() {
      try {
        const res = await api.getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadOrders();
  }, [user]);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile({ name, phone, address, city });
    setSaving(false);
    if (res.success) {
      success('Profile updated successfully!');
    } else {
      error(res.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#071A2B] to-[#1261A0] text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-['Outfit']">{user.name}</h1>
              {isAdmin && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2 border border-gray-200 hover:bg-rose-50 hover:border-rose-200 text-gray-700 hover:text-rose-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'orders' ? 'bg-[#1261A0] text-white' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'profile' ? 'bg-[#1261A0] text-white' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Addresses</span>
          </button>

          <Link
            to="/wishlist"
            className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>My Wishlist</span>
          </Link>
        </div>

        {/* Tab Body */}
        <div className="md:col-span-3">
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 font-['Outfit'] border-b border-gray-100 pb-3">
                Your Orders
              </h2>

              {loadingOrders ? (
                <div className="p-8 text-center text-xs text-gray-400">Loading orders...</div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id || ord._id} className="p-5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div>
                          <span className="font-bold text-sm text-gray-900 font-mono">{ord.orderNumber}</span>
                          <span className="text-xs text-gray-400 block sm:inline sm:ml-2">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold self-start sm:self-auto ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-sky-50 text-[#1261A0]'
                        }`}>
                          {ord.orderStatus}
                        </span>
                      </div>

                      <div className="divide-y divide-gray-50 text-xs">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between">
                            <span className="font-medium text-gray-800">{it.quantity}x {it.name}</span>
                            <span className="font-mono text-gray-900 font-semibold">
                              Rs. {(it.price * it.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <span className="text-gray-500">Total: <strong className="text-gray-900 text-sm font-mono">Rs. {ord.total.toLocaleString()}</strong></span>
                        <Link
                          to={`/track-order?orderNumber=${encodeURIComponent(ord.orderNumber)}&phone=${encodeURIComponent(ord.customer.phone)}`}
                          className="font-bold text-[#1261A0] hover:underline flex items-center gap-1"
                        >
                          <span>Track Dispatch</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center space-y-3">
                  <Package className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-sm text-gray-500">No orders placed yet.</p>
                  <Link to="/shop" className="inline-block px-5 py-2 bg-[#1261A0] text-white text-xs font-bold rounded-xl">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 font-['Outfit'] border-b border-gray-100 pb-3">
                Customer Profile
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Delivery Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#1261A0] text-white text-xs font-bold rounded-xl hover:bg-[#0D2B45] transition-colors"
                >
                  {saving ? 'Saving...' : 'Update Details'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
