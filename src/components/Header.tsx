import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';
import SearchBar from './search/SearchBar';
import HeaderCartButton from './HeaderCartButton';

const Header: React.FC = () => {
  const { user, openAuthModal } = useAuth();

  

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
            
            {/* Cart Button - TEMPORARY DEBUG */}
            <button
              type="button"
              style={{ background: 'red', color: 'white', padding: '8px' }}
              onClick={(e) => {
                console.log('DEBUG: Direct cart click');
                e.preventDefault();
                e.stopPropagation();
                alert('Cart clicked - should not navigate!');
              }}
            >
              🛒 TEST
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
