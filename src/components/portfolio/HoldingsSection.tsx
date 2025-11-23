import React from 'react';

export type Holding = {
  symbol: string;
  company: string;
  shares: number;
  value: number;
  growthPercent: number;
};

type HoldingsSectionProps = {
  holdings: Holding[];
  onSelect: (holding: Holding) => void;
};

const HoldingsSection: React.FC<HoldingsSectionProps> = ({ holdings, onSelect }) => (
  <section className="portfolio__list-section">
    <header className="portfolio__list-header">
      <h2 style={{ margin: 0 }}>Holdings</h2>
      <span className="portfolio__label portfolio__label--muted">Amount held & growth by stock</span>
    </header>

    <div className="stock-list portfolio__list">
      <div className="stock-list__row stock-list__row--header portfolio__row">
        <span role="columnheader">Symbol</span>
        <span role="columnheader">Company</span>
        <span role="columnheader">Shares</span>
        <span role="columnheader">Amount Held</span>
        <span role="columnheader">% Growth</span>
      </div>
      {holdings.map((holding) => (
        <button
          key={holding.symbol}
          type="button"
          className="stock-list__row portfolio__row"
          role="row"
          onClick={() => onSelect(holding)}
        >
          <span role="cell" className="stock-list__cell stock-list__cell--symbol">
            {holding.symbol}
          </span>
          <span role="cell" className="stock-list__cell stock-list__cell--company">
            {holding.company}
          </span>
          <span role="cell" className="stock-list__cell stock-list__cell--shares">
            {holding.shares}
          </span>
          <span role="cell" className="stock-list__cell stock-list__cell--value">
            ${holding.value.toLocaleString()}
          </span>
          <span
            role="cell"
            className={`stock-list__cell portfolio__cell-growth ${
              holding.growthPercent >= 0 ? 'portfolio__cell-growth--up' : 'portfolio__cell-growth--down'
            }`}
          >
            {holding.growthPercent >= 0 ? '+' : ''}
            {holding.growthPercent.toFixed(1)}%
          </span>
        </button>
      ))}
    </div>
  </section>
);

export default HoldingsSection;
