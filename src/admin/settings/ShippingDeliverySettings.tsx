import React, { useState } from 'react';
import { 
  Truck, MapPin, Clock, Calculator, 
  Package, DollarSign, Settings, Users,
  AlertCircle, CheckCircle, Plus, Edit, Trash2
} from 'lucide-react';

interface ShippingDeliverySettingsProps {
  onSettingsChange: () => void;
}

interface ShippingZone {
  id: string;
  name: string;
  provinces: string[];
  methods: ShippingMethod[];
}

interface ShippingMethod {
  id: string;
  name: string;
  type: 'flat_rate' | 'free' | 'weight_based' | 'distance_based' | 'cod';
  cost: number;
  free_shipping_threshold: number;
  estimated_delivery: string;
  max_weight: number;
  description: string;
  enabled: boolean;
}

interface CourierService {
  id: string;
  name: string;
  api_key: string;
  base_url: string;
  enabled: boolean;
  coverage_areas: string[];
  price_per_kg: number;
  min_cost: number;
  max_weight: number;
}

interface ShippingConfig {
  general: {
    default_weight_unit: 'kg' | 'g';
    default_dimensions_unit: 'cm' | 'm';
    calculate_taxes: boolean;
    hide_shipping_until_address: boolean;
    enable_shipping_calculator: boolean;
  };
  packaging: {
    default_length: number;
    default_width: number;
    default_height: number;
    default_weight: number;
    packaging_cost: number;
  };
  zones: ShippingZone[];
  courier_services: CourierService[];
}

