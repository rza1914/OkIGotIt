// Persian/Farsi date utilities
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
  'مرداد', 'شهریور', 'مهر', 'آبان',
  'آذر', 'دی', 'بهمن', 'اسفند'
];

const persianDaysOfWeek = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه',
  'پنج‌شنبه', 'جمعه', 'شنبه'
];

// Convert English digits to Persian
export const toPersianDigits = (str: string): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const englishDigits = '0123456789';
  
  return str.replace(/[0-9]/g, (char) => {
    const index = englishDigits.indexOf(char);
    return persianDigits[index];
  });
};

// Convert Persian/Arabic digits to English
export const toEnglishDigits = (str: string): string => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  const englishDigits = '0123456789';
  
  return str.replace(/[۰-۹٠-٩]/g, (char) => {
    let index = persianDigits.indexOf(char);
    if (index === -1) {
      index = arabicDigits.indexOf(char);
    }
    return index !== -1 ? englishDigits[index] : char;
  });
};

// Simple Gregorian to Persian date conversion (approximate)
export const getPersianDate = (date: Date = new Date()): string => {
  // This is a simplified conversion - for production, use a proper library like moment-jalaali
  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth();
  const gregorianDay = date.getDate();
  const dayOfWeek = date.getDay();
  
  // Approximate Persian year (this is not accurate for all dates)
  const persianYear = gregorianYear - 621;
  
  // Approximate Persian month and day (simplified)
  let persianMonth = gregorianMonth;
  let persianDay = gregorianDay;
  
  // Adjust for Persian calendar (very simplified)
  if (gregorianMonth >= 3 && gregorianMonth <= 8) {
    persianMonth = gregorianMonth - 3;
    if (gregorianDay >= 21) {
      persianMonth += 1;
      persianDay = gregorianDay - 20;
    } else {
      persianDay = gregorianDay + 10;
    }
  } else {
    persianMonth = (gregorianMonth + 9) % 12;
    persianDay = gregorianDay;
  }
  
  const dayName = persianDaysOfWeek[dayOfWeek];
  const monthName = persianMonths[persianMonth];
  
  const persianDateStr = `${dayName} ${toPersianDigits(persianDay.toString())} ${monthName} ${toPersianDigits(persianYear.toString())}`;
  return persianDateStr;
};

// Format price with Persian digits and separators
export const formatPrice = (price: number, currency: string = 'IRT'): string => {
  const formatted = price.toLocaleString('fa-IR');
  const currencySymbol = currency === 'IRT' ? 'تومان' : currency === 'USD' ? '$' : currency;
  return `${formatted} ${currencySymbol}`;
};
