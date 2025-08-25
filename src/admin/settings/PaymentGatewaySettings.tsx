import React, { useState } from 'react';
import { 
  CreditCard, DollarSign, ShieldCheck, Settings,
  TestTube, AlertCircle, CheckCircle, 
  RefreshCw, Key, Smartphone, Banknote
} from 'lucide-react';

interface PaymentGatewaySettingsProps {
  onSettingsChange: () => void;
}

interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  enabled: boolean;
  test_mode: boolean;
  merchant_id: string;
  api_key: string;
  secret_key?: string;
  callback_url: string;
  transaction_fee_type: 'percentage' | 'fixed' | 'free';
  transaction_fee: number;
  minimum_amount: number;
  maximum_amount: number;
  supported_cards: string[];
  processing_time: string;
  description: string;
}

interface PaymentConfig {
  default_gateway: string;
  currency: string;
  auto_capture: boolean;
  payment_timeout_minutes: number;
  retry_failed_payments: boolean;
  max_retry_attempts: number;
  store_cards: boolean;
  require_cvv: boolean;
  send_payment_notifications: boolean;
  refund_processing: boolean;
  gateways: PaymentGateway[];
}

const PaymentGatewaySettings: React.FC<PaymentGatewaySettingsProps> = ({ onSettingsChange }) => {
  const [config, setConfig] = useState<PaymentConfig>({
    default_gateway: 'zarinpal',
    currency: 'IRT',
    auto_capture: true,
    payment_timeout_minutes: 15,
    retry_failed_payments: true,
    max_retry_attempts: 3,
    store_cards: false,
    require_cvv: true,
    send_payment_notifications: true,
    refund_processing: true,
    gateways: [
      {
        id: 'zarinpal',
        name: 'زرین‌پال',
        logo: '/gateways/zarinpal.png',
        enabled: true,
        test_mode: false,
        merchant_id: '',
        api_key: '',
        callback_url: 'https://ishop.ir/payment/callback/zarinpal',
        transaction_fee_type: 'percentage',
        transaction_fee: 1.5,
        minimum_amount: 1000,
        maximum_amount: 500000000,
        supported_cards: ['ملت', 'صادرات', 'ملی', 'پارسیان', 'پاسارگاد', 'سامان', 'تجارت', 'اقتصاد نوین'],
        processing_time: 'فوری',
        description: 'محبوب‌ترین درگاه پرداخت ایران با پشتیبانی از همه بانک‌ها'
      },
      {
        id: 'payping',
        name: 'پی‌پینگ',
        logo: '/gateways/payping.png',
        enabled: false,
        test_mode: true,
        merchant_id: '',
        api_key: '',
        callback_url: 'https://ishop.ir/payment/callback/payping',
        transaction_fee_type: 'percentage',
        transaction_fee: 2.0,
        minimum_amount: 1000,
        maximum_amount: 100000000,
        supported_cards: ['ملت', 'صادرات', 'پارسیان', 'پاسارگاد', 'سامان'],
        processing_time: 'فوری',
        description: 'درگاه پرداخت مدرن با رابط کاربری ساده'
      },
      {
        id: 'idpay',
        name: 'آیدی‌پی',
        logo: '/gateways/idpay.png',
        enabled: false,
        test_mode: true,
        merchant_id: '',
        api_key: '',
        callback_url: 'https://ishop.ir/payment/callback/idpay',
        transaction_fee_type: 'percentage',
        transaction_fee: 1.8,
        minimum_amount: 1000,
        maximum_amount: 50000000,
        supported_cards: ['ملی', 'صادرات', 'تجارت', 'اقتصاد نوین', 'قوامین'],
        processing_time: 'فوری',
        description: 'درگاه پرداخت امن با کمیسیون مناسب'
      },
      {
        id: 'nextpay',
        name: 'نکست‌پی',
        logo: '/gateways/nextpay.png',
        enabled: false,
        test_mode: true,
        merchant_id: '',
        api_key: '',
        callback_url: 'https://ishop.ir/payment/callback/nextpay',
        transaction_fee_type: 'percentage',
        transaction_fee: 2.5,
        minimum_amount: 1000,
        maximum_amount: 20000000,
        supported_cards: ['ملت', 'پارسیان', 'پاسارگاد', 'سامان'],
        processing_time: 'فوری',
        description: 'درگاه پرداخت سریع و مطمئن'
      },
      {
        id: 'zibal',
        name: 'زیبال',
        logo: '/gateways/zibal.png',
        enabled: false,
        test_mode: true,
        merchant_id: '',
        api_key: '',
        callback_url: 'https://ishop.ir/payment/callback/zibal',
        transaction_fee_type: 'percentage',
        transaction_fee: 1.7,
        minimum_amount: 1000,
        maximum_amount: 500000000,
        supported_cards: ['ملت', 'صادرات', 'ملی', 'پارسیان', 'سامان', 'تجارت'],
        processing_time: 'فوری',
        description: 'درگاه پرداخت با امکانات پیشرفته'
      }
    ]
  });

  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'testing' | null>>({});

  const handleConfigChange = (field: keyof PaymentConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    onSettingsChange();
  };

  const handleGatewayChange = (gatewayId: string, field: keyof PaymentGateway, value: any) => {
    setConfig(prev => ({
      ...prev,
      gateways: prev.gateways.map(gateway =>
        gateway.id === gatewayId
          ? { ...gateway, [field]: value }
          : gateway
      )
    }));
    onSettingsChange();
  };

  const testGateway = async (gatewayId: string) => {
    setTestResults(prev => ({ ...prev, [gatewayId]: 'testing' }));
    
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResults(prev => ({ ...prev, [gatewayId]: 'success' }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [gatewayId]: 'error' }));
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fa-IR') + ' تومان';
  };

  const getStatusIcon = (status: 'success' | 'error' | 'testing' | null) => {
    switch (status) {
      case 'testing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* General Payment Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          تنظیمات کلی پرداخت
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              درگاه پیش‌فرض
            </label>
            <select
              value={config.default_gateway}
              onChange={(e) => handleConfigChange('default_gateway', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {config.gateways.filter(g => g.enabled).map(gateway => (
                <option key={gateway.id} value={gateway.id}>
                  {gateway.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              واحد پول
            </label>
            <select
              value={config.currency}
              onChange={(e) => handleConfigChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="IRT">تومان ایران</option>
              <option value="IRR">ریال ایران</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مهلت پرداخت (دقیقه)
            </label>
            <input
              type="number"
              value={config.payment_timeout_minutes}
              onChange={(e) => handleConfigChange('payment_timeout_minutes', parseInt(e.target.value) || 15)}
              min="5"
              max="60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداکثر تلاش مجدد
            </label>
            <input
              type="number"
              value={config.max_retry_attempts}
              onChange={(e) => handleConfigChange('max_retry_attempts', parseInt(e.target.value) || 3)}
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto-capture"
              checked={config.auto_capture}
              onChange={(e) => handleConfigChange('auto_capture', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="auto-capture" className="mr-2 text-sm text-gray-700">
              تسویه خودکار پرداخت (بدون تایید دستی)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="retry-failed"
              checked={config.retry_failed_payments}
              onChange={(e) => handleConfigChange('retry_failed_payments', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="retry-failed" className="mr-2 text-sm text-gray-700">
              امکان تلاش مجدد برای پرداخت‌های ناموفق
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="store-cards"
              checked={config.store_cards}
              onChange={(e) => handleConfigChange('store_cards', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="store-cards" className="mr-2 text-sm text-gray-700">
              ذخیره اطلاعات کارت برای خریدهای بعدی
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="require-cvv"
              checked={config.require_cvv}
              onChange={(e) => handleConfigChange('require_cvv', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="require-cvv" className="mr-2 text-sm text-gray-700">
              الزامی بودن کد CVV
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="payment-notifications"
              checked={config.send_payment_notifications}
              onChange={(e) => handleConfigChange('send_payment_notifications', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="payment-notifications" className="mr-2 text-sm text-gray-700">
              ارسال اعلان وضعیت پرداخت
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="refund-processing"
              checked={config.refund_processing}
              onChange={(e) => handleConfigChange('refund_processing', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="refund-processing" className="mr-2 text-sm text-gray-700">
              امکان برگشت وجه خودکار
            </label>
          </div>
        </div>
      </div>

      {/* Payment Gateways */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-600" />
          درگاه‌های پرداخت ایرانی
        </h3>
        
        <div className="space-y-6">
          {config.gateways.map(gateway => (
            <div key={gateway.id} className={`border rounded-lg p-6 ${
              gateway.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                    <img 
                      src={gateway.logo} 
                      alt={gateway.name}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling!.textContent = gateway.name.charAt(0);
                      }}
                    />
                    <div className="hidden w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl"></div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{gateway.name}</h4>
                    <p className="text-sm text-gray-600">{gateway.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        کمیسیون: {gateway.transaction_fee}%
                      </span>
                      <span className="flex items-center gap-1">
                        <Banknote className="w-4 h-4 text-blue-600" />
                        حداقل: {formatAmount(gateway.minimum_amount)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusIcon(testResults[gateway.id])}
                  <button
                    onClick={() => testGateway(gateway.id)}
                    disabled={!gateway.enabled || testResults[gateway.id] === 'testing'}
                    className="btn-secondary text-sm disabled:opacity-50"
                  >
                    <TestTube className="w-4 h-4 ml-1" />
                    تست
                  </button>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${gateway.id}-enabled`}
                      checked={gateway.enabled}
                      onChange={(e) => handleGatewayChange(gateway.id, 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor={`${gateway.id}-enabled`} className="mr-2 text-sm font-medium">
                      {gateway.enabled ? 'فعال' : 'غیرفعال'}
                    </label>
                  </div>
                </div>
              </div>
              
              {gateway.enabled && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Key className="w-4 h-4 inline ml-1" />
                        شناسه پذیرنده (Merchant ID)
                      </label>
                      <input
                        type="text"
                        value={gateway.merchant_id}
                        onChange={(e) => handleGatewayChange(gateway.id, 'merchant_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="از پنل درگاه کپی کنید"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ShieldCheck className="w-4 h-4 inline ml-1" />
                        کلید API
                      </label>
                      <input
                        type="password"
                        value={gateway.api_key}
                        onChange={(e) => handleGatewayChange(gateway.id, 'api_key', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="کلید API از پنل درگاه"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL برگشت (Callback)
                      </label>
                      <input
                        type="url"
                        value={gateway.callback_url}
                        onChange={(e) => handleGatewayChange(gateway.id, 'callback_url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        این آدرس را در پنل درگاه پرداخت ثبت کنید
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${gateway.id}-test-mode`}
                      checked={gateway.test_mode}
                      onChange={(e) => handleGatewayChange(gateway.id, 'test_mode', e.target.checked)}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <label htmlFor={`${gateway.id}-test-mode`} className="mr-2 text-sm text-gray-700">
                      حالت تست (برای آزمایش و توسعه)
                    </label>
                    {gateway.test_mode && (
                      <span className="mr-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        TEST MODE
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      بانک‌های پشتیبانی شده:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {gateway.supported_cards.map(card => (
                        <span key={card} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {card}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">کمیسیون:</span>
                      <span className="font-medium text-gray-900 mr-2">{gateway.transaction_fee}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">حداقل مبلغ:</span>
                      <span className="font-medium text-gray-900 mr-2">{formatAmount(gateway.minimum_amount)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">حداکثر مبلغ:</span>
                      <span className="font-medium text-gray-900 mr-2">{formatAmount(gateway.maximum_amount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-600" />
          خلاصه تنظیمات پرداخت
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">درگاه‌های فعال:</span>
            <span className="font-medium text-gray-900 mr-2">
              {config.gateways.filter(g => g.enabled).length} از {config.gateways.length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">درگاه پیش‌فرض:</span>
            <span className="font-medium text-gray-900 mr-2">
              {config.gateways.find(g => g.id === config.default_gateway)?.name}
            </span>
          </div>
          <div>
            <span className="text-gray-600">مهلت پرداخت:</span>
            <span className="font-medium text-gray-900 mr-2">
              {config.payment_timeout_minutes} دقیقه
            </span>
          </div>
          <div>
            <span className="text-gray-600">تسویه:</span>
            <span className="font-medium text-gray-900 mr-2">
              {config.auto_capture ? 'خودکار' : 'دستی'}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-green-200">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-gray-600">
              برای فعال‌سازی هر درگاه، حتماً اطلاعات صحیح را از پنل آن درگاه وارد کنید و تست انجام دهید.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewaySettings;