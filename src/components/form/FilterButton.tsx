import { ButtonHTMLAttributes, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import "./FilterButton.css";

type FilterButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

type Filters = {
  price: boolean;
  country: boolean;
  sector: boolean;
  subSector: boolean;
};

const FilterButton = ({ type = 'button', ...buttonProps }: FilterButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    price: false,
    country: false,
    sector: false,
    subSector: false,
  });

  const handleCheckboxChange = (filterName: keyof Filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
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
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.country}
              onChange={() => handleCheckboxChange('country')}
              className="filter-checkbox"
            />
            <span className="filter-label">Country</span>
          </label>
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