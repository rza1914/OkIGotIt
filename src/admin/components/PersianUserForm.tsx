import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Phone, MapPin, Calendar, 
  Shield, Eye, EyeOff, AlertCircle, CheckCircle,
  Save, RefreshCw, Flag, CreditCard, Users
} from 'lucide-react';
import PersianDatePicker from './PersianDatePicker';
import { 
  validateNationalId, validateIranianMobile, formatIranianMobile,
  getMobileOperator, validateIranianPostalCode, formatIranianPostalCode,
  validatePersianName, getCitiesByProvince, IRANIAN_PROVINCES,
  validateIranianIBAN
} from '../../utils/iranian-validation';
import { toPersianNumber, formatPersianDate } from '../../utils/persian';

interface User {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'blocked' | 'suspended';
  user_type: 'customer' | 'vip' | 'premium' | 'blocked';
  email_verified: boolean;
  phone_verified: boolean;
  national_id?: string;
  birthday?: Date;
  gender?: 'male' | 'female' | 'other';
  province?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  iban?: string;
  newsletter_subscribed: boolean;
  sms_subscribed: boolean;
  two_factor_enabled: boolean;
}

interface PersianUserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: User) => Promise<void>;
}

const PersianUserForm: React.FC<PersianUserFormProps> = ({
  user,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<User>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    status: 'active',
    user_type: 'customer',
    email_verified: false,
    phone_verified: false,
    newsletter_subscribed: true,
    sms_subscribed: true,
    two_factor_enabled: false,
    ...user
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);

  // Reset form when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({ ...formData, ...user });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'نام الزامی است';
    } else if (!validatePersianName(formData.first_name)) {
      newErrors.first_name = 'نام باید به زبان فارسی باشد';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'نام خانوادگی الزامی است';
    } else if (!validatePersianName(formData.last_name)) {
      newErrors.last_name = 'نام خانوادگی باید به زبان فارسی باشد';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }

    // Iranian mobile validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره موبایل الزامی است';
    } else if (!validateIranianMobile(formData.phone)) {
      newErrors.phone = 'شماره موبایل ایرانی معتبر نیست';
    }

    // National ID validation (if provided)
    if (formData.national_id && !validateNationalId(formData.national_id)) {
      newErrors.national_id = 'کد ملی معتبر نیست';
    }

    // Postal code validation (if provided)
    if (formData.postal_code && !validateIranianPostalCode(formData.postal_code)) {
      newErrors.postal_code = 'کد پستی معتبر نیست';
    }

    // IBAN validation (if provided)
    if (formData.iban && !validateIranianIBAN(formData.iban)) {
      newErrors.iban = 'شماره شبا معتبر نیست';
    }

    // City-Province validation
    if (formData.city && formData.province) {
      const cities = getCitiesByProvince(formData.province);
      if (!cities.includes(formData.city)) {
        newErrors.city = 'شهر انتخابی متعلق به این استان نیست';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Format phone number
      const processedData = {
        ...formData,
        phone: formatIranianMobile(formData.phone),
        postal_code: formData.postal_code ? formatIranianPostalCode(formData.postal_code) : undefined
      };

      await onSave(processedData);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ submit: 'خطا در ذخیره اطلاعات کاربر' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
    
    // Show operator info if valid
    if (validateIranianMobile(value)) {
      const operator = getMobileOperator(value);
      if (operator) {
        console.log('Mobile operator:', operator);
      }
    }
  };

  const handleProvinceChange = (province: string) => {
    setFormData(prev => ({ 
      ...prev, 
      province,
      city: '' // Reset city when province changes
    }));
  };

  if (!isOpen) return null;

  const availableCities = formData.province ? getCitiesByProvince(formData.province) : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-amber-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {user ? 'ویرایش کاربر' : 'کاربر جدید'}
              </h2>
              <p className="text-white/80">
                {user ? `${user.first_name} ${user.last_name}` : 'افزودن کاربر به سیستم'}
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
              { key: 'personal', label: 'اطلاعات شخصی', icon: User },
              { key: 'contact', label: 'اطلاعات تماس', icon: Phone },
              { key: 'address', label: 'آدرس', icon: MapPin },
              { key: 'account', label: 'تنظیمات حساب', icon: Shield }
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

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="p-6">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        errors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="نام کاربر به فارسی"
                    />
                    {errors.first_name && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام خانوادگی <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        errors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="نام خانوادگی به فارسی"
                    />
                    {errors.last_name && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      کد ملی
                    </label>
                    <input
                      type="text"
                      value={formData.national_id || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, national_id: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        errors.national_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="۱۲۳۴۵۶۷۸۹۰"
                      maxLength={10}
                    />
                    {errors.national_id && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.national_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      جنسیت
                    </label>
                    <select
                      value={formData.gender || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="male">آقا</option>
                      <option value="female">خانم</option>
                      <option value="other">سایر</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاریخ تولد
                  </label>
                  <PersianDatePicker
                    value={formData.birthday}
                    onChange={(date) => setFormData(prev => ({ ...prev, birthday: date }))}
                    placeholder="انتخاب تاریخ تولد"
                  />
                </div>
              </div>
            )}

            {/* Contact Information Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ایمیل <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 pl-10 ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="email-verified"
                      checked={formData.email_verified}
                      onChange={(e) => setFormData(prev => ({ ...prev, email_verified: e.target.checked }))}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <label htmlFor="email-verified" className="text-sm text-gray-700">
                      ایمیل تایید شده
                    </label>
                    {formData.email_verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شماره موبایل <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 pl-10 ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="09123456789"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  {validateIranianMobile(formData.phone) && (
                    <div className="text-xs text-gray-600 mt-1">
                      اپراتور: {getMobileOperator(formData.phone)}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="phone-verified"
                      checked={formData.phone_verified}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone_verified: e.target.checked }))}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <label htmlFor="phone-verified" className="text-sm text-gray-700">
                      موبایل تایید شده
                    </label>
                    {formData.phone_verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                  
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شماره شبا (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={formData.iban || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value.toUpperCase() }))}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.iban ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="IR123456789012345678901234"
                    maxLength={26}
                  />
                  {errors.iban && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.iban}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      استان
                    </label>
                    <select
                      value={formData.province || ''}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">انتخاب استان</option>
                      {Object.keys(IRANIAN_PROVINCES).map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      شهر
                    </label>
                    <select
                      value={formData.city || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!formData.province}
                      className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        !formData.province ? 'bg-gray-100 cursor-not-allowed' : ''
                      } ${errors.city ? 'border-red-300 bg-red-50' : ''}`}
                    >
                      <option value="">انتخاب شهر</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    آدرس کامل
                  </label>
                  <textarea
                    value={formData.address || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="آدرس کامل خود را وارد کنید..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    کد پستی
                  </label>
                  <input
                    type="text"
                    value={formData.postal_code || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.postal_code ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="1234567890"
                    maxLength={10}
                  />
                  {errors.postal_code && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.postal_code}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وضعیت حساب
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="active">فعال</option>
                      <option value="inactive">غیرفعال</option>
                      <option value="suspended">تعلیق</option>
                      <option value="blocked">مسدود</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع کاربر
                    </label>
                    <select
                      value={formData.user_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, user_type: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="customer">مشتری عادی</option>
                      <option value="vip">VIP</option>
                      <option value="premium">ممتاز</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.newsletter_subscribed}
                      onChange={(e) => setFormData(prev => ({ ...prev, newsletter_subscribed: e.target.checked }))}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-sm text-gray-700">اشتراک خبرنامه</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.sms_subscribed}
                      onChange={(e) => setFormData(prev => ({ ...prev, sms_subscribed: e.target.checked }))}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-sm text-gray-700">اطلاع‌رسانی پیامکی</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.two_factor_enabled}
                      onChange={(e) => setFormData(prev => ({ ...prev, two_factor_enabled: e.target.checked }))}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-sm text-gray-700">احراز هویت دومرحله‌ای</span>
                  </label>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submit}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                تمام فیلدهای مشخص شده با * الزامی هستند
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {user ? 'به‌روزرسانی' : 'ایجاد کاربر'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersianUserForm;