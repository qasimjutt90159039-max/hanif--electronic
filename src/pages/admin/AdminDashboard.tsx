import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Banknote,
  ShoppingBag,
  Clock,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getAdminStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading admin statistics...</div>;
  }

  const statCards = [
    { title: 'Total Sales', value: `Rs. ${(stats?.totalSales || 0).toLocaleString()}`, icon: Banknote, color: 'bg-emerald-500' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'bg-[#1261A0]' },
    { title: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: 'bg-amber-500' },
    { title: 'Store Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-indigo-500' },
    { title: 'Registered Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'bg-sky-500' },
    { title: 'Low Stock Items', value: stats?.lowStock || 0, icon: AlertTriangle, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">Showroom Overview</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Real-time metrics for Hanif Centre Electronics store operations
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{card.title}</span>
                <span className="text-xl sm:text-2xl font-black text-gray-900 mt-1 block font-['Outfit']">{card.value}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center shadow-md`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Orders & Category Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-base text-gray-900 font-['Outfit']">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-[#1261A0] hover:underline flex items-center gap-1">
              <span>View all orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[500px]">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Order Number</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(stats?.recentOrders || []).map((ord: any) => (
                  <tr key={ord.id || ord._id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-mono font-bold text-gray-900">{ord.orderNumber}</td>
                    <td className="p-3 font-semibold text-gray-800">{ord.customer?.name}</td>
                    <td className="p-3 font-mono font-bold">Rs. {ord.total?.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ord.orderStatus === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-gray-900 font-['Outfit'] pb-3 border-b border-gray-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1261A0]" />
            Products by Category
          </h3>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {stats?.categoryCounts &&
              Object.entries(stats.categoryCounts).map(([catName, count]: [string, any]) => (
                <div key={catName} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-xs">
                  <span className="font-semibold text-gray-800">{catName}</span>
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-[#1261A0]">
                    {count} items
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
