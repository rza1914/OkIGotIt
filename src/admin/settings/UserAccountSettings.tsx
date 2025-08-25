import React, { useState } from 'react';
import { 
  Users, UserPlus, Lock, Mail, 
  Shield, CheckCircle, Eye, Settings,
  UserCheck, AlertTriangle, Clock
} from 'lucide-react';

interface UserAccountSettingsProps {
  onSettingsChange: () => void;
}

interface UserSettings {
  registration: {
    enabled: boolean;
    require_email_verification: boolean;
    require_phone_verification: boolean;
    require_admin_approval: boolean;
    allowed_domains: string[];
    blocked_domains: string[];
    auto_login_after_registration: boolean;
    welcome_email: boolean;
  };
  authentication: {
    password_min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_special_chars: boolean;
    password_expiry_days: number;
    max_login_attempts: number;
    lockout_duration_minutes: number;
    two_factor_auth: boolean;
    remember_me_duration: number;
  };
  account: {
    profile_fields_required: string[];
    allow_account_deletion: boolean;
    account_deletion_delay_days: number;
    data_export_enabled: boolean;
    profile_picture_required: boolean;
    national_id_required: boolean;
  };
  privacy: {
    show_last_seen: boolean;
    show_online_status: boolean;
    allow_search_by_email: boolean;
    allow_search_by_phone: boolean;
    data_retention_days: number;
    cookie_consent_required: boolean;
  };
  roles: {
    default_role: string;
    available_roles: Array<{
      id: string;
      name: string;
      description: string;
      permissions: string[];
    }>;
  };
}

