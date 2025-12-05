import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

const RESULTS_PER_PAGE = 10;

const ModalContainer: React.FC<ModalContainerProps> = ({
  title,
  isOpen,
  children,
  onClose,
  stocks = [],
  onSelectStock
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Reset page when stocks change
  React.useEffect(() => {
    setCurrentPage(0);
  }, [stocks]);

  // Paginated results
  const paginatedStocks = useMemo(() => {
    const start = currentPage * RESULTS_PER_PAGE;
    return stocks.slice(start, start + RESULTS_PER_PAGE);
  }, [stocks, currentPage]);

  const totalPages = Math.ceil(stocks.length / RESULTS_PER_PAGE);
  const startIndex = currentPage * RESULTS_PER_PAGE + 1;
  const endIndex = Math.min((currentPage + 1) * RESULTS_PER_PAGE, stocks.length);

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
          <>
            <StockListView stocks={paginatedStocks} onSelectStock={onSelectStock} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="modal__pagination">
                <span className="modal__pagination-info">
                  Showing {startIndex}-{endIndex} of {stocks.length}
                </span>
                <div className="modal__pagination-controls">
                  <button
                    className="modal__pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                  <button
                    className="modal__pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
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
