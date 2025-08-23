import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType, useCart } from '../../contexts/CartContext';
import { formatPriceFa } from '../../lib/fmt';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeItem, setQuantity } = useCart();
  
  const handleIncrease = () => {
    setQuantity(item.id, item.quantity + 1);
  };
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      setQuantity(item.id, item.quantity - 1);
    }
  };
  
  const handleRemove = () => {
    removeItem(item.id);
  };
  
  return (
    <div className="flex items-center gap-3 p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20">
      {/* Product Image */}
      <div className="w-16 h-16 flex-shrink-0">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
            <span className="text-xs">بدون تصویر</span>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate text-sm">
          {item.name}
        </h4>
        <p className="text-xs text-gray-600 mt-1">
          {formatPriceFa(item.price)}
        </p>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
          className="w-7 h-7 rounded-lg border border-gray-300 bg-white/70 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          aria-label="کم کردن تعداد"
        >
          <Minus className="w-3 h-3 text-gray-600" />
        </button>
        
        <span className="w-8 text-center text-sm font-medium text-gray-900">
          {item.quantity}
        </span>
        
        <button
          onClick={handleIncrease}
          className="w-7 h-7 rounded-lg border border-gray-300 bg-white/70 hover:bg-white/90 flex items-center justify-center transition-colors"
          aria-label="زیاد کردن تعداد"
        >
          <Plus className="w-3 h-3 text-gray-600" />
        </button>
      </div>
      
      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
        aria-label="حذف از سبد خرید"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
};

export default CartItem;