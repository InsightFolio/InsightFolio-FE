import { ButtonHTMLAttributes } from 'react';
import './NavButton.css';

type NavButtonProps = {
  active?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const NavButton = ({ active = false, children, ...buttonProps }: NavButtonProps) => (
  <button 
    type="button" 
    className={`nav-button ${active ? 'nav-button--active' : ''}`} 
    {...buttonProps}
  >
    {children}
  </button>
);

export default NavButton;
