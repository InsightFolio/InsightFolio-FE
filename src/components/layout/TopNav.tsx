import React, { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import StyledButton from '../form/StyledButton';
import './TopNav.css';

type Page = 'dashboard' | 'portfolio' | 'watchlist';

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState<Page>('dashboard');

  useEffect(() => {
    if (location.pathname.startsWith('/portfolio')) {
      setActivePage('portfolio');
    } else if (location.pathname.startsWith('/dashboard')) {
      setActivePage('dashboard');
    }
  }, [location.pathname]);

  return (
    <header className="top-nav">
      <div className="top-nav__inner">
        <div className="top-nav__group">
          <div className="top-nav__brand">
            Insight<span>Folio</span>
          </div>

          <nav className="top-nav__links" aria-label="Primary">
            <StyledButton 
              active={activePage === 'dashboard'}
              onClick={() => {
                setActivePage('dashboard');
                navigate('/dashboard');
              }}
            >
              Dashboard
            </StyledButton>
            <StyledButton 
              active={activePage === 'portfolio'}
              onClick={() => {
                setActivePage('portfolio');
                navigate('/portfolio');
              }}
            >
              Portfolio
            </StyledButton>
            <StyledButton 
              active={activePage === 'watchlist'}
              onClick={() => setActivePage('watchlist')}
            >
              Watchlist
            </StyledButton>
          </nav>
        </div>

        <button
          className="top-nav__logout"
          type="button"
          onClick={() => navigate('/')}
        >
          <LogOut className="top-nav__logout-icon" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
