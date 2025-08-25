import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Filter, Download, Eye, Edit, Trash2, Plus,
  AlertTriangle, CheckCircle, X, Upload, Image as ImageIcon,
  Tag, BarChart3, Star, TrendingUp, TrendingDown, DollarSign,
  ShoppingCart, Package2, Grid, List, ChevronDown, ChevronUp,
  ExternalLink, Copy, Archive, RotateCcw, Users, Calendar
} from 'lucide-react';
import { 
  formatPersianCurrency, formatPersianNumber, 
  getRelativeTime, formatPersianDateTime, toPersianNumber 
} from '../utils/persian';
import BulkActions from './components/BulkActions';
import ExportModal from './components/ExportModal';
import StatusBadge from './components/StatusBadge';
import PersianModal from './components/PersianModal';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  is_primary: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price_modifier: number;
  stock: number;
  sku: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string;
  category_id: string;
  category_name: string;
  brand: string;
  price: number;
  sale_price?: number;
  cost_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  manage_stock: boolean;
  stock_status: 'in_stock' | 'out_of_stock' | 'on_backorder';
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  total_sales: number;
  rating: number;
  review_count: number;
  views: number;
}

interface ProductFilters {
  category: string;
  brand: string;
  status: string;
  stock_status: string;
  price_min: number | null;
  price_max: number | null;
  featured: boolean | null;
  on_sale: boolean | null;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({
    category: '',
    brand: '',
    status: '',
    stock_status: '',
    price_min: null,
    price_max: null,
    featured: null,
    on_sale: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // Mock data - replace with API call
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'آیفون ۱۵ پرو ۲۵۶ گیگابایت',
        slug: 'iphone-15-pro-256gb',
        sku: 'IP15P-256-BLU',
        description: 'آیفون ۱۵ پرو با چیپ A17 Pro و دوربین پیشرفته Pro Camera system که عکاسی حرفه‌ای را به همراه دارد.',
        short_description: 'آیفون ۱۵ پرو با ظرفیت ۲۵۶ گیگابایت',
        category_id: 'smartphones',
        category_name: 'گوشی هوشمند',
        brand: 'Apple',
        price: 45000000,
        sale_price: 42000000,
        cost_price: 38000000,
        stock_quantity: 15,
        low_stock_threshold: 5,
        manage_stock: true,
        stock_status: 'in_stock',
        status: 'active',
        featured: true,
        weight: 187,
        dimensions: { length: 159.9, width: 76.7, height: 8.25 },
        images: [
          { id: '1', url: '/api/placeholder/400/400', alt: 'آیفون ۱۵ پرو آبی', is_primary: true }
        ],
        variants: [
          { id: '1', name: 'رنگ', value: 'آبی', price_modifier: 0, stock: 15, sku: 'IP15P-256-BLU' },
          { id: '2', name: 'رنگ', value: 'مشکی', price_modifier: 0, stock: 8, sku: 'IP15P-256-BLK' }
        ],
        tags: ['آیفون', 'اپل', 'گوشی', 'پرو'],
        meta_title: 'خرید آیفون ۱۵ پرو ۲۵۶ گیگابایت | آیشاپ',
        meta_description: 'آیفون ۱۵ پرو با بهترین قیمت و گارانتی معتبر از آیشاپ بخرید',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-20T14:15:00Z',
        total_sales: 45,
        rating: 4.8,
        review_count: 23,
        views: 1250
      },
      {
        id: '2',
        name: 'سامسونگ گلکسی S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        sku: 'SGS24U-512-GRY',
        description: 'سامسونگ گلکسی S24 Ultra با قلم S Pen و دوربین ۲۰۰ مگاپیکسلی',
        short_description: 'سامسونگ گلکسی S24 Ultra با ظرفیت ۵۱۲ گیگابایت',
        category_id: 'smartphones',
        category_name: 'گوشی هوشمند',
        brand: 'Samsung',
        price: 38000000,
        cost_price: 32000000,
        stock_quantity: 3,
        low_stock_threshold: 5,
        manage_stock: true,
        stock_status: 'in_stock',
        status: 'active',
        featured: false,
        images: [
          { id: '2', url: '/api/placeholder/400/400', alt: 'گلکسی S24 Ultra', is_primary: true }
        ],
        variants: [],
        tags: ['سامسونگ', 'گلکسی', 'اولترا', 'قلم'],
        created_at: '2024-01-12T09:20:00Z',
        updated_at: '2024-01-18T16:45:00Z',
        total_sales: 28,
        rating: 4.6,
        review_count: 15,
        views: 890
      },
      {
        id: '3',
        name: 'مک‌بوک ایر M3 ۱۳ اینچ',
        slug: 'macbook-air-m3-13',
        sku: 'MBA-M3-13-SLV',
        description: 'مک‌بوک ایر جدید با چیپ M3 اپل و عملکرد فوق‌العاده',
        short_description: 'مک‌بوک ایر M3 با نمایشگر ۱۳ اینچ',
        category_id: 'laptops',
        category_name: 'لپ‌تاپ',
        brand: 'Apple',
        price: 52000000,
        cost_price: 45000000,
        stock_quantity: 0,
        low_stock_threshold: 3,
        manage_stock: true,
        stock_status: 'out_of_stock',
        status: 'active',
        featured: true,
        images: [
          { id: '3', url: '/api/placeholder/400/400', alt: 'مک‌بوک ایر M3', is_primary: true }
        ],
        variants: [
          { id: '3', name: 'حافظه', value: '۲۵۶GB', price_modifier: 0, stock: 0, sku: 'MBA-M3-13-256' },
          { id: '4', name: 'حافظه', value: '۵۱۲GB', price_modifier: 8000000, stock: 2, sku: 'MBA-M3-13-512' }
        ],
        tags: ['مک‌بوک', 'اپل', 'M3', 'لپ‌تاپ'],
        created_at: '2024-01-10T11:15:00Z',
        updated_at: '2024-01-19T13:20:00Z',
        total_sales: 12,
        rating: 4.9,
        review_count: 8,
        views: 567
      }
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(product => product.category_id === filters.category);
    }
    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }
    if (filters.status) {
      filtered = filtered.filter(product => product.status === filters.status);
    }
    if (filters.stock_status) {
      filtered = filtered.filter(product => product.stock_status === filters.stock_status);
    }
    if (filters.price_min !== null) {
      filtered = filtered.filter(product => product.price >= filters.price_min!);
    }
    if (filters.price_max !== null) {
      filtered = filtered.filter(product => product.price <= filters.price_max!);
    }
    if (filters.featured !== null) {
      filtered = filtered.filter(product => product.featured === filters.featured);
    }
    if (filters.on_sale !== null) {
      filtered = filtered.filter(product => 
        filters.on_sale ? !!product.sale_price : !product.sale_price
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Product];
      let bVal: any = b[sortBy as keyof Product];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, filters, sortBy, sortOrder]);

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === currentProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(currentProducts.map(product => product.id)));
    }
  };

  const handleBulkAction = (actionKey: string) => {
    if (!actionKey || selectedProducts.size === 0) return;

    switch (actionKey) {
      case 'activate':
        setProducts(prevProducts =>
          prevProducts.map(product =>
            selectedProducts.has(product.id)
              ? { ...product, status: 'active' as any }
              : product
          )
        );
        break;
      case 'deactivate':
        setProducts(prevProducts =>
          prevProducts.map(product =>
            selectedProducts.has(product.id)
              ? { ...product, status: 'inactive' as any }
              : product
          )
        );
        break;
      case 'feature':
        setProducts(prevProducts =>
          prevProducts.map(product =>
            selectedProducts.has(product.id)
              ? { ...product, featured: true }
              : product
          )
        );
        break;
      case 'export':
        setShowExportModal(true);
        return;
      default:
        console.log(`Performing ${actionKey} on products:`, Array.from(selectedProducts));
    }
    
    setSelectedProducts(new Set());
  };

  const handleExport = (options: any) => {
    console.log('Exporting products with options:', options);
    return Promise.resolve();
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-100 border-green-200';
      case 'out_of_stock': return 'text-red-600 bg-red-100 border-red-200';
      case 'on_backorder': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStockStatusTranslation = (status: string) => {
    const translations = {
      in_stock: 'موجود',
      out_of_stock: 'ناموجود',
      on_backorder: 'پیش‌سفارش'
    };
    return translations[status as keyof typeof translations] || status;
  };

  // Pagination
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const productBulkActions = [
    {
      key: 'activate',
      label: 'فعال‌سازی',
      icon: CheckCircle,
      color: 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
    },
    {
      key: 'deactivate',
      label: 'غیرفعال‌سازی',
      icon: X,
      color: 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
    },
    {
      key: 'feature',
      label: 'ویژه کردن',
      icon: Star,
      color: 'bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100'
    },
    {
      key: 'category',
      label: 'تغییر دسته‌بندی',
      icon: Tag
    },
    {
      key: 'export',
      label: 'صدور گزارش',
      icon: Download
    },
    {
      key: 'delete',
      label: 'حذف محصولات',
      icon: Trash2,
      color: 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100',
      requiresConfirmation: true,
      confirmationMessage: 'آیا مطمئن هستید که می‌خواهید محصولات انتخاب شده را حذف کنید؟'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگیری محصولات...</p>
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
            مدیریت محصولات
          </h1>
          <p className="text-gray-600 mt-1">
            مجموع {formatPersianNumber(filteredProducts.length)} محصول
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowExportModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            دانلود گزارش
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            محصول جدید
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="جستجو بر اساس نام، SKU، برند یا دسته‌بندی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-rose-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-rose-100 text-rose-600' : 'text-gray-500'}`}
              title="نمای شبکه‌ای"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-rose-100 text-rose-600' : 'text-gray-500'}`}
              title="نمای لیستی"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <option value="created_at-desc">جدیدترین</option>
            <option value="created_at-asc">قدیمی‌ترین</option>
            <option value="name-asc">نام (الف تا ی)</option>
            <option value="name-desc">نام (ی تا الف)</option>
            <option value="price-asc">قیمت (کم به زیاد)</option>
            <option value="price-desc">قیمت (زیاد به کم)</option>
            <option value="total_sales-desc">پرفروش‌ترین</option>
            <option value="stock_quantity-asc">کم موجودی</option>
          </select>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-rose-100 text-rose-700' : ''}`}
          >
            <Filter className="w-4 h-4" />
            فیلترها
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-rose-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="">همه دسته‌ها</option>
                  <option value="smartphones">گوشی هوشمند</option>
                  <option value="laptops">لپ‌تاپ</option>
                  <option value="tablets">تبلت</option>
                  <option value="accessories">لوازم جانبی</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">برند</label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="">همه برندها</option>
                  <option value="Apple">اپل</option>
                  <option value="Samsung">سامسونگ</option>
                  <option value="Xiaomi">شیائومی</option>
                  <option value="Huawei">هوآوی</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="">همه وضعیت‌ها</option>
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                  <option value="draft">پیش‌نویس</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">موجودی</label>
                <select
                  value={filters.stock_status}
                  onChange={(e) => setFilters(prev => ({ ...prev, stock_status: e.target.value }))}
                  className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="">همه انواع موجودی</option>
                  <option value="in_stock">موجود</option>
                  <option value="out_of_stock">ناموجود</option>
                  <option value="on_backorder">پیش‌سفارش</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">بازه قیمت</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="از"
                    value={filters.price_min || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, price_min: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="تا"
                    value={filters.price_max || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, price_max: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ویژه</label>
                <select
                  value={filters.featured === null ? '' : filters.featured.toString()}
                  onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value === '' ? null : e.target.value === 'true' }))}
                  className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="">همه محصولات</option>
                  <option value="true">محصولات ویژه</option>
                  <option value="false">محصولات عادی</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تخفیف</label>
                <select
                  value={filters.on_sale === null ? '' : filters.on_sale.toString()}
                  onChange={(e) => setFilters(prev => ({ ...prev, on_sale: e.target.value === '' ? null : e.target.value === 'true' }))}
                  className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="">همه محصولات</option>
                  <option value="true">در حال تخفیف</option>
                  <option value="false">بدون تخفیف</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">کل محصولات</p>
              <p className="text-2xl font-bold text-blue-900">{formatPersianNumber(products.length)}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">محصولات فعال</p>
              <p className="text-2xl font-bold text-green-900">
                {formatPersianNumber(products.filter(p => p.status === 'active').length)}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="card p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">کم موجودی</p>
              <p className="text-2xl font-bold text-orange-900">
                {formatPersianNumber(products.filter(p => p.stock_quantity <= p.low_stock_threshold).length)}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="card p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">ناموجود</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatPersianNumber(products.filter(p => p.stock_status === 'out_of_stock').length)}
              </p>
            </div>
            <X className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedProducts.size}
        actions={productBulkActions}
        onAction={handleBulkAction}
        onClearSelection={() => setSelectedProducts(new Set())}
      />

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div key={product.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.images[0]?.url || '/api/placeholder/300/200'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                
                {/* Overlay badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {product.featured && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      ویژه
                    </span>
                  )}
                  {product.sale_price && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      تخفیف
                    </span>
                  )}
                  <StatusBadge status={product.status} type="general" size="sm" />
                </div>
                
                {/* Selection checkbox */}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                </div>
                
                {/* Quick actions */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowQuickView(true);
                      }}
                      className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                      title="مشاهده سریع"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                      title="ویرایش"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">{product.brand}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{product.category_name}</span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    {product.sale_price ? (
                      <>
                        <span className="text-lg font-bold text-rose-600">
                          {formatPersianCurrency(product.sale_price)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {formatPersianCurrency(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {formatPersianCurrency(product.price)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Package2 className="w-3 h-3" />
                    <span>{formatPersianNumber(product.stock_quantity)} موجود</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product.stock_status)}`}>
                    {getStockStatusTranslation(product.stock_status)}
                  </span>
                </div>
                
                {/* Low stock warning */}
                {product.stock_quantity <= product.low_stock_threshold && product.stock_quantity > 0 && (
                  <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-orange-600" />
                      <span className="text-xs text-orange-800">موجودی کم</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedProducts.size === currentProducts.length && currentProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                  </th>
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
                {currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            src={product.images[0]?.url || '/api/placeholder/48/48'}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        </div>
                        <div className="mr-4 min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                            {product.featured && (
                              <Star className="inline w-4 h-4 text-yellow-500 mr-1" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.brand}</div>
                      <div className="text-sm text-gray-500">{product.category_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.sale_price ? (
                          <div>
                            <span className="font-medium text-rose-600">
                              {formatPersianCurrency(product.sale_price)}
                            </span>
                            <span className="block text-xs text-gray-400 line-through">
                              {formatPersianCurrency(product.price)}
                            </span>
                          </div>
                        ) : (
                          formatPersianCurrency(product.price)
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          {formatPersianNumber(product.stock_quantity)}
                        </span>
                        {product.stock_quantity <= product.low_stock_threshold && (
                          <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                        )}
                      </div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStockStatusColor(product.stock_status)}`}>
                        {getStockStatusTranslation(product.stock_status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={product.status} type="general" size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowQuickView(true);
                          }}
                          className="text-rose-600 hover:text-rose-900 p-1 rounded hover:bg-rose-50"
                          title="مشاهده"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-50"
                          title="ویرایش"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="کپی"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  نمایش {formatPersianNumber(indexOfFirstProduct + 1)} تا {formatPersianNumber(Math.min(indexOfLastProduct, filteredProducts.length))} از {formatPersianNumber(filteredProducts.length)} محصول
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    قبلی
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded-lg ${
                          currentPage === page
                            ? 'bg-rose-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {toPersianNumber(page)}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        totalRecords={filteredProducts.length}
        selectedCount={selectedProducts.size}
        exportType={selectedProducts.size > 0 ? 'selected' : 'all'}
      />

      {/* Quick View Modal */}
      {selectedProduct && (
        <PersianModal
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
          title={`مشاهده سریع: ${selectedProduct.name}`}
          size="xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={selectedProduct.images[0]?.url || '/api/placeholder/400/400'}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-500">SKU: {selectedProduct.sku}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm text-gray-500">قیمت:</span>
                  <span className="text-lg font-bold text-gray-900 mr-2">
                    {formatPersianCurrency(selectedProduct.price)}
                  </span>
                </div>
                <StatusBadge status={selectedProduct.status} type="general" />
              </div>
              
              <div>
                <span className="text-sm text-gray-500">موجودی:</span>
                <span className="font-medium mr-2">{formatPersianNumber(selectedProduct.stock_quantity)}</span>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">دسته‌بندی:</span>
                <span className="mr-2">{selectedProduct.category_name}</span>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">برند:</span>
                <span className="mr-2">{selectedProduct.brand}</span>
              </div>
              
              <p className="text-sm text-gray-600">{selectedProduct.short_description}</p>
              
              <div className="flex gap-2">
                <button className="btn-primary flex-1">ویرایش محصول</button>
                <button className="btn-secondary">مشاهده کامل</button>
              </div>
            </div>
          </div>
        </PersianModal>
      )}
    </div>
  );
};

export default ProductManagement;