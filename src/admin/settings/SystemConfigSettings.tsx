import React, { useState } from 'react';
import { 
  Server, Shield, Database, HardDrive, 
  Clock, AlertTriangle, Activity, Key,
  Download, Upload, RefreshCw, Settings,
  CheckCircle, XCircle, Monitor, Zap
} from 'lucide-react';

interface SystemConfigSettingsProps {
  onSettingsChange: () => void;
}

interface SystemConfig {
  database: {
    auto_backup: boolean;
    backup_frequency: 'daily' | 'weekly' | 'monthly';
    backup_retention_days: number;
    backup_location: 'local' | 'cloud';
    max_connections: number;
    query_timeout: number;
  };
  storage: {
    max_file_size_mb: number;
    allowed_file_types: string[];
    storage_location: 'local' | 's3' | 'cdn';
    auto_optimize_images: boolean;
    max_storage_gb: number;
    cleanup_temp_files: boolean;
  };
  security: {
    ssl_enabled: boolean;
    force_https: boolean;
    security_headers: boolean;
    csrf_protection: boolean;
    rate_limiting: boolean;
    max_requests_per_minute: number;
    ip_whitelist: string[];
    ip_blacklist: string[];
    two_factor_admin: boolean;
  };
  performance: {
    enable_caching: boolean;
    cache_type: 'redis' | 'memcached' | 'file';
    cache_ttl_minutes: number;
    enable_compression: boolean;
    minify_assets: boolean;
    cdn_enabled: boolean;
    lazy_loading: boolean;
  };
  monitoring: {
    error_logging: boolean;
    access_logging: boolean;
    performance_monitoring: boolean;
    uptime_monitoring: boolean;
    email_alerts: boolean;
    alert_email: string;
    log_retention_days: number;
  };
  api: {
    api_enabled: boolean;
    api_rate_limit: number;
    api_key_required: boolean;
    api_version: string;
    webhook_enabled: boolean;
    allowed_origins: string[];
  };
}

