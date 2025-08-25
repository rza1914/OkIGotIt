import React, { useState } from 'react';
import { Star, MessageSquare, Eye, Trash2, CheckCircle, XCircle, Search, Filter, MoreHorizontal } from 'lucide-react';
import PersianStatusBadge from './components/PersianStatusBadge';
import PersianDataTable from './components/PersianDataTable';
import { formatPersianDateTime, getRelativeTime, toPersianNumber } from '../utils/persian';

interface Review {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  user_name: string;
  user_email: string;
  rating: number;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at: Date;
  helpful_votes: number;
  is_verified_purchase: boolean;
}

const ReviewsManagement: React.FC = () => {
  const [selectedReviews, setSelectedReviews] = useState<Review[]>([]);
  const [viewReview, setViewReview] = useState<Review | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const mockReviews: Review[] = [
    {
      id: '1',
      product_id: '1',
      product_name: 'گوشی هوشمند سامسونگ Galaxy S23',
      product_image: '/api/placeholder/60/60',
      user_name: 'علی محمدی',
      user_email: 'ali@example.com',
      rating: 5,
      title: 'گوشی عالی',
      content: 'واقعاً گوشی فوق‌العاده‌ای است. کیفیت دوربین و عملکرد بسیار عالی. پیشنهاد می‌کنم.',
      status: 'approved',
      created_at: new Date(Date.now() - 86400000),
      updated_at: new Date(Date.now() - 86400000),
      helpful_votes: 12,
      is_verified_purchase: true
    },
    {
      id: '2',
      product_id: '2',
      product_name: 'لپ‌تاپ لنوو ThinkPad',
      product_image: '/api/placeholder/60/60',
      user_name: 'مریم احمدی',
      user_email: 'maryam@example.com',
      rating: 4,
      title: 'لپ‌تاپ مناسب کار',
      content: 'برای کار اداری عالی است اما بازی‌های سنگین روی آن بهتر اجرا نمی‌شود.',
      status: 'pending',
      created_at: new Date(Date.now() - 7200000),
      updated_at: new Date(Date.now() - 7200000),
      helpful_votes: 3,
      is_verified_purchase: true
    },
    {
      id: '3',
      product_id: '3',
      product_name: 'تبلت اپل iPad Pro',
      product_image: '/api/placeholder/60/60',
      user_name: 'حسن رضایی',
      user_email: 'hassan@example.com',
      rating: 2,
      title: 'قیمت بالا',
      content: 'کیفیت خوب اما قیمت خیلی بالاست. ارزش خرید ندارد.',
      status: 'rejected',
      created_at: new Date(Date.now() - 172800000),
      updated_at: new Date(Date.now() - 172800000),
      helpful_votes: 1,
      is_verified_purchase: false
    }
  ];

  const [reviews] = useState<Review[]>(mockReviews);

  const handleApproveReview = (reviewId: string) => {
    console.log('Approving review:', reviewId);
  };

  const handleRejectReview = (reviewId: string) => {
    console.log('Rejecting review:', reviewId);
  };

  const handleDeleteReview = (reviewId: string) => {
    console.log('Deleting review:', reviewId);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on`, selectedReviews);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 mr-1">
          ({toPersianNumber(rating)})
        </span>
      </div>
    );
  };

  const columns = [
    {
      key: 'product_name',
      label: 'محصول',
      sortable: true,
      render: (value: string, row: Review) => (
        <div className="flex items-center gap-3">
          <img
            src={row.product_image}
            alt={row.product_name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <div className="font-medium text-gray-900">{row.product_name}</div>
            <div className="text-sm text-gray-500">کد: {row.product_id}</div>
          </div>
        </div>
      )
    },
    {
      key: 'user_name',
      label: 'کاربر',
      sortable: true,
      render: (value: string, row: Review) => (
        <div>
          <div className="font-medium text-gray-900">{row.user_name}</div>
          <div className="text-sm text-gray-500">{row.user_email}</div>
          {row.is_verified_purchase && (
            <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" />
              خرید تایید شده
            </div>
          )}
        </div>
      )
    },
    {
      key: 'rating',
      label: 'امتیاز',
      sortable: true,
      render: (value: number, row: Review) => renderStars(value)
    },
    {
      key: 'title',
      label: 'نظر',
      render: (value: string, row: Review) => (
        <div className="max-w-xs">
          <div className="font-medium text-gray-900 truncate">{row.title}</div>
          <div className="text-sm text-gray-500 truncate mt-1">{row.content}</div>
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
            <span>{toPersianNumber(row.helpful_votes)} مفید</span>
            <button
              onClick={() => setViewReview(row)}
              className="text-rose-600 hover:text-rose-800"
            >
              مشاهده کامل
            </button>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'وضعیت',
      sortable: true,
      render: (value: string) => <PersianStatusBadge status={value} />
    },
    {
      key: 'created_at',
      label: 'تاریخ',
      sortable: true,
      render: (value: Date) => (
        <div className="text-sm">
          <div className="text-gray-900">{getRelativeTime(value)}</div>
          <div className="text-gray-500">{formatPersianDateTime(value)}</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (value: any, row: Review) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewReview(row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="مشاهده"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleApproveReview(row.id)}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
                title="تایید"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRejectReview(row.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="رد"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          
          <button
            onClick={() => handleDeleteReview(row.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const filteredReviews = statusFilter === 'all' 
    ? reviews 
    : reviews.filter(review => review.status === statusFilter);

  const reviewStats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">کل نظرات</p>
              <p className="text-xl font-bold text-gray-900">
                {toPersianNumber(reviewStats.total)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">در انتظار تایید</p>
              <p className="text-xl font-bold text-gray-900">
                {toPersianNumber(reviewStats.pending)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">تایید شده</p>
              <p className="text-xl font-bold text-gray-900">
                {toPersianNumber(reviewStats.approved)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">رد شده</p>
              <p className="text-xl font-bold text-gray-900">
                {toPersianNumber(reviewStats.rejected)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">میانگین امتیاز</p>
              <p className="text-xl font-bold text-gray-900">
                {toPersianNumber(reviewStats.averageRating.toFixed(1))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">همه نظرات</option>
              <option value="pending">در انتظار تایید</option>
              <option value="approved">تایید شده</option>
              <option value="rejected">رد شده</option>
            </select>
          </div>

          {selectedReviews.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {toPersianNumber(selectedReviews.length)} مورد انتخاب شده
              </span>
              <button
                onClick={() => handleBulkAction('approve')}
                className="btn-secondary text-sm"
              >
                تایید همه
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="btn-secondary text-sm"
              >
                رد همه
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="btn-danger text-sm"
              >
                حذف همه
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Table */}
      <PersianDataTable
        data={filteredReviews}
        columns={columns}
        selectable={true}
        onSelectionChange={setSelectedReviews}
        emptyMessage="نظری یافت نشد"
      />

      {/* View Review Modal */}
      {viewReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">جزئیات نظر</h3>
                <button
                  onClick={() => setViewReview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <img
                    src={viewReview.product_image}
                    alt={viewReview.product_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{viewReview.product_name}</h4>
                    <p className="text-sm text-gray-500">کد محصول: {viewReview.product_id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">نام کاربر</label>
                    <p className="text-gray-900">{viewReview.user_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ایمیل</label>
                    <p className="text-gray-900">{viewReview.user_email}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">امتیاز</label>
                  {renderStars(viewReview.rating)}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">عنوان نظر</label>
                  <p className="text-gray-900">{viewReview.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">متن نظر</label>
                  <p className="text-gray-900 leading-relaxed">{viewReview.content}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <PersianStatusBadge status={viewReview.status} />
                    {viewReview.is_verified_purchase && (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        خرید تایید شده
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatPersianDateTime(viewReview.created_at)}
                  </div>
                </div>

                {viewReview.status === 'pending' && (
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      onClick={() => {
                        handleApproveReview(viewReview.id);
                        setViewReview(null);
                      }}
                      className="btn-primary flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      تایید نظر
                    </button>
                    <button
                      onClick={() => {
                        handleRejectReview(viewReview.id);
                        setViewReview(null);
                      }}
                      className="btn-danger flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      رد نظر
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;