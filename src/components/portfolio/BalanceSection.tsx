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

export type PerformancePoint = {
  label: string;
  value: number;
};

type BalanceSectionProps = {
  totalValue: number;
  growthPercent: number;
  holdingsCount: number;
  totalShares: number;
  accountBalance: number;
  performance: PerformancePoint[];
};

const BalanceSection: React.FC<BalanceSectionProps> = ({
  totalValue,
  growthPercent,
  holdingsCount,
  totalShares,
  accountBalance,
  performance
}) => (
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
          <span className="portfolio__label portfolio__label--muted">Past 12 months</span>
        </div>
        <div className="portfolio__chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performance} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="portfolioArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#206f27" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#206f27" stopOpacity={0.06} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(33, 34, 39, 0.12)" />
              <XAxis
                dataKey="label"
                tick={{ fill: 'rgba(33, 34, 39, 0.65)', fontWeight: 600 }}
                axisLine={{ stroke: 'rgba(33, 34, 39, 0.2)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(33, 34, 39, 0.65)', fontWeight: 600 }}
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
                fill="url(#portfolioArea)"
                strokeWidth={3}
                dot={{ fill: '#206f27', stroke: '#ffffff', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </section>
);

export default BalanceSection;
