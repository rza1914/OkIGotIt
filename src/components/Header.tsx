import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { digitsFa } from '../lib/fmt';
import UserMenu from './UserMenu';
import SearchBar from './search/SearchBar';

const Header: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const { openCart, totalItems } = useCart();

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openCart();
  };
  

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Right Side: Logo + Search */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="/logo-iShop.png" 
                alt="آی‌شاپ" 
                className="h-12 w-12 object-contain"
              />
            </Link>
            
            {/* SearchBar next to logo */}
            <div className="hidden sm:block">
              <SearchBar />
            </div>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center space-x-reverse space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-rose-600 font-medium transition-colors"
            >
              خانه
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-rose-600 font-medium transition-colors"
            >
              محصولات
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 hover:text-rose-600 font-medium transition-colors"
            >
              وبلاگ
            </Link>
          </nav>

          {/* Left Side: User Menu + Cart */}
          <div className="flex items-center space-x-reverse space-x-4">
            
            {/* Cart Button */}
            <button 
              onClick={handleCartClick}
              type="button"
              className="relative p-2 text-gray-600 hover:text-rose-500 transition-colors"
              aria-label="سبد خرید"
            >
              <ShoppingBag size={24} />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-gradient-to-r from-amber-400 to-rose-400 text-white rounded-full">
                  {digitsFa(totalItems())}
                </span>
              )}
            </button>
            
            {/* User Menu / Login Button */}
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

        {/* Mobile SearchBar */}
        <div className="sm:hidden pb-3 border-t border-gray-100 mt-3 pt-3">
          <SearchBar />
        </div>
        
      </div>
    </header>
  );
};

export default Header;
