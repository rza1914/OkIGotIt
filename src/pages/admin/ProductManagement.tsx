import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Download,
  Upload,
  Copy,
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Image as ImageIcon,
  Tag,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Save,
  Star,
  Zap,
  Filter,
  RefreshCw,
  Globe,
  Layers,
  BarChart3
} from 'lucide-react';
import { formatPersianCurrency, formatPersianDateTime, toPersianNumber } from '../../utils/persian';

interface ProductVariant {
  id: number;
  name: string;
  value: string;
  price_adjustment: number;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  images: string[];
  category: string;
  subcategory?: string;
  price: number;
  sale_price?: number;
  currency: string;
  stock: number;
  low_stock_threshold: number;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  variants: ProductVariant[];
  specifications: { [key: string]: string };
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  tags: string[];
  weight?: number;
  dimensions?: string;
  views: number;
  sales_count: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  products_count: number;
  parent_id?: number;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'گوشی هوشمند سامسونگ Galaxy S24',
    slug: 'samsung-galaxy-s24',
    description: 'گوشی هوشمند پرچمدار سامسونگ با نمایشگر Dynamic AMOLED و دوربین 200 مگاپیکسلی',
    short_description: 'گوشی پرچمدار سامسونگ با امکانات پیشرفته',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400'
    ],
    category: 'الکترونیک',
    subcategory: 'گوشی موبایل',
    price: 35000000,
    sale_price: 32000000,
    currency: 'IRT',
    stock: 15,
    low_stock_threshold: 5,
    status: 'active',
    featured: true,
    variants: [
      { id: 1, name: 'رنگ', value: 'مشکی', price_adjustment: 0, stock: 8 },
      { id: 2, name: 'رنگ', value: 'طلایی', price_adjustment: 500000, stock: 7 },
      { id: 3, name: 'حافظه', value: '256GB', price_adjustment: 0, stock: 10 },
      { id: 4, name: 'حافظه', value: '512GB', price_adjustment: 5000000, stock: 5 }
    ],
    specifications: {
      'نمایشگر': '6.2 اینچ Dynamic AMOLED',
      'پردازنده': 'Snapdragon 8 Gen 3',
      'رم': '8GB',
      'حافظه داخلی': '256GB',
      'دوربین اصلی': '200MP',
      'باتری': '4000mAh',
      'سیستم عامل': 'Android 14'
    },
    seo_title: 'خرید گوشی سامسونگ Galaxy S24 - قیمت ویژه آیشاپ',
    seo_description: 'گوشی سامسونگ Galaxy S24 با بهترین قیمت و گارانتی معتبر در فروشگاه آیشاپ',
    seo_keywords: 'سامسونگ، Galaxy S24، گوشی هوشمند، خرید گوشی',
    tags: ['پرچمدار', '5G', 'دوربین حرفه‌ای'],
    weight: 168,
    dimensions: '147 × 71 × 7.6 mm',
    views: 2450,
    sales_count: 28,
    rating: 4.8,
    review_count: 15,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-12-20T14:20:00Z'
  },
  {
    id: 2,
    name: 'لپ‌تاپ ایسوس VivoBook Pro',
    slug: 'asus-vivobook-pro',
    description: 'لپ‌تاپ قدرتمند برای کار و بازی با پردازنده Intel Core i7 و کارت گرافیک NVIDIA',
    short_description: 'لپ‌تاپ حرفه‌ای برای کار و سرگرمی',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400'
    ],
    category: 'الکترونیک',
    subcategory: 'لپ‌تاپ',
    price: 65000000,
    currency: 'IRT',
    stock: 8,
    low_stock_threshold: 3,
    status: 'active',
    featured: false,
    variants: [
      { id: 5, name: 'رم', value: '16GB', price_adjustment: 0, stock: 5 },
      { id: 6, name: 'رم', value: '32GB', price_adjustment: 8000000, stock: 3 },
      { id: 7, name: 'حافظه', value: '512GB SSD', price_adjustment: 0, stock: 6 },
      { id: 8, name: 'حافظه', value: '1TB SSD', price_adjustment: 6000000, stock: 2 }
    ],
    specifications: {
      'پردازنده': 'Intel Core i7-12700H',
      'رم': '16GB DDR4',
      'حافظه': '512GB SSD',
      'کارت گرافیک': 'NVIDIA GeForce RTX 3050',
      'نمایشگر': '15.6 اینچ Full HD',
      'سیستم عامل': 'Windows 11'
    },
    seo_title: 'لپ‌تاپ ایسوس VivoBook Pro - قیمت فوق‌العاده',
    seo_description: 'لپ‌تاپ ایسوس VivoBook Pro با پردازنده Core i7 و کارت گرافیک مستقل',
    seo_keywords: 'ایسوس، لپ‌تاپ، VivoBook، Core i7، گیمینگ',
    tags: ['گیمینگ', 'حرفه‌ای', 'قدرتمند'],
    weight: 1800,
    dimensions: '359.4 × 233.9 × 19.9 mm',
    views: 1890,
    sales_count: 12,
    rating: 4.6,
    review_count: 8,
    created_at: '2024-02-10T15:45:00Z',
    updated_at: '2024-12-18T09:15:00Z'
  },
  {
    id: 3,
    name: 'کیف دستی چرمی زنانه',
    slug: 'womens-leather-handbag',
    description: 'کیف دستی شیک از چرم طبیعی با طراحی مدرن و جای مناسب برای وسایل روزمره',
    short_description: 'کیف دستی چرمی با کیفیت عالی',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
    ],
    category: 'فشن',
    subcategory: 'کیف و کوله',
    price: 2500000,
    sale_price: 2200000,
    currency: 'IRT',
    stock: 25,
    low_stock_threshold: 10,
    status: 'active',
    featured: true,
    variants: [
      { id: 9, name: 'رنگ', value: 'قهوه‌ای', price_adjustment: 0, stock: 12 },
      { id: 10, name: 'رنگ', value: 'مشکی', price_adjustment: 0, stock: 13 },
      { id: 11, name: 'سایز', value: 'متوسط', price_adjustment: 0, stock: 20 },
      { id: 12, name: 'سایز', value: 'بزرگ', price_adjustment: 300000, stock: 5 }
    ],
    specifications: {
      'جنس': 'چرم طبیعی گاوی',
      'نوع بسته شدن': 'زیپ',
      'تعداد جیب': '3 جیب اصلی، 2 جیب فرعی',
      'قابلیت': 'ضد آب',
      'کشور سازنده': 'ایران'
    },
    seo_title: 'کیف دستی چرمی زنانه - خرید آنلاین',
    seo_description: 'کیف دستی چرمی زنانه با کیفیت عالی و قیمت مناسب در فروشگاه آیشاپ',
    seo_keywords: 'کیف دستی، چرمی، زنانه، خرید کیف',
    tags: ['چرم طبیعی', 'زنانه', 'شیک'],
    weight: 450,
    dimensions: '35 × 25 × 15 cm',
    views: 3200,
    sales_count: 45,
    rating: 4.9,
    review_count: 32,
    created_at: '2024-03-05T11:20:00Z',
    updated_at: '2024-12-19T16:30:00Z'
  },
  {
    id: 4,
    name: 'کتاب آموزش برنامه‌نویسی پایتون',
    slug: 'python-programming-book',
    description: 'کتاب جامع آموزش برنامه‌نویسی پایتون از مبتدی تا پیشرفته با مثال‌های عملی',
    short_description: 'آموزش کامل پایتون از صفر تا صد',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
    ],
    category: 'کتاب',
    subcategory: 'فناوری اطلاعات',
    price: 450000,
    currency: 'IRT',
    stock: 50,
    low_stock_threshold: 15,
    status: 'active',
    featured: false,
    variants: [
      { id: 13, name: 'نوع', value: 'کاغذی', price_adjustment: 0, stock: 40 },
      { id: 14, name: 'نوع', value: 'PDF', price_adjustment: -200000, stock: 100 }
    ],
    specifications: {
      'نویسنده': 'دکتر علی محمدی',
      'تعداد صفحات': '520 صفحه',
      'انتشارات': 'نشر فناوران',
      'زبان': 'فارسی',
      'سال انتشار': '1403',
      'شابک': '978-964-123-456-7'
    },
    seo_title: 'کتاب آموزش پایتون - بهترین منبع یادگیری',
    seo_description: 'کتاب آموزش برنامه‌نویسی پایتون با رویکرد عملی و مثال‌های کاربردی',
    seo_keywords: 'پایتون، برنامه‌نویسی، آموزش، کتاب فناوری',
    tags: ['آموزشی', 'برنامه‌نویسی', 'پایتون'],
    weight: 800,
    dimensions: '24 × 17 × 3 cm',
    views: 1650,
    sales_count: 78,
    rating: 4.7,
    review_count: 23,
    created_at: '2024-04-12T09:10:00Z',
    updated_at: '2024-12-17T13:45:00Z'
  },
  {
    id: 5,
    name: 'ست قابلمه استیل 8 پارچه',
    slug: 'steel-cookware-set-8pcs',
    description: 'ست کامل قابلمه از جنس استیل ضد زنگ با کیفیت بالا مناسب برای تمام انواع اجاق',
    short_description: 'ست قابلمه استیل با کیفیت عالی',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      'https://images.unsplash.com/photo-1594736797933-d0e501ba2fe9?w=400'
    ],
    category: 'خانه و آشپزخانه',
    subcategory: 'لوازم پخت و پز',
    price: 3200000,
    sale_price: 2800000,
    currency: 'IRT',
    stock: 12,
    low_stock_threshold: 5,
    status: 'active',
    featured: true,
    variants: [
      { id: 15, name: 'اندازه', value: '8 پارچه', price_adjustment: 0, stock: 8 },
      { id: 16, name: 'اندازه', value: '12 پارچه', price_adjustment: 1200000, stock: 4 }
    ],
    specifications: {
      'جنس': 'استیل ضد زنگ 304',
      'تعداد قطعات': '8 قطعه',
      'مناسب برای': 'همه انواع اجاق از جمله القایی',
      'قابل شستن در ماشین': 'بله',
      'گارانتی': '2 سال',
      'کشور سازنده': 'ترکیه'
    },
    seo_title: 'ست قابلمه استیل 8 پارچه - کیفیت عالی',
    seo_description: 'ست قابلمه استیل ضد زنگ 8 پارچه با قیمت ویژه و گارانتی معتبر',
    seo_keywords: 'قابلمه، استیل، ست قابلمه، آشپزخانه',
    tags: ['آشپزخانه', 'استیل', 'مقاوم'],
    weight: 4500,
    dimensions: '45 × 35 × 25 cm',
    views: 980,
    sales_count: 19,
    rating: 4.5,
    review_count: 11,
    created_at: '2024-05-08T14:35:00Z',
    updated_at: '2024-12-16T10:20:00Z'
  }
];

