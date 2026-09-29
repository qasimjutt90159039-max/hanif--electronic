import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin } from 'lucide-react';
import { api } from '../../services/api';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await api.getAdminCustomers();
        if (res.success) setCustomers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Registered Customers</h1>
        <p className="text-xs text-gray-500">View customer contact details and delivery records</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[650px]">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">City</th>
                <th className="p-4">Role</th>
                <th className="p-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c.id || c._id} className="hover:bg-gray-50/60">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <p className="text-[11px] text-gray-400">{c.email}</p>
                  </td>
                  <td className="p-4 font-mono text-gray-700">{c.phone || '-'}</td>
                  <td className="p-4">{c.city || 'Lahore'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