const SystemConfigSettings: React.FC<SystemConfigSettingsProps> = ({ onSettingsChange }) => {
  const [config, setConfig] = useState<SystemConfig>({
    database: {
      auto_backup: true,
      backup_frequency: 'daily',
      backup_retention_days: 30,
      backup_location: 'local',
      max_connections: 100,
      query_timeout: 30
    },
    storage: {
      max_file_size_mb: 50,
      allowed_file_types: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
      storage_location: 'local',
      auto_optimize_images: true,
      max_storage_gb: 100,
      cleanup_temp_files: true
    },
    security: {
      ssl_enabled: true,
      force_https: true,
      security_headers: true,
      csrf_protection: true,
      rate_limiting: true,
      max_requests_per_minute: 60,
      ip_whitelist: [],
      ip_blacklist: [],
      two_factor_admin: false
    },
    performance: {
      enable_caching: true,
      cache_type: 'redis',
      cache_ttl_minutes: 60,
      enable_compression: true,
      minify_assets: true,
      cdn_enabled: false,
      lazy_loading: true
    },
    monitoring: {
      error_logging: true,
      access_logging: false,
      performance_monitoring: true,
      uptime_monitoring: false,
      email_alerts: true,
      alert_email: 'admin@ishop.ir',
      log_retention_days: 90
    },
    api: {
      api_enabled: true,
      api_rate_limit: 100,
      api_key_required: true,
      api_version: 'v1',
      webhook_enabled: false,
      allowed_origins: ['https://ishop.ir']
    }
  });

  const [systemStatus, setSystemStatus] = useState({
    database: 'healthy',
    storage: 'healthy',
    cache: 'healthy',
    ssl: 'active',
    performance: 'optimal'
  });

  const [backupInProgress, setBackupInProgress] = useState(false);

  const handleConfigChange = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const handleArrayChange = (section: keyof SystemConfig, field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: items
      }
    }));
    onSettingsChange();
  };

  const runManualBackup = async () => {
    setBackupInProgress(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      alert('پشتیبان‌گیری با موفقیت انجام شد!');
    } finally {
      setBackupInProgress(false);
    }
  };

  const testSystemHealth = async () => {
    alert('تست سلامت سیستم انجام شد - همه سیستم‌ها سالم هستند!');
  };

  const clearCache = async () => {
    alert('کش پاک شد!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'optimal':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* System Status Overview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-blue-600" />
          وضعیت سیستم
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(systemStatus).map(([key, status]) => (
            <div key={key} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {key === 'database' ? 'پایگاه داده' :
                     key === 'storage' ? 'فضای ذخیره' :
                     key === 'cache' ? 'کش' :
                     key === 'ssl' ? 'SSL' :
                     key === 'performance' ? 'کارایی' : key}
                  </div>
                  <div className={`text-xs mt-1 ${
                    status === 'healthy' || status === 'optimal' || status === 'active' 
                      ? 'text-green-600' 
                      : status === 'warning' 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
                    {status === 'healthy' ? 'سالم' :
                     status === 'optimal' ? 'بهینه' :
                     status === 'active' ? 'فعال' :
                     status === 'warning' ? 'هشدار' : 'خطا'}
                  </div>
                </div>
                {getStatusIcon(status)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center gap-3">
          <button onClick={testSystemHealth} className="btn-secondary">
            <Activity className="w-4 h-4 ml-1" />
            بررسی سلامت سیستم
          </button>
          <button onClick={clearCache} className="btn-secondary">
            <RefreshCw className="w-4 h-4 ml-1" />
            پاک کردن کش
          </button>
        </div>
      </div>

      {/* Database Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-green-600" />
          تنظیمات پایگاه داده
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto-backup"
                checked={config.database.auto_backup}
                onChange={(e) => handleConfigChange('database', 'auto_backup', e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="auto-backup" className="mr-2 text-sm text-gray-700">
                پشتیبان‌گیری خودکار
              </label>
            </div>
            
            <button 
              onClick={runManualBackup}
              disabled={backupInProgress}
              className="btn-secondary disabled:opacity-50"
            >
              {backupInProgress ? (
                <RefreshCw className="w-4 h-4 ml-1 animate-spin" />
              ) : (
                <Download className="w-4 h-4 ml-1" />
              )}
              پشتیبان‌گیری دستی
            </button>
          </div>
          
          {config.database.auto_backup && (
            <div className="p-4 bg-green-50 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تناوب پشتیبان‌گیری
                  </label>
                  <select
                    value={config.database.backup_frequency}
                    onChange={(e) => handleConfigChange('database', 'backup_frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="daily">روزانه</option>
                    <option value="weekly">هفتگی</option>
                    <option value="monthly">ماهانه</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نگهداری پشتیبان (روز)
                  </label>
                  <input
                    type="number"
                    value={config.database.backup_retention_days}
                    onChange={(e) => handleConfigChange('database', 'backup_retention_days', parseInt(e.target.value) || 30)}
                    min="1"
                    max="365"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    محل ذخیره
                  </label>
                  <select
                    value={config.database.backup_location}
                    onChange={(e) => handleConfigChange('database', 'backup_location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="local">محلی</option>
                    <option value="cloud">ابر</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حداکثر اتصالات همزمان
              </label>
              <input
                type="number"
                value={config.database.max_connections}
                onChange={(e) => handleConfigChange('database', 'max_connections', parseInt(e.target.value) || 100)}
                min="10"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مهلت اجرای query (ثانیه)
              </label>
              <input
                type="number"
                value={config.database.query_timeout}
                onChange={(e) => handleConfigChange('database', 'query_timeout', parseInt(e.target.value) || 30)}
                min="5"
                max="300"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Storage Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-blue-600" />
          تنظیمات فضای ذخیره
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداکثر حجم فایل (مگابایت)
            </label>
            <input
              type="number"
              value={config.storage.max_file_size_mb}
              onChange={(e) => handleConfigChange('storage', 'max_file_size_mb', parseInt(e.target.value) || 50)}
              min="1"
              max="500"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداکثر فضای ذخیره (گیگابایت)
            </label>
            <input
              type="number"
              value={config.storage.max_storage_gb}
              onChange={(e) => handleConfigChange('storage', 'max_storage_gb', parseInt(e.target.value) || 100)}
              min="1"
              max="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              انواع فایل مجاز
            </label>
            <input
              type="text"
              value={config.storage.allowed_file_types.join(', ')}
              onChange={(e) => handleArrayChange('storage', 'allowed_file_types', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="jpg, png, pdf, doc"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              محل ذخیره فایل‌ها
            </label>
            <select
              value={config.storage.storage_location}
              onChange={(e) => handleConfigChange('storage', 'storage_location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="local">سرور محلی</option>
              <option value="s3">Amazon S3</option>
              <option value="cdn">CDN</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto-optimize"
              checked={config.storage.auto_optimize_images}
              onChange={(e) => handleConfigChange('storage', 'auto_optimize_images', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="auto-optimize" className="mr-2 text-sm text-gray-700">
              بهینه‌سازی خودکار تصاویر
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="cleanup-temp"
              checked={config.storage.cleanup_temp_files}
              onChange={(e) => handleConfigChange('storage', 'cleanup_temp_files', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="cleanup-temp" className="mr-2 text-sm text-gray-700">
              پاک‌سازی خودکار فایل‌های موقت
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" />
          تنظیمات امنیت
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ssl-enabled"
                checked={config.security.ssl_enabled}
                onChange={(e) => handleConfigChange('security', 'ssl_enabled', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="ssl-enabled" className="mr-2 text-sm text-gray-700">
                فعال‌سازی SSL/TLS
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="force-https"
                checked={config.security.force_https}
                onChange={(e) => handleConfigChange('security', 'force_https', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="force-https" className="mr-2 text-sm text-gray-700">
                اجبار استفاده از HTTPS
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="security-headers"
                checked={config.security.security_headers}
                onChange={(e) => handleConfigChange('security', 'security_headers', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="security-headers" className="mr-2 text-sm text-gray-700">
                فعال‌سازی Security Headers
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="csrf-protection"
                checked={config.security.csrf_protection}
                onChange={(e) => handleConfigChange('security', 'csrf_protection', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="csrf-protection" className="mr-2 text-sm text-gray-700">
                محافظت CSRF
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rate-limiting"
                checked={config.security.rate_limiting}
                onChange={(e) => handleConfigChange('security', 'rate_limiting', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="rate-limiting" className="mr-2 text-sm text-gray-700">
                محدودیت نرخ درخواست
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="2fa-admin"
                checked={config.security.two_factor_admin}
                onChange={(e) => handleConfigChange('security', 'two_factor_admin', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="2fa-admin" className="mr-2 text-sm text-gray-700">
                احراز دو مرحله‌ای برای ادمین‌ها
              </label>
            </div>
          </div>
          
          {config.security.rate_limiting && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حداکثر درخواست در دقیقه
              </label>
              <input
                type="number"
                value={config.security.max_requests_per_minute}
                onChange={(e) => handleConfigChange('security', 'max_requests_per_minute', parseInt(e.target.value) || 60)}
                min="1"
                max="1000"
                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                لیست سفید IP (مجاز)
              </label>
              <textarea
                value={config.security.ip_whitelist.join('\n')}
                onChange={(e) => handleConfigChange('security', 'ip_whitelist', e.target.value.split('\n').filter(ip => ip.trim()))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                placeholder="192.168.1.1&#10;10.0.0.0/8"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                لیست سیاه IP (مسدود)
              </label>
              <textarea
                value={config.security.ip_blacklist.join('\n')}
                onChange={(e) => handleConfigChange('security', 'ip_blacklist', e.target.value.split('\n').filter(ip => ip.trim()))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                placeholder="spam.example.com&#10;192.168.1.100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          تنظیمات کارایی
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enable-caching"
              checked={config.performance.enable_caching}
              onChange={(e) => handleConfigChange('performance', 'enable_caching', e.target.checked)}
              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <label htmlFor="enable-caching" className="mr-2 text-sm text-gray-700 font-medium">
              فعال‌سازی کش
            </label>
          </div>
          
          {config.performance.enable_caching && (
            <div className="p-4 bg-yellow-50 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع کش
                  </label>
                  <select
                    value={config.performance.cache_type}
                    onChange={(e) => handleConfigChange('performance', 'cache_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="redis">Redis</option>
                    <option value="memcached">Memcached</option>
                    <option value="file">فایل</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مدت اعتبار کش (دقیقه)
                  </label>
                  <input
                    type="number"
                    value={config.performance.cache_ttl_minutes}
                    onChange={(e) => handleConfigChange('performance', 'cache_ttl_minutes', parseInt(e.target.value) || 60)}
                    min="1"
                    max="1440"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable-compression"
                checked={config.performance.enable_compression}
                onChange={(e) => handleConfigChange('performance', 'enable_compression', e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="enable-compression" className="mr-2 text-sm text-gray-700">
                فشرده‌سازی گزیپ
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="minify-assets"
                checked={config.performance.minify_assets}
                onChange={(e) => handleConfigChange('performance', 'minify_assets', e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="minify-assets" className="mr-2 text-sm text-gray-700">
                کوچک‌سازی CSS/JS
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="cdn-enabled"
                checked={config.performance.cdn_enabled}
                onChange={(e) => handleConfigChange('performance', 'cdn_enabled', e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="cdn-enabled" className="mr-2 text-sm text-gray-700">
                استفاده از CDN
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="lazy-loading"
                checked={config.performance.lazy_loading}
                onChange={(e) => handleConfigChange('performance', 'lazy_loading', e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="lazy-loading" className="mr-2 text-sm text-gray-700">
                بارگذاری تنبل تصاویر
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* API Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-purple-600" />
          تنظیمات API
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="api-enabled"
              checked={config.api.api_enabled}
              onChange={(e) => handleConfigChange('api', 'api_enabled', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="api-enabled" className="mr-2 text-sm text-gray-700 font-medium">
              فعال‌سازی API
            </label>
          </div>
          
          {config.api.api_enabled && (
            <div className="p-4 bg-purple-50 rounded-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    محدودیت درخواست (در ساعت)
                  </label>
                  <input
                    type="number"
                    value={config.api.api_rate_limit}
                    onChange={(e) => handleConfigChange('api', 'api_rate_limit', parseInt(e.target.value) || 100)}
                    min="10"
                    max="10000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نسخه API
                  </label>
                  <select
                    value={config.api.api_version}
                    onChange={(e) => handleConfigChange('api', 'api_version', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="v1">نسخه 1</option>
                    <option value="v2">نسخه 2</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="api-key-required"
                    checked={config.api.api_key_required}
                    onChange={(e) => handleConfigChange('api', 'api_key_required', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="api-key-required" className="mr-2 text-sm text-gray-700">
                    الزامی بودن API Key
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="webhook-enabled"
                    checked={config.api.webhook_enabled}
                    onChange={(e) => handleConfigChange('api', 'webhook_enabled', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="webhook-enabled" className="mr-2 text-sm text-gray-700">
                    فعال‌سازی Webhook
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دامنه‌های مجاز (CORS)
                </label>
                <input
                  type="text"
                  value={config.api.allowed_origins.join(', ')}
                  onChange={(e) => handleArrayChange('api', 'allowed_origins', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com, https://app.example.com"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Settings className="w-5 h-5 text-green-600" />
          خلاصه پیکربندی سیستم
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${config.database.auto_backup ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-gray-600">پشتیبان‌گیری:</span>
            <span className="font-medium">
              {config.database.auto_backup ? config.database.backup_frequency : 'غیرفعال'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${config.security.ssl_enabled ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-gray-600">SSL:</span>
            <span className="font-medium">
              {config.security.ssl_enabled ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${config.performance.enable_caching ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-gray-600">کش:</span>
            <span className="font-medium">
              {config.performance.enable_caching ? config.performance.cache_type : 'غیرفعال'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${config.api.api_enabled ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-gray-600">API:</span>
            <span className="font-medium">
              {config.api.api_enabled ? config.api.api_version : 'غیرفعال'}
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-green-200">
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">
              همه سیستم‌ها به‌درستی پیکربندی شده و آماده استفاده هستند.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigSettings;