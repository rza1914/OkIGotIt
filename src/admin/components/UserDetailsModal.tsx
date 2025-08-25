import React, { useState } from 'react';
import { 
  X, User, Mail, Phone, MapPin, Calendar, Clock, 
  ShoppingCart, Star, Award, MessageSquare, Shield,
  Edit, Ban, CheckCircle, AlertTriangle, TrendingUp,
  CreditCard, Gift, Users, Eye, FileText, Send
} from 'lucide-react';
import PersianStatusBadge from './PersianStatusBadge';
import PersianPriceDisplay from './PersianPriceDisplay';
import { 
  formatPersianDateTime, getRelativeTime, toPersianNumber,
  formatPersianCurrency, getPersianStatus, formatPersianDate 
} from '../../utils/persian';

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
}

interface Order {
  id: string;
  date: Date;
  status: string;
  total: number;
  items_count: number;
}

interface Review {
  id: string;
  product_name: string;
  rating: number;
  comment: string;
  date: Date;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: Date;
  ip_address?: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  created_at: Date;
  last_update: Date;
}

interface UserDetailsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Mock data
  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'delivered',
      total: 2500000,
      items_count: 3
    },
    {
      id: 'ORD-002',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'processing',
      total: 1200000,
      items_count: 1
    },
    {
      id: 'ORD-003',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: 'delivered',
      total: 800000,
      items_count: 2
    }
  ];

  const mockReviews: Review[] = [
    {
      id: '1',
      product_name: 'گوشی سامسونگ Galaxy S23',
      rating: 5,
      comment: 'محصول عالی و کیفیت بالا',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      product_name: 'لپ‌تاپ لنوو ThinkPad',
      rating: 4,
      comment: 'مناسب برای کار اداری',
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
    }
  ];

  const mockActivities: ActivityLog[] = [
    {
      id: '1',
      action: 'login',
      description: 'ورود به حساب کاربری',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ip_address: '192.168.1.100'
    },
    {
      id: '2',
      action: 'purchase',
      description: 'خرید محصول (سفارش ORD-001)',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      ip_address: '192.168.1.100'
    },
    {
      id: '3',
      action: 'profile_update',
      description: 'به‌روزرسانی اطلاعات شخصی',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      ip_address: '192.168.1.100'
    }
  ];

  const mockTickets: SupportTicket[] = [
    {
      id: 'TIC-001',
      subject: 'مشکل در پرداخت',
      status: 'resolved',
      priority: 'medium',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      last_update: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ];

  const calculateCustomerValue = () => {
    if (user.account_age_days === 0) return 0;
    const monthlySpend = (user.total_spent / user.account_age_days) * 30;
    const orderFrequency = (user.total_orders / user.account_age_days) * 30;
    return (monthlySpend * orderFrequency) / 1000000; // Simplified CLV calculation
  };

  const getActivityIcon = (action: string) => {
    const icons = {
      login: <Shield className="w-4 h-4 text-green-600" />,
      purchase: <ShoppingCart className="w-4 h-4 text-blue-600" />,
      profile_update: <Edit className="w-4 h-4 text-orange-600" />,
      review: <Star className="w-4 h-4 text-yellow-600" />,
      support: <MessageSquare className="w-4 h-4 text-purple-600" />
    };
    return icons[action as keyof typeof icons] || <Clock className="w-4 h-4 text-gray-600" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-amber-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.avatar || '/api/placeholder/60/60'}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-16 h-16 rounded-full border-4 border-white object-cover"
                />
                {user.user_type === 'vip' && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-yellow-900 fill-current" />
                  </div>
                )}
              </div>
              <div className="text-white">
                <h2 className="text-xl font-bold">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-white/80">{user.email}</p>
                <p className="text-white/80">{user.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <PersianStatusBadge status={user.status} variant="secondary" />
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-reverse space-x-8 px-6">
            {[
              { key: 'profile', label: 'اطلاعات شخصی', icon: User },
              { key: 'orders', label: 'سفارشات', icon: ShoppingCart },
              { key: 'reviews', label: 'نظرات', icon: Star },
              { key: 'activity', label: 'فعالیت‌ها', icon: Clock },
              { key: 'support', label: 'پشتیبانی', icon: MessageSquare },
              { key: 'analytics', label: 'تحلیل', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">اطلاعات شخصی</h3>
                    <button className="btn-secondary text-sm flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      ویرایش
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                      <p className="text-gray-900">{user.first_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                      <p className="text-gray-900">{user.last_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900">{user.email}</p>
                        {user.email_verified ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تلفن همراه</label>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900">{user.phone}</p>
                        {user.phone_verified ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    {user.birthday && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ تولد</label>
                        <p className="text-gray-900">{formatPersianDate(user.birthday)}</p>
                      </div>
                    )}
                    {user.national_id && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">کد ملی</label>
                        <p className="text-gray-900">{user.national_id}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">آدرس</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.province && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">استان</label>
                        <p className="text-gray-900">{user.province}</p>
                      </div>
                    )}
                    {user.city && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">شهر</label>
                        <p className="text-gray-900">{user.city}</p>
                      </div>
                    )}
                    {user.address && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">آدرس کامل</label>
                        <p className="text-gray-900">{user.address}</p>
                      </div>
                    )}
                    {user.postal_code && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">کد پستی</label>
                        <p className="text-gray-900">{user.postal_code}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">تنظیمات حساب</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">اشتراک خبرنامه</span>
                      <span className={`text-sm ${user.newsletter_subscribed ? 'text-green-600' : 'text-red-600'}`}>
                        {user.newsletter_subscribed ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">اطلاع‌رسانی پیامکی</span>
                      <span className={`text-sm ${user.sms_subscribed ? 'text-green-600' : 'text-red-600'}`}>
                        {user.sms_subscribed ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">احراز هویت دومرحله‌ای</span>
                      <span className={`text-sm ${user.two_factor_enabled ? 'text-green-600' : 'text-red-600'}`}>
                        {user.two_factor_enabled ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">آمار کلی</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">تاریخ عضویت</span>
                      <span className="text-sm text-gray-900">
                        {formatPersianDate(user.registration_date)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">آخرین ورود</span>
                      <span className="text-sm text-gray-900">
                        {getRelativeTime(user.last_login)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">کل سفارشات</span>
                      <span className="text-sm text-gray-900">
                        {toPersianNumber(user.total_orders)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">کل خرید</span>
                      <span className="text-sm text-gray-900">
                        {formatPersianCurrency(user.total_spent)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">امتیاز وفاداری</span>
                      <span className="text-sm text-gray-900 flex items-center gap-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        {toPersianNumber(user.loyalty_points)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">ارزش مشتری</h3>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">
                      {formatPersianCurrency(calculateCustomerValue() * 1000000)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">ارزش طول عمر تقریبی</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">عملیات سریع</h3>
                  <div className="space-y-2">
                    <button className="w-full btn-secondary text-sm flex items-center gap-2 justify-center">
                      <Send className="w-4 h-4" />
                      ارسال ایمیل
                    </button>
                    <button className="w-full btn-secondary text-sm flex items-center gap-2 justify-center">
                      <MessageSquare className="w-4 h-4" />
                      ایجاد تیکت
                    </button>
                    <button className="w-full btn-secondary text-sm flex items-center gap-2 justify-center">
                      <Ban className="w-4 h-4" />
                      تغییر وضعیت
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">تاریخچه سفارشات</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {toPersianNumber(mockOrders.length)} سفارش
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {mockOrders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium text-gray-900">سفارش #{order.id}</div>
                          <div className="text-sm text-gray-500">
                            {formatPersianDate(order.date)} - {toPersianNumber(order.items_count)} محصول
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          {formatPersianCurrency(order.total)}
                        </div>
                        <PersianStatusBadge status={order.status} size="sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">نظرات و بازخوردها</h3>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">
                    میانگین {toPersianNumber(user.average_rating || 4.5)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{review.product_name}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatPersianDate(review.date)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">فعالیت‌های اخیر</h3>
              <div className="space-y-3">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {getActivityIcon(activity.action)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <span className="text-sm text-gray-500">
                            {getRelativeTime(activity.timestamp)}
                          </span>
                        </div>
                        {activity.ip_address && (
                          <p className="text-sm text-gray-500 mt-1">
                            IP: {activity.ip_address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">تیکت‌های پشتیبانی</h3>
              <div className="space-y-3">
                {mockTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900">#{ticket.id}</div>
                        <div className="text-gray-700">{ticket.subject}</div>
                        <div className="flex items-center gap-3 mt-2">
                          <PersianStatusBadge status={ticket.status} size="sm" />
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                            ticket.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            اولویت {getPersianStatus(ticket.priority)}
                          </span>
                        </div>
                      </div>
                      <div className="text-left text-sm text-gray-500">
                        <div>ایجاد: {formatPersianDate(ticket.created_at)}</div>
                        <div>آخرین به‌روزرسانی: {getRelativeTime(ticket.last_update)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">تحلیل خرید</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">میانگین سفارش</span>
                    <span className="font-medium">
                      {formatPersianCurrency(user.total_spent / Math.max(user.total_orders, 1))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">تعداد بازگشت</span>
                    <span className="font-medium">{toPersianNumber(0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">نرخ بازگشت</span>
                    <span className="font-medium">%{toPersianNumber(0)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">رفتار مشتری</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">فرکانس خرید</span>
                    <span className="font-medium">
                      {(user.total_orders / Math.max(user.account_age_days / 30, 1)).toFixed(1)} در ماه
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">میانگین امتیاز</span>
                    <span className="font-medium">{toPersianNumber(user.average_rating || 4.5)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">وضعیت وفاداری</span>
                    <span className={`font-medium ${user.user_type === 'vip' ? 'text-purple-600' : 'text-blue-600'}`}>
                      {getPersianStatus(user.user_type)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="btn-secondary flex items-center gap-2">
                <Edit className="w-4 h-4" />
                ویرایش کاربر
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Send className="w-4 h-4" />
                ارسال پیام
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn-danger flex items-center gap-2">
                <Ban className="w-4 h-4" />
                مسدود کردن
              </button>
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;