import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Scale, Star, Eye, MessageCircle, Check, X } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useSettings } from '../../context/SettingsContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { settings } = useSettings();

  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(product.thumbnail || (product.images && product.images[0]) || '');

  const id = product.id || product._id || '';
  const inWishlist = isInWishlist(id);
  const inCompare = isInCompare(id);
  const isOutOfStock = (product.stock ?? 0) <= 0 || product.stockStatus === 'out_of_stock';
  const isLowStock = (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 4;

  const whatsappMessage = encodeURIComponent(
    `Hello Hanif Centre, I am interested in:\n\nProduct: ${product.name}\nSKU: ${product.sku}\nCurrent Listed Price: Rs. ${(product.price ?? 0).toLocaleString()}\n\nPlease confirm availability and final price.`
  );

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 hover:border-[#1261A0]/40 shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-center group">
        {/* Product Image */}
        <div className="w-full sm:w-48 h-48 shrink-0 relative bg-gray-50 rounded-xl overflow-hidden p-3 flex items-center justify-center">
          <img
            src={product.thumbnail || (product.images && product.images[0])}
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.discountPercentage ? (
            <span className="absolute top-2 left-2 bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm">
              -{product.discountPercentage}%
            </span>
          ) : null}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1261A0] bg-sky-50 px-2 py-0.5 rounded">
              {product.brand}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">{product.category}</span>
            {product.sku && <span className="text-[11px] text-gray-400 font-mono">({product.sku})</span>}
          </div>

          <Link to={`/product/${product.slug}`}>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#1261A0] transition-colors line-clamp-2 mb-2 font-['Outfit']">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {product.shortDescription || product.description}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
              <span className="text-gray-400 font-normal">({product.reviewCount || 10})</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              isOutOfStock
                ? 'bg-rose-50 text-rose-600'
                : isLowStock
                ? 'bg-amber-50 text-amber-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}>
              {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock} left` : 'In Stock'}
            </span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="w-full sm:w-56 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-5 shrink-0">
          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-400 block font-medium">Estimated Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#071A2B] font-['Outfit']">
                Rs. {(product.price ?? 0).toLocaleString()}
              </span>
            </div>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-gray-400 line-through block">
                Rs. {(product.oldPrice ?? 0).toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full justify-end">
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2.5 rounded-xl border transition-colors ${
                inWishlist ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-rose-600'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => addToCompare(product)}
              className={`p-2.5 rounded-xl border transition-colors ${
                inCompare ? 'bg-sky-50 border-sky-300 text-[#1261A0]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-[#1261A0]'
              }`}
              title="Compare"
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#1261A0] hover:bg-[#0D2B45] text-white active:scale-95'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (Standard)
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200/80 hover:border-[#1261A0]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group relative">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.discountPercentage ? (
            <span className="bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm">
              -{product.discountPercentage}% OFF
            </span>
          ) : null}
          {product.isDeal && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
              Hot Deal
            </span>
          )}
          {product.isNew && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
              New Model
            </span>
          )}
        </div>

        {/* Hover action buttons (Wishlist, Compare, Quick View) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => toggleWishlist(product)}
            className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-all ${
              inWishlist ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-300' : 'bg-white/90 text-gray-600 hover:text-rose-600 hover:bg-white'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
          </button>
          <button
            onClick={() => addToCompare(product)}
            className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-all ${
              inCompare ? 'bg-sky-50 text-[#1261A0] ring-2 ring-sky-300' : 'bg-white/90 text-gray-600 hover:text-[#1261A0] hover:bg-white'
            }`}
            title="Compare Product"
          >
            <Scale className="w-4 h-4" />
          </button>
          <button
            onClick={() => setQuickViewOpen(true)}
            className="p-2 rounded-full shadow-md bg-white/90 text-gray-600 hover:text-[#1261A0] hover:bg-white backdrop-blur-sm transition-all hidden sm:block"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Image Container */}
        <Link to={`/product/${product.slug}`} className="block relative pt-6 px-4 bg-gradient-to-b from-gray-50/50 to-white">
          <div className="w-full h-48 sm:h-52 flex items-center justify-center p-2 overflow-hidden">
            <img
              src={product.thumbnail || (product.images && product.images[0])}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80';
              }}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between border-t border-gray-100/60">
          <div>
            {/* Brand & Stock Row */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1261A0] truncate">
                {product.brand}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isOutOfStock
                  ? 'bg-rose-50 text-rose-600'
                  : isLowStock
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}>
                {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock} Left` : 'In Stock'}
              </span>
            </div>

            {/* Product Title */}
            <Link to={`/product/${product.slug}`}>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#1261A0] transition-colors line-clamp-2 min-h-[2.5rem] leading-snug font-['Outfit']">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span className="text-xs font-bold text-gray-800">{product.rating || 4.8}</span>
              <span className="text-[11px] text-gray-400 font-medium">({product.reviewCount || 12})</span>
            </div>
          </div>

          {/* Pricing & Add to Cart */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Reference Price
                </span>
                <span className="text-lg sm:text-xl font-black text-[#071A2B] font-['Outfit']">
                  Rs. {(product.price ?? 0).toLocaleString()}
                </span>
              </div>
              {product.oldPrice && product.oldPrice > product.price ? (
                <span className="text-xs text-gray-400 line-through">
                  Rs. {(product.oldPrice ?? 0).toLocaleString()}
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => addToCart(product)}
                disabled={isOutOfStock}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#1261A0] hover:bg-[#0D2B45] text-white active:scale-95'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>

              <a
                href={`https://wa.me/${settings?.whatsapp || '923057245533'}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                title="Inquire via WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {quickViewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <button
              onClick={() => setQuickViewOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="h-64 bg-gray-50 rounded-2xl p-4 flex items-center justify-center border border-gray-100">
                  <img
                    src={selectedImg || product.thumbnail}
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImg(img)}
                        className={`w-14 h-14 rounded-lg p-1 border shrink-0 bg-white ${
                          selectedImg === img ? 'border-[#1261A0] ring-2 ring-[#1261A0]/20' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80';
                          }}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-[#1261A0] uppercase tracking-wider">
                  {product.brand} • {product.category}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-1 mb-2 font-['Outfit']">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <span className="text-xs font-bold">{product.rating || 4.8}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount || 10} verified reviews)</span>
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-black text-[#071A2B] font-['Outfit']">
                    Rs. {(product.price ?? 0).toLocaleString()}
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through ml-2">
                      Rs. {(product.oldPrice ?? 0).toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                  {product.shortDescription || product.description}
                </p>

                <div className="space-y-2 mb-5 text-xs text-gray-600">
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Warranty: <strong>{product.warranty || '1 Year Official Warranty'}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Installation: <strong>{product.installationAvailable ? 'Available on Request' : 'Standard Delivery'}</strong></span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(product);
                      setQuickViewOpen(false);
                    }}
                    disabled={isOutOfStock}
                    className="flex-1 py-3 bg-[#1261A0] hover:bg-[#0D2B45] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={() => setQuickViewOpen(false)}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
