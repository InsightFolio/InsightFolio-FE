import React from 'react';
import './ModalContainer.css';
import StockListView from '../layout/StockListView';
import type { StockCardProps } from '../layout/StockCard';

type ModalContainerProps = {
  title: string;
  isOpen: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
};

const ModalContainer: React.FC<ModalContainerProps> = ({
  title,
  isOpen,
  children,
  onClose
}) => {
  if (!isOpen) {
    return null;
  }

  const sampleStocks: StockCardProps[] = [
  { symbol: 'AAPL', company: 'Apple Inc.', price: 178.45, change: 2.35, changePercent: 1.33 },
  { symbol: 'GOOGL', company: 'Alphabet Inc.', price: 142.67, change: -1.24, changePercent: -0.86 },
  { symbol: 'MSFT', company: 'Microsoft Corp.', price: 412.89, change: 5.67, changePercent: 1.39 }
];

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal">
        <button
          className="modal__close"
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="modal__title">{title}</h2>
        {children}
        <StockListView stocks={sampleStocks} />
      </div>
      
    </div>
  );
};

export default ModalContainer;
