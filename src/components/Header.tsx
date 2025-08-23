import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import { getPersianDate } from '../lib/date';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';

const Header: React.FC = () => {
  const todayDate = getPersianDate();
  const { user, openAuthModal } = useAuth();

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
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="/logo-iShop.png" 
                alt="آی‌شاپ" 
                className="h-12 w-12 object-contain"
              />
            </Link>
          </div>

          {/* Cart and User Actions */}
          <div className="flex items-center space-x-reverse space-x-4">
            <button className="p-2 text-gray-600 hover:text-rose-500 transition-colors">
              <ShoppingBag size={24} />
            </button>
            
            {user ? (
              <UserMenu />
            ) : (
              <button 
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-rose-500 transition-colors"
              >
                <User size={20} />
                <span className="text-sm font-medium">ورود/ثبت‌نام</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
