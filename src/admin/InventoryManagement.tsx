import React, { useState, useEffect } from 'react';
import { 
  Package, AlertTriangle, TrendingDown, TrendingUp, RefreshCw,
  Search, Filter, Download, Edit, History, Bell, Settings,
  BarChart3, Calendar, Clock, CheckCircle, X, Plus, Minus,
  Archive, RotateCcw, Truck, ShoppingCart, Eye, ExternalLink
} from 'lucide-react';
import { 
  formatPersianCurrency, formatPersianNumber, 
  getRelativeTime, formatPersianDateTime, toPersianNumber 
} from '../utils/persian';
import PersianModal from './components/PersianModal';
import StatusBadge from './components/StatusBadge';
import BulkActions from './components/BulkActions';

interface InventoryItem {
  id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  product_image: string;
  category_name: string;
  brand: string;
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  low_stock_threshold: number;
  max_stock_level: number;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'reserved';
  cost_price: number;
  last_restock_date: string;
  last_sale_date: string;
  total_sales: number;
  stock_value: number;
  supplier: string;
  location: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface StockMovement {
  id: string;
  product_id: string;
  product_name: string;
  type: 'in' | 'out' | 'adjustment' | 'reserved' | 'unreserved';
  quantity: number;
  reason: string;
  reference_id?: string;
  reference_type?: 'order' | 'purchase' | 'adjustment' | 'return';
  cost_price?: number;
  notes: string;
  user_name: string;
  created_at: string;
}

interface LowStockAlert {
  id: string;
  product_id: string;
  product_name: string;
  current_stock: number;
  threshold: number;
  severity: 'warning' | 'critical';
  created_at: string;
  acknowledged: boolean;
}

const InventoryManagement: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [adjustmentData, setAdjustmentData] = useState({
    type: 'adjustment' as 'in' | 'out' | 'adjustment',
    quantity: 0,
    reason: '',
    notes: ''
  });

  // Mock data - replace with API call
  useEffect(() => {
    const mockInventoryItems: InventoryItem[] = [
      {
        id: '1',
        product_id: 'p1',
        product_name: 'آیفون ۱۵ پرو ۲۵۶ گیگابایت',
        product_sku: 'IP15P-256-BLU',
        product_image: '/api/placeholder/60/60',
        category_name: 'گوشی هوشمند',
        brand: 'Apple',
        current_stock: 15,
        reserved_stock: 3,
        available_stock: 12,
        low_stock_threshold: 10,
        max_stock_level: 50,
        stock_status: 'in_stock',
        cost_price: 38000000,
        last_restock_date: '2024-01-15T10:00:00Z',
        last_sale_date: '2024-01-20T14:30:00Z',
        total_sales: 45,
        stock_value: 570000000,
        supplier: 'تامین‌کننده اصلی',
        location: 'انبار مرکزی - قفسه A1',
        notes: 'محصول پرطرفدار',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-20T15:45:00Z'
      },
      {
        id: '2',
        product_id: 'p2',
        product_name: 'سامسونگ گلکسی S24 Ultra',
        product_sku: 'SGS24U-512-GRY',
        product_image: '/api/placeholder/60/60',
        category_name: 'گوشی هوشمند',
        brand: 'Samsung',
        current_stock: 3,
        reserved_stock: 1,
        available_stock: 2,
        low_stock_threshold: 8,
        max_stock_level: 30,
        stock_status: 'low_stock',
        cost_price: 32000000,
        last_restock_date: '2024-01-10T08:00:00Z',
        last_sale_date: '2024-01-19T16:20:00Z',
        total_sales: 28,
        stock_value: 96000000,
        supplier: 'توزیع‌کننده سامسونگ',
        location: 'انبار مرکزی - قفسه B2',
        notes: 'نیاز به تکمیل فوری',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-19T17:10:00Z'
      },
      {
        id: '3',
        product_id: 'p3',
        product_name: 'مک‌بوک ایر M3 ۱۳ اینچ',
        product_sku: 'MBA-M3-13-SLV',
        product_image: '/api/placeholder/60/60',
        category_name: 'لپ‌تاپ',
        brand: 'Apple',
        current_stock: 0,
        reserved_stock: 0,
        available_stock: 0,
        low_stock_threshold: 5,
        max_stock_level: 20,
        stock_status: 'out_of_stock',
        cost_price: 45000000,
        last_restock_date: '2024-01-05T12:00:00Z',
        last_sale_date: '2024-01-18T11:45:00Z',
        total_sales: 12,
        stock_value: 0,
        supplier: 'نمایندگی اپل',
        location: 'انبار مرکزی - قفسه C1',
        notes: 'در انتظار تامین مجدد',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-18T12:00:00Z'
      }
    ];

    const mockStockMovements: StockMovement[] = [
      {
        id: '1',
        product_id: 'p1',
        product_name: 'آیفون ۱۵ پرو ۲۵۶ گیگابایت',
        type: 'out',
        quantity: -1,
        reason: 'فروش',
        reference_id: 'ORD-2024-001',
        reference_type: 'order',
        notes: 'فروش به مشتری علی احمدی',
        user_name: 'مدیر فروشگاه',
        created_at: '2024-01-20T14:30:00Z'
      },
      {
        id: '2',
        product_id: 'p1',
        product_name: 'آیفون ۱۵ پرو ۲۵۶ گیگابایت',
        type: 'in',
        quantity: 20,
        reason: 'خرید جدید',
        reference_id: 'PUR-2024-003',
        reference_type: 'purchase',
        cost_price: 38000000,
        notes: 'خرید از تامین‌کننده اصلی',
        user_name: 'مدیر خرید',
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '3',
        product_id: 'p2',
        product_name: 'سامسونگ گلکسی S24 Ultra',
        type: 'adjustment',
        quantity: -2,
        reason: 'کسری انبار',
        notes: 'کسری مشاهده شده در بررسی انبار',
        user_name: 'مدیر انبار',
        created_at: '2024-01-18T09:30:00Z'
      }
    ];

    const mockLowStockAlerts: LowStockAlert[] = [
      {
        id: '1',
        product_id: 'p2',
        product_name: 'سامسونگ گلکسی S24 Ultra',
        current_stock: 3,
        threshold: 8,
        severity: 'critical',
        created_at: '2024-01-19T17:10:00Z',
        acknowledged: false
      },
      {
        id: '2',
        product_id: 'p3',
        product_name: 'مک‌بوک ایر M3 ۱۳ اینچ',
        current_stock: 0,
        threshold: 5,
        severity: 'critical',
        created_at: '2024-01-18T12:00:00Z',
        acknowledged: false
      }
    ];

    setTimeout(() => {
      setInventoryItems(mockInventoryItems);
      setFilteredItems(mockInventoryItems);
      setStockMovements(mockStockMovements);
      setLowStockAlerts(mockLowStockAlerts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter inventory items
  useEffect(() => {
    let filtered = inventoryItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.stock_status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category_name === categoryFilter);
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [inventoryItems, searchTerm, statusFilter, categoryFilter]);

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-100 border-green-200';
      case 'low_stock': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'out_of_stock': return 'text-red-600 bg-red-100 border-red-200';
      case 'reserved': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStockStatusTranslation = (status: string) => {
    const translations = {
      in_stock: 'موجود',
      low_stock: 'کم موجودی',
      out_of_stock: 'ناموجود',
      reserved: 'رزرو شده'
    };
    return translations[status as keyof typeof translations] || status;
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in': return 'text-green-600 bg-green-100';
      case 'out': return 'text-red-600 bg-red-100';
      case 'adjustment': return 'text-blue-600 bg-blue-100';
      case 'reserved': return 'text-orange-600 bg-orange-100';
      case 'unreserved': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMovementTypeTranslation = (type: string) => {
    const translations = {
      in: 'ورود کالا',
      out: 'خروج کالا',
      adjustment: 'تعدیل موجودی',
      reserved: 'رزرو موجودی',
      unreserved: 'لغو رزرو'
    };
    return translations[type as keyof typeof translations] || type;
  };

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === currentItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(currentItems.map(item => item.id)));
    }
  };

  const handleBulkAction = (actionKey: string) => {
    if (!actionKey || selectedItems.size === 0) return;

    switch (actionKey) {
      case 'restock':
        // Open bulk restock modal
        console.log('Bulk restock for items:', Array.from(selectedItems));
        break;
      case 'adjust':
        // Open bulk adjustment modal
        console.log('Bulk adjustment for items:', Array.from(selectedItems));
        break;
      case 'export':
        // Export selected items
        console.log('Export items:', Array.from(selectedItems));
        break;
      default:
        console.log(`Performing ${actionKey} on items:`, Array.from(selectedItems));
    }
    
    setSelectedItems(new Set());
  };

  const handleStockAdjustment = () => {
    if (!selectedProduct || adjustmentData.quantity === 0) return;

    const newMovement: StockMovement = {
      id: Math.random().toString(36).substr(2, 9),
      product_id: selectedProduct.product_id,
      product_name: selectedProduct.product_name,
      type: adjustmentData.type,
      quantity: adjustmentData.type === 'out' ? -Math.abs(adjustmentData.quantity) : Math.abs(adjustmentData.quantity),
      reason: adjustmentData.reason,
      notes: adjustmentData.notes,
      user_name: 'مدیر انبار',
      created_at: new Date().toISOString()
    };

    // Update inventory
    setInventoryItems(prev => prev.map(item => {
      if (item.id === selectedProduct.id) {
        const newStock = item.current_stock + newMovement.quantity;
        return {
          ...item,
          current_stock: Math.max(0, newStock),
          available_stock: Math.max(0, newStock - item.reserved_stock),
          stock_status: newStock === 0 ? 'out_of_stock' : newStock <= item.low_stock_threshold ? 'low_stock' : 'in_stock',
          stock_value: Math.max(0, newStock) * item.cost_price,
          updated_at: new Date().toISOString()
        };
      }
      return item;
    }));

    // Add movement record
    setStockMovements(prev => [newMovement, ...prev]);

    // Reset and close modal
    setAdjustmentData({
      type: 'adjustment',
      quantity: 0,
      reason: '',
      notes: ''
    });
    setShowAdjustmentModal(false);
    setSelectedProduct(null);
  };

  const acknowledgeAlert = (alertId: string) => {
    setLowStockAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const inventoryBulkActions = [
    {
      key: 'restock',
      label: 'تکمیل موجودی',
      icon: Plus,
      color: 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
    },
    {
      key: 'adjust',
      label: 'تعدیل موجودی',
      icon: Edit,
      color: 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100'
    },
    {
      key: 'reserve',
      label: 'رزرو موجودی',
      icon: Archive
    },
    {
      key: 'export',
      label: 'صدور گزارش',
      icon: Download
    }
  ];

  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + item.stock_value, 0);
  const lowStockCount = inventoryItems.filter(item => item.stock_status === 'low_stock').length;
  const outOfStockCount = inventoryItems.filter(item => item.stock_status === 'out_of_stock').length;
  const totalProducts = inventoryItems.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگیری موجودی انبار...</p>
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
            مدیریت موجودی انبار
          </h1>
          <p className="text-gray-600 mt-1">
            مجموع {formatPersianNumber(filteredItems.length)} محصول
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowMovementModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            تاریخچه تحرکات
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            گزارش موجودی
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            تعدیل موجودی
          </button>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockAlerts.filter(alert => !alert.acknowledged).length > 0 && (
        <div className="card p-4 bg-red-50 border border-red-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              هشدارهای موجودی
            </h3>
            <span className="text-sm text-red-700">
              {formatPersianNumber(lowStockAlerts.filter(alert => !alert.acknowledged).length)} هشدار فعال
            </span>
          </div>
          
          <div className="space-y-2">
            {lowStockAlerts.filter(alert => !alert.acknowledged).slice(0, 3).map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${alert.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.product_name}</p>
                    <p className="text-xs text-gray-500">
                      موجودی فعلی: {formatPersianNumber(alert.current_stock)} | 
                      حد مجاز: {formatPersianNumber(alert.threshold)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="text-sm text-red-600 hover:text-red-800 px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50"
                >
                  تایید
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">کل محصولات</p>
              <p className="text-2xl font-bold text-blue-900">{formatPersianNumber(totalProducts)}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">ارزش کل موجودی</p>
              <p className="text-lg font-bold text-green-900">
                {formatPersianCurrency(totalInventoryValue)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="card p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">کم موجودی</p>
              <p className="text-2xl font-bold text-yellow-900">{formatPersianNumber(lowStockCount)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="card p-4 bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">ناموجود</p>
              <p className="text-2xl font-bold text-red-900">{formatPersianNumber(outOfStockCount)}</p>
            </div>
            <X className="w-8 h-8 text-red-600" />
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
              placeholder="جستجو بر اساس نام محصول، SKU یا برند..."
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
            <option value="in_stock">موجود</option>
            <option value="low_stock">کم موجودی</option>
            <option value="out_of_stock">ناموجود</option>
            <option value="reserved">رزرو شده</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <option value="all">همه دسته‌ها</option>
            <option value="گوشی هوشمند">گوشی هوشمند</option>
            <option value="لپ‌تاپ">لپ‌تاپ</option>
            <option value="تبلت">تبلت</option>
            <option value="لوازم جانبی">لوازم جانبی</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedItems.size}
        actions={inventoryBulkActions}
        onAction={handleBulkAction}
        onClearSelection={() => setSelectedItems(new Set())}
      />

      {/* Inventory Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === currentItems.length && currentItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  محصول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  موجودی فعلی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رزرو شده
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  موجودی قابل فروش
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ارزش موجودی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آخرین تحرک
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </div>
                      <div className="mr-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {item.product_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {item.product_sku} • {item.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {formatPersianNumber(item.current_stock)}
                      </span>
                      {item.current_stock <= item.low_stock_threshold && item.current_stock > 0 && (
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                      )}
                      {item.current_stock === 0 && (
                        <X className="w-4 h-4 text-red-500 mr-2" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      حد مجاز: {formatPersianNumber(item.low_stock_threshold)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {formatPersianNumber(item.reserved_stock)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {formatPersianNumber(item.available_stock)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${getStockStatusColor(item.stock_status)}`}>
                      {getStockStatusTranslation(item.stock_status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPersianCurrency(item.stock_value)}
                    </div>
                    <div className="text-xs text-gray-500">
                      قیمت واحد: {formatPersianCurrency(item.cost_price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getRelativeTime(new Date(item.last_sale_date || item.updated_at))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(item);
                          setShowAdjustmentModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="تعدیل موجودی"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="تاریخچه تحرکات"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                        title="مشاهده محصول"
                      >
                        <Eye className="w-4 h-4" />
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
                نمایش {formatPersianNumber(indexOfFirstItem + 1)} تا {formatPersianNumber(Math.min(indexOfLastItem, filteredItems.length))} از {formatPersianNumber(filteredItems.length)} مورد
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

      {/* Stock Adjustment Modal */}
      <PersianModal
        isOpen={showAdjustmentModal}
        onClose={() => setShowAdjustmentModal(false)}
        title={selectedProduct ? `تعدیل موجودی: ${selectedProduct.product_name}` : 'تعدیل موجودی'}
        size="md"
        footerActions={
          <>
            <button onClick={() => setShowAdjustmentModal(false)} className="btn-secondary">
              انصراف
            </button>
            <button onClick={handleStockAdjustment} className="btn-primary">
              اعمال تغییرات
            </button>
          </>
        }
      >
        {selectedProduct && (
          <div className="space-y-6">
            {/* Current Stock Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-3">وضعیت فعلی موجودی</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPersianNumber(selectedProduct.current_stock)}
                  </p>
                  <p className="text-sm text-gray-500">موجودی فعلی</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPersianNumber(selectedProduct.reserved_stock)}
                  </p>
                  <p className="text-sm text-gray-500">رزرو شده</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {formatPersianNumber(selectedProduct.available_stock)}
                  </p>
                  <p className="text-sm text-gray-500">قابل فروش</p>
                </div>
              </div>
            </div>

            {/* Adjustment Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع تعدیل
                </label>
                <select
                  value={adjustmentData.type}
                  onChange={(e) => setAdjustmentData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="in">افزایش موجودی (ورود کالا)</option>
                  <option value="out">کاهش موجودی (خروج کالا)</option>
                  <option value="adjustment">تعدیل موجودی</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مقدار تغییر
                </label>
                <input
                  type="number"
                  value={adjustmentData.quantity || ''}
                  onChange={(e) => setAdjustmentData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="تعداد"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دلیل تغییر
                </label>
                <select
                  value={adjustmentData.reason}
                  onChange={(e) => setAdjustmentData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">انتخاب دلیل</option>
                  <option value="خرید جدید">خرید جدید</option>
                  <option value="مرجوعی">مرجوعی</option>
                  <option value="کسری انبار">کسری انبار</option>
                  <option value="اضافی انبار">اضافی انبار</option>
                  <option value="معیوب">معیوب</option>
                  <option value="انتقال بین انبارها">انتقال بین انبارها</option>
                  <option value="سایر">سایر</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات
                </label>
                <textarea
                  value={adjustmentData.notes}
                  onChange={(e) => setAdjustmentData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  placeholder="توضیحات اضافی..."
                />
              </div>
            </div>

            {/* Preview */}
            {adjustmentData.quantity > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h5 className="font-medium text-blue-900 mb-2">پیش‌نمایش تغییرات</h5>
                <div className="flex items-center justify-between text-sm">
                  <span>موجودی فعلی:</span>
                  <span>{formatPersianNumber(selectedProduct.current_stock)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>تغییر:</span>
                  <span className={adjustmentData.type === 'out' ? 'text-red-600' : 'text-green-600'}>
                    {adjustmentData.type === 'out' ? '-' : '+'}{formatPersianNumber(adjustmentData.quantity)}
                  </span>
                </div>
                <div className="border-t border-blue-300 mt-2 pt-2 flex items-center justify-between font-medium">
                  <span>موجودی جدید:</span>
                  <span>
                    {formatPersianNumber(
                      Math.max(0, selectedProduct.current_stock + 
                      (adjustmentData.type === 'out' ? -adjustmentData.quantity : adjustmentData.quantity))
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </PersianModal>

      {/* Stock Movements Modal */}
      <PersianModal
        isOpen={showMovementModal}
        onClose={() => setShowMovementModal(false)}
        title="تاریخچه تحرکات موجودی"
        size="xl"
      >
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    محصول
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    نوع تحرک
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    مقدار
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    دلیل
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    کاربر
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    تاریخ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockMovements.slice(0, 10).map((movement) => (
                  <tr key={movement.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {movement.product_name}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${getMovementTypeColor(movement.type)}`}>
                        {getMovementTypeTranslation(movement.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                        {movement.quantity > 0 ? '+' : ''}{formatPersianNumber(movement.quantity)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {movement.reason}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {movement.user_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {getRelativeTime(new Date(movement.created_at))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PersianModal>
    </div>
  );
};

export default InventoryManagement;