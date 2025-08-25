import React, { useState, useMemo } from 'react';
import { 
  Users, TrendingUp, TrendingDown, MapPin, Calendar, 
  UserPlus, UserMinus, Clock, Star, ShoppingCart, 
  Mail, Phone, Activity, BarChart3, PieChart, 
  RefreshCw, Download, Filter, Eye, Award, Heart
} from 'lucide-react';
import { 
  formatPersianCurrency, formatPersianNumber, toPersianNumber,
  formatPersianDate, getRelativeTime 
} from '../utils/persian';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'blocked' | 'suspended';
  user_type: 'customer' | 'vip' | 'premium' | 'blocked';
  registration_date: Date;
  last_login: Date;
  total_orders: number;
  total_spent: number;
  loyalty_points: number;
  province?: string;
  city?: string;
  account_age_days: number;
  email_verified: boolean;
  phone_verified: boolean;
}

interface AnalyticsData {
  registrationTrend: { date: string; count: number; label: string }[];
  geographicDistribution: { province: string; count: number; percentage: number }[];
  userTypeDistribution: { type: string; count: number; percentage: number }[];
  activityPatterns: { hour: number; activity: number }[];
  churnAnalysis: { period: string; churned: number; retained: number }[];
  cohortData: { cohort: string; month1: number; month2: number; month3: number; month6: number; month12: number }[];
}

const UserAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(false);
  const [activeChart, setActiveChart] = useState<'registration' | 'geographic' | 'usertype' | 'activity'>('registration');

  // Mock user data for analytics
  const mockUsers: User[] = [
    // Add mock users...
    {
      id: '1',
      first_name: 'علی',
      last_name: 'محمدی',
      email: 'ali@example.com',
      phone: '09123456789',
      status: 'active',
      user_type: 'vip',
      registration_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      last_login: new Date(Date.now() - 2 * 60 * 60 * 1000),
      total_orders: 45,
      total_spent: 25000000,
      loyalty_points: 2500,
      province: 'تهران',
      city: 'تهران',
      account_age_days: 365,
      email_verified: true,
      phone_verified: true
    }
    // ... more mock users
  ];

  // Calculate analytics
  const analytics = useMemo(() => {
    const users = mockUsers;
    const now = new Date();

    // Registration trend (last 30 days)
    const registrationTrend = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (29 - i));
      
      const count = Math.floor(Math.random() * 20) + 5; // Mock data
      
      return {
        date: date.toISOString().split('T')[0],
        count,
        label: formatPersianDate(date)
      };
    });

    // Geographic distribution
    const provinces = ['تهران', 'اصفهان', 'مشهد', 'تبریز', 'شیراز', 'کرج', 'اهواز', 'قم'];
    const geographicDistribution = provinces.map(province => {
      const count = Math.floor(Math.random() * 500) + 50;
      const percentage = (count / users.length) * 100;
      return { province, count, percentage };
    });

    // User type distribution
    const userTypes = [
      { type: 'customer', label: 'مشتری عادی', count: 750 },
      { type: 'vip', label: 'VIP', count: 120 },
      { type: 'premium', label: 'ممتاز', count: 80 },
      { type: 'blocked', label: 'مسدود', count: 50 }
    ];

    const userTypeDistribution = userTypes.map(type => ({
      type: type.label,
      count: type.count,
      percentage: (type.count / 1000) * 100
    }));

    // Activity patterns (24 hours)
    const activityPatterns = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      activity: Math.floor(Math.random() * 100) + 10
    }));

    // Churn analysis
    const churnAnalysis = [
      { period: 'ماه گذشته', churned: 45, retained: 955 },
      { period: 'سه ماه گذشته', churned: 123, retained: 877 },
      { period: 'شش ماه گذشته', churned: 210, retained: 790 },
      { period: 'یک سال گذشته', churned: 350, retained: 650 }
    ];

    // Cohort analysis
    const cohortData = [
      { cohort: 'ژانویه ۱۴۰۳', month1: 100, month2: 85, month3: 75, month6: 60, month12: 45 },
      { cohort: 'فوریه ۱۴۰۳', month1: 120, month2: 105, month3: 90, month6: 72, month12: 58 },
      { cohort: 'مارس ۱۴۰۳', month1: 95, month2: 82, month3: 70, month6: 55, month12: 40 }
    ];

    return {
      registrationTrend,
      geographicDistribution,
      userTypeDistribution,
      activityPatterns,
      churnAnalysis,
      cohortData
    };
  }, []);

  // Key metrics calculation
  const keyMetrics = useMemo(() => {
    const totalUsers = 1000; // Mock
    const activeUsers = 850;
    const newUsersThisMonth = 156;
    const churnRate = 4.5;
    const avgLifetimeValue = 3250000;
    const avgSessionDuration = 12.5;

    const previousMonthNew = 142;
    const newUserGrowth = ((newUsersThisMonth - previousMonthNew) / previousMonthNew) * 100;

    return {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      churnRate,
      avgLifetimeValue,
      avgSessionDuration,
      newUserGrowth,
      retentionRate: 100 - churnRate
    };
  }, []);

  const handleRefreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };

  const handleExportData = () => {
    console.log('Exporting user analytics data...');
    // Implement export functionality
  };

  const renderTrendIcon = (value: number) => {
    if (value > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (value < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">تحلیل کاربران</h2>
            <p className="text-gray-600">آمار و تحلیل رفتار کاربران</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
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
              صادرات گزارش
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">کل کاربران</p>
              <p className="text-xl font-bold text-gray-900">
                {formatPersianNumber(keyMetrics.totalUsers)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">کاربران فعال</p>
              <p className="text-xl font-bold text-gray-900">
                {formatPersianNumber(keyMetrics.activeUsers)}
              </p>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-green-600">
                  {formatPersianNumber(((keyMetrics.activeUsers / keyMetrics.totalUsers) * 100).toFixed(1))}%
                </span>
                <span className="text-gray-500">از کل</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <UserPlus className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">عضو جدید (ماه)</p>
              <p className="text-xl font-bold text-gray-900">
                {formatPersianNumber(keyMetrics.newUsersThisMonth)}
              </p>
              <div className="flex items-center gap-1 text-xs">
                {renderTrendIcon(keyMetrics.newUserGrowth)}
                <span className={keyMetrics.newUserGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                  {keyMetrics.newUserGrowth > 0 ? '+' : ''}{formatPersianNumber(keyMetrics.newUserGrowth.toFixed(1))}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Heart className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">نرخ حفظ کاربر</p>
              <p className="text-xl font-bold text-gray-900">
                {formatPersianNumber(keyMetrics.retentionRate.toFixed(1))}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trend */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">روند عضویت</h3>
              <button
                onClick={() => setActiveChart('registration')}
                className={`text-sm px-3 py-1 rounded-lg ${
                  activeChart === 'registration' ? 'bg-rose-100 text-rose-700' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-1" />
                نمودار
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">نمودار روند عضویت</p>
                <p className="text-sm text-gray-400 mt-1">
                  {formatPersianNumber(analytics.registrationTrend.reduce((sum, item) => sum + item.count, 0))} عضو جدید در {toPersianNumber(30)} روز
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">توزیع جغرافیایی</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {analytics.geographicDistribution.slice(0, 6).map((location, index) => (
                <div key={location.province} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{location.province}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-rose-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(location.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-16 text-left">
                      {formatPersianNumber(location.count)} ({formatPersianNumber(location.percentage.toFixed(1))}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Type Distribution */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">توزیع نوع کاربران</h3>
          </div>
          <div className="p-6">
            <div className="h-48 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                {analytics.userTypeDistribution.map((type, index) => (
                  <div key={type.type} className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {formatPersianNumber(type.count)}
                    </div>
                    <div className="text-sm text-gray-600">{type.type}</div>
                    <div className="text-xs text-gray-500">
                      {formatPersianNumber(type.percentage.toFixed(1))}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Lifetime Value */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">ارزش طول عمر مشتری</h3>
          </div>
          <div className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600 mb-2">
                {formatPersianCurrency(keyMetrics.avgLifetimeValue)}
              </div>
              <p className="text-gray-600 mb-4">میانگین ارزش هر مشتری</p>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatPersianNumber(keyMetrics.avgSessionDuration)} دقیقه
                  </div>
                  <div className="text-sm text-gray-600">میانگین مدت جلسه</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatPersianNumber(keyMetrics.churnRate)}%
                  </div>
                  <div className="text-sm text-gray-600">نرخ ترک</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">الگوی فعالیت روزانه</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-12 gap-2">
              {analytics.activityPatterns.map((pattern) => (
                <div key={pattern.hour} className="text-center">
                  <div 
                    className="bg-rose-100 rounded-lg mb-2 flex items-end justify-center"
                    style={{ height: `${Math.max(pattern.activity / 2, 20)}px` }}
                  >
                    <div 
                      className="bg-rose-500 rounded-lg w-full"
                      style={{ height: `${pattern.activity / 2}px` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {toPersianNumber(pattern.hour.toString().padStart(2, '0'))}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-gray-500 mt-4">
              ساعت (۲۴ ساعته)
            </div>
          </div>
        </div>

        {/* Top Performing Segments */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">بخش‌های برتر</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-900">کاربران VIP</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-900">{formatPersianNumber(120)}</div>
                  <div className="text-xs text-purple-600">ارزش بالا</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900">ایمیل تایید شده</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-900">{formatPersianNumber(756)}</div>
                  <div className="text-xs text-green-600">نرخ تبدیل بالا</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">موبایل تایید شده</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-900">{formatPersianNumber(689)}</div>
                  <div className="text-xs text-blue-600">وفاداری بالا</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-900">کاربران جدید</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-orange-900">{formatPersianNumber(156)}</div>
                  <div className="text-xs text-orange-600">پتانسیل رشد</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Analysis */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">تحلیل کوهورت (نرخ حفظ کاربر)</h3>
          <p className="text-sm text-gray-600 mt-1">نرخ بازگشت کاربران در دوره‌های مختلف</p>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 text-sm font-medium text-gray-700">کوهورت</th>
                <th className="text-center py-3 text-sm font-medium text-gray-700">ماه ۱</th>
                <th className="text-center py-3 text-sm font-medium text-gray-700">ماه ۲</th>
                <th className="text-center py-3 text-sm font-medium text-gray-700">ماه ۳</th>
                <th className="text-center py-3 text-sm font-medium text-gray-700">ماه ۶</th>
                <th className="text-center py-3 text-sm font-medium text-gray-700">ماه ۱۲</th>
              </tr>
            </thead>
            <tbody>
              {analytics.cohortData.map((cohort, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-900">{cohort.cohort}</td>
                  <td className="text-center py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      {toPersianNumber(cohort.month1)}%
                    </span>
                  </td>
                  <td className="text-center py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {toPersianNumber(cohort.month2)}%
                    </span>
                  </td>
                  <td className="text-center py-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                      {toPersianNumber(cohort.month3)}%
                    </span>
                  </td>
                  <td className="text-center py-3">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                      {toPersianNumber(cohort.month6)}%
                    </span>
                  </td>
                  <td className="text-center py-3">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                      {toPersianNumber(cohort.month12)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;