import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, User, Phone, Mail, ShoppingCart, ArrowRight } from 'lucide-react';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  product_price: number;
  product_image_url: string;
  total_price: number;
}

interface CartData {
  items: CartItem[];
  total_quantity: number;
  total_amount: number;
  currency: string;
}

interface OrderForm {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: string;
  customer_notes: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<OrderForm>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    payment_method: 'cash_on_delivery',
    customer_notes: ''
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('برای ادامه باید وارد شوید');
          navigate('/login');
          return;
        }

        const response = await fetch('/api/v1/cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('خطا در بارگذاری سبد خرید');
        }

        const data = await response.json();
        if (data.items.length === 0) {
          alert('سبد خرید شما خالی است');
          navigate('/products');
          return;
        }

        setCart(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در بارگذاری سبد خرید');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart) return;
    
    // Validate form
    if (!form.customer_name || !form.customer_email || !form.shipping_address) {
      alert('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      
      const orderData = {
        items: cart.items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.product_price
        })),
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        shipping_address: form.shipping_address,
        payment_method: form.payment_method,
        customer_notes: form.customer_notes
      };

      const response = await fetch('/api/v1/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'خطا در ثبت سفارش');
      }

      const order = await response.json();
      
      // Clear cart after successful order
      await fetch('/api/v1/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      alert(`سفارش شما با موفقیت ثبت شد! شماره سفارش: ${order.order_number}`);
      navigate('/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطا در ثبت سفارش');
    } finally {
      setCreating(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <button 
            onClick={() => navigate('/products')} 
            className="text-blue-600 hover:text-blue-800"
          >
            بازگشت به فروشگاه
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" dir="rtl">
            تسویه حساب
          </h1>
          <p className="text-gray-600 mt-2" dir="rtl">
            اطلاعات ارسال و پرداخت خود را وارد کنید
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Order Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 ml-2" />
                  اطلاعات شخصی
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={form.customer_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="نام کامل خود را وارد کنید"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ایمیل *
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      value={form.customer_email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شماره تلفن
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={form.customer_phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="09123456789"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 ml-2" />
                  آدرس ارسال
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    آدرس کامل *
                  </label>
                  <textarea
                    name="shipping_address"
                    value={form.shipping_address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="آدرس کامل شامل شهر، خیابان، پلاک و کد پستی"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 ml-2" />
                  روش پرداخت
                </h2>
                
                <div>
                  <select
                    name="payment_method"
                    value={form.payment_method}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cash_on_delivery">پرداخت در محل</option>
                    <option value="bank_transfer">حواله بانکی</option>
                    <option value="credit_card">کارت اعتباری</option>
                  </select>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  توضیحات سفارش
                </h2>
                
                <div>
                  <textarea
                    name="customer_notes"
                    value={form.customer_notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="توضیحات اضافی درباره سفارش (اختیاری)"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium text-lg"
              >
                {creating ? 'در حال ثبت سفارش...' : 'ثبت سفارش'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8" dir="rtl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 ml-2" />
                خلاصه سفارش
              </h2>
              
              {cart && (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 space-x-reverse">
                        <img
                          src={item.product_image_url}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {item.product_name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            تعداد: {item.quantity}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.total_price)} تومان
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">جمع کل کالاها:</span>
                      <span className="font-semibold">
                        {formatPrice(cart.total_amount)} تومان
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">هزینه ارسال:</span>
                      <span className="font-semibold">
                        {formatPrice(150000)} تومان
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                      <span>مبلغ قابل پرداخت:</span>
                      <span className="text-blue-600">
                        {formatPrice(cart.total_amount + 150000)} تومان
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;