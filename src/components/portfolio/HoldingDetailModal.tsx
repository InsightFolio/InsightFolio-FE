import React, { useState, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Holding } from './HoldingsSection';
import type { PerformancePoint, TimeFilter } from './BalanceSection';
import { 
  FILTER_LABELS, 
  TIME_FILTERS, 
  getYAxisDomain, 
  getYAxisTicks, 
  formatYAxisTick,
  getGraphColor,
  filterDataByTimeRange
} from '../../utils/chartHelpers';
import './HoldingDetailModal.css';

type HoldingDetailModalProps = {
  holding: Holding | null;
  data: PerformancePoint[];
  isOpen: boolean;
  onClose: () => void;
  onBuy?: (stockId: number, quantity: number) => Promise<void>;
  onSell?: (stockId: number, quantity: number) => Promise<void>;
  isInHoldings?: boolean;
  currentPrice?: number;
  stockId?: number;
};

const HoldingDetailModal: React.FC<HoldingDetailModalProps> = ({
  holding,
  data,
  isOpen,
  onClose,
  onBuy,
  onSell,
  isInHoldings = false,
  currentPrice,
  stockId
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('YTD');

  const filteredData = useMemo(() => filterDataByTimeRange(data, activeFilter), [data, activeFilter]);
  const graphColor = useMemo(() => getGraphColor(filteredData), [filteredData]);
  const yAxisDomain = useMemo(() => getYAxisDomain(filteredData), [filteredData]);
  const yAxisTicks = useMemo(() => getYAxisTicks(filteredData, yAxisDomain, activeFilter), [filteredData, yAxisDomain, activeFilter]);

  if (!isOpen || !holding) {
    return null;
  }

  const price = currentPrice || holding.value / (holding.shares || 1);
  const totalCost = price * quantity;
  // Amount held = total value of shares user owns (shares × current price)
  // For holdings: this is holding.value
  // For non-holdings (Dashboard): shares is 0, so show 0
  const amountHeld = isInHoldings ? holding.value : (holding.shares > 0 ? holding.value : 0);

  const handleBuy = async () => {
    if (!onBuy || quantity <= 0 || !stockId) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      await onBuy(stockId, quantity);
      setQuantity(1);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to buy stock');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSell = async () => {
    if (!onSell || quantity <= 0 || !stockId) return;
    
    if (quantity > holding.shares) {
      setError(`Cannot sell more than ${holding.shares} shares`);
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      await onSell(stockId, quantity);
      setQuantity(1);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sell stock');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="portfolio-modal-overlay" role="dialog" aria-modal="true" aria-label="Holding details">
      <div className="portfolio-modal">
        <header className="portfolio-modal__header">
          <div>
            <h3 className="portfolio-modal__title">
              {holding.company} ({holding.symbol})
            </h3>
          </div>
          <button className="portfolio-modal__close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        {error && (
          <div className="portfolio-modal__error">
            {error}
          </div>
        )}

        {(onBuy || onSell) && (
          <div className="portfolio-modal__transaction">
            <div className="portfolio-modal__quantity-group">
              <label className="portfolio-modal__label">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === '0') {
                    setQuantity(1);
                  } else {
                    setQuantity(parseInt(value) || 1);
                  }
                }}
                className="portfolio-modal__quantity-input"
                disabled={isProcessing}
              />
            </div>
            <div className="portfolio-modal__transaction-info">
              <span>Price per share: ${price.toFixed(2)}</span>
              <span className="portfolio-modal__total">Total: ${totalCost.toFixed(2)}</span>
            </div>
            <div className="portfolio-modal__actions">
              {onBuy && (
                <button 
                  type="button" 
                  className="portfolio-modal__primary" 
                  onClick={handleBuy}
                  disabled={isProcessing || quantity <= 0}
                >
                  {isProcessing ? 'Processing...' : 'Buy'}
                </button>
              )}
              {isInHoldings && onSell && (
                <button 
                  type="button" 
                  className="portfolio-modal__danger" 
                  onClick={handleSell}
                  disabled={isProcessing || quantity <= 0}
                >
                  {isProcessing ? 'Processing...' : 'Sell'}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="portfolio__modal">
          <div className="portfolio__modal-info">
            <div>
              <p className="portfolio__label">Amount held</p>
              <p className="portfolio__modal-value">
                ${amountHeld.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="portfolio__label">Shares</p>
              {isInHoldings ? (
                <p className="portfolio__modal-value">{holding.shares}</p>
              ) : (
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="portfolio-modal__input"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              )}
            </div>
            <div>
              <p className="portfolio__label">{isInHoldings ? 'Growth' : 'Price per share'}</p>
              {isInHoldings ? (
                <p
                  className={`portfolio__modal-badge ${
                    holding.growthPercent >= 0 ? 'portfolio__modal-badge--up' : 'portfolio__modal-badge--down'
                  }`}
                >
                  {holding.growthPercent >= 0 ? '+' : ''}
                  {holding.growthPercent.toFixed(1)}%
                </p>
              ) : (
                <p className="portfolio__modal-value">
                  ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          </div>

          <div className="portfolio__modal-chart-section">
            <div className="portfolio__chart-header">
              <h3>Performance over time</h3>
              <div className="portfolio__chart-controls">
                <div className="portfolio__time-filters">
                  {TIME_FILTERS.map(filter => (
                    <button
                      key={filter}
                      className={`portfolio__time-filter ${activeFilter === filter ? 'portfolio__time-filter--active' : ''}`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <span className="portfolio__label portfolio__label--muted">{FILTER_LABELS[activeFilter]}</span>
              </div>
            </div>
            <div className="portfolio__modal-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="holdingArea" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={graphColor} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={graphColor} stopOpacity={0.06} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(33, 34, 39, 0.12)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: 'rgba(33, 34, 39, 0.65)', fontWeight: 600, fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(33, 34, 39, 0.2)' }}
                    tickLine={false}
                    interval="preserveStartEnd"
                    minTickGap={30}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(33, 34, 39, 0.65)', fontWeight: 600, fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(33, 34, 39, 0.2)' }}
                    tickLine={false}
                    tickFormatter={(value: number) => formatYAxisTick(value, activeFilter)}
                    domain={yAxisDomain}
                    ticks={yAxisTicks}
                    scale="linear"
                  />
                  <Tooltip
                    formatter={(val: number) => `$${val.toLocaleString()}`}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ borderRadius: 12, border: '1px solid rgba(33, 34, 39, 0.12)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={graphColor}
                    fill="url(#holdingArea)"
                    strokeWidth={3}
                    activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingDetailModal;
