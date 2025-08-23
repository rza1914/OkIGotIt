import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { apiClient, Banner } from '../lib/api';
import { formatPrice } from '../lib/date';

const BannerGrid: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const allBanners = await apiClient.getBanners();
        const smallBanners = allBanners
          .filter(b => b.key.startsWith('small') && b.active)
          .sort((a, b) => a.position - b.position);
        setBanners(smallBanners);
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          پیشنهادات ویژه
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="card group cursor-pointer">
              <div className="relative overflow-hidden">
                <img
                  src={banner.image_url}
                  alt={banner.title || 'بنر محصول'}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ویژه
                  </div>
                </div>
                {banner.link_url && (
                  <div className="absolute top-4 right-4">
                    <ExternalLink className="text-white bg-black/30 p-2 rounded-full" size={32} />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {banner.title && (
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{banner.title}</h3>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-rose-600">
                    {formatPrice(banner.price, banner.currency)}
                  </span>
                  <button className="btn-secondary">
                    مشاهده
                  </button>
                </div>
              </div>

              {banner.link_url && banner.link_url !== '#' && (
                <Link
                  to="/products"
                  className="absolute inset-0"
                  aria-label={banner.title || 'لینک محصول'}
                />
              )}
            </div>
          ))}
        </div>

        {banners.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">هیچ بنری موجود نیست</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BannerGrid;