const mockCategories: ProductCategory[] = [
  { id: 1, name: 'الکترونیک', slug: 'electronics', description: 'گوشی، لپ‌تاپ، و سایر لوازم الکترونیکی', products_count: 45 },
  { id: 2, name: 'فشن', slug: 'fashion', description: 'پوشاک، کیف، کفش و لوازم شخصی', products_count: 78 },
  { id: 3, name: 'کتاب', slug: 'books', description: 'کتاب‌های آموزشی، ادبی و تخصصی', products_count: 156 },
  { id: 4, name: 'خانه و آشپزخانه', slug: 'home-kitchen', description: 'لوازم خانه، آشپزخانه و تزئینات', products_count: 89 },
  { id: 5, name: 'ورزش', slug: 'sports', description: 'لوازم ورزشی و پوشاک ورزشی', products_count: 34 }
];

const statusOptions = [
  { value: 'all', label: 'همه وضعیت‌ها' },
  { value: 'active', label: 'فعال' },
  { value: 'inactive', label: 'غیرفعال' },
  { value: 'draft', label: 'پیش‌نویس' }
];

const stockStatusOptions = [
  { value: 'all', label: 'همه موجودی‌ها' },
  { value: 'in_stock', label: 'موجود' },
  { value: 'low_stock', label: 'کم موجود' },
  { value: 'out_of_stock', label: 'ناموجود' }
];

