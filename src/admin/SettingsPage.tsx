import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import GeneralSettings from './settings/GeneralSettings';
import EcommerceSettings from './settings/EcommerceSettings';
import UserAccountSettings from './settings/UserAccountSettings';
import NotificationSettings from './settings/NotificationSettings';
import PaymentGatewaySettings from './settings/PaymentGatewaySettings';
import ShippingDeliverySettings from './settings/ShippingDeliverySettings';
import SEOMarketingSettings from './settings/SEOMarketingSettings';
import SystemConfigSettings from './settings/SystemConfigSettings';
import LocalizationSettings from './settings/LocalizationSettings';
import { 
  Settings, Globe, ShoppingCart, Users, Bell, 
  CreditCard, Truck, Search, Server, Languages,
  Save, RotateCcw, AlertTriangle, CheckCircle
} from 'lucide-react';

type SettingsTab = 
  | 'general' 
  | 'ecommerce' 
  | 'users' 
  | 'notifications' 
  | 'payments' 
  | 'shipping' 
  | 'seo' 
  | 'system' 
  | 'localization';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const tabs = [
    { 
      key: 'general', 
      label: 'تنظیمات کلی', 
      icon: Globe,
      description: 'اطلاعات اصلی سایت و تماس'
    },
    { 
      key: 'ecommerce', 
      label: 'فروشگاه', 
      icon: ShoppingCart,
      description: 'تنظیمات فروش و مالیات'
    },
    { 
      key: 'users', 
      label: 'کاربران', 
      icon: Users,
      description: 'مدیریت حساب‌های کاربری'
    },
    { 
      key: 'notifications', 
      label: 'اعلانات', 
      icon: Bell,
      description: 'ایمیل، پیامک و پوش'
    },
    { 
      key: 'payments', 
      label: 'پرداخت', 
      icon: CreditCard,
      description: 'درگاه‌های پرداخت ایرانی'
    },
    { 
      key: 'shipping', 
      label: 'حمل‌ونقل', 
      icon: Truck,
      description: 'ارسال و تحویل کالا'
    },
    { 
      key: 'seo', 
      label: 'سئو و بازاریابی', 
      icon: Search,
      description: 'بهینه‌سازی و تبلیغات'
    },
    { 
      key: 'system', 
      label: 'سیستم', 
      icon: Server,
      description: 'پیکربندی سرور و امنیت'
    },
    { 
      key: 'localization', 
      label: 'محلی‌سازی', 
      icon: Languages,
      description: 'زبان، تاریخ و منطقه'
    }
  ];

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      console.log('All settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید تغییرات را لغو کنید؟')) {
      setHasUnsavedChanges(false);
      console.log('Settings reset to saved values');
    }
  };

  const renderTabContent = () => {
    const commonProps = {
      onSettingsChange: () => setHasUnsavedChanges(true)
    };

    switch (activeTab) {
      case 'general':
        return <GeneralSettings {...commonProps} />;
      case 'ecommerce':
        return <EcommerceSettings {...commonProps} />;
      case 'users':
        return <UserAccountSettings {...commonProps} />;
      case 'notifications':
        return <NotificationSettings {...commonProps} />;
      case 'payments':
        return <PaymentGatewaySettings {...commonProps} />;
      case 'shipping':
        return <ShippingDeliverySettings {...commonProps} />;
      case 'seo':
        return <SEOMarketingSettings {...commonProps} />;
      case 'system':
        return <SystemConfigSettings {...commonProps} />;
      case 'localization':
        return <LocalizationSettings {...commonProps} />;
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              تنظیمات سیستم
            </h1>
            <p className="text-gray-600 mt-1">
              پیکربندی کامل فروشگاه آی‌شاپ
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertTriangle className="w-4 h-4" />
                تغییرات ذخیره نشده
              </div>
            )}
            
            {lastSaved && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                آخرین ذخیره: {lastSaved.toLocaleTimeString('fa-IR')}
              </div>
            )}
            
            <button 
              onClick={handleReset}
              disabled={!hasUnsavedChanges}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              لغو تغییرات
            </button>
            
            <button 
              onClick={handleSaveAll}
              disabled={isSaving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'در حال ذخیره...' : 'ذخیره همه'}
            </button>
          </div>
        </div>

        {/* Settings Navigation */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as SettingsTab)}
                    className={`flex-shrink-0 px-6 py-4 border-b-2 font-medium text-sm transition-colors min-w-0 ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div className="text-right">
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs font-normal text-gray-400 mt-1">
                          {tab.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="min-h-[600px]">
            {renderTabContent()}
          </div>
        </div>

        {/* Save Status Footer */}
        {hasUnsavedChanges && (
          <div className="fixed bottom-6 right-6 bg-white border border-amber-200 rounded-lg shadow-lg p-4 z-50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <div className="font-medium text-gray-900">تغییرات ذخیره نشده</div>
                <div className="text-sm text-gray-600">فراموش نکنید تنظیمات را ذخیره کنید</div>
              </div>
              <button 
                onClick={handleSaveAll}
                className="btn-primary text-sm"
              >
                ذخیره
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;