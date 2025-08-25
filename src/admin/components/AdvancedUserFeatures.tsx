import React, { useState } from 'react';
import { 
  X, Users, Star, Gift, Share, Crown, Target, 
  TrendingUp, Award, Heart, MessageCircle, Tag,
  UserCheck, Zap, Calendar, Settings, Plus
} from 'lucide-react';
import { toPersianNumber, formatPersianCurrency, formatPersianDate } from '../../utils/persian';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  total_spent: number;
  loyalty_points: number;
  referral_code?: string;
  total_referrals?: number;
}

interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  color: string;
  user_count: number;
}

interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  points_per_toman: number;
  min_spend: number;
  benefits: string[];
  active: boolean;
}

interface ReferralProgram {
  id: string;
  name: string;
  reward_referrer: number;
  reward_referred: number;
  min_order_value: number;
  active: boolean;
  expiry_days: number;
}

interface VIPBenefit {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
}

interface AdvancedUserFeaturesProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const AdvancedUserFeatures: React.FC<AdvancedUserFeaturesProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('segmentation');

  // Mock data
  const userSegments: UserSegment[] = [
    {
      id: '1',
      name: 'مشتریان VIP',
      description: 'مشتریان با خرید بالای ۱۰ میلیون تومان',
      criteria: ['total_spent > 10000000', 'orders > 10'],
      color: 'purple',
      user_count: 156
    },
    {
      id: '2',
      name: 'مشتریان وفادار',
      description: 'مشتریان با بیش از ۶ ماه فعالیت',
      criteria: ['account_age > 180', 'orders > 5'],
      color: 'blue',
      user_count: 423
    },
    {
      id: '3',
      name: 'مشتریان جدید',
      description: 'مشتریان جدید کمتر از ۳۰ روز',
      criteria: ['account_age < 30'],
      color: 'green',
      user_count: 89
    },
    {
      id: '4',
      name: 'در خطر ترک',
      description: 'مشتریان بدون خرید در ۶۰ روز گذشته',
      criteria: ['last_order > 60_days'],
      color: 'red',
      user_count: 67
    }
  ];

  const loyaltyPrograms: LoyaltyProgram[] = [
    {
      id: '1',
      name: 'برنامه امتیاز طلایی',
      description: 'دریافت امتیاز برای هر خرید',
      points_per_toman: 1,
      min_spend: 100000,
      benefits: ['تخفیف ۵% در خریدهای بعدی', 'ارسال رایگان', 'پشتیبانی اختصاصی'],
      active: true
    },
    {
      id: '2',
      name: 'برنامه VIP',
      description: 'امتیازات ویژه برای مشتریان VIP',
      points_per_toman: 2,
      min_spend: 1000000,
      benefits: ['تخفیف ۱۰%', 'دسترسی زودهنگام', 'خدمات شخصی‌سازی شده'],
      active: true
    }
  ];

  const referralPrograms: ReferralProgram[] = [
    {
      id: '1',
      name: 'برنامه معرفی دوستان',
      reward_referrer: 50000,
      reward_referred: 25000,
      min_order_value: 200000,
      active: true,
      expiry_days: 30
    }
  ];

  const vipBenefits: VIPBenefit[] = [
    {
      id: '1',
      name: 'ارسال اکسپرس رایگان',
      description: 'ارسال رایگان تمام سفارشات',
      icon: 'zap',
      active: true
    },
    {
      id: '2',
      name: 'پشتیبانی ۲۴/۷',
      description: 'پشتیبانی اختصاصی در تمام ساعات',
      icon: 'message-circle',
      active: true
    },
    {
      id: '3',
      name: 'دسترسی زودهنگام',
      description: 'دسترسی به محصولات جدید قبل از سایرین',
      icon: 'star',
      active: true
    },
    {
      id: '4',
      name: 'تخفیف اختصاصی',
      description: 'تخفیف‌های ویژه و کدهای تخفیف اختصاصی',
      icon: 'gift',
      active: true
    }
  ];

  const getUserSegments = (user: User): UserSegment[] => {
    // Mock logic to determine user segments
    const segments = [];
    
    if (user.total_spent > 10000000) {
      segments.push(userSegments.find(s => s.id === '1')!);
    }
    
    if (user.user_type === 'vip') {
      segments.push(userSegments.find(s => s.id === '2')!);
    }
    
    return segments.filter(Boolean);
  };

  const promoteToVIP = () => {
    console.log('Promoting user to VIP:', user.id);
    // Implementation for VIP promotion
  };

  const adjustLoyaltyPoints = (points: number) => {
    console.log('Adjusting loyalty points:', user.id, points);
    // Implementation for loyalty points adjustment
  };

  const generateReferralCode = () => {
    console.log('Generating referral code for:', user.id);
    // Implementation for referral code generation
  };

  const getSegmentColor = (color: string) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIcon = (iconName: string) => {
    const icons = {
      zap: <Zap className="w-4 h-4" />,
      'message-circle': <MessageCircle className="w-4 h-4" />,
      star: <Star className="w-4 h-4" />,
      gift: <Gift className="w-4 h-4" />
    };
    return icons[iconName as keyof typeof icons] || <Star className="w-4 h-4" />;
  };

  if (!isOpen) return null;

  const userSegmentsForUser = getUserSegments(user);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">ویژگی‌های پیشرفته</h2>
              <p className="text-white/80">
                مدیریت پیشرفته برای {user.first_name} {user.last_name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-reverse space-x-8 px-6">
            {[
              { key: 'segmentation', label: 'بخش‌بندی', icon: Target },
              { key: 'loyalty', label: 'برنامه وفاداری', icon: Award },
              { key: 'referral', label: 'معرفی دوستان', icon: Share },
              { key: 'vip', label: 'خدمات VIP', icon: Crown }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-600'
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
        <div className="max-h-[calc(90vh-160px)] overflow-y-auto">
          <div className="p-6">
            {/* Segmentation Tab */}
            {activeTab === 'segmentation' && (
              <div className="space-y-6">
                {/* Current User Segments */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">بخش‌های فعلی کاربر</h3>
                  {userSegmentsForUser.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userSegmentsForUser.map(segment => (
                        <span
                          key={segment.id}
                          className={`px-3 py-2 rounded-full text-sm font-medium border ${getSegmentColor(segment.color)}`}
                        >
                          {segment.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">کاربر در هیچ بخش خاصی قرار ندارد</p>
                  )}
                </div>

                {/* All Available Segments */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">تمام بخش‌ها</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userSegments.map(segment => (
                      <div key={segment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{segment.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSegmentColor(segment.color)}`}>
                            {toPersianNumber(segment.user_count)} نفر
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{segment.description}</p>
                        <div className="text-xs text-gray-500">
                          <strong>معیارها:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {segment.criteria.map((criterion, index) => (
                              <li key={index}>{criterion}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loyalty Tab */}
            {activeTab === 'loyalty' && (
              <div className="space-y-6">
                {/* Current Loyalty Status */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">وضعیت برنامه وفاداری</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {toPersianNumber(user.loyalty_points || 0)}
                      </div>
                      <div className="text-sm text-gray-600">امتیاز فعلی</div>
                    </div>
                    
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatPersianCurrency(user.total_spent)}
                      </div>
                      <div className="text-sm text-gray-600">کل خرید</div>
                    </div>

                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <Crown className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {user.user_type === 'vip' ? 'VIP' : 'عادی'}
                      </div>
                      <div className="text-sm text-gray-600">سطح کاربری</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => adjustLoyaltyPoints(100)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      افزودن امتیاز
                    </button>
                    
                    {user.user_type !== 'vip' && (
                      <button
                        onClick={promoteToVIP}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Crown className="w-4 h-4" />
                        ارتقا به VIP
                      </button>
                    )}
                  </div>
                </div>

                {/* Loyalty Programs */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">برنامه‌های وفاداری</h3>
                  <div className="space-y-4">
                    {loyaltyPrograms.map(program => (
                      <div key={program.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{program.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            program.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {program.active ? 'فعال' : 'غیرفعال'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-xs text-gray-500">امتیاز به ازای هر تومان:</span>
                            <div className="font-medium">{toPersianNumber(program.points_per_toman)}</div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">حداقل خرید:</span>
                            <div className="font-medium">{formatPersianCurrency(program.min_spend)}</div>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs text-gray-500">مزایا:</span>
                          <ul className="text-sm text-gray-700 mt-1">
                            {program.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Star className="w-3 h-3 text-yellow-500" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Referral Tab */}
            {activeTab === 'referral' && (
              <div className="space-y-6">
                {/* Current Referral Status */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">وضعیت معرفی دوستان</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        کد معرفی شخصی
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={user.referral_code || 'ندارد'}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                          readOnly
                        />
                        {!user.referral_code && (
                          <button
                            onClick={generateReferralCode}
                            className="btn-primary text-sm"
                          >
                            ایجاد کد
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تعداد معرفی‌ها
                      </label>
                      <div className="text-2xl font-bold text-gray-900">
                        {toPersianNumber(user.total_referrals || 0)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Referral Programs */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">برنامه‌های معرفی</h3>
                  <div className="space-y-4">
                    {referralPrograms.map(program => (
                      <div key={program.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{program.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            program.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {program.active ? 'فعال' : 'غیرفعال'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-xs text-gray-500">جایزه معرف:</span>
                            <div className="font-medium">{formatPersianCurrency(program.reward_referrer)}</div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">جایزه معرفی شده:</span>
                            <div className="font-medium">{formatPersianCurrency(program.reward_referred)}</div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">حداقل سفارش:</span>
                            <div className="font-medium">{formatPersianCurrency(program.min_order_value)}</div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">مدت اعتبار:</span>
                            <div className="font-medium">{toPersianNumber(program.expiry_days)} روز</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIP Tab */}
            {activeTab === 'vip' && (
              <div className="space-y-6">
                {/* VIP Status */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">وضعیت VIP</h3>
                  <div className="flex items-center gap-4">
                    {user.user_type === 'vip' ? (
                      <div className="flex items-center gap-2 text-purple-600">
                        <Crown className="w-6 h-6" />
                        <span className="text-lg font-medium">کاربر VIP</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600">
                        <UserCheck className="w-6 h-6" />
                        <span className="text-lg font-medium">کاربر عادی</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* VIP Benefits */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">مزایای VIP</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vipBenefits.map(benefit => (
                      <div key={benefit.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            {getIcon(benefit.icon)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900">{benefit.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                benefit.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {benefit.active ? 'فعال' : 'غیرفعال'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VIP Actions */}
                {user.user_type !== 'vip' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-2">ارتقا به VIP</h4>
                    <p className="text-sm text-purple-700 mb-4">
                      با ارتقا این کاربر به VIP، تمام مزایای فوق برای او فعال خواهد شد.
                    </p>
                    <button
                      onClick={promoteToVIP}
                      className="btn-primary bg-purple-600 hover:bg-purple-700 border-purple-600"
                    >
                      <Crown className="w-4 h-4 ml-2" />
                      ارتقا به VIP
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              تمام تغییرات در پروفایل کاربر اعمال می‌شود
            </div>
            <button onClick={onClose} className="btn-secondary">
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedUserFeatures;