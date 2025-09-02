import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Plus,
  Eye,
  Edit3,
  Trash2,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Lock,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Save
} from 'lucide-react';
import { formatPersianDateTime, toPersianNumber } from '../../utils/persian';

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive' | 'blocked';
  created_at: string;
  last_login?: string;
  avatar?: string;
  address?: string;
  national_id?: string;
  total_orders?: number;
  total_spent?: number;
}

const mockUsers: UserData[] = [
  {
    id: 1,
    first_name: 'علی',
    last_name: 'محمدی',
    username: 'ali.mohammadi',
    email: 'ali@example.com',
    phone: '09123456789',
    role: 'admin',
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
    last_login: '2024-12-20T09:15:00Z',
    total_orders: 15,
    total_spent: 25000000
  },
  {
    id: 2,
    first_name: 'فاطمه',
    last_name: 'احمدی',
    username: 'fateme.ahmadi',
    email: 'fateme@example.com',
    phone: '09123456788',
    role: 'user',
    status: 'active',
    created_at: '2024-02-10T14:20:00Z',
    last_login: '2024-12-19T16:45:00Z',
    total_orders: 8,
    total_spent: 12000000
  },
  {
    id: 3,
    first_name: 'محمد',
    last_name: 'رضایی',
    username: 'mohammad.rezaei',
    email: 'mohammad@example.com',
    phone: '09123456787',
    role: 'editor',
    status: 'inactive',
    created_at: '2024-03-05T11:10:00Z',
    last_login: '2024-11-15T12:30:00Z',
    total_orders: 3,
    total_spent: 4500000
  },
  {
    id: 4,
    first_name: 'زهرا',
    last_name: 'کریمی',
    username: 'zahra.karimi',
    email: 'zahra@example.com',
    phone: '09123456786',
    role: 'user',
    status: 'blocked',
    created_at: '2024-04-12T08:45:00Z',
    total_orders: 0,
    total_spent: 0
  }
];

const roleOptions = [
  { value: 'all', label: 'همه نقش‌ها' },
  { value: 'admin', label: 'مدیر' },
  { value: 'user', label: 'کاربر عادی' },
  { value: 'editor', label: 'ویرایشگر' }
];

const statusOptions = [
  { value: 'all', label: 'همه وضعیت‌ها' },
  { value: 'active', label: 'فعال' },
  { value: 'inactive', label: 'غیرفعال' },
  { value: 'blocked', label: 'مسدود' }
];

const getRoleInfo = (role: UserData['role']) => {
  const roleMap = {
    admin: { label: 'مدیر', color: 'bg-red-100 text-red-800', icon: Shield },
    user: { label: 'کاربر عادی', color: 'bg-blue-100 text-blue-800', icon: User },
    editor: { label: 'ویرایشگر', color: 'bg-purple-100 text-purple-800', icon: Edit3 }
  };
  return roleMap[role] || roleMap.user;
};

const getStatusInfo = (status: UserData['status']) => {
  const statusMap = {
    active: { label: 'فعال', color: 'bg-green-100 text-green-800', icon: UserCheck },
    inactive: { label: 'غیرفعال', color: 'bg-gray-100 text-gray-800', icon: UserX },
    blocked: { label: 'مسدود', color: 'bg-red-100 text-red-800', icon: Lock }
  };
  return statusMap[status] || statusMap.active;
};

interface UserFormData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  role: UserData['role'];
  status: UserData['status'];
}

const initialFormData: UserFormData = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  role: 'user',
  status: 'active'
};

