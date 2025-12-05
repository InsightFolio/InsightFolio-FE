import { ButtonHTMLAttributes, useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import Fuse from "fuse.js";
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
  activeFilters: {
    price: boolean;
    country: boolean;
    sector: boolean;
    subSector: boolean;
  };
};

const COUNTRIES = ["Argentina", "Australia", "Belgium", "Bermuda", "Brazil", "Canada", "Cayman Islands", "Chile", "China", "Colombia", "Finland", "France", "Guernsey", "Hong Kong", "Ireland", "Luxembourg", "Mexico", "Netherlands", "Panama", "Peru", "Portugal", "Singapore", "Spain", "Sweden", "Switzerland", "Taiwan", "United Kingdom", "United States", "Uruguay"];

const SECTORS = ["Basic Materials", "Communication Services", "Consumer Cyclical", "Consumer Defensive", "Energy", "Financial Services", "Healthcare", "Industrials", "Real Estate", "Technology", "Utilities"];

const SUB_SECTORS = [
  "Advertising Agencies", "Aerospace & Defense", "Agricultural Inputs", "Airlines", "Airports & Air Services", "Aluminum", "Apparel Manufacturing", "Apparel Retail", "Asset Management", "Auto & Truck Dealerships", "Auto Manufacturers", "Auto Parts", "Banks - Diversified", "Banks - Regional", "Beverages - Brewers", "Beverages - Non-Alcoholic", "Beverages - Wineries & Distilleries", "Biotechnology", "Broadcasting", "Building Materials", "Building Products & Equipment", "Business Equipment & Supplies", "Capital Markets", "Chemicals", "Coking Coal", "Communication Equipment", "Computer Hardware", "Confectioners", "Conglomerates",
  "Consulting Services", "Consumer Electronics", "Copper", "Credit Services", "Department Stores", "Diagnostics & Research", "Discount Stores", "Drug Manufacturers - General", "Drug Manufacturers - Specialty & Generic", "Education & Training Services", "Electrical Equipment & Parts", "Electronic Components", "Electronic Gaming & Multimedia", "Electronics & Computer Distribution", "Engineering & Construction", "Entertainment", "Farm & Heavy Construction Machinery", "Farm Products", "Financial Conglomerates", "Financial Data & Stock Exchanges", "Food Distribution", "Footwear & Accessories", "Furnishings, Fixtures & Appliances", "Gambling", "Gold", "Grocery Stores", "Health Information Services", "Healthcare Plans", "Home Improvement Retail", "Household & Personal Products",
  "Industrial Distribution", "Information Technology Services", "Infrastructure Operations", "Insurance - Diversified", "Insurance - Life", "Insurance - Property & Casualty", "Insurance - Reinsurance", "Insurance - Specialty", "Insurance Brokers", "Integrated Freight & Logistics", "Internet Content & Information", "Internet Retail", "Leisure", "Lodging", "Lumber & Wood Production", "Luxury Goods", "Marine Shipping", "Medical Care Facilities", "Medical Devices", "Medical Distribution", "Medical Instruments & Supplies", "Metal Fabrication", "Mortgage Finance", "Oil & Gas Drilling", "Oil & Gas E&P", "Oil & Gas Equipment & Services", "Oil & Gas Integrated", "Oil & Gas Midstream", "Oil & Gas Refining & Marketing", "Other Industrial Metals & Mining",
  "Other Precious Metals & Mining", "Packaged Foods", "Packaging & Containers", "Paper & Paper Products", "Personal Services", "Pharmaceutical Retailers", "Pollution & Treatment Controls", "Publishing", "Railroads", "Real Estate - Development", "Real Estate - Diversified", "Real Estate Services", "Recreational Vehicles", "REIT - Diversified", "REIT - Healthcare Facilities", "REIT - Hotel & Motel", "REIT - Industrial", "REIT - Mortgage", "REIT - Office", "REIT - Residential", "REIT - Retail", "REIT - Specialty", "Rental & Leasing Services", "Residential Construction", "Resorts & Casinos", "Restaurants", "Scientific & Technical Instruments", "Security & Protection Services", "Semiconductor Equipment & Materials", "Semiconductors",
  "Shell Companies", "Silver", "Software - Application", "Software - Infrastructure", "Solar", "Specialty Business Services", "Specialty Chemicals", "Specialty Industrial Machinery", "Specialty Retail", "Staffing & Employment Services", "Steel", "Telecom Services", "Textile Manufacturing", "Thermal Coal", "Tobacco", "Tools & Accessories", "Travel Services", "Trucking", "Uranium", "Utilities - Diversified", "Utilities - Independent Power Producers", "Utilities - Regulated Electric", "Utilities - Regulated Gas", "Utilities - Regulated Water", "Utilities - Renewable", "Waste Management"
];

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
    max_price: 1000,
    sector: [],
    sub_sector: [],
    activeFilters: {
      price: false,
      country: false,
      sector: false,
      subSector: false
    }
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [subSectorSearch, setSubSectorSearch] = useState('');

  // fuzzy searching for sub-sectors
  const fuse = useMemo(() => new Fuse(SUB_SECTORS, {
    threshold: 0.4, // Lower = stricter matching, higher = more fuzzy (0.0 - 1.0)
    distance: 100,
    minMatchCharLength: 2, // Minimum characters before searching
    includeScore: true,
  }), []);

  // Filter sub-sectors based on search input using fuzzy matching - show top 10 matches
  const filteredSubSectors: string[] = useMemo(() => {
    if (subSectorSearch.trim().length < 2) return [];
    
    const results = fuse.search(subSectorSearch);
    return results.slice(0, 10).map(result => result.item);
  }, [subSectorSearch, fuse]);

  const handleCheckboxChange = (filterName: keyof Filters) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterName]: !prev[filterName]
      };
      
      if (filterName === 'sector' && prev.sector === true) {
        newFilters.subSector = false;
      }
      
      setFilterValues(prevValues => {
        const newFilterValues = {
          ...prevValues,
          activeFilters: {
            ...prevValues.activeFilters,
            [filterName]: newFilters[filterName],
            ...(filterName === 'sector' && !newFilters.sector ? { subSector: false } : {})
          }
        };
        onFiltersChange?.(newFilterValues);
        return newFilterValues;
      });
      
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

  const handlePriceRangeChange = (values: [number, number]) => {
    setFilterValues(prev => {
      const newFilterValues = { 
        ...prev, 
        min_price: values[0],
        max_price: values[1]
      };
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
              <div className="filter-price-range">
                <div className="filter-price-labels">
                  <span className="filter-price-value">${filterValues.min_price}</span>
                  <span className="filter-price-value">${filterValues.max_price}</span>
                </div>
                <div className="filter-price-slider-container">
                  <div className="filter-price-track">
                    <div 
                      className="filter-price-track-fill"
                      style={{
                        left: `${(filterValues.min_price / 1000) * 100}%`,
                        width: `${((filterValues.max_price - filterValues.min_price) / 1000) * 100}%`
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filterValues.min_price}
                    onChange={(e) => {
                      const newMin = Number(e.target.value);
                      if (newMin <= filterValues.max_price) {
                        handlePriceRangeChange([newMin, filterValues.max_price]);
                      }
                    }}
                    className="filter-price-slider filter-price-slider--min"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filterValues.max_price}
                    onChange={(e) => {
                      const newMax = Number(e.target.value);
                      if (newMax >= filterValues.min_price) {
                        handlePriceRangeChange([filterValues.min_price, newMax]);
                      }
                    }}
                    className="filter-price-slider filter-price-slider--max"
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
              <div className="filter-subsector-autocomplete">
                <input
                  type="text"
                  className="filter-subsector-input"
                  placeholder="Type to search sub-sectors..."
                  value={subSectorSearch}
                  onChange={(e) => setSubSectorSearch(e.target.value)}
                />
                
                {filteredSubSectors.length > 0 && (
                  <div className="filter-subsector-suggestions">
                    {filteredSubSectors.map(subSector => (
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

                {filterValues.sub_sector.length > 0 && (
                  <div className="filter-subsector-selected">
                    <span className="filter-subsector-selected-label">Selected:</span>
                    <div className="filter-subsector-tags">
                      {filterValues.sub_sector.map(subSector => (
                        <span key={subSector} className="filter-subsector-tag">
                          {subSector}
                          <button
                            type="button"
                            className="filter-subsector-tag-remove"
                            onClick={() => handleSubSectorToggle(subSector)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterButton;    