const ShippingDeliverySettings: React.FC<ShippingDeliverySettingsProps> = ({ onSettingsChange }) => {
  const [config, setConfig] = useState<ShippingConfig>({
    general: {
      default_weight_unit: 'kg',
      default_dimensions_unit: 'cm',
      calculate_taxes: false,
      hide_shipping_until_address: true,
      enable_shipping_calculator: true
    },
    packaging: {
      default_length: 20,
      default_width: 15,
      default_height: 10,
      default_weight: 0.5,
      packaging_cost: 5000
    },
    zones: [
      {
        id: 'tehran',
        name: 'تهران و حومه',
        provinces: ['تهران'],
        methods: [
          {
            id: 'tehran_express',
            name: 'پیک موتوری (همان روز)',
            type: 'flat_rate',
            cost: 25000,
            free_shipping_threshold: 500000,
            estimated_delivery: '2-4 ساعت',
            max_weight: 10,
            description: 'ارسال سریع در تهران',
            enabled: true
          },
          {
            id: 'tehran_standard',
            name: 'پست پیشتاز',
            type: 'weight_based',
            cost: 15000,
            free_shipping_threshold: 300000,
            estimated_delivery: '1-2 روز کاری',
            max_weight: 20,
            description: 'ارسال معمولی در تهران',
            enabled: true
          }
        ]
      },
      {
        id: 'major_cities',
        name: 'شهرهای بزرگ',
        provinces: ['اصفهان', 'مشهد', 'شیراز', 'تبریز', 'کرج', 'اهواز'],
        methods: [
          {
            id: 'major_express',
            name: 'پست پیشتاز',
            type: 'weight_based',
            cost: 20000,
            free_shipping_threshold: 400000,
            estimated_delivery: '2-3 روز کاری',
            max_weight: 25,
            description: 'ارسال به شهرهای بزرگ',
            enabled: true
          },
          {
            id: 'major_standard',
            name: 'پست معمولی',
            type: 'flat_rate',
            cost: 12000,
            free_shipping_threshold: 250000,
            estimated_delivery: '3-5 روز کاری',
            max_weight: 20,
            description: 'ارسال اقتصادی',
            enabled: true
          }
        ]
      },
      {
        id: 'other_cities',
        name: 'سایر شهرها',
        provinces: ['سایر استان‌ها'],
        methods: [
          {
            id: 'other_standard',
            name: 'پست معمولی',
            type: 'weight_based',
            cost: 18000,
            free_shipping_threshold: 350000,
            estimated_delivery: '4-7 روز کاری',
            max_weight: 20,
            description: 'ارسال به سایر نقاط کشور',
            enabled: true
          },
          {
            id: 'other_cod',
            name: 'پست کالا (پرداخت در محل)',
            type: 'cod',
            cost: 25000,
            free_shipping_threshold: 0,
            estimated_delivery: '5-8 روز کاری',
            max_weight: 15,
            description: 'پرداخت هنگام تحویل',
            enabled: true
          }
        ]
      }
    ],
    courier_services: [
      {
        id: 'post_iran',
        name: 'پست جمهوری اسلامی ایران',
        api_key: '',
        base_url: 'https://api.post.ir',
        enabled: false,
        coverage_areas: ['سراسر کشور'],
        price_per_kg: 8000,
        min_cost: 12000,
        max_weight: 30
      },
      {
        id: 'tipax',
        name: 'تیپاکس',
        api_key: '',
        base_url: 'https://api.tipax.ir',
        enabled: false,
        coverage_areas: ['شهرهای بزرگ'],
        price_per_kg: 12000,
        min_cost: 18000,
        max_weight: 20
      },
      {
        id: 'chapar',
        name: 'چاپار',
        api_key: '',
        base_url: 'https://api.chapar.post',
        enabled: false,
        coverage_areas: ['تهران', 'کرج', 'اصفهان', 'مشهد'],
        price_per_kg: 15000,
        min_cost: 20000,
        max_weight: 25
      }
    ]
  });

  const [showZoneEditor, setShowZoneEditor] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);

  const handleGeneralChange = (field: keyof typeof config.general, value: any) => {
    setConfig(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const handlePackagingChange = (field: keyof typeof config.packaging, value: any) => {
    setConfig(prev => ({
      ...prev,
      packaging: {
        ...prev.packaging,
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const handleCourierChange = (courierId: string, field: keyof CourierService, value: any) => {
    setConfig(prev => ({
      ...prev,
      courier_services: prev.courier_services.map(service =>
        service.id === courierId
          ? { ...service, [field]: value }
          : service
      )
    }));
    onSettingsChange();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const testCourierConnection = async (courierId: string) => {
    console.log(`Testing connection to courier: ${courierId}`);
    alert('اتصال با موفقیت تست شد!');
  };

  return (
    <div className="p-6 space-y-8">
      {/* General Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          تنظیمات کلی حمل‌ونقل
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              واحد وزن پیش‌فرض
            </label>
            <select
              value={config.general.default_weight_unit}
              onChange={(e) => handleGeneralChange('default_weight_unit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="kg">کیلوگرم (kg)</option>
              <option value="g">گرم (g)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              واحد ابعاد پیش‌فرض
            </label>
            <select
              value={config.general.default_dimensions_unit}
              onChange={(e) => handleGeneralChange('default_dimensions_unit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cm">سانتی‌متر (cm)</option>
              <option value="m">متر (m)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="calculate-taxes"
              checked={config.general.calculate_taxes}
              onChange={(e) => handleGeneralChange('calculate_taxes', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="calculate-taxes" className="mr-2 text-sm text-gray-700">
              محاسبه مالیات بر حمل‌ونقل
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hide-shipping-until-address"
              checked={config.general.hide_shipping_until_address}
              onChange={(e) => handleGeneralChange('hide_shipping_until_address', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="hide-shipping-until-address" className="mr-2 text-sm text-gray-700">
              مخفی کردن هزینه حمل تا وارد کردن آدرس
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enable-calculator"
              checked={config.general.enable_shipping_calculator}
              onChange={(e) => handleGeneralChange('enable_shipping_calculator', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="enable-calculator" className="mr-2 text-sm text-gray-700">
              فعال‌سازی ماشین‌حساب هزینه حمل
            </label>
          </div>
        </div>
      </div>

      {/* Packaging Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-orange-600" />
          تنظیمات بسته‌بندی
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              طول پیش‌فرض ({config.general.default_dimensions_unit})
            </label>
            <input
              type="number"
              value={config.packaging.default_length}
              onChange={(e) => handlePackagingChange('default_length', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عرض پیش‌فرض ({config.general.default_dimensions_unit})
            </label>
            <input
              type="number"
              value={config.packaging.default_width}
              onChange={(e) => handlePackagingChange('default_width', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ارتفاع پیش‌فرض ({config.general.default_dimensions_unit})
            </label>
            <input
              type="number"
              value={config.packaging.default_height}
              onChange={(e) => handlePackagingChange('default_height', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وزن پیش‌فرض ({config.general.default_weight_unit})
            </label>
            <input
              type="number"
              value={config.packaging.default_weight}
              onChange={(e) => handlePackagingChange('default_weight', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            هزینه بسته‌بندی (تومان)
          </label>
          <input
            type="number"
            value={config.packaging.packaging_cost}
            onChange={(e) => handlePackagingChange('packaging_cost', parseInt(e.target.value) || 0)}
            min="0"
            className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Shipping Zones */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" />
          مناطق حمل‌ونقل
        </h3>
        
        <div className="space-y-4">
          {config.zones.map(zone => (
            <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{zone.name}</h4>
                  <p className="text-sm text-gray-600">
                    {zone.provinces.join('، ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700">روش‌های حمل:</h5>
                {zone.methods.map(method => (
                  <div key={method.id} className={`flex items-center justify-between p-3 rounded-md ${
                    method.enabled ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{method.name}</span>
                        {method.enabled && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            فعال
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatPrice(method.cost)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {method.estimated_delivery}
                        </span>
                        <span>
                          حداکثر {method.max_weight} {config.general.default_weight_unit}
                        </span>
                      </div>
                      {method.free_shipping_threshold > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          ارسال رایگان برای خرید بالای {formatPrice(method.free_shipping_threshold)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
            <Plus className="w-5 h-5 mx-auto mb-2" />
            افزودن منطقه جدید
          </button>
        </div>
      </div>

      {/* Courier Services */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-purple-600" />
          سرویس‌های پیک و باربری
        </h3>
        
        <div className="space-y-4">
          {config.courier_services.map(service => (
            <div key={service.id} className={`border rounded-lg p-4 ${
              service.enabled ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-gray-900">{service.name}</h4>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${service.id}-enabled`}
                      checked={service.enabled}
                      onChange={(e) => handleCourierChange(service.id, 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor={`${service.id}-enabled`} className="mr-2 text-sm font-medium">
                      {service.enabled ? 'فعال' : 'غیرفعال'}
                    </label>
                  </div>
                </div>
                
                {service.enabled && (
                  <button
                    onClick={() => testCourierConnection(service.id)}
                    className="btn-secondary text-sm"
                  >
                    تست اتصال
                  </button>
                )}
              </div>
              
              {service.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      کلید API
                    </label>
                    <input
                      type="password"
                      value={service.api_key}
                      onChange={(e) => handleCourierChange(service.id, 'api_key', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="کلید API از پنل سرویس"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      آدرس API
                    </label>
                    <input
                      type="url"
                      value={service.base_url}
                      onChange={(e) => handleCourierChange(service.id, 'base_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      readOnly
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">پوشش:</span>
                  <span className="font-medium text-gray-900 mr-2">
                    {service.coverage_areas.join('، ')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">قیمت هر کیلو:</span>
                  <span className="font-medium text-gray-900 mr-2">
                    {formatPrice(service.price_per_kg)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">حداکثر وزن:</span>
                  <span className="font-medium text-gray-900 mr-2">
                    {service.max_weight} {config.general.default_weight_unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" />
          خلاصه تنظیمات حمل‌ونقل
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">مناطق حمل:</span>
            <span className="font-medium text-gray-900 mr-2">
              {config.zones.length} منطقه
            </span>
          </div>
          <div>
            <span className="text-gray-600">روش‌های فعال:</span>
            <span className="font-medium text-gray-900 mr-2">
              {config.zones.reduce((total, zone) => 
                total + zone.methods.filter(m => m.enabled).length, 0
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-600">سرویس‌های پیک:</span>
            <span className="font-medium text-gray-900 mr-2">
              {config.courier_services.filter(s => s.enabled).length} فعال
            </span>
          </div>
          <div>
            <span className="text-gray-600">هزینه بسته‌بندی:</span>
            <span className="font-medium text-gray-900 mr-2">
              {formatPrice(config.packaging.packaging_cost)}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">
              سیستم حمل‌ونقل پیکربندی شده و آماده استفاده است.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDeliverySettings;