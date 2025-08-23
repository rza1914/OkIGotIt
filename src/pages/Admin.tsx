import React, { useState, useEffect } from 'react';
import { Save, LogOut, Edit, Eye, EyeOff } from 'lucide-react';
import { apiClient, Banner } from '../lib/api';
import { formatPrice } from '../lib/date';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      setIsAuthenticated(true);
      fetchBanners();
    }
  }, []);

  const fetchBanners = async () => {
    try {
      const fetchedBanners = await apiClient.getBanners();
      setBanners(fetchedBanners.sort((a, b) => {
        // Sort hero first, then small1-4
        if (a.key === 'hero') return -1;
        if (b.key === 'hero') return 1;
        return a.position - b.position;
      }));
    } catch (error) {
      showMessage('error', 'خطا در دریافت بنرها');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.login({ username, password });
      setIsAuthenticated(true);
      await fetchBanners();
      showMessage('success', 'ورود موفق');
    } catch (error) {
      showMessage('error', 'نام کاربری یا رمز عبور اشتباه است');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiClient.clearToken();
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setBanners([]);
    setEditingBanner(null);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner({ ...banner });
  };

  const handleSaveBanner = async () => {
    if (!editingBanner) return;

    setLoading(true);
    try {
      const updated = await apiClient.updateBanner(editingBanner.key, {
        title: editingBanner.title,
        image_url: editingBanner.image_url,
        link_url: editingBanner.link_url,
        price: editingBanner.price,
        currency: editingBanner.currency,
        active: editingBanner.active,
      });

      setBanners(prev => 
        prev.map(banner => 
          banner.key === editingBanner.key ? updated : banner
        )
      );
      
      setEditingBanner(null);
      showMessage('success', 'بنر با موفقیت به‌روزرسانی شد');
    } catch (error) {
      showMessage('error', 'خطا در به‌روزرسانی بنر');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleInputChange = (field: keyof Banner, value: any) => {
    if (!editingBanner) return;
    setEditingBanner(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              پنل مدیریت
            </h1>
            <p className="text-gray-600 mt-2">ورود به داشبورد ادمین</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام کاربری
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">پنل مدیریت بنرها</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-reverse space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Banners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="card">
              <div className="relative">
                <img
                  src={banner.image_url}
                  alt={banner.title || `Banner ${banner.key}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    banner.key === 'hero' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {banner.key === 'hero' ? 'بنر اصلی' : `بنر ${banner.key.replace('small', '')}`}
                  </span>
                </div>
                <div className="absolute top-2 left-2">
                  <div className={`p-1 rounded-full ${
                    banner.active ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {banner.active ? <Eye size={16} className="text-white" /> : <EyeOff size={16} className="text-white" />}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {banner.title || 'بدون عنوان'}
                </h3>
                <p className="text-xl font-bold text-rose-600 mb-3">
                  {formatPrice(banner.price, banner.currency)}
                </p>
                <button
                  onClick={() => handleEditBanner(banner)}
                  className="btn-secondary w-full flex items-center justify-center space-x-reverse space-x-2"
                >
                  <Edit size={16} />
                  <span>ویرایش</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingBanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  ویرایش بنر {editingBanner.key === 'hero' ? 'اصلی' : editingBanner.key.replace('small', '')}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان
                    </label>
                    <input
                      type="text"
                      value={editingBanner.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL تصویر
                    </label>
                    <input
                      type="url"
                      value={editingBanner.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      لینک (اختیاری)
                    </label>
                    <input
                      type="url"
                      value={editingBanner.link_url || ''}
                      onChange={(e) => handleInputChange('link_url', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        قیمت
                      </label>
                      <input
                        type="number"
                        value={editingBanner.price}
                        onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        واحد پول
                      </label>
                      <select
                        value={editingBanner.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="input-field"
                      >
                        <option value="IRT">تومان</option>
                        <option value="USD">دلار</option>
                        <option value="AED">درهم</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingBanner.active}
                      onChange={(e) => handleInputChange('active', e.target.checked)}
                      className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
                    />
                    <label className="mr-2 text-sm font-medium text-gray-700">
                      فعال
                    </label>
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      پیش‌نمایش
                    </label>
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={editingBanner.image_url}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-reverse space-x-4 mt-6">
                  <button
                    onClick={() => setEditingBanner(null)}
                    className="btn-secondary flex-1"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleSaveBanner}
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center space-x-reverse space-x-2"
                  >
                    <Save size={16} />
                    <span>{loading ? 'در حال ذخیره...' : 'ذخیره'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
