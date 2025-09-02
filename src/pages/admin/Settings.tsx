import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  CreditCard,
  Mail,
  Shield,
  TrendingUp,
  Save,
  RotateCcw,
  Upload,
  Eye,
  EyeOff,
  Check,
  X,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Truck,
  Bell,
  Lock,
  Database,
  BarChart3,
  Zap,
  Palette,
  Search
} from 'lucide-react';

interface GeneralSettings {
  site_name: string;
  site_description: string;
  site_logo: string;
  site_favicon: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  business_hours: string;
  default_currency: 'IRT' | 'USD';
  language: 'fa' | 'en';
  timezone: string;
  maintenance_mode: boolean;
  social_instagram: string;
  social_telegram: string;
  social_whatsapp: string;
}

interface EcommerceSettings {
  default_tax_rate: number;
  shipping_fee: number;
  free_shipping_threshold: number;
  return_period_days: number;
  auto_order_confirmation: boolean;
  inventory_tracking: boolean;
  low_stock_threshold: number;
  allow_backorders: boolean;
  product_reviews: boolean;
  wishlist_enabled: boolean;
  comparison_enabled: boolean;
  guest_checkout: boolean;
}

interface PaymentSettings {
  zarinpal_enabled: boolean;
  zarinpal_merchant_id: string;
  zarinpal_sandbox: boolean;
  mellat_enabled: boolean;
  mellat_terminal_id: string;
  mellat_username: string;
  mellat_password: string;
  parsian_enabled: boolean;
  parsian_pin: string;
  pasargad_enabled: boolean;
  pasargad_merchant_id: string;
  pasargad_terminal_id: string;
  payment_description: string;
}

interface EmailSettings {
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_encryption: 'none' | 'ssl' | 'tls';
  from_email: string;
  from_name: string;
  order_confirmation_template: string;
  shipping_notification_template: string;
  password_reset_template: string;
  newsletter_template: string;
}

interface SecuritySettings {
  two_factor_auth: boolean;
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_numbers: boolean;
  password_require_symbols: boolean;
  session_timeout_minutes: number;
  max_login_attempts: number;
  ip_whitelist: string[];
  ip_blacklist: string[];
  security_headers: boolean;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  backup_retention_days: number;
}

interface SeoSettings {
  default_meta_title: string;
  default_meta_description: string;
  default_meta_keywords: string;
  google_analytics_id: string;
  google_search_console: string;
  facebook_pixel_id: string;
  sitemap_enabled: boolean;
  robots_txt: string;
  newsletter_enabled: boolean;
  newsletter_popup: boolean;
  social_sharing: boolean;
}

const initialGeneralSettings: GeneralSettings = {
  site_name: 'فروشگاه آیشاپ',
  site_description: 'فروشگاه آنلاین محصولات با کیفیت و قیمت مناسب',
  site_logo: '/logo.png',
  site_favicon: '/favicon.ico',
  contact_email: 'info@ishop.ir',
  contact_phone: '021-12345678',
  contact_address: 'تهران، خیابان ولیعصر، پلاک 123',
  business_hours: 'شنبه تا چهارشنبه: 9:00 - 18:00',
  default_currency: 'IRT',
  language: 'fa',
  timezone: 'Asia/Tehran',
  maintenance_mode: false,
  social_instagram: '@ishop_official',
  social_telegram: 'https://t.me/ishop',
  social_whatsapp: '+989123456789'
};

const initialEcommerceSettings: EcommerceSettings = {
  default_tax_rate: 9,
  shipping_fee: 50000,
  free_shipping_threshold: 500000,
  return_period_days: 7,
  auto_order_confirmation: true,
  inventory_tracking: true,
  low_stock_threshold: 5,
  allow_backorders: false,
  product_reviews: true,
  wishlist_enabled: true,
  comparison_enabled: true,
  guest_checkout: true
};

