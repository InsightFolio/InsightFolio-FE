import React from 'react';
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
};

const HoldingDetailModal: React.FC<HoldingDetailModalProps> = ({ holding, data, isOpen, onClose }) => {
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

        <div className="portfolio__modal">
          <div className="portfolio__modal-info">
            <div>
              <p className="portfolio__label">Amount held</p>
              <p className="portfolio__modal-value">${holding.value.toLocaleString()}</p>
            </div>
            <div>
              <p className="portfolio__label">Shares</p>
              <p className="portfolio__modal-value">{holding.shares}</p>
            </div>
            <div>
              <p className="portfolio__label">Growth</p>
              <p
                className={`portfolio__modal-badge ${
                  holding.growthPercent >= 0 ? 'portfolio__modal-badge--up' : 'portfolio__modal-badge--down'
                }`}
              >
                {holding.growthPercent >= 0 ? '+' : ''}
                {holding.growthPercent.toFixed(1)}%
              </p>
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
