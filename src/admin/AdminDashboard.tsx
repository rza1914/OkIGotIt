import React, { useState, useEffect } from 'react';
import {
  Package, Users, ShoppingBag, TrendingUp, DollarSign,
  Clock, AlertTriangle
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
  const [stats] = useState<DashboardStats>({
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
                ۷٪+ نسبت به ماه قبل
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="card p-6 hover:shadow-xl transition-all border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">کل کاربران</p>
              <p className="text-2xl font-bold text-gray-900">{formatPersianNumber(stats.totalUsers)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 ml-1" />
                ۲۳٪+ نسبت به ماه قبل
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6 border border-rose-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingBag className="w-5 h-5 ml-2 text-rose-600" />
              سفارشات اخیر
            </h3>
            <a href="/admin/orders" className="text-sm text-rose-600 hover:text-rose-800 font-medium">
              مشاهده همه
            </a>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gradient-to-l from-rose-50/50 to-transparent rounded-lg border border-rose-100/50">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {order.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">{getRelativeTime(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-reverse space-x-3">
                  <p className="font-semibold text-gray-900">
                    {formatPersianCurrency(order.amount)}
                  </p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getPersianStatus(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="card p-6 border border-amber-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="w-5 h-5 ml-2 text-amber-600" />
              محصولات کم‌موجود
            </h3>
            <a href="/admin/products" className="text-sm text-amber-600 hover:text-amber-800 font-medium">
              مدیریت انبار
            </a>
          </div>
          <div className="space-y-3">
            {stats.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gradient-to-l from-amber-50/50 to-transparent rounded-lg border border-amber-100/50">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-red-400 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">کد محصول: #{product.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    {formatPersianNumber(product.stock)} عدد
                  </span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;