const initialPaymentSettings: PaymentSettings = {
  zarinpal_enabled: true,
  zarinpal_merchant_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  zarinpal_sandbox: false,
  mellat_enabled: false,
  mellat_terminal_id: '',
  mellat_username: '',
  mellat_password: '',
  parsian_enabled: false,
  parsian_pin: '',
  pasargad_enabled: false,
  pasargad_merchant_id: '',
  pasargad_terminal_id: '',
  payment_description: 'خرید از فروشگاه آیشاپ'
};

const initialEmailSettings: EmailSettings = {
  smtp_host: 'smtp.gmail.com',
  smtp_port: 587,
  smtp_username: 'noreply@ishop.ir',
  smtp_password: '',
  smtp_encryption: 'tls',
  from_email: 'noreply@ishop.ir',
  from_name: 'فروشگاه آیشاپ',
  order_confirmation_template: 'سلام {{customer_name}}، سفارش شما با شماره {{order_number}} ثبت شد.',
  shipping_notification_template: 'سفارش {{order_number}} شما ارسال شده است.',
  password_reset_template: 'برای بازنشانی رمز عبور روی لینک زیر کلیک کنید: {{reset_link}}',
  newsletter_template: 'خبرنامه فروشگاه آیشاپ'
};

const initialSecuritySettings: SecuritySettings = {
  two_factor_auth: false,
  password_min_length: 8,
  password_require_uppercase: true,
  password_require_numbers: true,
  password_require_symbols: false,
  session_timeout_minutes: 120,
  max_login_attempts: 5,
  ip_whitelist: [],
  ip_blacklist: [],
  security_headers: true,
  backup_frequency: 'weekly',
  backup_retention_days: 30
};

