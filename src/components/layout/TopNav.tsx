import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TopNav.css';

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="top-nav">
      <div className="top-nav__inner">
        <div className="top-nav__group">
          <div className="top-nav__brand">
            Insight<span>Folio</span>
          </div>

          <nav className="top-nav__links" aria-label="Primary">
            <a href="#" className="top-nav__link top-nav__link--active">
              Dashboard
            </a>
            <a href="#" className="top-nav__link">
              Portfolio
            </a>
            <a href="#" className="top-nav__link">
              Watchlist
            </a>
          </nav>
        </div>

        <button
          className="top-nav__logout"
          type="button"
          onClick={() => navigate('/login')}
        >
          <LogOut className="top-nav__logout-icon" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
