import React from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { getPersianDate } from '../lib/date';

const BlogPreview: React.FC = () => {
  // Sample blog posts for preview
  const blogPosts = [
    {
      id: 1,
      title: 'راهنمای خرید از دبی',
      excerpt: 'همه چیزهایی که باید درباره خرید از دبی بدانید و نکاتی برای یک خرید موفق',
      image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: getPersianDate(new Date(Date.now() - 86400000)),
    },
    {
      id: 2,
      title: 'ترندهای مد ۲۰۲۴',
      excerpt: 'آخرین ترندهای مد و فشن که در سال ۲۰۲۴ باید در کمد خود داشته باشید',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: getPersianDate(new Date(Date.now() - 172800000)),
    },
    {
      id: 3,
      title: 'نگهداری از محصولات طلایی',
      excerpt: 'چگونه از جواهرات و اکسسوری‌های طلایی خود مراقبت کنید تا همیشه درخشان باشند',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: getPersianDate(new Date(Date.now() - 259200000)),
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            مجله آی‌شاپ
          </h2>
          <p className="text-lg text-gray-600">
            مطالب مفید و به‌روز درباره مد، خرید و سبک زندگی
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="card group cursor-pointer">
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-reverse space-x-2">
                    <Calendar size={14} className="text-gray-600" />
                    <span className="text-sm text-gray-600">{post.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-rose-600 font-semibold group-hover:text-rose-700 transition-colors">
                    ادامه مطلب
                  </span>
                  <ArrowLeft size={18} className="text-rose-600 group-hover:text-rose-700 transition-colors group-hover:-translate-x-1 duration-300" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-secondary">
            مشاهده تمام مطالب
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
