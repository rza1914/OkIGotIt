import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Filter, Download, Eye, Edit, Trash2, Plus,
  CheckCircle, Clock, Truck, Package, AlertTriangle, RefreshCw,
  CreditCard, MapPin, Phone, User, Calendar, DollarSign, Printer,
  ChevronDown, ChevronUp, X, Check, FileText, Mail
} from 'lucide-react';
import { 
  formatPersianCurrency, formatPersianNumber, getPersianStatus, 
  getRelativeTime, formatPersianDateTime, toPersianNumber 
} from '../utils/persian';
import OrderDetailsModal from './OrderDetailsModal';
import BulkActions, { orderBulkActions } from './components/BulkActions';
import ExportModal from './components/ExportModal';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'registered' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  trackingNumber?: string;
  shippingCompany?: string;
  createdAt: string;
  updatedAt: string;
  notes: string[];
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

  // Mock data - replace with API call
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        customer: {
          name: 'علی احمدی',
          email: 'ali.ahmadi@example.com',
          phone: '09123456789',
          address: 'تهران، خیابان ولیعصر، پلاک 123'
        },
        items: [
          {
            id: 'p1',
            productName: 'آیفون 15 پرو 256GB',
            quantity: 1,
            price: 45000000,
            image: '/api/placeholder/64/64'
          },
          {
            id: 'p2',
            productName: 'کاور چرمی آیفون',
            quantity: 1,
            price: 899000,
            image: '/api/placeholder/64/64'
          }
        ],
        totalAmount: 45899000,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'کارت بانکی',
        trackingNumber: 'TRK123456789',
        shippingCompany: 'پست پیشتاز',
        createdAt: '2024-01-20T10:30:00Z',
        updatedAt: '2024-01-20T14:15:00Z',
        notes: ['مشتری درخواست تحویل در منزل دارد', 'پرداخت با موفقیت انجام شد']
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        customer: {
          name: 'فاطمه محمدی',
          email: 'fateme.mohammadi@example.com',
          phone: '09987654321',
          address: 'مشهد، خیابان احمدآباد، کوچه سوم، پلاک 45'
        },
        items: [
          {
            id: 'p3',
            productName: 'سامسونگ گلکسی S24 Ultra',
            quantity: 1,
            price: 38000000,
            image: '/api/placeholder/64/64'
          }
        ],
        totalAmount: 38000000,
        status: 'preparing',
        paymentStatus: 'paid',
        paymentMethod: 'پرداخت آنلاین',
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: '2024-01-20T16:30:00Z',
        notes: ['سفارش در حال آماده‌سازی است']
      },
      {
        id: '3',
        orderNumber: 'ORD-2024-003',
        customer: {
          name: 'محمد رضایی',
          email: 'mohammad.rezaei@example.com',
          phone: '09334567890',
          address: 'اصفهان، خیابان چهارباغ، مجتمع پارسیان، واحد 45'
        },
        items: [
          {
            id: 'p4',
            productName: 'مک‌بوک ایر M3',
            quantity: 1,
            price: 52000000,
            image: '/api/placeholder/64/64'
          }
        ],
        totalAmount: 52000000,
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'پرداخت در محل',
        trackingNumber: 'TRK987654321',
        shippingCompany: 'تیپاکس',
        createdAt: '2024-01-19T14:20:00Z',
        updatedAt: '2024-01-20T08:45:00Z',
        notes: ['ارسال شده - تحویل تا 2 روز آینده']
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
      }
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'registered': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'preparing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      case 'returned': return <RefreshCw className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'confirmed': return 'text-green-600 bg-green-100 border-green-200';
      case 'preparing': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'shipped': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'delivered': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      case 'returned': return 'text-orange-600 bg-orange-100 border-orange-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusTranslation = (status: string) => {
    const translations = {
      registered: 'ثبت شده',
      confirmed: 'تایید شده',
      preparing: 'آماده‌سازی',
      shipped: 'ارسال شده',
      delivered: 'تحویل شده',
      cancelled: 'لغو شده',
      returned: 'مرجوعی'
    };
    return translations[status as keyof typeof translations] || status;
  };

  const handleSelectOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(order => order.id)));
    }
  };

  const handleBulkAction = (actionKey: string) => {
    if (!actionKey || selectedOrders.size === 0) return;

    // Handle different bulk actions
    switch (actionKey) {
      case 'confirm':
        setOrders(prevOrders =>
          prevOrders.map(order =>
            selectedOrders.has(order.id)
              ? { ...order, status: 'confirmed' as any, updatedAt: new Date().toISOString() }
              : order
          )
        );
        break;
      case 'cancel':
        setOrders(prevOrders =>
          prevOrders.map(order =>
            selectedOrders.has(order.id)
              ? { ...order, status: 'cancelled' as any, updatedAt: new Date().toISOString() }
              : order
          )
        );
        break;
      case 'ship':
        setOrders(prevOrders =>
          prevOrders.map(order =>
            selectedOrders.has(order.id)
              ? { ...order, status: 'shipped' as any, updatedAt: new Date().toISOString() }
              : order
          )
        );
        break;
      case 'export':
        setShowExportModal(true);
        return; // Don't reset selections for export
      default:
        console.log(`Performing ${actionKey} on orders:`, Array.from(selectedOrders));
    }
    
    // Reset selections
    setSelectedOrders(new Set());
  };

  const handleExport = (options: any) => {
    // Implement export logic here
    console.log('Exporting with options:', options);
    // This would typically call an API to generate the export file
    return Promise.resolve();
  };

  // Pagination
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگیری سفارشات...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
              مدیریت سفارشات
            </h1>
            <p className="text-gray-600 mt-1">
              مجموع {formatPersianNumber(filteredOrders.length)} سفارش
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
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              سفارش جدید
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
                placeholder="جستجو بر اساس شماره سفارش، نام مشتری یا ایمیل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pr-10 pl-3 py-2 border border-rose-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm"
              />
            </div>

            {/* Quick Status Filters */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { key: 'all', label: 'همه', count: orders.length },
                { key: 'registered', label: 'ثبت شده', count: orders.filter(o => o.status === 'registered').length },
                { key: 'confirmed', label: 'تایید شده', count: orders.filter(o => o.status === 'confirmed').length },
                { key: 'preparing', label: 'آماده‌سازی', count: orders.filter(o => o.status === 'preparing').length },
                { key: 'shipped', label: 'ارسال شده', count: orders.filter(o => o.status === 'shipped').length },
                { key: 'delivered', label: 'تحویل شده', count: orders.filter(o => o.status === 'delivered').length }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    statusFilter === filter.key
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {filter.label}
                  <span className="text-xs bg-white px-1.5 py-0.5 rounded-full">
                    {formatPersianNumber(filter.count)}
                  </span>
                </button>
              ))}
            </div>

            {/* Advanced Filters Toggle */}
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="all">همه تاریخ‌ها</option>
                    <option value="today">امروز</option>
                    <option value="week">هفته گذشته</option>
                    <option value="month">ماه گذشته</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">مبلغ</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="از"
                      className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="text"
                      placeholder="تا"
                      className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">روش پرداخت</label>
                  <select className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400">
                    <option value="">همه روش‌ها</option>
                    <option value="card">کارت بانکی</option>
                    <option value="online">پرداخت آنلاین</option>
                    <option value="cash">پرداخت در محل</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت پرداخت</label>
                  <select className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400">
                    <option value="">همه وضعیت‌ها</option>
                    <option value="paid">پرداخت شده</option>
                    <option value="pending">در انتظار</option>
                    <option value="failed">ناموفق</option>
                    <option value="refunded">بازپرداخت شده</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        <BulkActions
          selectedCount={selectedOrders.size}
          actions={orderBulkActions}
          onAction={handleBulkAction}
          onClearSelection={() => setSelectedOrders(new Set())}
        />

        {/* Orders Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    شماره سفارش
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مشتری
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاریخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مبلغ
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
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{getRelativeTime(new Date(order.createdAt))}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-rose-400 to-amber-400 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {order.customer.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                          <div className="text-sm text-gray-500">{order.customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatPersianDateTime(new Date(order.createdAt)).split(' - ')[0]}</div>
                      <div className="text-sm text-gray-500">{formatPersianDateTime(new Date(order.createdAt)).split(' - ')[1]}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPersianCurrency(order.totalAmount)}
                      </div>
                      <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusTranslation(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="text-rose-600 hover:text-rose-900 p-1 rounded hover:bg-rose-50"
                          title="مشاهده جزئیات"
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
                          title="چاپ فاکتور"
                        >
                          <Printer className="w-4 h-4" />
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
                  نمایش {formatPersianNumber(indexOfFirstOrder + 1)} تا {formatPersianNumber(Math.min(indexOfLastOrder, filteredOrders.length))} از {formatPersianNumber(filteredOrders.length)} سفارش
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

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={showOrderModal}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
            }}
            onStatusUpdate={(orderId, newStatus, note) => {
              // Update order status in state
              setOrders(prevOrders =>
                prevOrders.map(order =>
                  order.id === orderId
                    ? { 
                        ...order, 
                        status: newStatus as any,
                        updatedAt: new Date().toISOString(),
                        notes: note ? [...order.notes, note] : order.notes
                      }
                    : order
                )
              );
              setShowOrderModal(false);
              setSelectedOrder(null);
            }}
          />
        )}

        {/* Export Modal */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          totalRecords={filteredOrders.length}
          selectedCount={selectedOrders.size}
          exportType={selectedOrders.size > 0 ? 'selected' : 'all'}
        />
      </div>
  );
};

export default OrderManagement;