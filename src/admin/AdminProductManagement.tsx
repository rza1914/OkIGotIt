import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Upload, Save, X } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  image_url: string;
  slug: string;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  image_url: string;
  stock: number;
  is_active: boolean;
}

const AdminProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Mock categories - در پروژه واقعی از API می‌آید
  const categories = [
    'الکترونیک',
    'پوشاک',
    'کتاب',
    'خانه و آشپزخانه',
    'ورزش',
    'زیبایی و بهداشت'
  ];

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    price: 0,
    currency: 'IRR',
    image_url: '',
    stock: 0,
    is_active: true
  });

  // Mock data - در پروژه واقعی از API می‌آید
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'گوشی هوشمند سامسونگ',
        description: 'گوشی هوشمند با کیفیت بالا و امکانات پیشرفته',
        category: 'الکترونیک',
        price: 15000000,
        currency: 'IRR',
        image_url: 'https://via.placeholder.com/150?text=Samsung',
        slug: 'samsung-phone',
        stock: 10,
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: 2,
        name: 'لپ‌تاپ ایسوس',
        description: 'لپ‌تاپ گیمینگ قدرتمند مناسب برای کار و بازی',
        category: 'الکترونیک',
        price: 45000000,
        currency: 'IRR',
        image_url: 'https://via.placeholder.com/150?text=Asus',
        slug: 'asus-laptop',
        stock: 5,
        is_active: true,
        created_at: '2024-01-02',
        updated_at: '2024-01-02'
      },
      {
        id: 3,
        name: 'کتاب برنامه‌نویسی پایتون',
        description: 'آموزش کامل برنامه‌نویسی Python برای مبتدیان',
        category: 'کتاب',
        price: 350000,
        currency: 'IRR',
        image_url: 'https://via.placeholder.com/150?text=Python+Book',
        slug: 'python-book',
        stock: 25,
        is_active: true,
        created_at: '2024-01-03',
        updated_at: '2024-01-03'
      }
    ];
    
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: 0,
      currency: 'IRR',
      image_url: '',
      stock: 0,
      is_active: true
    });
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.description || !formData.category) {
      alert('لطفا تمام فیلدهای الزامی را پر کنید');
      return;
    }

    setLoading(true);
    
    // Mock API call - در پروژه واقعی API request می‌زنید
    const newProduct: Product = {
      id: Date.now(),
      ...formData,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setTimeout(() => {
      setProducts([...products, newProduct]);
      setShowAddModal(false);
      resetForm();
      setLoading(false);
      alert('محصول با موفقیت اضافه شد');
    }, 500);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      currency: product.currency,
      image_url: product.image_url,
      stock: product.stock,
      is_active: product.is_active
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    if (!formData.name || !formData.description || !formData.category) {
      alert('لطفا تمام فیلدهای الزامی را پر کنید');
      return;
    }
    
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, updated_at: new Date().toISOString() }
          : p
      ));
      setEditingProduct(null);
      resetForm();
      setLoading(false);
      alert('محصول با موفقیت به‌روزرسانی شد');
    }, 500);
  };

  const handleDeleteProduct = (id: number, productName: string) => {
    if (!confirm(`آیا از حذف محصول "${productName}" اطمینان دارید؟`)) return;
    
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setProducts(products.filter(p => p.id !== id));
      setLoading(false);
      alert('محصول با موفقیت حذف شد');
    }, 500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock image upload - در پروژه واقعی به سرور آپلود می‌کنید
      const mockUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image_url: mockUrl });
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || product.category === selectedCategory)
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">مدیریت محصولات</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          افزودن محصول جدید
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">کل محصولات</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Plus className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">محصولات فعال</p>
              <p className="text-2xl font-bold text-green-900">
                {products.filter(p => p.is_active).length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Filter className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">کل موجودی</p>
              <p className="text-2xl font-bold text-orange-900">
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Search className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="جستجوی محصولات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">همه دسته‌ها</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  محصول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  دسته‌بندی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  قیمت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  موجودی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || selectedCategory ? 'محصولی با این فیلتر یافت نشد' : 'هیچ محصولی وجود ندارد'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-lg object-cover ml-4"
                          src={product.image_url || 'https://via.placeholder.com/60?text=No+Image'}
                          alt={product.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60?text=No+Image';
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} عدد
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="ویرایش محصول"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="حذف محصول"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام محصول *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="نام محصول را وارد کنید"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  توضیحات *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="توضیحات محصول را وارد کنید"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    دسته‌بندی *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">انتخاب دسته‌بندی</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    قیمت (تومان) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تصویر محصول
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Upload size={18} />
                    انتخاب تصویر
                  </label>
                  {formData.image_url && (
                    <div className="flex items-center gap-2">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="text-red-500 hover:text-red-700"
                        title="حذف تصویر"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    موجودی *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    وضعیت
                  </label>
                  <select
                    value={formData.is_active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">فعال</option>
                    <option value="false">غیرفعال</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-4 p-6 border-t">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <Save size={18} />
                {loading ? 'در حال ذخیره...' : editingProduct ? 'به‌روزرسانی' : 'ذخیره'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && products.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <div>در حال پردازش...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;