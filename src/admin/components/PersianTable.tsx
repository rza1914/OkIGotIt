import React, { ReactNode } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { toPersianNumber } from '../../utils/persian';

interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (item: T, index: number) => ReactNode;
  width?: string;
  className?: string;
}

interface PersianTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  onRowClick?: (item: T, index: number) => void;
  selectedRows?: Set<string | number>;
  onRowSelect?: (id: string | number) => void;
  idKey?: keyof T;
  selectAllCheckbox?: boolean;
  onSelectAll?: () => void;
}

function PersianTable<T>({
  data,
  columns,
  onSort,
  sortKey,
  sortDirection,
  loading = false,
  emptyMessage = 'هیچ داده‌ای یافت نشد',
  className = '',
  striped = true,
  hoverable = true,
  bordered = true,
  onRowClick,
  selectedRows,
  onRowSelect,
  idKey,
  selectAllCheckbox = false,
  onSelectAll
}: PersianTableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;
    
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  const getSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-rose-600" />
      : <ChevronDown className="w-4 h-4 text-rose-600" />;
  };

  const isRowSelected = (item: T, index: number) => {
    if (!selectedRows || !idKey) return false;
    const id = item[idKey] as string | number;
    return selectedRows.has(id);
  };

  const handleRowSelect = (item: T) => {
    if (!onRowSelect || !idKey) return;
    const id = item[idKey] as string | number;
    onRowSelect(id);
  };

  const allRowsSelected = selectedRows && data.length > 0 && data.every(item => {
    if (!idKey) return false;
    const id = item[idKey] as string | number;
    return selectedRows.has(id);
  });

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm ${bordered ? 'border border-gray-200' : ''} ${className}`}>
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگیری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${bordered ? 'border border-gray-200' : ''} ${className}`} dir="rtl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-l from-gray-50 to-gray-100">
            <tr>
              {/* Checkbox column */}
              {(selectedRows || selectAllCheckbox) && (
                <th className="px-6 py-4 text-right">
                  {selectAllCheckbox && (
                    <input
                      type="checkbox"
                      checked={allRowsSelected}
                      onChange={onSelectAll}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                  )}
                </th>
              )}
              
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                  } ${column.className || ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.title}</span>
                    {column.sortable && getSortIcon(column.key as string)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectedRows || selectAllCheckbox ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-gray-400 text-xl">📋</span>
                    </div>
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className={`
                    ${striped && index % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}
                    ${hoverable ? 'hover:bg-rose-50/30 transition-colors' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${isRowSelected(item, index) ? 'bg-rose-100/50 border-r-4 border-rose-400' : ''}
                  `}
                  onClick={() => onRowClick?.(item, index)}
                >
                  {/* Checkbox column */}
                  {(selectedRows || selectAllCheckbox) && (
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isRowSelected(item, index)}
                        onChange={() => handleRowSelect(item)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                    </td>
                  )}
                  
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 text-sm ${column.className || ''}`}
                    >
                      {column.render 
                        ? column.render(item, index)
                        : String((item as any)[column.key] || '')
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PersianTable;