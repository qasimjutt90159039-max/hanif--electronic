import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Scale,
  Phone,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Star,
  ChevronRight,
  Plus,
  Minus,
  AlertTriangle,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useSettings } from '../context/SettingsContext';
import { getProductImageUrl, handleProductImageError } from '../utils/productImages';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { settings } = useSettings();
  const { success, error } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'features' | 'warranty' | 'delivery' | 'reviews'>('specs');
  const [loading, setLoading] = useState(true);

  // Review Form
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        if (res.success && res.data) {
          const prod: Product = res.data;
          setProduct(prod);
          setSelectedImage(prod.thumbnail || (prod.images && prod.images[0]) || '');
          setQuantity(1);

          // Fetch related products in same category
          const relRes = await api.getProducts({ category: prod.category, limit: 4 });
          if (relRes.success) {
            setRelated(relRes.data.filter((p: Product) => (p.id || p._id) !== (prod.id || prod._id)));
          }

          // Fetch reviews
          const revRes = await api.getProductReviews(prod.id || prod._id || '');
          if (revRes.success) {
            setReviews(revRes.data);
          }
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-8">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 font-['Outfit']">Product Not Found</h2>
        <p className="text-sm text-gray-500">The product you are looking for may have been updated or removed.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#1261A0] text-white rounded-xl text-xs font-bold">
          Back to Store
        </Link>
      </div>
    );
  }

  const id = product.id || product._id || '';
  const inWishlist = isInWishlist(id);
  const inCompare = isInCompare(id);
  const isOutOfStock = product.stock <= 0 || product.stockStatus === 'out_of_stock';

  // Dynamic WhatsApp message as specified in section 18
  const whatsappInquiryMessage = encodeURIComponent(
    `Hello Hanif Centre, I am interested in:\n\nProduct: ${product.name}\nSKU: ${product.sku}\nQuantity: ${quantity}\nCurrent Listed Price: Rs. ${product.price.toLocaleString()}\n\nPlease confirm availability and final price.`
  );

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewTitle || !reviewComment) {
      error('Please complete all review fields.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.submitReview({
        productId: id,
        userName: reviewerName,
        userEmail: reviewerEmail || 'customer@example.com',
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment
      });

      if (res.success) {
        success('Review submitted successfully!');
        setReviews([res.data, ...reviews]);
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err: any) {
      error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <Link to="/" className="hover:text-[#1261A0]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-[#1261A0]">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-[#1261A0]">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT: IMAGE GALLERY ================= */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 flex items-center justify-center h-80 sm:h-96 md:h-[420px] shadow-sm relative overflow-hidden group">
            {product.discountPercentage ? (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                -{product.discountPercentage}% OFF
              </span>
            ) : null}

            <img
              src={selectedImage || getProductImageUrl(product)}
              alt={product.name}
              onError={(e) => handleProductImageError(e, product)}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl p-2 bg-white border shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#1261A0] ring-2 ring-[#1261A0]/20 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    onError={(e) => handleProductImageError(e, product)}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT: PRODUCT DETAILS & ACTIONS ================= */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#1261A0] bg-sky-50 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-600 font-semibold">{product.category}</span>
              {product.sku && (
                <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 leading-tight font-['Outfit']">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800">{product.rating || 4.8} / 5</span>
              <span className="text-xs text-gray-400">({product.reviewCount || 12} customer reviews)</span>
            </div>
          </div>

          {/* Price Block */}
          <div className="bg-[#F5F7FA] rounded-2xl p-4 border border-gray-200/80">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-[#071A2B] font-['Outfit']">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > product.price ? (
                <span className="text-sm text-gray-400 line-through">
                  Rs. {product.oldPrice.toLocaleString()}
                </span>
              ) : null}
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className={`font-bold px-2 py-0.5 rounded ${
                isOutOfStock ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isOutOfStock ? 'Temporarily Out of Stock' : `Available in Showroom (${product.stock} units left)`}
              </span>
            </div>
          </div>

          {/* Mandatory "Price & Availability Confirmation" notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Price & Availability Confirmation Notice</span>
            </div>
            <p className="leading-relaxed">
              Electronics prices and stock levels can fluctuate due to currency rates and brand adjustments. Please confirm live showroom pricing and delivery timing before placing your order.
            </p>
          </div>

          {/* Quantity & Cart Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Wishlist & Compare Toggles */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  inWishlist ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-gray-300 text-gray-700 hover:text-rose-600'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={() => addToCompare(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  inCompare ? 'bg-sky-50 border-sky-300 text-[#1261A0]' : 'bg-white border-gray-300 text-gray-700 hover:text-[#1261A0]'
                }`}
                title="Add to Comparison"
              >
                <Scale className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-6 rounded-xl bg-[#1261A0] hover:bg-[#0D2B45] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-6 rounded-xl bg-[#071A2B] hover:bg-gray-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <span>Buy Now with COD</span>
              </button>
            </div>

            {/* Direct Confirmation Hotline & WhatsApp Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${settings.phone1.replace(/[^0-9]/g, '')}`}
                className="w-full py-3 px-4 rounded-xl border-2 border-[#1261A0] text-[#1261A0] hover:bg-[#1261A0] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Showroom for Price</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp}?text=${whatsappInquiryMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>WhatsApp Price Inquiry</span>
              </a>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1261A0] shrink-0" />
              <span>{product.warranty || 'Official Warranty'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1261A0] shrink-0" />
              <span>Lahore Showroom Pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#1261A0] shrink-0" />
              <span>7-Day Return Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABS: SPECS, DESC, FEATURES, WARRANTY, REVIEWS ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Tab Headers */}
        <div className="flex items-center border-b border-gray-200 overflow-x-auto bg-gray-50/50">
          {[
            { id: 'specs', label: 'Specifications' },
            { id: 'features', label: 'Features' },
            { id: 'desc', label: 'Description' },
            { id: 'warranty', label: 'Warranty & Delivery' },
            { id: 'reviews', label: `Customer Reviews (${reviews.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#1261A0] text-[#1261A0] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {activeTab === 'specs' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-bold text-lg text-gray-900 font-['Outfit']">Technical Specifications</h3>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden text-sm">
                <div className="grid grid-cols-2 p-3 bg-gray-50">
                  <span className="font-semibold text-gray-700">Brand</span>
                  <span className="text-gray-900">{product.brand}</span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span className="font-semibold text-gray-700">Category</span>
                  <span className="text-gray-900">{product.category}</span>
                </div>
                {product.model && (
                  <div className="grid grid-cols-2 p-3 bg-gray-50">
                    <span className="font-semibold text-gray-700">Model Number</span>
                    <span className="text-gray-900">{product.model}</span>
                  </div>
                )}
                {product.capacity && (
                  <div className="grid grid-cols-2 p-3">
                    <span className="font-semibold text-gray-700">Capacity / Size</span>
                    <span className="text-gray-900">{product.capacity}</span>
                  </div>
                )}
                {product.color && (
                  <div className="grid grid-cols-2 p-3 bg-gray-50">
                    <span className="font-semibold text-gray-700">Color Finish</span>
                    <span className="text-gray-900">{product.color}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="grid grid-cols-2 p-3">
                    <span className="font-semibold text-gray-700">Dimensions</span>
                    <span className="text-gray-900">{product.dimensions}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="grid grid-cols-2 p-3 bg-gray-50">
                    <span className="font-semibold text-gray-700">Net Weight</span>
                    <span className="text-gray-900">{product.weight}</span>
                  </div>
                )}
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, val], idx) => (
                    <div key={key} className={`grid grid-cols-2 p-3 ${idx % 2 === 0 ? '' : 'bg-gray-50'}`}>
                      <span className="font-semibold text-gray-700">{key}</span>
                      <span className="text-gray-900">{val}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-bold text-lg text-gray-900 font-['Outfit']">Key Product Features</h3>
              <ul className="space-y-3">
                {(product.features && product.features.length > 0
                  ? product.features
                  : [
                      'High efficiency energy saving operation designed for Pakistani electrical standards',
                      'Official brand warranty backed by certified authorized service centers',
                      'Durable components designed for heavy domestic and commercial use'
                    ]
                ).map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'desc' && (
            <div className="max-w-3xl space-y-4 text-sm text-gray-700 leading-relaxed">
              <h3 className="font-bold text-lg text-gray-900 font-['Outfit']">Product Overview</h3>
              <p>{product.description}</p>
              {product.shortDescription && (
                <p className="p-4 bg-sky-50 rounded-xl text-[#1261A0] font-medium border border-sky-100">
                  {product.shortDescription}
                </p>
              )}
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="max-w-3xl space-y-6 text-sm text-gray-700">
              <div>
                <h3 className="font-bold text-lg text-gray-900 font-['Outfit'] mb-2">Official Warranty Policy</h3>
                <p className="leading-relaxed">
                  Every product purchased from Hanif Centre is 100% genuine and comes with the manufacturer's official warranty card.
                  Current warranty for this item: <strong>{product.warranty || '1 Year Official Warranty'}</strong>.
                  Warranty can be claimed directly at any authorized brand service center across Lahore, Karachi, Islamabad, and nationwide.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-900 font-['Outfit'] mb-2">Delivery & Inspection</h3>
                <p className="leading-relaxed">
                  For Lahore orders, we offer fast delivery or self-pickup from our showroom at Yasin Mansion, McLeod Road near Hall Road.
                  Customers are invited to unbox and inspect product packaging at the time of delivery before final signoff.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h3 className="font-bold text-lg text-gray-900 font-['Outfit'] mb-4">Customer Feedback</h3>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id || rev._id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-gray-900">{rev.userName}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <h4 className="font-bold text-xs text-gray-800">{rev.title}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No reviews yet for this product. Be the first to share your feedback!</p>
                )}
              </div>

              {/* Submit Review Form */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold text-base text-gray-900 font-['Outfit'] mb-4">Write a Product Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="e.g. Asim Raza"
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-[#1261A0]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email (for verification)</label>
                      <input
                        type="email"
                        value={reviewerEmail}
                        onChange={(e) => setReviewerEmail(e.target.value)}
                        placeholder="asim@example.com"
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-[#1261A0]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Star Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setReviewRating(num)}
                          className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                            reviewRating === num ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-white border-gray-200'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${num <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                          <span>{num} Star</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Review Headline *</label>
                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Excellent cooling and fast Lahore delivery"
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-[#1261A0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Review *</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with the appliance..."
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:border-[#1261A0]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-[#1261A0] hover:bg-[#0D2B45] text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      {related.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-['Outfit']">
              Related Appliances in {product.category}
            </h2>
            <Link
              to={`/shop?category=${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="text-xs sm:text-sm font-bold text-[#1261A0] hover:underline"
            >
              View More →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
