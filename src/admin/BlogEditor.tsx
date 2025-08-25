import React, { useState, useEffect } from 'react';
import { 
  Save, X, Eye, Upload, Calendar, Tag, Globe, 
  Image as ImageIcon, Type, AlignRight, Bold, Italic,
  List, Link, Quote, Code, Undo, Redo
} from 'lucide-react';
import { formatPersianDateTime, toPersianNumber } from '../utils/persian';
import PersianDatePicker from '../components/PersianDatePicker';

interface BlogPost {
  id?: number;
  title: string;
  content: string;
  summary: string;
  slug: string;
  status: 'published' | 'draft' | 'scheduled';
  featured_image: string;
  category: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  scheduled_at?: string;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

interface BlogEditorProps {
  post?: BlogPost | null;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    content: '',
    summary: '',
    slug: '',
    status: 'draft',
    featured_image: '',
    category: '',
    tags: [],
    seo_title: '',
    seo_description: '',
    ...post
  });

  const [categories] = useState<BlogCategory[]>([
    { id: 1, name: 'محصولات', slug: 'products' },
    { id: 2, name: 'آموزش', slug: 'tutorials' },
    { id: 3, name: 'تکنولوژی', slug: 'technology' },
    { id: 4, name: 'اخبار', slug: 'news' }
  ]);

  const [currentTag, setCurrentTag] = useState('');
  const [showSeoFields, setShowSeoFields] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Rich text editor state
  const [editorContent, setEditorContent] = useState(formData.content);
  const [selectedText, setSelectedText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    // Auto-generate slug from title
    if (formData.title && !post) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }

    // Auto-generate SEO title if empty
    if (formData.title && !formData.seo_title) {
      setFormData(prev => ({ 
        ...prev, 
        seo_title: `${formData.title} - فروشگاه iShop` 
      }));
    }
  }, [formData.title, post]);

  const handleInputChange = (field: keyof BlogPost, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Rich text editor functions
  const insertText = (beforeText: string, afterText: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    
    const newText = beforeText + selectedText + afterText;
    const newContent = editorContent.substring(0, start) + newText + editorContent.substring(end);
    
    setEditorContent(newContent);
    handleInputChange('content', newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + beforeText.length, start + beforeText.length + selectedText.length);
    }, 0);
  };

  const formatText = (format: string) => {
    switch (format) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'quote':
        insertText('> ');
        break;
      case 'code':
        insertText('`', '`');
        break;
      case 'link':
        const url = prompt('آدرس لینک را وارد کنید:');
        if (url) insertText('[', `](${url})`);
        break;
      case 'list':
        insertText('- ');
        break;
      case 'h1':
        insertText('# ');
        break;
      case 'h2':
        insertText('## ');
        break;
      case 'h3':
        insertText('### ');
        break;
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, upload to server and get URL
      const imageUrl = URL.createObjectURL(file);
      handleInputChange('featured_image', imageUrl);
    }
  };

  const handleSave = async (status: 'published' | 'draft' | 'scheduled' = formData.status) => {
    setSaving(true);
    
    const postData = {
      ...formData,
      content: editorContent,
      status,
      ...(status === 'scheduled' && { scheduled_at: formData.scheduled_at })
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(postData);
    setSaving(false);
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Preview Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">پیش‌نمای مقاله</h2>
          <div className="flex items-center space-x-reverse space-x-3">
            <button
              onClick={handlePreview}
              className="btn-secondary flex items-center"
            >
              <X className="w-4 h-4 ml-2" />
              بستن پیش‌نمای
            </button>
            <button
              onClick={() => handleSave()}
              className="btn-primary flex items-center"
              disabled={saving}
            >
              <Save className="w-4 h-4 ml-2" />
              {saving ? 'در حال ذخیره...' : 'ذخیره مقاله'}
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {formData.featured_image && (
            <img
              src={formData.featured_image}
              alt={formData.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-8">
            <div className="flex items-center space-x-reverse space-x-4 mb-4 text-sm text-gray-500">
              <span>{formData.category}</span>
              <span>•</span>
              <span>{formatPersianDateTime(new Date())}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {formData.title}
            </h1>
            
            <div className="text-lg text-gray-600 mb-6">
              {formData.summary}
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: editorContent.replace(/\n/g, '<br>') }} />
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex items-center space-x-reverse space-x-2 mt-8 pt-6 border-t border-gray-200">
                <Tag className="w-4 h-4 text-gray-400" />
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {post ? 'ویرایش مقاله' : 'مقاله جدید'}
        </h2>
        <div className="flex items-center space-x-reverse space-x-3">
          <button
            onClick={handlePreview}
            className="btn-secondary flex items-center"
          >
            <Eye className="w-4 h-4 ml-2" />
            پیش‌نمای
          </button>
          <button
            onClick={() => handleSave('draft')}
            className="btn-secondary flex items-center"
            disabled={saving}
          >
            <Save className="w-4 h-4 ml-2" />
            ذخیره پیش‌نویس
          </button>
          <button
            onClick={() => handleSave('published')}
            className="btn-primary flex items-center"
            disabled={saving}
          >
            <Save className="w-4 h-4 ml-2" />
            {saving ? 'در حال انتشار...' : 'انتشار'}
          </button>
          <button
            onClick={onCancel}
            className="btn-ghost flex items-center"
          >
            <X className="w-4 h-4 ml-2" />
            لغو
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Slug */}
          <div className="card p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان مقاله *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="input-field text-lg font-semibold"
                  placeholder="عنوان جذاب مقاله خود را وارد کنید..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نشانی (Slug)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="url-friendly-slug"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  خلاصه مقاله
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="خلاصه‌ای جذاب از محتوای مقاله بنویسید..."
                />
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="card">
            {/* Editor Toolbar */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-reverse space-x-2 flex-wrap gap-2">
                <button
                  onClick={() => formatText('bold')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="درشت (Bold)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('italic')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="کج (Italic)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('quote')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="نقل قول"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('code')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="کد"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('link')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="لینک"
                >
                  <Link className="w-4 h-4" />
                </button>
                <button
                  onClick={() => formatText('list')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="لیست"
                >
                  <List className="w-4 h-4" />
                </button>
                
                <div className="border-r border-gray-300 h-6 mx-2"></div>
                
                <button
                  onClick={() => formatText('h1')}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded text-sm font-bold"
                  title="سرتیتر 1"
                >
                  H1
                </button>
                <button
                  onClick={() => formatText('h2')}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded text-sm font-bold"
                  title="سرتیتر 2"
                >
                  H2
                </button>
                <button
                  onClick={() => formatText('h3')}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded text-sm font-bold"
                  title="سرتیتر 3"
                >
                  H3
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="p-4">
              <textarea
                id="content-editor"
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="w-full min-h-96 border-0 focus:ring-0 resize-y text-gray-800 leading-relaxed"
                placeholder="محتوای مقاله خود را اینجا بنویسید...

شما می‌توانید از فرمت‌های زیر استفاده کنید:
**متن درشت** 
*متن کج*
> نقل قول
`کد`
[متن لینک](آدرس)
- آیتم لیست
# سرتیتر اصلی
## زیرسرتیتر
### سرتیتر فرعی"
                style={{ direction: 'rtl' }}
              />
            </div>
          </div>

          {/* SEO Settings */}
          <div className="card">
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={() => setShowSeoFields(!showSeoFields)}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <Globe className="w-5 h-5 ml-2" />
                تنظیمات سئو (SEO)
              </button>
            </div>
            
            {showSeoFields && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان سئو (Meta Title)
                  </label>
                  <input
                    type="text"
                    value={formData.seo_title}
                    onChange={(e) => handleInputChange('seo_title', e.target.value)}
                    className="input-field"
                    placeholder="عنوان مقاله - فروشگاه iShop"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {toPersianNumber(formData.seo_title.length)}/۶۰ کاراکتر
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات سئو (Meta Description)
                  </label>
                  <textarea
                    value={formData.seo_description}
                    onChange={(e) => handleInputChange('seo_description', e.target.value)}
                    rows={3}
                    className="input-field"
                    placeholder="توضیح مختصر و جذابی از محتوای مقاله بنویسید..."
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {toPersianNumber(formData.seo_description.length)}/۱۶۰ کاراکتر
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status and Publish */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">انتشار</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وضعیت
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="input-field"
                >
                  <option value="draft">پیش‌نویس</option>
                  <option value="published">منتشر شده</option>
                  <option value="scheduled">زمان‌بندی شده</option>
                </select>
              </div>
              
              {formData.status === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاریخ انتشار
                  </label>
                  <PersianDatePicker
                    value={formData.scheduled_at || ''}
                    onChange={(value) => handleInputChange('scheduled_at', value)}
                    placeholder="انتخاب تاریخ و زمان انتشار"
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تصویر شاخص</h3>
            <div className="space-y-4">
              {formData.featured_image ? (
                <div className="relative">
                  <img
                    src={formData.featured_image}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleInputChange('featured_image', '')}
                    className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">تصویر شاخص انتخاب کنید</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="featured-image"
                  />
                  <label
                    htmlFor="featured-image"
                    className="btn-secondary cursor-pointer flex items-center justify-center"
                  >
                    <Upload className="w-4 h-4 ml-2" />
                    آپلود تصویر
                  </label>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  یا آدرس تصویر وارد کنید
                </label>
                <input
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => handleInputChange('featured_image', e.target.value)}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">دسته‌بندی</h3>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="input-field"
            >
              <option value="">انتخاب دسته‌بندی</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">برچسب‌ها</h3>
            <div className="space-y-3">
              <div className="flex">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 input-field rounded-l-none"
                  placeholder="برچسب جدید"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-rose-600 text-white rounded-l-md hover:bg-rose-700 transition-colors"
                >
                  افزودن
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="mr-2 text-rose-600 hover:text-rose-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;