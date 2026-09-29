import React, { useState, useEffect } from 'react';
import { Phone, Clock, CreditCard } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminInstallments: React.FC = () => {
  const { success, error } = useToast();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInquiries = async () => {
    try {
      const res = await api.getInstallmentInquiries();
      if (res.success) setInquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.updateInstallmentStatus(id, status);
      success(`Status set to ${status}`);
      setInquiries(inquiries.map(i => (i.id === id || i._id === id ? { ...i, status } : i)));
    } catch (err) {
      error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Installment Applications</h1>
        <p className="text-xs text-gray-500">Customer requests for installment plans on appliances</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[650px]">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Requested Product</th>
                <th className="p-4">Desired Plan</th>
                <th className="p-4">City & Notes</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.map((inq) => {
                const id = inq.id || inq._id || '';
                return (
                  <tr key={id} className="hover:bg-gray-50/60">
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{inq.name}</p>
                      <p className="text-[11px] text-gray-500 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {inq.phone}
                      </p>
                    </td>
                    <td className="p-4 font-bold text-gray-800">{inq.productName}</td>
                    <td className="p-4">
                      <span className="bg-sky-50 text-[#1261A0] px-2 py-0.5 rounded font-bold">
                        {inq.plan}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="font-semibold text-gray-700">{inq.city}</p>
                      {inq.message && <p className="text-gray-500 line-clamp-1">{inq.message}</p>}
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={inq.status}
                        onChange={(e) => updateStatus(id, e.target.value)}
                        className="text-xs p-1.5 border rounded-lg bg-gray-50 font-medium"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
