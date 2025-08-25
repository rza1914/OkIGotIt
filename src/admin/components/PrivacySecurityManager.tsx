import React, { useState } from 'react';
import { 
  X, Shield, Lock, Eye, EyeOff, Download, Trash2, 
  AlertTriangle, CheckCircle, Key, UserX, FileText,
  Clock, Mail, Phone, Database, Activity, Settings
} from 'lucide-react';
import { formatPersianDateTime, toPersianNumber, getRelativeTime } from '../../utils/persian';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  registration_date: Date;
  last_login: Date;
  data_retention_days?: number;
  gdpr_consent: boolean;
  data_processing_consent: boolean;
  marketing_consent: boolean;
}

interface DataExportRequest {
  id: string;
  requested_at: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
  expires_at?: Date;
}

interface SecurityLog {
  id: string;
  action: string;
  description: string;
  ip_address: string;
  user_agent?: string;
  timestamp: Date;
  risk_level: 'low' | 'medium' | 'high';
}

interface PrivacySecurityManagerProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const PrivacySecurityManager: React.FC<PrivacySecurityManagerProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('privacy');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  // Mock data
  const mockSecurityLogs: SecurityLog[] = [
    {
      id: '1',
      action: 'login',
      description: 'ورود موفق به حساب کاربری',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      risk_level: 'low'
    },
    {
      id: '2',
      action: 'password_change',
      description: 'تغییر رمز عبور',
      ip_address: '192.168.1.100',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      risk_level: 'medium'
    },
    {
      id: '3',
      action: 'failed_login',
      description: 'تلاش ناموفق برای ورود',
      ip_address: '192.168.1.105',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      risk_level: 'high'
    }
  ];

  const mockExportRequests: DataExportRequest[] = [
    {
      id: '1',
      requested_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
      download_url: '/downloads/user-data-export-123.zip',
      expires_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
    }
  ];

  const handleExportUserData = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Starting data export for user:', user.id);
      alert('درخواست صادرات داده‌ها ثبت شد. پس از آماده شدن از طریق ایمیل اطلاع‌رسانی خواهید شد.');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('خطا در درخواست صادرات داده‌ها');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteReason.trim()) {
      alert('لطفاً دلیل حذف حساب را وارد کنید');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Deleting user account:', user.id, 'Reason:', deleteReason);
      alert('حساب کاربری با موفقیت حذف شد');
      onClose();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('خطا در حذف حساب کاربری');
    } finally {
      setIsProcessing(false);
      setShowConfirmDelete(false);
    }
  };

  const handleAnonymizeData = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Anonymizing user data:', user.id);
      alert('داده‌های کاربر با موفقیت ناشناس شد');
    } catch (error) {
      console.error('Error anonymizing data:', error);
      alert('خطا در ناشناس‌سازی داده‌ها');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetPassword = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sending password reset for user:', user.id);
      alert('لینک بازنشانی رمز عبور به ایمیل کاربر ارسال شد');
    } catch (error) {
      console.error('Error sending password reset:', error);
      alert('خطا در ارسال لینک بازنشانی');
    } finally {
      setIsProcessing(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-orange-600 bg-orange-100',
      high: 'text-red-600 bg-red-100'
    };
    return colors[level as keyof typeof colors] || colors.low;
  };

  const getRiskLevelText = (level: string) => {
    const texts = {
      low: 'کم',
      medium: 'متوسط',
      high: 'بالا'
    };
    return texts[level as keyof typeof texts] || level;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">حریم خصوصی و امنیت</h2>
              <p className="text-white/80">
                مدیریت داده‌ها و امنیت حساب {user.first_name} {user.last_name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-reverse space-x-8 px-6">
            {[
              { key: 'privacy', label: 'حریم خصوصی', icon: Shield },
              { key: 'security', label: 'امنیت', icon: Lock },
              { key: 'data', label: 'مدیریت داده‌ها', icon: Database },
              { key: 'logs', label: 'لاگ امنیتی', icon: Activity }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-160px)] overflow-y-auto">
          <div className="p-6">
            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                {/* Consent Management */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">مدیریت موافقت‌نامه‌ها</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">موافقت GDPR</div>
                        <div className="text-sm text-gray-600">موافقت با قوانین حفاظت از داده‌های شخصی</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.gdpr_consent ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`text-sm ${user.gdpr_consent ? 'text-green-600' : 'text-red-600'}`}>
                          {user.gdpr_consent ? 'داده شده' : 'داده نشده'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">پردازش داده‌ها</div>
                        <div className="text-sm text-gray-600">موافقت با پردازش و ذخیره‌سازی داده‌ها</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.data_processing_consent ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`text-sm ${user.data_processing_consent ? 'text-green-600' : 'text-red-600'}`}>
                          {user.data_processing_consent ? 'داده شده' : 'داده نشده'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">بازاریابی</div>
                        <div className="text-sm text-gray-600">موافقت با دریافت ایمیل‌ها و پیام‌های تبلیغاتی</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.marketing_consent ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`text-sm ${user.marketing_consent ? 'text-green-600' : 'text-red-600'}`}>
                          {user.marketing_consent ? 'داده شده' : 'داده نشده'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Retention */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">نگهداری داده‌ها</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        مدت نگهداری (روز)
                      </label>
                      <input
                        type="number"
                        value={user.data_retention_days || 365}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاریخ انقضای داده‌ها
                      </label>
                      <div className="text-sm text-gray-900 p-2 border border-gray-200 rounded-lg bg-gray-50">
                        {formatPersianDateTime(
                          new Date(user.registration_date.getTime() + (user.data_retention_days || 365) * 24 * 60 * 60 * 1000)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Account Security */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">امنیت حساب</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">بازنشانی رمز عبور</div>
                        <div className="text-sm text-gray-600">ارسال لینک بازنشانی به ایمیل کاربر</div>
                      </div>
                      <button
                        onClick={handleResetPassword}
                        disabled={isProcessing}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Key className="w-4 h-4" />
                        ارسال لینک
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">احراز هویت دومرحله‌ای</div>
                        <div className="text-sm text-gray-600">وضعیت فعال‌بودن 2FA</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.two_factor_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.two_factor_enabled ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">آخرین ورود</div>
                        <div className="text-sm text-gray-600">
                          {getRelativeTime(user.last_login)}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatPersianDateTime(user.last_login)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Suspicious Activity */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">فعالیت‌های مشکوک</h3>
                  <div className="space-y-3">
                    {mockSecurityLogs.filter(log => log.risk_level !== 'low').map(log => (
                      <div key={log.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">{log.description}</div>
                            <div className="text-sm text-gray-600">
                              IP: {log.ip_address} • {getRelativeTime(log.timestamp)}
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(log.risk_level)}`}>
                          خطر {getRiskLevelText(log.risk_level)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Data Management Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                {/* Data Export */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">صادرات داده‌ها</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">صادرات کامل داده‌های کاربر</div>
                        <div className="text-sm text-gray-600">
                          شامل اطلاعات شخصی، سفارشات، پیام‌ها و تاریخچه فعالیت
                        </div>
                      </div>
                      <button
                        onClick={handleExportUserData}
                        disabled={isProcessing}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        درخواست صادرات
                      </button>
                    </div>

                    {/* Previous Export Requests */}
                    {mockExportRequests.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">درخواست‌های قبلی</h4>
                        <div className="space-y-2">
                          {mockExportRequests.map(request => (
                            <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="text-sm text-gray-900">
                                  درخواست {formatPersianDateTime(request.requested_at)}
                                </div>
                                <div className="text-xs text-gray-600">
                                  وضعیت: {request.status}
                                  {request.expires_at && ' • انقضا: ' + getRelativeTime(request.expires_at)}
                                </div>
                              </div>
                              {request.status === 'completed' && request.download_url && (
                                <button className="btn-secondary text-sm flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  دانلود
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Data Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">عملیات داده‌ها</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                      <div>
                        <div className="font-medium text-orange-900">ناشناس‌سازی داده‌ها</div>
                        <div className="text-sm text-orange-700">
                          حذف اطلاعات شخصی و حفظ داده‌های آماری
                        </div>
                      </div>
                      <button
                        onClick={handleAnonymizeData}
                        disabled={isProcessing}
                        className="btn-secondary flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-100"
                      >
                        <Eye className="w-4 h-4" />
                        ناشناس‌سازی
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <div className="font-medium text-red-900">حذف کامل حساب</div>
                        <div className="text-sm text-red-700">
                          حذف دائمی تمام اطلاعات - غیرقابل بازگشت
                        </div>
                      </div>
                      <button
                        onClick={() => setShowConfirmDelete(true)}
                        className="btn-danger flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف حساب
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Logs Tab */}
            {activeTab === 'logs' && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">لاگ امنیتی</h3>
                  
                  <div className="space-y-3">
                    {mockSecurityLogs.map(log => (
                      <div key={log.id} className="flex items-start justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">{log.description}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              IP: {log.ip_address} 
                              {log.user_agent && (
                                <span className="block mt-1 text-xs">
                                  {log.user_agent}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-gray-500">
                            {getRelativeTime(log.timestamp)}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(log.risk_level)}`}>
                            {getRiskLevelText(log.risk_level)}
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

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              تمام عملیات در لاگ سیستم ثبت می‌شود
            </div>
            <button onClick={onClose} className="btn-secondary">
              بستن
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">حذف کامل حساب</h3>
                  <p className="text-sm text-gray-600">این عمل غیرقابل بازگشت است</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دلیل حذف حساب
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="دلیل حذف حساب را وارد کنید..."
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="btn-secondary flex-1"
                  disabled={isProcessing}
                >
                  انصراف
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isProcessing || !deleteReason.trim()}
                  className="btn-danger flex-1 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      در حال حذف...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      تایید حذف
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacySecurityManager;