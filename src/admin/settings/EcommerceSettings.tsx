import React, { useState } from 'react';
import { 
  ShoppingCart, DollarSign, Package, 
  Calculator, Hash, Archive, 
  TrendingUp, AlertTriangle, Settings
} from 'lucide-react';

interface EcommerceSettingsProps {
  onSettingsChange: () => void;
}

interface EcommerceConfig {
  currency: {
    code: string;
    symbol: string;
    position: 'before' | 'after';
    thousands_separator: string;
    decimal_separator: string;
    decimal_places: number;
  };
  tax: {
    enabled: boolean;
    vat_rate: number;
    tax_inclusive: boolean;
    tax_display: 'including' | 'excluding' | 'both';
    business_tax_id: string;
  };
  orders: {
    prefix: string;
    start_number: number;
    auto_complete: boolean;
    guest_checkout: boolean;
    minimum_order: number;
    maximum_order: number;
  };
  inventory: {
    track_quantity: boolean;
    allow_backorders: boolean;
    low_stock_threshold: number;
    out_of_stock_threshold: number;
    hide_out_of_stock: boolean;
  };
  pricing: {
    show_prices_to_guests: boolean;
    price_display_suffix: string;
    sale_price_display: boolean;
    bulk_discount_enabled: boolean;
  };
  cart: {
    cart_expiry_minutes: number;
    enable_coupons: boolean;
    minimum_cart_amount: number;
    cross_sell_enabled: boolean;
  };
}

const EcommerceSettings: React.FC<EcommerceSettingsProps> = ({ onSettingsChange }) => {
  const [config, setConfig] = useState<EcommerceConfig>({
    currency: {
      code: 'IRR',
      symbol: 'ریال',
      position: 'after',
      thousands_separator: ',',
      decimal_separator: '.',
      decimal_places: 0
    },
    tax: {
      enabled: true,
      vat_rate: 9,
      tax_inclusive: true,
      tax_display: 'including',
      business_tax_id: ''
    },
    orders: {
      prefix: 'IS-',
      start_number: 1000,
      auto_complete: false,
      guest_checkout: true,
      minimum_order: 50000,
      maximum_order: 50000000
    },
    inventory: {
      track_quantity: true,
      allow_backorders: false,
      low_stock_threshold: 10,
      out_of_stock_threshold: 0,
      hide_out_of_stock: false
    },
    pricing: {
      show_prices_to_guests: true,
      price_display_suffix: '',
      sale_price_display: true,
      bulk_discount_enabled: false
    },
    cart: {
      cart_expiry_minutes: 30,
      enable_coupons: true,
      minimum_cart_amount: 50000,
      cross_sell_enabled: true
    }
  });

  const handleChange = (section: keyof EcommerceConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const currencies = [
    { code: 'IRR', name: 'ریال ایران', symbol: 'ریال' },
    { code: 'IRT', name: 'تومان ایران', symbol: 'تومان' }
  ];

  const taxDisplayOptions = [
    { value: 'including', label: 'شامل مالیات' },
    { value: 'excluding', label: 'بدون مالیات' },
    { value: 'both', label: 'هر دو' }
  ];

  const formatPrice = (amount: number) => {
    const formatted = amount.toLocaleString('fa-IR');
    return config.currency.position === 'before' 
      ? `${config.currency.symbol} ${formatted}`
      : `${formatted} ${config.currency.symbol}`;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Currency Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          تنظیمات ارز
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              واحد پول
            </label>
            <select
              value={config.currency.code}
              onChange={(e) => {
                const selected = currencies.find(c => c.code === e.target.value);
                if (selected) {
                  handleChange('currency', 'code', selected.code);
                  handleChange('currency', 'symbol', selected.symbol);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              موقعیت نماد ارز
            </label>
            <select
              value={config.currency.position}
              onChange={(e) => handleChange('currency', 'position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="after">بعد از عدد (۱۰۰,۰۰۰ ریال)</option>
              <option value="before">قبل از عدد (ریال ۱۰۰,۰۰۰)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              جداکننده هزارگان
            </label>
            <select
              value={config.currency.thousands_separator}
              onChange={(e) => handleChange('currency', 'thousands_separator', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value=",">کاما (,)</option>
              <option value=".">نقطه (.)</option>
              <option value=" ">فاصله ( )</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600">
            نمونه قیمت: {formatPrice(1250000)}
          </div>
        </div>
      </div>

      {/* Tax Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          تنظیمات مالیات و عوارض
        </h3>
        <div className="space-y-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="tax-enabled"
              checked={config.tax.enabled}
              onChange={(e) => handleChange('tax', 'enabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="tax-enabled" className="mr-2 text-sm text-gray-700">
              فعال‌سازی محاسبه مالیات بر ارزش افزوده
            </label>
          </div>
          
          {config.tax.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-blue-50 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نرخ مالیات (درصد)
                </label>
                <input
                  type="number"
                  value={config.tax.vat_rate}
                  onChange={(e) => handleChange('tax', 'vat_rate', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="50"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نحوه نمایش قیمت
                </label>
                <select
                  value={config.tax.tax_display}
                  onChange={(e) => handleChange('tax', 'tax_display', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {taxDisplayOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شناسه ملی/اقتصادی
                </label>
                <input
                  type="text"
                  value={config.tax.business_tax_id}
                  onChange={(e) => handleChange('tax', 'business_tax_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="۱۲۳۴۵۶۷۸۹۰"
                />
              </div>
              
              <div className="md:col-span-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="tax-inclusive"
                    checked={config.tax.tax_inclusive}
                    onChange={(e) => handleChange('tax', 'tax_inclusive', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="tax-inclusive" className="mr-2 text-sm text-gray-700">
                    قیمت‌ها شامل مالیات هستند (قیمت نهایی شامل مالیات نمایش داده می‌شود)
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Hash className="w-5 h-5 text-purple-600" />
          تنظیمات سفارشات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              پیشوند شماره سفارش
            </label>
            <input
              type="text"
              value={config.orders.prefix}
              onChange={(e) => handleChange('orders', 'prefix', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="IS-"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شماره شروع سفارش
            </label>
            <input
              type="number"
              value={config.orders.start_number}
              onChange={(e) => handleChange('orders', 'start_number', parseInt(e.target.value) || 1000)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداقل مبلغ سفارش ({config.currency.symbol})
            </label>
            <input
              type="number"
              value={config.orders.minimum_order}
              onChange={(e) => handleChange('orders', 'minimum_order', parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداکثر مبلغ سفارش ({config.currency.symbol})
            </label>
            <input
              type="number"
              value={config.orders.maximum_order}
              onChange={(e) => handleChange('orders', 'maximum_order', parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="guest-checkout"
              checked={config.orders.guest_checkout}
              onChange={(e) => handleChange('orders', 'guest_checkout', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="guest-checkout" className="mr-2 text-sm text-gray-700">
              امکان خرید بدون ثبت‌نام (خرید مهمان)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto-complete"
              checked={config.orders.auto_complete}
              onChange={(e) => handleChange('orders', 'auto_complete', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="auto-complete" className="mr-2 text-sm text-gray-700">
              تکمیل خودکار سفارش پس از پرداخت موفق
            </label>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600">
            نمونه شماره سفارش: {config.orders.prefix}{config.orders.start_number}
          </div>
        </div>
      </div>

      {/* Inventory Management */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-orange-600" />
          مدیریت موجودی
        </h3>
        <div className="space-y-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="track-quantity"
              checked={config.inventory.track_quantity}
              onChange={(e) => handleChange('inventory', 'track_quantity', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="track-quantity" className="mr-2 text-sm text-gray-700">
              پیگیری تعداد موجودی محصولات
            </label>
          </div>
          
          {config.inventory.track_quantity && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-orange-50 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  آستانه موجودی کم
                </label>
                <input
                  type="number"
                  value={config.inventory.low_stock_threshold}
                  onChange={(e) => handleChange('inventory', 'low_stock_threshold', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  آستانه اتمام موجودی
                </label>
                <input
                  type="number"
                  value={config.inventory.out_of_stock_threshold}
                  onChange={(e) => handleChange('inventory', 'out_of_stock_threshold', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-center">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allow-backorders"
                      checked={config.inventory.allow_backorders}
                      onChange={(e) => handleChange('inventory', 'allow_backorders', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="allow-backorders" className="mr-2 text-sm text-gray-700">
                      پذیرش سفارش در صورت عدم موجودی
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hide-out-of-stock"
                      checked={config.inventory.hide_out_of_stock}
                      onChange={(e) => handleChange('inventory', 'hide_out_of_stock', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="hide-out-of-stock" className="mr-2 text-sm text-gray-700">
                      مخفی کردن محصولات ناموجود
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shopping Cart Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-indigo-600" />
          تنظیمات سبد خرید
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مدت انقضای سبد خرید (دقیقه)
            </label>
            <input
              type="number"
              value={config.cart.cart_expiry_minutes}
              onChange={(e) => handleChange('cart', 'cart_expiry_minutes', parseInt(e.target.value) || 30)}
              min="5"
              max="1440"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداقل مبلغ سبد ({config.currency.symbol})
            </label>
            <input
              type="number"
              value={config.cart.minimum_cart_amount}
              onChange={(e) => handleChange('cart', 'minimum_cart_amount', parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable-coupons"
                checked={config.cart.enable_coupons}
                onChange={(e) => handleChange('cart', 'enable_coupons', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="enable-coupons" className="mr-2 text-sm text-gray-700">
                فعال‌سازی کد تخفیف
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="cross-sell-enabled"
                checked={config.cart.cross_sell_enabled}
                onChange={(e) => handleChange('cart', 'cross_sell_enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="cross-sell-enabled" className="mr-2 text-sm text-gray-700">
                پیشنهاد محصولات مرتبط
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Display */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          نمایش قیمت‌ها
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-prices-guests"
              checked={config.pricing.show_prices_to_guests}
              onChange={(e) => handleChange('pricing', 'show_prices_to_guests', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="show-prices-guests" className="mr-2 text-sm text-gray-700">
              نمایش قیمت‌ها به کاربران مهمان (غیر عضو)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sale-price-display"
              checked={config.pricing.sale_price_display}
              onChange={(e) => handleChange('pricing', 'sale_price_display', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="sale-price-display" className="mr-2 text-sm text-gray-700">
              نمایش قیمت اصلی و قیمت فروش ویژه
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="bulk-discount"
              checked={config.pricing.bulk_discount_enabled}
              onChange={(e) => handleChange('pricing', 'bulk_discount_enabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="bulk-discount" className="mr-2 text-sm text-gray-700">
              تخفیف خرید عمده (قیمت کاهشی بر اساس تعداد)
            </label>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              پسوند نمایش قیمت (اختیاری)
            </label>
            <input
              type="text"
              value={config.pricing.price_display_suffix}
              onChange={(e) => handleChange('pricing', 'price_display_suffix', e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: شامل مالیات"
            />
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          خلاصه تنظیمات
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">واحد پول:</span>
            <span className="font-medium text-gray-900 mr-2">{config.currency.symbol}</span>
          </div>
          <div>
            <span className="text-gray-600">مالیات:</span>
            <span className="font-medium text-gray-900 mr-2">
              {config.tax.enabled ? `${config.tax.vat_rate}%` : 'غیرفعال'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">حداقل سفارش:</span>
            <span className="font-medium text-gray-900 mr-2">{formatPrice(config.orders.minimum_order)}</span>
          </div>
          <div>
            <span className="text-gray-600">پیگیری موجودی:</span>
            <span className="font-medium text-gray-900 mr-2">
              {config.inventory.track_quantity ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceSettings;