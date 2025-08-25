import React, { useState } from 'react';
import { 
  Check, X, Printer, Download, Mail, Trash2, Edit, 
  Package, Truck, AlertTriangle, RefreshCw
} from 'lucide-react';
import { formatPersianNumber } from '../../utils/persian';

interface BulkAction {
  key: string;
  label: string;
  icon: React.ElementType;
  color?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

interface BulkActionsProps {
  selectedCount: number;
  actions: BulkAction[];
  onAction: (actionKey: string) => void;
  onClearSelection: () => void;
  className?: string;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  actions,
  onAction,
  onClearSelection,
  className = ''
}) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<BulkAction | null>(null);

  const handleActionSelect = (actionKey: string) => {
    const action = actions.find(a => a.key === actionKey);
    if (!action) return;

    if (action.requiresConfirmation) {
      setConfirmationAction(action);
      setShowConfirmation(true);
    } else {
      onAction(actionKey);
      setSelectedAction('');
    }
  };

  const handleConfirmAction = () => {
    if (confirmationAction) {
      onAction(confirmationAction.key);
      setSelectedAction('');
      setShowConfirmation(false);
      setConfirmationAction(null);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationAction(null);
    setSelectedAction('');
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className={`card p-4 bg-blue-50 border border-blue-200 ${className}`} dir="rtl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-blue-800">
              {formatPersianNumber(selectedCount)} مورد انتخاب شده
            </span>
            
            <div className="flex items-center gap-2">
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              >
                <option value="">انتخاب عملیات</option>
                {actions.map(action => (
                  <option key={action.key} value={action.key}>
                    {action.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => handleActionSelect(selectedAction)}
                disabled={!selectedAction}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
              >
                اعمال
              </button>
            </div>
          </div>
          
          <button
            onClick={onClearSelection}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            لغو انتخاب
          </button>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-blue-200">
          <span className="text-xs text-blue-700 ml-3">عملیات سریع:</span>
          {actions.slice(0, 4).map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.key}
                onClick={() => handleActionSelect(action.key)}
                className={`
                  inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors
                  ${action.color || 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'}
                `}
                title={action.label}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && confirmationAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" dir="rtl">
          <div className="bg-white rounded-xl p-6 m-4 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                تایید عملیات
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {confirmationAction.confirmationMessage || 
                `آیا مطمئن هستید که می‌خواهید "${confirmationAction.label}" را روی ${formatPersianNumber(selectedCount)} مورد انتخاب شده اعمال کنید؟`
              }
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelConfirmation}
                className="btn-secondary"
              >
                انصراف
              </button>
              <button
                onClick={handleConfirmAction}
                className="btn-primary"
              >
                تایید
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Pre-defined bulk actions for orders
export const orderBulkActions: BulkAction[] = [
  {
    key: 'confirm',
    label: 'تایید سفارشات',
    icon: Check,
    color: 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
  },
  {
    key: 'cancel',
    label: 'لغو سفارشات',
    icon: X,
    color: 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100',
    requiresConfirmation: true,
    confirmationMessage: 'آیا مطمئن هستید که می‌خواهید سفارشات انتخاب شده را لغو کنید؟ این عمل قابل بازگشت نیست.'
  },
  {
    key: 'ship',
    label: 'ارسال سفارشات',
    icon: Truck,
    color: 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100'
  },
  {
    key: 'print',
    label: 'چاپ فاکتورها',
    icon: Printer,
    color: 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
  },
  {
    key: 'export',
    label: 'صدور گزارش',
    icon: Download
  },
  {
    key: 'email',
    label: 'ارسال ایمیل',
    icon: Mail
  },
  {
    key: 'preparing',
    label: 'آماده‌سازی',
    icon: Package,
    color: 'bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100'
  },
  {
    key: 'delete',
    label: 'حذف سفارشات',
    icon: Trash2,
    color: 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100',
    requiresConfirmation: true,
    confirmationMessage: 'آیا مطمئن هستید که می‌خواهید سفارشات انتخاب شده را حذف کنید؟ این عمل قابل بازگشت نیست و تمام داده‌های مرتبط از بین خواهد رفت.'
  }
];

export default BulkActions;