import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Search,
  X,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Category, Brand } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const initialCategory = searchParams.get('category') || 'all';
  const initialBrand = searchParams.get('brand') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'featured';
  const initialPage = Number(searchParams.get('page')) || 1;
  const initialDeals = searchParams.get('deals') === 'true';
  const initialFeatured = searchParams.get('featured') === 'true';

  // Filters state
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState(initialBrand);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onlyDeals, setOnlyDeals] = useState(initialDeals);
  const [onlyFeatured, setOnlyFeatured] = useState(initialFeatured);

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync URL changes
  useEffect(() => {
    setCategory(searchParams.get('category') || 'all');
    setBrand(searchParams.get('brand') || 'all');
    setSearch(searchParams.get('search') || '');
    setSort(searchParams.get('sort') || 'featured');
    setPage(Number(searchParams.get('page')) || 1);
    setOnlyDeals(searchParams.get('deals') === 'true');
    setOnlyFeatured(searchParams.get('featured') === 'true');
  }, [searchParams]);

  // Load categories and brands on mount
  useEffect(() => {
    async function loadMeta() {
      try {
        const [cRes, bRes] = await Promise.all([
          api.getCategories(),
          api.getBrands()
        ]);
        if (cRes.success) setCategories(cRes.data);
        if (bRes.success) setBrands(bRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await api.getProducts({
          page,
          limit: 16,
          category: category !== 'all' ? category : undefined,
          brand: brand !== 'all' ? brand : undefined,
          search: search.trim() ? search.trim() : undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          inStock: inStockOnly,
          isDeal: onlyDeals,
          isFeatured: onlyFeatured,
          sort
        });

        if (res.success) {
          setProducts(res.data);
          setTotalCount(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        }
      } catch (err) {
        console.error('Failed to fetch shop products', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, brand, search, sort, page, minPrice, maxPrice, inStockOnly, onlyDeals, onlyFeatured]);

  // Update URL params
  const updateFilterParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleClearFilters = () => {
    setCategory('all');
    setBrand('all');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setOnlyDeals(false);
    setOnlyFeatured(false);
    setSort('featured');
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const activeFiltersCount =
    (category !== 'all' ? 1 : 0) +
    (brand !== 'all' ? 1 : 0) +
    (search ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onlyDeals ? 1 : 0) +
    (onlyFeatured ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb & Heading */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span>Home</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-gray-800">Electronics Shop</span>
          {category !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#1261A0] font-bold capitalize">{category.replace(/-/g, ' ')}</span>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">
              {category !== 'all'
                ? categories.find(c => c.slug === category)?.name || 'Products'
                : search
                ? `Search results for "${search}"`
                : 'All Electronics & Appliances'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing {products.length} of {totalCount} authentic products with warranty coverage
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm text-gray-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#1261A0]" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ================= DESKTOP SIDEBAR FILTERS ================= */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 font-['Outfit']">
                <Filter className="w-4 h-4 text-[#1261A0]" />
                Filter Catalog
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                Categories
              </h4>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() => updateFilterParam('category', 'all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    category === 'all'
                      ? 'bg-[#1261A0] text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id || c._id}
                    onClick={() => updateFilterParam('category', c.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      category === c.slug
                        ? 'bg-[#1261A0] text-white font-bold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                Brands
              </h4>
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                <button
                  onClick={() => updateFilterParam('brand', 'all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    brand === 'all'
                      ? 'bg-[#1261A0] text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Brands
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id || b._id}
                    onClick={() => updateFilterParam('brand', b.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      brand === b.slug
                        ? 'bg-[#1261A0] text-white font-bold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                Price (PKR)
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1261A0]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1261A0]"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => { setMinPrice('0'); setMaxPrice('50000'); }}
                  className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                >
                  Under 50k
                </button>
                <button
                  onClick={() => { setMinPrice('50000'); setMaxPrice('100000'); }}
                  className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                >
                  50k - 100k
                </button>
                <button
                  onClick={() => { setMinPrice('100000'); setMaxPrice(''); }}
                  className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                >
                  Above 100k
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="border-t border-gray-100 pt-4 space-y-2.5">
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#1261A0] focus:ring-0"
                />
                <span className="font-semibold">In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDeals}
                  onChange={(e) => setOnlyDeals(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-0"
                />
                <span className="font-semibold text-rose-600">Hot Deals & Sale</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={(e) => setOnlyFeatured(e.target.checked)}
                  className="rounded text-[#1261A0] focus:ring-0"
                />
                <span className="font-semibold text-[#1261A0]">Featured Recommendations</span>
              </label>
            </div>
          </div>
        </aside>

        {/* ================= PRODUCT GRID & CONTROLS ================= */}
        <main className="lg:col-span-3 space-y-5">
          {/* Top Control Bar: Sort & View Mode */}
          <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  updateFilterParam('sort', e.target.value);
                }}
                className="w-full sm:w-auto text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-[#1261A0] font-medium"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-gray-400 hidden sm:inline">View:</span>
              <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-[#1261A0] shadow-xs' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white text-[#1261A0] shadow-xs' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-400">Active Filters:</span>
              {category !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-sky-50 text-[#1261A0] text-xs font-semibold px-2.5 py-1 rounded-full border border-sky-200">
                  Category: {category}
                  <button onClick={() => updateFilterParam('category', 'all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {brand !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-sky-50 text-[#1261A0] text-xs font-semibold px-2.5 py-1 rounded-full border border-sky-200">
                  Brand: {brand}
                  <button onClick={() => updateFilterParam('brand', 'all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 bg-sky-50 text-[#1261A0] text-xs font-semibold px-2.5 py-1 rounded-full border border-sky-200">
                  Query: {search}
                  <button onClick={() => updateFilterParam('search', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {onlyDeals && (
                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-rose-200">
                  Deals Only
                  <button onClick={() => setOnlyDeals(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-rose-600 hover:underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Render */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'space-y-4'
              }
            >
              {products.map((p) => (
                <ProductCard key={p.id || p._id} product={p} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-['Outfit']">No Products Found</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                We couldn't find any products matching your selected filters. Try broadening your criteria or search query.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 rounded-xl bg-[#1261A0] text-white text-xs font-bold hover:bg-[#0D2B45] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => {
                  setPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-gray-600 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => {
                  setPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-base text-gray-900 font-['Outfit']">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile categories */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Category</h4>
                <select
                  value={category}
                  onChange={(e) => updateFilterParam('category', e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id || c._id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Mobile brands */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Brand</h4>
                <select
                  value={brand}
                  onChange={(e) => updateFilterParam('brand', e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                >
                  <option value="all">All Brands</option>
                  {brands.map((b) => (
                    <option key={b.id || b._id} value={b.slug}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-[#1261A0]"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-rose-600">
                  <input
                    type="checkbox"
                    checked={onlyDeals}
                    onChange={(e) => setOnlyDeals(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span>Hot Deals & Discounts</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-2">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-3 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 text-xs font-bold bg-[#1261A0] text-white rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
