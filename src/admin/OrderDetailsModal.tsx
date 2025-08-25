import React, { useState } from 'react';
import { 
  X, User, Phone, Mail, MapPin, Package, CreditCard, Truck, 
  Calendar, Clock, FileText, Plus, Edit, Printer, Download,
  CheckCircle, AlertTriangle, RefreshCw, MessageSquare,
  DollarSign, Eye, Send
} from 'lucide-react';
import { 
  formatPersianCurrency, formatPersianNumber, formatPersianDateTime,
  getRelativeTime, toPersianNumber 
} from '../utils/persian';

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

interface StatusHistoryItem {
  status: string;
  date: string;
  note: string;
  user: string;
}

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: string, note?: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  order, 
  isOpen, 
  onClose, 
  onStatusUpdate 
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'customer' | 'payment'>('details');
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState(order.status);
  const [newTrackingNumber, setNewTrackingNumber] = useState(order.trackingNumber || '');
  const [newShippingCompany, setNewShippingCompany] = useState(order.shippingCompany || '');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  if (!isOpen) return null;

  const statusHistory: StatusHistoryItem[] = [
    {
      status: 'registered',
      date: order.createdAt,
      note: 'سفارش ثبت شد',
      user: 'سیستم'
    },
    {
      status: 'confirmed',
      date: order.updatedAt,
      note: 'سفارش تایید شد',
      user: 'مدیر فروشگاه'
    }
  ];

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

  const handleStatusUpdate = () => {
    if (newStatus !== order.status) {
      onStatusUpdate(order.id, newStatus, newNote);
      setShowStatusUpdate(false);
      setNewNote('');
    }
  };

  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const shippingCost = 150000; // Example shipping cost
  const tax = calculateSubtotal() * 0.09; // 9% tax

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-l from-rose-50 to-amber-50 px-6 py-4 border-b border-rose-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-rose-600" />
                  جزئیات سفارش {order.orderNumber}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  ثبت شده در {formatPersianDateTime(new Date(order.createdAt))}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {getStatusTranslation(order.status)}
                </span>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStatusUpdate(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  تغییر وضعیت
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  چاپ فاکتور
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  دانلود فاکتور
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  ارسال ایمیل
                </button>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">
                  {formatPersianCurrency(order.totalAmount)}
                </p>
                <p className="text-sm text-gray-500">مبلغ کل سفارش</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-reverse space-x-8 px-6">
              {[
                { key: 'details', label: 'جزئیات سفارش', icon: Package },
                { key: 'timeline', label: 'تاریخچه', icon: Clock },
                { key: 'customer', label: 'اطلاعات مشتری', icon: User },
                { key: 'payment', label: 'پرداخت', icon: CreditCard }
              ].map(tab => {
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
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Order Items */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">آیتم‌های سفارش</h4>
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    {order.items.map((item, index) => (
                      <div key={item.id} className={`flex items-center justify-between p-4 ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                        <div className="flex items-center space-x-reverse space-x-4">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                          <div>
                            <h5 className="font-medium text-gray-900">{item.productName}</h5>
                            <p className="text-sm text-gray-500">تعداد: {toPersianNumber(item.quantity)}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">
                            {formatPersianCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPersianCurrency(item.price)} × {toPersianNumber(item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-l from-rose-50 to-amber-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">خلاصه سفارش</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">جمع کل آیتم‌ها:</span>
                      <span className="font-medium">{formatPersianCurrency(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">هزینه ارسال:</span>
                      <span className="font-medium">{formatPersianCurrency(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">مالیات (۹٪):</span>
                      <span className="font-medium">{formatPersianCurrency(tax)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>مبلغ نهایی:</span>
                        <span className="text-rose-600">{formatPersianCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">تاریخچه سفارش</h4>
                <div className="relative">
                  {statusHistory.map((item, index) => (
                    <div key={index} className="relative flex items-start space-x-reverse space-x-4 pb-6">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {getStatusTranslation(item.status)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPersianDateTime(new Date(item.date))}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.note}</p>
                        <p className="text-xs text-gray-500 mt-1">توسط: {item.user}</p>
                      </div>
                      {index < statusHistory.length - 1 && (
                        <div className="absolute right-5 top-10 w-px h-6 bg-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Note */}
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-medium text-gray-900 mb-3">افزودن یادداشت</h5>
                  <div className="flex gap-3">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="یادداشت جدید..."
                      rows={2}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                    />
                    <button className="btn-primary">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'customer' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات مشتری</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-4 h-4 text-rose-600" />
                      اطلاعات شخصی
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">نام:</label>
                        <p className="text-gray-900">{order.customer.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">ایمیل:</label>
                        <p className="text-gray-900">{order.customer.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">تلفن:</label>
                        <p className="text-gray-900">{order.customer.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-600" />
                      آدرس ارسال
                    </h5>
                    <p className="text-gray-900 leading-relaxed">{order.customer.address}</p>
                  </div>
                </div>

                {/* Customer Actions */}
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-medium text-gray-900 mb-3">عملیات مشتری</h5>
                  <div className="flex gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      ارسال ایمیل
                    </button>
                    <button className="btn-secondary flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      تماس تلفنی
                    </button>
                    <button className="btn-secondary flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      مشاهده پروفایل
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات پرداخت</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Details */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-rose-600" />
                      جزئیات پرداخت
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">روش پرداخت:</label>
                        <p className="text-gray-900">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">وضعیت پرداخت:</label>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentStatus === 'paid' ? 'پرداخت شده' : 'در انتظار'}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">مبلغ:</label>
                        <p className="text-gray-900 font-semibold">{formatPersianCurrency(order.totalAmount)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  {(order.trackingNumber || order.shippingCompany) && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-rose-600" />
                        اطلاعات ارسال
                      </h5>
                      <div className="space-y-3">
                        {order.shippingCompany && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">شرکت حمل:</label>
                            <p className="text-gray-900">{order.shippingCompany}</p>
                          </div>
                        )}
                        {order.trackingNumber && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">کد پیگیری:</label>
                            <p className="text-gray-900 font-mono">{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Status Update Modal */}
          {showStatusUpdate && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-xl p-6 m-4 max-w-md w-full">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">تغییر وضعیت سفارش</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت جدید:</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="registered">ثبت شده</option>
                      <option value="confirmed">تایید شده</option>
                      <option value="preparing">آماده‌سازی</option>
                      <option value="shipped">ارسال شده</option>
                      <option value="delivered">تحویل شده</option>
                      <option value="cancelled">لغو شده</option>
                      <option value="returned">مرجوعی</option>
                    </select>
                  </div>

                  {newStatus === 'shipped' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">شرکت حمل:</label>
                        <input
                          type="text"
                          value={newShippingCompany}
                          onChange={(e) => setNewShippingCompany(e.target.value)}
                          placeholder="نام شرکت حمل"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">کد پیگیری:</label>
                        <input
                          type="text"
                          value={newTrackingNumber}
                          onChange={(e) => setNewTrackingNumber(e.target.value)}
                          placeholder="کد پیگیری مرسوله"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت:</label>
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="یادداشت اختیاری..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowStatusUpdate(false)}
                    className="btn-secondary"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    className="btn-primary"
                  >
                    بروزرسانی
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;