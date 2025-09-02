import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, Package, Users, Settings, ShoppingBag, 
  LogOut, Menu, X, Bell, Search,
  PenTool, Image, Upload, Bot
} from 'lucide-react';
import { formatPersianDateTime } from '../utils/persian';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  // No authentication check needed - AdminRoutes handles it

  const handleLogout = () => {
    logout();
    // Redirect will be handled by App.tsx routing
  };

  const navigationItems = [
    { 
      name: 'داشبورد', 
      href: '/admin/dashboard', 
      icon: BarChart3,
      description: 'آمار کلی و نمودارها'
    },
    { 
      name: 'مدیریت بنرها', 
      href: '/admin/banners', 
      icon: Image,
      description: 'ایجاد و ویرایش بنرهای سایت'
    },
    { 
      name: 'مدیریت بلاگ', 
      href: '/admin/blog', 
      icon: PenTool,
      description: 'ایجاد و ویرایش مقالات'
    },
    { 
      name: 'مدیریت سفارشات', 
      href: '/admin/orders', 
      icon: ShoppingBag,
      description: 'مشاهده و پردازش سفارشات'
    },
    { 
      name: 'مدیریت محصولات', 
      href: '/admin/products', 
      icon: Package,
      description: 'افزودن، ویرایش، حذف محصولات'
    },
    { 
      name: 'Import محصولات', 
      href: '/admin/import', 
      icon: Upload,
      description: 'آپلود فایل‌های CSV/Excel'
    },
    { 
      name: 'مدیریت ربات‌ها', 
      href: '/admin/bots', 
      icon: Bot,
      description: 'کنترل ربات تلگرام و سیستم‌های خودکار'
    },
    { 
      name: 'مدیریت کاربران', 
      href: '/admin/users', 
      icon: Users,
      description: 'مدیریت اکانت‌های مشتریان'
    },
    { 
      name: 'تنظیمات', 
      href: '/admin/settings', 
      icon: Settings,
      description: 'پیکربندی سایت'
    },
  ];

  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50" dir="rtl">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white shadow-xl border-l border-rose-100 transition-all duration-300 relative`}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-rose-100 bg-gradient-to-l from-rose-50 to-white">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-amber-400 rounded-lg flex items-center justify-center ml-2">
                      <span className="text-white text-sm font-bold">iS</span>
                    </div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                      پنل مدیریت آیشاپ
                    </h1>
                  </div>
                  <p className="text-sm text-gray-600">خوش آمدید، {user?.username}</p>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-rose-50 transition-colors text-rose-600"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-6 px-3">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link 
                      to={item.href}
                      className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-l from-rose-100 to-amber-50 border-l-4 border-rose-400 text-rose-700 font-medium shadow-sm' 
                          : 'text-gray-700 hover:bg-rose-50 hover:text-rose-800'
                      }`}
                      title={!sidebarOpen ? item.name : ''}
                    >
                      <Icon className={`w-5 h-5 ${sidebarOpen ? 'ml-3' : ''} ${isActive ? 'text-rose-600' : 'text-gray-500 group-hover:text-rose-700'}`} />
                      {sidebarOpen && (
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{item.name}</div>
                          <div className="text-xs text-gray-500 truncate">{item.description}</div>
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-4 right-3 left-3">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors group ${
                !sidebarOpen ? 'justify-center' : ''
              }`}
              title={!sidebarOpen ? 'خروج' : ''}
            >
              <LogOut className={`w-5 h-5 ${sidebarOpen ? 'ml-3' : ''} group-hover:text-red-600`} />
              {sidebarOpen && <span className="text-sm font-medium">خروج</span>}
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {/* Top Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-rose-100 shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-reverse space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {navigationItems.find(item => item.href === location.pathname)?.name || 'پنل مدیریت'}
                  </h2>
                </div>
                <div className="flex items-center space-x-reverse space-x-4">
                  {/* Time Display */}
                  <div className="hidden md:flex items-center space-x-reverse space-x-2 bg-rose-50 px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium text-rose-800">
                      {formatPersianDateTime(currentTime)}
                    </span>
                  </div>
                  
                  {/* Search */}
                  <div className="relative hidden lg:block">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="جستجو..."
                      className="block w-full pr-10 pl-3 py-2 border border-rose-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:border-transparent sm:text-sm transition-all"
                    />
                  </div>
                  
                  {/* Notifications */}
                  <button className="p-2 text-gray-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 left-1 block h-2 w-2 rounded-full bg-rose-400"></span>
                  </button>

                  {/* User Info */}
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium text-gray-900">{user?.username}</span>
                      <span className="text-xs text-gray-500">{user?.email}</span>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-sm font-semibold text-white">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-rose-50/30 via-transparent to-amber-50/30">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};