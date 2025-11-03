import React from 'react';
import './TopNav.css';

const TopNav: React.FC = () => {
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

        <button className="top-nav__logout" type="button">
          <svg
            className="top-nav__logout-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M15 17l5-5-5-5" />
            <path d="M20 12H9" />
            <path d="M12 19H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h7" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
