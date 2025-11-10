import React, { useState } from 'react';
import { Search } from 'lucide-react';
import FilterButton, { FilterValues } from '../form/FilterButton';

type SearchBarProps = {
  onSubmit?: (searchText: string, filters: FilterValues) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    country: [],
    min_price: 0,
    max_price: 0,
    sector: "",
    sub_sector: ""
  });

  const handleSubmit = () => {
    onSubmit?.(searchText, filters);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="dashboard__search-wrapper">
      <div className="dashboard__search">
        <span className="dashboard__search-icon" aria-hidden="true">
          <Search className="dashboard__search-icon-svg" />
        </span>
        <input
          className="dashboard__search-input"
          type="search"
          placeholder="Search by symbol or company name..."
          aria-label="Search stocks"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <FilterButton onFiltersChange={setFilters} />
    </div>
  );
};

export default SearchBar;
