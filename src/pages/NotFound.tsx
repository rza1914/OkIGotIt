import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent mb-8">
            ۴۰۴
          </h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            صفحه مورد نظر یافت نشد
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            متأسفانه صفحه‌ای که دنبال آن می‌گردید وجود ندارد
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;