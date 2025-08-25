import React, { useState } from 'react';
import { 
  Languages, Calendar, Globe, Type, 
  MapPin, Clock, Settings, Flag,
  Download, Upload, Edit, CheckCircle,
  AlertCircle, RefreshCw
} from 'lucide-react';

interface LocalizationSettingsProps {
  onSettingsChange: () => void;
}

interface LocalizationConfig {
  language: {
    default_language: 'fa' | 'en';
    available_languages: string[];
    rtl_languages: string[];
    auto_detect_language: boolean;
    fallback_language: 'fa' | 'en';
    language_switcher_enabled: boolean;
  };
  calendar: {
    default_calendar: 'jalali' | 'gregorian';
    date_format: string;
    time_format: '12h' | '24h';
    first_day_of_week: number; // 0 = Sunday, 1 = Monday, 6 = Saturday
    show_holidays: boolean;
    persian_holidays: boolean;
  };
  numbers: {
    number_system: 'persian' | 'arabic' | 'latin';
    currency_format: string;
    decimal_separator: '.' | '،';
    thousands_separator: ',' | '٬' | ' ';
    show_currency_symbol: boolean;
  };
  regional: {
    timezone: string;
    country: string;
    region: string;
    postal_code_format: string;
    phone_number_format: string;
    address_format: string;
  };
  fonts: {
    primary_font: string;
    secondary_font: string;
    font_size_base: number;
    line_height: number;
    letter_spacing: number;
    enable_web_fonts: boolean;
  };
  content: {
    text_direction: 'rtl' | 'ltr' | 'auto';
    content_alignment: 'right' | 'left' | 'center';
    enable_translation: boolean;
    translation_provider: 'google' | 'custom' | 'none';
    auto_translate_products: boolean;
  };
}

