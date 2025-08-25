import React, { useState } from 'react';
import { 
  Globe, Mail, Phone, MapPin, Upload, 
  Instagram, Send, Link, Image, 
  Clock, Monitor, Save
} from 'lucide-react';

interface GeneralSettingsProps {
  onSettingsChange: () => void;
}

interface SiteSettings {
  title: string;
  tagline: string;
  description: string;
  keywords: string;
  contact: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
  };
  social: {
    instagram: string;
    telegram: string;
    whatsapp: string;
    website: string;
  };
  branding: {
    logo: File | null;
    favicon: File | null;
    logoUrl: string;
    faviconUrl: string;
  };
  general: {
    language: string;
    timezone: string;
    dateFormat: string;
    maintenanceMode: boolean;
  };
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    title: 'آی‌شاپ - فروشگاه آنلاین',
    tagline: 'بهترین محصولات با قیمت مناسب',
    description: 'فروشگاه آنلاین آی‌شاپ ارائه‌دهنده بهترین محصولات با کیفیت و قیمت مناسب در سراسر ایران',
    keywords: 'فروشگاه آنلاین، خرید، آی‌شاپ، محصولات ایرانی',
    contact: {
      address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
      phone: '۰۲۱-۸۸۱۲۳۴۵۶',
      email: 'info@ishop.ir',
      workingHours: 'شنبه تا چهارشنبه ۹-۱۷، پنج‌شنبه ۹-۱۳'
    },
    social: {
      instagram: '@ishop_official',
      telegram: '@ishop_support',
      whatsapp: '09123456789',
      website: 'https://ishop.ir'
    },
    branding: {
      logo: null,
      favicon: null,
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.ico'
    },
    general: {
      language: 'fa',
      timezone: 'Asia/Tehran',
      dateFormat: 'jalali',
      maintenanceMode: false
    }
  });

  const handleInputChange = (section: keyof SiteSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SiteSettings],
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const handleDirectChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    onSettingsChange();
  };

  const handleFileUpload = (type: 'logo' | 'favicon', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSettings(prev => ({
        ...prev,
        branding: {
          ...prev.branding,
          [type]: file,
          [`${type}Url`]: url
        }
      }));
      onSettingsChange();
    }
  };

  const iranianTimezones = [
    { value: 'Asia/Tehran', label: 'تهران (UTC+3:30)' }
  ];

  const languages = [
    { value: 'fa', label: 'فارسی' },
    { value: 'en', label: 'انگلیسی' }
  ];

  const dateFormats = [
    { value: 'jalali', label: 'شمسی (جلالی)' },
    { value: 'gregorian', label: 'میلادی' }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Site Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          اطلاعات اصلی سایت
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان سایت
            </label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => handleDirectChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="نام فروشگاه شما"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شعار سایت
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => handleDirectChange('tagline', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="شعار یا توضیح کوتاه"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیحات سایت
            </label>
            <textarea
              value={settings.description}
              onChange={(e) => handleDirectChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="توضیحات کاملی از فروشگاه خود بنویسید"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              کلمات کلیدی (SEO)
            </label>
            <input
              type="text"
              value={settings.keywords}
              onChange={(e) => handleDirectChange('keywords', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="کلمات کلیدی را با کاما جدا کنید"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-green-600" />
          اطلاعات تماس
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              آدرس
            </label>
            <textarea
              value={settings.contact.address}
              onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="آدرس کامل فروشگاه"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              تلفن
            </label>
            <input
              type="text"
              value={settings.contact.phone}
              onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              ایمیل
            </label>
            <input
              type="email"
              value={settings.contact.email}
              onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="info@example.ir"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              ساعات کاری
            </label>
            <input
              type="text"
              value={settings.contact.workingHours}
              onChange={(e) => handleInputChange('contact', 'workingHours', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="شنبه تا چهارشنبه ۹-۱۷"
            />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Link className="w-5 h-5 text-pink-600" />
          شبکه‌های اجتماعی
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-600" />
              اینستاگرام
            </label>
            <input
              type="text"
              value={settings.social.instagram}
              onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="@username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              تلگرام
            </label>
            <input
              type="text"
              value={settings.social.telegram}
              onChange={(e) => handleInputChange('social', 'telegram', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="@channel"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-600" />
              واتساپ
            </label>
            <input
              type="text"
              value={settings.social.whatsapp}
              onChange={(e) => handleInputChange('social', 'whatsapp', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="09123456789"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              وب‌سایت
            </label>
            <input
              type="url"
              value={settings.social.website}
              onChange={(e) => handleInputChange('social', 'website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.ir"
            />
          </div>
        </div>
      </div>

      {/* Branding */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Image className="w-5 h-5 text-purple-600" />
          برندینگ و لوگو
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              لوگو سایت
            </label>
            <div className="space-y-3">
              {settings.branding.logoUrl && (
                <div className="w-32 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <img 
                    src={settings.branding.logoUrl} 
                    alt="Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('logo', e)}
                  className="hidden"
                  id="logo-upload"
                />
                <label 
                  htmlFor="logo-upload" 
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  انتخاب فایل
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              آیکن سایت (Favicon)
            </label>
            <div className="space-y-3">
              {settings.branding.faviconUrl && (
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <img 
                    src={settings.branding.faviconUrl} 
                    alt="Favicon" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('favicon', e)}
                  className="hidden"
                  id="favicon-upload"
                />
                <label 
                  htmlFor="favicon-upload" 
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  انتخاب فایل
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* General Configuration */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-gray-600" />
          تنظیمات عمومی
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              زبان پیش‌فرض
            </label>
            <select
              value={settings.general.language}
              onChange={(e) => handleInputChange('general', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              منطقه زمانی
            </label>
            <select
              value={settings.general.timezone}
              onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {iranianTimezones.map(tz => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فرمت تاریخ
            </label>
            <select
              value={settings.general.dateFormat}
              onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dateFormats.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.general.maintenanceMode}
              onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="mr-2 text-sm text-gray-700">
              حالت تعمیر و نگهداری (سایت برای کاربران غیرفعال می‌شود)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;