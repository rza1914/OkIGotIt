// Persian utilities for iShop Admin

// Persian month names
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خردار', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// Persian day names
const persianDays = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'
];

// Convert English numbers to Persian
export const toPersianNumber = (num: number | string | undefined): string => {
  if (num === undefined || num === null) return '';
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const numStr = num.toString();
  return numStr.replace(/\d/g, (digit) => persianNumbers[parseInt(digit)]);
};

// Convert Persian numbers to English
export const toEnglishNumber = (str: string): string => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let result = str;
  persianNumbers.forEach((persian, index) => {
    result = result.replace(new RegExp(persian, 'g'), index.toString());
  });
  return result;
};

// Format date in Persian
export const formatPersianDate = (date: Date): string => {
  const day = toPersianNumber(date.getDate());
  const month = persianMonths[date.getMonth()];
  const year = toPersianNumber(date.getFullYear());
  return `${day} ${month} ${year}`;
};

// Format time in Persian
export const formatPersianTime = (date: Date): string => {
  const hours = toPersianNumber(date.getHours().toString().padStart(2, '0'));
  const minutes = toPersianNumber(date.getMinutes().toString().padStart(2, '0'));
  return `${hours}:${minutes}`;
};

// Format full date and time in Persian
export const formatPersianDateTime = (date: Date): string => {
  const dayName = persianDays[date.getDay()];
  const formattedDate = formatPersianDate(date);
  const formattedTime = formatPersianTime(date);
  return `${dayName}، ${formattedDate} - ${formattedTime}`;
};

// Format currency in Persian
export const formatPersianCurrency = (amount: number, currency: string = 'تومان'): string => {
  const formatted = new Intl.NumberFormat('fa-IR').format(amount);
  return `${formatted} ${currency}`;
};

// Format currency with Rial support
export const formatIranianCurrency = (amount: number, showRial: boolean = false): string => {
  if (showRial) {
    // Convert Toman to Rial (1 Toman = 10 Rial)
    const rialAmount = amount * 10;
    return formatPersianCurrency(rialAmount, 'ریال');
  }
  return formatPersianCurrency(amount, 'تومان');
};

// Format price range
export const formatPriceRange = (minPrice: number, maxPrice: number, currency: string = 'تومان'): string => {
  if (minPrice === maxPrice) {
    return formatPersianCurrency(minPrice, currency);
  }
  return `${formatPersianCurrency(minPrice, currency)} - ${formatPersianCurrency(maxPrice, currency)}`;
};

// Format discount percentage
export const formatDiscountPercent = (originalPrice: number, discountPrice: number): string => {
  const discountPercent = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  return `${toPersianNumber(discountPercent)}% تخفیف`;
};

// Format number in Persian
export const formatPersianNumber = (num: number): string => {
  return new Intl.NumberFormat('fa-IR').format(num);
};

// Status translations
export const statusTranslations = {
  pending: 'در انتظار',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
  processing: 'در حال پردازش',
  delivered: 'تحویل داده شده',
  refunded: 'بازپرداخت شده',
  active: 'فعال',
  inactive: 'غیرفعال',
  draft: 'پیش‌نویس',
  published: 'منتشر شده',
  user: 'کاربر',
  admin: 'مدیر',
  super_admin: 'مدیر ارشد'
};

// Get Persian status
export const getPersianStatus = (status: string): string => {
  return statusTranslations[status as keyof typeof statusTranslations] || status;
};

// Relative time in Persian
export const getRelativeTime = (date: Date | string | null): string => {
  if (!date) return 'نامعلوم';
  
  // تبدیل رشته به Date object
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // بررسی معتبر بودن تاریخ
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'تاریخ نامعتبر';
  }
  
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'همین الان';
  } else if (diffInMinutes < 60) {
    return `${toPersianNumber(diffInMinutes)} دقیقه پیش`;
  } else if (diffInMinutes < 1440) { // 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${toPersianNumber(hours)} ساعت پیش`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    if (days === 1) {
      return 'دیروز';
    } else if (days < 7) {
      return `${toPersianNumber(days)} روز پیش`;
    } else {
      return formatPersianDate(dateObj);
    }
  }
};

// Truncate Persian text
export const truncatePersianText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export default {
  toPersianNumber,
  toEnglishNumber,
  formatPersianDate,
  formatPersianTime,
  formatPersianDateTime,
  formatPersianCurrency,
  formatIranianCurrency,
  formatPriceRange,
  formatDiscountPercent,
  formatPersianNumber,
  getPersianStatus,
  getRelativeTime,
  truncatePersianText
};