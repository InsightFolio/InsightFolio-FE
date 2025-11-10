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
    </div>
    {stocks.map((stock) => {
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
        </button>
      );
    })}
  </div>
);

export default StockListView;