const initialSeoSettings: SeoSettings = {
  default_meta_title: 'فروشگاه آیشاپ - خرید آنلاین با کیفیت',
  default_meta_description: 'فروشگاه آنلاین آیشاپ ارائه‌دهنده محصولات با کیفیت و قیمت مناسب',
  default_meta_keywords: 'فروشگاه آنلاین، خرید اینترنتی، آیشاپ',
  google_analytics_id: 'G-XXXXXXXXXX',
  google_search_console: '',
  facebook_pixel_id: '',
  sitemap_enabled: true,
  robots_txt: 'User-agent: *\nAllow: /',
  newsletter_enabled: true,
  newsletter_popup: false,
  social_sharing: true
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState(initialGeneralSettings);
  const [ecommerceSettings, setEcommerceSettings] = useState(initialEcommerceSettings);
  const [paymentSettings, setPaymentSettings] = useState(initialPaymentSettings);
  const [emailSettings, setEmailSettings] = useState(initialEmailSettings);
  const [securitySettings, setSecuritySettings] = useState(initialSecuritySettings);
  const [seoSettings, setSeoSettings] = useState(initialSeoSettings);
  const [showPasswords, setShowPasswords] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);

  const tabs = [
    { id: 'general', label: 'تنظیمات عمومی', icon: Globe },
    { id: 'ecommerce', label: 'فروشگاه', icon: SettingsIcon },
    { id: 'payment', label: 'پرداخت', icon: CreditCard },
    { id: 'email', label: 'ایمیل', icon: Mail },
    { id: 'security', label: 'امنیت', icon: Shield },
    { id: 'seo', label: 'سئو و بازاریابی', icon: TrendingUp }
  ];

  const handleSaveSettings = (settingsType: string) => {
    console.log(`Saving ${settingsType} settings`);
    // Here you would typically make an API call to save the settings
  };

  const handleResetSettings = (settingsType: string) => {
    if (confirm('آیا از بازنشانی تنظیمات به حالت پیش‌فرض اطمینان دارید؟')) {
      switch (settingsType) {
        case 'general':
          setGeneralSettings(initialGeneralSettings);
          break;
        case 'ecommerce':
          setEcommerceSettings(initialEcommerceSettings);
          break;
        case 'payment':
          setPaymentSettings(initialPaymentSettings);
          break;
        case 'email':
          setEmailSettings(initialEmailSettings);
          break;
        case 'security':
          setSecuritySettings(initialSecuritySettings);
          break;
        case 'seo':
          setSeoSettings(initialSeoSettings);
          break;
      }
    }
  };

  const handleSendTestEmail = async () => {
    setTestEmailSent(false);
    // Simulate sending test email
    setTimeout(() => {
      setTestEmailSent(true);
      setTimeout(() => setTestEmailSent(false), 3000);
    }, 1000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات سایت</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام سایت</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={generalSettings.site_name}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, site_name: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل تماس</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={generalSettings.contact_email}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, contact_email: e.target.value }))}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات سایت</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={generalSettings.site_description}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, site_description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تلفن تماس</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={generalSettings.contact_phone}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ساعات کاری</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={generalSettings.business_hours}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, business_hours: e.target.value }))}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">آدرس کامل</label>
          <textarea
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={generalSettings.contact_address}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, contact_address: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تنظیمات منطقه‌ای</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">واحد پول</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={generalSettings.default_currency}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, default_currency: e.target.value as 'IRT' | 'USD' }))}
            >
              <option value="IRT">تومان (IRT)</option>
              <option value="USD">دلار (USD)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">زبان</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={generalSettings.language}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, language: e.target.value as 'fa' | 'en' }))}
            >
              <option value="fa">فارسی</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">منطقه زمانی</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={generalSettings.timezone}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
            >
              <option value="Asia/Tehran">تهران (UTC+3:30)</option>
              <option value="UTC">UTC (UTC+0)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">شبکه‌های اجتماعی</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اینستاگرام</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={generalSettings.social_instagram}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, social_instagram: e.target.value }))}
              placeholder="@username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تلگرام</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={generalSettings.social_telegram}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, social_telegram: e.target.value }))}
              placeholder="https://t.me/channel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">واتس‌اپ</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={generalSettings.social_whatsapp}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, social_whatsapp: e.target.value }))}
              placeholder="+989123456789"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">وضعیت سایت</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="maintenance"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
            checked={generalSettings.maintenance_mode}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, maintenance_mode: e.target.checked }))}
          />
          <label htmlFor="maintenance" className="text-sm font-medium text-gray-700">
            حالت تعمیر و نگهداری (سایت برای کاربران غیرفعال خواهد بود)
          </label>
        </div>
      </div>
    </div>
  );

  const renderEcommerceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تنظیمات پیش‌فرض</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نرخ مالیات پیش‌فرض (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={ecommerceSettings.default_tax_rate}
              onChange={(e) => setEcommerceSettings(prev => ({ ...prev, default_tax_rate: Number(e.target.value) }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">هزینه ارسال (تومان)</label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={ecommerceSettings.shipping_fee}
              onChange={(e) => setEcommerceSettings(prev => ({ ...prev, shipping_fee: Number(e.target.value) }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">حد آزاد ارسال رایگان (تومان)</label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={ecommerceSettings.free_shipping_threshold}
              onChange={(e) => setEcommerceSettings(prev => ({ ...prev, free_shipping_threshold: Number(e.target.value) }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مهلت بازگشت کالا (روز)</label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={ecommerceSettings.return_period_days}
              onChange={(e) => setEcommerceSettings(prev => ({ ...prev, return_period_days: Number(e.target.value) }))}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">مدیریت موجودی</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inventory_tracking"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={ecommerceSettings.inventory_tracking}
              onChange={(e) => setEcommerceSettings(prev => ({ ...prev, inventory_tracking: e.target.checked }))}
            />
            <label htmlFor="inventory_tracking" className="text-sm font-medium text-gray-700">
              پیگیری موجودی انبار
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">حد هشدار کم موجودی</label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={ecommerceSettings.low_stock_threshold}
                onChange={(e) => setEcommerceSettings(prev => ({ ...prev, low_stock_threshold: Number(e.target.value) }))}
              />
            </div>

            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="allow_backorders"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                checked={ecommerceSettings.allow_backorders}
                onChange={(e) => setEcommerceSettings(prev => ({ ...prev, allow_backorders: e.target.checked }))}
              />
              <label htmlFor="allow_backorders" className="text-sm font-medium text-gray-700">
                اجازه پیش‌سفارش
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تنظیمات سفارش</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto_order_confirmation"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={ecommerceSettings.auto_order_confirmation}
              onChange={(e) => setEcommerceSettings(prev => ({ ...prev, auto_order_confirmation: e.target.checked }))}
            />
            <label htmlFor="auto_order_confirmation" className="text-sm font-medium text-gray-700">
              تأیید خودکار سفارشات
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="guest_checkout"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={ecommerceSettings.guest_checkout}
              onChange={(e) => setEcommerceSettings(prev => ({ ...prev, guest_checkout: e.target.checked }))}
            />
            <label htmlFor="guest_checkout" className="text-sm font-medium text-gray-700">
              خرید بدون ثبت‌نام
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ویژگی‌های محصول</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="product_reviews"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={ecommerceSettings.product_reviews}
              onChange={(e) => setEcommerceSettings(prev => ({ ...prev, product_reviews: e.target.checked }))}
            />
            <label htmlFor="product_reviews" className="text-sm font-medium text-gray-700">
              نظرات و امتیازدهی
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="wishlist_enabled"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={ecommerceSettings.wishlist_enabled}
              onChange={(e) => setEcommerceSettings(prev => ({ ...prev, wishlist_enabled: e.target.checked }))}
            />
            <label htmlFor="wishlist_enabled" className="text-sm font-medium text-gray-700">
              لیست علاقه‌مندی‌ها
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="comparison_enabled"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={ecommerceSettings.comparison_enabled}
              onChange={(e) => setEcommerceSettings(prev => ({ ...prev, comparison_enabled: e.target.checked }))}
            />
            <label htmlFor="comparison_enabled" className="text-sm font-medium text-gray-700">
              مقایسه محصولات
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">زرین‌پال (Zarinpal)</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="zarinpal_enabled"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={paymentSettings.zarinpal_enabled}
              onChange={(e) => setPaymentSettings(prev => ({ ...prev, zarinpal_enabled: e.target.checked }))}
            />
            <label htmlFor="zarinpal_enabled" className="text-sm font-medium text-gray-700">
              فعال‌سازی زرین‌پال
            </label>
          </div>

          {paymentSettings.zarinpal_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={paymentSettings.zarinpal_merchant_id}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, zarinpal_merchant_id: e.target.value }))}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="zarinpal_sandbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                  checked={paymentSettings.zarinpal_sandbox}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, zarinpal_sandbox: e.target.checked }))}
                />
                <label htmlFor="zarinpal_sandbox" className="text-sm font-medium text-gray-700">
                  حالت تست (Sandbox)
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">بانک ملت</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="mellat_enabled"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={paymentSettings.mellat_enabled}
              onChange={(e) => setPaymentSettings(prev => ({ ...prev, mellat_enabled: e.target.checked }))}
            />
            <label htmlFor="mellat_enabled" className="text-sm font-medium text-gray-700">
              فعال‌سازی بانک ملت
            </label>
          </div>

          {paymentSettings.mellat_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Terminal ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={paymentSettings.mellat_terminal_id}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, mellat_terminal_id: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={paymentSettings.mellat_username}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, mellat_username: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                    value={paymentSettings.mellat_password}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, mellat_password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">بانک پارسیان</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="parsian_enabled"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={paymentSettings.parsian_enabled}
              onChange={(e) => setPaymentSettings(prev => ({ ...prev, parsian_enabled: e.target.checked }))}
            />
            <label htmlFor="parsian_enabled" className="text-sm font-medium text-gray-700">
              فعال‌سازی بانک پارسیان
            </label>
          </div>

          {paymentSettings.parsian_enabled && (
            <div className="pr-6">
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={paymentSettings.parsian_pin}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, parsian_pin: e.target.value }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">بانک پاسارگاد</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="pasargad_enabled"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={paymentSettings.pasargad_enabled}
              onChange={(e) => setPaymentSettings(prev => ({ ...prev, pasargad_enabled: e.target.checked }))}
            />
            <label htmlFor="pasargad_enabled" className="text-sm font-medium text-gray-700">
              فعال‌سازی بانک پاسارگاد
            </label>
          </div>

          {paymentSettings.pasargad_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={paymentSettings.pasargad_merchant_id}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, pasargad_merchant_id: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Terminal ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={paymentSettings.pasargad_terminal_id}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, pasargad_terminal_id: e.target.value }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تنظیمات عمومی پرداخت</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات پرداخت</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={paymentSettings.payment_description}
            onChange={(e) => setPaymentSettings(prev => ({ ...prev, payment_description: e.target.value }))}
            placeholder="متن نمایش داده شده در درگاه پرداخت"
          />
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تنظیمات SMTP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">هاست SMTP</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={emailSettings.smtp_host}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
              placeholder="smtp.gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">پورت</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={emailSettings.smtp_port}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_port: Number(e.target.value) }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={emailSettings.smtp_username}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_username: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                value={emailSettings.smtp_password}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رمزگذاری</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={emailSettings.smtp_encryption}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_encryption: e.target.value as 'none' | 'ssl' | 'tls' }))}
            >
              <option value="none">هیچ‌کدام</option>
              <option value="ssl">SSL</option>
              <option value="tls">TLS</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleSendTestEmail}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={testEmailSent}
            >
              {testEmailSent ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              {testEmailSent ? 'ایمیل ارسال شد' : 'ارسال ایمیل تست'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات فرستنده</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل فرستنده</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={emailSettings.from_email}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, from_email: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام فرستنده</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={emailSettings.from_name}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, from_name: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">قالب‌های ایمیل</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تایید سفارش</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={emailSettings.order_confirmation_template}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, order_confirmation_template: e.target.value }))}
              placeholder="از متغیرهای {{customer_name}} و {{order_number}} استفاده کنید"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اطلاع‌رسانی ارسال</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={emailSettings.shipping_notification_template}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, shipping_notification_template: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">بازنشانی رمز عبور</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={emailSettings.password_reset_template}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, password_reset_template: e.target.value }))}
              placeholder="از متغیر {{reset_link}} استفاده کنید"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">احراز هویت</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="two_factor_auth"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={securitySettings.two_factor_auth}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, two_factor_auth: e.target.checked }))}
            />
            <label htmlFor="two_factor_auth" className="text-sm font-medium text-gray-700">
              احراز هویت دو مرحله‌ای (2FA)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">زمان انقضای جلسه (دقیقه)</label>
            <input
              type="number"
              min="5"
              max="1440"
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={securitySettings.session_timeout_minutes}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, session_timeout_minutes: Number(e.target.value) }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">حداکثر تلاش‌های ورود ناموفق</label>
            <input
              type="number"
              min="1"
              max="20"
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={securitySettings.max_login_attempts}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, max_login_attempts: Number(e.target.value) }))}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">خط‌مشی رمز عبور</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">حداقل طول رمز عبور</label>
            <input
              type="number"
              min="4"
              max="50"
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={securitySettings.password_min_length}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_min_length: Number(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="password_require_uppercase"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                checked={securitySettings.password_require_uppercase}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_require_uppercase: e.target.checked }))}
              />
              <label htmlFor="password_require_uppercase" className="text-sm font-medium text-gray-700">
                الزام حروف بزرگ انگلیسی
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="password_require_numbers"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                checked={securitySettings.password_require_numbers}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_require_numbers: e.target.checked }))}
              />
              <label htmlFor="password_require_numbers" className="text-sm font-medium text-gray-700">
                الزام اعداد
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="password_require_symbols"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                checked={securitySettings.password_require_symbols}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_require_symbols: e.target.checked }))}
              />
              <label htmlFor="password_require_symbols" className="text-sm font-medium text-gray-700">
                الزام نمادها و کاراکترهای خاص
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">کنترل دسترسی IP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">لیست سفید IP (یک IP در هر خط)</label>
            <textarea
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={securitySettings.ip_whitelist.join('\n')}
              onChange={(e) => setSecuritySettings(prev => ({ 
                ...prev, 
                ip_whitelist: e.target.value.split('\n').filter(ip => ip.trim()) 
              }))}
              placeholder="192.168.1.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">لیست سیاه IP (یک IP در هر خط)</label>
            <textarea
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={securitySettings.ip_blacklist.join('\n')}
              onChange={(e) => setSecuritySettings(prev => ({ 
                ...prev, 
                ip_blacklist: e.target.value.split('\n').filter(ip => ip.trim()) 
              }))}
              placeholder="192.168.1.100"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">پشتیبان‌گیری</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">دوره پشتیبان‌گیری</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={securitySettings.backup_frequency}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, backup_frequency: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
            >
              <option value="daily">روزانه</option>
              <option value="weekly">هفتگی</option>
              <option value="monthly">ماهانه</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مدت نگهداری پشتیبان (روز)</label>
            <input
              type="number"
              min="1"
              max="365"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={securitySettings.backup_retention_days}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, backup_retention_days: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="security_headers"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={securitySettings.security_headers}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, security_headers: e.target.checked }))}
            />
            <label htmlFor="security_headers" className="text-sm font-medium text-gray-700">
              فعال‌سازی هدرهای امنیتی HTTP
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSeoSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تنظیمات پیش‌فرض سئو</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان پیش‌فرض (Meta Title)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={seoSettings.default_meta_title}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, default_meta_title: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">
              طول: {seoSettings.default_meta_title.length}/60 کاراکتر
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات پیش‌فرض (Meta Description)</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={seoSettings.default_meta_description}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, default_meta_description: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">
              طول: {seoSettings.default_meta_description.length}/160 کاراکتر
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">کلمات کلیدی پیش‌فرض</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={seoSettings.default_meta_keywords}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, default_meta_keywords: e.target.value }))}
              placeholder="کلمه کلیدی 1، کلمه کلیدی 2"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Analytics و Search Console</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={seoSettings.google_analytics_id}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, google_analytics_id: e.target.value }))}
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">کد تأیید Search Console</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={seoSettings.google_search_console}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, google_search_console: e.target.value }))}
              placeholder="verification code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={seoSettings.facebook_pixel_id}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, facebook_pixel_id: e.target.value }))}
              placeholder="123456789012345"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تنظیمات سایت</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sitemap_enabled"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={seoSettings.sitemap_enabled}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, sitemap_enabled: e.target.checked }))}
            />
            <label htmlFor="sitemap_enabled" className="text-sm font-medium text-gray-700">
              ایجاد خودکار Sitemap.xml
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="social_sharing"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={seoSettings.social_sharing}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, social_sharing: e.target.checked }))}
            />
            <label htmlFor="social_sharing" className="text-sm font-medium text-gray-700">
              دکمه‌های اشتراک‌گذاری اجتماعی
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">محتوای Robots.txt</label>
            <textarea
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={seoSettings.robots_txt}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, robots_txt: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">خبرنامه</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="newsletter_enabled"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={seoSettings.newsletter_enabled}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, newsletter_enabled: e.target.checked }))}
            />
            <label htmlFor="newsletter_enabled" className="text-sm font-medium text-gray-700">
              فعال‌سازی خبرنامه
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="newsletter_popup"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
              checked={seoSettings.newsletter_popup}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, newsletter_popup: e.target.checked }))}
            />
            <label htmlFor="newsletter_popup" className="text-sm font-medium text-gray-700">
              نمایش پاپ‌آپ خبرنامه
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'ecommerce':
        return renderEcommerceSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'email':
        return renderEmailSettings();
      case 'security':
        return renderSecuritySettings();
      case 'seo':
        return renderSeoSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">تنظیمات سیستم</h1>
        <p className="text-gray-600">پیکربندی عمومی فروشگاه، درگاه‌ها و امنیت</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-1/4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              {renderCurrentTab()}
            </div>
            
            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <button
                onClick={() => handleResetSettings(activeTab)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <RotateCcw className="h-4 w-4" />
                بازنشانی
              </button>
              
              <button
                onClick={() => handleSaveSettings(activeTab)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                ذخیره تنظیمات
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;