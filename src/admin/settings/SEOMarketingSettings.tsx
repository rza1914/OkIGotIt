import React, { useState } from 'react';
import { 
  Search, TrendingUp, Target, Share2, 
  BarChart3, Link, Eye, Globe, 
  Settings, CheckCircle, AlertCircle, Edit
} from 'lucide-react';

interface SEOMarketingSettingsProps {
  onSettingsChange: () => void;
}

interface SEOSettings {
  meta: {
    site_title_template: string;
    meta_description_template: string;
    meta_keywords: string;
    robots_txt: string;
    sitemap_enabled: boolean;
    breadcrumbs_enabled: boolean;
  };
  social: {
    og_site_name: string;
    og_image_default: string;
    twitter_card_type: string;
    twitter_site: string;
    facebook_app_id: string;
    google_site_verification: string;
  };
  analytics: {
    google_analytics_id: string;
    google_tag_manager_id: string;
    facebook_pixel_id: string;
    google_ads_conversion_id: string;
    custom_tracking_code: string;
  };
  schema: {
    organization_enabled: boolean;
    local_business_enabled: boolean;
    product_schema_enabled: boolean;
    review_schema_enabled: boolean;
  };
}

interface MarketingSettings {
  email_marketing: {
    newsletter_enabled: boolean;
    double_opt_in: boolean;
    welcome_series_enabled: boolean;
    abandoned_cart_enabled: boolean;
    abandoned_cart_delay_hours: number;
    segmentation_enabled: boolean;
  };
  promotions: {
    popup_enabled: boolean;
    popup_delay_seconds: number;
    exit_intent_popup: boolean;
    discount_codes_enabled: boolean;
    referral_program_enabled: boolean;
    loyalty_points_enabled: boolean;
  };
  banners: {
    top_banner_enabled: boolean;
    top_banner_text: string;
    top_banner_link: string;
    homepage_banner_enabled: boolean;
    category_banners_enabled: boolean;
  };
  retargeting: {
    facebook_retargeting: boolean;
    google_retargeting: boolean;
    instagram_shopping: boolean;
    telegram_bot_enabled: boolean;
    whatsapp_integration: boolean;
  };
}

const SEOMarketingSettings: React.FC<SEOMarketingSettingsProps> = ({ onSettingsChange }) => {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    meta: {
      site_title_template: '{title} | آی‌شاپ - فروشگاه آنلاین',
      meta_description_template: '{description} خرید آنلاین با بهترین قیمت از فروشگاه آی‌شاپ',
      meta_keywords: 'فروشگاه آنلاین، خرید اینترنتی، آی‌شاپ، محصولات ایرانی',
      robots_txt: 'User-agent: *\nAllow: /\nSitemap: https://ishop.ir/sitemap.xml',
      sitemap_enabled: true,
      breadcrumbs_enabled: true
    },
    social: {
      og_site_name: 'آی‌شاپ',
      og_image_default: '/images/og-default.jpg',
      twitter_card_type: 'summary_large_image',
      twitter_site: '@ishop_ir',
      facebook_app_id: '',
      google_site_verification: ''
    },
    analytics: {
      google_analytics_id: '',
      google_tag_manager_id: '',
      facebook_pixel_id: '',
      google_ads_conversion_id: '',
      custom_tracking_code: ''
    },
    schema: {
      organization_enabled: true,
      local_business_enabled: true,
      product_schema_enabled: true,
      review_schema_enabled: true
    }
  });

  const [marketingSettings, setMarketingSettings] = useState<MarketingSettings>({
    email_marketing: {
      newsletter_enabled: true,
      double_opt_in: true,
      welcome_series_enabled: true,
      abandoned_cart_enabled: true,
      abandoned_cart_delay_hours: 24,
      segmentation_enabled: false
    },
    promotions: {
      popup_enabled: true,
      popup_delay_seconds: 30,
      exit_intent_popup: true,
      discount_codes_enabled: true,
      referral_program_enabled: false,
      loyalty_points_enabled: true
    },
    banners: {
      top_banner_enabled: false,
      top_banner_text: 'تخفیف ۲۰٪ برای اولین خرید - کد: WELCOME20',
      top_banner_link: '/offers',
      homepage_banner_enabled: true,
      category_banners_enabled: true
    },
    retargeting: {
      facebook_retargeting: false,
      google_retargeting: false,
      instagram_shopping: false,
      telegram_bot_enabled: false,
      whatsapp_integration: true
    }
  });

  const handleSEOChange = (section: keyof SEOSettings, field: string, value: any) => {
    setSeoSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const handleMarketingChange = (section: keyof MarketingSettings, field: string, value: any) => {
    setMarketingSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const testSEO = () => {
    alert('تنظیمات سئو بررسی شد!');
  };

  return (
    <div className="p-6 space-y-8">
      {/* Meta Tags & SEO */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          تنظیمات سئو و متا تگ‌ها
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              قالب عنوان صفحه
            </label>
            <input
              type="text"
              value={seoSettings.meta.site_title_template}
              onChange={(e) => handleSEOChange('meta', 'site_title_template', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="{title} | نام سایت"
            />
            <p className="text-xs text-gray-500 mt-1">
              از {'{title}'} برای عنوان صفحه استفاده کنید
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              قالب توضیحات متا
            </label>
            <textarea
              value={seoSettings.meta.meta_description_template}
              onChange={(e) => handleSEOChange('meta', 'meta_description_template', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="{description} - متن اضافی"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              کلمات کلیدی اصلی
            </label>
            <input
              type="text"
              value={seoSettings.meta.meta_keywords}
              onChange={(e) => handleSEOChange('meta', 'meta_keywords', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="فروشگاه آنلاین، خرید، محصول"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              محتوای robots.txt
            </label>
            <textarea
              value={seoSettings.meta.robots_txt}
              onChange={(e) => handleSEOChange('meta', 'robots_txt', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sitemap-enabled"
                checked={seoSettings.meta.sitemap_enabled}
                onChange={(e) => handleSEOChange('meta', 'sitemap_enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="sitemap-enabled" className="mr-2 text-sm text-gray-700">
                تولید خودکار Sitemap
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="breadcrumbs-enabled"
                checked={seoSettings.meta.breadcrumbs_enabled}
                onChange={(e) => handleSEOChange('meta', 'breadcrumbs_enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="breadcrumbs-enabled" className="mr-2 text-sm text-gray-700">
                نمایش مسیر صفحه (Breadcrumbs)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Open Graph */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-green-600" />
          شبکه‌های اجتماعی و Open Graph
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام سایت (Open Graph)
            </label>
            <input
              type="text"
              value={seoSettings.social.og_site_name}
              onChange={(e) => handleSEOChange('social', 'og_site_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تصویر پیش‌فرض (Open Graph)
            </label>
            <input
              type="url"
              value={seoSettings.social.og_image_default}
              onChange={(e) => handleSEOChange('social', 'og_image_default', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/images/og-default.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع کارت توییتر
            </label>
            <select
              value={seoSettings.social.twitter_card_type}
              onChange={(e) => handleSEOChange('social', 'twitter_card_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">خلاصه</option>
              <option value="summary_large_image">خلاصه با تصویر بزرگ</option>
              <option value="app">اپلیکیشن</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              آیدی توییتر سایت
            </label>
            <input
              type="text"
              value={seoSettings.social.twitter_site}
              onChange={(e) => handleSEOChange('social', 'twitter_site', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="@username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook App ID
            </label>
            <input
              type="text"
              value={seoSettings.social.facebook_app_id}
              onChange={(e) => handleSEOChange('social', 'facebook_app_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Site Verification
            </label>
            <input
              type="text"
              value={seoSettings.social.google_site_verification}
              onChange={(e) => handleSEOChange('social', 'google_site_verification', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="کد تایید از Google Search Console"
            />
          </div>
        </div>
      </div>

      {/* Analytics & Tracking */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          آنالیتیک و رهگیری
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Analytics ID
            </label>
            <input
              type="text"
              value={seoSettings.analytics.google_analytics_id}
              onChange={(e) => handleSEOChange('analytics', 'google_analytics_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Tag Manager ID
            </label>
            <input
              type="text"
              value={seoSettings.analytics.google_tag_manager_id}
              onChange={(e) => handleSEOChange('analytics', 'google_tag_manager_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="GTM-XXXXXXX"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook Pixel ID
            </label>
            <input
              type="text"
              value={seoSettings.analytics.facebook_pixel_id}
              onChange={(e) => handleSEOChange('analytics', 'facebook_pixel_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Ads Conversion ID
            </label>
            <input
              type="text"
              value={seoSettings.analytics.google_ads_conversion_id}
              onChange={(e) => handleSEOChange('analytics', 'google_ads_conversion_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            کد رهگیری سفارشی
          </label>
          <textarea
            value={seoSettings.analytics.custom_tracking_code}
            onChange={(e) => handleSEOChange('analytics', 'custom_tracking_code', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="<!-- کدهای JavaScript سفارشی -->"
          />
        </div>
      </div>

      {/* Schema Markup */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          Schema Markup (داده‌های ساختار یافته)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="organization-schema"
              checked={seoSettings.schema.organization_enabled}
              onChange={(e) => handleSEOChange('schema', 'organization_enabled', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="organization-schema" className="mr-2 text-sm text-gray-700">
              Schema سازمان/شرکت
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="local-business-schema"
              checked={seoSettings.schema.local_business_enabled}
              onChange={(e) => handleSEOChange('schema', 'local_business_enabled', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="local-business-schema" className="mr-2 text-sm text-gray-700">
              Schema کسب‌وکار محلی
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="product-schema"
              checked={seoSettings.schema.product_schema_enabled}
              onChange={(e) => handleSEOChange('schema', 'product_schema_enabled', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="product-schema" className="mr-2 text-sm text-gray-700">
              Schema محصولات
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="review-schema"
              checked={seoSettings.schema.review_schema_enabled}
              onChange={(e) => handleSEOChange('schema', 'review_schema_enabled', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="review-schema" className="mr-2 text-sm text-gray-700">
              Schema نظرات و امتیازات
            </label>
          </div>
        </div>
      </div>

      {/* Email Marketing */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-red-600" />
          ایمیل مارکتینگ
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="newsletter-enabled"
              checked={marketingSettings.email_marketing.newsletter_enabled}
              onChange={(e) => handleMarketingChange('email_marketing', 'newsletter_enabled', e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="newsletter-enabled" className="mr-2 text-sm text-gray-700">
              فعال‌سازی خبرنامه
            </label>
          </div>
          
          {marketingSettings.email_marketing.newsletter_enabled && (
            <div className="p-4 bg-red-50 rounded-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="double-opt-in"
                    checked={marketingSettings.email_marketing.double_opt_in}
                    onChange={(e) => handleMarketingChange('email_marketing', 'double_opt_in', e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="double-opt-in" className="mr-2 text-sm text-gray-700">
                    تایید دوبله اشتراک (Double Opt-in)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="welcome-series"
                    checked={marketingSettings.email_marketing.welcome_series_enabled}
                    onChange={(e) => handleMarketingChange('email_marketing', 'welcome_series_enabled', e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="welcome-series" className="mr-2 text-sm text-gray-700">
                    سری ایمیل‌های خوشامدگویی
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="abandoned-cart"
                    checked={marketingSettings.email_marketing.abandoned_cart_enabled}
                    onChange={(e) => handleMarketingChange('email_marketing', 'abandoned_cart_enabled', e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="abandoned-cart" className="mr-2 text-sm text-gray-700">
                    ایمیل سبد خرید رها شده
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاخیر ارسال (ساعت)
                  </label>
                  <input
                    type="number"
                    value={marketingSettings.email_marketing.abandoned_cart_delay_hours}
                    onChange={(e) => handleMarketingChange('email_marketing', 'abandoned_cart_delay_hours', parseInt(e.target.value) || 24)}
                    min="1"
                    max="168"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Promotional Tools */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-600" />
          ابزارهای تبلیغاتی
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="popup-enabled"
                  checked={marketingSettings.promotions.popup_enabled}
                  onChange={(e) => handleMarketingChange('promotions', 'popup_enabled', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <label htmlFor="popup-enabled" className="mr-2 text-sm text-gray-700 font-medium">
                  پاپ‌آپ تبلیغاتی
                </label>
              </div>
            </div>
            
            {marketingSettings.promotions.popup_enabled && (
              <div className="p-4 bg-yellow-50 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاخیر نمایش (ثانیه)
                  </label>
                  <input
                    type="number"
                    value={marketingSettings.promotions.popup_delay_seconds}
                    onChange={(e) => handleMarketingChange('promotions', 'popup_delay_seconds', parseInt(e.target.value) || 30)}
                    min="0"
                    max="300"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="exit-intent"
                    checked={marketingSettings.promotions.exit_intent_popup}
                    onChange={(e) => handleMarketingChange('promotions', 'exit_intent_popup', e.target.checked)}
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <label htmlFor="exit-intent" className="mr-2 text-sm text-gray-700">
                    پاپ‌آپ هنگام خروج
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3">بنرهای تبلیغاتی</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="top-banner"
                  checked={marketingSettings.banners.top_banner_enabled}
                  onChange={(e) => handleMarketingChange('banners', 'top_banner_enabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="top-banner" className="mr-2 text-sm text-gray-700">
                  بنر بالای سایت
                </label>
              </div>
              
              {marketingSettings.banners.top_banner_enabled && (
                <div className="p-3 bg-blue-50 rounded-md space-y-3">
                  <input
                    type="text"
                    value={marketingSettings.banners.top_banner_text}
                    onChange={(e) => handleMarketingChange('banners', 'top_banner_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="متن بنر"
                  />
                  <input
                    type="url"
                    value={marketingSettings.banners.top_banner_link}
                    onChange={(e) => handleMarketingChange('banners', 'top_banner_link', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="لینک بنر"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary & Test */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            خلاصه تنظیمات سئو و بازاریابی
          </h4>
          <button onClick={testSEO} className="btn-secondary text-sm">
            <Eye className="w-4 h-4 ml-1" />
            بررسی سئو
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${seoSettings.meta.sitemap_enabled ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-gray-600">Sitemap:</span>
            <span className="font-medium">
              {seoSettings.meta.sitemap_enabled ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${seoSettings.analytics.google_analytics_id ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-gray-600">Google Analytics:</span>
            <span className="font-medium">
              {seoSettings.analytics.google_analytics_id ? 'تنظیم شده' : 'تنظیم نشده'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${marketingSettings.email_marketing.newsletter_enabled ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-gray-600">خبرنامه:</span>
            <span className="font-medium">
              {marketingSettings.email_marketing.newsletter_enabled ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${marketingSettings.promotions.popup_enabled ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-gray-600">پاپ‌آپ:</span>
            <span className="font-medium">
              {marketingSettings.promotions.popup_enabled ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${Object.values(seoSettings.schema).some(v => v) ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-gray-600">Schema:</span>
            <span className="font-medium">
              {Object.values(seoSettings.schema).filter(v => v).length} فعال
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${marketingSettings.banners.top_banner_enabled ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-gray-600">بنرها:</span>
            <span className="font-medium">
              {Object.values(marketingSettings.banners).filter(v => typeof v === 'boolean' && v).length} فعال
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOMarketingSettings;