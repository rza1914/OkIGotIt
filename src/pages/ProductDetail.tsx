import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Star, Truck, Shield, Heart } from 'lucide-react';
import { apiClient, Product } from '../lib/api';

// Using Product interface from API client

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) throw new Error('شناسه محصول موجود نیست');
        const data = await apiClient.getProduct(parseInt(id));
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در بارگذاری محصول');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      const token = apiClient.getToken();
      if (!token) {
        alert('برای افزودن به سبد خرید باید وارد شوید');
        navigate('/login');
        return;
      }

      // Use relative URL for API proxy
      const response = await fetch('/api/v1/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'خطا در افزودن به سبد خرید');
      }

      alert('محصول به سبد خرید اضافه شد');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطا در افزودن به سبد خرید');
    } finally {
      setAddingToCart(false);
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
            بازگشت به فهرست محصولات
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">محصول یافت نشد</h1>
          <button
            onClick={() => navigate('/products')}
            className="text-blue-600 hover:text-blue-800"
          >
            بازگشت به فهرست محصولات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8" dir="rtl">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">
            خانه
          </button>
          <ArrowRight className="h-4 w-4" />
          <button onClick={() => navigate('/products')} className="hover:text-blue-600">
            محصولات
          </button>
          <ArrowRight className="h-4 w-4" />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="lg:flex">
            {/* Product Image */}
            <div className="lg:w-1/2">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-96 lg:h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 p-8" dir="rtl">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="mr-2 text-sm text-gray-600">(۴.۸ از ۵)</span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-gray-600 mr-2">تومان</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">
                    ✓ {product.stock} عدد در انبار موجود
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    ✗ موجود نیست
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تعداد:
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
                    >
                      -
                    </button>
                    <span className="bg-gray-100 text-gray-800 font-bold py-2 px-4">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 ml-2" />
                  {addingToCart ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
                </button>
                
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium flex items-center justify-center">
                  <Heart className="h-5 w-5 ml-2" />
                  علاقه‌مندی
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-green-600 ml-2" />
                    <span className="text-sm text-gray-600">ارسال رایگان</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 ml-2" />
                    <span className="text-sm text-gray-600">گارانتی اصالت</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" dir="rtl">
            محصولات مشابه
          </h2>
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-600">محصولات مشابه به زودی اضافه خواهند شد</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;