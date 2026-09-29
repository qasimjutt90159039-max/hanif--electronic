import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check, AlertTriangle, Eye } from 'lucide-react';
import { api } from '../../services/api';
import { Product, Category, Brand } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminProducts: React.FC = () => {
  const { success, error } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Haier',
    category: 'DC Inverter AC',
    subcategory: '',
    sku: '',
    price: 0,
    oldPrice: 0,
    discountPercentage: 0,
    stock: 10,
    thumbnail: '',
    images: [] as string[],
    description: '',
    shortDescription: '',
    warranty: '1 Year Official Warranty',
    isFeatured: false,
    isDeal: false,
    isNew: false
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, bRes] = await Promise.all([
        api.getProducts({ limit: 120 }),
        api.getCategories(),
        api.getBrands()
      ]);
      if (pRes.success) setProducts(pRes.data);
      if (cRes.success) setCategories(cRes.data);
      if (bRes.success) setBrands(bRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      brand: brands[0]?.name || 'Haier',
      category: categories[0]?.name || 'DC Inverter AC',
      subcategory: '',
      sku: `HC-PRD-${Date.now().toString().slice(-4)}`,
      price: 50000,
      oldPrice: 55000,
      discountPercentage: 9,
      stock: 10,
      thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'],
      description: 'Official showroom product from verified manufacturers.',
      shortDescription: '',
      warranty: '1 Year Official Warranty',
      isFeatured: false,
      isDeal: false,
      isNew: true
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(p.id || p._id || null);
    setFormData({
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory || '',
      sku: p.sku,
      price: p.price,
      oldPrice: p.oldPrice || 0,
      discountPercentage: p.discountPercentage || 0,
      stock: p.stock,
      thumbnail: p.thumbnail,
      images: p.images || [p.thumbnail],
      description: p.description,
      shortDescription: p.shortDescription || '',
      warranty: p.warranty || '1 Year Official Warranty',
      isFeatured: p.isFeatured || false,
      isDeal: p.isDeal || false,
      isNew: p.isNew || false
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        success('Product removed successfully');
        setProducts(products.filter(p => (p.id || p._id) !== id));
      }
    } catch (err: any) {
      error(err.message || 'Failed to delete product');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.updateProduct(editingId, formData);
        if (res.success) {
          success('Product updated successfully!');
          setModalOpen(false);
          loadData();
        }
      } else {
        const res = await api.createProduct(formData);
        if (res.success) {
          success('Product created successfully!');
          setModalOpen(false);
          loadData();
        }
      }
    } catch (err: any) {
      error(err.message || 'Failed to save product');
    }
  };

  // Filter
  const filtered = products.filter(p => {
    const matchCat = selectedCat === 'all' || p.category.toLowerCase() === selectedCat.toLowerCase();
    const q = search.toLowerCase().trim();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Product Inventory</h1>
          <p className="text-xs text-gray-500">Manage catalogue prices, sale discounts, stock, and descriptions</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#1261A0] hover:bg-[#0D2B45] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, SKU or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full sm:w-auto text-xs p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <span className="text-xs text-gray-400 whitespace-nowrap">{filtered.length} products</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[750px]">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Listed Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const id = p.id || p._id || '';
                return (
                  <tr key={id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail || (p.images && p.images[0])}
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80';
                          }}
                          className="w-10 h-10 object-contain rounded-lg border bg-white p-1 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-gray-900 truncate">{p.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono">SKU: {p.sku} | Brand: {p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{p.category}</td>
                    <td className="p-4">
                      <span className="font-black text-gray-900 font-['Outfit'] block">
                        Rs. {p.price.toLocaleString()}
                      </span>
                      {p.oldPrice && p.oldPrice > p.price ? (
                        <span className="text-[10px] text-gray-400 line-through">
                          Rs. {p.oldPrice.toLocaleString()}
                        </span>
                      ) : null}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock <= 0
                          ? 'bg-rose-50 text-rose-700'
                          : p.stock <= 5
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {p.isFeatured && <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-1.5 py-0.5 rounded">Featured</span>}
                        {p.isDeal && <span className="bg-rose-50 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded">Deal</span>}
                        {p.isNew && <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">New</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-gray-500 hover:text-[#1261A0] rounded-lg hover:bg-sky-50"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(id, p.name)}
                          className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 font-['Outfit']">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1261A0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  >
                    {brands.map((b) => (
                      <option key={b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Old Strike-Through Price</label>
                  <input
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value, images: [e.target.value] })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Official Warranty Text</label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  ></textarea>
                </div>
              </div>

              {/* Badges Checklist */}
              <div className="flex gap-4 pt-2 border-t border-gray-100 text-xs">
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-1.5 font-bold cursor-pointer text-rose-600">
                  <input
                    type="checkbox"
                    checked={formData.isDeal}
                    onChange={(e) => setFormData({ ...formData, isDeal: e.target.checked })}
                  />
                  <span>Hot Deal</span>
                </label>
                <label className="flex items-center gap-1.5 font-bold cursor-pointer text-emerald-600">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  />
                  <span>New Model</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1261A0] text-white rounded-xl text-xs font-bold hover:bg-[#0D2B45]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
