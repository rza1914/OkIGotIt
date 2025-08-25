import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, MoreHorizontal } from 'lucide-react';
import { toPersianNumber, toEnglishNumber } from '../../utils/persian';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'right' | 'left' | 'center';
  render?: (value: any, row: any) => React.ReactNode;
}

interface PersianDataTableProps {
  data: any[];
  columns: Column[];
  itemsPerPage?: number;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: any[]) => void;
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

const PersianDataTable: React.FC<PersianDataTableProps> = ({
  data,
  columns,
  itemsPerPage = 10,
  searchable = true,
  filterable = false,
  sortable = true,
  selectable = false,
  onSelectionChange,
  onRowClick,
  emptyMessage = 'اطلاعاتی یافت نشد',
  loading = false,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Search filtering
    if (searchTerm) {
      const englishSearchTerm = toEnglishNumber(searchTerm.toLowerCase());
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(value).toLowerCase().includes(englishSearchTerm)
        )
      );
    }

    // Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (key: string) => {
    if (!sortable) return;
    
    setSortConfig(current => {
      if (current?.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' };
        } else {
          return null;
        }
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedData);
      onSelectionChange?.(paginatedData);
    } else {
      setSelectedItems([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectItem = (item: any, checked: boolean) => {
    const newSelection = checked 
      ? [...selectedItems, item]
      : selectedItems.filter(selected => selected.id !== item.id);
    
    setSelectedItems(newSelection);
    onSelectionChange?.(newSelection);
  };

  const renderSortIcon = (column: Column) => {
    if (!sortable || !column.sortable) return null;
    
    const isActive = sortConfig?.key === column.key;
    
    return (
      <span className="ml-1">
        {isActive ? (
          sortConfig?.direction === 'asc' ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )
        ) : (
          <ChevronDown className="w-4 h-4 opacity-50" />
        )}
      </span>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pageNumbers.push(i);
        pageNumbers.push('...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pageNumbers.push(1, '...');
        for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1, '...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...', totalPages);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50" dir="rtl">
        <div className="text-sm text-gray-700">
          نمایش {toPersianNumber((currentPage - 1) * itemsPerPage + 1)} تا{' '}
          {toPersianNumber(Math.min(currentPage * itemsPerPage, filteredAndSortedData.length))} از{' '}
          {toPersianNumber(filteredAndSortedData.length)} نتیجه
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            قبلی
          </button>
          
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={index} className="px-2 py-1 text-gray-500">...</span>
            ) : (
              <button
                key={index}
                onClick={() => setCurrentPage(page as number)}
                className={`px-3 py-1 text-sm border rounded-md ${
                  currentPage === page
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {toPersianNumber(page as number)}
              </button>
            )
          ))}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            بعدی
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
          {[...Array(itemsPerPage)].map((_, i) => (
            <div key={i} className="px-4 py-3 border-b border-gray-200">
              <div className="flex space-x-4 space-x-reverse">
                {columns.map((_, colIndex) => (
                  <div key={colIndex} className="h-4 bg-gray-300 rounded flex-1"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Search and Filters */}
      {(searchable || filterable) && (
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-4" dir="rtl">
          {searchable && (
            <div className="relative flex-1">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="جستجو..."
              />
            </div>
          )}
          
          {filterable && (
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              فیلتر
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-${column.align || 'right'} text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable && sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.label}</span>
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <MoreHorizontal className="h-8 w-8 text-gray-400" />
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.some(item => item.id === row.id)}
                        onChange={(e) => handleSelectItem(row, e.target.checked)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 text-${column.align || 'right'} text-sm text-gray-900`}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default PersianDataTable;