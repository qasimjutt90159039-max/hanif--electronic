import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Award } from 'lucide-react';
import { api } from '../../services/api';
import { Brand } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminBrands: React.FC = () => {
  const { success, error } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  const loadBrands = async () => {
    try {
      const res = await api.getBrands();
      if (res.success) setBrands(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (b: Brand) => {
    setEditingId(b.id || b._id || null);
    setFormData({ name: b.name, slug: b.slug, description: b.description || '' });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete brand?')) return;
    try {
      await api.deleteBrand(id);
      success('Brand deleted');
      setBrands(brands.filter(b => (b.id || b._id) !== id));
    } catch (err) {
      error('Failed to delete brand');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateBrand(editingId, formData);
        success('Brand updated');
      } else {
        await api.createBrand(formData);
        success('Brand created');
      }
      setModalOpen(false);
      loadBrands();
    } catch (err: any) {
      error(err.message || 'Failed to save brand');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Store Brands</h1>
          <p className="text-xs text-gray-500">Manage all manufacturer brands represented in showroom</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-[#1261A0] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((b) => {
          const id = b.id || b._id || '';
          return (
            <div key={id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#1261A0] flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{b.name}</h3>
                  <p className="text-[10px] text-gray-400 font-mono">slug: {b.slug}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(b)} className="p-1.5 text-gray-400 hover:text-[#1261A0]">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(id)} className="p-1.5 text-gray-400 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 font-['Outfit']">
                {editingId ? 'Edit Brand' : 'New Brand'}
              </h3>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border rounded-xl outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#1261A0] text-white rounded-xl text-xs font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
