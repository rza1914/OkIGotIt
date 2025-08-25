import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { toPersianNumber, formatPersianNumber } from '../../utils/persian';

interface PersianPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  showPerPageSelector?: boolean;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
  className?: string;
}

const PersianPagination: React.FC<PersianPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  showPerPageSelector = false,
  onPerPageChange,
  perPageOptions = [5, 10, 20, 50],
  className = ''
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    // Show dots if there's a gap between 1 and start of range
    if (currentPage - delta > 2) {
      pages.push('...');
    }
    
    // Show pages around current page
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    // Show dots if there's a gap between end of range and last page
    if (currentPage + delta < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page (if different from first)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return showInfo ? (
      <div className={`flex items-center justify-center py-3 ${className}`} dir="rtl">
        <span className="text-sm text-gray-700">
          {formatPersianNumber(totalItems)} مورد
        </span>
      </div>
    ) : null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 ${className}`} dir="rtl">
      {/* Info Section */}
      {showInfo && (
        <div className="text-sm text-gray-700 order-2 sm:order-1">
          نمایش {toPersianNumber(startIndex)} تا {toPersianNumber(endIndex)} از {formatPersianNumber(totalItems)} مورد
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="صفحه قبل"
        >
          <ChevronRight className="w-4 h-4 ml-1" />
          قبلی
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            const page = pageNum as number;
            const isActive = page === currentPage;

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors min-w-[2.5rem] ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {toPersianNumber(page)}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="صفحه بعد"
        >
          بعدی
          <ChevronLeft className="w-4 h-4 mr-1" />
        </button>
      </div>

      {/* Per Page Selector */}
      {showPerPageSelector && onPerPageChange && (
        <div className="flex items-center gap-2 text-sm text-gray-700 order-3">
          <span>نمایش</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            {perPageOptions.map(option => (
              <option key={option} value={option}>
                {toPersianNumber(option)}
              </option>
            ))}
          </select>
          <span>مورد</span>
        </div>
      )}
    </div>
  );
};

export default PersianPagination;