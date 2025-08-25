import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import InventoryManagement from './InventoryManagement';
import ProductForm from './ProductForm';
import ReviewsManagement from './ReviewsManagement';
import ProductAnalytics from './ProductAnalytics';
import { 
  Package, FolderTree, Archive, Plus, BarChart3, 
  Tag, DollarSign, Settings, MessageSquare, TrendingUp 
} from 'lucide-react';

const ProductsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'inventory' | 'pricing' | 'reviews' | 'analytics'>('products');
  const [showProductForm, setShowProductForm] = useState(false);

  // Mock categories and brands data
  const mockCategories = [
    { id: '1', name: 'گوشی هوشمند', parent_id: undefined },
    { id: '2', name: 'آیفون', parent_id: '1' },
    { id: '3', name: 'سامسونگ', parent_id: '1' },
    { id: '4', name: 'لپ‌تاپ', parent_id: undefined },
    { id: '5', name: 'تبلت', parent_id: undefined }
  ];

  const mockBrands = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Nokia', 'LG'];

  const handleSaveProduct = (productData: any) => {
    console.log('Saving product:', productData);
    // Here you would typically call an API to save the product
    return Promise.resolve();
  };

  const tabs = [
    { 
      key: 'products', 
      label: 'مدیریت محصولات', 
      icon: Package,
      description: 'مشاهده و مدیریت محصولات'
    },
    { 
      key: 'categories', 
      label: 'دسته‌بندی‌ها', 
      icon: FolderTree,
      description: 'ساختار دسته‌بندی محصولات'
    },
    { 
      key: 'inventory', 
      label: 'مدیریت انبار', 
      icon: Archive,
      description: 'موجودی و تحرکات انبار'
    },
    { 
      key: 'reviews', 
      label: 'نظرات کاربران', 
      icon: MessageSquare,
      description: 'مدیریت نظرات و بازخوردها'
    },
    { 
      key: 'analytics', 
      label: 'آنالیتیک', 
      icon: TrendingUp,
      description: 'آمار و تحلیل عملکرد'
    },
    { 
      key: 'pricing', 
      label: 'قیمت‌گذاری', 
      icon: DollarSign,
      description: 'مدیریت قیمت و تخفیفات'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header with Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
              مدیریت محصولات
            </h1>
            <p className="text-gray-600 mt-1">
              مدیریت کامل محصولات، دسته‌بندی‌ها و موجودی انبار
            </p>
          </div>
          
          {activeTab === 'products' && (
            <div className="flex items-center gap-3">
              <button className="btn-secondary flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                گزارش عملکرد
              </button>
              <button 
                onClick={() => setShowProductForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                محصول جدید
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white rounded-t-xl">
          <nav className="flex space-x-reverse space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-right">
                    <div>{tab.label}</div>
                    <div className="text-xs font-normal text-gray-400">
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl min-h-96">
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
          {activeTab === 'inventory' && <InventoryManagement />}
          {activeTab === 'reviews' && <ReviewsManagement />}
          {activeTab === 'analytics' && <ProductAnalytics />}
          {activeTab === 'pricing' && (
            <div className="p-12 text-center">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                مدیریت قیمت‌گذاری
              </h3>
              <p className="text-gray-600 mb-6">
                سیستم مدیریت قیمت‌گذاری و تخفیفات در حال توسعه است
              </p>
              <div className="flex justify-center gap-3">
                <button className="btn-secondary flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  تنظیمات قیمت‌گذاری
                </button>
                <button className="btn-primary flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  ایجاد کمپین تخفیف
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Form Modal */}
        <ProductForm
          isOpen={showProductForm}
          onClose={() => setShowProductForm(false)}
          onSave={handleSaveProduct}
          categories={mockCategories}
          brands={mockBrands}
        />
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;