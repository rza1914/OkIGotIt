import React from 'react';
import { getPersianStatus } from '../../utils/persian';

interface PersianStatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PersianStatusBadge: React.FC<PersianStatusBadgeProps> = ({
  status,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      // Product statuses
      'published': 'bg-green-100 text-green-800 border-green-200',
      'draft': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'inactive': 'bg-gray-100 text-gray-800 border-gray-200',
      'active': 'bg-blue-100 text-blue-800 border-blue-200',
      
      // Order statuses
      'pending': 'bg-orange-100 text-orange-800 border-orange-200',
      'processing': 'bg-blue-100 text-blue-800 border-blue-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
      'delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'refunded': 'bg-purple-100 text-purple-800 border-purple-200',
      
      // Stock statuses
      'in_stock': 'bg-green-100 text-green-800 border-green-200',
      'low_stock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'out_of_stock': 'bg-red-100 text-red-800 border-red-200',
      'reserved': 'bg-blue-100 text-blue-800 border-blue-200',
      
      // User statuses
      'user': 'bg-gray-100 text-gray-800 border-gray-200',
      'admin': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'super_admin': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const statusIcons: Record<string, string> = {
      'published': '●',
      'active': '●',
      'in_stock': '●',
      'completed': '✓',
      'delivered': '✓',
      'processing': '⟳',
      'pending': '○',
      'draft': '○',
      'low_stock': '⚠',
      'out_of_stock': '✕',
      'cancelled': '✕',
      'refunded': '↺',
      'inactive': '○',
      'reserved': '●'
    };
    
    return statusIcons[status] || '●';
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const variantClasses = variant === 'outline' 
    ? 'bg-transparent border-2' 
    : variant === 'secondary'
    ? 'bg-gray-50 text-gray-700 border-gray-300'
    : 'border';

  const persianStatus = getPersianStatus(status);

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap 
        ${getStatusColor(status)} ${sizeClasses[size]} ${variantClasses} ${className}`}
    >
      <span className="text-current opacity-70">
        {getStatusIcon(status)}
      </span>
      <span dir="rtl">{persianStatus}</span>
    </span>
  );
};

export default PersianStatusBadge;