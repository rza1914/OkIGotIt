export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

export const digitsFa = (num: number | string): string => {
  return num.toString().replace(/[0-9]/g, (w) => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return farsiDigits[parseInt(w)];
  });
};

export const formatPriceFa = (price: number): string => {
  return digitsFa(new Intl.NumberFormat('fa-IR').format(price)) + ' تومان';
};