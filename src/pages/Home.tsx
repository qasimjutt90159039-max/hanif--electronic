import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Phone,
  MessageCircle,
  Flame,
  Tv,
  Wind,
  Refrigerator,
  Utensils,
  ChevronRight,
  Star
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { useSettings } from '../context/SettingsContext';

export const Home: React.FC = () => {
  const { settings } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [acDeals, setAcDeals] = useState<Product[]>([]);
  const [tvProducts, setTvProducts] = useState<Product[]>([]);
  const [refrigeratorProducts, setRefrigeratorProducts] = useState<Product[]>([]);
  const [kitchenProducts, setKitchenProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, featRes, acRes, tvRes, refRes, kitRes] = await Promise.all([
          api.getCategories().catch(() => ({ success: false, data: [] })),
          api.getProducts({ isFeatured: true, limit: 8 }).catch(() => ({ success: false, data: [] })),
          api.getProducts({ category: 'dc-inverter-ac', limit: 4 }).catch(() => ({ success: false, data: [] })),
          api.getProducts({ category: 'led-qled-tvs', limit: 4 }).catch(() => ({ success: false, data: [] })),
          api.getProducts({ category: 'refrigerators', limit: 4 }).catch(() => ({ success: false, data: [] })),
          api.getProducts({ category: 'kitchen-appliances', limit: 4 }).catch(() => ({ success: false, data: [] }))
        ]);

        if (catRes.success && catRes.data?.length > 0) setCategories(catRes.data);
        if (featRes.success && featRes.data?.length > 0) {
          setFeaturedProducts(featRes.data);
        } else {
          const fallbackProds = await api.getProducts({ limit: 8 });
          if (fallbackProds.success && fallbackProds.data?.length > 0) {
            setFeaturedProducts(fallbackProds.data);
          }
        }
        if (acRes.success && acRes.data?.length > 0) setAcDeals(acRes.data);
        if (tvRes.success && tvRes.data?.length > 0) setTvProducts(tvRes.data);
        if (refRes.success && refRes.data?.length > 0) setRefrigeratorProducts(refRes.data);
        if (kitRes.success && kitRes.data?.length > 0) setKitchenProducts(kitRes.data);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#071A2B] via-[#0D2B45] to-[#1261A0] text-white overflow-hidden">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#19A7CE_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading + Subtitle + CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#19A7CE] text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Electronics Landmark — Lahore</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-['Outfit']">
                Smart Electronics. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-[#19A7CE]">
                  Better Living.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-200 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {settings.heroSubtitle || 'Discover quality electronics and home appliances from trusted brands at Hanif Centre — serving Lahore with genuine warranties and transparent guidance.'}
              </p>

              {/* Price Confirmation Notice */}
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-xs text-sky-100 max-w-lg mx-auto lg:mx-0 flex items-start gap-2.5 backdrop-blur-sm">
                <span className="text-amber-400 font-bold shrink-0">⚡ Tip:</span>
                <span>
                  Electronics market rates can change daily. Call our showroom directly or WhatsApp for confirmed live stock and best final discounts.
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#19A7CE] hover:bg-[#1261A0] text-white font-bold text-sm shadow-xl shadow-cyan-900/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Shop Appliances</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/deals"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Explore Deals</span>
                </Link>
              </div>

              {/* Quick Store Details */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-300 font-medium border-t border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#19A7CE]" />
                  <span>100% Genuine Brand Warranties</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#19A7CE]" />
                  <span>Lahore Showroom Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column: Electronics Showcase Hero Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-gradient-to-b from-white/10 to-white/5 rounded-3xl p-6 border border-white/20 backdrop-blur-md shadow-2xl">
                <div className="relative rounded-2xl overflow-hidden bg-white p-6 shadow-inner">
                  <span className="absolute top-3 left-3 bg-[#071A2B] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Hot Summer Seller
                  </span>
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                    alt="T3 Inverter Air Conditioner"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-56 object-contain"
                  />
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1261A0] uppercase">DC Inverter AC</p>
                      <p className="text-sm font-bold text-gray-900">T3 Extreme Ambient Series</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 line-through">Rs. 189,000</span>
                      <p className="text-base font-black text-[#071A2B]">Rs. 172,000</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-white/90">
                  <span>Showroom: McLeod Road, Lahore</span>
                  <a href={`tel:${settings.phone1.replace(/[^0-9]/g, '')}`} className="font-bold text-[#19A7CE] hover:underline">
                    Call: {settings.phone1}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1261A0] block mb-1">
              Browse Store
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-[#1261A0] hover:text-[#0D2B45] flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat._id}
              to={`/shop?category=${cat.slug}`}
              className="bg-white rounded-2xl border border-gray-200/80 hover:border-[#1261A0] hover:shadow-md transition-all p-3 sm:p-4 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 flex items-center justify-center p-2 mb-3 group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-[#1261A0] transition-colors line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1261A0] block mb-1">
              Top Recommendations
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">
              Featured Electronics
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-[#1261A0] hover:text-[#0D2B45] flex items-center gap-1"
          >
            <span>See More</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featuredProducts.map((p) => <ProductCard key={p.id || p._id} product={p} />)}
        </div>
      </section>

      {/* 4. HOT DC INVERTER AC SECTION */}
      <section className="bg-gradient-to-r from-sky-50 to-indigo-50/50 py-12 border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1261A0] bg-white px-2.5 py-1 rounded-full border border-sky-200 mb-2">
                <Wind className="w-3.5 h-3.5 text-[#19A7CE]" />
                <span>Beat the Lahore Summer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">
                DC Inverter Air Conditioners
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                T3 Compressor models engineered for temperatures reaching 55°C with up to 66% power saving.
              </p>
            </div>
            <Link
              to="/shop?category=dc-inverter-ac"
              className="px-5 py-2.5 rounded-xl bg-[#071A2B] hover:bg-[#1261A0] text-white text-xs font-bold transition-colors shrink-0 self-start sm:self-auto"
            >
              Explore All ACs →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {acDeals.map((p) => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. LED & QLED TVs SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1261A0] bg-sky-50 px-2.5 py-1 rounded-full mb-1">
              <Tv className="w-3.5 h-3.5" />
              <span>Cinema & Living Room</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">
              LED & QLED Smart Televisions
            </h2>
          </div>
          <Link
            to="/shop?category=led-qled-tvs"
            className="text-xs sm:text-sm font-bold text-[#1261A0] hover:text-[#0D2B45] flex items-center gap-1"
          >
            <span>View All TVs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tvProducts.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </section>

      {/* 6. REFRIGERATORS & HOME APPLIANCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1261A0] bg-sky-50 px-2.5 py-1 rounded-full mb-1">
              <Refrigerator className="w-3.5 h-3.5" />
              <span>Fresh Food Preservation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">
              Refrigerators & Freezers
            </h2>
          </div>
          <Link
            to="/shop?category=refrigerators"
            className="text-xs sm:text-sm font-bold text-[#1261A0] hover:text-[#0D2B45] flex items-center gap-1"
          >
            <span>Explore Refrigerators</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {refrigeratorProducts.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </section>

      {/* 7. KITCHEN APPLIANCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1261A0] bg-sky-50 px-2.5 py-1 rounded-full mb-1">
              <Utensils className="w-3.5 h-3.5" />
              <span>Modern Kitchens</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit']">
              Kitchen Hoods, Hobs & Ranges
            </h2>
          </div>
          <Link
            to="/shop?category=kitchen-appliances"
            className="text-xs sm:text-sm font-bold text-[#1261A0] hover:text-[#0D2B45] flex items-center gap-1"
          >
            <span>View All Kitchen</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kitchenProducts.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </section>

      {/* 8. WHY CHOOSE HANIF CENTRE (TRUST SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#071A2B] to-[#0D2B45] rounded-3xl p-8 sm:p-12 text-white">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#19A7CE] uppercase tracking-wider block mb-2">
              The Hanif Centre Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit']">
              Why Lahore Chooses Hanif Centre
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2">
              Serving customers from McLeod Road & Hall Road with genuine electronics and real showroom warranty cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-[#1261A0] text-white flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base mb-1 font-['Outfit']">Genuine Products</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Shop authentic electronics directly sourced from verified brand manufacturers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-[#1261A0] text-white flex items-center justify-center mb-4">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base mb-1 font-['Outfit']">Warranty Support</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Official warranty information clearly stamped on every eligible product.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-[#1261A0] text-white flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base mb-1 font-['Outfit']">Nationwide Delivery</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Carefully dispatched across Lahore and Pakistani cities via trusted logistics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-[#1261A0] text-white flex items-center justify-center mb-4">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base mb-1 font-['Outfit']">Easy Support</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Contact Hanif Centre directly through direct showroom phone or WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. WHATSAPP & PHONE CALL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#1261A0] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
              Need Help Deciding or Bulk Rates?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-['Outfit']">
              Talk to a Hanif Centre Specialist Today
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              Get advice on AC tonnages, room sizes, refrigerator capacities, or corporate wholesale inquiries.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={`tel:${settings.phone1.replace(/[^0-9]/g, '')}`}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#071A2B] hover:bg-[#0D2B45] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call: {settings.phone1}</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Hello Hanif Centre, I would like to inquire about appliances.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white text-transparent" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
