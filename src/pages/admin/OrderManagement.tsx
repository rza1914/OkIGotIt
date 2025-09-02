import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  Download,
  Eye,
  Edit3,
  X,
  CheckCircle,
  Clock,
  Truck,
  Package,
  XCircle,
  Printer,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatPersianCurrency, formatPersianDateTime, toPersianNumber } from '../../utils/persian';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_image?: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  total: number;
  currency: string;
  created_at: string;
  items: OrderItem[];
  shipping_address: string;
  payment_method?: string;
  tracking_number?: string;
  admin_notes?: string;
  customer_notes?: string;
}

const mockOrders: Order[] = [
  {
    id: 1,
    order_number: 'ORD-001',
    customer_name: 'علی محمدی',
    customer_email: 'ali@example.com',
    customer_phone: '09123456789',
    status: 'pending',
    payment_status: 'pending',
    total: 2500000,
    currency: 'IRT',
    created_at: '2024-12-20T10:30:00Z',
    shipping_address: 'تهران، میدان آزادی، خیابان شهید بهشتی، پلاک 123',
    items: [
      {
        id: 1,
        product_name: 'گوشی هوشمند سامسونگ',
        quantity: 1,
        unit_price: 2500000,
        total_price: 2500000
      }
    ]
  },
  {
    id: 2,
    order_number: 'ORD-002',
    customer_name: 'فاطمه احمدی',
    customer_email: 'fateme@example.com',
    customer_phone: '09123456788',
    status: 'confirmed',
    payment_status: 'paid',
    total: 1800000,
    currency: 'IRT',
    created_at: '2024-12-19T15:45:00Z',
    shipping_address: 'اصفهان، خیابان چهارباغ، کوچه گل، پلاک 45',
    items: [
      {
        id: 2,
        product_name: 'کیف دستی چرمی',
        quantity: 2,
        unit_price: 900000,
        total_price: 1800000
      }
    ]
  },
  {
    id: 3,
    order_number: 'ORD-003',
    customer_name: 'محمد رضایی',
    customer_email: 'mohammad@example.com',
    customer_phone: '09123456787',
    status: 'shipped',
    payment_status: 'paid',
    total: 4500000,
    currency: 'IRT',
    created_at: '2024-12-18T09:20:00Z',
    shipping_address: 'شیراز، میدان نماز، خیابان زند، پلاک 67',
    tracking_number: 'TRK123456789',
    items: [
      {
        id: 3,
        product_name: 'لپ‌تاپ ایسوس',
        quantity: 1,
        unit_price: 4500000,
        total_price: 4500000
      }
    ]
  }
];

const statusOptions = [
  { value: 'all', label: 'همه وضعیت‌ها' },
  { value: 'pending', label: 'در انتظار' },
  { value: 'confirmed', label: 'تایید شده' },
  { value: 'preparing', label: 'در حال آماده‌سازی' },
  { value: 'shipped', label: 'ارسال شده' },
  { value: 'delivered', label: 'تحویل شده' },
  { value: 'cancelled', label: 'لغو شده' }
];

const getStatusInfo = (status: Order['status']) => {
  const statusMap = {
    pending: { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { label: 'تایید شده', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    preparing: { label: 'در حال آماده‌سازی', color: 'bg-orange-100 text-orange-800', icon: Package },
    shipped: { label: 'ارسال شده', color: 'bg-purple-100 text-purple-800', icon: Truck },
    delivered: { label: 'تحویل شده', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-800', icon: XCircle }
  };
  return statusMap[status] || statusMap.pending;
};

const OrderManagement: React.FC = () => {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'customer'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    return { totalOrders, pendingOrders, completedOrders, totalRevenue };
  }, [orders]);

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.includes(searchTerm) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
        case 'customer':
          comparison = a.customer_name.localeCompare(b.customer_name);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSort = (field: 'date' | 'total' | 'customer') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = (orderId: number, newStatus: Order['status']) => {
    console.log(`Updating order ${orderId} status to ${newStatus}`);
    // API call to update status
  };

  const handleExportOrders = () => {
    console.log('Exporting orders to Excel/PDF');
    // Export functionality
  };

  const handlePrintInvoice = (order: Order) => {
    console.log(`Printing invoice for order ${order.order_number}`);
    // Print functionality
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl" dir="rtl">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">مدیریت سفارشات</h1>
          <p className="text-gray-600">مدیریت و پیگیری تمامی سفارشات فروشگاه</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل سفارشات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {toPersianNumber(stats.totalOrders)}
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
                <p className="text-sm text-gray-600">در انتظار</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {toPersianNumber(stats.pendingOrders)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تکمیل شده</p>
                <p className="text-2xl font-bold text-green-600">
                  {toPersianNumber(stats.completedOrders)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">درآمد کل</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPersianCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس شماره سفارش، نام مشتری..."
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

              {/* Date Range Picker */}
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Calendar className="h-5 w-5" />
                <span>انتخاب بازه تاریخ</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleExportOrders}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="h-5 w-5" />
                <span>خروجی Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th 
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      <span>شماره سفارش</span>
                      {sortBy === 'date' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('customer')}
                  >
                    <div className="flex items-center gap-1">
                      <span>مشتری</span>
                      {sortBy === 'customer' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">تاریخ</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">وضعیت</th>
                  <th 
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center gap-1">
                      <span>مبلغ کل</span>
                      {sortBy === 'total' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-blue-600">
                          {order.order_number}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{order.customer_name}</div>
                          <div className="text-sm text-gray-500">{order.customer_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatPersianDateTime(new Date(order.created_at))}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatPersianCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            title="مشاهده جزئیات"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePrintInvoice(order)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                            title="چاپ فاکتور"
                          >
                            <Printer className="h-4 w-4" />
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
                                    onClick={() => handleUpdateStatus(order.id, status.value as Order['status'])}
                                    className="w-full text-right px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                  >
                                    تغییر به {status.label}
                                  </button>
                                ))}
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

        {/* Order Detail Modal */}
        {isDetailModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold">جزئیات سفارش {selectedOrder.order_number}</h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">اطلاعات مشتری</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">نام:</span> {selectedOrder.customer_name}</p>
                      <p><span className="font-medium">ایمیل:</span> {selectedOrder.customer_email}</p>
                      <p><span className="font-medium">تلفن:</span> {selectedOrder.customer_phone}</p>
                      <p><span className="font-medium">آدرس:</span> {selectedOrder.shipping_address}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">اطلاعات سفارش</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">تاریخ:</span> {formatPersianDateTime(new Date(selectedOrder.created_at))}</p>
                      <p><span className="font-medium">وضعیت:</span> 
                        <span className={`mr-2 px-2 py-1 rounded-full text-sm ${getStatusInfo(selectedOrder.status).color}`}>
                          {getStatusInfo(selectedOrder.status).label}
                        </span>
                      </p>
                      <p><span className="font-medium">مبلغ کل:</span> {formatPersianCurrency(selectedOrder.total)}</p>
                      {selectedOrder.tracking_number && (
                        <p><span className="font-medium">کد رهگیری:</span> {selectedOrder.tracking_number}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">اقلام سفارش</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">محصول</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">تعداد</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">قیمت واحد</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">قیمت کل</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">{item.product_name}</td>
                            <td className="px-4 py-3">{toPersianNumber(item.quantity)}</td>
                            <td className="px-4 py-3">{formatPersianCurrency(item.unit_price)}</td>
                            <td className="px-4 py-3 font-semibold">{formatPersianCurrency(item.total_price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="space-y-2">
                    {selectedOrder.admin_notes && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">یادداشت مدیر:</span> {selectedOrder.admin_notes}
                      </p>
                    )}
                    {selectedOrder.customer_notes && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">یادداشت مشتری:</span> {selectedOrder.customer_notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handlePrintInvoice(selectedOrder)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Printer className="h-4 w-4" />
                      چاپ فاکتور
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Edit3 className="h-4 w-4" />
                      ویرایش
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;