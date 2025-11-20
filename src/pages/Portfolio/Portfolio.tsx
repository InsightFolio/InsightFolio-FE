import React, { useMemo, useState } from 'react';
import TopNav from '../../components/layout/TopNav';
import BalanceSection, { PerformancePoint } from '../../components/portfolio/BalanceSection';
import HoldingsSection, { Holding } from '../../components/portfolio/HoldingsSection';
import HoldingDetailModal from '../../components/portfolio/HoldingDetailModal';
import './Portfolio.css';

const holdings: Holding[] = [
  { symbol: 'AAPL', company: 'Apple Inc.', shares: 50, value: 8970, growthPercent: 12.4 },
  { symbol: 'MSFT', company: 'Microsoft Corp.', shares: 35, value: 14450, growthPercent: 9.1 },
  { symbol: 'NVDA', company: 'NVIDIA Corp.', shares: 20, value: 16840, growthPercent: 18.6 },
  { symbol: 'AMZN', company: 'Amazon.com Inc.', shares: 22, value: 7850, growthPercent: 6.3 }
];

const portfolioPerformance: PerformancePoint[] = [
  { label: 'Jan', value: 51000 },
  { label: 'Feb', value: 52800 },
  { label: 'Mar', value: 51900 },
  { label: 'Apr', value: 54200 },
  { label: 'May', value: 55650 },
  { label: 'Jun', value: 56300 },
  { label: 'Jul', value: 57550 },
  { label: 'Aug', value: 59020 },
  { label: 'Sep', value: 58400 },
  { label: 'Oct', value: 59780 },
  { label: 'Nov', value: 61210 },
  { label: 'Dec', value: 62810 }
];

const holdingPerformance: Record<string, PerformancePoint[]> = {
  AAPL: [
    { label: 'Jan', value: 7800 },
    { label: 'Feb', value: 8120 },
    { label: 'Mar', value: 7950 },
    { label: 'Apr', value: 8280 },
    { label: 'May', value: 8475 },
    { label: 'Jun', value: 8620 },
    { label: 'Jul', value: 8790 },
    { label: 'Aug', value: 8970 }
  ],
  MSFT: [
    { label: 'Jan', value: 12800 },
    { label: 'Feb', value: 13250 },
    { label: 'Mar', value: 13100 },
    { label: 'Apr', value: 13680 },
    { label: 'May', value: 13820 },
    { label: 'Jun', value: 14040 },
    { label: 'Jul', value: 14300 },
    { label: 'Aug', value: 14450 }
  ],
  NVDA: [
    { label: 'Jan', value: 14200 },
    { label: 'Feb', value: 14950 },
    { label: 'Mar', value: 15120 },
    { label: 'Apr', value: 15480 },
    { label: 'May', value: 15810 },
    { label: 'Jun', value: 16150 },
    { label: 'Jul', value: 16580 },
    { label: 'Aug', value: 16840 }
  ],
  AMZN: [
    { label: 'Jan', value: 7120 },
    { label: 'Feb', value: 7280 },
    { label: 'Mar', value: 7220 },
    { label: 'Apr', value: 7440 },
    { label: 'May', value: 7560 },
    { label: 'Jun', value: 7690 },
    { label: 'Jul', value: 7780 },
    { label: 'Aug', value: 7850 }
  ]
};

const portfolioValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
const portfolioGrowth = 8.7;
const totalShares = holdings.reduce((sum, h) => sum + h.shares, 0);

const Portfolio: React.FC = () => {
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const modalChartData = useMemo<PerformancePoint[]>(() => {
    if (!selectedHolding) return [];
    return holdingPerformance[selectedHolding.symbol] || [];
  }, [selectedHolding]);

  const handleSelectHolding = (holding: Holding) => {
    setSelectedHolding(holding);
    setModalOpen(true);
  };

  return (
    <div className="portfolio">
      <TopNav />
      <main className="portfolio__content">
        <BalanceSection
          totalValue={portfolioValue}
          growthPercent={portfolioGrowth}
          holdingsCount={holdings.length}
          totalShares={totalShares}
          performance={portfolioPerformance}
        />

        <HoldingsSection holdings={holdings} onSelect={handleSelectHolding} />
      </main>

      <HoldingDetailModal
        holding={selectedHolding}
        data={modalChartData}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Portfolio;
