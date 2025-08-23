import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { digitsFa } from '../lib/fmt';

const HeaderCartButton: React.FC = () => {
  const { openCart, totalItems } = useCart();

  return (
    <button
      type="button"
      aria-label="سبد خرید"
      className="relative p-2 text-gray-600 hover:text-rose-500 transition-colors"
      // جلوگیری از ناوبری قبل از Bubble (برای موبایل/سافاری مهم است)
      onMouseDown={(e) => { 
        e.preventDefault(); 
        e.stopPropagation(); 
      }}
      onTouchStart={(e) => { 
        e.preventDefault(); 
        e.stopPropagation(); 
      }}
      // کلیک اصلی
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openCart();
      }}
      data-cart-button
    >
      <ShoppingBag size={24} />
      {totalItems() > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-gradient-to-r from-amber-400 to-rose-400 text-white rounded-full">
          {digitsFa(totalItems())}
        </span>
      )}
    </button>
  );
};

export default HeaderCartButton;