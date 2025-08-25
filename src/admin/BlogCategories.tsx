import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, FolderOpen, BarChart3, 
  Search, X, Save, Folder
} from 'lucide-react';
import { formatPersianNumber, getRelativeTime } from '../utils/persian';

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  posts_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CategoryFormData {
  id?: number;
  name: string;
  slug: string;
  description: string;
  parent_id?: number;
  is_active: boolean;
}

interface BlogCategoriesProps {
  onClose: () => void;
}

const BlogCategories: React.FC<BlogCategoriesProps> = ({ onClose }) => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    is_active: true
  });
  const [saving, setSaving] = useState(false);

  // Mock data - in real implementation, fetch from API
  useEffect(() => {
    const mockCategories: BlogCategory[] = [
      {
        id: 1,
        name: 'محصولات',
        slug: 'products',
        description: 'مقالات مربوط به محصولات فروشگاه',
        posts_count: 15,
        is_active: true,
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z'
      },
      {
        id: 2,
        name: 'آموزش',
        slug: 'tutorials',
        description: 'راهنماها و آموزش‌های کاربردی',
        posts_count: 8,
        is_active: true,
        created_at: '2024-01-05T14:20:00Z',
        updated_at: '2024-01-18T09:15:00Z'
      },
      {
        id: 3,
        name: 'تکنولوژی',
        slug: 'technology',
        description: 'مقالات فناوری و نوآوری',
        posts_count: 5,
        is_active: true,
        created_at: '2024-01-10T11:45:00Z',
        updated_at: '2024-01-22T16:20:00Z'
      },
      {
        id: 4,
        name: 'اخبار',
        slug: 'news',
        description: 'آخرین اخبار و اطلاعیه‌ها',
        posts_count: 12,
        is_active: true,
        created_at: '2024-01-15T08:30:00Z',
        updated_at: '2024-01-21T12:10:00Z'
      },
      {
        id: 5,
        name: 'مراجعات',
        slug: 'reviews',
        description: 'بررسی و نقد محصولات',
        parent_id: 1,
        posts_count: 3,
        is_active: false,
        created_at: '2024-01-20T10:15:00Z',
        updated_at: '2024-01-23T14:45:00Z'
      }
    ];

    setCategories(mockCategories);
    setLoading(false);
  }, []);

  const handleFormChange = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name' && value) {
      const slug = value
        .toLowerCase()
        .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id
          ? {
              ...cat,
              ...formData,
              updated_at: new Date().toISOString()
            }
          : cat
      ));
    } else {
      // Create new category
      const newCategory: BlogCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        ...formData,
        posts_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCategories(prev => [newCategory, ...prev]);
    }

    setSaving(false);
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      is_active: true
    });
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id,
      is_active: category.is_active
    });
    setShowForm(true);
  };

  const handleDelete = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    if (category.posts_count > 0) {
      if (!confirm(`این دسته‌بندی دارای ${formatPersianNumber(category.posts_count)} مقاله است. آیا از حذف اطمینان دارید؟`)) {
        return;
      }
    }

    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const handleToggleStatus = (categoryId: number) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, is_active: !cat.is_active, updated_at: new Date().toISOString() }
        : cat
    ));
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const parentCategories = categories.filter(cat => !cat.parent_id);
  const getSubCategories = (parentId: number) => 
    categories.filter(cat => cat.parent_id === parentId);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری دسته‌بندی‌ها...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">مدیریت دسته‌بندی‌ها</h2>
          <div className="flex items-center space-x-reverse space-x-3">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 ml-2" />
              دسته‌بندی جدید
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!showForm ? (
            <div className="p-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="جستجو در دسته‌بندی‌ها..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pr-10"
                  />
                </div>
              </div>

              {/* Categories Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        نام دسته‌بندی
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        نشانی
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تعداد مقالات
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        وضعیت
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاریخ ایجاد
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {category.parent_id ? (
                              <div className="flex items-center mr-4">
                                <div className="border-l-2 border-gray-300 h-4 mr-2"></div>
                                <div className="border-b-2 border-gray-300 w-4"></div>
                              </div>
                            ) : (
                              <FolderOpen className="w-5 h-5 text-rose-500 ml-2" />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {category.name}
                              </div>
                              {category.description && (
                                <div className="text-sm text-gray-500">
                                  {category.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {category.slug}
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <BarChart3 className="w-4 h-4 ml-1 text-gray-400" />
                            {formatPersianNumber(category.posts_count)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(category.id)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              category.is_active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {category.is_active ? 'فعال' : 'غیرفعال'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getRelativeTime(new Date(category.created_at))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-reverse space-x-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="ویرایش"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm ? 'دسته‌بندی مورد نظر یافت نشد' : 'هنوز دسته‌بندی ایجاد نشده'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Category Form */
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}
                </h3>
                <p className="text-gray-600">اطلاعات دسته‌بندی را وارد کنید</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام دسته‌بندی *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="input-field"
                      placeholder="مثال: محصولات"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نشانی (Slug) *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleFormChange('slug', e.target.value)}
                      className="input-field"
                      placeholder="products"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={3}
                    className="input-field"
                    placeholder="توضیح مختصری از این دسته‌بندی..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی والد
                  </label>
                  <select
                    value={formData.parent_id || ''}
                    onChange={(e) => handleFormChange('parent_id', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="input-field"
                  >
                    <option value="">دسته‌بندی اصلی</option>
                    {parentCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleFormChange('is_active', e.target.checked)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="mr-2 block text-sm text-gray-900">
                    دسته‌بندی فعال باشد
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-reverse space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCategory(null);
                      setFormData({
                        name: '',
                        slug: '',
                        description: '',
                        is_active: true
                      });
                    }}
                    className="btn-secondary"
                  >
                    لغو
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    {saving ? 'در حال ذخیره...' : editingCategory ? 'بروزرسانی' : 'ایجاد'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCategories;