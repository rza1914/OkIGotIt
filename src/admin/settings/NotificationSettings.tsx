import React, { useState } from 'react';
import { 
  Bell, Mail, MessageSquare, Smartphone, 
  Send, Settings, Edit, Eye, 
  AlertTriangle, CheckCircle, Clock, Users
} from 'lucide-react';

interface NotificationSettingsProps {
  onSettingsChange: () => void;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  variables: string[];
}

interface NotificationConfig {
  email: {
    enabled: boolean;
    smtp_host: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    smtp_encryption: 'none' | 'tls' | 'ssl';
    from_name: string;
    from_email: string;
    reply_to: string;
    templates: EmailTemplate[];
  };
  sms: {
    enabled: boolean;
    provider: 'kavenegar' | 'farazsms' | 'parsgreen' | 'custom';
    api_key: string;
    sender_number: string;
    test_mode: boolean;
    templates: SMSTemplate[];
  };
  push: {
    enabled: boolean;
    firebase_server_key: string;
    firebase_sender_id: string;
    web_push_certificate: string;
    default_icon: string;
  };
  triggers: {
    order_placed: boolean;
    order_confirmed: boolean;
    order_shipped: boolean;
    order_delivered: boolean;
    order_cancelled: boolean;
    payment_received: boolean;
    payment_failed: boolean;
    low_stock: boolean;
    new_user_registration: boolean;
    password_reset: boolean;
    account_verification: boolean;
  };
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onSettingsChange }) => {
  const [config, setConfig] = useState<NotificationConfig>({
    email: {
      enabled: true,
      smtp_host: 'mail.ishop.ir',
      smtp_port: 587,
      smtp_username: 'noreply@ishop.ir',
      smtp_password: '',
      smtp_encryption: 'tls',
      from_name: 'آی‌شاپ',
      from_email: 'noreply@ishop.ir',
      reply_to: 'info@ishop.ir',
      templates: [
        {
          id: 'order_confirmation',
          name: 'تایید سفارش',
          subject: 'سفارش شما با موفقیت ثبت شد - شماره {order_number}',
          body: `سلام {customer_name} عزیز،

سفارش شما با شماره {order_number} با موفقیت در سیستم ثبت شد.

جزئیات سفارش:
- تاریخ ثبت: {order_date}
- مبلغ کل: {order_total} تومان
- وضعیت: {order_status}

لینک پیگیری سفارش: {tracking_url}

با تشکر،
تیم آی‌شاپ`,
          variables: ['customer_name', 'order_number', 'order_date', 'order_total', 'order_status', 'tracking_url']
        },
        {
          id: 'welcome_email',
          name: 'خوشامدگویی',
          subject: 'به آی‌شاپ خوش آمدید!',
          body: `سلام {customer_name} عزیز،

به خانواده بزرگ آی‌شاپ خوش آمدید!

با عضویت در آی‌شاپ، شما می‌توانید:
- از جدیدترین محصولات با کیفیت بهره‌مند شوید
- از تخفیف‌های ویژه اطلاع یابید
- از خدمات پس از فروش استفاده کنید

لینک پروفایل شما: {profile_url}

موفق باشید،
تیم آی‌شاپ`,
          variables: ['customer_name', 'profile_url']
        }
      ]
    },
    sms: {
      enabled: true,
      provider: 'kavenegar',
      api_key: '',
      sender_number: '10008663',
      test_mode: false,
      templates: [
        {
          id: 'order_status_sms',
          name: 'وضعیت سفارش',
          message: 'آی‌شاپ: سفارش {order_number} به مرحله {status} رسید. پیگیری: {short_url}',
          variables: ['order_number', 'status', 'short_url']
        },
        {
          id: 'verification_sms',
          name: 'کد تایید',
          message: 'آی‌شاپ: کد تایید شما {verification_code} می‌باشد. این کد تا ۵ دقیقه معتبر است.',
          variables: ['verification_code']
        }
      ]
    },
    push: {
      enabled: false,
      firebase_server_key: '',
      firebase_sender_id: '',
      web_push_certificate: '',
      default_icon: '/icon-192x192.png'
    },
    triggers: {
      order_placed: true,
      order_confirmed: true,
      order_shipped: true,
      order_delivered: true,
      order_cancelled: true,
      payment_received: true,
      payment_failed: true,
      low_stock: true,
      new_user_registration: true,
      password_reset: true,
      account_verification: true
    }
  });

  const [activeEmailTemplate, setActiveEmailTemplate] = useState<EmailTemplate | null>(null);
  const [activeSMSTemplate, setSMSTemplate] = useState<SMSTemplate | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  const handleChange = (section: keyof NotificationConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const smsProviders = [
    { value: 'kavenegar', name: 'کاوه نگار' },
    { value: 'farazsms', name: 'فراز پیامک' },
    { value: 'parsgreen', name: 'پارس گرین' },
    { value: 'custom', name: 'سایر' }
  ];

  const triggerLabels = {
    order_placed: 'ثبت سفارش جدید',
    order_confirmed: 'تایید سفارش',
    order_shipped: 'ارسال سفارش',
    order_delivered: 'تحویل سفارش',
    order_cancelled: 'لغو سفارش',
    payment_received: 'دریافت پرداخت',
    payment_failed: 'شکست پرداخت',
    low_stock: 'موجودی کم',
    new_user_registration: 'عضویت کاربر جدید',
    password_reset: 'بازیابی رمز عبور',
    account_verification: 'تایید حساب کاربری'
  };

  const testEmail = async () => {
    console.log('Sending test email...');
    alert('ایمیل تست ارسال شد!');
  };

  const testSMS = async () => {
    console.log('Sending test SMS...');
    alert('پیامک تست ارسال شد!');
  };

  return (
    <div className="p-6 space-y-8">
      {/* Email Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          تنظیمات ایمیل
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="email-enabled"
                checked={config.email.enabled}
                onChange={(e) => handleChange('email', 'enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="email-enabled" className="mr-2 text-sm text-gray-700">
                فعال‌سازی ارسال ایمیل
              </label>
            </div>
            
            {config.email.enabled && (
              <button onClick={testEmail} className="btn-secondary text-sm">
                <Send className="w-4 h-4 ml-1" />
                تست ارسال
              </button>
            )}
          </div>
          
          {config.email.enabled && (
            <div className="p-4 bg-blue-50 rounded-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سرور SMTP
                  </label>
                  <input
                    type="text"
                    value={config.email.smtp_host}
                    onChange={(e) => handleChange('email', 'smtp_host', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="mail.example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    پورت
                  </label>
                  <input
                    type="number"
                    value={config.email.smtp_port}
                    onChange={(e) => handleChange('email', 'smtp_port', parseInt(e.target.value) || 587)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام کاربری
                  </label>
                  <input
                    type="text"
                    value={config.email.smtp_username}
                    onChange={(e) => handleChange('email', 'smtp_username', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    value={config.email.smtp_password}
                    onChange={(e) => handleChange('email', 'smtp_password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع رمزنگاری
                  </label>
                  <select
                    value={config.email.smtp_encryption}
                    onChange={(e) => handleChange('email', 'smtp_encryption', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">بدون رمزنگاری</option>
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام فرستنده
                  </label>
                  <input
                    type="text"
                    value={config.email.from_name}
                    onChange={(e) => handleChange('email', 'from_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ایمیل فرستنده
                  </label>
                  <input
                    type="email"
                    value={config.email.from_email}
                    onChange={(e) => handleChange('email', 'from_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ایمیل پاسخ
                  </label>
                  <input
                    type="email"
                    value={config.email.reply_to}
                    onChange={(e) => handleChange('email', 'reply_to', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-3">قالب‌های ایمیل</h4>
                <div className="space-y-3">
                  {config.email.templates.map(template => (
                    <div key={template.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div>
                        <div className="font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.subject}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setActiveEmailTemplate(template);
                            setShowTemplateEditor(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SMS Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-600" />
          تنظیمات پیامک
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sms-enabled"
                checked={config.sms.enabled}
                onChange={(e) => handleChange('sms', 'enabled', e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="sms-enabled" className="mr-2 text-sm text-gray-700">
                فعال‌سازی ارسال پیامک
              </label>
            </div>
            
            {config.sms.enabled && (
              <button onClick={testSMS} className="btn-secondary text-sm">
                <Send className="w-4 h-4 ml-1" />
                تست ارسال
              </button>
            )}
          </div>
          
          {config.sms.enabled && (
            <div className="p-4 bg-green-50 rounded-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ارائه‌دهنده پیامک
                  </label>
                  <select
                    value={config.sms.provider}
                    onChange={(e) => handleChange('sms', 'provider', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {smsProviders.map(provider => (
                      <option key={provider.value} value={provider.value}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    کلید API
                  </label>
                  <input
                    type="password"
                    value={config.sms.api_key}
                    onChange={(e) => handleChange('sms', 'api_key', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="API Key از پنل سرویس‌دهنده"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شماره فرستنده
                  </label>
                  <input
                    type="text"
                    value={config.sms.sender_number}
                    onChange={(e) => handleChange('sms', 'sender_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="10008663"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sms-test-mode"
                    checked={config.sms.test_mode}
                    onChange={(e) => handleChange('sms', 'test_mode', e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="sms-test-mode" className="mr-2 text-sm text-gray-700">
                    حالت تست (پیامک‌ها ارسال نمی‌شوند)
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-3">قالب‌های پیامک</h4>
                <div className="space-y-3">
                  {config.sms.templates.map(template => (
                    <div key={template.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div>
                        <div className="font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-500 font-mono">{template.message}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSMSTemplate(template);
                            setShowTemplateEditor(true);
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-gray-400">
                          {template.message.length}/160
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Push Notifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-purple-600" />
          اعلانات Push
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="push-enabled"
              checked={config.push.enabled}
              onChange={(e) => handleChange('push', 'enabled', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="push-enabled" className="mr-2 text-sm text-gray-700">
              فعال‌سازی اعلانات Push (مرورگر و موبایل)
            </label>
          </div>
          
          {config.push.enabled && (
            <div className="p-4 bg-purple-50 rounded-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Firebase Server Key
                  </label>
                  <input
                    type="password"
                    value={config.push.firebase_server_key}
                    onChange={(e) => handleChange('push', 'firebase_server_key', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Firebase Sender ID
                  </label>
                  <input
                    type="text"
                    value={config.push.firebase_sender_id}
                    onChange={(e) => handleChange('push', 'firebase_sender_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    آیکن پیش‌فرض
                  </label>
                  <input
                    type="text"
                    value={config.push.default_icon}
                    onChange={(e) => handleChange('push', 'default_icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="/icon-192x192.png"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Triggers */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-yellow-600" />
          رویدادهای اعلان
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(triggerLabels).map(([key, label]) => (
            <div key={key} className="flex items-center p-3 border border-gray-200 rounded-md">
              <input
                type="checkbox"
                id={`trigger-${key}`}
                checked={config.triggers[key as keyof typeof config.triggers]}
                onChange={(e) => handleChange('triggers', key, e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor={`trigger-${key}`} className="mr-2 text-sm text-gray-700">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          خلاصه تنظیمات اعلانات
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">ایمیل:</span>
            <span className={`font-medium ${config.email.enabled ? 'text-green-600' : 'text-red-600'}`}>
              {config.email.enabled ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">پیامک:</span>
            <span className={`font-medium ${config.sms.enabled ? 'text-green-600' : 'text-red-600'}`}>
              {config.sms.enabled ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-600" />
            <span className="text-gray-600">Push:</span>
            <span className={`font-medium ${config.push.enabled ? 'text-green-600' : 'text-red-600'}`}>
              {config.push.enabled ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">فعال:</span>
              <span className="font-medium">
                {Object.values(config.triggers).filter(Boolean).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">غیرفعال:</span>
              <span className="font-medium">
                {Object.values(config.triggers).filter(v => !v).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;