import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, Banner } from '../lib/api';
import { formatPrice } from '../lib/date';

const Hero: React.FC = () => {
  const [heroBanner, setHeroBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroBanner = async () => {
      try {
        const banners = await apiClient.getBanners();
        const hero = banners.find(b => b.key === 'hero' && b.active);
        setHeroBanner(hero || null);
      } catch (error) {
        console.error('Failed to fetch hero banner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroBanner();
  }, []);

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-rose-50 to-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-rose-50 to-amber-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Slogan */}
          <div className="text-center lg:text-right">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              با <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">#آی‌شــــــــــــــــاپ</span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8">
              هر چی که دلت بخاد رو میتونی با قیمت مناسب از{' '}
              <span className="font-semibold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                #دبــــــــــــی
              </span>{' '}
              خرید کنی و هر جا{' '}
              <span className="font-semibold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                #ایران
              </span>{' '}
              هستی تحویل بگیری
            </p>
            <Link to="/products" className="btn-primary text-lg px-8 py-4 inline-block">
              مشاهده محصولات
            </Link>
          </div>

          {/* Hero Banner */}
          <div className="relative">
            {heroBanner ? (
              <div className="card overflow-hidden">
                <img
                  src={heroBanner.image_url}
                  alt={heroBanner.title || 'Hero Banner'}
                  className="w-full h-96 object-cover"
                />
                {heroBanner.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">{heroBanner.title}</h3>
                    <p className="text-amber-300 text-xl font-semibold">
                      {formatPrice(heroBanner.price, heroBanner.currency)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="card h-96 flex items-center justify-center bg-gray-100">
                <p className="text-gray-500 text-lg">بنر اصلی موجود نیست</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
