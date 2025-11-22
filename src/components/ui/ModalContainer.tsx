import React from 'react';
import './ModalContainer.css';
import StockListView from '../layout/StockListView';
import type { StockCardProps } from '../layout/StockCard';

type ModalContainerProps = {
  title: string;
  isOpen: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
  stocks?: StockCardProps[];
  onSelectStock?: (stock: StockCardProps) => void;
};

const ModalContainer: React.FC<ModalContainerProps> = ({
  title,
  isOpen,
  children,
  onClose,
  stocks = [],
  onSelectStock
}) => {
  if (!isOpen) {
    return null;
  }

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
        {stocks.length > 0 ? (
          <StockListView stocks={stocks} onSelectStock={onSelectStock} />
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            No results found. Try a different search.
          </p>
        )}
      </div>
      
    </div>
  );
};

export default ModalContainer;