const LocalizationSettings: React.FC<LocalizationSettingsProps> = ({ onSettingsChange }) => {
  const [config, setConfig] = useState<LocalizationConfig>({
    language: {
      default_language: 'fa',
      available_languages: ['fa', 'en'],
      rtl_languages: ['fa', 'ar', 'he'],
      auto_detect_language: false,
      fallback_language: 'fa',
      language_switcher_enabled: true
    },
    calendar: {
      default_calendar: 'jalali',
      date_format: 'YYYY/MM/DD',
      time_format: '24h',
      first_day_of_week: 6, // Saturday
      show_holidays: true,
      persian_holidays: true
    },
    numbers: {
      number_system: 'persian',
      currency_format: '### ریال',
      decimal_separator: '.',
      thousands_separator: ',',
      show_currency_symbol: true
    },
    regional: {
      timezone: 'Asia/Tehran',
      country: 'IR',
      region: 'Fars',
      postal_code_format: '##########',
      phone_number_format: '09#########',
      address_format: '{address}, {city}, {province}, {postal_code}'
    },
    fonts: {
      primary_font: 'Vazirmatn',
      secondary_font: 'IRANSans',
      font_size_base: 14,
      line_height: 1.6,
      letter_spacing: 0,
      enable_web_fonts: true
    },
    content: {
      text_direction: 'rtl',
      content_alignment: 'right',
      enable_translation: false,
      translation_provider: 'none',
      auto_translate_products: false
    }
  });

  const [translations, setTranslations] = useState({
    current_language: 'fa',
    progress: {
      fa: 100,
      en: 45
    }
  });

  const handleConfigChange = (section: keyof LocalizationConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const availableLanguages = [
    { code: 'fa', name: 'فارسی', flag: '🇮🇷', rtl: true },
    { code: 'en', name: 'English', flag: '🇺🇸', rtl: false },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', rtl: false },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', rtl: false }
  ];

  const iranianTimezones = [
    { value: 'Asia/Tehran', label: 'تهران (UTC+3:30)' }
  ];

  const persianFonts = [
    'Vazirmatn',
    'IRANSans',
    'YekanBakh',
    'Sahel',
    'Samim',
    'Shabnam'
  ];

  const dateFormats = [
    { value: 'YYYY/MM/DD', label: '۱۴۰۳/۰۴/۱۵' },
    { value: 'DD/MM/YYYY', label: '۱۵/۰۴/۱۴۰۳' },
    { value: 'MM/DD/YYYY', label: '۰۴/۱۵/۱۴۰۳' },
    { value: 'DD MMMM YYYY', label: '۱۵ تیر ۱۴۰۳' }
  ];

  const weekDays = [
    { value: 0, label: 'یکشنبه' },
    { value: 1, label: 'دوشنبه' },
    { value: 6, label: 'شنبه' }
  ];

  const exportTranslations = () => {
    const translations = {
      fa: {
        'welcome': 'خوش آمدید',
        'products': 'محصولات',
        'cart': 'سبد خرید'
        // ... more translations
      }
    };
    
    const blob = new Blob([JSON.stringify(translations, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translations.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTranslations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const translations = JSON.parse(e.target?.result as string);
          console.log('Imported translations:', translations);
          alert('ترجمه‌ها با موفقیت وارد شدند!');
        } catch (error) {
          alert('خطا در وارد کردن فایل ترجمه');
        }
      };
      reader.readAsText(file);
    }
  };

  const generateSampleContent = () => {
    return (
      <div className={`p-4 border rounded-lg ${config.content.text_direction === 'rtl' ? 'text-right' : 'text-left'}`} 
           style={{ 
             fontFamily: config.fonts.primary_font,
             fontSize: `${config.fonts.font_size_base}px`,
             lineHeight: config.fonts.line_height,
             letterSpacing: `${config.fonts.letter_spacing}px`
           }}>
        <h3 className="font-bold mb-2">نمونه متن</h3>
        <p>این یک نمونه متن با تنظیمات فونت و جهت انتخابی شماست.</p>
        <p>تعداد: ۱۲۳٬۴۵۶</p>
        <p>قیمت: ۵۰۰٬۰۰۰ ریال</p>
        <p>تاریخ: ۱۵ تیر ۱۴۰۳</p>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8">
      {/* Language Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Languages className="w-5 h-5 text-blue-600" />
          تنظیمات زبان
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                زبان پیش‌فرض
              </label>
              <select
                value={config.language.default_language}
                onChange={(e) => handleConfigChange('language', 'default_language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableLanguages.filter(lang => config.language.available_languages.includes(lang.code)).map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                زبان پشتیبان
              </label>
              <select
                value={config.language.fallback_language}
                onChange={(e) => handleConfigChange('language', 'fallback_language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              زبان‌های فعال
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {availableLanguages.map(lang => (
                <div key={lang.code} className="flex items-center p-3 border border-gray-200 rounded-md">
                  <input
                    type="checkbox"
                    id={`lang-${lang.code}`}
                    checked={config.language.available_languages.includes(lang.code)}
                    onChange={(e) => {
                      const current = config.language.available_languages;
                      const updated = e.target.checked
                        ? [...current, lang.code]
                        : current.filter(l => l !== lang.code);
                      handleConfigChange('language', 'available_languages', updated);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`lang-${lang.code}`} className="mr-3 flex items-center gap-2 text-sm">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    {translations.progress[lang.code as keyof typeof translations.progress] && (
                      <span className="text-xs text-gray-500">
                        ({translations.progress[lang.code as keyof typeof translations.progress]}%)
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto-detect-language"
                checked={config.language.auto_detect_language}
                onChange={(e) => handleConfigChange('language', 'auto_detect_language', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="auto-detect-language" className="mr-2 text-sm text-gray-700">
                تشخیص خودکار زبان مرورگر
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="language-switcher"
                checked={config.language.language_switcher_enabled}
                onChange={(e) => handleConfigChange('language', 'language_switcher_enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="language-switcher" className="mr-2 text-sm text-gray-700">
                نمایش تغییر زبان در سایت
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar & Date Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          تنظیمات تقویم و تاریخ
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع تقویم
            </label>
            <select
              value={config.calendar.default_calendar}
              onChange={(e) => handleConfigChange('calendar', 'default_calendar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="jalali">شمسی (جلالی)</option>
              <option value="gregorian">میلادی</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فرمت تاریخ
            </label>
            <select
              value={config.calendar.date_format}
              onChange={(e) => handleConfigChange('calendar', 'date_format', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {dateFormats.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فرمت ساعت
            </label>
            <select
              value={config.calendar.time_format}
              onChange={(e) => handleConfigChange('calendar', 'time_format', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="24h">۲۴ ساعته (۱۴:۳۰)</option>
              <option value="12h">۱۲ ساعته (۲:۳۰ ظ.م)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اولین روز هفته
            </label>
            <select
              value={config.calendar.first_day_of_week}
              onChange={(e) => handleConfigChange('calendar', 'first_day_of_week', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {weekDays.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-holidays"
              checked={config.calendar.show_holidays}
              onChange={(e) => handleConfigChange('calendar', 'show_holidays', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="show-holidays" className="mr-2 text-sm text-gray-700">
              نمایش تعطیلات
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="persian-holidays"
              checked={config.calendar.persian_holidays}
              onChange={(e) => handleConfigChange('calendar', 'persian_holidays', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="persian-holidays" className="mr-2 text-sm text-gray-700">
              تعطیلات ایرانی
            </label>
          </div>
        </div>
      </div>

      {/* Number & Currency Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Type className="w-5 h-5 text-purple-600" />
          تنظیمات اعداد و ارز
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سیستم اعداد
            </label>
            <select
              value={config.numbers.number_system}
              onChange={(e) => handleConfigChange('numbers', 'number_system', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="persian">فارسی (۱۲۳۴)</option>
              <option value="arabic">عربی (١٢٣٤)</option>
              <option value="latin">لاتین (1234)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فرمت ارز
            </label>
            <input
              type="text"
              value={config.numbers.currency_format}
              onChange={(e) => handleConfigChange('numbers', 'currency_format', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="### ریال"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              جداکننده اعشار
            </label>
            <select
              value={config.numbers.decimal_separator}
              onChange={(e) => handleConfigChange('numbers', 'decimal_separator', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value=".">نقطه (.)</option>
              <option value="،">ویرگول (،)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              جداکننده هزارگان
            </label>
            <select
              value={config.numbers.thousands_separator}
              onChange={(e) => handleConfigChange('numbers', 'thousands_separator', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value=",">کاما (,)</option>
              <option value="٬">کاما فارسی (٬)</option>
              <option value=" ">فاصله ( )</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-currency-symbol"
              checked={config.numbers.show_currency_symbol}
              onChange={(e) => handleConfigChange('numbers', 'show_currency_symbol', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="show-currency-symbol" className="mr-2 text-sm text-gray-700">
              نمایش نماد ارز
            </label>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-purple-50 rounded-md">
          <div className="text-sm text-gray-600">
            <strong>نمونه:</strong> ۱۲۳٬۴۵۶٬۷۸۹ ریال
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" />
          تنظیمات منطقه‌ای
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              منطقه زمانی
            </label>
            <select
              value={config.regional.timezone}
              onChange={(e) => handleConfigChange('regional', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              کشور
            </label>
            <input
              type="text"
              value="ایران"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فرمت کد پستی
            </label>
            <input
              type="text"
              value={config.regional.postal_code_format}
              onChange={(e) => handleConfigChange('regional', 'postal_code_format', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="##########"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فرمت شماره تلفن
            </label>
            <input
              type="text"
              value={config.regional.phone_number_format}
              onChange={(e) => handleConfigChange('regional', 'phone_number_format', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="09#########"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            فرمت آدرس
          </label>
          <input
            type="text"
            value={config.regional.address_format}
            onChange={(e) => handleConfigChange('regional', 'address_format', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="{address}, {city}, {province}, {postal_code}"
          />
          <p className="text-xs text-gray-500 mt-1">
            متغیرها: {'{address}'}, {'{city}'}, {'{province}'}, {'{postal_code}'}
          </p>
        </div>
      </div>

      {/* Font Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Type className="w-5 h-5 text-indigo-600" />
          تنظیمات فونت و تایپوگرافی
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فونت اصلی
            </label>
            <select
              value={config.fonts.primary_font}
              onChange={(e) => handleConfigChange('fonts', 'primary_font', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {persianFonts.map(font => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فونت ثانویه
            </label>
            <select
              value={config.fonts.secondary_font}
              onChange={(e) => handleConfigChange('fonts', 'secondary_font', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {persianFonts.map(font => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اندازه فونت پایه (px)
            </label>
            <input
              type="number"
              value={config.fonts.font_size_base}
              onChange={(e) => handleConfigChange('fonts', 'font_size_base', parseInt(e.target.value) || 14)}
              min="10"
              max="24"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ارتفاع خط
            </label>
            <input
              type="number"
              value={config.fonts.line_height}
              onChange={(e) => handleConfigChange('fonts', 'line_height', parseFloat(e.target.value) || 1.6)}
              min="1"
              max="3"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فاصله حروف (px)
            </label>
            <input
              type="number"
              value={config.fonts.letter_spacing}
              onChange={(e) => handleConfigChange('fonts', 'letter_spacing', parseInt(e.target.value) || 0)}
              min="-2"
              max="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enable-web-fonts"
              checked={config.fonts.enable_web_fonts}
              onChange={(e) => handleConfigChange('fonts', 'enable_web_fonts', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="enable-web-fonts" className="mr-2 text-sm text-gray-700">
              استفاده از فونت‌های وب
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            نمونه متن
          </label>
          {generateSampleContent()}
        </div>
      </div>

      {/* Translation Management */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-red-600" />
          مدیریت ترجمه‌ها
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="enable-translation"
                checked={config.content.enable_translation}
                onChange={(e) => handleConfigChange('content', 'enable_translation', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="enable-translation" className="text-sm text-gray-700 font-medium">
                فعال‌سازی سیستم ترجمه
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={exportTranslations} className="btn-secondary text-sm">
                <Download className="w-4 h-4 ml-1" />
                صادرات
              </button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={importTranslations}
                  className="hidden"
                  id="import-translations"
                />
                <label htmlFor="import-translations" className="btn-secondary text-sm cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  وارد کردن
                </label>
              </div>
            </div>
          </div>
          
          {config.content.enable_translation && (
            <div className="p-4 bg-red-50 rounded-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ارائه‌دهنده ترجمه
                </label>
                <select
                  value={config.content.translation_provider}
                  onChange={(e) => handleConfigChange('content', 'translation_provider', e.target.value)}
                  className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="none">بدون ترجمه خودکار</option>
                  <option value="google">Google Translate</option>
                  <option value="custom">سرویس سفارشی</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-translate-products"
                  checked={config.content.auto_translate_products}
                  onChange={(e) => handleConfigChange('content', 'auto_translate_products', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="auto-translate-products" className="mr-2 text-sm text-gray-700">
                  ترجمه خودکار توضیحات محصولات
                </label>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-3">وضعیت ترجمه زبان‌ها</h4>
                <div className="space-y-3">
                  {config.language.available_languages.map(langCode => {
                    const lang = availableLanguages.find(l => l.code === langCode);
                    const progress = translations.progress[langCode as keyof typeof translations.progress] || 0;
                    return (
                      <div key={langCode} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                        <div className="flex items-center gap-3">
                          <span>{lang?.flag}</span>
                          <span className="font-medium">{lang?.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{progress}%</span>
                          <button className="text-red-600 hover:text-red-800">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-600" />
          خلاصه تنظیمات محلی‌سازی
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">زبان اصلی:</span>
            <span className="font-medium">
              {availableLanguages.find(l => l.code === config.language.default_language)?.name}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">تقویم:</span>
            <span className="font-medium">
              {config.calendar.default_calendar === 'jalali' ? 'شمسی' : 'میلادی'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-purple-600" />
            <span className="text-gray-600">فونت:</span>
            <span className="font-medium">
              {config.fonts.primary_font}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-gray-600">منطقه زمانی:</span>
            <span className="font-medium">تهران</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-purple-200">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">
              {config.language.available_languages.length} زبان فعال، 
              {Object.values(translations.progress).filter(p => p === 100).length} زبان کامل ترجمه شده
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalizationSettings;