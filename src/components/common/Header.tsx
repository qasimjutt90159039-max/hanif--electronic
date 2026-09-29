import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  Scale,
  User,
  Phone,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import { Product } from '../../types';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const { itemCount, total } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { count: compareCount } = useCompare();
  const { settings } = useSettings();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
    setAccountMenuOpen(false);
  }, [location.pathname]);

  // Handle live search suggestions with debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.getProducts({ search: searchQuery, limit: 6 });
        if (res.success && res.data) {
          setSuggestions(res.data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowDropdown(false);
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Deals', path: '/deals', highlight: true },
    { name: 'Brands', path: '/brands' },
    { name: 'Installments', path: '/installments' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Track Order', path: '/track-order' }
  ];

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-40">
      {/* MAIN HEADER */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#1261A0] rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex flex-col shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#071A2B] to-[#1261A0] flex items-center justify-center text-white font-black text-xl shadow-md">
                HC
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#071A2B] uppercase font-['Outfit'] block leading-none">
                  HANIF <span className="text-[#1261A0]">CENTRE</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 tracking-wider uppercase block mt-0.5">
                  Electronics / Home Appliances — Lahore
                </span>
              </div>
            </div>
          </Link>

          {/* Search Bar with Live Suggestions Dropdown */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-xl mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                placeholder="Search products, brands & categories (e.g. Inverter AC, TCL QLED, Haier)..."
                className="w-full bg-[#F5F7FA] border border-gray-300 focus:border-[#1261A0] focus:bg-white text-gray-800 pl-4 pr-12 py-2.5 rounded-full text-sm outline-none transition-all placeholder:text-gray-400 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1261A0] hover:bg-[#0D2B45] text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Suggestions dropdown */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                  <span>Suggested Products</span>
                  <span>Press enter to see all results</span>
                </div>
                {isSearching ? (
                  <div className="p-6 text-center text-sm text-gray-500">Searching inventory...</div>
                ) : suggestions.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                    {suggestions.map((p) => (
                      <Link
                        key={p.id || p._id}
                        to={`/product/${p.slug}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-sky-50/60 transition-colors group"
                      >
                        <img
                          src={p.thumbnail || (p.images && p.images[0])}
                          alt={p.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80';
                          }}
                          className="w-12 h-12 object-contain rounded-lg bg-white border border-gray-100 p-1 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#1261A0] uppercase tracking-wider">{p.brand} • {p.category}</p>
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#1261A0]">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-bold text-[#071A2B]">Rs. {p.price.toLocaleString()}</span>
                            {p.oldPrice && p.oldPrice > p.price && (
                              <span className="text-xs text-gray-400 line-through">Rs. {p.oldPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1261A0] shrink-0" />
                      </Link>
                    ))}
                    <div className="p-3 bg-gray-50 text-center">
                      <Link
                        to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => setShowDropdown(false)}
                        className="text-xs font-bold text-[#1261A0] hover:underline"
                      >
                        View all search results →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-gray-500">
                    No products matched "{searchQuery}". Try searching by category like "AC" or brand like "TCL".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Compare, Wishlist, Account, Cart */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Compare */}
            <Link
              to="/compare"
              className="relative p-2.5 text-gray-700 hover:text-[#1261A0] hover:bg-gray-100 rounded-full transition-colors hidden sm:flex items-center"
              title="Compare Products"
            >
              <Scale className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#19A7CE] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-gray-700 hover:text-[#1261A0] hover:bg-gray-100 rounded-full transition-colors hidden sm:flex items-center"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 p-2 text-gray-700 hover:text-[#1261A0] hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden xl:block text-left text-xs leading-tight">
                  <span className="text-gray-400 block">{user ? 'Welcome,' : 'Sign In'}</span>
                  <span className="font-bold text-gray-800 max-w-[100px] truncate block">
                    {user ? user.name.split(' ')[0] : 'Account'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden xl:block" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            Store Administrator
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-amber-900 hover:bg-amber-50"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          Admin Panel
                        </Link>
                      )}

                      <Link
                        to="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/account/orders"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Order History
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium sm:hidden"
                      >
                        Wishlist ({wishlistCount})
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setAccountMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 text-center border-b border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Access your orders and wishlist</p>
                        <Link
                          to="/login"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block w-full py-2 bg-[#1261A0] hover:bg-[#0D2B45] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                        >
                          Login / Register
                        </Link>
                      </div>
                      <Link
                        to="/track-order"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Track Guest Order
                      </Link>
                      <Link
                        to="/admin/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                      >
                        Admin Portal
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon & Total */}
            <Link
              to="/cart"
              className="flex items-center gap-2.5 bg-[#071A2B] hover:bg-[#1261A0] text-white pl-3.5 pr-4 py-2 rounded-full transition-all duration-200 shadow-md group shrink-0"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#071A2B]">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-[10px] text-gray-300 block uppercase tracking-wider font-semibold">Cart</span>
                <span className="text-xs font-bold text-white block">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION BAR (DESKTOP) */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <nav className="flex items-center gap-1 font-medium text-sm text-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-3 rounded-none border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                  location.pathname === link.path
                    ? 'border-[#1261A0] text-[#1261A0]'
                    : 'border-transparent hover:text-[#1261A0] hover:border-gray-300'
                } ${link.highlight ? 'text-rose-600 font-bold hover:text-rose-700' : ''}`}
              >
                {link.highlight && <Tag className="w-3.5 h-3.5" />}
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Showroom Open in Lahore
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-[#1261A0] font-bold">100% Genuine Official Warranties</span>
          </div>
        </div>
      </div>

      {/* 4. MOBILE SEARCH BAR (visible on phone screens under header) */}
      <div className="md:hidden px-4 py-2.5 bg-[#F5F7FA] border-b border-gray-200">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search electronics, brands, ACs..."
            className="w-full bg-white border border-gray-300 text-gray-800 pl-4 pr-10 py-2 rounded-xl text-sm outline-none shadow-sm focus:border-[#1261A0]"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1261A0]"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 5. MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer header */}
              <div className="p-4 bg-[#071A2B] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg font-['Outfit']">HANIF CENTRE</h3>
                  <p className="text-xs text-gray-300">Electronics & Home Appliances</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation items */}
              <div className="p-3 divide-y divide-gray-100">
                <div className="py-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">
                    Store Navigation
                  </p>
                  {navLinks.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        location.pathname === item.path
                          ? 'bg-sky-50 text-[#1261A0]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="py-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">
                    Customer Services
                  </p>
                  <Link
                    to="/track-order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Track Order
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>My Wishlist</span>
                    <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-bold">
                      {wishlistCount}
                    </span>
                  </Link>
                  <Link
                    to="/compare"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>Product Compare</span>
                    <span className="bg-sky-100 text-[#1261A0] text-xs px-2 py-0.5 rounded-full font-bold">
                      {compareCount}
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer footer with Contact */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Showroom Inquiry:</p>
              <a
                href={`tel:${settings.phone1.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-2 font-bold text-sm text-[#071A2B] hover:text-[#1261A0]"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                {settings.phone1}
              </a>
              <p className="text-[11px] text-gray-400 mt-2">
                Yasin Mansion, McLeod Road, Lahore
              </p>
            </div>
          </div>

          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
