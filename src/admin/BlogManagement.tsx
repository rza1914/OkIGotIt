import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import BlogEditor from './BlogEditor';
import BlogCategories from './BlogCategories';
import { 
  PenTool, Plus, Search, Filter, Eye, Edit2, Trash2, 
  Calendar, User, Tag, MoreHorizontal, FileText,
  TrendingUp, Clock, CheckCircle, XCircle, Archive,
  Download, Upload, Copy, ExternalLink, Image as ImageIcon,
  FolderOpen, Settings, BarChart3
} from 'lucide-react';
import { formatPersianDateTime, formatPersianNumber, getPersianStatus, getRelativeTime } from '../utils/persian';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  slug: string;
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  featured_image: string;
  author: string;
  author_id: number;
  views: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  category?: string;
  seo_title?: string;
  seo_description?: string;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  posts_count: number;
}

const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  // Mock data - in real implementation, fetch from API
  useEffect(() => {
    const mockPosts: BlogPost[] = [
      {
        id: 1,
        title: 'معرفی جدیدترین محصولات iShop',
        content: 'در این مقاله به معرفی جدیدترین محصولات فروشگاه iShop می‌پردازیم...',
        summary: 'محصولات جدید و متنوع iShop',
        slug: 'newest-ishop-products',
        status: 'published',
        featured_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
        author: 'احمد محمدی',
        author_id: 1,
        views: 1250,
        tags: ['محصولات', 'iShop', 'جدید'],
        created_at: '2024-01-15T09:30:00Z',
        updated_at: '2024-01-20T14:45:00Z',
        published_at: '2024-01-15T10:00:00Z',
        category: 'محصولات',
        seo_title: 'جدیدترین محصولات iShop - فروشگاه آنلاین',
        seo_description: 'معرفی جدیدترین محصولات فروشگاه iShop با بهترین کیفیت و قیمت'
      },
      {
        id: 2,
        title: 'راهنمای خرید آنلاین از iShop',
        content: 'نحوه خرید آنلاین از فروشگاه iShop را در این مقاله آموزش می‌دهیم...',
        summary: 'آموزش کامل خرید آنلاین',
        slug: 'online-shopping-guide',
        status: 'published',
        featured_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
        author: 'فاطمه کریمی',
        author_id: 2,
        views: 890,
        tags: ['آموزش', 'خرید', 'راهنما'],
        created_at: '2024-01-18T11:20:00Z',
        updated_at: '2024-01-22T16:30:00Z',
        published_at: '2024-01-18T12:00:00Z',
        category: 'آموزش',
        seo_title: 'راهنمای خرید آنلاین - iShop',
        seo_description: 'آموزش کامل خرید آنلاین از فروشگاه iShop'
      },
      {
        id: 3,
        title: 'تکنولوژی جدید در فروشگاه‌های آنلاین',
        content: 'بررسی تکنولوژی‌های نوین مورد استفاده در فروشگاه‌های اینترنتی...',
        summary: 'تکنولوژی و نوآوری در e-commerce',
        slug: 'new-ecommerce-technology',
        status: 'draft',
        featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
        author: 'علی رضایی',
        author_id: 3,
        views: 0,
        tags: ['تکنولوژی', 'نوآوری', 'فروشگاه'],
        created_at: '2024-01-22T08:15:00Z',
        updated_at: '2024-01-22T10:20:00Z',
        published_at: null,
        category: 'تکنولوژی',
        seo_title: 'تکنولوژی جدید فروشگاه‌های آنلاین',
        seo_description: 'بررسی تکنولوژی‌های نوین در e-commerce'
      }
    ];

    const mockCategories: BlogCategory[] = [
      { id: 1, name: 'محصولات', slug: 'products', posts_count: 15 },
      { id: 2, name: 'آموزش', slug: 'tutorials', posts_count: 8 },
      { id: 3, name: 'تکنولوژی', slug: 'technology', posts_count: 5 },
      { id: 4, name: 'اخبار', slug: 'news', posts_count: 12 }
    ];

    setPosts(mockPosts);
    setCategories(mockCategories);
    setLoading(false);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'draft': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'archived': return <Archive className="w-4 h-4 text-gray-500" />;
      default: return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-700 bg-green-100';
      case 'draft': return 'text-yellow-700 bg-yellow-100';
      case 'archived': return 'text-gray-700 bg-gray-100';
      default: return 'text-red-700 bg-red-100';
    }
  };

  const handleSelectPost = (postId: number) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(post => post.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on posts:`, selectedPosts);
    // Implement bulk actions
    setSelectedPosts([]);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowCreateForm(true);
  };

  const handleDeletePost = (postId: number) => {
    if (confirm('آیا از حذف این مقاله اطمینان دارید؟')) {
      setPosts(prev => prev.filter(post => post.id !== postId));
    }
  };

  const handleDuplicatePost = (post: BlogPost) => {
    const newPost = {
      ...post,
      id: Math.max(...posts.map(p => p.id)) + 1,
      title: `${post.title} (کپی)`,
      slug: `${post.slug}-copy`,
      status: 'draft' as const,
      published_at: null,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const handleSavePost = (postData: any) => {
    if (editingPost) {
      // Update existing post
      setPosts(prev => prev.map(post =>
        post.id === editingPost.id
          ? { ...post, ...postData, updated_at: new Date().toISOString() }
          : post
      ));
    } else {
      // Create new post
      const newPost: BlogPost = {
        id: Math.max(...posts.map(p => p.id)) + 1,
        ...postData,
        author: 'ادمین سیستم',
        author_id: 1,
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: postData.status === 'published' ? new Date().toISOString() : null
      };
      setPosts(prev => [newPost, ...prev]);
    }
    
    setShowCreateForm(false);
    setEditingPost(null);
  };

  const handleCancelEditor = () => {
    setShowCreateForm(false);
    setEditingPost(null);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const aValue = a[sortBy as keyof BlogPost];
    const bValue = b[sortBy as keyof BlogPost];
    const compareResult = (aValue ?? '') < (bValue ?? '') ? -1 : (aValue ?? '') > (bValue ?? '') ? 1 : 0;
    return sortOrder === 'asc' ? compareResult : -compareResult;
  });

  const postsPerPage = 10;
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = sortedPosts.slice(startIndex, startIndex + postsPerPage);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری مقالات...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
              مدیریت وبلاگ
            </h1>
            <p className="text-gray-600 mt-1">مدیریت مقالات و محتوای وبلاگ</p>
          </div>
          <div className="flex items-center space-x-reverse space-x-3">
            <button
              onClick={() => setShowCategories(true)}
              className="btn-secondary flex items-center"
            >
              <FolderOpen className="w-4 h-4 ml-2" />
              مدیریت دسته‌ها
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 ml-2" />
              مقاله جدید
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">کل مقالات</p>
                <p className="text-2xl font-bold text-gray-900">{formatPersianNumber(posts.length)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="card p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">منتشر شده</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPersianNumber(posts.filter(p => p.status === 'published').length)}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="card p-6 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">پیش‌نویس</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPersianNumber(posts.filter(p => p.status === 'draft').length)}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="card p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">کل بازدید</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPersianNumber(posts.reduce((sum, post) => sum + post.views, 0))}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-reverse sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو در عنوان و محتوا..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pr-10 w-full sm:w-80"
                />
              </div>
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field w-full sm:w-auto"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="published">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">آرشیو شده</option>
              </select>
              
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field w-full sm:w-auto"
              >
                <option value="all">همه دسته‌ها</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedPosts.length > 0 && (
              <div className="flex items-center space-x-reverse space-x-2">
                <span className="text-sm text-gray-600">
                  {formatPersianNumber(selectedPosts.length)} مقاله انتخاب شده
                </span>
                <button
                  onClick={() => handleBulkAction('publish')}
                  className="btn-secondary text-sm"
                >
                  انتشار
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="btn-secondary text-sm"
                >
                  آرشیو
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="btn-danger text-sm"
                >
                  حذف
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Blog Posts Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === posts.length && posts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مقاله
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نویسنده
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    دسته‌بندی
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    بازدید
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاریخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handleSelectPost(post.id)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-reverse space-x-3">
                        {post.featured_image && (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {post.summary}
                          </div>
                          <div className="flex items-center space-x-reverse space-x-2 mt-1">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                <Tag className="w-3 h-3 ml-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">
                            {post.author.charAt(0)}
                          </span>
                        </div>
                        <div className="mr-3">
                          <div className="text-sm font-medium text-gray-900">{post.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{post.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(post.status)}
                        <span className={`mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                          {getPersianStatus(post.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 ml-1 text-gray-400" />
                        {formatPersianNumber(post.views)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getRelativeTime(new Date(post.created_at))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {post.published_at && getRelativeTime(new Date(post.published_at))} منتشر شده
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-reverse space-x-2">
                        <button
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="مشاهده"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="ویرایش"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicatePost(post)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="کپی"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
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
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  قبلی
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  بعدی
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    نمایش{' '}
                    <span className="font-medium">{formatPersianNumber(startIndex + 1)}</span>
                    {' '}تا{' '}
                    <span className="font-medium">{formatPersianNumber(Math.min(startIndex + postsPerPage, sortedPosts.length))}</span>
                    {' '}از{' '}
                    <span className="font-medium">{formatPersianNumber(sortedPosts.length)}</span>
                    {' '}مقاله
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-rose-50 border-rose-500 text-rose-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {formatPersianNumber(page)}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">خروجی داده‌ها</h3>
          <div className="flex items-center space-x-reverse space-x-4">
            <button className="btn-secondary flex items-center">
              <Download className="w-4 h-4 ml-2" />
              خروجی CSV
            </button>
            <button className="btn-secondary flex items-center">
              <Download className="w-4 h-4 ml-2" />
              خروجی Excel
            </button>
            <button className="btn-secondary flex items-center">
              <Upload className="w-4 h-4 ml-2" />
              واردات مقالات
            </button>
          </div>
        </div>
      </div>

      {/* Modals and Overlays */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <BlogEditor
            post={editingPost}
            onSave={handleSavePost}
            onCancel={handleCancelEditor}
          />
        </div>
      )}

      {showCategories && (
        <BlogCategories onClose={() => setShowCategories(false)} />
      )}
    </AdminLayout>
  );
};

export default BlogManagement;