const UserAccountSettings: React.FC<UserAccountSettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<UserSettings>({
    registration: {
      enabled: true,
      require_email_verification: true,
      require_phone_verification: false,
      require_admin_approval: false,
      allowed_domains: [],
      blocked_domains: ['tempmail.org', '10minutemail.com'],
      auto_login_after_registration: true,
      welcome_email: true
    },
    authentication: {
      password_min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_special_chars: false,
      password_expiry_days: 0,
      max_login_attempts: 5,
      lockout_duration_minutes: 15,
      two_factor_auth: false,
      remember_me_duration: 30
    },
    account: {
      profile_fields_required: ['first_name', 'last_name', 'phone'],
      allow_account_deletion: true,
      account_deletion_delay_days: 30,
      data_export_enabled: true,
      profile_picture_required: false,
      national_id_required: false
    },
    privacy: {
      show_last_seen: false,
      show_online_status: false,
      allow_search_by_email: false,
      allow_search_by_phone: false,
      data_retention_days: 2555, // 7 years
      cookie_consent_required: true
    },
    roles: {
      default_role: 'customer',
      available_roles: [
        {
          id: 'customer',
          name: 'مشتری',
          description: 'کاربر عادی با دسترسی به خرید',
          permissions: ['view_products', 'place_orders', 'view_profile']
        },
        {
          id: 'vip',
          name: 'مشتری VIP',
          description: 'مشتری ویژه با تخفیف‌های اضافی',
          permissions: ['view_products', 'place_orders', 'view_profile', 'vip_discounts']
        },
        {
          id: 'wholesale',
          name: 'عمده فروش',
          description: 'خریدار عمده با قیمت‌های ویژه',
          permissions: ['view_products', 'place_orders', 'view_profile', 'wholesale_prices']
        }
      ]
    }
  });

  const handleChange = (section: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const handleArrayChange = (section: keyof UserSettings, field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: items
      }
    }));
    onSettingsChange();
  };

  const profileFields = [
    { id: 'first_name', name: 'نام' },
    { id: 'last_name', name: 'نام خانوادگی' },
    { id: 'phone', name: 'شماره تلفن' },
    { id: 'address', name: 'آدرس' },
    { id: 'national_id', name: 'کد ملی' },
    { id: 'birth_date', name: 'تاریخ تولد' }
  ];

  const getPasswordStrengthText = () => {
    const { password_min_length, require_uppercase, require_lowercase, require_numbers, require_special_chars } = settings.authentication;
    let requirements = [`حداقل ${password_min_length} کاراکتر`];
    
    if (require_uppercase) requirements.push('حروف بزرگ');
    if (require_lowercase) requirements.push('حروف کوچک');
    if (require_numbers) requirements.push('اعداد');
    if (require_special_chars) requirements.push('نمادها');
    
    return requirements.join('، ');
  };

  return (
    <div className="p-6 space-y-8">
      {/* Registration Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          تنظیمات ثبت‌نام
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="registration-enabled"
              checked={settings.registration.enabled}
              onChange={(e) => handleChange('registration', 'enabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="registration-enabled" className="mr-2 text-sm text-gray-700">
              امکان ثبت‌نام کاربران جدید
            </label>
          </div>
          
          {settings.registration.enabled && (
            <div className="p-4 bg-blue-50 rounded-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email-verification"
                    checked={settings.registration.require_email_verification}
                    onChange={(e) => handleChange('registration', 'require_email_verification', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="email-verification" className="mr-2 text-sm text-gray-700">
                    تایید ایمیل الزامی
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="phone-verification"
                    checked={settings.registration.require_phone_verification}
                    onChange={(e) => handleChange('registration', 'require_phone_verification', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="phone-verification" className="mr-2 text-sm text-gray-700">
                    تایید شماره موبایل الزامی
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="admin-approval"
                    checked={settings.registration.require_admin_approval}
                    onChange={(e) => handleChange('registration', 'require_admin_approval', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="admin-approval" className="mr-2 text-sm text-gray-700">
                    تایید مدیر برای فعال‌سازی حساب
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-login"
                    checked={settings.registration.auto_login_after_registration}
                    onChange={(e) => handleChange('registration', 'auto_login_after_registration', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="auto-login" className="mr-2 text-sm text-gray-700">
                    ورود خودکار پس از ثبت‌نام
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="welcome-email"
                    checked={settings.registration.welcome_email}
                    onChange={(e) => handleChange('registration', 'welcome_email', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="welcome-email" className="mr-2 text-sm text-gray-700">
                    ارسال ایمیل خوشامدگویی
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دامنه‌های مجاز برای ثبت‌نام (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={settings.registration.allowed_domains.join(', ')}
                    onChange={(e) => handleArrayChange('registration', 'allowed_domains', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="gmail.com, company.ir"
                  />
                  <p className="text-xs text-gray-500 mt-1">با کاما جدا کنید، خالی = همه مجاز</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دامنه‌های مسدود
                  </label>
                  <input
                    type="text"
                    value={settings.registration.blocked_domains.join(', ')}
                    onChange={(e) => handleArrayChange('registration', 'blocked_domains', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tempmail.org, spam.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">با کاما جدا کنید</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-red-600" />
          تنظیمات احراز هویت
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداقل طول رمز عبور
            </label>
            <input
              type="number"
              value={settings.authentication.password_min_length}
              onChange={(e) => handleChange('authentication', 'password_min_length', parseInt(e.target.value) || 8)}
              min="4"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداکثر تعداد تلاش ورود
            </label>
            <input
              type="number"
              value={settings.authentication.max_login_attempts}
              onChange={(e) => handleChange('authentication', 'max_login_attempts', parseInt(e.target.value) || 5)}
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مدت قفل شدن حساب (دقیقه)
            </label>
            <input
              type="number"
              value={settings.authentication.lockout_duration_minutes}
              onChange={(e) => handleChange('authentication', 'lockout_duration_minutes', parseInt(e.target.value) || 15)}
              min="1"
              max="1440"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مدت اعتبار "مرا به خاطر بسپار" (روز)
            </label>
            <input
              type="number"
              value={settings.authentication.remember_me_duration}
              onChange={(e) => handleChange('authentication', 'remember_me_duration', parseInt(e.target.value) || 30)}
              min="1"
              max="365"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-800 mb-3">الزامات پیچیدگی رمز عبور</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="require-uppercase"
                checked={settings.authentication.require_uppercase}
                onChange={(e) => handleChange('authentication', 'require_uppercase', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="require-uppercase" className="mr-2 text-sm text-gray-700">
                حروف بزرگ (A-Z)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="require-lowercase"
                checked={settings.authentication.require_lowercase}
                onChange={(e) => handleChange('authentication', 'require_lowercase', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="require-lowercase" className="mr-2 text-sm text-gray-700">
                حروف کوچک (a-z)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="require-numbers"
                checked={settings.authentication.require_numbers}
                onChange={(e) => handleChange('authentication', 'require_numbers', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="require-numbers" className="mr-2 text-sm text-gray-700">
                اعداد (0-9)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="require-special"
                checked={settings.authentication.require_special_chars}
                onChange={(e) => handleChange('authentication', 'require_special_chars', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="require-special" className="mr-2 text-sm text-gray-700">
                نمادهای خاص (!@#$)
              </label>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-600">
              <strong>الزامات فعلی:</strong> {getPasswordStrengthText()}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="two-factor-auth"
              checked={settings.authentication.two_factor_auth}
              onChange={(e) => handleChange('authentication', 'two_factor_auth', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="two-factor-auth" className="mr-2 text-sm text-gray-700">
              فعال‌سازی احراز هویت دو مرحله‌ای (2FA)
            </label>
          </div>
        </div>
      </div>

      {/* Account Management */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-green-600" />
          مدیریت حساب کاربری
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">فیلدهای الزامی پروفایل</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profileFields.map(field => (
                <div key={field.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`required-${field.id}`}
                    checked={settings.account.profile_fields_required.includes(field.id)}
                    onChange={(e) => {
                      const current = settings.account.profile_fields_required;
                      const updated = e.target.checked 
                        ? [...current, field.id]
                        : current.filter(f => f !== field.id);
                      handleChange('account', 'profile_fields_required', updated);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`required-${field.id}`} className="mr-2 text-sm text-gray-700">
                    {field.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="profile-picture-required"
                  checked={settings.account.profile_picture_required}
                  onChange={(e) => handleChange('account', 'profile_picture_required', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="profile-picture-required" className="mr-2 text-sm text-gray-700">
                  عکس پروفایل الزامی
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="national-id-required"
                  checked={settings.account.national_id_required}
                  onChange={(e) => handleChange('account', 'national_id_required', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="national-id-required" className="mr-2 text-sm text-gray-700">
                  کد ملی الزامی
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allow-deletion"
                  checked={settings.account.allow_account_deletion}
                  onChange={(e) => handleChange('account', 'allow_account_deletion', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="allow-deletion" className="mr-2 text-sm text-gray-700">
                  امکان حذف حساب توسط کاربر
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="data-export"
                  checked={settings.account.data_export_enabled}
                  onChange={(e) => handleChange('account', 'data_export_enabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="data-export" className="mr-2 text-sm text-gray-700">
                  امکان صادرات اطلاعات شخصی
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مهلت حذف حساب (روز)
              </label>
              <input
                type="number"
                value={settings.account.account_deletion_delay_days}
                onChange={(e) => handleChange('account', 'account_deletion_delay_days', parseInt(e.target.value) || 30)}
                min="0"
                max="365"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">مدت انتظار قبل از حذف نهایی حساب</p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-600" />
          تنظیمات حریم خصوصی
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-last-seen"
                checked={settings.privacy.show_last_seen}
                onChange={(e) => handleChange('privacy', 'show_last_seen', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="show-last-seen" className="mr-2 text-sm text-gray-700">
                نمایش آخرین بازدید
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-online-status"
                checked={settings.privacy.show_online_status}
                onChange={(e) => handleChange('privacy', 'show_online_status', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="show-online-status" className="mr-2 text-sm text-gray-700">
                نمایش وضعیت آنلاین بودن
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="search-by-email"
                checked={settings.privacy.allow_search_by_email}
                onChange={(e) => handleChange('privacy', 'allow_search_by_email', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="search-by-email" className="mr-2 text-sm text-gray-700">
                جستجو کاربران با ایمیل
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="search-by-phone"
                checked={settings.privacy.allow_search_by_phone}
                onChange={(e) => handleChange('privacy', 'allow_search_by_phone', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="search-by-phone" className="mr-2 text-sm text-gray-700">
                جستجو کاربران با شماره تلفن
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="cookie-consent"
                checked={settings.privacy.cookie_consent_required}
                onChange={(e) => handleChange('privacy', 'cookie_consent_required', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="cookie-consent" className="mr-2 text-sm text-gray-700">
                رضایت کوکی الزامی
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مدت نگهداری داده‌ها (روز)
            </label>
            <input
              type="number"
              value={settings.privacy.data_retention_days}
              onChange={(e) => handleChange('privacy', 'data_retention_days', parseInt(e.target.value) || 2555)}
              min="30"
              max="3650"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              حداقل ۳۰ روز، ۲۵۵۵ روز = ۷ سال (طبق قانون)
            </p>
          </div>
        </div>
      </div>

      {/* User Roles */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          نقش‌های کاربری
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نقش پیش‌فرض برای کاربران جدید
            </label>
            <select
              value={settings.roles.default_role}
              onChange={(e) => handleChange('roles', 'default_role', e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {settings.roles.available_roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">نقش‌های موجود</h4>
            <div className="space-y-3">
              {settings.roles.available_roles.map(role => (
                <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{role.name}</h5>
                    <span className="text-sm text-gray-500">#{role.id}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map(permission => (
                      <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Settings className="w-5 h-5 text-green-600" />
          خلاصه تنظیمات کاربران
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">ثبت‌نام:</span>
            <span className="font-medium text-gray-900 mr-2">
              {settings.registration.enabled ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">تایید ایمیل:</span>
            <span className="font-medium text-gray-900 mr-2">
              {settings.registration.require_email_verification ? 'الزامی' : 'اختیاری'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">حداقل رمز عبور:</span>
            <span className="font-medium text-gray-900 mr-2">
              {settings.authentication.password_min_length} کاراکتر
            </span>
          </div>
          <div>
            <span className="text-gray-600">احراز دو مرحله‌ای:</span>
            <span className="font-medium text-gray-900 mr-2">
              {settings.authentication.two_factor_auth ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">نقش پیش‌فرض:</span>
            <span className="font-medium text-gray-900 mr-2">
              {settings.roles.available_roles.find(r => r.id === settings.roles.default_role)?.name}
            </span>
          </div>
          <div>
            <span className="text-gray-600">نگهداری داده:</span>
            <span className="font-medium text-gray-900 mr-2">
              {Math.floor(settings.privacy.data_retention_days / 365)} سال
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccountSettings;