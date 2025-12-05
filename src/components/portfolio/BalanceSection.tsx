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
import { 
  FILTER_LABELS, 
  TIME_FILTERS, 
  getYAxisDomain, 
  getYAxisTicks, 
  formatYAxisTick 
} from '../../utils/chartHelpers';

export type PerformancePoint = {
  label: string;
  value: number;
};

export type TimeFilter = '3D' | '1W' | '1M' | 'YTD';

type BalanceSectionProps = {
  totalValue: number;
  growthPercent: number;
  holdingsCount: number;
  totalShares: number;
  accountBalance: number;
  performance: PerformancePoint[];
  onTimeFilterChange?: (filter: TimeFilter) => void;
};

const BalanceSection: React.FC<BalanceSectionProps> = ({
  totalValue,
  growthPercent,
  holdingsCount,
  totalShares,
  accountBalance,
  performance,
  onTimeFilterChange
}) => {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('YTD');

  const handleFilterClick = (filter: TimeFilter) => {
    setActiveFilter(filter);
    onTimeFilterChange?.(filter);
  };

  const yAxisDomain = useMemo(() => getYAxisDomain(performance), [performance]);
  const yAxisTicks = useMemo(() => getYAxisTicks(performance, yAxisDomain, activeFilter), [performance, yAxisDomain, activeFilter]);

  const getXAxisTicks = () => {
    if (performance.length === 0) return [];
    if (performance.length === 1) return [performance[0].label];
    
    const len = performance.length;
    let indices: number[] = [];
    
    // Adjust tick selection based on data length
    if (len === 2) {
      indices = [0, 1];
    } else if (len <= 4) {
      indices = [0, len - 1];
    } else if (len <= 7) {
      // For small datasets, show first, middle, and last
      indices = [0, Math.floor(len / 2), len - 1];
    } else {
      // For larger datasets, use filter-based logic
      const indexMap = {
        '3D': [0, len - 1],
        '1W': [0, Math.floor(len / 2), len - 1],
        '1M': [0, Math.floor(len / 3), Math.floor(len * 2 / 3), len - 1],
        'YTD': [0, Math.floor(len / 4), Math.floor(len / 2), Math.floor(len * 3 / 4), len - 1]
      };
      indices = indexMap[activeFilter];
    }
    
    // Remove duplicates and sort
    const uniqueIndices = Array.from(new Set(indices)).sort((a, b) => a - b);
    return uniqueIndices.map(i => performance[i].label);
  };

  const graphColor = growthPercent >= 0 ? '#206f27' : '#d64545';

  return (
  <section className="portfolio__summary">
    <div className="portfolio__summary-grid">
      <div className="portfolio__summary-info">
        <p className="portfolio__label">Holdings Value</p>
        <div className="portfolio__balance-row">
          <span className="portfolio__balance">${totalValue.toLocaleString()}</span>
          <span
            className={`portfolio__growth ${growthPercent >= 0 ? 'portfolio__growth--up' : 'portfolio__growth--down'}`}
          >
            {growthPercent >= 0 ? '+' : ''}
            {growthPercent.toFixed(1)}%
          </span>
        </div>
        <p className="portfolio__label portfolio__label--muted">
          {holdingsCount} stocks held • Total shares {totalShares}
        </p>
        <p className="portfolio__label portfolio__label--muted">
          Account balance ${accountBalance.toLocaleString()}
        </p>
      </div>

      <div className="portfolio__summary-chart">
        <div className="portfolio__chart-header">
          <h3>Balance over time</h3>
          <div className="portfolio__chart-controls">
            <div className="portfolio__time-filters">
              {TIME_FILTERS.map(filter => (
                <button
                  key={filter}
                  className={`portfolio__time-filter ${activeFilter === filter ? 'portfolio__time-filter--active' : ''}`}
                  onClick={() => handleFilterClick(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <span className="portfolio__label portfolio__label--muted">{FILTER_LABELS[activeFilter]}</span>
          </div>
        </div>
        <div className="portfolio__chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performance} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="portfolioArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={graphColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={graphColor} stopOpacity={0.06} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(33, 34, 39, 0.12)" />
              <XAxis
                dataKey="label"
                tick={{ fill: 'rgba(33, 34, 39, 0.65)', fontWeight: 600 }}
                axisLine={{ stroke: 'rgba(33, 34, 39, 0.2)' }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis
                tick={{ fill: 'rgba(33, 34, 39, 0.65)', fontWeight: 600 }}
                axisLine={{ stroke: 'rgba(33, 34, 39, 0.2)' }}
                tickLine={false}
                tickFormatter={(value: number) => formatYAxisTick(value, activeFilter)}
                domain={yAxisDomain}
                ticks={yAxisTicks}
                scale="linear"
              />
              <Tooltip
                formatter={(val: number) => `$${val.toLocaleString()}`}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{ borderRadius: 12, border: '1px solid rgba(33, 34, 39, 0.12)' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={graphColor}
                fill="url(#portfolioArea)"
                strokeWidth={3}
                activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </section>
  );
};

export default BalanceSection;
