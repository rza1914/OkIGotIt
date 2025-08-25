import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Eye, ShoppingCart, Star, 
  Calendar, Filter, Download, RefreshCw, BarChart3 
} from 'lucide-react';
import PersianDatePicker from './components/PersianDatePicker';
import { 
  formatPersianCurrency, formatPersianNumber, toPersianNumber, 
  formatPersianDate, getRelativeTime 
} from '../utils/persian';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalViews: number;
  averageRating: number;
  conversionRate: number;
  returnRate: number;
  topProducts: ProductAnalytics[];
  recentActivity: ActivityLog[];
  salesChart: ChartData[];
  categoryPerformance: CategoryStats[];
}

interface ProductAnalytics {
  id: string;
  name: string;
  image: string;
  views: number;
  orders: number;
  revenue: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

interface ActivityLog {
  id: string;
  type: 'view' | 'order' | 'review' | 'return';
  product_name: string;
  user_name?: string;
  timestamp: Date;
  value?: number;
}

interface ChartData {
  date: string;
  sales: number;
  orders: number;
}

interface CategoryStats {
  category: string;
  products: number;
  revenue: number;
  orders: number;
  growth: number;
}

const ProductAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [loading, setLoading] = useState(false);

  const mockAnalytics: AnalyticsData = {
    totalRevenue: 125000000,
    totalOrders: 1250,
    totalViews: 15000,
    averageRating: 4.2,
    conversionRate: 8.3,
    returnRate: 2.1,
    topProducts: [
      {
        id: '1',
        name: 'گوشی هوشمند سامسونگ Galaxy S23',
        image: '/api/placeholder/60/60',
        views: 2500,
        orders: 125,
        revenue: 25000000,
        rating: 4.8,
        trend: 'up',
        trendPercent: 12.5
      },
      {
        id: '2',
        name: 'لپ‌تاپ لنوو ThinkPad X1',
        image: '/api/placeholder/60/60',
        views: 1800,
        orders: 89,
        revenue: 35000000,
        rating: 4.3,
        trend: 'up',
        trendPercent: 8.2
      },
      {
        id: '3',
        name: 'تبلت اپل iPad Pro',
        image: '/api/placeholder/60/60',
        views: 1200,
        orders: 45,
        revenue: 18000000,
        rating: 4.6,
        trend: 'down',
        trendPercent: -3.1
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'order',
        product_name: 'گوشی سامسونگ Galaxy S23',
        user_name: 'علی محمدی',
        timestamp: new Date(Date.now() - 1800000),
        value: 12000000
      },
      {
        id: '2',
        type: 'review',
        product_name: 'لپ‌تاپ لنوو ThinkPad',
        user_name: 'مریم احمدی',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '3',
        type: 'view',
        product_name: 'تبلت اپل iPad Pro',
        timestamp: new Date(Date.now() - 7200000)
      }
    ],
    salesChart: [
      { date: '۱۴۰۳/۰۸/۰۱', sales: 5200000, orders: 52 },
      { date: '۱۴۰۳/۰۸/۰۲', sales: 6800000, orders: 68 },
      { date: '۱۴۰۳/۰۸/۰۳', sales: 4500000, orders: 45 },
      { date: '۱۴۰۳/۰۸/۰۴', sales: 7200000, orders: 72 },
      { date: '۱۴۰۳/۰۸/۰۵', sales: 8100000, orders: 81 }
    ],
    categoryPerformance: [
      { category: 'گوشی هوشمند', products: 45, revenue: 85000000, orders: 450, growth: 15.2 },
      { category: 'لپ‌تاپ', products: 23, revenue: 120000000, orders: 180, growth: 8.7 },
      { category: 'تبلت', products: 18, revenue: 45000000, orders: 120, growth: -2.3 },
      { category: 'هدفون', products: 32, revenue: 15000000, orders: 280, growth: 22.1 }
    ]
  };

  const [analytics] = useState<AnalyticsData>(mockAnalytics);

  const handleRefreshData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleExportData = () => {
    console.log('Exporting analytics data...');
  };

