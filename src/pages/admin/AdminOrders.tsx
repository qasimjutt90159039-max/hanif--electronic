import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Eye, X, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminOrders: React.FC = () => {
  const { success, error } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOrders({
        orderStatus: statusFilter !== 'all' ? statusFilter : undefined,
        search: search.trim() ? search.trim() : undefined
      });
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus, `Updated via Admin Dashboard to ${newStatus}`);
      if (res.success) {
        success(`Order status updated to ${newStatus}`);
        setOrders(orders.map(o => (o.id === orderId || o._id === orderId ? res.data : o)));
        if (selectedOrder && (selectedOrder.id === orderId || selectedOrder._id === orderId)) {
          setSelectedOrder(res.data);
        }
      }
    } catch (err: any) {
      error(err.message || 'Failed to update order status');
    }
  };

  const statuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Customer Orders</h1>
        <p className="text-xs text-gray-500">Monitor showroom dispatches and update status tracking</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, phone, or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto text-xs p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
          >
            <option value="all">All Order Statuses</option>
            {statuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          <span className="text-xs text-gray-400 whitespace-nowrap">{orders.length} orders</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status & Action</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((ord) => {
                const id = ord.id || ord._id || '';
                return (
                  <tr key={id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-gray-900">{ord.orderNumber}</td>
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{ord.customer?.name}</p>
                      <p className="text-[11px] text-gray-500">{ord.customer?.phone} • {ord.customer?.city}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-700">
                        {ord.items?.length || 0} product(s)
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-gray-900">
                      Rs. {ord.total?.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-[#1261A0] hover:text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-base text-gray-900 font-['Outfit']">
                  Order Details ({selectedOrder.orderNumber})
                </h3>
                <span className="text-xs text-gray-400">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Box */}
            <div className="bg-gray-50 p-4 rounded-2xl text-xs space-y-1">
              <p><strong>Customer Name:</strong> {selectedOrder.customer?.name}</p>
              <p><strong>Phone:</strong> {selectedOrder.customer?.phone}</p>
              <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
              <p><strong>Address:</strong> {selectedOrder.customer?.address}, {selectedOrder.customer?.city}</p>
              {selectedOrder.customer?.notes && (
                <p className="text-amber-800"><strong>Notes:</strong> {selectedOrder.customer?.notes}</p>
              )}
            </div>

            {/* Products List */}
            <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto text-xs">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-gray-400 font-mono">SKU: {item.sku} | Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold font-mono">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="border-t border-gray-100 pt-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {selectedOrder.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>Rs. {selectedOrder.discount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 text-[#071A2B]">
                <span>Grand Total:</span>
                <span>Rs. {selectedOrder.total?.toLocaleString()}</span>
              </div>
            </div>

            {/* Status Update In Modal */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Change Status:</span>
              <div className="flex gap-1.5 flex-wrap">
                {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                  <button
                    key={s}
                    onClick={() => handleUpdateStatus(selectedOrder.id || (selectedOrder as any)._id, s)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      selectedOrder.orderStatus === s ? 'bg-[#1261A0] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
