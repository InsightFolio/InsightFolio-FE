import React from 'react';
import { StockCardProps } from './StockCard';

type StockListViewProps = {
  stocks: StockCardProps[];
};

const StockListView: React.FC<StockListViewProps> = ({ stocks }) => (
  <div className="stock-list" role="table">
    <div className="stock-list__row stock-list__row--header" role="row">
      <span role="columnheader">Symbol</span>
      <span role="columnheader">Company</span>
      <span role="columnheader">Price</span>
      <span role="columnheader" className="stock-list__cell--change-header">
        Change
      </span>
    </div>
    {stocks.map((stock) => {
      const isPositive = stock.change >= 0;
      const sign = isPositive ? '+' : '';

      return (
        <button
          key={stock.symbol}
          type="button"
          className="stock-list__row"
          role="row"
        >
          <span role="cell" className="stock-list__cell stock-list__cell--symbol">
            {stock.symbol}
          </span>
          <span role="cell" className="stock-list__cell stock-list__cell--company">
            {stock.company}
          </span>
          <span role="cell" className="stock-list__cell stock-list__cell--price">
            ${stock.price.toFixed(2)}
          </span>
          <span
            role="cell"
            className={`stock-list__cell stock-list__cell--change ${
              isPositive ? 'stock-list__change--up' : 'stock-list__change--down'
            }`}
          >
            {`${sign}${stock.change.toFixed(2)} (${sign}${stock.changePercent.toFixed(2)}%)`}
          </span>
        </button>
      );
    })}
  </div>
);

export default StockListView;