const UserManagement: React.FC = () => {
  const [users] = useState<UserData[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const newUsersThisMonth = users.filter(u => {
      const userDate = new Date(u.created_at);
      const now = new Date();
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
    }).length;

    return { totalUsers, activeUsers, adminUsers, newUsersThisMonth };
  }, [users]);

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.first_name.includes(searchTerm) ||
        user.last_name.includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = (a.first_name + ' ' + a.last_name).localeCompare(b.first_name + ' ' + b.last_name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const handleSort = (field: 'name' | 'email' | 'role' | 'created_at') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleAddUser = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  const handleEditUser = (user: UserData) => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status
    });
    setIsEditing(true);
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      console.log('Updating user:', formData);
    } else {
      console.log('Creating user:', formData);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      console.log('Deleting user:', userId);
    }
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.length === 0) return;
    
    const actionText = action === 'activate' ? 'فعال‌سازی' : action === 'deactivate' ? 'غیرفعال‌سازی' : 'حذف';
    if (confirm(`آیا از ${actionText} کاربران انتخاب شده اطمینان دارید؟`)) {
      console.log(`Bulk ${action}:`, selectedUsers);
      setSelectedUsers([]);
    }
  };

  const handleExportUsers = () => {
    console.log('Exporting users to Excel');
  };

  const handleResetPassword = (userId: number) => {
    if (confirm('آیا از بازنشانی رمز عبور این کاربر اطمینان دارید؟')) {
      console.log('Resetting password for user:', userId);
    }
  };

  const getAvatarFallback = (firstName: string, lastName: string) => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl" dir="rtl">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">مدیریت کاربران</h1>
          <p className="text-gray-600">مدیریت کاربران، نقش‌ها و دسترسی‌های سیستم</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل کاربران</p>
                <p className="text-2xl font-bold text-gray-900">
                  {toPersianNumber(stats.totalUsers)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کاربران فعال</p>
                <p className="text-2xl font-bold text-green-600">
                  {toPersianNumber(stats.activeUsers)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مدیران</p>
                <p className="text-2xl font-bold text-red-600">
                  {toPersianNumber(stats.adminUsers)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ShieldCheck className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">عضو جدید این ماه</p>
                <p className="text-2xl font-bold text-purple-600">
                  {toPersianNumber(stats.newUsersThisMonth)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
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
                  placeholder="جستجو بر اساس نام، ایمیل، نام کاربری..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Role Filter */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

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
            </div>

            <div className="flex gap-2">
              {selectedUsers.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    فعال‌سازی
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                  >
                    غیرفعال‌سازی
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    حذف ({toPersianNumber(selectedUsers.length)})
                  </button>
                </div>
              )}
              
              <button
                onClick={handleExportUsers}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="h-5 w-5" />
                <span>خروجی Excel</span>
              </button>
              
              <button
                onClick={handleAddUser}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                <span>افزودن کاربر</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-right">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">تصویر</th>
                  <th 
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <span>نام و نام خانوادگی</span>
                      {sortBy === 'name' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-1">
                      <span>ایمیل</span>
                      {sortBy === 'email' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-1">
                      <span>نقش</span>
                      {sortBy === 'role' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">وضعیت</th>
                  <th 
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-1">
                      <span>تاریخ عضویت</span>
                      {sortBy === 'created_at' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  const statusInfo = getStatusInfo(user.status);
                  const RoleIcon = roleInfo.icon;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.first_name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            getAvatarFallback(user.first_name, user.last_name)
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-gray-900">{user.email}</div>
                          {user.phone && (
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${roleInfo.color}`}>
                          <RoleIcon className="h-4 w-4" />
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatPersianDateTime(new Date(user.created_at))}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            title="مشاهده جزئیات"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
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
                                <button
                                  onClick={() => handleResetPassword(user.id)}
                                  className="w-full text-right px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                                >
                                  <Lock className="h-4 w-4" />
                                  بازنشانی رمز عبور
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="w-full text-right px-3 py-2 text-sm hover:bg-gray-100 rounded text-red-600 flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  حذف کاربر
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

        {/* User Detail Modal */}
        {isDetailModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold">جزئیات کاربر</h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* User Avatar and Basic Info */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700">
                    {selectedUser.avatar ? (
                      <img src={selectedUser.avatar} alt={selectedUser.first_name} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      getAvatarFallback(selectedUser.first_name, selectedUser.last_name)
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {selectedUser.first_name} {selectedUser.last_name}
                    </h4>
                    <p className="text-gray-600">@{selectedUser.username}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRoleInfo(selectedUser.role).color}`}>
                        {getRoleInfo(selectedUser.role).label}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusInfo(selectedUser.status).color}`}>
                        {getStatusInfo(selectedUser.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900">اطلاعات تماس</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span>{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span>{selectedUser.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900">فعالیت کاربر</h5>
                    <div className="space-y-2">
                      <p><span className="font-medium">تاریخ عضویت:</span> {formatPersianDateTime(new Date(selectedUser.created_at))}</p>
                      {selectedUser.last_login && (
                        <p><span className="font-medium">آخرین ورود:</span> {formatPersianDateTime(new Date(selectedUser.last_login))}</p>
                      )}
                      {selectedUser.total_orders !== undefined && (
                        <p><span className="font-medium">تعداد سفارشات:</span> {toPersianNumber(selectedUser.total_orders)}</p>
                      )}
                      {selectedUser.total_spent !== undefined && (
                        <p><span className="font-medium">کل خرید:</span> {toPersianNumber(selectedUser.total_spent)} تومان</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    آخرین به‌روزرسانی: {formatPersianDateTime(new Date())}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleResetPassword(selectedUser.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      <Lock className="h-4 w-4" />
                      بازنشانی رمز
                    </button>
                    <button
                      onClick={() => handleEditUser(selectedUser)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit3 className="h-4 w-4" />
                      ویرایش
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Form Modal */}
        {isFormModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold">
                  {isEditing ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
                </h3>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تلفن</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                {!isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
                    <input
                      type="password"
                      required={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نقش</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserData['role'] }))}
                    >
                      <option value="user">کاربر عادی</option>
                      <option value="editor">ویرایشگر</option>
                      <option value="admin">مدیر</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as UserData['status'] }))}
                    >
                      <option value="active">فعال</option>
                      <option value="inactive">غیرفعال</option>
                      <option value="blocked">مسدود</option>
                    </select>
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
                    {isEditing ? 'به‌روزرسانی' : 'ایجاد کاربر'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;