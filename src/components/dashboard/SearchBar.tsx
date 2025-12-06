import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';
import axios from 'axios';
import FilterButton, { FilterValues } from '../form/FilterButton';
import './SearchBar.css';

type StockBasic = {
  symbol: string;
  company: string;
};

type SearchBarProps = {
  onSubmit?: (searchText: string, filters: FilterValues) => void;
};

const API_BASE = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:5001';

const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    country: [],
    min_price: 0,
    max_price: 0,
    sector: [],
    sub_sector: [],
    activeFilters: {
      price: false,
      country: false,
      sector: false,
      subSector: false
    }
  });

  // Stock data cache
  const [allStocks, setAllStocks] = useState<StockBasic[]>([]);
  const [isLoadingStocks, setIsLoadingStocks] = useState(false);
  const hasFetchedRef = useRef(false);

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const RESULTS_PER_PAGE = 5;
  const MAX_RESULTS = 25;

  // Fetch all stocks on first character
  const fetchAllStocks = async () => {
    console.log('fetchAllStocks called');
    if (hasFetchedRef.current || isLoadingStocks) {
      console.log('Skipping fetch - already fetched or loading:', { hasFetched: hasFetchedRef.current, isLoading: isLoadingStocks });
      return;
    }
    
    setIsLoadingStocks(true);
    hasFetchedRef.current = true;
    
    const url = `${API_BASE}/stocks/all/symbols`;
    console.log('Fetching from:', url);
    
    try {
      const response = await axios.get(url);
      console.log('Received stocks:', response.data.length, 'items');
      const stocks: StockBasic[] = response.data.map((stock: any) => ({
        symbol: stock.symbol,
        company: stock.company
      }));
      setAllStocks(stocks);
      console.log('Stocks cached successfully');
    } catch (error) {
      console.error('Failed to fetch stocks:', error);
      hasFetchedRef.current = false; // Allow retry on error
    } finally {
      setIsLoadingStocks(false);
    }
  };

  // Create Fuse instance for fuzzy searching
  const fuse = useMemo(() => {
    if (allStocks.length === 0) return null;
    
    return new Fuse(allStocks, {
      keys: ['symbol', 'company'],
      threshold: 0.3,
      distance: 100,
      minMatchCharLength: 1,
      includeScore: true,
    });
  }, [allStocks]);

  // Get fuzzy search results with sorting (starts-with first)
  const searchResults = useMemo(() => {
    if (!fuse || searchText.trim().length === 0) return [];
    
    const results = fuse.search(searchText);
    const items = results.slice(0, MAX_RESULTS).map(result => result.item);
    
    // Sort: prioritize stocks where symbol or company STARTS with search text
    const searchLower = searchText.toLowerCase();
    return items.sort((a, b) => {
      const aSymbolStarts = a.symbol.toLowerCase().startsWith(searchLower);
      const aCompanyStarts = a.company.toLowerCase().startsWith(searchLower);
      const bSymbolStarts = b.symbol.toLowerCase().startsWith(searchLower);
      const bCompanyStarts = b.company.toLowerCase().startsWith(searchLower);
      
      // Prioritize symbol starts over company starts
      if (aSymbolStarts && !bSymbolStarts) return -1;
      if (bSymbolStarts && !aSymbolStarts) return 1;
      if (aCompanyStarts && !bCompanyStarts) return -1;
      if (bCompanyStarts && !aCompanyStarts) return 1;
      
      // If both or neither start with search, keep Fuse.js relevance order
      return 0;
    });
  }, [fuse, searchText]);

  // Paginated results
  const paginatedResults = useMemo(() => {
    const start = currentPage * RESULTS_PER_PAGE;
    return searchResults.slice(start, start + RESULTS_PER_PAGE);
  }, [searchResults, currentPage]);

  const totalPages = Math.ceil(searchResults.length / RESULTS_PER_PAGE);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Search input changed:', value, 'Length:', value.length);
    console.log('hasFetchedRef.current:', hasFetchedRef.current);
    setSearchText(value);
    setCurrentPage(0);
    
    // Fetch stocks on first character
    if (value.length === 1 && !hasFetchedRef.current) {
      console.log('Triggering fetchAllStocks()...');
      fetchAllStocks();
    }
    
    setShowSuggestions(value.length > 0);
  };

  // Handle suggestion click
  const handleSuggestionClick = (stock: StockBasic) => {
    setSearchText(stock.symbol);
    setShowSuggestions(false);
    onSubmit?.(stock.symbol, filters);
  };

  const handleSubmit = () => {
    setShowSuggestions(false);
    onSubmit?.(searchText, filters);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
    if (event.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dashboard__search-wrapper">
      <div className="dashboard__search" ref={suggestionsRef}>
        <span className="dashboard__search-icon" aria-hidden="true">
          <Search className="dashboard__search-icon-svg" />
        </span>
        <input
          className="dashboard__search-input"
          type="search"
          placeholder="Search by symbol or company name..."
          aria-label="Search stocks"
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchText.length > 0 && setShowSuggestions(true)}
        />
        
        {/* Autocomplete suggestions dropdown */}
        {showSuggestions && (
          <div className="search-suggestions">
            {isLoadingStocks ? (
              <div className="search-suggestions__loading">Loading stocks...</div>
            ) : searchResults.length === 0 ? (
              <div className="search-suggestions__empty">No matches found</div>
            ) : (
              <>
                <div className="search-suggestions__list">
                  {paginatedResults.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="search-suggestions__item"
                      onClick={() => handleSuggestionClick(stock)}
                    >
                      <span className="search-suggestions__symbol">{stock.symbol}</span>
                      <span className="search-suggestions__company">{stock.company}</span>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="search-suggestions__pagination">
                    <button
                      className="search-suggestions__nav-btn"
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="search-suggestions__page-info">
                      {currentPage + 1} / {totalPages}
                    </span>
                    <button
                      className="search-suggestions__nav-btn"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage === totalPages - 1}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <FilterButton onFiltersChange={setFilters} />
    </div>
  );
};

export default SearchBar;
