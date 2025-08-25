// Iranian/Persian-specific validation utilities

// Iranian mobile operators
const IRANIAN_MOBILE_OPERATORS = {
  'hamrah-e avval': ['0901', '0902', '0903', '0905', '0930', '0933', '0935', '0936', '0937', '0938', '0939'],
  'irancell': ['0901', '0902', '0903', '0905', '0930', '0933', '0934', '0935', '0936', '0937', '0938', '0939'],
  'rightel': ['0920', '0921', '0922'],
  'mtnirancel': ['0934'],
  'tkt': ['0932'],
  'saman': ['099'],
  'aptel': ['099'],
  'samantel': ['099']
};

// Iranian provinces with cities
export const IRANIAN_PROVINCES = {
  'آذربایجان شرقی': ['تبریز', 'مراغه', 'میانه', 'مرند', 'شبستر', 'اهر', 'بناب', 'کلیبر', 'هریس', 'سراب'],
  'آذربایجان غربی': ['ارومیه', 'خوی', 'مهاباد', 'بوکان', 'میاندوآب', 'نقده', 'سلماس', 'پیرانشهر', 'تکاب', 'شاهین‌دژ'],
  'اردبیل': ['اردبیل', 'پارس‌آباد', 'خلخال', 'مشگین‌شهر', 'گرمی', 'نیر', 'نمین', 'کوثر', 'بیله‌سوار'],
  'اصفهان': ['اصفهان', 'کاشان', 'خمینی‌شهر', 'نجف‌آباد', 'شاهین‌شهر', 'فولادشهر', 'مبارکه', 'نطنز', 'آران و بیدگل', 'گلپایگان'],
  'البرز': ['کرج', 'نظرآباد', 'ساوجبلاغ', 'طالقان', 'اشتهارد', 'محمدشهر', 'هشتگرد', 'فردیس', 'ماهدشت'],
  'ایلام': ['ایلام', 'دهلران', 'آبدانان', 'مهران', 'ایوان', 'دره‌شهر', 'شیروان و چرداول', 'ملکشاهی'],
  'بوشهر': ['بوشهر', 'برازجان', 'گناوه', 'کنگان', 'عسلویه', 'دیلم', 'جم', 'خارک', 'دشتی'],
  'تهران': ['تهران', 'اسلامشهر', 'کرج', 'ورامین', 'قدس', 'ری', 'شهریار', 'ملارد', 'رباط‌کریم', 'بهارستان'],
  'چهارمحال و بختیاری': ['شهرکرد', 'فارسان', 'لردگان', 'بروجن', 'اردل', 'کوهرنگ'],
  'خراسان جنوبی': ['بیرجند', 'قائن', 'فردوس', 'طبس', 'نهبندان', 'سرایان', 'بشرویه', 'درمیان'],
  'خراسان رضوی': ['مشهد', 'نیشابور', 'سبزوار', 'قوچان', 'کاشمر', 'تربت حیدریه', 'تربت جام', 'چناران', 'درگز', 'کلات'],
  'خراسان شمالی': ['بجنورد', 'اسفراین', 'شیروان', 'فاروج', 'جاجرم', 'راز و جرگلان', 'مانه و سملقان'],
  'خوزستان': ['اهواز', 'آبادان', 'خرمشهر', 'دزفول', 'بهبهان', 'ماهشهر', 'اندیمشک', 'شوشتر', 'ایذه', 'رامهرمز'],
  'زنجان': ['زنجان', 'ابهر', 'خدابنده', 'طارم', 'ماهنشان', 'سلطانیه', 'ایجرود', 'خرمدره'],
  'سمنان': ['سمنان', 'شاهرود', 'گرمسار', 'دامغان', 'مهدیشهر', 'سرخه', 'میامی', 'آرادان'],
  'سیستان و بلوچستان': ['زاهدان', 'زابل', 'چابهار', 'ایرانشهر', 'خاش', 'سراوان', 'نیک‌شهر', 'کنارک', 'سرباز'],
  'فارس': ['شیراز', 'کازرون', 'مرودشت', 'جهرم', 'فسا', 'داراب', 'لار', 'فیروزآباد', 'ممسنی', 'لامرد'],
  'قزوین': ['قزوین', 'البرز', 'تاکستان', 'آوج', 'بوئین‌زهرا', 'آبیک'],
  'قم': ['قم'],
  'کردستان': ['سنندج', 'مریوان', 'بانه', 'سقز', 'دیواندره', 'بیجار', 'قروه', 'کامیاران'],
  'کرمان': ['کرمان', 'رفسنجان', 'سیرجان', 'شهربابک', 'زرند', 'بم', 'جیرفت', 'کهنوج', 'رودبار جنوب'],
  'کرمانشاه': ['کرمانشاه', 'پاوه', 'اسلام‌آباد غرب', 'کنگاور', 'سنقر', 'صحنه', 'هرسین', 'جوانرود'],
  'کهگیلویه و بویراحمد': ['یاسوج', 'دوگنبدان', 'دنا', 'مارگون', 'کهگیلویه', 'چرام', 'لنده'],
  'گلستان': ['گرگان', 'گنبد کاووس', 'علی‌آباد کتول', 'آق‌قلا', 'بندر ترکمن', 'کردکوی', 'آزادشهر', 'رامیان', 'کلاله'],
  'گیلان': ['رشت', 'انزلی', 'لاهیجان', 'لنگرود', 'رودسر', 'تالش', 'فومن', 'صومعه‌سرا', 'ماسال'],
  'لرستان': ['خرم‌آباد', 'بروجرد', 'دورود', 'الیگودرز', 'نورآباد', 'کوهدشت', 'پلدختر', 'ازنا'],
  'مازندران': ['ساری', 'بابل', 'آمل', 'قائم‌شهر', 'بهشهر', 'نوشهر', 'چالوس', 'رامسر', 'تنکابن', 'فریدونکنار'],
  'مرکزی': ['اراک', 'خمین', 'ساوه', 'شازند', 'تفرش', 'دلیجان', 'محلات', 'کمیجان'],
  'هرمزگان': ['بندرعباس', 'بندر لنگه', 'میناب', 'قشم', 'کیش', 'پارسیان', 'بستک', 'حاجی‌آباد', 'رودان'],
  'همدان': ['همدان', 'ملایر', 'نهاوند', 'تویسرکان', 'اسدآباد', 'کبودرآهنگ', 'رزن', 'فامنین'],
  'یزد': ['یزد', 'اردکان', 'میبد', 'بافق', 'ابرکوه', 'مهریز', 'تفت', 'اشکذر', 'خاتم']
};

