import React from 'react';
import { Search } from 'lucide-react';
import FilterButton from '../form/FilterButton';

type SearchBarProps = {
  onSubmit?: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit?.();
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
          onKeyDown={handleKeyDown}
        />
      </div>
      <FilterButton />
    </div>
  );
};

export default SearchBar;
