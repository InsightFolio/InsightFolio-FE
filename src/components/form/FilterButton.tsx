import { ButtonHTMLAttributes } from "react";

type FilterButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const FilterButton = ({ type = 'button', children, ...buttonProps }: FilterButtonProps) => (
  <button type={type} className="filter-button" {...buttonProps}>
    {children}
  </button>
);

export default FilterButton;    