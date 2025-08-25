import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { 
  BarChart3, Package, Users, ShoppingBag, TrendingUp, DollarSign, 
  Calendar, Clock, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { formatPersianCurrency, formatPersianNumber, getPersianStatus, getRelativeTime, formatPersianDateTime } from '../utils/persian';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenue: number;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 1234,
    totalProducts: 567,
    totalUsers: 8910,
    revenue: 45678000, // Convert to Toman
    recentOrders: [
      { id: '1', customer: 'علی احمدی', amount: 2999000, status: 'completed', createdAt: '2024-01-20T10:30:00Z' },
      { id: '2', customer: 'فاطمه محمدی', amount: 1495000, status: 'pending', createdAt: '2024-01-20T09:15:00Z' },
      { id: '3', customer: 'محمد رضایی', amount: 899000, status: 'completed', createdAt: '2024-01-20T08:45:00Z' },
    ],
    lowStockProducts: [
      { id: '1', name: 'آیفون ۱۵ پرو', stock: 5 },
      { id: '2', name: 'سامسونگ گلکسی S24', stock: 3 },
      { id: '3', name: 'مک‌بوک ایر M3', stock: 2 },
    ]
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
              نمای کلی داشبورد
            </h1>
            <p className="text-gray-600 mt-1">عملکرد فروشگاه خود را نظارت کنید</p>
          </div>
          <div className="flex items-center space-x-reverse space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-rose-100">
            <Clock className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium text-gray-700">
              {formatPersianDateTime(currentTime)}
            </span>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 hover:shadow-xl transition-all border border-rose-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">کل سفارشات</p>
                <p className="text-2xl font-bold text-gray-900">{formatPersianNumber(stats.totalOrders)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 ml-1" />
                  ۱۲٪+ نسبت به ماه قبل
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-xl transition-all border border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">کل محصولات</p>
                <p className="text-2xl font-bold text-gray-900">{formatPersianNumber(stats.totalProducts)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 ml-1" />
                  ۸٪+ نسبت به ماه قبل
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-xl transition-all border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">کل کاربران</p>
                <p className="text-2xl font-bold text-gray-900">{formatPersianNumber(stats.totalUsers)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 ml-1" />
                  ۲۴٪+ نسبت به ماه قبل
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="card p-6 hover:shadow-xl transition-all border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">درآمد کل</p>
                <p className="text-2xl font-bold text-gray-900">{formatPersianCurrency(stats.revenue)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 ml-1" />
                  ۱۸٪+ نسبت به ماه قبل
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 card p-6 border border-rose-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">نمای کلی فروش</h3>
              <div className="flex items-center space-x-reverse space-x-2">
                <BarChart3 className="w-5 h-5 text-rose-400" />
                <select className="text-sm border border-rose-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-rose-400">
                  <option>۷ روز گذشته</option>
                  <option>۳۰ روز گذشته</option>
                  <option>۳ ماه گذشته</option>
                </select>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-rose-200 rounded-xl bg-gradient-to-br from-rose-50/50 to-transparent">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-rose-300 mx-auto mb-2" />
                <p className="text-rose-600 font-medium">نمودار فروش</p>
                <p className="text-sm text-rose-400 mt-1">به زودی پیاده‌سازی می‌شود</p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="card p-6 border border-amber-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">اقدامات سریع</h3>
            <div className="space-y-3">
              <button className="w-full text-right p-3 bg-gradient-to-l from-rose-50 to-rose-100/50 hover:from-rose-100 hover:to-rose-200/50 rounded-xl border border-rose-200 transition-all group">
                <div className="flex items-center space-x-reverse space-x-3">
                  <Package className="w-5 h-5 text-rose-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-rose-900">افزودن محصول جدید</span>
                </div>
              </button>
              <button className="w-full text-right p-3 bg-gradient-to-l from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-200/50 rounded-xl border border-amber-200 transition-all group">
                <div className="flex items-center space-x-reverse space-x-3">
                  <ShoppingBag className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-amber-900">مشاهده سفارشات</span>
                </div>
              </button>
              <button className="w-full text-right p-3 bg-gradient-to-l from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 rounded-xl border border-purple-200 transition-all group">
                <div className="flex items-center space-x-reverse space-x-3">
                  <Users className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-purple-900">مدیریت کاربران</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="card p-6 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">سفارشات اخیر</h3>
              <button className="text-sm text-rose-600 hover:text-rose-800 font-medium transition-colors">
                مشاهده همه
              </button>
            </div>
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gradient-to-l from-green-50/50 to-transparent rounded-xl border border-green-100 hover:border-green-200 transition-all">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-xs font-semibold text-white">
                        {order.customer.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500">
                        {getRelativeTime(new Date(order.createdAt))}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPersianCurrency(order.amount)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {getPersianStatus(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Low Stock Alert */}
          <div className="card p-6 border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 text-orange-500 ml-2" />
                هشدار کمبود موجودی
              </h3>
              <button className="text-sm text-rose-600 hover:text-rose-800 font-medium transition-colors">
                مدیریت موجودی
              </button>
            </div>
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gradient-to-l from-orange-50 to-orange-100/50 border border-orange-200 rounded-xl hover:border-orange-300 transition-all">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">کد محصول: {product.id}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-orange-600">
                      {formatPersianNumber(product.stock)} باقی‌مانده
                    </p>
                    <p className="text-xs text-gray-500">نیاز به تکمیل</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;