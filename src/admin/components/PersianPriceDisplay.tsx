import React from 'react';
import { formatPersianCurrency, formatIranianCurrency, formatDiscountPercent, toPersianNumber } from '../../utils/persian';

interface PersianPriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  showDiscount?: boolean;
  showRial?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

const PersianPriceDisplay: React.FC<PersianPriceDisplayProps> = ({
  price,
  originalPrice,
  currency = 'تومان',
  showDiscount = true,
  showRial = false,
  size = 'md',
  className = '',
  direction = 'horizontal'
}) => {
  const hasDiscount = originalPrice && originalPrice > price;
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const formatPrice = (amount: number) => {
    return showRial ? formatIranianCurrency(amount, true) : formatPersianCurrency(amount, currency);
  };

  const renderPrice = () => (
    <span className={`font-bold text-gray-900 ${sizeClasses[size]}`}>
      {formatPrice(price)}
    </span>
  );

  const renderOriginalPrice = () => (
    <span className={`text-gray-500 line-through ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg'}`}>
      {formatPrice(originalPrice!)}
    </span>
  );

  const renderDiscountBadge = () => (
    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
      {formatDiscountPercent(originalPrice!, price)}
    </span>
  );

  if (direction === 'vertical') {
    return (
      <div className={`flex flex-col items-start gap-1 ${className}`} dir="rtl">
        {renderPrice()}
        {hasDiscount && (
          <div className="flex items-center gap-2">
            {renderOriginalPrice()}
            {showDiscount && renderDiscountBadge()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`} dir="rtl">
      {renderPrice()}
      {hasDiscount && (
        <>
          {renderOriginalPrice()}
          {showDiscount && renderDiscountBadge()}
        </>
      )}
    </div>
  );
};

interface PersianPriceRangeProps {
  minPrice: number;
  maxPrice: number;
  currency?: string;
  showRial?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PersianPriceRange: React.FC<PersianPriceRangeProps> = ({
  minPrice,
  maxPrice,
  currency = 'تومان',
  showRial = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const formatPrice = (amount: number) => {
    return showRial ? formatIranianCurrency(amount, true) : formatPersianCurrency(amount, currency);
  };

  if (minPrice === maxPrice) {
    return (
      <span className={`font-bold text-gray-900 ${sizeClasses[size]} ${className}`} dir="rtl">
        {formatPrice(minPrice)}
      </span>
    );
  }

  return (
    <span className={`font-bold text-gray-900 ${sizeClasses[size]} ${className}`} dir="rtl">
      از {formatPrice(minPrice)} تا {formatPrice(maxPrice)}
    </span>
  );
};

interface PersianStockDisplayProps {
  stock: number;
  threshold?: number;
  showAlert?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PersianStockDisplay: React.FC<PersianStockDisplayProps> = ({
  stock,
  threshold = 10,
  showAlert = true,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const getStockColor = () => {
    if (stock === 0) return 'text-red-600';
    if (stock <= threshold) return 'text-orange-600';
    return 'text-green-600';
  };

  const getStockText = () => {
    if (stock === 0) return 'ناموجود';
    if (stock <= threshold && showAlert) return `${toPersianNumber(stock)} عدد (کم)`;
    return `${toPersianNumber(stock)} عدد`;
  };

  return (
    <span className={`font-medium ${getStockColor()} ${sizeClasses[size]} ${className}`} dir="rtl">
      {getStockText()}
    </span>
  );
};

export default PersianPriceDisplay;