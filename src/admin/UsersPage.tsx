import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import UserManagement from './UserManagement';
import UserAnalytics from './UserAnalytics';
import CustomerCommunication from './components/CustomerCommunication';
import PersianUserForm from './components/PersianUserForm';
import { 
  Users, TrendingUp, Mail, UserPlus, 
  BarChart3, Settings, Download
} from 'lucide-react';

interface User {
  id: string;
  avatar?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'blocked' | 'suspended';
  user_type: 'customer' | 'vip' | 'premium' | 'blocked';
  email_verified: boolean;
  phone_verified: boolean;
  registration_date: Date;
  last_login: Date;
  total_orders: number;
  total_spent: number;
  loyalty_points: number;
  province?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  national_id?: string;
  birthday?: Date;
  gender?: 'male' | 'female' | 'other';
  referral_code?: string;
  referred_by?: string;
  last_activity: Date;
  account_age_days: number;
  total_reviews: number;
  average_rating: number;
  support_tickets: number;
  newsletter_subscribed: boolean;
  sms_subscribed: boolean;
  two_factor_enabled: boolean;
  gdpr_consent: boolean;
  data_processing_consent: boolean;
  marketing_consent: boolean;
  data_retention_days?: number;
}

const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'management' | 'analytics' | 'segments'>('management');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showCommunication, setShowCommunication] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  // Mock users data
  const mockUsers: User[] = [
    {
      id: '1',
      avatar: '/api/placeholder/40/40',
      first_name: 'علی',
      last_name: 'محمدی',
      email: 'ali.mohammadi@email.com',
      phone: '09123456789',
      status: 'active',
      user_type: 'vip',
      email_verified: true,
      phone_verified: true,
      registration_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      last_login: new Date(Date.now() - 2 * 60 * 60 * 1000),
      total_orders: 45,
      total_spent: 25000000,
      loyalty_points: 2500,
      province: 'تهران',
      city: 'تهران',
      address: 'خیابان ولیعصر، نرسیده به میدان ونک',
      postal_code: '1234567890',
      national_id: '1234567890',
      birthday: new Date(1990, 5, 15),
      gender: 'male',
      referral_code: 'ALI2024',
      last_activity: new Date(Date.now() - 30 * 60 * 1000),
      account_age_days: 365,
      total_reviews: 12,
      average_rating: 4.8,
      support_tickets: 2,
      newsletter_subscribed: true,
      sms_subscribed: true,
      two_factor_enabled: true,
      gdpr_consent: true,
      data_processing_consent: true,
      marketing_consent: true,
      data_retention_days: 730
    },
    {
      id: '2',
      avatar: '/api/placeholder/40/40',
      first_name: 'مریم',
      last_name: 'احمدی',
      email: 'maryam.ahmadi@email.com',
      phone: '09987654321',
      status: 'active',
      user_type: 'customer',
      email_verified: true,
      phone_verified: false,
      registration_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      last_login: new Date(Date.now() - 24 * 60 * 60 * 1000),
      total_orders: 12,
      total_spent: 5500000,
      loyalty_points: 550,
      province: 'اصفهان',
      city: 'اصفهان',
      last_activity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      account_age_days: 90,
      total_reviews: 5,
      average_rating: 4.2,
      support_tickets: 1,
      newsletter_subscribed: false,
      sms_subscribed: true,
      two_factor_enabled: false,
      gdpr_consent: true,
      data_processing_consent: true,
      marketing_consent: false,
      data_retention_days: 365
    },
    {
      id: '3',
      avatar: '/api/placeholder/40/40',
      first_name: 'حسن',
      last_name: 'رضایی',
      email: 'hassan.rezaei@email.com',
      phone: '09112345678',
      status: 'suspended',
      user_type: 'customer',
      email_verified: false,
      phone_verified: true,
      registration_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      last_login: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      total_orders: 3,
      total_spent: 1200000,
      loyalty_points: 120,
      province: 'شیراز',
      city: 'شیراز',
      last_activity: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      account_age_days: 30,
      total_reviews: 1,
      average_rating: 2.0,
      support_tickets: 3,
      newsletter_subscribed: true,
      sms_subscribed: false,
      two_factor_enabled: false,
      gdpr_consent: false,
      data_processing_consent: true,
      marketing_consent: true,
      data_retention_days: 365
    }
  ];

  const handleSaveUser = async (userData: User) => {
    try {
      console.log('Saving user:', userData);
      // Here you would typically call an API to save the user
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditingUser(undefined);
      setShowUserForm(false);
      // Refresh users list in real implementation
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const handleStatusChange = (userId: string, newStatus: string, reason: string, note?: string) => {
    console.log('Changing user status:', { userId, newStatus, reason, note });
    // Here you would typically call an API to update the user status
  };

  const handleNewUser = () => {
    setEditingUser(undefined);
    setShowUserForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const tabs = [
    { 
      key: 'management', 
      label: 'مدیریت کاربران', 
      icon: Users,
      description: 'مشاهده و مدیریت کاربران'
    },
    { 
      key: 'analytics', 
      label: 'آنالیتیک کاربران', 
      icon: TrendingUp,
      description: 'آمار و تحلیل رفتار کاربران'
    },
    { 
      key: 'segments', 
      label: 'بخش‌بندی کاربران', 
      icon: BarChart3,
      description: 'دسته‌بندی و هدف‌گذاری'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header with Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              مدیریت کاربران
            </h1>
            <p className="text-gray-600 mt-1">
              مدیریت کامل کاربران، تحلیل رفتار و ارتباط با مشتریان
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedUsers.length > 0 && (
              <button 
                onClick={() => setShowCommunication(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                ارسال پیام ({selectedUsers.length})
              </button>
            )}
            
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              صادرات
            </button>
            
            <button className="btn-secondary flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              گزارش کاربران
            </button>
            
            <button 
              onClick={handleNewUser}
              className="btn-primary flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              کاربر جدید
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white rounded-t-xl">
          <nav className="flex space-x-reverse space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-right">
                    <div>{tab.label}</div>
                    <div className="text-xs font-normal text-gray-400">
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl min-h-96">
          {activeTab === 'management' && (
            <UserManagement 
              users={mockUsers}
              selectedUsers={selectedUsers}
              onSelectionChange={setSelectedUsers}
              onEditUser={handleEditUser}
              onStatusChange={handleStatusChange}
            />
          )}
          
          {activeTab === 'analytics' && <UserAnalytics />}
          
          {activeTab === 'segments' && (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                بخش‌بندی کاربران
              </h3>
              <p className="text-gray-600 mb-6">
                سیستم بخش‌بندی خودکار کاربران بر اساس رفتار و ویژگی‌ها در حال توسعه است
              </p>
              <div className="flex justify-center gap-3">
                <button className="btn-secondary flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  تنظیمات بخش‌بندی
                </button>
                <button className="btn-primary flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  ایجاد بخش جدید
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Form Modal */}
        <PersianUserForm
          user={editingUser}
          isOpen={showUserForm}
          onClose={() => {
            setShowUserForm(false);
            setEditingUser(undefined);
          }}
          onSave={handleSaveUser}
        />

        {/* Customer Communication Modal */}
        <CustomerCommunication
          users={mockUsers}
          selectedUsers={selectedUsers}
          isOpen={showCommunication}
          onClose={() => setShowCommunication(false)}
        />
      </div>
    </AdminLayout>
  );
};

export default UsersPage;