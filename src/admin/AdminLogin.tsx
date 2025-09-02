import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const { user, isLoading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: 'admin@site.com',
    password: 'Admin@123456'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated admin
  if (user && (user.role === 'admin' || user.role === 'super_admin')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Redirect non-admin users
  if (user && user.role !== 'admin' && user.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({
        identifier: formData.email,
        password: formData.password
      });
      
      // Check if user is admin before redirecting
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.role === 'admin' || currentUser.role === 'super_admin') {
        navigate('/admin/dashboard');
      } else {
        setError('دسترسی مجاز نیست. نیاز به اختیارات مدیریت.');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'ایمیل یا رمز عبور نامعتبر');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-rose-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-rose-400 to-amber-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white text-2xl font-bold">iS</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
            پنل مدیریت آیشاپ
          </h1>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            ورود به پنل ادمین
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            برای مدیریت فروشگاه خود وارد شوید
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 ml-3" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      خطای احراز هویت
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                ایمیل مدیر
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="input-field text-left"
                placeholder="ایمیل مدیر را وارد کنید"
                dir="ltr"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field text-left pl-10"
                  placeholder="رمز عبور را وارد کنید"
                  dir="ltr"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin ml-3 h-5 w-5 text-white" />
                    در حال ورود...
                  </>
                ) : (
                  'ورود به پنل مدیریت'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  فقط برای مدیران
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-rose-600 hover:text-rose-500 font-medium transition-colors"
            >
              ← بازگشت به سایت اصلی
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        <p>© ۱۴۰۳ پنل مدیریت آیشاپ. تمامی حقوق محفوظ است.</p>
      </div>
    </div>
  );
};

export default AdminLogin;