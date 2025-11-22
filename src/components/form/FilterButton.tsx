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
  sector: string[];
  sub_sector: string[];
};

const COUNTRIES = ["United States", "Canada", "France", "Netherlands"];
const SECTORS = ["Technology", "Healthcare", "Finance", "Energy"];
const SUB_SECTORS = ["Software", "Biotech", "Banking", "Oil & Gas"];

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
    sector: [],
    sub_sector: []
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [isSubSectorDropdownOpen, setIsSubSectorDropdownOpen] = useState(false);

  const handleCheckboxChange = (filterName: keyof Filters) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterName]: !prev[filterName]
      };
      
      // If unchecking sector, also uncheck subSector
      if (filterName === 'sector' && prev.sector === true) {
        newFilters.subSector = false;
      }
      
      return newFilters;
    });
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

  const handleSectorToggle = (sector: string) => {
    setFilterValues(prev => {
      const newSectors = prev.sector.includes(sector)
        ? prev.sector.filter(s => s !== sector)
        : [...prev.sector, sector];
      
      const newFilterValues = { ...prev, sector: newSectors };
      onFiltersChange?.(newFilterValues);
      return newFilterValues;
    });
  };

  const handleSubSectorToggle = (subSector: string) => {
    setFilterValues(prev => {
      const newSubSectors = prev.sub_sector.includes(subSector)
        ? prev.sub_sector.filter(s => s !== subSector)
        : [...prev.sub_sector, subSector];  
      const newFilterValues = { ...prev, sub_sector: newSubSectors };
      onFiltersChange?.(newFilterValues);
      return newFilterValues;
    });
  }

  const handlePriceChange = (field: 'min_price' | 'max_price', value: string) => {
    setFilterValues(prev => {
      const numValue = value === '' ? 0 : Number(value);
      let newFilterValues = { ...prev, [field]: numValue };
      
      // Validate: min should not be greater than max
      if (field === 'min_price' && newFilterValues.max_price > 0 && numValue > newFilterValues.max_price) {
        newFilterValues.min_price = newFilterValues.max_price;
      }
      
      // Validate: max should not be less than min
      if (field === 'max_price' && numValue > 0 && numValue < newFilterValues.min_price) {
        newFilterValues.max_price = newFilterValues.min_price;
      }
      
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
                    ? 'Select countries' 
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

          {filters.sector && (
              <div className="filter-expansion">
                <button
                  type="button"
                  className="filter-country-dropdown-btn"
                  onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)}
                >
                  <span>
                    {filterValues.sector.length === 0 
                      ? 'Select sectors' 
                      : `${filterValues.sector.length} selected`}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                {isSectorDropdownOpen && (
                  <div className="filter-country-list">
                    {SECTORS.map(sector => (
                      <label key={sector} className="filter-country-option">
                        <input
                          type="checkbox"
                          checked={filterValues.sector.includes(sector)}
                          onChange={() => handleSectorToggle(sector)}
                          className="filter-country-checkbox"
                        />
                        <span>{sector}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            
          )}
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.subSector}
              onChange={() => handleCheckboxChange('subSector')}
              className="filter-checkbox"
              disabled={!filters.sector}
            />
            <span className="filter-label">Sub-Sector</span>
          </label>

          {filters.subSector && (
            <div className="filter-expansion">
              <button
                  type="button"
                  className="filter-country-dropdown-btn"
                  onClick={() => setIsSubSectorDropdownOpen(!isSubSectorDropdownOpen)}
                >
                  <span>
                    {filterValues.sub_sector.length === 0 
                      ? 'Select sub-sectors' 
                      : `${filterValues.sub_sector.length} selected`}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {isSubSectorDropdownOpen && (
                  <div className="filter-country-list">
                    {SUB_SECTORS.map(subSector => (
                      <label key={subSector} className="filter-country-option">
                        <input
                          type="checkbox"
                          checked={filterValues.sub_sector.includes(subSector)}
                          onChange={() => handleSubSectorToggle(subSector)}
                          className="filter-country-checkbox"
                        />
                        <span>{subSector}</span>
                      </label>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterButton;    