import React, { useMemo, useState } from 'react';
import TopNav from '../../components/layout/TopNav';
import BalanceSection, { PerformancePoint } from '../../components/portfolio/BalanceSection';
import HoldingsSection, { Holding } from '../../components/portfolio/HoldingsSection';
import HoldingDetailModal from '../../components/portfolio/HoldingDetailModal';
import './Portfolio.css';

const HOLDINGS_STORAGE_KEY = 'portfolio_holdings';
const CASH_STORAGE_KEY = 'portfolio_cash';
const STARTING_CASH = 10000;

const computeHoldingValue = (holding: Holding): number => {
  const price = holding.price ?? (holding.shares ? holding.value / holding.shares : 0);
  return Number((price * holding.shares).toFixed(2));
};

const initialHoldings: Holding[] = [
  { symbol: 'AAPL', company: 'Apple Inc.', shares: 50, price: 179.4, value: 8970, growthPercent: 12.4 },
  { symbol: 'MSFT', company: 'Microsoft Corp.', shares: 35, price: 412.86, value: 14450.1, growthPercent: 9.1 },
  { symbol: 'NVDA', company: 'NVIDIA Corp.', shares: 20, price: 842.0, value: 16840, growthPercent: 18.6 },
  { symbol: 'AMZN', company: 'Amazon.com Inc.', shares: 22, price: 356.82, value: 7850.04, growthPercent: 6.3 }
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

const Portfolio: React.FC = () => {
  const [cash, setCash] = useState<number>(() => {
    const savedCash = localStorage.getItem(CASH_STORAGE_KEY);
    const parsed = savedCash ? Number(savedCash) : NaN;
    return Number.isFinite(parsed) ? parsed : STARTING_CASH;
  });
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    try {
      const saved = localStorage.getItem(HOLDINGS_STORAGE_KEY);
      if (saved) {
          const parsed = JSON.parse(saved) as Holding[];
          return parsed.map((h) => {
            const price = h.price ?? (h.shares ? h.value / h.shares : 0);
            const normalizedValue = computeHoldingValue({ ...h, price });
            return { ...h, price, value: normalizedValue };
          });
      }
    } catch (e) {
      console.warn('Failed to parse saved holdings', e);
    }
    return initialHoldings;
  });
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  React.useEffect(() => {
    localStorage.setItem(HOLDINGS_STORAGE_KEY, JSON.stringify(holdings));
  }, [holdings]);

  React.useEffect(() => {
    localStorage.setItem(CASH_STORAGE_KEY, String(cash));
  }, [cash]);

  const holdingsValue = useMemo(
    () => holdings.reduce((sum, holding) => sum + computeHoldingValue(holding), 0),
    [holdings]
  );

  const totalBalance = holdingsValue + cash;
  const portfolioValue = useMemo(
    () => totalBalance,
    [totalBalance]
  );
  const totalShares = useMemo(() => holdings.reduce((sum, h) => sum + h.shares, 0), [holdings]);
  const portfolioGrowth = ((totalBalance - STARTING_CASH) / STARTING_CASH) * 100;

  const modalChartData = useMemo<PerformancePoint[]>(() => {
    if (!selectedHolding) return [];
    return holdingPerformance[selectedHolding.symbol] || [];
  }, [selectedHolding]);

  const handleSelectHolding = (holding: Holding) => {
    setSelectedHolding(holding);
    setModalOpen(true);
  };

  const handleRemoveHolding = (holding: Holding) => {
    setHoldings((prev) => {
      const toRemove = prev.find((h) => h.symbol === holding.symbol);
      if (toRemove) {
        setCash((c) => c + computeHoldingValue(toRemove));
      }
      return prev.filter((h) => h.symbol !== holding.symbol);
    });
    setModalOpen(false);
    setSelectedHolding(null);
  };

  const handleConfirmAdd = (holding: Holding) => {
    setHoldings((prev) => {
      const exists = prev.some((h) => h.symbol === holding.symbol);
      if (exists) {
        const prevHolding = prev.find((h) => h.symbol === holding.symbol);
        const prevValue = prevHolding ? computeHoldingValue(prevHolding) : 0;
        const nextValue = computeHoldingValue(holding);
        const delta = nextValue - prevValue;
        if (delta !== 0) {
          setCash((c) => c - delta);
        }
        const normalized = { ...holding, value: nextValue };
        return prev.map((h) => (h.symbol === holding.symbol ? normalized : h));
      }
      const nextValue = computeHoldingValue(holding);
      setCash((c) => c - nextValue);
      const normalized = { ...holding, value: nextValue };
      return [...prev, normalized];
    });
    setModalOpen(false);
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
        onRemove={handleRemoveHolding}
        onAdd={handleConfirmAdd}
        isInHoldings={!!selectedHolding && holdings.some((h) => h.symbol === selectedHolding.symbol)}
      />
    </div>
  );
};

export default Portfolio;
