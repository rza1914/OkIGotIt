import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { apiClient } from '../../lib/api';
import SearchResultsPanel from './SearchResultsPanel';

interface SearchResult {
  id: number;
  name: string;
  price: number;
  image_url?: string;
}

interface SearchBarProps {
  onSelectProduct?: (product: SearchResult) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await apiClient.searchProducts(searchQuery, 6);
      setResults(searchResults);
      setShowResults(true);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
        
      case 'Escape':
        setShowResults(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    inputRef.current?.blur();
    
    if (onSelectProduct) {
      onSelectProduct(result);
    } else {
      // Default behavior: navigate to product page
      window.location.href = `/product/${result.id}`;
    }
  };

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking on cart button or other controls
      if (
        target.closest('[data-cart-button]') ||
        target.closest('[role="button"]') ||
        target.closest('button')
      ) {
        return;
      }
      
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {};
  }, [showResults]);

  // Global keyboard shortcut (/ or Ctrl+K)
  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeydown);
    return () => document.removeEventListener('keydown', handleGlobalKeydown);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (query.length >= 2 && results.length > 0) {
              setShowResults(true);
            }
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="جستجو محصولات..."
          className="w-full pl-4 pr-10 py-2 text-sm bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-colors"
          aria-label="جستجوی محصولات"
          aria-expanded={showResults}
          aria-controls="search-results"
          role="combobox"
          autoComplete="off"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-y-0 left-3 flex items-center">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-rose-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Keyboard shortcut hint */}
        {!isFocused && !query && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-mono text-gray-400 bg-gray-100 rounded border">
              /
            </kbd>
          </div>
        )}
      </div>

      {/* Search Results Panel */}
      <SearchResultsPanel
        results={results}
        isVisible={showResults}
        onSelectResult={handleSelectResult}
        selectedIndex={selectedIndex}
      />
    </div>
  );
};

export default SearchBar;