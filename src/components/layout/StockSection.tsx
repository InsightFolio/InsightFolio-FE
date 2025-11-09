import React, { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import type { StockCardProps } from './StockCard';
import StockGridView from './StockGridView';
import StockListView from './StockListView';

type StockSectionProps = {
  title: string;
  stocks: StockCardProps[];
};

type ViewMode = 'grid' | 'list';

const viewOptions: Array<{
  Icon: typeof LayoutGrid;
  label: string;
  value: ViewMode;
}> = [
  { Icon: LayoutGrid, label: 'Grid view', value: 'grid' },
  { Icon: List, label: 'List view', value: 'list' }
];

const StockSection: React.FC<StockSectionProps> = ({ title, stocks }) => {
  const [view, setView] = useState<ViewMode>('grid');

  return (
    <section className="dashboard__section">
      <header className="dashboard__section-header">
        <div className="dashboard__section-title-group">
          <h2 className="dashboard__section-title">{title}</h2>
          <div className="dashboard__view-switch" aria-label={`${title} view options`}>
            {viewOptions.map(({ Icon, label, value }) => (
              <button
                key={value}
                type="button"
                aria-label={label}
                onClick={() => setView(value)}
                className={`dashboard__view-button ${
                  view === value ? 'dashboard__view-button--active' : ''
                }`}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>
        <span className="dashboard__section-meta">
          {stocks.length} {stocks.length === 1 ? 'stock' : 'stocks'}
        </span>
      </header>

      {view === 'grid' ? <StockGridView stocks={stocks} /> : <StockListView stocks={stocks} />}
    </section>
  );
};

export default StockSection;
