import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  User,
  Tag,
  MoreHorizontal,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  Archive,
  Download,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Save,
  X,
  Globe
} from 'lucide-react';
import { formatPersianDateTime, toPersianNumber } from '../../utils/persian';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  author_id: number;
  author_name: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published' | 'pending' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  views: number;
  seo_title?: string;
  seo_description?: string;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  posts_count: number;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'آموزش کامل React برای مبتدیان',
    slug: 'complete-react-tutorial-for-beginners',
    content: 'در این مقاله به طور کامل React را آموزش می‌دهیم...',
    excerpt: 'آموزش جامع React از صفر تا صد برای توسعه‌دهندگان مبتدی',
    featured_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    author_id: 1,
    author_name: 'علی محمدی',
    categories: ['برنامه‌نویسی', 'فرانت‌اند'],
    tags: ['React', 'JavaScript', 'آموزش'],
    status: 'published',
    published_at: '2024-12-15T10:00:00Z',
    created_at: '2024-12-10T08:30:00Z',
    updated_at: '2024-12-15T10:00:00Z',
    views: 1250,
    seo_title: 'آموزش React - راهنمای کامل برای مبتدیان',
    seo_description: 'آموزش کامل React.js از مبانی تا پیشرفته. یادگیری کامپوننت، هوک‌ها، و بهترین روش‌های توسعه با React'
  },
  {
    id: 2,
    title: 'طراحی UX/UI برای اپلیکیشن‌های موبایل',
    slug: 'mobile-app-ux-ui-design-guide',
    content: 'اصول طراحی تجربه کاربری برای موبایل...',
    excerpt: 'راهنمای جامع طراحی رابط کاربری و تجربه کاربری برای اپلیکیشن‌های موبایل',
    featured_image: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400',
    author_id: 2,
    author_name: 'فاطمه احمدی',
    categories: ['طراحی', 'موبایل'],
    tags: ['UX', 'UI', 'طراحی موبایل'],
    status: 'draft',
    published_at: null,
    created_at: '2024-12-18T14:20:00Z',
    updated_at: '2024-12-19T16:15:00Z',
    views: 0,
    seo_title: 'طراحی UX/UI موبایل - راهنمای کامل',
    seo_description: 'یادگیری اصول طراحی تجربه کاربری و رابط کاربری برای اپلیکیشن‌های موبایل'
  },
  {
    id: 3,
    title: 'بهترین روش‌های امنیت در توسعه وب',
    slug: 'web-security-best-practices',
    content: 'امنیت یکی از مهم‌ترین جنبه‌های توسعه وب است...',
    excerpt: 'راهنمای جامع برای اعمال بهترین روش‌های امنیتی در پروژه‌های وب',
    featured_image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
    author_id: 3,
    author_name: 'محمد رضایی',
    categories: ['امنیت', 'توسعه وب'],
    tags: ['امنیت', 'وب', 'HTTPS', 'Authentication'],
    status: 'pending',
    published_at: null,
    created_at: '2024-12-16T11:45:00Z',
    updated_at: '2024-12-17T09:30:00Z',
    views: 0,
    seo_title: 'امنیت وب - بهترین روش‌ها و تکنیک‌ها',
    seo_description: 'راهنمای کامل امنیت در توسعه وب شامل HTTPS، احراز هویت، و محافظت از داده‌ها'
  }
];

const mockCategories: BlogCategory[] = [
  { id: 1, name: 'برنامه‌نویسی', slug: 'programming', description: 'مقالات مرتبط با برنامه‌نویسی', posts_count: 15 },
  { id: 2, name: 'طراحی', slug: 'design', description: 'مقالات طراحی و UX/UI', posts_count: 8 },
  { id: 3, name: 'فرانت‌اند', slug: 'frontend', description: 'توسعه فرانت‌اند و تکنولوژی‌های مرتبط', posts_count: 12 },
  { id: 4, name: 'امنیت', slug: 'security', description: 'امنیت در توسعه نرم‌افزار', posts_count: 6 }
];

