import React from 'react';
import './StockCard.css';

export type StockCardProps = {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
};

const StockCard: React.FC<StockCardProps> = ({
  symbol,
  company,
  price,
  change,
  changePercent
}) => {
  const isPositive = change >= 0;
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
    <article className={`stock-card ${isPositive ? 'stock-card--up' : 'stock-card--down'}`}>
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

