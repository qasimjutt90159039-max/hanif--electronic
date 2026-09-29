import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';
import { Category } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCategories: React.FC = () => {
  const { success, error } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  });

  const loadCategories = async () => {
    try {
      const res = await api.getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80' });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id || cat._id || null);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.deleteCategory(id);
      success('Category deleted');
      setCategories(categories.filter(c => (c.id || c._id) !== id));
    } catch (err) {
      error('Failed to delete category');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateCategory(editingId, formData);
        success('Category updated');
      } else {
        await api.createCategory(formData);
        success('Category created');
      }
      setModalOpen(false);
      loadCategories();
    } catch (err: any) {
      error(err.message || 'Failed to save category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Store Categories</h1>
          <p className="text-xs text-gray-500">Manage all 18 product categories</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-[#1261A0] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const id = c.id || c._id || '';
          return (
            <div key={id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <img
                  src={c.image}
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-12 h-12 object-cover rounded-xl shrink-0"
                />
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{c.name}</h3>
                  <p className="text-[11px] text-gray-400 font-mono">slug: {c.slug}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-[#1261A0]">
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 font-['Outfit']">
                {editingId ? 'Edit Category' : 'New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