const statusOptions = [
  { value: 'all', label: 'همه وضعیت‌ها' },
  { value: 'draft', label: 'پیش‌نویس' },
  { value: 'published', label: 'منتشر شده' },
  { value: 'pending', label: 'در انتظار بررسی' },
  { value: 'archived', label: 'بایگانی' }
];

const getStatusInfo = (status: BlogPost['status']) => {
  const statusMap = {
    draft: { label: 'پیش‌نویس', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    published: { label: 'منتشر شده', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    pending: { label: 'در انتظار بررسی', color: 'bg-blue-100 text-blue-800', icon: Clock },
    archived: { label: 'بایگانی', color: 'bg-gray-100 text-gray-800', icon: Archive }
  };
  return statusMap[status] || statusMap.draft;
};

interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  categories: string[];
  tags: string[];
  status: BlogPost['status'];
  seo_title: string;
  seo_description: string;
  publish_date: string;
}

const initialFormData: PostFormData = {
  title: '',
  content: '',
  excerpt: '',
  featured_image: '',
  categories: [],
  tags: [],
  status: 'draft',
  seo_title: '',
  seo_description: '',
  publish_date: ''
};

const BlogManagement: React.FC = () => {
  const [posts] = useState<BlogPost[]>(mockBlogPosts);
  const [categories] = useState<BlogCategory[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [, setSelectedPost] = useState<BlogPost | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState<PostFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'created_at' | 'views'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCategories, setShowCategories] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(p => p.status === 'published').length;
    const draftPosts = posts.filter(p => p.status === 'draft').length;
    const monthlyViews = posts.reduce((sum, p) => sum + p.views, 0);

    return { totalPosts, publishedPosts, draftPosts, monthlyViews };
  }, [posts]);

  // Filtered and sorted posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.includes(searchTerm) ||
        post.author_name.includes(searchTerm) ||
        post.tags.some(tag => tag.includes(searchTerm))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.categories.includes(categoryFilter));
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author_name.localeCompare(b.author_name);
          break;
        case 'views':
          comparison = a.views - b.views;
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [posts, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  const handleSort = (field: 'title' | 'author' | 'created_at' | 'views') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
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
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id));
    }
  };

  const handleAddPost = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      featured_image: post.featured_image || '',
      categories: post.categories,
      tags: post.tags,
      status: post.status,
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      publish_date: post.published_at || ''
    });
    setIsEditing(true);
    setSelectedPost(post);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      console.log('Updating post:', formData);
    } else {
      console.log('Creating post:', formData);
    }
    setIsFormModalOpen(false);
  };

  const handleDeletePost = (postId: number) => {
    if (confirm('آیا از حذف این مقاله اطمینان دارید؟')) {
      console.log('Deleting post:', postId);
    }
  };

  const handleBulkAction = (action: 'publish' | 'draft' | 'delete') => {
    if (selectedPosts.length === 0) return;
    
    const actionText = action === 'publish' ? 'انتشار' : action === 'draft' ? 'تبدیل به پیش‌نویس' : 'حذف';
    if (confirm(`آیا از ${actionText} مقالات انتخاب شده اطمینان دارید؟`)) {
      console.log(`Bulk ${action}:`, selectedPosts);
      setSelectedPosts([]);
    }
  };

  const handleExportPosts = () => {
    console.log('Exporting posts');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">مدیریت بلاگ</h1>
        <p className="text-gray-600">ایجاد، ویرایش و مدیریت مقالات بلاگ</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">کل مقالات</p>
              <p className="text-2xl font-bold text-gray-900">
                {toPersianNumber(stats.totalPosts)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مقالات منتشر شده</p>
              <p className="text-2xl font-bold text-green-600">
                {toPersianNumber(stats.publishedPosts)}
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
              <p className="text-sm text-gray-600">پیش‌نویس‌ها</p>
              <p className="text-2xl font-bold text-yellow-600">
                {toPersianNumber(stats.draftPosts)}
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
              <p className="text-sm text-gray-600">بازدیدهای کل</p>
              <p className="text-2xl font-bold text-purple-600">
                {toPersianNumber(stats.monthlyViews)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
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
                placeholder="جستجو بر اساس عنوان، نویسنده، برچسب..."
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
                  {category.name} ({toPersianNumber(category.posts_count)})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            {selectedPosts.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('publish')}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  انتشار
                </button>
                <button
                  onClick={() => handleBulkAction('draft')}
                  className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                >
                  پیش‌نویس
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  حذف ({toPersianNumber(selectedPosts.length)})
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
              onClick={handleExportPosts}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-5 w-5" />
              <span>خروجی</span>
            </button>
            
            <button
              onClick={handleAddPost}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              <span>مقاله جدید</span>
            </button>
          </div>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-right">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">تصویر</th>
                <th 
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-1">
                    <span>عنوان</span>
                    {sortBy === 'title' && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('author')}
                >
                  <div className="flex items-center gap-1">
                    <span>نویسنده</span>
                    {sortBy === 'author' && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">دسته‌بندی</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">وضعیت</th>
                <th 
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('views')}
                >
                  <div className="flex items-center gap-1">
                    <span>بازدید</span>
                    {sortBy === 'views' && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-1">
                    <span>تاریخ ایجاد</span>
                    {sortBy === 'created_at' && (
                      sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.map((post) => {
                const statusInfo = getStatusInfo(post.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handleSelectPost(post.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 line-clamp-2">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {post.excerpt}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{post.author_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.categories.slice(0, 2).map((category, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                        {post.categories.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{toPersianNumber(post.categories.length - 2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {toPersianNumber(post.views)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatPersianDateTime(new Date(post.created_at))}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                          title="مشاهده"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                          title="ویرایش"
                        >
                          <Edit3 className="h-4 w-4" />
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
                                onClick={() => handleDeletePost(post.id)}
                                className="w-full text-right px-3 py-2 text-sm hover:bg-gray-100 rounded text-red-600 flex items-center gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                حذف مقاله
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

      {/* Blog Post Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">
                {isEditing ? 'ویرایش مقاله' : 'مقاله جدید'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">اطلاعات اصلی</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عنوان مقاله</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="عنوان جذاب مقاله خود را وارد کنید"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">خلاصه مقاله</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="خلاصه‌ای کوتاه از محتوای مقاله"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">محتوای مقاله</label>
                  <textarea
                    rows={10}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="محتوای کامل مقاله خود را اینجا بنویسید..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    از فرمت مارک‌داون برای قالب‌بندی استفاده کنید
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تصویر شاخص</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.featured_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Categories and Tags */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">دسته‌بندی و برچسب‌ها</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی‌ها</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 ml-2"
                          checked={formData.categories.includes(category.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                categories: [...prev.categories, category.name]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                categories: prev.categories.filter(c => c !== category.name)
                              }));
                            }
                          }}
                        />
                        <span className="text-sm">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

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
                    placeholder="React, JavaScript, آموزش (برچسب‌ها را با کاما جدا کنید)"
                  />
                </div>
              </div>

              {/* SEO Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  تنظیمات سئو
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عنوان سئو</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.seo_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                    placeholder="عنوان برای موتورهای جستجو (حداکثر 60 کاراکتر)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    طول: {formData.seo_title.length}/60 کاراکتر
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات سئو</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.seo_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                    placeholder="توضیحی کوتاه برای موتورهای جستجو (حداکثر 160 کاراکتر)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    طول: {formData.seo_description.length}/160 کاراکتر
                  </p>
                </div>
              </div>

              {/* Publishing Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت انتشار</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as BlogPost['status'] }))}
                  >
                    <option value="draft">پیش‌نویس</option>
                    <option value="published">منتشر شده</option>
                    <option value="pending">در انتظار بررسی</option>
                    <option value="archived">بایگانی</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">زمان انتشار</label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.publish_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  {isEditing ? 'به‌روزرسانی مقاله' : 'ایجاد مقاله'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      {showCategories && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
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
              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{category.name}</h4>
                      <p className="text-sm text-gray-500">{category.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {toPersianNumber(category.posts_count)} مقاله
                      </p>
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
                ))}
              </div>
              
              <div className="mt-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  افزودن دسته‌بندی جدید
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;