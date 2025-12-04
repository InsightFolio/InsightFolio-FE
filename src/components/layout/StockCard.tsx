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
  const trendIcon = isPositive ? (
    <TrendingUp className="stock-card__trend-icon" aria-hidden="true" />
  ) : (
    <TrendingDown className="stock-card__trend-icon" aria-hidden="true" />
  );

  const formatSigned = (value: number) => {
    const sign = value > 0 ? '+' : value < 0 ? '-' : '';
    return `${sign}${Math.abs(value).toFixed(2)}`;
  };

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
          <span
            className={`stock-card__change-value ${
              change >= 0 ? 'stock-card__change-value--up' : 'stock-card__change-value--down'
            }`}
          >
            {formatSigned(change)}
          </span>
          <span
            className={`stock-card__change-value ${
              changePercent >= 0 ? 'stock-card__change-value--up' : 'stock-card__change-value--down'
            }`}
          >
            {`${formatSigned(changePercent)}%`}
          </span>
        </div>
      </div>
    </article>
  );
};

export default StockCard;
