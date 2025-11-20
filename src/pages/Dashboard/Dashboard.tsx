import React, { useEffect, useMemo, useState } from 'react';
import TopNav from '../../components/layout/TopNav';
import StockSection from '../../components/layout/StockSection';
import type { StockCardProps } from '../../components/layout/StockCard';
import SearchBar from '../../components/dashboard/SearchBar';
import ModalContainer from '../../components/ui/ModalContainer';
import type { FilterValues } from '../../components/form/FilterButton';
import HoldingDetailModal from '../../components/portfolio/HoldingDetailModal';
import type { Holding } from '../../components/portfolio/HoldingsSection';
import type { PerformancePoint } from '../../components/portfolio/BalanceSection';
import axios from 'axios';
import './Dashboard.css';

type Stock = StockCardProps;
const HOLDINGS_STORAGE_KEY = 'portfolio_holdings';

const topScoreStocks: Stock[] = [
  { symbol: 'NVDA', company: 'NVIDIA Corp.', price: 842.22, change: 6.42, changePercent: 0.77 },
  { symbol: 'AMD', company: 'Advanced Micro Devices', price: 158.12, change: -1.12, changePercent: -0.71 },
  { symbol: 'NFLX', company: 'Netflix Inc.', price: 612.45, change: 5.31, changePercent: 0.87 },
  { symbol: 'PYPL', company: 'PayPal Holdings', price: 72.58, change: -0.65, changePercent: -0.89 },
  { symbol: 'ADBE', company: 'Adobe Inc.', price: 528.44, change: 3.24, changePercent: 0.62 },
  { symbol: 'CRM', company: 'Salesforce Inc.', price: 286.13, change: 1.12, changePercent: 0.39 },
  { symbol: 'AVGO', company: 'Broadcom Inc.', price: 1362.32, change: 12.45, changePercent: 0.92 },
  { symbol: 'COST', company: 'Costco Wholesale', price: 723.75, change: 4.11, changePercent: 0.57 },
  { symbol: 'MA', company: 'Mastercard Inc.', price: 485.2, change: -2.34, changePercent: -0.48 },
  { symbol: 'UNH', company: 'UnitedHealth Group', price: 533.17, change: 3.76, changePercent: 0.71 }
];

const Dashboard: React.FC = () => {
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [popularStocks, setPopularStocks] = useState<Stock[]>([]);
  const [popularLoading, setPopularLoading] = useState(false);
  const [popularError, setPopularError] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    try {
      const saved = localStorage.getItem(HOLDINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved) as Holding[];
    } catch (e) {
      console.warn('Failed to parse saved holdings', e);
    }
    return [];
  });
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [isHoldingModalOpen, setHoldingModalOpen] = useState(false);
  const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001';

  const stockPerformance: Record<string, PerformancePoint[]> = useMemo(
    () => ({
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
    }),
    []
  );

  const fallbackPerformance = (value: number): PerformancePoint[] => {
    const base = value * 0.9;
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, idx) => ({
      label,
      value: Math.round(base + (value - base) * (idx / 5))
    }));
  };

  const holdingFromStock = (stock: Stock): Holding => ({
    symbol: stock.symbol,
    company: stock.company,
    shares: 10,
    value: Number(stock.price.toFixed(2)),
    growthPercent: stock.changePercent
  });

  const modalChartData = useMemo<PerformancePoint[]>(() => {
    if (!selectedHolding) return [];
    return stockPerformance[selectedHolding.symbol] || fallbackPerformance(selectedHolding.value);
  }, [selectedHolding, stockPerformance]);

  useEffect(() => {
    localStorage.setItem(HOLDINGS_STORAGE_KEY, JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    const fetchPopular = async () => {
      setPopularLoading(true);
      setPopularError(null);
      try {
        const response = await axios.get(`${API_BASE}/popular`, {
          params: { limit: 6 }
        });
        const mapped = (response.data ?? []).map((stock: any) => ({
          symbol: stock.symbol,
          company: stock.company,
          price: stock.price,
          change: stock.change ?? 0,
          changePercent: stock.changePercent ?? 0
        }));
        setPopularStocks(mapped.slice(0, 6));
      } catch (error) {
        console.error('Failed to load popular stocks', error);
        setPopularError('Could not load popular stocks.');
        setPopularStocks([]);
      } finally {
        setPopularLoading(false);
      }
    };

    fetchPopular();
  }, [API_BASE]);

  const handleSearch = async (searchText: string, filters: FilterValues) => {
    // Open the modal immediately
    setSearchModalOpen(true);

    try {
      const countryString = filters.country.join(',');

      const response = await axios.get(`${API_BASE}/api/stocks/search`, {
        params: {
          text: searchText,
          country: countryString,
          min_price: filters.min_price,
          max_price: filters.max_price,
          sector: filters.sector,
          sub_sector: filters.sub_sector
        }
      });

      console.log('Search results:', response.data);

      // Transform the response data to match StockCardProps format
      const transformedResults: Stock[] = (response.data ?? []).map((stock: any) => ({
        symbol: stock.symbol,
        company: stock.company,
        price: stock.price,
        change: stock.change ?? 0,
        changePercent: stock.changePercent ?? 0
      }));

      setSearchResults(transformedResults);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]); // Clear results on error
    }
  };

  const handleSelectStock = (stock: Stock) => {
    setSearchModalOpen(false);
    const holding = holdingFromStock(stock);
    setSelectedHolding(holding);
    setHoldingModalOpen(true);
  };

  const handleAddHolding = (holding: Holding) => {
    setHoldings((prev) => {
      const exists = prev.some((h) => h.symbol === holding.symbol);
      if (exists) {
        return prev.map((h) => (h.symbol === holding.symbol ? holding : h));
      }
      return [...prev, holding];
    });
    setHoldingModalOpen(false);
  };

  const handleRemoveHolding = (holding: Holding) => {
    setHoldings((prev) => prev.filter((h) => h.symbol !== holding.symbol));
    setHoldingModalOpen(false);
    setSelectedHolding(null);
  };

  const isInHoldings = selectedHolding ? holdings.some((h) => h.symbol === selectedHolding.symbol) : false;

  return (
    <div className="dashboard">
      <TopNav />
      <main className="dashboard__content">
        <section className="dashboard__hero">
          <h1 className="dashboard__title">Search Stocks</h1>
          <p className="dashboard__subtitle">
            Find real-time stock prices, trends, and market data.
          </p>
          <SearchBar onSubmit={handleSearch} />
        </section>

        <section className="dashboard__section--with-meta">
          <StockSection title="Popular Stocks" stocks={popularStocks} onSelectStock={handleSelectStock} />
          {popularLoading && <p className="dashboard__meta">Loading popular stocks...</p>}
          {popularError && <p className="dashboard__meta dashboard__meta--error">{popularError}</p>}
        </section>

        <StockSection title="Top 10 Stocks by Score" stocks={topScoreStocks} onSelectStock={handleSelectStock} />

        <ModalContainer
          title="Search Results"
          isOpen={isSearchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          stocks={searchResults}
          onSelectStock={handleSelectStock}
        >
        </ModalContainer>
      </main>

      <HoldingDetailModal
        holding={selectedHolding}
        data={modalChartData}
        isOpen={isHoldingModalOpen}
        onClose={() => setHoldingModalOpen(false)}
        onAdd={handleAddHolding}
        onRemove={handleRemoveHolding}
        isInHoldings={isInHoldings}
      />
    </div>
  );
};

export default Dashboard;
