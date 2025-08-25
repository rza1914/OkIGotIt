import React, { useState } from 'react';
import { X, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../lib/api';

interface AuthError {
  message: string;
  type: 'error' | 'success' | 'warning';
  action?: {
    label: string;
    onClick: () => void;
  };
}

const AuthModal: React.FC = () => {
  const { isAuthOpen, activeTab, setActiveTab, closeAuthModal, login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    first_name: '',
    last_name: '',
    email_or_phone: '',
    password: '',
    username: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      await login(loginForm);
      setLoginForm({ identifier: '', password: '' });
      setAuthError({
        message: 'ورود موفقیت‌آمیز بود!',
        type: 'success'
      });
    } catch (err: any) {
      const apiError = err as ApiError;
      console.error('Login error:', apiError);
      
      if (apiError.status === 401) {
        setAuthError({
          message: 'نام کاربری یا رمز عبور اشتباه است',
          type: 'error'
        });
      } else if (apiError.message?.includes('Network error')) {
        setAuthError({
          message: 'خطا در اتصال به سرور. لطفاً اتصال اینترنت را بررسی کنید',
          type: 'error'
        });
      } else {
        setAuthError({
          message: 'خطا در ورود. لطفاً دوباره تلاش کنید',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    // Client-side validation
    if (!registerForm.first_name || !registerForm.last_name || !registerForm.username || 
        !registerForm.email_or_phone || !registerForm.password) {
      setAuthError({
        message: 'لطفاً تمام فیلدها را پر کنید',
        type: 'error'
      });
      setLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setAuthError({
        message: 'رمز عبور باید حداقل ۶ کاراکتر باشد',
        type: 'error'
      });
      setLoading(false);
      return;
    }

    try {
      await register(registerForm);
      setRegisterForm({
        first_name: '',
        last_name: '',
        email_or_phone: '',
        password: '',
        username: '',
      });
      setAuthError({
        message: 'ثبت‌نام موفقیت‌آمیز بود! خوش آمدید!',
        type: 'success'
      });
    } catch (err: any) {
      const apiError = err as ApiError;
      console.error('Registration error:', apiError);
      
      if (apiError.message?.includes('already registered')) {
        setAuthError({
          message: 'این نام کاربری یا ایمیل قبلاً ثبت شده است',
          type: 'warning',
          action: {
            label: 'ورود به حساب',
            onClick: () => {
              setActiveTab('login');
              setAuthError(null);
            }
          }
        });
      } else if (apiError.status === 400) {
        setAuthError({
          message: 'اطلاعات وارد شده نامعتبر است. لطفاً بررسی کنید',
          type: 'error'
        });
      } else if (apiError.status === 422) {
        setAuthError({
          message: 'لطفاً تمام فیلدها را به درستی پر کنید',
          type: 'error'
        });
      } else if (apiError.message?.includes('Network error')) {
        setAuthError({
          message: 'خطا در اتصال به سرور. لطفاً اتصال اینترنت را بررسی کنید',
          type: 'error'
        });
      } else {
        setAuthError({
          message: 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeAuthModal();
    }
  };

  const handleTabSwitch = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setAuthError(null);
    setLoading(false);
  };

  if (!isAuthOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white/60 backdrop-blur-xl border border-black/10 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex gap-1">
            <button
              onClick={() => handleTabSwitch('login')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ورود
            </button>
            <button
              onClick={() => handleTabSwitch('register')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ثبت‌نام
            </button>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {authError && (
            <div className={`mb-4 p-3 rounded-lg text-sm flex items-start gap-2 ${
              authError.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
              authError.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
              'bg-yellow-50 border border-yellow-200 text-yellow-700'
            }`}>
              {authError.type === 'error' ? (
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              ) : authError.type === 'success' ? (
                <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div>{authError.message}</div>
                {authError.action && (
                  <button
                    onClick={authError.action.onClick}
                    className={`mt-2 text-xs px-3 py-1 rounded font-medium transition-colors ${
                      authError.type === 'warning' 
                        ? 'bg-yellow-200 hover:bg-yellow-300 text-yellow-800'
                        : 'bg-red-200 hover:bg-red-300 text-red-800'
                    }`}
                  >
                    {authError.action.label}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام کاربری یا ایمیل
                </label>
                <input
                  type="text"
                  value={loginForm.identifier}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, identifier: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'در حال ورود...' : 'ورود'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام
                  </label>
                  <input
                    type="text"
                    value={registerForm.first_name}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام خانوادگی
                  </label>
                  <input
                    type="text"
                    value={registerForm.last_name}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام کاربری
                </label>
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ایمیل یا شماره موبایل
                </label>
                <input
                  type="text"
                  value={registerForm.email_or_phone}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, email_or_phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;