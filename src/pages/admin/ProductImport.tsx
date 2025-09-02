import React, { useState, useCallback, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Clock,
  Database,
  TrendingUp,
  Eye,
  Trash2,
  FileSpreadsheet,
  Loader2,
  Check,
  X
} from 'lucide-react';

interface ImportStatus {
  import_id: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
  total?: number;
  processed?: number;
  success_count?: number;
  error_count?: number;
  errors?: string[];
  created_at: string;
  message?: string;
}

interface ImportHistory {
  id: string;
  filename: string;
  file_size: number;
  status: string;
  success_count: number;
  error_count: number;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

const ProductImport: React.FC = () => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentImport, setCurrentImport] = useState<ImportStatus | null>(null);
  const [importHistory, setImportHistory] = useState<ImportHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && isValidFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
    }
  };

  const isValidFile = (file: File): boolean => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    
    return validTypes.includes(file.type) || 
           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/v1/admin/import/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('خطا در آپلود فایل');
      }

      const result = await response.json();
      setCurrentImport({
        import_id: result.import_id,
        status: result.status,
        created_at: new Date().toISOString(),
        message: result.message
      });

      // Start polling for progress
      startPolling(result.import_id);
      
      // Clear selected file
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('خطا در آپلود فایل');
    } finally {
      setUploading(false);
    }
  };

  const startPolling = (importId: string) => {
    // Clear existing interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/v1/admin/import/products/status/${importId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const status: ImportStatus = await response.json();
          setCurrentImport(status);

          // Stop polling if completed or failed
          if (status.status === 'completed' || status.status === 'failed') {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            // Refresh history
            loadImportHistory();
          }
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 2000); // Poll every 2 seconds
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/v1/admin/import/products/template', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([data.csv_content], { type: 'text/csv;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Template download error:', error);
      alert('خطا در دانلود فایل نمونه');
    }
  };

  // Enhanced template download with multiple formats
  const downloadEnhancedTemplate = () => {
    const csvContent = `name,description,price,stock_quantity,category,image_url,sku,is_active
"گوشی سامسونگ گلکسی A54","گوشی هوشمند سامسونگ با نمایشگر 6.4 اینچی و حافظه 128 گیگابایت",8500000,10,"موبایل و تبلت","https://example.com/galaxy-a54.jpg","SAMSUNG-A54-128",true
"لپ‌تاپ ایسوس VivoBook","لپ‌تاپ ایسوس با پردازنده Intel Core i5 و رم 8 گیگابایت",15000000,5,"لپ تاپ و کامپیوتر","https://example.com/asus-vivobook.jpg","ASUS-VIVO-I5",true
"هدفون سونی WH-1000XM4","هدفون بی‌سیم با قابلیت حذف نویز و کیفیت صدای بالا",1200000,20,"لوازم جانبی","https://example.com/sony-headphone.jpg","SONY-WH1000",true
"کفش ورزشی نایک","کفش ورزشی مردانه نایک مدل Air Max با طراحی مدرن",750000,15,"کفش","https://example.com/nike-airmax.jpg","NIKE-AIRMAX-42",true
"کیف چرمی زنانه","کیف دستی چرمی زنانه با طراحی کلاسیک و رنگ‌های متنوع",450000,30,"کیف و کوله","https://example.com/leather-bag.jpg","BAG-LEATHER-01",true`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ishop-products-template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const loadImportHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('/api/v1/admin/import/products/history?limit=20', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setImportHistory(data.imports);
      }
    } catch (error) {
      console.error('History loading error:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const clearCurrentImport = () => {
    setCurrentImport(null);
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  // Load history when component mounts or when switching to history tab
  React.useEffect(() => {
    if (showHistory) {
      loadImportHistory();
    }
  }, [showHistory]);

  // Cleanup polling on unmount
  React.useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'در حال پردازش';
      case 'completed':
        return 'تکمیل شده';
      case 'failed':
        return 'ناموفق';
      default:
        return 'نامشخص';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ربات Import محصولات</h1>
        <p className="text-gray-600">آپلود فایل‌های CSV/Excel برای import انبوه محصولات</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setShowHistory(false)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              !showHistory
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            آپلود جدید
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              showHistory
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            تاریخچه Import
          </button>
        </nav>
      </div>

      {!showHistory ? (
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">آپلود فایل محصولات</h2>
            
            {/* Download Template Button */}
            <div className="mb-4">
              <div className="flex gap-3">
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  دانلود فایل نمونه
                </button>
                <button
                  onClick={downloadEnhancedTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  نمونه کامل
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                ابتدا فایل نمونه را دانلود کرده و فرمت صحیح را مشاهده کنید. نمونه کامل شامل داده‌های واقعی است.
              </p>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    فایل را اینجا بکشید یا کلیک کنید
                  </h3>
                  <p className="text-sm text-gray-500">
                    فرمت‌های پشتیبانی شده: CSV, Excel (.xlsx, .xls)
                  </p>
                  <p className="text-sm text-gray-500">
                    حداکثر حجم: 10 مگابایت
                  </p>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  انتخاب فایل
                </button>
              </div>
            </div>

            {/* Selected File */}
            {selectedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={uploadFile}
                      disabled={uploading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploading ? 'در حال آپلود...' : 'آپلود و پردازش'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current Import Status */}
          {currentImport && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">وضعیت Import فعلی</h2>
                <button
                  onClick={clearCurrentImport}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center gap-3">
                  {getStatusIcon(currentImport.status)}
                  <span className="font-medium">{getStatusText(currentImport.status)}</span>
                  {currentImport.message && (
                    <span className="text-sm text-gray-600">- {currentImport.message}</span>
                  )}
                </div>

                {/* Progress Bar */}
                {currentImport.status === 'processing' && currentImport.total && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>پردازش شده: {currentImport.processed || 0} از {currentImport.total}</span>
                      <span>{currentImport.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${currentImport.progress || 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Results */}
                {(currentImport.success_count || currentImport.error_count) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="h-4 w-4" />
                      <span>موفق: {currentImport.success_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-600">
                      <X className="h-4 w-4" />
                      <span>خطا: {currentImport.error_count || 0}</span>
                    </div>
                  </div>
                )}

                {/* Recent Errors */}
                {currentImport.errors && currentImport.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">آخرین خطاها:</h4>
                    <div className="space-y-1">
                      {currentImport.errors.slice(0, 5).map((error, index) => (
                        <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* History Section */
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">تاریخچه Import محصولات</h2>
              <button
                onClick={loadImportHistory}
                disabled={loadingHistory}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loadingHistory ? 'animate-spin' : ''}`} />
                بروزرسانی
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loadingHistory ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-500">در حال بارگیری...</p>
              </div>
            ) : importHistory.length === 0 ? (
              <div className="p-8 text-center">
                <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">هنوز هیچ فرآیند import انجام نشده است</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">فایل</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نتایج</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {importHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.filename}</div>
                            <div className="text-sm text-gray-500">{formatFileSize(item.file_size)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className="text-sm">{getStatusText(item.status)}</span>
                        </div>
                        {item.error_message && (
                          <div className="text-xs text-red-600 mt-1">{item.error_message}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-green-600">موفق: {item.success_count}</div>
                          <div className="text-red-600">خطا: {item.error_count}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>{new Date(item.created_at).toLocaleDateString('fa-IR')}</div>
                        <div>{new Date(item.created_at).toLocaleTimeString('fa-IR')}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImport;