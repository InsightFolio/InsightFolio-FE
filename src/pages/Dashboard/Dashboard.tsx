import React from 'react';
import TopNav from '../../components/layout/TopNav';
import './Dashboard.css';

type Stock = {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
};

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
            {popularStocks.map((stock) => {
              const isPositive = stock.change >= 0;
              const changeSign = isPositive ? '+' : '';
              const trendIcon = isPositive ? (
                <svg className="stock-card__trend-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <polyline points="3 15 9 9 13 13 21 5" />
                  <polyline points="17 5 21 5 21 9" />
                </svg>
              ) : (
                <svg className="stock-card__trend-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <polyline points="3 9 9 15 13 11 21 19" />
                  <polyline points="17 19 21 19 21 15" />
                </svg>
              );

              return (
                <article
                  key={stock.symbol}
                  className={`stock-card ${isPositive ? 'stock-card--up' : 'stock-card--down'}`}
                >
                  <header className="stock-card__header">
                    <div>
                      <h3 className="stock-card__symbol">{stock.symbol}</h3>
                      <p className="stock-card__company">{stock.company}</p>
                    </div>
                    <span className="stock-card__trend" aria-hidden="true">
                      {trendIcon}
                    </span>
                  </header>
                  <div className="stock-card__metrics">
                    <div className="stock-card__price">${stock.price.toFixed(2)}</div>
                    <div className="stock-card__change">
                      <span>{`${changeSign}${stock.change.toFixed(2)}`}</span>
                      <span>{`${changeSign}${stock.changePercent.toFixed(2)}%`}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
