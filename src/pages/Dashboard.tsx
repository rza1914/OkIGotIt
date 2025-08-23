import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, User as UserIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            سلام، {user.first_name} 👋
          </h1>
          <p className="text-gray-600">خوش آمدید به داشبورد شخصی خود</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orders Card */}
          <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-rose-100 to-amber-100 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-rose-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">سفارش‌های من</h2>
            </div>
            
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">هنوز سفارشی ثبت نکرده‌اید</p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                شروع خرید
              </button>
            </div>
          </div>

          {/* Account Info Card */}
          <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-rose-100 to-amber-100 rounded-lg">
                <UserIcon className="w-5 h-5 text-rose-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">اطلاعات حساب</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">نام و نام خانوادگی</label>
                <p className="text-gray-900">{user.first_name} {user.last_name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">نام کاربری</label>
                <p className="text-gray-900">{user.username}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">ایمیل</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-200/50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span>خروج از حساب</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm p-6 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent mb-1">
              0
            </div>
            <div className="text-sm text-gray-600">سفارش‌های ثبت شده</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm p-6 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent mb-1">
              0
            </div>
            <div className="text-sm text-gray-600">محصولات مورد علاقه</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm p-6 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent mb-1">
              0 ریال
            </div>
            <div className="text-sm text-gray-600">مجموع خریدها</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;