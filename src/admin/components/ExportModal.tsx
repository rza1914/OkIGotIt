import React, { useState } from 'react';
import { Download, FileText, Database, Calendar, Filter, X, Check } from 'lucide-react';
import { formatPersianDateTime, toPersianNumber } from '../../utils/persian';
import PersianModal from './PersianModal';

interface ExportOptions {
  format: 'excel' | 'csv' | 'pdf';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  startDate?: string;
  endDate?: string;
  fields: string[];
  filters: {
    status?: string[];
    paymentStatus?: string[];
    minAmount?: number;
    maxAmount?: number;
  };
  includeCustomerDetails: boolean;
  includeOrderItems: boolean;
  includePaymentInfo: boolean;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  totalRecords: number;
  selectedCount?: number;
  exportType?: 'all' | 'selected' | 'filtered';
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  totalRecords,
  selectedCount = 0,
  exportType = 'all'
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'excel',
    dateRange: 'all',
    fields: ['orderNumber', 'customer', 'amount', 'status', 'createdAt'],
    filters: {},
    includeCustomerDetails: true,
    includeOrderItems: false,
    includePaymentInfo: true
  });

  const [isExporting, setIsExporting] = useState(false);

  const availableFields = [
    { key: 'orderNumber', label: 'شماره سفارش', required: true },
    { key: 'customer', label: 'نام مشتری', required: true },
    { key: 'customerEmail', label: 'ایمیل مشتری' },
    { key: 'customerPhone', label: 'تلفن مشتری' },
    { key: 'amount', label: 'مبلغ سفارش', required: true },
    { key: 'status', label: 'وضعیت سفارش', required: true },
    { key: 'paymentStatus', label: 'وضعیت پرداخت' },
    { key: 'paymentMethod', label: 'روش پرداخت' },
    { key: 'shippingAddress', label: 'آدرس ارسال' },
    { key: 'trackingNumber', label: 'کد پیگیری' },
    { key: 'createdAt', label: 'تاریخ ثبت', required: true },
    { key: 'updatedAt', label: 'تاریخ بروزرسانی' }
  ];

  const statusOptions = [
    { key: 'registered', label: 'ثبت شده' },
    { key: 'confirmed', label: 'تایید شده' },
    { key: 'preparing', label: 'آماده‌سازی' },
    { key: 'shipped', label: 'ارسال شده' },
    { key: 'delivered', label: 'تحویل شده' },
    { key: 'cancelled', label: 'لغو شده' },
    { key: 'returned', label: 'مرجوعی' }
  ];

  const paymentStatusOptions = [
    { key: 'pending', label: 'در انتظار' },
    { key: 'paid', label: 'پرداخت شده' },
    { key: 'failed', label: 'ناموفق' },
    { key: 'refunded', label: 'بازپرداخت شده' }
  ];

  const handleFieldToggle = (fieldKey: string) => {
    const field = availableFields.find(f => f.key === fieldKey);
    if (field?.required) return;

    setOptions(prev => ({
      ...prev,
      fields: prev.fields.includes(fieldKey)
        ? prev.fields.filter(f => f !== fieldKey)
        : [...prev.fields, fieldKey]
    }));
  };

  const handleStatusFilterToggle = (statusKey: string) => {
    setOptions(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        status: prev.filters.status?.includes(statusKey)
          ? prev.filters.status.filter(s => s !== statusKey)
          : [...(prev.filters.status || []), statusKey]
      }
    }));
  };

  const handlePaymentStatusFilterToggle = (statusKey: string) => {
    setOptions(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        paymentStatus: prev.filters.paymentStatus?.includes(statusKey)
          ? prev.filters.paymentStatus.filter(s => s !== statusKey)
          : [...(prev.filters.paymentStatus || []), statusKey]
      }
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(options);
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  const getRecordCount = () => {
    switch (exportType) {
      case 'selected':
        return selectedCount;
      case 'filtered':
        return totalRecords; // This would be filtered count in real implementation
      default:
        return totalRecords;
    }
  };

  return (
    <PersianModal
      isOpen={isOpen}
      onClose={onClose}
      title="صادرات داده‌ها"
      size="lg"
      footerActions={
        <>
          <button onClick={onClose} className="btn-secondary">
            انصراف
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn-primary disabled:opacity-50 flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                در حال صادرات...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                صادرات {toPersianNumber(getRecordCount())} رکورد
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Export Format */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">فرمت فایل</h4>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'excel', label: 'Excel (.xlsx)', icon: Database, desc: 'مناسب برای تحلیل داده' },
              { key: 'csv', label: 'CSV (.csv)', icon: FileText, desc: 'سازگار با همه نرم‌افزارها' },
              { key: 'pdf', label: 'PDF (.pdf)', icon: FileText, desc: 'مناسب برای چاپ' }
            ].map(format => (
              <label
                key={format.key}
                className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                  options.format === format.key
                    ? 'border-rose-300 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={format.key}
                  checked={options.format === format.key}
                  onChange={(e) => setOptions(prev => ({ ...prev, format: e.target.value as any }))}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 mb-1">
                  <format.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{format.label}</span>
                </div>
                <span className="text-xs text-gray-500">{format.desc}</span>
                {options.format === format.key && (
                  <Check className="absolute top-2 left-2 w-4 h-4 text-rose-600" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">بازه زمانی</h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { key: 'all', label: 'تمام تاریخ‌ها' },
              { key: 'today', label: 'امروز' },
              { key: 'week', label: 'هفته گذشته' },
              { key: 'month', label: 'ماه گذشته' }
            ].map(range => (
              <label
                key={range.key}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  options.dateRange === range.key
                    ? 'border-rose-300 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="dateRange"
                  value={range.key}
                  checked={options.dateRange === range.key}
                  onChange={(e) => setOptions(prev => ({ ...prev, dateRange: e.target.value as any }))}
                  className="ml-2 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-sm">{range.label}</span>
              </label>
            ))}
          </div>
          
          {options.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">از تاریخ</label>
                <input
                  type="date"
                  value={options.startDate || ''}
                  onChange={(e) => setOptions(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تا تاریخ</label>
                <input
                  type="date"
                  value={options.endDate || ''}
                  onChange={(e) => setOptions(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Fields Selection */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">فیلدهای قابل صادرات</h4>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {availableFields.map(field => (
              <label
                key={field.key}
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                  field.required 
                    ? 'bg-gray-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={options.fields.includes(field.key)}
                  onChange={() => handleFieldToggle(field.key)}
                  disabled={field.required}
                  className="ml-2 text-rose-600 focus:ring-rose-500 disabled:opacity-50"
                />
                <span className={`text-sm ${field.required ? 'text-gray-500' : 'text-gray-700'}`}>
                  {field.label} {field.required && '(ضروری)'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">فیلتر وضعیت سفارشات</h4>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map(status => (
              <label key={status.key} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.filters.status?.includes(status.key) || false}
                  onChange={() => handleStatusFilterToggle(status.key)}
                  className="ml-2 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-sm text-gray-700">{status.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">گزینه‌های اضافی</h4>
          <div className="space-y-2">
            <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeCustomerDetails}
                onChange={(e) => setOptions(prev => ({ ...prev, includeCustomerDetails: e.target.checked }))}
                className="ml-2 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-sm text-gray-700">شامل جزئیات کامل مشتری</span>
            </label>
            <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeOrderItems}
                onChange={(e) => setOptions(prev => ({ ...prev, includeOrderItems: e.target.checked }))}
                className="ml-2 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-sm text-gray-700">شامل آیتم‌های سفارش</span>
            </label>
            <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includePaymentInfo}
                onChange={(e) => setOptions(prev => ({ ...prev, includePaymentInfo: e.target.checked }))}
                className="ml-2 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-sm text-gray-700">شامل اطلاعات پرداخت</span>
            </label>
          </div>
        </div>

        {/* Amount Range */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">فیلتر بر اساس مبلغ</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">حداقل مبلغ (تومان)</label>
              <input
                type="number"
                value={options.filters.minAmount || ''}
                onChange={(e) => setOptions(prev => ({
                  ...prev,
                  filters: { ...prev.filters, minAmount: e.target.value ? Number(e.target.value) : undefined }
                }))}
                placeholder="مثال: 100000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">حداکثر مبلغ (تومان)</label>
              <input
                type="number"
                value={options.filters.maxAmount || ''}
                onChange={(e) => setOptions(prev => ({
                  ...prev,
                  filters: { ...prev.filters, maxAmount: e.target.value ? Number(e.target.value) : undefined }
                }))}
                placeholder="مثال: 10000000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>
      </div>
    </PersianModal>
  );
};

export default ExportModal;