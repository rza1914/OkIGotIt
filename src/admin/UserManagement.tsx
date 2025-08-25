import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Filter, Mail, Phone, Calendar, 
  Shield, Eye, Edit, Trash2, Download, Send, Lock,
  UserPlus, UserCheck, UserX, MoreHorizontal,
  MapPin, Clock, Star, TrendingUp, Award
} from 'lucide-react';
import PersianDataTable from './components/PersianDataTable';
import PersianStatusBadge from './components/PersianStatusBadge';
import UserDetailsModal from './components/UserDetailsModal';
import UserStatusManager from './components/UserStatusManager';
import PrivacySecurityManager from './components/PrivacySecurityManager';
import { 
  formatPersianDateTime, getRelativeTime, toPersianNumber,
  formatPersianCurrency, getPersianStatus 
} from '../utils/persian';

interface User {
  id: string;
  avatar?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'blocked' | 'suspended';
  user_type: 'customer' | 'vip' | 'premium' | 'blocked';
  email_verified: boolean;
  phone_verified: boolean;
  registration_date: Date;
  last_login: Date;
  total_orders: number;
  total_spent: number;
  loyalty_points: number;
  province?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  national_id?: string;
  birthday?: Date;
  gender?: 'male' | 'female' | 'other';
  referral_code?: string;
  referred_by?: string;
  last_activity: Date;
  account_age_days: number;
  total_reviews: number;
  average_rating: number;
  support_tickets: number;
  newsletter_subscribed: boolean;
  sms_subscribed: boolean;
  two_factor_enabled: boolean;
  gdpr_consent: boolean;
  data_processing_consent: boolean;
  marketing_consent: boolean;
  data_retention_days?: number;
}

interface UserFilters {
  status: string;
  user_type: string;
  email_verified: boolean | null;
  phone_verified: boolean | null;
  registration_period: string;
  activity_period: string;
  location: string;
  spending_range: string;
}

interface UserManagementProps {
  users: User[];
  selectedUsers: User[];
  onSelectionChange: (users: User[]) => void;
  onEditUser: (user: User) => void;
  onStatusChange: (userId: string, newStatus: string, reason: string, note?: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users: propUsers,
  selectedUsers,
  onSelectionChange,
  onEditUser,
  onStatusChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [showStatusManager, setShowStatusManager] = useState<User | null>(null);
  const [showPrivacyManager, setShowPrivacyManager] = useState<User | null>(null);
  
  const [filters, setFilters] = useState<UserFilters>({
    status: 'all',
    user_type: 'all',
    email_verified: null,
    phone_verified: null,
    registration_period: 'all',
    activity_period: 'all',
    location: 'all',
    spending_range: 'all'
  });

  // Mock user data
  const mockUsers: User[] = [
    {
      id: '1',
      avatar: '/api/placeholder/40/40',
      first_name: 'علی',
      last_name: 'محمدی',
      email: 'ali.mohammadi@email.com',
      phone: '09123456789',
      status: 'active',
      user_type: 'vip',
      email_verified: true,
      phone_verified: true,
      registration_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      last_login: new Date(Date.now() - 2 * 60 * 60 * 1000),
      total_orders: 45,
      total_spent: 25000000,
      loyalty_points: 2500,
      province: 'تهران',
      city: 'تهران',
      address: 'خیابان ولیعصر، نرسیده به میدان ونک',
      postal_code: '1234567890',
      national_id: '1234567890',
      birthday: new Date(1990, 5, 15),
      gender: 'male',
      referral_code: 'ALI2024',
      last_activity: new Date(Date.now() - 30 * 60 * 1000),
      account_age_days: 365,
      total_reviews: 12,
      average_rating: 4.8,
      support_tickets: 2,
      newsletter_subscribed: true,
      sms_subscribed: true,
      two_factor_enabled: true,
      gdpr_consent: true,
      data_processing_consent: true,
      marketing_consent: true,
      data_retention_days: 730
    },
    {
      id: '2',
      avatar: '/api/placeholder/40/40',
      first_name: 'مریم',
      last_name: 'احمدی',
      email: 'maryam.ahmadi@email.com',
      phone: '09987654321',
      status: 'active',
      user_type: 'customer',
      email_verified: true,
      phone_verified: false,
      registration_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      last_login: new Date(Date.now() - 24 * 60 * 60 * 1000),
      total_orders: 12,
      total_spent: 5500000,
      loyalty_points: 550,
      province: 'اصفهان',
      city: 'اصفهان',
      last_activity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      account_age_days: 90,
      total_reviews: 5,
      average_rating: 4.2,
      support_tickets: 1,
      newsletter_subscribed: false,
      sms_subscribed: true,
      two_factor_enabled: false,
      gdpr_consent: true,
      data_processing_consent: true,
      marketing_consent: false,
      data_retention_days: 365
    },
    {
      id: '3',
      avatar: '/api/placeholder/40/40',
      first_name: 'حسن',
      last_name: 'رضایی',
      email: 'hassan.rezaei@email.com',
      phone: '09112345678',
      status: 'suspended',
      user_type: 'customer',
      email_verified: false,
      phone_verified: true,
      registration_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      last_login: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      total_orders: 3,
      total_spent: 1200000,
      loyalty_points: 120,
      province: 'شیراز',
      city: 'شیراز',
      last_activity: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      account_age_days: 30,
      total_reviews: 1,
      average_rating: 2.0,
      support_tickets: 3,
      newsletter_subscribed: true,
      sms_subscribed: false,
      two_factor_enabled: false,
      gdpr_consent: false,
      data_processing_consent: true,
      marketing_consent: true,
      data_retention_days: 365
    }
  ];

  const users = propUsers;

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(user => user.status === filters.status);
    }

    // User type filter
    if (filters.user_type !== 'all') {
      result = result.filter(user => user.user_type === filters.user_type);
    }

    // Email verification filter
    if (filters.email_verified !== null) {
      result = result.filter(user => user.email_verified === filters.email_verified);
    }

    // Phone verification filter
    if (filters.phone_verified !== null) {
      result = result.filter(user => user.phone_verified === filters.phone_verified);
    }

    // Registration period filter
    if (filters.registration_period !== 'all') {
      const now = new Date();
      const periods = {
        'today': 1,
        'week': 7,
        'month': 30,
        'quarter': 90,
        'year': 365
      };
      const days = periods[filters.registration_period as keyof typeof periods];
      if (days) {
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        result = result.filter(user => user.registration_date >= cutoff);
      }
    }

    return result;
  }, [users, searchQuery, filters]);

  // User statistics
  const userStats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const verified = users.filter(u => u.email_verified && u.phone_verified).length;
    const vip = users.filter(u => u.user_type === 'vip').length;
    const newThisMonth = users.filter(u => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return u.registration_date >= monthAgo;
    }).length;

    return { total, active, verified, vip, newThisMonth };
  }, [users]);

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action}`, selectedUsers);
    // Here you would implement the actual bulk operations
    setShowBulkActions(false);
  };

  const handleExportUsers = () => {
    console.log(`Exporting users as ${exportType}`);
    // Implement export functionality
  };

  const getUserTypeColor = (userType: string) => {
    const colors = {
      customer: 'bg-blue-100 text-blue-800',
      vip: 'bg-purple-100 text-purple-800',
      premium: 'bg-gold-100 text-gold-800',
      blocked: 'bg-red-100 text-red-800'
    };
    return colors[userType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderUserAvatar = (user: User) => (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src={user.avatar || '/api/placeholder/40/40'}
          alt={`${user.first_name} ${user.last_name}`}
          className="w-10 h-10 rounded-full object-cover"
        />
        {user.user_type === 'vip' && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
            <Star className="w-2 h-2 text-white fill-current" />
          </div>
        )}
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
          user.status === 'active' ? 'bg-green-400' : 
          user.status === 'inactive' ? 'bg-gray-400' :
          user.status === 'blocked' ? 'bg-red-400' : 'bg-orange-400'
        }`}></div>
      </div>
      <div>
        <div className="font-medium text-gray-900">
          {user.first_name} {user.last_name}
        </div>
        <div className="text-sm text-gray-500">کد: {user.id}</div>
      </div>
    </div>
  );

  const renderVerificationStatus = (user: User) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Mail className="w-3 h-3" />
        <span className={`text-xs ${user.email_verified ? 'text-green-600' : 'text-red-600'}`}>
          {user.email_verified ? 'تایید شده' : 'تایید نشده'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-3 h-3" />
        <span className={`text-xs ${user.phone_verified ? 'text-green-600' : 'text-red-600'}`}>
          {user.phone_verified ? 'تایید شده' : 'تایید نشده'}
        </span>
      </div>
    </div>
  );

  const columns = [
    {
      key: 'user',
      label: 'کاربر',
      sortable: true,
      render: (value: any, row: User) => renderUserAvatar(row)
    },
    {
      key: 'email',
      label: 'ایمیل',
      sortable: true,
      render: (value: string, row: User) => (
        <div>
          <div className="text-sm text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.phone}</div>
        </div>
      )
    },
    {
      key: 'user_type',
      label: 'نوع کاربر',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(value)}`}>
          {getPersianStatus(value)}
        </span>
      )
    },
    {
      key: 'verification',
      label: 'تایید هویت',
      render: (value: any, row: User) => renderVerificationStatus(row)
    },
    {
      key: 'registration_date',
      label: 'تاریخ عضویت',
      sortable: true,
      render: (value: Date) => (
        <div className="text-sm">
          <div className="text-gray-900">{getRelativeTime(value)}</div>
          <div className="text-gray-500">{formatPersianDateTime(value).split(' - ')[0]}</div>
        </div>
      )
    },
    {
      key: 'activity',
      label: 'فعالیت',
      render: (value: any, row: User) => (
        <div className="text-sm">
          <div className="text-gray-900">
            {toPersianNumber(row.total_orders)} سفارش
          </div>
          <div className="text-gray-500">
            {formatPersianCurrency(row.total_spent)}
          </div>
          <div className="text-xs text-blue-600">
            {toPersianNumber(row.loyalty_points)} امتیاز
          </div>
        </div>
      )
    },
    {
      key: 'last_login',
      label: 'آخرین ورود',
      sortable: true,
      render: (value: Date) => (
        <div className="text-sm text-gray-700">
          {getRelativeTime(value)}
        </div>
      )
    },
    {
      key: 'status',
      label: 'وضعیت',
      sortable: true,
      render: (value: string) => <PersianStatusBadge status={value} />
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (value: any, row: User) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewUser(row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="مشاهده جزئیات"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEditUser(row)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="ویرایش"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowStatusManager(row)}
            className="p-1 text-orange-600 hover:bg-orange-50 rounded"
            title="تغییر وضعیت"
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowPrivacyManager(row)}
            className="p-1 text-purple-600 hover:bg-purple-50 rounded"
            title="حریم خصوصی"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">کل کاربران</p>
              <p className="text-xl font-bold text-gray-900">
                {toPersianNumber(userStats.total)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">کاربران فعال</p>
              <p className="text-xl font-bold text-gray-900">
                {toPersianNumber(userStats.active)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">کاربران VIP</p>
              <p className="text-xl font-bold text-gray-900">
                {toPersianNumber(userStats.vip)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">تایید شده</p>
              <p className="text-xl font-bold text-gray-900">
                {toPersianNumber(userStats.verified)}
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
              <p className="text-sm text-gray-600">عضو جدید</p>
              <p className="text-xl font-bold text-gray-900">
                {toPersianNumber(userStats.newThisMonth)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="جستجو بر اساس نام، ایمیل یا تلفن..."
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-rose-50 border-rose-300' : ''}`}
            >
              <Filter className="w-4 h-4" />
              فیلترها
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {selectedUsers.length > 0 && (
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="btn-secondary flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                عملیات گروهی ({toPersianNumber(selectedUsers.length)})
              </button>
            )}

            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value as 'csv' | 'excel' | 'pdf')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
            </select>

            <button
              onClick={handleExportUsers}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              صادرات
            </button>

            <button className="btn-primary flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              کاربر جدید
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">همه</option>
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                  <option value="blocked">مسدود</option>
                  <option value="suspended">تعلیق</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع کاربر</label>
                <select
                  value={filters.user_type}
                  onChange={(e) => setFilters(prev => ({ ...prev, user_type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">همه</option>
                  <option value="customer">مشتری عادی</option>
                  <option value="vip">VIP</option>
                  <option value="premium">ممتاز</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تایید ایمیل</label>
                <select
                  value={filters.email_verified === null ? 'all' : filters.email_verified.toString()}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    email_verified: e.target.value === 'all' ? null : e.target.value === 'true'
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">همه</option>
                  <option value="true">تایید شده</option>
                  <option value="false">تایید نشده</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">دوره عضویت</label>
                <select
                  value={filters.registration_period}
                  onChange={(e) => setFilters(prev => ({ ...prev, registration_period: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">همه</option>
                  <option value="today">امروز</option>
                  <option value="week">هفته گذشته</option>
                  <option value="month">ماه گذشته</option>
                  <option value="quarter">سه ماه گذشته</option>
                  <option value="year">سال گذشته</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setFilters({
                  status: 'all',
                  user_type: 'all',
                  email_verified: null,
                  phone_verified: null,
                  registration_period: 'all',
                  activity_period: 'all',
                  location: 'all',
                  spending_range: 'all'
                })}
                className="btn-secondary text-sm"
              >
                پاک کردن فیلترها
              </button>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {showBulkActions && selectedUsers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => handleBulkAction('activate')}
                className="btn-success text-sm flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                فعال‌سازی
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="btn-secondary text-sm flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                غیرفعال‌سازی
              </button>
              <button
                onClick={() => handleBulkAction('send_email')}
                className="btn-secondary text-sm flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                ارسال ایمیل
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="btn-secondary text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                صادرات انتخاب‌شده
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <PersianDataTable
        data={filteredUsers}
        columns={columns}
        selectable={true}
        onSelectionChange={onSelectionChange}
        emptyMessage="کاربری یافت نشد"
        className="shadow-sm"
      />

      {/* Quick Stats Footer */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            نمایش {toPersianNumber(filteredUsers.length)} کاربر از {toPersianNumber(users.length)} کاربر کل
          </div>
          <div className="flex items-center gap-6">
            <span>میانگین سن حساب: {toPersianNumber(Math.round(users.reduce((sum, u) => sum + u.account_age_days, 0) / users.length))} روز</span>
            <span>کل خرید: {formatPersianCurrency(users.reduce((sum, u) => sum + u.total_spent, 0))}</span>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {viewUser && (
        <UserDetailsModal
          user={viewUser}
          isOpen={!!viewUser}
          onClose={() => setViewUser(null)}
        />
      )}

      {/* User Status Manager */}
      {showStatusManager && (
        <UserStatusManager
          user={showStatusManager}
          isOpen={!!showStatusManager}
          onClose={() => setShowStatusManager(null)}
          onStatusChange={onStatusChange}
        />
      )}

      {/* Privacy & Security Manager */}
      {showPrivacyManager && (
        <PrivacySecurityManager
          user={showPrivacyManager}
          isOpen={!!showPrivacyManager}
          onClose={() => setShowPrivacyManager(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;