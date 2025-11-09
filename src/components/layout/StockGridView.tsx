import React from 'react';
import StockCard, { StockCardProps } from './StockCard';

type StockGridViewProps = {
  stocks: StockCardProps[];
};

const StockGridView: React.FC<StockGridViewProps> = ({ stocks }) => (
  <div className="dashboard__grid">
    {stocks.map((stock) => (
      <StockCard key={stock.symbol} {...stock} />
    ))}
  </div>
);

export default StockGridView;

