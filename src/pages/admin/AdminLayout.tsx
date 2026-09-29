import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Award,
  ShoppingBag,
  Users,
  Star,
  Ticket,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Store,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  if (!user || !isAdmin) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  const menu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Brands', path: '/admin/brands', icon: Award },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Inquiries', path: '/admin/messages', icon: MessageSquare },
    { name: 'Installments', path: '/admin/installments', icon: CreditCard },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col lg:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-64 bg-[#071A2B] text-white shrink-0 p-5 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="pb-4 border-b border-white/10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1261A0] flex items-center justify-center font-black text-sm">
                HC
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight block font-['Outfit']">HANIF CENTRE</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Store Admin Panel</span>
              </div>
            </Link>
          </div>

          <nav className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-[#1261A0] text-white shadow-sm'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-2 mt-6 lg:mt-0">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
          >
            <Store className="w-4 h-4" />
            <span>View Public Store</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
