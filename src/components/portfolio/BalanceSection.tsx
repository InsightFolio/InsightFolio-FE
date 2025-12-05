import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

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

  const filterLabels: Record<TimeFilter, string> = {
    '3D': 'Past 3 days',
    '1W': 'Past week',
    '1M': 'Past month',
    'YTD': 'Year to date'
  };

  const getXAxisTicks = () => {
    if (performance.length === 0) return [];
    
    const indices = {
      '3D': [0, -1],
      '1W': [0, Math.floor(performance.length / 2), -1],
      '1M': [0, Math.floor(performance.length / 3), Math.floor(performance.length * 2 / 3), -1],
      'YTD': [0, Math.floor(performance.length / 4), Math.floor(performance.length / 2), Math.floor(performance.length * 3 / 4), -1]
    };
    
    return indices[activeFilter].map(i => performance[i < 0 ? performance.length + i : i].label);
  };

  const getYAxisDomain = (): [number, number] => {
    if (performance.length === 0) return [0, 10000];
    
    const values = performance.map(p => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    
    return [Math.max(0, min - padding), max + padding];
  };

  const getYAxisTicks = () => {
    if (performance.length === 0) return undefined;
    
    const [min, max] = getYAxisDomain();
    const range = max - min;
    const step = range / 4; // Create 5 ticks
    
    const ticks: number[] = [];
    for (let i = 0; i <= 4; i++) {
      ticks.push(min + (step * i));
    }
    
    // Check for duplicate formatted values
    const decimals = activeFilter === '3D' || activeFilter === '1W' ? 2 : 1;
    const formatted = new Set<string>();
    const uniqueTicks: number[] = [];
    
    for (const tick of ticks) {
      const kValue = tick / 1000;
      const label = `$${kValue.toFixed(decimals)}k`;
      
      if (!formatted.has(label)) {
        formatted.add(label);
        uniqueTicks.push(tick);
      }
    }
    
    return uniqueTicks.length >= 3 ? uniqueTicks : undefined;
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
              <button
                className={`portfolio__time-filter ${activeFilter === '3D' ? 'portfolio__time-filter--active' : ''}`}
                onClick={() => handleFilterClick('3D')}
              >
                3D
              </button>
              <button
                className={`portfolio__time-filter ${activeFilter === '1W' ? 'portfolio__time-filter--active' : ''}`}
                onClick={() => handleFilterClick('1W')}
              >
                1W
              </button>
              <button
                className={`portfolio__time-filter ${activeFilter === '1M' ? 'portfolio__time-filter--active' : ''}`}
                onClick={() => handleFilterClick('1M')}
              >
                1M
              </button>
              <button
                className={`portfolio__time-filter ${activeFilter === 'YTD' ? 'portfolio__time-filter--active' : ''}`}
                onClick={() => handleFilterClick('YTD')}
              >
                YTD
              </button>
            </div>
            <span className="portfolio__label portfolio__label--muted">{filterLabels[activeFilter]}</span>
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
                ticks={getXAxisTicks()}
              />
              <YAxis
                tick={{ fill: 'rgba(33, 34, 39, 0.65)', fontWeight: 600 }}
                axisLine={{ stroke: 'rgba(33, 34, 39, 0.2)' }}
                tickLine={false}
                tickFormatter={(value: number) => {
                  const decimals = activeFilter === '3D' || activeFilter === '1W' ? 2 : 1;
                  if (value >= 1000) {
                    const kValue = value / 1000;
                    return `$${kValue.toFixed(decimals)}k`;
                  }
                  return `$${value.toFixed(0)}`;
                }}
                domain={getYAxisDomain()}
                ticks={getYAxisTicks()}
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
