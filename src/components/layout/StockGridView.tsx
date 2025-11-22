import React from 'react';
import StockCard, { StockCardProps } from './StockCard';

type StockGridViewProps = {
  stocks: StockCardProps[];
  onSelectStock?: (stock: StockCardProps) => void;
};

const StockGridView: React.FC<StockGridViewProps> = ({ stocks, onSelectStock }) => (
  <div className="dashboard__grid">
    {stocks.map((stock) => (
      <StockCard key={stock.symbol} {...stock} onSelect={onSelectStock ? () => onSelectStock(stock) : undefined} />
    ))}
  </div>
);

export default StockGridView;

