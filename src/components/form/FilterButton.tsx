import { ButtonHTMLAttributes, useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import "./FilterButton.css";

type FilterButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  onFiltersChange?: (filters: FilterValues) => void;
};

type Filters = {
  price: boolean;
  country: boolean;
  sector: boolean;
  subSector: boolean;
};

export type FilterValues = {
  country: string[];
  min_price: number;
  max_price: number;
  sector: string;
  sub_sector: string;
};

const COUNTRIES = ["United States", "Canada", "France", "Netherlands"];

const FilterButton = ({ type = 'button', onFiltersChange, ...buttonProps }: FilterButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    price: false,
    country: false,
    sector: false,
    subSector: false,
  });

  const [filterValues, setFilterValues] = useState<FilterValues>({
    country: [],
    min_price: 0,
    max_price: 0,
    sector: "",
    sub_sector: ""
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const handleCheckboxChange = (filterName: keyof Filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const handleCountryToggle = (country: string) => {
    setFilterValues(prev => {
      const newCountries = prev.country.includes(country)
        ? prev.country.filter(c => c !== country)
        : [...prev.country, country];
      
      const newFilterValues = { ...prev, country: newCountries };
      onFiltersChange?.(newFilterValues);
      return newFilterValues;
    });
  };

  const handlePriceChange = (field: 'min_price' | 'max_price', value: string) => {
    setFilterValues(prev => {
      const numValue = value === '' ? 0 : Number(value);
      const newFilterValues = { ...prev, [field]: numValue };
      onFiltersChange?.(newFilterValues);
      return newFilterValues;
    });
  };

  return (
    <div className="filter-button-container">
      <button
        type={type}
        className="filter-button"
        onClick={() => setIsOpen(!isOpen)}
        {...buttonProps}
      >
        <SlidersHorizontal className="filter-button__icon" />
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.price}
              onChange={() => handleCheckboxChange('price')}
              className="filter-checkbox"
            />
            <span className="filter-label">Price</span>
          </label>
          
          {filters.price && (
            <div className="filter-expansion">
              <div className="filter-price-inputs">
                <div className="filter-price-group">
                  <label className="filter-price-label">Min</label>
                  <input
                    type="number"
                    className="filter-price-input"
                    placeholder="0"
                    min="0"
                    value={filterValues.min_price || ''}
                    onChange={(e) => handlePriceChange('min_price', e.target.value)}
                  />
                </div>
                <div className="filter-price-group">
                  <label className="filter-price-label">Max</label>
                  <input
                    type="number"
                    className="filter-price-input"
                    placeholder="No max"
                    min="0"
                    value={filterValues.max_price || ''}
                    onChange={(e) => handlePriceChange('max_price', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.country}
              onChange={() => handleCheckboxChange('country')}
              className="filter-checkbox"
            />
            <span className="filter-label">Country</span>
          </label>

          {filters.country && (
            <div className="filter-expansion">
              <button
                type="button"
                className="filter-country-dropdown-btn"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              >
                <span>
                  {filterValues.country.length === 0 
                    ? 'Select countries...' 
                    : `${filterValues.country.length} selected`}
                </span>
                <ChevronDown size={16} />
              </button>
              
              {isCountryDropdownOpen && (
                <div className="filter-country-list">
                  {COUNTRIES.map(country => (
                    <label key={country} className="filter-country-option">
                      <input
                        type="checkbox"
                        checked={filterValues.country.includes(country)}
                        onChange={() => handleCountryToggle(country)}
                        className="filter-country-checkbox"
                      />
                      <span>{country}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.sector}
              onChange={() => handleCheckboxChange('sector')}
              className="filter-checkbox"
            />
            <span className="filter-label">Sector</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.subSector}
              onChange={() => handleCheckboxChange('subSector')}
              className="filter-checkbox"
            />
            <span className="filter-label">Sub-Sector</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default FilterButton;    