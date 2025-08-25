import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import OrderManagement from './OrderManagement';
import OrderAnalytics from './OrderAnalytics';
import { BarChart3, ShoppingBag } from 'lucide-react';

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'management' | 'analytics'>('management');

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header with Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
              مدیریت سفارشات
            </h1>
            <p className="text-gray-600 mt-1">
              مدیریت کامل سفارشات و تحلیل عملکرد فروش
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-reverse space-x-8">
            <button
              onClick={() => setActiveTab('management')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'management'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              مدیریت سفارشات
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              تحلیل و آمار
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'management' && <OrderManagement />}
          {activeTab === 'analytics' && <OrderAnalytics />}
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;