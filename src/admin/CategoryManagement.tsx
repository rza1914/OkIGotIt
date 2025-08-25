import React, { useState, useEffect } from 'react';
import { 
  FolderTree, Plus, Edit, Trash2, Eye, ChevronRight, ChevronDown,
  Move, Search, Filter, BarChart3, Tag, Package, Users,
  ArrowUp, ArrowDown, Copy, ExternalLink, Settings,
  AlertTriangle, CheckCircle, X, Save, RotateCcw
} from 'lucide-react';
import { 
  formatPersianNumber, formatPersianCurrency, getRelativeTime,
  formatPersianDateTime, toPersianNumber
} from '../utils/persian';
import PersianModal from './components/PersianModal';
import StatusBadge from './components/StatusBadge';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  level: number;
  sort_order: number;
  status: 'active' | 'inactive';
  image_url?: string;
  meta_title?: string;
  meta_description?: string;
  product_count: number;
  total_sales: number;
  created_at: string;
  updated_at: string;
  children: Category[];
}

interface CategoryFormData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
  image_url: string;
  meta_title: string;
  meta_description: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [draggedCategory, setDraggedCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parent_id: null,
    sort_order: 0,
    status: 'active',
    image_url: '',
    meta_title: '',
    meta_description: ''
  });

  // Mock data - replace with API call
  useEffect(() => {
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'موبایل و تبلت',
        slug: 'mobile-tablet',
        description: 'انواع گوشی‌های هوشمند و تبلت‌ها',
        parent_id: null,
        level: 0,
        sort_order: 1,
        status: 'active',
        image_url: '/api/placeholder/100/100',
        meta_title: 'موبایل و تبلت | فروشگاه آیشاپ',
        meta_description: 'خرید انواع گوشی هوشمند و تبلت با بهترین قیمت',
        product_count: 156,
        total_sales: 2340000000,
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z',
        children: [
          {
            id: '2',
            name: 'گوشی هوشمند',
            slug: 'smartphones',
            description: 'انواع گوشی‌های هوشمند',
            parent_id: '1',
            level: 1,
            sort_order: 1,
            status: 'active',
            product_count: 120,
            total_sales: 2000000000,
            created_at: '2024-01-01T10:05:00Z',
            updated_at: '2024-01-18T12:20:00Z',
            children: [
              {
                id: '3',
                name: 'آیفون',
                slug: 'iphone',
                description: 'محصولات اپل',
                parent_id: '2',
                level: 2,
                sort_order: 1,
                status: 'active',
                product_count: 45,
                total_sales: 1200000000,
                created_at: '2024-01-01T10:10:00Z',
                updated_at: '2024-01-15T09:45:00Z',
                children: []
              },
              {
                id: '4',
                name: 'سامسونگ',
                slug: 'samsung',
                description: 'محصولات سامسونگ',
                parent_id: '2',
                level: 2,
                sort_order: 2,
                status: 'active',
                product_count: 38,
                total_sales: 800000000,
                created_at: '2024-01-01T10:15:00Z',
                updated_at: '2024-01-16T14:10:00Z',
                children: []
              }
            ]
          },
          {
            id: '5',
            name: 'تبلت',
            slug: 'tablets',
            description: 'انواع تبلت‌ها',
            parent_id: '1',
            level: 1,
            sort_order: 2,
            status: 'active',
            product_count: 36,
            total_sales: 340000000,
            created_at: '2024-01-01T10:20:00Z',
            updated_at: '2024-01-19T11:30:00Z',
            children: []
          }
        ]
      },
      {
        id: '6',
        name: 'لپ‌تاپ و کامپیوتر',
        slug: 'laptop-computer',
        description: 'انواع لپ‌تاپ و کامپیوتر',
        parent_id: null,
        level: 0,
        sort_order: 2,
        status: 'active',
        product_count: 89,
        total_sales: 1890000000,
        created_at: '2024-01-01T10:25:00Z',
        updated_at: '2024-01-20T16:45:00Z',
        children: [
          {
            id: '7',
            name: 'لپ‌تاپ',
            slug: 'laptops',
            description: 'انواع لپ‌تاپ‌ها',
            parent_id: '6',
            level: 1,
            sort_order: 1,
            status: 'active',
            product_count: 67,
            total_sales: 1560000000,
            created_at: '2024-01-01T10:30:00Z',
            updated_at: '2024-01-17T13:15:00Z',
            children: []
          }
        ]
      }
    ];

    setTimeout(() => {
      setCategories(mockCategories);
      setFilteredCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter categories
  useEffect(() => {
    let filtered = categories;

    if (searchTerm) {
      filtered = filterCategoriesRecursive(categories, searchTerm.toLowerCase());
    }

    if (statusFilter !== 'all') {
      filtered = filterCategoriesByStatus(filtered, statusFilter);
    }

    setFilteredCategories(filtered);
  }, [categories, searchTerm, statusFilter]);

  const filterCategoriesRecursive = (cats: Category[], term: string): Category[] => {
    return cats.filter(cat => {
      const matchesName = cat.name.toLowerCase().includes(term);
      const matchesDescription = cat.description.toLowerCase().includes(term);
      const hasMatchingChildren = cat.children && cat.children.length > 0 && 
        filterCategoriesRecursive(cat.children, term).length > 0;

      if (matchesName || matchesDescription || hasMatchingChildren) {
        return {
          ...cat,
          children: cat.children ? filterCategoriesRecursive(cat.children, term) : []
        };
      }
      return false;
    }).map(cat => ({
      ...cat,
      children: cat.children ? filterCategoriesRecursive(cat.children, term) : []
    }));
  };

  const filterCategoriesByStatus = (cats: Category[], status: string): Category[] => {
    return cats.filter(cat => {
      const matchesStatus = cat.status === status;
      const hasMatchingChildren = cat.children && cat.children.length > 0 && 
        filterCategoriesByStatus(cat.children, status).length > 0;

      return matchesStatus || hasMatchingChildren;
    }).map(cat => ({
      ...cat,
      children: cat.children ? filterCategoriesByStatus(cat.children, status) : []
    }));
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent_id: null,
      sort_order: 0,
      status: 'active',
      image_url: '',
      meta_title: '',
      meta_description: ''
    });
    setEditingCategory(null);
  };

  const handleCreateCategory = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parent_id: category.parent_id,
      sort_order: category.sort_order,
      status: category.status,
      image_url: category.image_url || '',
      meta_title: category.meta_title || '',
      meta_description: category.meta_description || ''
    });
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return;

    // Remove category from state
    const removeCategoryRecursive = (cats: Category[], idToRemove: string): Category[] => {
      return cats.filter(cat => cat.id !== idToRemove).map(cat => ({
        ...cat,
        children: removeCategoryRecursive(cat.children, idToRemove)
      }));
    };

    setCategories(prev => removeCategoryRecursive(prev, categoryToDelete.id));
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleSubmitForm = () => {
    if (editingCategory) {
      // Update existing category
      const updateCategoryRecursive = (cats: Category[]): Category[] => {
        return cats.map(cat => {
          if (cat.id === formData.id) {
            return {
              ...cat,
              name: formData.name,
              slug: formData.slug,
              description: formData.description,
              parent_id: formData.parent_id,
              sort_order: formData.sort_order,
              status: formData.status,
              image_url: formData.image_url,
              meta_title: formData.meta_title,
              meta_description: formData.meta_description,
              updated_at: new Date().toISOString()
            };
          }
          return {
            ...cat,
            children: updateCategoryRecursive(cat.children)
          };
        });
      };

      setCategories(prev => updateCategoryRecursive(prev));
    } else {
      // Create new category
      const newCategory: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        parent_id: formData.parent_id,
        level: formData.parent_id ? 1 : 0, // Simple level calculation
        sort_order: formData.sort_order,
        status: formData.status,
        image_url: formData.image_url,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        product_count: 0,
        total_sales: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        children: []
      };

      if (formData.parent_id) {
        // Add as child to parent category
        const addToParent = (cats: Category[]): Category[] => {
          return cats.map(cat => {
            if (cat.id === formData.parent_id) {
              return {
                ...cat,
                children: [...cat.children, newCategory]
              };
            }
            return {
              ...cat,
              children: addToParent(cat.children)
            };
          });
        };
        setCategories(prev => addToParent(prev));
      } else {
        // Add as root category
        setCategories(prev => [...prev, newCategory]);
      }
    }

    setShowForm(false);
    resetForm();
  };

  const renderCategoryTree = (cats: Category[], parentLevel = 0) => {
    return cats.map(category => (
      <React.Fragment key={category.id}>
        <div 
          className={`flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
            parentLevel > 0 ? 'mr-6' : ''
          }`}
          style={{ paddingRight: `${parentLevel * 24 + 12}px` }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {category.children.length > 0 && (
              <button
                onClick={() => toggleCategoryExpansion(category.id)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
            
            {category.image_url && (
              <img
                src={category.image_url}
                alt={category.name}
                className="w-8 h-8 rounded object-cover"
              />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900 truncate">
                  {category.name}
                </h4>
                <StatusBadge status={category.status} type="general" size="sm" />
                {parentLevel === 0 && (
                  <FolderTree className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{formatPersianNumber(category.product_count)} محصول</span>
                <span>{formatPersianCurrency(category.total_sales)} فروش</span>
                <span>به‌روزرسانی: {getRelativeTime(new Date(category.updated_at))}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleEditCategory(category)}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded transition-colors"
              title="ویرایش"
            >
              <Edit className="w-4 h-4" />
            </button>
            
            <button
              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="مشاهده محصولات"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            <button
              className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="آمار"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            
            {category.product_count === 0 && (
              <button
                onClick={() => handleDeleteCategory(category)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {expandedCategories.has(category.id) && category.children.length > 0 && 
          renderCategoryTree(category.children, parentLevel + 1)
        }
      </React.Fragment>
    ));
  };

  const getAllCategories = (cats: Category[]): Category[] => {
    let result: Category[] = [];
    cats.forEach(cat => {
      result.push(cat);
      if (cat.children.length > 0) {
        result = result.concat(getAllCategories(cat.children));
      }
    });
    return result;
  };

  const allCategories = getAllCategories(categories);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگیری دسته‌بندی‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
            مدیریت دسته‌بندی‌ها
          </h1>
          <p className="text-gray-600 mt-1">
            مجموع {formatPersianNumber(allCategories.length)} دسته‌بندی
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            آمار عملکرد
          </button>
          <button 
            onClick={handleCreateCategory}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            دسته‌بندی جدید
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">کل دسته‌ها</p>
              <p className="text-2xl font-bold text-blue-900">{formatPersianNumber(allCategories.length)}</p>
            </div>
            <FolderTree className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">دسته‌های فعال</p>
              <p className="text-2xl font-bold text-green-900">
                {formatPersianNumber(allCategories.filter(c => c.status === 'active').length)}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="card p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">کل محصولات</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatPersianNumber(allCategories.reduce((sum, cat) => sum + cat.product_count, 0))}
              </p>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="card p-4 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">کل فروش</p>
              <p className="text-lg font-bold text-amber-900">
                {formatPersianCurrency(allCategories.reduce((sum, cat) => sum + cat.total_sales, 0))}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="جستجوی دسته‌بندی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-rose-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
          </select>
        </div>
      </div>

      {/* Category Tree */}
      <div className="card overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-rose-600" />
              ساختار دسته‌بندی‌ها
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpandedCategories(new Set(allCategories.map(c => c.id)))}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                بازکردن همه
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => setExpandedCategories(new Set())}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                بستن همه
              </button>
            </div>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="p-12 text-center">
            <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              هیچ دسته‌بندی‌ای یافت نشد
            </h4>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'نتیجه‌ای برای جستجوی شما یافت نشد' : 'هنوز هیچ دسته‌بندی‌ای ایجاد نشده'}
            </p>
            <button 
              onClick={handleCreateCategory}
              className="btn-primary"
            >
              ایجاد اولین دسته‌بندی
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {renderCategoryTree(filteredCategories)}
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      <PersianModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingCategory ? `ویرایش دسته‌بندی: ${editingCategory.name}` : 'دسته‌بندی جدید'}
        size="lg"
        footerActions={
          <>
            <button onClick={() => setShowForm(false)} className="btn-secondary">
              انصراف
            </button>
            <button onClick={handleSubmitForm} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              {editingCategory ? 'بروزرسانی' : 'ایجاد دسته‌بندی'}
            </button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام دسته‌بندی *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value, slug: generateSlug(e.target.value) }));
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="نام دسته‌بندی"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL (Slug)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="category-slug"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              placeholder="توضیحات دسته‌بندی..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                دسته‌بندی والد
              </label>
              <select
                value={formData.parent_id || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value || null }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">دسته‌بندی اصلی (بدون والد)</option>
                {allCategories
                  .filter(cat => cat.id !== formData.id)
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {'—'.repeat(cat.level)} {cat.name}
                    </option>
                  ))
                }
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وضعیت
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
              </select>
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 mb-4">تنظیمات سئو</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان متا
                </label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="عنوان صفحه در موتورهای جستجو"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات متا
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  placeholder="توضیحات برای موتورهای جستجو"
                />
              </div>
            </div>
          </div>
        </div>
      </PersianModal>

      {/* Delete Confirmation Modal */}
      <PersianModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="تایید حذف دسته‌بندی"
        size="md"
        footerActions={
          <>
            <button onClick={() => setShowDeleteModal(false)} className="btn-secondary">
              انصراف
            </button>
            <button onClick={confirmDeleteCategory} className="btn-primary bg-red-600 hover:bg-red-700 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              حذف دسته‌بندی
            </button>
          </>
        }
      >
        {categoryToDelete && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h4 className="font-medium text-red-900">هشدار</h4>
                <p className="text-sm text-red-700">این عمل قابل بازگشت نیست</p>
              </div>
            </div>
            
            <p className="text-gray-700">
              آیا مطمئن هستید که می‌خواهید دسته‌بندی <strong>"{categoryToDelete.name}"</strong> را حذف کنید؟
            </p>
            
            {categoryToDelete.children.length > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>توجه:</strong> این دسته‌بندی دارای {formatPersianNumber(categoryToDelete.children.length)} زیردسته است که همگی حذف خواهند شد.
                </p>
              </div>
            )}
            
            {categoryToDelete.product_count > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>خطا:</strong> این دسته‌بندی دارای {formatPersianNumber(categoryToDelete.product_count)} محصول است. ابتدا محصولات را به دسته‌بندی دیگر منتقل کنید.
                </p>
              </div>
            )}
          </div>
        )}
      </PersianModal>
    </div>
  );
};

export default CategoryManagement;