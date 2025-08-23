import React from 'react';
import { formatPriceFa } from '../../lib/fmt';

interface SearchResult {
  id: number;
  name: string;
  price: number;
  image_url?: string;
}

interface SearchResultsPanelProps {
  results: SearchResult[];
  isVisible: boolean;
  onSelectResult: (result: SearchResult) => void;
  selectedIndex: number;
}

const SearchResultsPanel: React.FC<SearchResultsPanelProps> = ({
  results,
  isVisible,
  onSelectResult,
  selectedIndex
}) => {
  if (!isVisible || results.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50"
      role="listbox"
      aria-label="نتایج جستجو"
    >
      <div className="max-h-80 overflow-y-auto">
        {results.map((result, index) => (
          <div
            key={result.id}
            role="option"
            aria-selected={index === selectedIndex}
            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${
              index === selectedIndex 
                ? 'bg-gradient-to-r from-amber-50 to-rose-50' 
                : 'hover:bg-gray-50/80'
            }`}
            onClick={() => onSelectResult(result)}
          >
            {/* Product Image */}
            <div className="w-10 h-10 flex-shrink-0">
              {result.image_url ? (
                <img
                  src={result.image_url}
                  alt={result.name}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-400">N/A</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate text-sm">
                {result.name}
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                {formatPriceFa(result.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer hint */}
      <div className="px-3 py-2 bg-gray-50/80 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Enter برای انتخاب • ESC برای بستن
        </p>
      </div>
    </div>
  );
};

export default SearchResultsPanel;