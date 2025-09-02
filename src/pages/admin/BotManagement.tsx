import React, { useState, useEffect } from 'react';
import {
  Bot,
  Activity,
  Upload,
  Download,
  Settings,
  Play,
  Pause,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Database,
  Trash2,
  RefreshCw,
  Eye,
  TestTube
} from 'lucide-react';

interface BotStatus {
  telegram_bot: {
    status: string;
    products_imported: number;
    last_activity?: string;
    total_messages_processed: number;
    errors: number;
  };
  csv_importer: {
    recent_imports: number;
    total_imported: number;
    last_import?: string;
  };
  general_stats: {
    total_products: number;
    recent_products: number;
    active_imports: number;
  };
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
  duration?: string;
  error_message?: string;
}

const BotManagement: React.FC = () => {
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [importHistory, setImportHistory] = useState<ImportHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    loadBotStatus();
    const interval = setInterval(loadBotStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadBotStatus = async () => {
    try {
      const response = await fetch('/api/v1/bot/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBotStatus(data);
      }
    } catch (error) {
      console.error('Error loading bot status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadImportHistory = async () => {
    try {
      const response = await fetch('/api/v1/bot/import-history?limit=50', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setImportHistory(data.imports);
      }
    } catch (error) {
      console.error('Error loading import history:', error);
    }
  };

  const toggleTelegramBot = async () => {
    if (!botStatus) return;

    const isActive = botStatus.telegram_bot.status === 'active';
    const action = isActive ? 'stop' : 'start';
    
    setActionLoading(`telegram-${action}`);
    
    try {
      const response = await fetch(`/api/v1/bot/telegram/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await loadBotStatus();
        alert(isActive ? 'ربات تلگرام متوقف شد' : 'ربات تلگرام شروع شد');
      } else {
        const error = await response.json();
        alert(`خطا: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error toggling bot:', error);
      alert('خطا در تغییر وضعیت ربات');
    } finally {
      setActionLoading(null);
    }
  };

  const testProductExtraction = async () => {
    if (!testMessage.trim()) {
      alert('لطفاً متن تست را وارد کنید');
      return;
    }

    setActionLoading('test-extraction');
    
    try {
      const response = await fetch('/api/v1/bot/test-product-extraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          text: testMessage,
          chat_id: 123456789
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(data.extracted_data);
      } else {
        const error = await response.json();
        alert(`خطا: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error testing extraction:', error);
      alert('خطا در تست استخراج محصول');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteImportLog = async (importId: string) => {
    if (!confirm('آیا از حذف این گزارش اطمینان دارید؟')) return;

    try {
      const response = await fetch(`/api/v1/bot/import-history/${importId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setImportHistory(prev => prev.filter(item => item.id !== importId));
        alert('گزارش حذف شد');
      }
    } catch (error) {
      console.error('Error deleting import log:', error);
      alert('خطا در حذف گزارش');
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'inactive':
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگیری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">مدیریت ربات‌های Import</h1>
        <p className="text-gray-600">کنترل و مدیریت ربات‌های ایمپورت محصولات</p>
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
            داشبورد ربات‌ها
          </button>
          <button
            onClick={() => {
              setShowHistory(true);
              loadImportHistory();
            }}
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
          {/* General Statistics */}
          {botStatus && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Database className="h-8 w-8 text-blue-600" />
                  <div className="mr-4">
                    <p className="text-sm text-gray-600">کل محصولات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {botStatus.general_stats.total_products.toLocaleString('fa-IR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="mr-4">
                    <p className="text-sm text-gray-600">محصولات این هفته</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {botStatus.general_stats.recent_products.toLocaleString('fa-IR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <div className="mr-4">
                    <p className="text-sm text-gray-600">Import های فعال</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {botStatus.general_stats.active_imports.toLocaleString('fa-IR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Upload className="h-8 w-8 text-purple-600" />
                  <div className="mr-4">
                    <p className="text-sm text-gray-600">Import های اخیر</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {botStatus.csv_importer.recent_imports.toLocaleString('fa-IR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Telegram Bot */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-lg">ربات تلگرام</h3>
                    <p className="text-sm text-gray-600">ایمپورت خودکار محصولات از پیام‌های فوروارد شده</p>
                  </div>
                </div>
                <button
                  onClick={toggleTelegramBot}
                  disabled={actionLoading === 'telegram-start' || actionLoading === 'telegram-stop'}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    botStatus?.telegram_bot.status === 'active'
                      ? 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300'
                      : 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300'
                  }`}
                >
                  {actionLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : botStatus?.telegram_bot.status === 'active' ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {botStatus?.telegram_bot.status === 'active' ? 'توقف ربات' : 'شروع ربات'}
                </button>
              </div>
            </div>

            <div className="p-6">
              {botStatus && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {getStatusIcon(botStatus.telegram_bot.status)}
                      <span className="mr-2 font-medium">
                        {botStatus.telegram_bot.status === 'active' ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">وضعیت ربات</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {botStatus.telegram_bot.products_imported.toLocaleString('fa-IR')}
                    </div>
                    <p className="text-sm text-gray-600">محصولات Import شده</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {botStatus.telegram_bot.total_messages_processed.toLocaleString('fa-IR')}
                    </div>
                    <p className="text-sm text-gray-600">پیام‌های پردازش شده</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {botStatus.telegram_bot.errors.toLocaleString('fa-IR')}
                    </div>
                    <p className="text-sm text-gray-600">خطاها</p>
                  </div>
                </div>
              )}

              {botStatus?.telegram_bot.last_activity && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      آخرین فعالیت: {formatDateTime(botStatus.telegram_bot.last_activity)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Extraction Tester */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <TestTube className="h-6 w-6 text-purple-600" />
                <h3 className="font-bold">تست استخراج محصول</h3>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    متن پیام تست (مثال: نام محصول، قیمت و توضیحات)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="مثال: گوشی سامسونگ گلکسی A54&#10;قیمت: 8,500,000 تومان&#10;حافظه 128 گیگ - رنگ آبی"
                  />
                </div>
                
                <button
                  onClick={testProductExtraction}
                  disabled={actionLoading === 'test-extraction' || !testMessage.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {actionLoading === 'test-extraction' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <TestTube className="h-4 w-4" />
                  )}
                  تست استخراج
                </button>

                {testResult && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">نتیجه استخراج:</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>نام:</strong> {testResult.name}</div>
                      <div><strong>قیمت:</strong> {testResult.price?.toLocaleString('fa-IR')} تومان</div>
                      <div><strong>دسته‌بندی:</strong> {testResult.category}</div>
                      <div><strong>موجودی:</strong> {testResult.stock}</div>
                      {testResult.description && (
                        <div><strong>توضیحات:</strong> {testResult.description}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Import History */
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">تاریخچه Import محصولات</h2>
              <button
                onClick={loadImportHistory}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <RefreshCw className="h-4 w-4" />
                بروزرسانی
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {importHistory.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">هنوز هیچ فرآیند import انجام نشده است</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نوع / فایل</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نتایج</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">مدت زمان</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
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
                            {item.file_size > 0 && (
                              <div className="text-xs text-gray-500">
                                {(item.file_size / 1024).toFixed(1)} KB
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className="text-sm capitalize">
                            {item.status === 'completed' ? 'تکمیل شده' : 
                             item.status === 'failed' ? 'ناموفق' : 
                             item.status === 'processing' ? 'در حال پردازش' : item.status}
                          </span>
                        </div>
                        {item.error_message && (
                          <div className="text-xs text-red-600 mt-1 max-w-xs truncate" title={item.error_message}>
                            {item.error_message}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          <div className="text-green-600">✓ {item.success_count}</div>
                          {item.error_count > 0 && (
                            <div className="text-red-600">✗ {item.error_count}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.duration || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>{formatDateTime(item.created_at)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteImportLog(item.id)}
                          className="text-red-600 hover:text-red-700"
                          title="حذف گزارش"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

export default BotManagement;