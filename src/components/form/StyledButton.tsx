import { ButtonHTMLAttributes } from 'react';
import './StyledButton.css';

type StyledButtonProps = {
  active?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const StyledButton = ({ active = false, children, ...buttonProps }: StyledButtonProps) => (
  <button 
    type="button" 
    className={`styled-button ${active ? 'styled-button--active' : ''}`} 
    {...buttonProps}
  >
    {children}
  </button>
);

export default StyledButton;