  const renderTrendIcon = (trend: string, percent: number) => {
    if (trend === 'up') {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs">+{toPersianNumber(percent)}%</span>
        </div>
      );
    } else if (trend === 'down') {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <TrendingDown className="w-4 h-4" />
          <span className="text-xs">{toPersianNumber(percent)}%</span>
        </div>
      );
    }
    return <div className="text-xs text-gray-500">بدون تغییر</div>;
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      view: <Eye className="w-4 h-4 text-blue-600" />,
      order: <ShoppingCart className="w-4 h-4 text-green-600" />,
      review: <Star className="w-4 h-4 text-yellow-600" />,
      return: <RefreshCw className="w-4 h-4 text-red-600" />
    };
    return icons[type as keyof typeof icons] || icons.view;
  };

  const getActivityText = (activity: ActivityLog) => {
    const texts = {
      view: 'مشاهده شد',
      order: `سفارش داده شد ${activity.value ? `(${formatPersianCurrency(activity.value)})` : ''}`,
      review: 'نظر داده شد',
      return: 'بازگردانده شد'
    };
    return texts[activity.type];
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header with Controls */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">آنالیتیک محصولات</h2>
            <p className="text-gray-600">تحلیل عملکرد و آمار فروش محصولات</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="7">هفت روز گذشته</option>
              <option value="30">سی روز گذشته</option>
              <option value="90">سه ماه گذشته</option>
              <option value="365">یک سال گذشته</option>
            </select>

            <button
              onClick={handleRefreshData}
              disabled={loading}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              به‌روزرسانی
            </button>

            <button
              onClick={handleExportData}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              دانلود گزارش
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">کل درآمد</p>
              <p className="text-lg font-bold text-gray-900">
                {formatPersianCurrency(analytics.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">کل سفارشات</p>
              <p className="text-lg font-bold text-gray-900">
                {formatPersianNumber(analytics.totalOrders)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">کل بازدید</p>
              <p className="text-lg font-bold text-gray-900">
                {formatPersianNumber(analytics.totalViews)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">میانگین امتیاز</p>
              <p className="text-lg font-bold text-gray-900">
                {toPersianNumber(analytics.averageRating.toFixed(1))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">نرخ تبدیل</p>
              <p className="text-lg font-bold text-gray-900">
                %{toPersianNumber(analytics.conversionRate)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <RefreshCw className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">نرخ بازگشت</p>
              <p className="text-lg font-bold text-gray-900">
                %{toPersianNumber(analytics.returnRate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">پرفروش‌ترین محصولات</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-gray-100 rounded-lg p-2 text-sm font-bold text-gray-600">
                      {toPersianNumber(index + 1)}
                    </div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span>{formatPersianNumber(product.views)} بازدید</span>
                        <span>{formatPersianNumber(product.orders)} سفارش</span>
                        <span>{formatPersianCurrency(product.revenue)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {renderTrendIcon(product.trend, product.trendPercent)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">فعالیت‌های اخیر</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.product_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{getActivityText(activity)}</span>
                      {activity.user_name && (
                        <>
                          <span>توسط</span>
                          <span>{activity.user_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {getRelativeTime(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">عملکرد دسته‌بندی‌ها</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 text-sm font-medium text-gray-700">دسته‌بندی</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-700">تعداد محصول</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-700">درآمد</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-700">سفارشات</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-700">رشد</th>
                </tr>
              </thead>
              <tbody>
                {analytics.categoryPerformance.map((category, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{category.category}</td>
                    <td className="py-3 text-gray-700">{formatPersianNumber(category.products)}</td>
                    <td className="py-3 text-gray-700">{formatPersianCurrency(category.revenue)}</td>
                    <td className="py-3 text-gray-700">{formatPersianNumber(category.orders)}</td>
                    <td className="py-3">
                      <span className={`text-sm font-medium ${
                        category.growth > 0 ? 'text-green-600' : category.growth < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {category.growth > 0 ? '+' : ''}{toPersianNumber(category.growth)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">نمودار فروش</h3>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">نمودار فروش در اینجا نمایش داده می‌شود</p>
              <p className="text-sm text-gray-400 mt-1">
                برای نمایش نمودار، کتابخانه نمودارسازی مورد نیاز است
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAnalytics;