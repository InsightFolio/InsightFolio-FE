import React from 'react';
import { StockCardProps } from './StockCard';

type StockListViewProps = {
  stocks: StockCardProps[];
  onSelectStock?: (stock: StockCardProps) => void;
};

const StockListView: React.FC<StockListViewProps> = ({ stocks, onSelectStock }) => (
  <div className="stock-list" role="table">
    <div className="stock-list__row stock-list__row--header" role="row">
      <span role="columnheader">Symbol</span>
      <span role="columnheader">Company</span>
      <span role="columnheader">Price</span>
      <span role="columnheader">Sector</span>
      <span role="columnheader">Sub-Sector</span>
    </div>
    {stocks.map((stock) => {
      return (
        <button
          key={stock.symbol}
          type="button"
          className="stock-list__row"
          role="row"
          onClick={() => onSelectStock?.(stock)}
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
          <span role="cell" className="stock-list__cell stock-list__cell--sector">
            {stock.sector}
          </span>
          <span role="cell" className="stock-list__cell stock-list__cell--sub-sector">
            {stock.sub_sector}
          </span>
        </button>
      );
    })}
  </div>
);

export default StockListView;
