import React, { useState } from 'react';
import { 
  X, AlertTriangle, Shield, Ban, CheckCircle, 
  Clock, MessageSquare, Mail, Phone, FileText 
} from 'lucide-react';
import PersianStatusBadge from './PersianStatusBadge';
import { formatPersianDateTime, toPersianNumber } from '../../utils/persian';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'blocked' | 'suspended';
  user_type: 'customer' | 'vip' | 'premium' | 'blocked';
}

interface StatusChangeReason {
  id: string;
  reason: string;
  description: string;
  requires_note: boolean;
}

interface UserStatusManagerProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (userId: string, newStatus: string, reason: string, note?: string) => void;
}

const UserStatusManager: React.FC<UserStatusManagerProps> = ({
  user,
  isOpen,
  onClose,
  onStatusChange
}) => {
  const [newStatus, setNewStatus] = useState(user.status);
  const [selectedReason, setSelectedReason] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [notifyUser, setNotifyUser] = useState(true);
  const [notificationMethod, setNotificationMethod] = useState<'email' | 'sms' | 'both'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined reasons for status changes
  const statusReasons: Record<string, StatusChangeReason[]> = {
    blocked: [
      {
        id: 'fraud',
        reason: 'فعالیت مشکوک مالی',
        description: 'تراکنش‌های مشکوک یا فرار از پرداخت',
        requires_note: true
      },
      {
        id: 'abuse',
        reason: 'رفتار نامناسب',
        description: 'استفاده نامناسب از پلتفرم یا آزار سایر کاربران',
        requires_note: true
      },
      {
        id: 'violation',
        reason: 'نقض قوانین',
        description: 'نقض شرایط و قوانین استفاده',
        requires_note: true
      },
      {
        id: 'security',
        reason: 'مسائل امنیتی',
        description: 'حساب در معرض خطر یا آسیب‌پذیری امنیتی',
        requires_note: false
      }
    ],
    suspended: [
      {
        id: 'temporary_fraud',
        reason: 'بررسی مالی موقت',
        description: 'بررسی تراکنش‌های مشکوک - موقت',
        requires_note: false
      },
      {
        id: 'verification_pending',
        reason: 'در انتظار تایید هویت',
        description: 'نیاز به تکمیل فرآیند احراز هویت',
        requires_note: false
      },
      {
        id: 'investigation',
        reason: 'در حال بررسی',
        description: 'بررسی گزارش‌های دریافتی',
        requires_note: true
      }
    ],
    inactive: [
      {
        id: 'user_request',
        reason: 'درخواست کاربر',
        description: 'غیرفعال‌سازی به درخواست خود کاربر',
        requires_note: false
      },
      {
        id: 'inactivity',
        reason: 'عدم فعالیت طولانی',
        description: 'عدم استفاده از حساب برای مدت طولانی',
        requires_note: false
      }
    ],
    active: [
      {
        id: 'resolved',
        reason: 'حل مسئله',
        description: 'مسائل برطرف شده و حساب بازگشایی',
        requires_note: false
      },
      {
        id: 'verified',
        reason: 'تایید هویت',
        description: 'احراز هویت با موفقیت تکمیل شد',
        requires_note: false
      },
      {
        id: 'appeal_approved',
        reason: 'تجدیدنظر پذیرفته شد',
        description: 'درخواست تجدیدنظر تایید شد',
        requires_note: false
      }
    ]
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'text-green-600',
      inactive: 'text-gray-600',
      blocked: 'text-red-600',
      suspended: 'text-orange-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: <CheckCircle className="w-5 h-5" />,
      inactive: <Clock className="w-5 h-5" />,
      blocked: <Ban className="w-5 h-5" />,
      suspended: <AlertTriangle className="w-5 h-5" />
    };
    return icons[status as keyof typeof icons];
  };

  const getStatusDescription = (status: string) => {
    const descriptions = {
      active: 'کاربر می‌تواند تمام امکانات را استفاده کند',
      inactive: 'کاربر نمی‌تواند وارد حساب خود شود',
      blocked: 'حساب کاربر به طور دائم مسدود شده است',
      suspended: 'حساب کاربر موقتاً تعلیق شده است'
    };
    return descriptions[status as keyof typeof descriptions];
  };

  const currentReasons = statusReasons[newStatus] || [];
  const selectedReasonData = currentReasons.find(r => r.id === selectedReason);
  const requiresNote = selectedReasonData?.requires_note || false;

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert('لطفاً دلیل تغییر وضعیت را انتخاب کنید');
      return;
    }

    if (requiresNote && !customNote.trim()) {
      alert('لطفاً توضیحات را وارد کنید');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reason = selectedReasonData?.reason || '';
      const note = customNote.trim() || selectedReasonData?.description || '';
      
      onStatusChange(user.id, newStatus, reason, note);
      onClose();
    } catch (error) {
      console.error('Error changing user status:', error);
      alert('خطا در تغییر وضعیت کاربر');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNotificationMessage = () => {
    const messages = {
      active: 'حساب شما فعال شد و می‌توانید از تمام امکانات استفاده کنید.',
      inactive: 'حساب شما غیرفعال شده است. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.',
      blocked: 'حساب شما به دلیل نقض قوانین مسدود شده است.',
      suspended: 'حساب شما موقتاً تعلیق شده است. لطفاً منتظر بررسی بمانید.'
    };
    return messages[newStatus as keyof typeof messages];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">تغییر وضعیت کاربر</h2>
              <p className="text-sm text-gray-600">
                {user.first_name} {user.last_name} - {user.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">وضعیت فعلی</h3>
              <PersianStatusBadge status={user.status} />
            </div>
            <p className="text-sm text-gray-600">{getStatusDescription(user.status)}</p>
          </div>

          {/* New Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              وضعیت جدید
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['active', 'inactive', 'suspended', 'blocked'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setNewStatus(status);
                    setSelectedReason('');
                    setCustomNote('');
                  }}
                  className={`p-3 border rounded-lg transition-colors ${
                    newStatus === status
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={getStatusColor(status)}>
                      {getStatusIcon(status)}
                    </div>
                    <span className="font-medium">
                      {status === 'active' && 'فعال'}
                      {status === 'inactive' && 'غیرفعال'}
                      {status === 'suspended' && 'تعلیق'}
                      {status === 'blocked' && 'مسدود'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    {getStatusDescription(status)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Reason Selection */}
          {currentReasons.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                دلیل تغییر وضعیت
              </label>
              <div className="space-y-2">
                {currentReasons.map((reason) => (
                  <label
                    key={reason.id}
                    className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedReason === reason.id
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="reason"
                        value={reason.id}
                        checked={selectedReason === reason.id}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{reason.reason}</div>
                        <div className="text-sm text-gray-500 mt-1">{reason.description}</div>
                        {reason.requires_note && (
                          <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            نیاز به توضیحات اضافی
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {(requiresNote || selectedReason) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات اضافی
                {requiresNote && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder={requiresNote ? 'لطفاً توضیحات کاملی ارائه دهید...' : 'توضیحات اختیاری...'}
                required={requiresNote}
              />
            </div>
          )}

          {/* Notification Settings */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="notify-user"
                checked={notifyUser}
                onChange={(e) => setNotifyUser(e.target.checked)}
                className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
              />
              <label htmlFor="notify-user" className="text-sm font-medium text-gray-700">
                اطلاع‌رسانی به کاربر
              </label>
            </div>

            {notifyUser && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    روش اطلاع‌رسانی
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="notification-method"
                        value="email"
                        checked={notificationMethod === 'email'}
                        onChange={(e) => setNotificationMethod(e.target.value as 'email')}
                      />
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">ایمیل</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="notification-method"
                        value="sms"
                        checked={notificationMethod === 'sms'}
                        onChange={(e) => setNotificationMethod(e.target.value as 'sms')}
                      />
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">پیامک</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="notification-method"
                        value="both"
                        checked={notificationMethod === 'both'}
                        onChange={(e) => setNotificationMethod(e.target.value as 'both')}
                      />
                      <span className="text-sm">هر دو</span>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <div className="font-medium mb-1">پیش‌نمایش پیام</div>
                      <div>{getNotificationMessage()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              تغییرات در لاگ سیستم ثبت خواهد شد
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                انصراف
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedReason || isSubmitting}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    در حال پردازش...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    تایید تغییر وضعیت
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatusManager;