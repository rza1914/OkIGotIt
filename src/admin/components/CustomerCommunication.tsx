import React, { useState } from 'react';
import { 
  X, Mail, Phone, MessageSquare, Send, Users, 
  FileText, Image, Paperclip, Eye, Clock, CheckCircle,
  AlertCircle, User, Calendar, Bell, Settings
} from 'lucide-react';
import { toPersianNumber, formatPersianDateTime } from '../../utils/persian';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
}

interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
}

interface CustomerCommunicationProps {
  users: User[];
  selectedUsers: User[];
  isOpen: boolean;
  onClose: () => void;
}

const CustomerCommunication: React.FC<CustomerCommunicationProps> = ({
  users,
  selectedUsers,
  isOpen,
  onClose
}) => {
  const [communicationType, setCommunicationType] = useState<'email' | 'sms' | 'notification'>('email');
  const [recipientType, setRecipientType] = useState<'selected' | 'filtered' | 'all'>('selected');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [smsContent, setSmsContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [scheduleSend, setScheduleSend] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [trackOpens, setTrackOpens] = useState(true);
  const [trackClicks, setTrackClicks] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock email templates
  const emailTemplates: EmailTemplate[] = [
    {
      id: '1',
      name: 'خوش‌آمدگویی',
      subject: 'خوش آمدید به فروشگاه آنلاین ما',
      content: 'سلام {{نام}},\n\nاز عضویت شما در فروشگاه ما بسیار خوشحالیم...',
      category: 'welcome'
    },
    {
      id: '2',
      name: 'تایید سفارش',
      subject: 'سفارش شما با موفقیت ثبت شد',
      content: 'سلام {{نام}},\n\nسفارش شما به شماره {{شماره_سفارش}} با موفقیت ثبت شد...',
      category: 'order'
    },
    {
      id: '3',
      name: 'تخفیف ویژه',
      subject: '🎉 تخفیف ویژه برای شما',
      content: 'سلام {{نام}},\n\nبه مناسبت {{مناسبت}}، تخفیف ویژه‌ای برای شما در نظر گرفته‌ایم...',
      category: 'promotion'
    }
  ];

  // Mock SMS templates
  const smsTemplates: SMSTemplate[] = [
    {
      id: '1',
      name: 'کد تایید',
      content: 'کد تایید شما: {{کد}}\nاین کد تا ۵ دقیقه معتبر است.',
      category: 'verification'
    },
    {
      id: '2',
      name: 'ارسال سفارش',
      content: 'سفارش {{شماره}} ارسال شد.\nکد پیگیری: {{کد_پیگیری}}',
      category: 'shipping'
    },
    {
      id: '3',
      name: 'یادآوری تخفیف',
      content: 'فرصت استفاده از تخفیف {{درصد}}% تا پایان امروز باقی مانده!',
      category: 'promotion'
    }
  ];

  const getRecipientCount = () => {
    switch (recipientType) {
      case 'selected':
        return selectedUsers.length;
      case 'filtered':
        return users.length; // This would be filtered users in real implementation
      case 'all':
        return users.length;
      default:
        return 0;
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (communicationType === 'email') {
      const template = emailTemplates.find(t => t.id === templateId);
      if (template) {
        setEmailSubject(template.subject);
        setEmailContent(template.content);
      }
    } else if (communicationType === 'sms') {
      const template = smsTemplates.find(t => t.id === templateId);
      if (template) {
        setSmsContent(template.content);
      }
    }
  };

  const handleAttachmentAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (communicationType === 'email' && (!emailSubject.trim() || !emailContent.trim())) {
      alert('لطفاً موضوع و متن ایمیل را وارد کنید');
      return;
    }

    if (communicationType === 'sms' && !smsContent.trim()) {
      alert('لطفاً متن پیامک را وارد کنید');
      return;
    }

    if (getRecipientCount() === 0) {
      alert('هیچ گیرنده‌ای انتخاب نشده است');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Sending communication:', {
        type: communicationType,
        recipientType,
        recipientCount: getRecipientCount(),
        subject: emailSubject,
        content: communicationType === 'email' ? emailContent : smsContent,
        scheduled: scheduleSend,
        scheduleDate,
        scheduleTime,
        priority,
        trackOpens,
        trackClicks,
        attachments: attachments.length
      });

      alert(
        scheduleSend 
          ? 'پیام برای ارسال در زمان تعیین شده برنامه‌ریزی شد'
          : `پیام با موفقیت برای ${toPersianNumber(getRecipientCount())} نفر ارسال شد`
      );
      
      onClose();
    } catch (error) {
      console.error('Error sending communication:', error);
      alert('خطا در ارسال پیام');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSMSLength = () => {
    const length = smsContent.length;
    const maxLength = 160;
    const parts = Math.ceil(length / maxLength);
    return { length, maxLength, parts };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-amber-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">ارتباط با مشتریان</h2>
              <p className="text-white/80">
                ارسال پیام به {toPersianNumber(getRecipientCount())} کاربر
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Communication Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                نوع ارتباط
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="communication-type"
                    value="email"
                    checked={communicationType === 'email'}
                    onChange={(e) => setCommunicationType(e.target.value as 'email')}
                  />
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>ایمیل</span>
                </label>
                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="communication-type"
                    value="sms"
                    checked={communicationType === 'sms'}
                    onChange={(e) => setCommunicationType(e.target.value as 'sms')}
                  />
                  <Phone className="w-5 h-5 text-green-600" />
                  <span>پیامک</span>
                </label>
                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="communication-type"
                    value="notification"
                    checked={communicationType === 'notification'}
                    onChange={(e) => setCommunicationType(e.target.value as 'notification')}
                  />
                  <Bell className="w-5 h-5 text-purple-600" />
                  <span>اعلان اپلیکیشن</span>
                </label>
              </div>
            </div>

            {/* Recipient Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                گیرندگان پیام
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="recipient-type"
                    value="selected"
                    checked={recipientType === 'selected'}
                    onChange={(e) => setRecipientType(e.target.value as 'selected')}
                  />
                  <span>کاربران انتخاب شده ({toPersianNumber(selectedUsers.length)} نفر)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="recipient-type"
                    value="filtered"
                    checked={recipientType === 'filtered'}
                    onChange={(e) => setRecipientType(e.target.value as 'filtered')}
                  />
                  <span>کاربران فیلتر شده ({toPersianNumber(users.length)} نفر)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="recipient-type"
                    value="all"
                    checked={recipientType === 'all'}
                    onChange={(e) => setRecipientType(e.target.value as 'all')}
                  />
                  <span>همه کاربران ({toPersianNumber(users.length)} نفر)</span>
                </label>
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                قالب پیام (اختیاری)
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">انتخاب قالب...</option>
                {(communicationType === 'email' ? emailTemplates : smsTemplates).map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Content */}
            {communicationType === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    موضوع ایمیل
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="موضوع ایمیل خود را وارد کنید..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    متن ایمیل
                  </label>
                  <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={8}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="متن ایمیل خود را وارد کنید..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    می‌توانید از متغیرهایی مثل {"{{نام}}"}, {"{{ایمیل}}"} استفاده کنید
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    فایل‌های ضمیمه
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleAttachmentAdd}
                    className="hidden"
                    id="attachment-input"
                  />
                  <label
                    htmlFor="attachment-input"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Paperclip className="w-4 h-4" />
                    افزودن فایل
                  </label>

                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SMS Content */}
            {communicationType === 'sms' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  متن پیامک
                </label>
                <textarea
                  value={smsContent}
                  onChange={(e) => setSmsContent(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="متن پیامک خود را وارد کنید..."
                />
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-gray-500">
                    می‌توانید از متغیرهایی مثل {"{{نام}}"}, {"{{کد}}"} استفاده کنید
                  </span>
                  <div className={`${getSMSLength().length > 160 ? 'text-orange-600' : 'text-gray-500'}`}>
                    {toPersianNumber(getSMSLength().length)} / {toPersianNumber(160)} 
                    ({toPersianNumber(getSMSLength().parts)} پیام)
                  </div>
                </div>
              </div>
            )}

            {/* Push Notification Content */}
            {communicationType === 'notification' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان اعلان
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="عنوان اعلان خود را وارد کنید..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    متن اعلان
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="متن اعلان خود را وارد کنید..."
                  />
                </div>
              </div>
            )}

            {/* Schedule Settings */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="schedule-send"
                  checked={scheduleSend}
                  onChange={(e) => setScheduleSend(e.target.checked)}
                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="schedule-send" className="text-sm font-medium text-gray-700">
                  زمان‌بندی ارسال
                </label>
              </div>

              {scheduleSend && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاریخ
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ساعت
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Settings */}
            {communicationType === 'email' && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">تنظیمات پیشرفته</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اولویت
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as 'low' | 'normal' | 'high')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="low">کم</option>
                      <option value="normal">معمولی</option>
                      <option value="high">زیاد</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={trackOpens}
                        onChange={(e) => setTrackOpens(e.target.checked)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm">ردیابی بازشدن ایمیل</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={trackClicks}
                        onChange={(e) => setTrackClicks(e.target.checked)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm">ردیابی کلیک روی لینک‌ها</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {scheduleSend ? (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  زمان‌بندی شده برای ارسال
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Send className="w-4 h-4" />
                  ارسال فوری به {toPersianNumber(getRecipientCount())} نفر
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                انصراف
              </button>
              <button
                onClick={handleSend}
                disabled={isSubmitting || getRecipientCount() === 0}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {scheduleSend ? 'زمان‌بندی ارسال' : 'ارسال پیام'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCommunication;