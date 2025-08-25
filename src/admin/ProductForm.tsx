import React, { useState, useRef } from 'react';
import { 
  Save, X, Upload, Image as ImageIcon, Trash2, Plus, Star,
  Tag, DollarSign, Package, Globe, Eye, EyeOff, AlertCircle,
  Info, ChevronDown, ChevronUp, Move, Copy, ExternalLink
} from 'lucide-react';
import { formatPersianCurrency, toPersianNumber } from '../utils/persian';
import PersianModal from './components/PersianModal';
import StatusBadge from './components/StatusBadge';

interface ProductImage {
  id: string;
  url: string;
  file?: File;
  alt: string;
  is_primary: boolean;
}

interface ProductVariant {
  id: string;
  attribute_name: string;
  attribute_value: string;
  price_modifier: number;
  stock: number;
  sku: string;
  weight?: number;
}

interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string;
  category_id: string;
  brand: string;
  price: number;
  sale_price: number | null;
  cost_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  manage_stock: boolean;
  stock_status: 'in_stock' | 'out_of_stock' | 'on_backorder';
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  weight: number | null;
  dimensions: {
    length: number | null;
    width: number | null;
    height: number | null;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  meta_title: string;
  meta_description: string;
  related_products: string[];
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductFormData) => void;
  product?: ProductFormData;
  categories: Array<{ id: string; name: string; parent_id?: string }>;
  brands: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  categories = [],
  brands = []
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'inventory' | 'variants' | 'seo'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    sku: '',
    description: '',
    short_description: '',
    category_id: '',
    brand: '',
    price: 0,
    sale_price: null,
    cost_price: 0,
    stock_quantity: 0,
    low_stock_threshold: 5,
    manage_stock: true,
    stock_status: 'in_stock',
    status: 'draft',
    featured: false,
    weight: null,
    dimensions: {
      length: null,
      width: null,
      height: null
    },
    images: [],
    variants: [],
    tags: [],
    meta_title: '',
    meta_description: '',
    related_products: [],
    ...product
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from name
    if (field === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (files: FileList) => {
    const newImages: ProductImage[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const id = Math.random().toString(36).substr(2, 9);
        const url = URL.createObjectURL(file);
        
        newImages.push({
          id,
          url,
          file,
          alt: formData.name || 'تصویر محصول',
          is_primary: formData.images.length === 0 && newImages.length === 0
        });
      }
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleImageRemove = (imageId: string) => {
    setFormData(prev => {
      const updatedImages = prev.images.filter(img => img.id !== imageId);
      
      // If removed image was primary, make first image primary
      if (updatedImages.length > 0 && !updatedImages.some(img => img.is_primary)) {
        updatedImages[0].is_primary = true;
      }
      
      return { ...prev, images: updatedImages };
    });
  };

  const handleImageSetPrimary = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        is_primary: img.id === imageId
      }))
    }));
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Math.random().toString(36).substr(2, 9),
      attribute_name: '',
      attribute_value: '',
      price_modifier: 0,
      stock: 0,
      sku: `${formData.sku}-VAR`,
      weight: formData.weight || 0
    };

    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
  };

  const updateVariant = (variantId: string, field: keyof ProductVariant, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(variant =>
        variant.id === variantId ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const removeVariant = (variantId: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(variant => variant.id !== variantId)
    }));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'نام محصول الزامی است';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'کد محصول (SKU) الزامی است';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'انتخاب دسته‌بندی الزامی است';
    }

    if (formData.price <= 0) {
      newErrors.price = 'قیمت باید بزرگتر از صفر باشد';
    }

    if (formData.sale_price && formData.sale_price >= formData.price) {
      newErrors.sale_price = 'قیمت تخفیف‌خورده باید کمتر از قیمت اصلی باشد';
    }

    if (formData.manage_stock && formData.stock_quantity < 0) {
      newErrors.stock_quantity = 'موجودی نمی‌تواند منفی باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('خطا در ذخیره محصول:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { key: 'basic', label: 'اطلاعات کلی', icon: Info },
    { key: 'images', label: 'تصاویر', icon: ImageIcon },
    { key: 'inventory', label: 'موجودی', icon: Package },
    { key: 'variants', label: 'تنوع محصول', icon: Copy },
    { key: 'seo', label: 'سئو', icon: Globe }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-l from-rose-50 to-amber-50 px-6 py-4 border-b border-rose-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {product ? 'ویرایش محصول' : 'افزودن محصول جدید'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-reverse space-x-8 px-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.key
                        ? 'border-rose-500 text-rose-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام محصول *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="نام محصول را وارد کنید"
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      کد محصول (SKU) *
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        errors.sku ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="کد یکتای محصول"
                    />
                    {errors.sku && <p className="text-red-600 text-xs mt-1">{errors.sku}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL محصول (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="url-friendly-name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      دسته‌بندی *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => handleInputChange('category_id', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        errors.category_id ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">انتخاب دسته‌بندی</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && <p className="text-red-600 text-xs mt-1">{errors.category_id}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      برند
                    </label>
                    <select
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">انتخاب برند</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    قیمت‌گذاری
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        قیمت اصلی (تومان) *
                      </label>
                      <input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => handleInputChange('price', Number(e.target.value))}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0"
                        min="0"
                      />
                      {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        قیمت فروش (تومان)
                      </label>
                      <input
                        type="number"
                        value={formData.sale_price || ''}
                        onChange={(e) => handleInputChange('sale_price', e.target.value ? Number(e.target.value) : null)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                          errors.sale_price ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0"
                        min="0"
                      />
                      {errors.sale_price && <p className="text-red-600 text-xs mt-1">{errors.sale_price}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        قیمت خرید (تومان)
                      </label>
                      <input
                        type="number"
                        value={formData.cost_price || ''}
                        onChange={(e) => handleInputChange('cost_price', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات کوتاه
                  </label>
                  <textarea
                    value={formData.short_description}
                    onChange={(e) => handleInputChange('short_description', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    placeholder="توضیحات کوتاه محصول..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات کامل
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    placeholder="توضیحات کامل محصول..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    برچسب‌ها
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-rose-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="برچسب جدید وارد کرده و Enter بزنید"
                  />
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وضعیت انتشار
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="draft">پیش‌نویس</option>
                      <option value="active">منتشر شده</option>
                      <option value="inactive">غیرفعال</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm text-gray-700">محصول ویژه</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">گالری تصاویر</h4>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      افزودن تصویر
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                  />

                  {formData.images.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        هیچ تصویری انتخاب نشده
                      </h4>
                      <p className="text-gray-500 mb-4">
                        تصاویر محصول خود را اینجا آپلود کنید
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary"
                      >
                        انتخاب تصاویر
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Image overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-xl">
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {image.is_primary ? (
                                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                  اصلی
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleImageSetPrimary(image.id)}
                                  className="bg-white text-gray-700 text-xs px-2 py-1 rounded-full font-medium hover:bg-gray-100"
                                >
                                  تنظیم اصلی
                                </button>
                              )}
                            </div>
                            
                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleImageRemove(image.id)}
                                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    مدیریت موجودی
                  </h4>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.manage_stock}
                        onChange={(e) => handleInputChange('manage_stock', e.target.checked)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm text-gray-700">مدیریت موجودی</span>
                    </label>

                    {formData.manage_stock && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            تعداد موجودی
                          </label>
                          <input
                            type="number"
                            value={formData.stock_quantity || ''}
                            onChange={(e) => handleInputChange('stock_quantity', Number(e.target.value))}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                              errors.stock_quantity ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="0"
                            min="0"
                          />
                          {errors.stock_quantity && <p className="text-red-600 text-xs mt-1">{errors.stock_quantity}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            حد مجاز موجودی
                          </label>
                          <input
                            type="number"
                            value={formData.low_stock_threshold || ''}
                            onChange={(e) => handleInputChange('low_stock_threshold', Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                            placeholder="5"
                            min="0"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        وضعیت موجودی
                      </label>
                      <select
                        value={formData.stock_status}
                        onChange={(e) => handleInputChange('stock_status', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="in_stock">موجود</option>
                        <option value="out_of_stock">ناموجود</option>
                        <option value="on_backorder">پیش‌سفارش</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Physical Properties */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-4">مشخصات فیزیکی</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        وزن (گرم)
                      </label>
                      <input
                        type="number"
                        value={formData.weight || ''}
                        onChange={(e) => handleInputChange('weight', e.target.value ? Number(e.target.value) : null)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ابعاد (سانتی‌متر)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          value={formData.dimensions.length || ''}
                          onChange={(e) => handleInputChange('dimensions', {
                            ...formData.dimensions,
                            length: e.target.value ? Number(e.target.value) : null
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="طول"
                          min="0"
                        />
                        <input
                          type="number"
                          value={formData.dimensions.width || ''}
                          onChange={(e) => handleInputChange('dimensions', {
                            ...formData.dimensions,
                            width: e.target.value ? Number(e.target.value) : null
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="عرض"
                          min="0"
                        />
                        <input
                          type="number"
                          value={formData.dimensions.height || ''}
                          onChange={(e) => handleInputChange('dimensions', {
                            ...formData.dimensions,
                            height: e.target.value ? Number(e.target.value) : null
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                          placeholder="ارتفاع"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">تنوع محصول</h4>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    افزودن تنوع
                  </button>
                </div>

                {formData.variants.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <Copy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      هیچ تنوعی تعریف نشده
                    </h4>
                    <p className="text-gray-500 mb-4">
                      برای محصولاتی که تنوع دارند (مثل رنگ، سایز) تنوع اضافه کنید
                    </p>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="btn-secondary"
                    >
                      افزودن اولین تنوع
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.variants.map((variant, index) => (
                      <div key={variant.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium text-gray-900">تنوع {toPersianNumber(index + 1)}</h5>
                          <button
                            type="button"
                            onClick={() => removeVariant(variant.id)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              نوع ویژگی
                            </label>
                            <input
                              type="text"
                              value={variant.attribute_name}
                              onChange={(e) => updateVariant(variant.id, 'attribute_name', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                              placeholder="مثال: رنگ، سایز"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              مقدار
                            </label>
                            <input
                              type="text"
                              value={variant.attribute_value}
                              onChange={(e) => updateVariant(variant.id, 'attribute_value', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                              placeholder="مثال: قرمز، بزرگ"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              اختلاف قیمت
                            </label>
                            <input
                              type="number"
                              value={variant.price_modifier || ''}
                              onChange={(e) => updateVariant(variant.id, 'price_modifier', Number(e.target.value))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              موجودی
                            </label>
                            <input
                              type="number"
                              value={variant.stock || ''}
                              onChange={(e) => updateVariant(variant.id, 'stock', Number(e.target.value))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SKU تنوع
                          </label>
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                            placeholder={`${formData.sku}-VAR`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    بهینه‌سازی موتورهای جستجو (SEO)
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عنوان متا (Meta Title)
                      </label>
                      <input
                        type="text"
                        value={formData.meta_title}
                        onChange={(e) => handleInputChange('meta_title', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="عنوان صفحه در موتورهای جستجو"
                        maxLength={60}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {toPersianNumber(formData.meta_title.length)}/۶۰ کاراکتر
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        توضیحات متا (Meta Description)
                      </label>
                      <textarea
                        value={formData.meta_description}
                        onChange={(e) => handleInputChange('meta_description', e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                        placeholder="توضیحات کوتاه برای موتورهای جستجو"
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {toPersianNumber(formData.meta_description.length)}/۱۶۰ کاراکتر
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">پیش‌نمایش در گوگل</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-blue-600 text-sm hover:underline cursor-pointer">
                          {formData.meta_title || formData.name || 'عنوان محصول'}
                        </div>
                        <div className="text-green-700 text-xs">
                          yoursite.com/products/{formData.slug || 'product-slug'}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {formData.meta_description || formData.short_description || 'توضیحات محصول در اینجا نمایش داده می‌شود...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {product ? 'بروزرسانی محصول' : 'ذخیره محصول'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;