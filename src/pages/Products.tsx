import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Products: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent mb-8">
            محصولات
          </h1>
          <p className="text-xl text-gray-600">
            صفحه محصولات به‌زودی در دسترس خواهد بود
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;