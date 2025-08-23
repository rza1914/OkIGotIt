import React from 'react';
import { ShoppingBag, User } from 'lucide-react';
import { getPersianDate } from '../lib/date';

const Header: React.FC = () => {
  const todayDate = getPersianDate();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Date Badge */}
          <div className="bg-gradient-to-r from-rose-100 to-amber-100 px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-gray-700">{todayDate}</span>
          </div>

          {/* Logo */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              آی‌شاپ
            </h1>
          </div>

          {/* Cart and User Icons */}
          <div className="flex items-center space-x-reverse space-x-4">
            <button className="p-2 text-gray-600 hover:text-rose-500 transition-colors">
              <ShoppingBag size={24} />
            </button>
            <button className="p-2 text-gray-600 hover:text-rose-500 transition-colors">
              <User size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
