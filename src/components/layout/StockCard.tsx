import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StockCard.css';

export type StockCardProps = {
  symbol: string;
  company: string;
  price: number;
  sector: string;
  sub_sector: string;
  change: number;
  changePercent: number;
  onSelect?: () => void;
};

const StockCard: React.FC<StockCardProps> = ({
  symbol,
  company,
  price,
  sector,
  sub_sector,
  change,
  changePercent,
  onSelect
}) => {
  const isPositive = change >= 0;
  const changeSign = isPositive ? '+' : '';
  const trendIcon = isPositive ? (
    <TrendingUp className="stock-card__trend-icon" aria-hidden="true" />
  ) : (
    <TrendingDown className="stock-card__trend-icon" aria-hidden="true" />
  );

  return (
    <article
      className={`stock-card ${isPositive ? 'stock-card--up' : 'stock-card--down'}`}
      onClick={onSelect}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onSelect) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <header className="stock-card__header">
        <div>
          <h3 className="stock-card__symbol">{symbol}</h3>
          <p className="stock-card__company">{company}</p>
        </div>
        <span className="stock-card__trend" aria-hidden="true">
          {trendIcon}
        </span>
      </header>
      <div className="stock-card__metrics">
        <div className="stock-card__price">${price.toFixed(2)}</div>
        <div className="stock-card__change">
          <span>{`${changeSign}${change.toFixed(2)}`}</span>
          <span>{`${changeSign}${changePercent.toFixed(2)}%`}</span>
        </div>
      </div>
    </article>
  );
};

export default StockCard;
