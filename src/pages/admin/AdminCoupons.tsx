import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Ticket, X } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCoupons: React.FC = () => {
  const { success, error } = useToast();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    amount: 10,
    minOrder: 30000,
    maxDiscount: 5000
  });

  const loadCoupons = async () => {
    try {
      const res = await api.getCoupons();
      if (res.success) setCoupons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete coupon?')) return;
    try {
      await api.deleteCoupon(id);
      success('Coupon deleted');
      setCoupons(coupons.filter(c => (c.id || c._id) !== id));
    } catch (err) {
      error('Failed to delete coupon');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createCoupon(formData);
      if (res.success) {
        success('Coupon code created');
        setModalOpen(false);
        loadCoupons();
      }
    } catch (err: any) {
      error(err.message || 'Failed to create coupon');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Discount Coupons</h1>
          <p className="text-xs text-gray-500">Configure promotional vouchers for checkout discounts</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-[#1261A0] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((cpn) => {
          const id = cpn.id || cpn._id || '';
          return (
            <div key={id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-medium">Coupon Code:</span>
                  <h3 className="text-base font-black text-[#1261A0] font-mono tracking-wider">{cpn.code}</h3>
                </div>
                <button onClick={() => handleDelete(id)} className="text-gray-400 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-xl font-medium">
                <p>Discount: <strong>{cpn.amount}{cpn.discountType === 'percentage' ? '%' : ' PKR'} off</strong></p>
                <p>Min Order: Rs. {cpn.minOrder?.toLocaleString()}</p>
                <p>Max Savings: Rs. {cpn.maxDiscount?.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 font-['Outfit']">New Coupon</h3>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER10"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full text-xs p-2.5 bg-gray-50 border rounded-xl outline-none font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Discount Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border rounded-xl outline-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed PKR Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Amount *</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-gray-50 border rounded-xl outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Min Order (PKR)</label>
                <input
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-gray-50 border rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#1261A0] text-white rounded-xl text-xs font-bold">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
