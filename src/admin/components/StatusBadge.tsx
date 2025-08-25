import React from 'react';
import { 
  Clock, CheckCircle, Package, Truck, AlertTriangle, X, RefreshCw,
  CreditCard, AlertCircle, Check
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'payment' | 'shipping' | 'general';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type = 'order', 
  size = 'md', 
  showIcon = true,
  className = '' 
}) => {
  const getOrderStatusConfig = (status: string) => {
    switch (status) {
      case 'registered':
        return {
          label: 'ثبت شده',
          icon: Clock,
          colors: 'text-blue-600 bg-blue-100 border-blue-200'
        };
      case 'confirmed':
        return {
          label: 'تایید شده',
          icon: CheckCircle,
          colors: 'text-green-600 bg-green-100 border-green-200'
        };
      case 'preparing':
        return {
          label: 'آماده‌سازی',
          icon: Package,
          colors: 'text-yellow-600 bg-yellow-100 border-yellow-200'
        };
      case 'shipped':
        return {
          label: 'ارسال شده',
          icon: Truck,
          colors: 'text-purple-600 bg-purple-100 border-purple-200'
        };
      case 'delivered':
        return {
          label: 'تحویل شده',
          icon: CheckCircle,
          colors: 'text-emerald-600 bg-emerald-100 border-emerald-200'
        };
      case 'cancelled':
        return {
          label: 'لغو شده',
          icon: X,
          colors: 'text-red-600 bg-red-100 border-red-200'
        };
      case 'returned':
        return {
          label: 'مرجوعی',
          icon: RefreshCw,
          colors: 'text-orange-600 bg-orange-100 border-orange-200'
        };
      default:
        return {
          label: status,
          icon: AlertTriangle,
          colors: 'text-gray-600 bg-gray-100 border-gray-200'
        };
    }
  };

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'در انتظار پرداخت',
          icon: Clock,
          colors: 'text-yellow-600 bg-yellow-100 border-yellow-200'
        };
      case 'paid':
        return {
          label: 'پرداخت شده',
          icon: CheckCircle,
          colors: 'text-green-600 bg-green-100 border-green-200'
        };
      case 'failed':
        return {
          label: 'پرداخت ناموفق',
          icon: AlertCircle,
          colors: 'text-red-600 bg-red-100 border-red-200'
        };
      case 'refunded':
        return {
          label: 'بازپرداخت شده',
          icon: RefreshCw,
          colors: 'text-purple-600 bg-purple-100 border-purple-200'
        };
      default:
        return {
          label: status,
          icon: CreditCard,
          colors: 'text-gray-600 bg-gray-100 border-gray-200'
        };
    }
  };

  const getShippingStatusConfig = (status: string) => {
    switch (status) {
      case 'preparing':
        return {
          label: 'آماده‌سازی',
          icon: Package,
          colors: 'text-yellow-600 bg-yellow-100 border-yellow-200'
        };
      case 'shipped':
        return {
          label: 'ارسال شده',
          icon: Truck,
          colors: 'text-blue-600 bg-blue-100 border-blue-200'
        };
      case 'delivered':
        return {
          label: 'تحویل شده',
          icon: CheckCircle,
          colors: 'text-green-600 bg-green-100 border-green-200'
        };
      default:
        return {
          label: status,
          icon: AlertTriangle,
          colors: 'text-gray-600 bg-gray-100 border-gray-200'
        };
    }
  };

  const getGeneralStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'فعال',
          icon: Check,
          colors: 'text-green-600 bg-green-100 border-green-200'
        };
      case 'inactive':
        return {
          label: 'غیرفعال',
          icon: X,
          colors: 'text-gray-600 bg-gray-100 border-gray-200'
        };
      case 'pending':
        return {
          label: 'در انتظار',
          icon: Clock,
          colors: 'text-yellow-600 bg-yellow-100 border-yellow-200'
        };
      case 'approved':
        return {
          label: 'تایید شده',
          icon: CheckCircle,
          colors: 'text-green-600 bg-green-100 border-green-200'
        };
      case 'rejected':
        return {
          label: 'رد شده',
          icon: X,
          colors: 'text-red-600 bg-red-100 border-red-200'
        };
      default:
        return {
          label: status,
          icon: AlertTriangle,
          colors: 'text-gray-600 bg-gray-100 border-gray-200'
        };
    }
  };

  const getConfig = () => {
    switch (type) {
      case 'payment':
        return getPaymentStatusConfig(status);
      case 'shipping':
        return getShippingStatusConfig(status);
      case 'general':
        return getGeneralStatusConfig(status);
      default:
        return getOrderStatusConfig(status);
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
    lg: 'text-base px-3 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1 rounded-full font-medium border
        ${config.colors}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
};

export default StatusBadge;