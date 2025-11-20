import React, { useMemo, useState } from 'react';
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

const popularStocks: Stock[] = [
  { symbol: 'AAPL', company: 'Apple Inc.', price: 178.45, change: 2.35, changePercent: 1.33 },
  { symbol: 'GOOGL', company: 'Alphabet Inc.', price: 142.67, change: -1.24, changePercent: -0.86 },
  { symbol: 'MSFT', company: 'Microsoft Corp.', price: 412.89, change: 5.67, changePercent: 1.39 },
  { symbol: 'AMZN', company: 'Amazon.com Inc.', price: 178.25, change: 3.45, changePercent: 1.97 },
  { symbol: 'TSLA', company: 'Tesla Inc.', price: 248.5, change: -4.2, changePercent: -1.66 },
  { symbol: 'META', company: 'Meta Platforms Inc.', price: 498.75, change: 8.9, changePercent: 1.82 }
];

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
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [isHoldingModalOpen, setHoldingModalOpen] = useState(false);

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
    value: Number((stock.price * 10).toFixed(2)),
    growthPercent: stock.changePercent
  });

  const modalChartData = useMemo<PerformancePoint[]>(() => {
    if (!selectedHolding) return [];
    return stockPerformance[selectedHolding.symbol] || fallbackPerformance(selectedHolding.value);
  }, [selectedHolding, stockPerformance]);

  const handleSearch = async (searchText: string, filters: FilterValues) => {
    // Open the modal immediately
    setSearchModalOpen(true);

    try {
      // Format the country array to a comma-separated string
      const countryString = filters.country.join(',');

      const searchPayload = {
        text: searchText,
        filters: {
          country: countryString,
          min_price: filters.min_price,
          max_price: filters.max_price,
          sector: filters.sector,
          sub_sector: filters.sub_sector
        }
      };

      console.log('Sending search request:', searchPayload);

      const response = await axios.post('http://127.0.0.1:5001/search', searchPayload);

      console.log('Search results:', response.data);

      // Transform the response data to match StockCardProps format
      const transformedResults: Stock[] = response.data.map((stock: any) => ({
        symbol: stock.symbol,
        company: stock.company,
        price: stock.price,
        change: 0, // Not provided by backend, default to 0
        changePercent: 0 // Not provided by backend, default to 0
      }));

      setSearchResults(transformedResults);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]); // Clear results on error
    }
  };

  const handleSelectStock = (stock: Stock) => {
    const holding = holdingFromStock(stock);
    setSelectedHolding(holding);
    setHoldingModalOpen(true);
  };

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

        <StockSection title="Popular Stocks" stocks={popularStocks} onSelectStock={handleSelectStock} />

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
      />
    </div>
  );
};

export default Dashboard;
