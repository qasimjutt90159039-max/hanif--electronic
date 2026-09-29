import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';

// Common
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppFloat } from './components/common/WhatsAppFloat';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Deals } from './pages/Deals';
import { Brands } from './pages/Brands';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { TrackOrder } from './pages/TrackOrder';
import { Wishlist } from './pages/Wishlist';
import { Compare } from './pages/Compare';
import { Installments } from './pages/Installments';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { FAQ, PrivacyPolicy, Terms, RefundPolicy } from './pages/Policies';
import { Auth } from './pages/Auth';
import { Account } from './pages/Account';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminBrands } from './pages/admin/AdminBrands';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminInstallments } from './pages/admin/AdminInstallments';
import { AdminSettings } from './pages/admin/AdminSettings';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F5F7FA]">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <Router>
                  <Routes>
                    {/* Public Store Routes */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/category/:slug" element={<Shop />} />
                      <Route path="/brand/:slug" element={<Shop />} />
                      <Route path="/product/:slug" element={<ProductDetail />} />
                      <Route path="/deals" element={<Deals />} />
                      <Route path="/brands" element={<Brands />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-success" element={<OrderSuccess />} />
                      <Route path="/track-order" element={<TrackOrder />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/compare" element={<Compare />} />
                      <Route path="/installments" element={<Installments />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/refund-policy" element={<RefundPolicy />} />
                      <Route path="/login" element={<Auth />} />
                      <Route path="/register" element={<Auth />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/account/orders" element={<Account />} />
                      <Route path="/account/profile" element={<Account />} />
                    </Route>

                    {/* Admin Portal Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="brands" element={<AdminBrands />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="reviews" element={<AdminReviews />} />
                      <Route path="coupons" element={<AdminCoupons />} />
                      <Route path="messages" element={<AdminMessages />} />
                      <Route path="installments" element={<AdminInstallments />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Router>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </ToastProvider>
  );
};

export default App;
