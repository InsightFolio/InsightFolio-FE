import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavButton from '../form/NavButton';
import './TopNav.css';

type Page = 'dashboard' | 'portfolio' | 'watchlist';

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<Page>('dashboard');

  return (
    <header className="top-nav">
      <div className="top-nav__inner">
        <div className="top-nav__group">
          <div className="top-nav__brand">
            Insight<span>Folio</span>
          </div>

          <nav className="top-nav__links" aria-label="Primary">
            <NavButton 
              active={activePage === 'dashboard'}
              onClick={() => setActivePage('dashboard')}
            >
              Dashboard
            </NavButton>
            <NavButton 
              active={activePage === 'portfolio'}
              onClick={() => setActivePage('portfolio')}
            >
              Portfolio
            </NavButton>
            <NavButton 
              active={activePage === 'watchlist'}
              onClick={() => setActivePage('watchlist')}
            >
              Watchlist
            </NavButton>
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
