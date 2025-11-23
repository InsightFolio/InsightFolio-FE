import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';
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
import type { PerformancePoint } from './BalanceSection';
import './HoldingDetailModal.css';

type HoldingDetailModalProps = {
  holding: Holding | null;
  data: PerformancePoint[];
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (holding: Holding) => void;
  onRemove?: (holding: Holding) => void;
  isInHoldings?: boolean;
};

const HoldingDetailModal: React.FC<HoldingDetailModalProps> = ({
  holding,
  data,
  isOpen,
  onClose,
  onAdd,
  onRemove,
  isInHoldings = false
}) => {
  const [sharesInput, setSharesInput] = useState<number>(holding?.shares ?? 1);

  const pricePerShare = useMemo(() => {
    if (!holding) return 0;
    const price = holding.shares > 0 ? holding.value / holding.shares : holding.value;
    return Number((price ?? 0).toFixed(2));
  }, [holding]);

  useEffect(() => {
    if (holding) {
      setSharesInput(holding.shares || 1);
    }
  }, [holding]);

  const amountHeld = !isInHoldings ? Number((sharesInput * pricePerShare || 0).toFixed(2)) : holding?.value ?? 0;

  if (!isOpen || !holding) {
    return null;
  }

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

        {(onAdd || onRemove) && (
          <div className="portfolio-modal__actions">
            {isInHoldings && onRemove && (
              <button type="button" className="portfolio-modal__danger" onClick={() => onRemove(holding)}>
                Remove / Close position
              </button>
            )}
            {!isInHoldings && onAdd && (
              <button
                type="button"
                className="portfolio-modal__primary"
                onClick={() =>
                  onAdd({
                    ...holding,
                    shares: sharesInput,
                    value: amountHeld
                  })
                }
                disabled={!sharesInput}
              >
                Add holding
              </button>
            )}
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
                  value={sharesInput}
                  onChange={(e) => setSharesInput(Number(e.target.value))}
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
                  ${pricePerShare.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          </div>

          <div className="portfolio__modal-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="holdingArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#206f27" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#206f27" stopOpacity={0.06} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(33, 34, 39, 0.12)" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'rgba(33, 34, 39, 0.65)', fontWeight: 600, fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(33, 34, 39, 0.2)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(33, 34, 39, 0.65)', fontWeight: 600, fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(33, 34, 39, 0.2)' }}
                  tickLine={false}
                  tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: number) => `$${val.toLocaleString()}`}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{ borderRadius: 12, border: '1px solid rgba(33, 34, 39, 0.12)' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#206f27"
                  fill="url(#holdingArea)"
                  strokeWidth={3}
                  dot={{ fill: '#206f27', stroke: '#ffffff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingDetailModal;
