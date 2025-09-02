import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  image_url: string;
  slug: string;
  stock: number;
  is_active: boolean;
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/products');
        if (!response.ok) {
          throw new Error('خطا در بارگذاری محصولات');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در بارگذاری محصولات');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
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
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:text-blue-800"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent mb-4">
          محصولات
        </h1>
        <p className="text-xl text-gray-600">
          مجموعه‌ای از بهترین محصولات برای شما
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div 
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="absolute top-4 left-4">
                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6" dir="rtl">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="mr-2 text-sm text-gray-500">(۴.۸)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500">تومان</span>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  {product.stock > 0 ? (
                    <span className="text-green-600 text-sm">موجود</span>
                  ) : (
                    <span className="text-red-600 text-sm">ناموجود</span>
                  )}
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick(product.id);
                }}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 ml-2" />
                مشاهده جزئیات
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">هیچ محصولی یافت نشد</p>
        </div>
      )}
    </div>
  );
};

export default Products;