const getStatusInfo = (status: Product['status']) => {
  const statusMap = {
    active: { label: 'فعال', color: 'bg-green-100 text-green-800' },
    inactive: { label: 'غیرفعال', color: 'bg-gray-100 text-gray-800' },
    draft: { label: 'پیش‌نویس', color: 'bg-yellow-100 text-yellow-800' }
  };
  return statusMap[status] || statusMap.active;
};

const getStockStatus = (stock: number, lowThreshold: number) => {
  if (stock <= 0) return { label: 'ناموجود', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
  if (stock <= lowThreshold) return { label: 'کم موجود', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
  return { label: 'موجود', color: 'bg-green-100 text-green-800', icon: Package };
};

interface ProductFormData {
  name: string;
  description: string;
  short_description: string;
  images: string[];
  category: string;
  price: number;
  sale_price: number;
  stock: number;
  low_stock_threshold: number;
  status: Product['status'];
  featured: boolean;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  tags: string[];
  weight: number;
  dimensions: string;
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  short_description: '',
  images: [],
  category: '',
  price: 0,
  sale_price: 0,
  stock: 0,
  low_stock_threshold: 5,
  status: 'draft',
  featured: false,
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  tags: [],
  weight: 0,
  dimensions: ''
};

const ProductManagement: React.FC = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [categories] = useState<ProductCategory[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'created_at' | 'sales_count'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCategories, setShowCategories] = useState(false);
  const [bulkPriceUpdate, setBulkPriceUpdate] = useState({ percentage: 0, type: 'increase' });
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= p.low_stock_threshold).length;
    const mostViewedProduct = products.reduce((prev, current) => (prev.views > current.views) ? prev : current);
    const totalRevenue = products.reduce((sum, p) => sum + (p.sales_count * (p.sale_price || p.price)), 0);

    return { totalProducts, lowStockProducts, mostViewedProduct, totalRevenue };
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.includes(searchTerm) ||
        product.description.includes(searchTerm) ||
        product.tags.some(tag => tag.includes(searchTerm))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter !== 'all') {
      switch (stockFilter) {
        case 'in_stock':
          filtered = filtered.filter(product => product.stock > product.low_stock_threshold);
          break;
        case 'low_stock':
          filtered = filtered.filter(product => product.stock > 0 && product.stock <= product.low_stock_threshold);
          break;
        case 'out_of_stock':
          filtered = filtered.filter(product => product.stock <= 0);
          break;
      }
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      const min = priceRange.min ? parseFloat(priceRange.min) : 0;
      const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      filtered = filtered.filter(product => {
        const price = product.sale_price || product.price;
        return price >= min && price <= max;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = (a.sale_price || a.price) - (b.sale_price || b.price);
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'sales_count':
          comparison = a.sales_count - b.sales_count;
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [products, searchTerm, statusFilter, categoryFilter, stockFilter, priceRange, sortBy, sortOrder]);

  const handleSort = (field: 'name' | 'price' | 'stock' | 'created_at' | 'sales_count') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const handleAddProduct = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      short_description: product.short_description,
      images: product.images,
      category: product.category,
      price: product.price,
      sale_price: product.sale_price || 0,
      stock: product.stock,
      low_stock_threshold: product.low_stock_threshold,
      status: product.status,
      featured: product.featured,
      seo_title: product.seo_title || '',
      seo_description: product.seo_description || '',
      seo_keywords: product.seo_keywords || '',
      tags: product.tags,
      weight: product.weight || 0,
      dimensions: product.dimensions || ''
    });
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      console.log('Updating product:', formData);
    } else {
      console.log('Creating product:', formData);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      console.log('Deleting product:', productId);
    }
  };

  const handleDuplicateProduct = (product: Product) => {
    console.log('Duplicating product:', product.id);
    const duplicatedProduct = { ...product, name: `${product.name} (کپی)`, id: Date.now() };
    console.log('Duplicated product data:', duplicatedProduct);
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedProducts.length === 0) return;
    
    const actionText = action === 'activate' ? 'فعال‌سازی' : action === 'deactivate' ? 'غیرفعال‌سازی' : 'حذف';
    if (confirm(`آیا از ${actionText} محصولات انتخاب شده اطمینان دارید؟`)) {
      console.log(`Bulk ${action}:`, selectedProducts);
      setSelectedProducts([]);
    }
  };

  const handleBulkPriceUpdate = () => {
    if (selectedProducts.length === 0 || bulkPriceUpdate.percentage <= 0) return;
    
    if (confirm(`آیا از ${bulkPriceUpdate.type === 'increase' ? 'افزایش' : 'کاهش'} ${bulkPriceUpdate.percentage}% قیمت محصولات انتخاب شده اطمینان دارید؟`)) {
      console.log('Bulk price update:', { products: selectedProducts, ...bulkPriceUpdate });
      setShowBulkPriceModal(false);
      setSelectedProducts([]);
    }
  };

  const handleExportProducts = () => {
    console.log('Exporting products to CSV/Excel');
  };

  const handleImportProducts = () => {
    console.log('Importing products from CSV');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">مدیریت محصولات</h1>
        <p className="text-gray-600">مدیریت جامع محصولات، دسته‌بندی‌ها و موجودی</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">کل محصولات</p>
              <p className="text-2xl font-bold text-gray-900">
                {toPersianNumber(stats.totalProducts)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">هشدار موجودی</p>
              <p className="text-2xl font-bold text-orange-600">
                {toPersianNumber(stats.lowStockProducts)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">پربازدیدترین</p>
              <p className="text-lg font-bold text-purple-600 truncate">
                {stats.mostViewedProduct.name}
              </p>
              <p className="text-sm text-gray-500">
                {toPersianNumber(stats.mostViewedProduct.views)} بازدید
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">درآمد کل</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPersianCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="space-y-4">
          {/* First Row - Search and Basic Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام، توضیحات، برچسب..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">همه دسته‌بندی‌ها</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name} ({toPersianNumber(category.products_count)})
                  </option>
                ))}
              </select>

              {/* Stock Filter */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                {stockStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Second Row - Price Range and Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Price Range */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">قیمت:</span>
                <input
                  type="number"
                  placeholder="از"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
                <span className="text-gray-400">تا</span>
                <input
                  type="number"
                  placeholder="تا"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
                <button
                  onClick={() => setPriceRange({ min: '', max: '' })}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  title="پاک کردن فیلتر قیمت"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              {selectedProducts.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    فعال‌سازی
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                  >
                    غیرفعال‌سازی
                  </button>
                  <button
                    onClick={() => setShowBulkPriceModal(true)}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                  >
                    تغییر قیمت
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    حذف ({toPersianNumber(selectedProducts.length)})
                  </button>
                </div>
              )}
              
              <button
                onClick={() => setShowCategories(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Tag className="h-5 w-5" />
                <span>دسته‌بندی‌ها</span>
              </button>

              <button
                onClick={handleImportProducts}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Upload className="h-5 w-5" />
                <span>واردات</span>
              </button>
              
              <button
                onClick={handleExportProducts}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="h-5 w-5" />
                <span>خروجی</span>
              </button>
              
              <button
                onClick={handleAddProduct}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                <span>محصول جدید</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-right">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">تصویر</th>
                <th 
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    <span>نام محصول</span>
                    {sortBy === 'name' && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">دسته‌بندی</th>
                <th 
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-1">
                    <span>قیمت</span>
                    {sortBy === 'price' && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('stock')}
                >
                  <div className="flex items-center gap-1">
                    <span>موجودی</span>
                    {sortBy === 'stock' && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">وضعیت</th>
                <th 
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('sales_count')}
                >
                  <div className="flex items-center gap-1">
                    <span>فروش</span>
                    {sortBy === 'sales_count' && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const statusInfo = getStatusInfo(product.status);
                const stockStatus = getStockStatus(product.stock, product.low_stock_threshold);
                const StockIcon = stockStatus.icon;

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        {product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 line-clamp-1">
                          {product.name}
                          {product.featured && (
                            <Star className="inline-block h-4 w-4 text-yellow-500 mr-1" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {product.short_description}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <TrendingUp className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {toPersianNumber(product.views)} بازدید
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs text-gray-500">
                              {product.rating} ({toPersianNumber(product.review_count)})
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {product.category}
                      </span>
                      {product.subcategory && (
                        <span className="block text-xs text-gray-500 mt-1">
                          {product.subcategory}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {product.sale_price ? (
                          <>
                            <span className="font-semibold text-green-600">
                              {formatPersianCurrency(product.sale_price)}
                            </span>
                            <span className="block text-sm text-gray-500 line-through">
                              {formatPersianCurrency(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold text-gray-900">
                            {formatPersianCurrency(product.price)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                        <StockIcon className="h-4 w-4" />
                        {toPersianNumber(product.stock)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {stockStatus.label}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {toPersianNumber(product.sales_count)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                          title="مشاهده محصول"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                          title="ویرایش"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateProduct(product)}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg"
                          title="کپی محصول"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <div className="relative group">
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          <div className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <div className="p-1 min-w-48">
                              {statusOptions.slice(1).map(status => (
                                <button
                                  key={status.value}
                                  onClick={() => console.log(`Change status to ${status.value}`)}
                                  className="w-full text-right px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                >
                                  تغییر به {status.label}
                                </button>
                              ))}
                              <hr className="my-1" />
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="w-full text-right px-3 py-2 text-sm hover:bg-gray-100 rounded text-red-600 flex items-center gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                حذف محصول
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">
                {isEditing ? 'ویرایش محصول' : 'محصول جدید'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Information */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">اطلاعات اصلی</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">نام محصول</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="نام جذاب محصول"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">توضیح کوتاه</label>
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.short_description}
                          onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                          placeholder="توضیح مختصر محصول"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات کامل</label>
                        <textarea
                          rows={6}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="توضیحات جامع محصول شامل ویژگی‌ها و مزایا"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
                          <select
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          >
                            <option value="">انتخاب دسته‌بندی</option>
                            {categories.map(category => (
                              <option key={category.id} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Product['status'] }))}
                          >
                            <option value="draft">پیش‌نویس</option>
                            <option value="active">فعال</option>
                            <option value="inactive">غیرفعال</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">قیمت‌گذاری</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">قیمت اصلی (تومان)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">قیمت فروش (اختیاری)</label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.sale_price}
                          onChange={(e) => setFormData(prev => ({ ...prev, sale_price: Number(e.target.value) }))}
                          placeholder="قیمت با تخفیف"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inventory */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">موجودی</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تعداد موجودی</label>
                        <input
                          type="number"
                          required
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.stock}
                          onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">حد هشدار کم موجودی</label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.low_stock_threshold}
                          onChange={(e) => setFormData(prev => ({ ...prev, low_stock_threshold: Number(e.target.value) }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Additional Information */}
                <div className="space-y-6">
                  {/* Images */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">تصاویر محصول</h4>
                    <div className="space-y-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="url"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={image}
                            onChange={(e) => {
                              const newImages = [...formData.images];
                              newImages[index] = e.target.value;
                              setFormData(prev => ({ ...prev, images: newImages }));
                            }}
                            placeholder="https://example.com/image.jpg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = formData.images.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, images: newImages }));
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 w-full justify-center"
                      >
                        <Plus className="h-4 w-4" />
                        افزودن تصویر
                      </button>
                    </div>
                  </div>

                  {/* SEO Settings */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      تنظیمات سئو
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">عنوان سئو</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.seo_title}
                          onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                          placeholder="عنوان برای موتورهای جستجو"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات سئو</label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.seo_description}
                          onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                          placeholder="توضیح مختصر برای موتورهای جستجو"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">کلمات کلیدی</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.seo_keywords}
                          onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                          placeholder="کلمه کلیدی 1، کلمه کلیدی 2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">برچسب‌ها</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.tags.join(', ')}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      }))}
                      placeholder="پرچمدار، محبوب، ویژه (برچسب‌ها را با کاما جدا کنید)"
                    />
                  </div>

                  {/* Physical Properties */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">مشخصات فیزیکی</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">وزن (گرم)</label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.weight}
                          onChange={(e) => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ابعاد</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.dimensions}
                          onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                          placeholder="30 × 20 × 10 سانتی‌متر"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Featured Product */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      محصول ویژه (نمایش در بخش محصولات ویژه)
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  {isEditing ? 'به‌روزرسانی محصول' : 'ایجاد محصول'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      {showCategories && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">مدیریت دسته‌بندی‌ها</h3>
              <button
                onClick={() => setShowCategories(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  افزودن دسته‌بندی جدید
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(category => (
                  <div key={category.id} className="p-4 border rounded-lg hover:shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-400">
                            {toPersianNumber(category.products_count)} محصول
                          </span>
                          <span className="text-xs text-blue-600">
                            /{category.slug}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Price Update Modal */}
      {showBulkPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">تغییر قیمت انبوه</h3>
              <button
                onClick={() => setShowBulkPriceModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع تغییر</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={bulkPriceUpdate.type}
                  onChange={(e) => setBulkPriceUpdate(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="increase">افزایش قیمت</option>
                  <option value="decrease">کاهش قیمت</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">درصد تغییر</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={bulkPriceUpdate.percentage}
                  onChange={(e) => setBulkPriceUpdate(prev => ({ ...prev, percentage: Number(e.target.value) }))}
                  placeholder="مثال: 10"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  {bulkPriceUpdate.type === 'increase' ? 'افزایش' : 'کاهش'} {toPersianNumber(bulkPriceUpdate.percentage)}% 
                  قیمت برای {toPersianNumber(selectedProducts.length)} محصول انتخاب شده
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowBulkPriceModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  onClick={handleBulkPriceUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  اعمال تغییر
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;