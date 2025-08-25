import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Calendar,
  BarChart3, PieChart, Target, Clock, AlertCircle, CheckCircle,
  Download, Filter, RefreshCw, Eye
} from 'lucide-react';
import { 
  formatPersianCurrency, formatPersianNumber, formatPersianDateTime,
  toPersianNumber, getRelativeTime 
} from '../utils/persian';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  statusDistribution: Record<string, number>;
  paymentMethodDistribution: Record<string, number>;
  customerSegments: Array<{
    segment: string;
    count: number;
    revenue: number;
  }>;
  recentHighValueOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    date: string;
    status: string;
  }>;
  dailyStats: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

interface OrderAnalyticsProps {
  onClose?: () => void;
}

const OrderAnalytics: React.FC<OrderAnalyticsProps> = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    // Mock data - replace with API call
    const mockAnalytics: AnalyticsData = {
      totalRevenue: 125750000,
      totalOrders: 342,
      averageOrderValue: 36800000,
      topProducts: [
        { id: '1', name: 'آیفون ۱۵ پرو', sales: 45, revenue: 42750000 },
        { id: '2', name: 'سامسونگ گلکسی S24', sales: 38, revenue: 35720000 },
        { id: '3', name: 'مک‌بوک ایر M3', sales: 22, revenue: 28600000 },
        { id: '4', name: 'آیپد ایر', sales: 31, revenue: 18600000 },
        { id: '5', name: 'ایرپاد پرو', sales: 67, revenue: 16750000 }
      ],
      revenueByMonth: [
        { month: 'فروردین', revenue: 18500000, orders: 52 },
        { month: 'اردیبهشت', revenue: 22300000, orders: 61 },
        { month: 'خرداد', revenue: 19800000, orders: 55 },
        { month: 'تیر', revenue: 26750000, orders: 73 },
        { month: 'مرداد', revenue: 31200000, orders: 86 },
        { month: 'شهریور', revenue: 28400000, orders: 78 }
      ],
      statusDistribution: {
        delivered: 45,
        shipped: 18,
        preparing: 12,
        confirmed: 15,
        registered: 8,
        cancelled: 2
      },
      paymentMethodDistribution: {
        'کارت بانکی': 52,
        'پرداخت آنلاین': 31,
        'پرداخت در محل': 17
      },
      customerSegments: [
        { segment: 'مشتریان VIP', count: 15, revenue: 45200000 },
        { segment: 'مشتریان منظم', count: 78, revenue: 62150000 },
        { segment: 'مشتریان جدید', count: 156, revenue: 18400000 }
      ],
      recentHighValueOrders: [
        { id: 'ORD-2024-156', customer: 'محمد رضایی', amount: 58700000, date: '2024-01-20T14:30:00Z', status: 'delivered' },
        { id: 'ORD-2024-155', customer: 'فاطمه احمدی', amount: 47300000, date: '2024-01-20T11:15:00Z', status: 'shipped' },
        { id: 'ORD-2024-154', customer: 'علی محمدی', amount: 62100000, date: '2024-01-19T16:45:00Z', status: 'delivered' }
      ],
      dailyStats: [
        { date: '2024-01-15', orders: 12, revenue: 8500000 },
        { date: '2024-01-16', orders: 18, revenue: 12300000 },
        { date: '2024-01-17', orders: 15, revenue: 9800000 },
        { date: '2024-01-18', orders: 22, revenue: 15600000 },
        { date: '2024-01-19', orders: 28, revenue: 19200000 },
        { date: '2024-01-20', orders: 25, revenue: 17400000 }
      ]
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'preparing': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-purple-600 bg-purple-100';
      case 'registered': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusTranslation = (status: string) => {
    const translations = {
      delivered: 'تحویل شده',
      shipped: 'ارسال شده',
      preparing: 'آماده‌سازی',
      confirmed: 'تایید شده',
      registered: 'ثبت شده',
      cancelled: 'لغو شده'
    };
    return translations[status as keyof typeof translations] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگیری آمارها...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">خطا در بارگیری داده‌ها</p>
        <button onClick={loadAnalytics} className="btn-primary mt-4">
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
            تحلیل مالی و آمار سفارشات
          </h2>
          <p className="text-gray-600 mt-1">
            گزارش جامع عملکرد فروش و سفارشات
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <option value="week">هفته گذشته</option>
            <option value="month">ماه گذشته</option>
            <option value="quarter">فصل گذشته</option>
            <option value="year">سال گذشته</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            بروزرسانی
          </button>
          
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            دانلود گزارش
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">کل درآمد</p>
              <p className="text-2xl font-bold text-green-900">
                {formatPersianCurrency(analytics.totalRevenue)}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <TrendingUp className="w-4 h-4 ml-1" />
                +۲۳٪ نسبت به دوره قبل
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">کل سفارشات</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatPersianNumber(analytics.totalOrders)}
              </p>
              <p className="text-sm text-blue-600 flex items-center mt-2">
                <TrendingUp className="w-4 h-4 ml-1" />
                +۱۸٪ نسبت به دوره قبل
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">میانگین ارزش سفارش</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatPersianCurrency(analytics.averageOrderValue)}
              </p>
              <p className="text-sm text-purple-600 flex items-center mt-2">
                <TrendingUp className="w-4 h-4 ml-1" />
                +۱۲٪ نسبت به دوره قبل
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">نرخ تکمیل سفارش</p>
              <p className="text-2xl font-bold text-orange-900">۹۲٪</p>
              <p className="text-sm text-orange-600 flex items-center mt-2">
                <TrendingUp className="w-4 h-4 ml-1" />
                +۵٪ نسبت به دوره قبل
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">روند درآمد ماهانه</h3>
            <BarChart3 className="w-5 h-5 text-rose-500" />
          </div>
          <div className="space-y-4">
            {analytics.revenueByMonth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">{item.month}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPersianCurrency(item.revenue)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatPersianNumber(item.orders)} سفارش
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">توزیع وضعیت سفارشات</h3>
            <PieChart className="w-5 h-5 text-rose-500" />
          </div>
          <div className="space-y-3">
            {Object.entries(analytics.statusDistribution).map(([status, percentage]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(status).split(' ')[1]}`}></span>
                  <span className="text-sm font-medium text-gray-700">
                    {getStatusTranslation(status)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-rose-400 to-amber-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">
                    {toPersianNumber(percentage)}٪
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products and Customer Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">پرفروش‌ترین محصولات</h3>
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {toPersianNumber(index + 1)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatPersianNumber(product.sales)} فروش
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatPersianCurrency(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Segments */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">بخش‌بندی مشتریان</h3>
          <div className="space-y-4">
            {analytics.customerSegments.map((segment, index) => (
              <div key={index} className="p-4 bg-gradient-to-l from-rose-50 to-amber-50 rounded-xl border border-rose-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{segment.segment}</h4>
                  <span className="text-sm font-semibold text-rose-600">
                    {formatPersianNumber(segment.count)} نفر
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">درآمد کل:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPersianCurrency(segment.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High Value Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">سفارشات با ارزش بالا</h3>
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4" />
            مشاهده همه
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 text-sm font-medium text-gray-600">شماره سفارش</th>
                <th className="text-right py-3 text-sm font-medium text-gray-600">مشتری</th>
                <th className="text-right py-3 text-sm font-medium text-gray-600">مبلغ</th>
                <th className="text-right py-3 text-sm font-medium text-gray-600">تاریخ</th>
                <th className="text-right py-3 text-sm font-medium text-gray-600">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentHighValueOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="py-3 text-sm text-gray-700">{order.customer}</td>
                  <td className="py-3 text-sm font-semibold text-gray-900">
                    {formatPersianCurrency(order.amount)}
                  </td>
                  <td className="py-3 text-sm text-gray-500">
                    {getRelativeTime(new Date(order.date))}
                  </td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusTranslation(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods Distribution */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">توزیع روش‌های پرداخت</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(analytics.paymentMethodDistribution).map(([method, percentage]) => (
            <div key={method} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{method}</h4>
              <p className="text-2xl font-bold text-gray-900">{toPersianNumber(percentage)}٪</p>
              <p className="text-sm text-gray-500">از کل پرداخت‌ها</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics;