import React from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { formatPriceFa, digitsFa } from '../../lib/fmt';
import { apiClient } from '../../lib/api';
import CartItem from './CartItem';

const CartDrawer: React.FC = () => {
  const { state, closeCart, clearCart, subtotal, totalItems } = useCart();
  const { user, openAuthModal } = useAuth();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // قفل اسکرول بدنه هنگام باز بودن
  useLockBodyScroll(state.isOpen);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeCart();
    }
  };

  const handleSubmitOrder = async () => {
    if (!user) {
      closeCart();
      openAuthModal('login');
      return;
    }

    if (state.items.length === 0) return;

    setIsProcessing(true);
    try {
      const orderData = {
        items: state.items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: subtotal()
      };

      await apiClient.createOrder(orderData);
      clearCart();
      setSuccessMessage('سفارش شما با موفقیت ثبت شد!');
      
      // Close success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        closeCart();
      }, 3000);
      
    } catch (error) {
      console.error('Failed to create order:', error);
      // You might want to show an error message here
    } finally {
      setIsProcessing(false);
    }
  };

  if (!state.isOpen) return null;

  const ui = (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      onKeyDown={handleKeyDown}
      // Remove these - they were preventing overlay clicks
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/35"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md sm:max-w-lg">
        <div 
          className="h-full bg-white/60 backdrop-blur-xl border-l border-black/10 shadow-2xl rounded-l-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-black/10">
            <h2 id="cart-title" className="text-xl font-bold text-gray-900">
              سبد خرید
              {totalItems() > 0 && (
                <span className="mr-2 inline-flex items-center justify-center w-6 h-6 text-xs bg-gradient-to-r from-amber-400 to-rose-400 text-white rounded-full">
                  {digitsFa(totalItems())}
                </span>
              )}
            </h2>
            
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); closeCart(); }}
              className="w-8 h-8 rounded-full bg-white/70 hover:bg-white/90 flex items-center justify-center transition-colors"
              aria-label="بستن سبد خرید"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 text-sm text-center">{successMessage}</p>
            </div>
          )}

          {/* Content */}
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                سبد خرید خالی است
              </h3>
              <p className="text-gray-500 text-sm text-center">
                محصولات مورد علاقه خود را به سبد اضافه کنید
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {state.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Footer Summary */}
              <div className="border-t border-black/10 p-6 bg-white/40 backdrop-blur-sm">
                <div className="space-y-3">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">جمع جزء:</span>
                    <span className="font-semibold text-gray-900">
                      {formatPriceFa(subtotal())}
                    </span>
                  </div>

                  {/* Shipping (optional - you can add logic for this) */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">هزینه ارسال:</span>
                    <span className="text-gray-600">رایگان</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">مجموع:</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                      {formatPriceFa(subtotal())}
                    </span>
                  </div>

                  {/* Submit Order Button */}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSubmitOrder(); }}
                    disabled={isProcessing || state.items.length === 0}
                    className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'در حال ثبت سفارش...' : 'ثبت سفارش'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(ui, document.body);
};

export default CartDrawer;