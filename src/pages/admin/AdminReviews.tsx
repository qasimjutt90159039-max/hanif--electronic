import React, { useState, useEffect } from 'react';
import { Star, Check, X, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';
import { Review } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminReviews: React.FC = () => {
  const { success, error } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      const res = await api.getAdminReviews();
      if (res.success) setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await api.moderateReview(id, status);
      if (res.success) {
        success(`Review marked as ${status}`);
        setReviews(reviews.map(r => (r.id === id || r._id === id ? { ...r, status } : r)));
      }
    } catch (err) {
      error('Failed to moderate review');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Customer Reviews</h1>
        <p className="text-xs text-gray-500">Moderate product ratings and comments submitted by customers</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[650px]">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review Title & Comment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((r) => {
                const id = r.id || r._id || '';
                return (
                  <tr key={id} className="hover:bg-gray-50/60">
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{r.userName}</p>
                      <p className="text-[11px] text-gray-400">{r.userEmail}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 max-w-sm">
                      <p className="font-bold text-gray-900">{r.title}</p>
                      <p className="text-gray-500 line-clamp-2 mt-0.5">{r.comment}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleModerate(id, 'approved')}
                          className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleModerate(id, 'rejected')}
                          className="p-1.5 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
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