// Validate Iranian National ID (کد ملی)
export const validateNationalId = (nationalId: string): boolean => {
  // Remove any non-digit characters
  const cleanId = nationalId.replace(/\D/g, '');
  
  // Must be exactly 10 digits
  if (cleanId.length !== 10) return false;
  
  // Check for invalid patterns
  if (/^(\d)\1{9}$/.test(cleanId)) return false; // All same digits
  
  // Calculate checksum
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanId[i]) * (10 - i);
  }
  
  const remainder = sum % 11;
  const checkDigit = parseInt(cleanId[9]);
  
  if (remainder < 2) {
    return checkDigit === remainder;
  } else {
    return checkDigit === 11 - remainder;
  }
};

// Validate Iranian mobile phone number
export const validateIranianMobile = (phoneNumber: string): boolean => {
  // Remove any non-digit characters and normalize
  let cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Remove country code if present
  if (cleanPhone.startsWith('98')) {
    cleanPhone = cleanPhone.substring(2);
  }
  
  // Add leading zero if missing
  if (cleanPhone.length === 10 && !cleanPhone.startsWith('0')) {
    cleanPhone = '0' + cleanPhone;
  }
  
  // Must be 11 digits starting with 09
  if (cleanPhone.length !== 11 || !cleanPhone.startsWith('09')) {
    return false;
  }
  
  // Check against known operator prefixes
  const prefix = cleanPhone.substring(0, 4);
  const allPrefixes = Object.values(IRANIAN_MOBILE_OPERATORS).flat();
  
  return allPrefixes.some(operatorPrefix => 
    prefix.startsWith(operatorPrefix) || cleanPhone.startsWith(operatorPrefix)
  );
};

// Format Iranian mobile phone number
export const formatIranianMobile = (phoneNumber: string): string => {
  let cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Remove country code if present
  if (cleanPhone.startsWith('98')) {
    cleanPhone = cleanPhone.substring(2);
  }
  
  // Add leading zero if missing
  if (cleanPhone.length === 10 && !cleanPhone.startsWith('0')) {
    cleanPhone = '0' + cleanPhone;
  }
  
  // Format as 09XX XXX XXXX
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  return phoneNumber;
};

// Get mobile operator name
export const getMobileOperator = (phoneNumber: string): string | null => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const prefix = cleanPhone.substring(0, 4);
  
  for (const [operator, prefixes] of Object.entries(IRANIAN_MOBILE_OPERATORS)) {
    if (prefixes.some(p => prefix.startsWith(p))) {
      const operatorNames = {
        'hamrah-e avval': 'همراه اول',
        'irancell': 'ایرانسل',
        'rightel': 'رایتل',
        'mtnirancel': 'MTN ایرانسل',
        'tkt': 'TKT',
        'saman': 'سامان',
        'aptel': 'آپتل',
        'samantel': 'سامان تل'
      };
      return operatorNames[operator as keyof typeof operatorNames] || operator;
    }
  }
  
  return null;
};

// Validate Iranian postal code
export const validateIranianPostalCode = (postalCode: string): boolean => {
  const cleanCode = postalCode.replace(/\D/g, '');
  
  // Must be exactly 10 digits
  if (cleanCode.length !== 10) return false;
  
  // Should not be all same digits
  if (/^(\d)\1{9}$/.test(cleanCode)) return false;
  
  return true;
};

// Format Iranian postal code
export const formatIranianPostalCode = (postalCode: string): string => {
  const cleanCode = postalCode.replace(/\D/g, '');
  
  if (cleanCode.length === 10) {
    return cleanCode.replace(/(\d{5})(\d{5})/, '$1-$2');
  }
  
  return postalCode;
};

// Validate Persian name (only Persian characters and spaces)
export const validatePersianName = (name: string): boolean => {
  // Persian/Farsi Unicode range and common characters
  const persianRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/;
  return persianRegex.test(name.trim());
};

// Convert Persian/Arabic digits to English digits
export const persianToEnglishDigits = (str: string): string => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  let result = str;
  
  // Replace Persian digits
  persianNumbers.forEach((persian, index) => {
    result = result.replace(new RegExp(persian, 'g'), index.toString());
  });
  
  // Replace Arabic digits
  arabicNumbers.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, 'g'), index.toString());
  });
  
  return result;
};

// Validate Iranian IBAN
export const validateIranianIBAN = (iban: string): boolean => {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Iranian IBAN format: IR + 2 check digits + 22 digits
  if (!/^IR\d{24}$/.test(cleanIban)) return false;
  
  // Move first 4 characters to end and replace letters with numbers
  const rearranged = cleanIban.substring(4) + cleanIban.substring(0, 4);
  const numericString = rearranged.replace(/[A-Z]/g, (letter) => 
    (letter.charCodeAt(0) - 55).toString()
  );
  
  // Calculate mod 97
  let remainder = '';
  for (let i = 0; i < numericString.length; i++) {
    remainder += numericString[i];
    if (remainder.length >= 9) {
      remainder = (parseInt(remainder) % 97).toString();
    }
  }
  
  return parseInt(remainder) % 97 === 1;
};

// Get cities by province
export const getCitiesByProvince = (province: string): string[] => {
  return (IRANIAN_PROVINCES as Record<string, string[]>)[province] || [];
};

// Validate if city belongs to province
export const validateCityProvince = (city: string, province: string): boolean => {
  const cities = (IRANIAN_PROVINCES as Record<string, string[]>)[province];
  return cities ? cities.includes(city) : false;
};

// Iranian business/company registration number validation
export const validateIranianBusinessNumber = (businessNumber: string): boolean => {
  const cleanNumber = businessNumber.replace(/\D/g, '');
  
  // Iranian business registration numbers are typically 11 digits
  if (cleanNumber.length !== 11) return false;
  
  // Simple checksum validation (simplified)
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanNumber[i]) * (i + 2);
  }
  
  const remainder = sum % 11;
  const checkDigit = parseInt(cleanNumber[10]);
  
  return remainder === checkDigit;
};

// Age calculation based on Persian/Jalali date
export const calculatePersianAge = (persianBirthDate: string): number => {
  // This is a simplified calculation
  // In a real app, you'd use a proper Jalali date library
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Convert Persian year to approximate Gregorian (simplified)
  const birthYear = parseInt(persianBirthDate.split('/')[0]) + 621;
  
  return Math.max(0, currentYear - birthYear);
};

export default {
  validateNationalId,
  validateIranianMobile,
  formatIranianMobile,
  getMobileOperator,
  validateIranianPostalCode,
  formatIranianPostalCode,
  validatePersianName,
  persianToEnglishDigits,
  validateIranianIBAN,
  getCitiesByProvince,
  validateCityProvince,
  validateIranianBusinessNumber,
  calculatePersianAge,
  IRANIAN_PROVINCES
};