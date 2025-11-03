import React from 'react';
import TopNav from '../../components/layout/TopNav';
import StockCard, { StockCardProps } from '../../components/layout/StockCard';
import './Dashboard.css';

type Stock = StockCardProps;

const popularStocks: Stock[] = [
  { symbol: 'AAPL', company: 'Apple Inc.', price: 178.45, change: 2.35, changePercent: 1.33 },
  { symbol: 'GOOGL', company: 'Alphabet Inc.', price: 142.67, change: -1.24, changePercent: -0.86 },
  { symbol: 'MSFT', company: 'Microsoft Corp.', price: 412.89, change: 5.67, changePercent: 1.39 },
  { symbol: 'AMZN', company: 'Amazon.com Inc.', price: 178.25, change: 3.45, changePercent: 1.97 },
  { symbol: 'TSLA', company: 'Tesla Inc.', price: 248.5, change: -4.2, changePercent: -1.66 },
  { symbol: 'META', company: 'Meta Platforms Inc.', price: 498.75, change: 8.9, changePercent: 1.82 }
];

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <TopNav />
      <main className="dashboard__content">
        <section className="dashboard__hero">
          <h1 className="dashboard__title">Search Stocks</h1>
          <p className="dashboard__subtitle">
            Find real-time stock prices, trends, and market data.
          </p>
          <div className="dashboard__search">
            <span className="dashboard__search-icon" aria-hidden="true">
              <svg
                className="dashboard__search-icon-svg"
                viewBox="0 0 24 24"
                role="img"
                focusable="false"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="6.5" />
                <line x1="16" y1="16" x2="21" y2="21" />
              </svg>
            </span>
            <input
              className="dashboard__search-input"
              type="search"
              placeholder="Search by symbol or company name..."
              aria-label="Search stocks"
            />
          </div>
        </section>

        <section className="dashboard__section">
          <header className="dashboard__section-header">
            <h2 className="dashboard__section-title">Popular Stocks</h2>
            <span className="dashboard__section-meta">{popularStocks.length} stocks</span>
          </header>

          <div className="dashboard__grid">
            {popularStocks.map((stock) => (
              <StockCard key={stock.symbol} {...stock} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
