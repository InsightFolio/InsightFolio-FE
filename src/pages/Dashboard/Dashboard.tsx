import React from 'react';
import { Search } from 'lucide-react';
import TopNav from '../../components/layout/TopNav';
import StockSection from '../../components/layout/StockSection';
import type { StockCardProps } from '../../components/layout/StockCard';
import FilterButton from '../../components/form/FilterButton';
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

const topScoreStocks: Stock[] = [
  { symbol: 'NVDA', company: 'NVIDIA Corp.', price: 842.22, change: 6.42, changePercent: 0.77 },
  { symbol: 'AMD', company: 'Advanced Micro Devices', price: 158.12, change: -1.12, changePercent: -0.71 },
  { symbol: 'NFLX', company: 'Netflix Inc.', price: 612.45, change: 5.31, changePercent: 0.87 },
  { symbol: 'PYPL', company: 'PayPal Holdings', price: 72.58, change: -0.65, changePercent: -0.89 },
  { symbol: 'ADBE', company: 'Adobe Inc.', price: 528.44, change: 3.24, changePercent: 0.62 },
  { symbol: 'CRM', company: 'Salesforce Inc.', price: 286.13, change: 1.12, changePercent: 0.39 },
  { symbol: 'AVGO', company: 'Broadcom Inc.', price: 1362.32, change: 12.45, changePercent: 0.92 },
  { symbol: 'COST', company: 'Costco Wholesale', price: 723.75, change: 4.11, changePercent: 0.57 },
  { symbol: 'MA', company: 'Mastercard Inc.', price: 485.2, change: -2.34, changePercent: -0.48 },
  { symbol: 'UNH', company: 'UnitedHealth Group', price: 533.17, change: 3.76, changePercent: 0.71 }
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
              <Search className="dashboard__search-icon-svg" />
            </span>
            <input
              className="dashboard__search-input"
              type="search"
              placeholder="Search by symbol or company name..."
              aria-label="Search stocks"
            />
          </div>
          <FilterButton />
        </section>

        <StockSection title="Popular Stocks" stocks={popularStocks} />

        <StockSection title="Top 10 Stocks by Score" stocks={topScoreStocks} />
      </main>
    </div>
  );
};

export default Dashboard;
