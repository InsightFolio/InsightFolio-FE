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
import { processTransaction, getStockBySymbol } from '../../services/transactionService';
import { useAuth } from '../../contexts/AuthContext';
import { generatePerformanceData } from '../../utils/chartHelpers';
import './Dashboard.css';

type Stock = StockCardProps;

const topScoreStocks: Stock[] = [
  { symbol: 'NVDA', company: 'NVIDIA Corp.', price: 842.22, sector: 'Technology', sub_sector: 'Semiconductors', change: 6.42, changePercent: 0.77 },
  { symbol: 'AMD', company: 'Advanced Micro Devices, Inc. CDR', price: 203.78, sector: 'Technology', sub_sector: 'Semiconductors', change: -2.24, changePercent: -1.09 },
  { symbol: 'NFLX', company: 'Netflix Inc.', price: 612.45, sector: 'Communication Services', sub_sector: 'Entertainment', change: 5.31, changePercent: 0.87 },
  { symbol: 'PYPL', company: 'PayPal Holdings', price: 72.58, sector: 'Financial Services', sub_sector: 'Credit Services', change: -0.65, changePercent: -0.89 },
  { symbol: 'ADBE', company: 'Adobe Inc.', price: 528.44, sector: 'Technology', sub_sector: 'Software - Application', change: 3.24, changePercent: 0.62 },
  { symbol: 'CRM', company: 'Salesforce Inc.', price: 221.11, sector: 'Technology', sub_sector: 'Software - Application', change: 1.74, changePercent: 0.77 },
  { symbol: 'AVGO', company: 'Broadcom Inc.', price: 1362.32, sector: 'Technology', sub_sector: 'Semiconductors', change: 12.45, changePercent: 0.92 },
  { symbol: 'COST', company: 'Costco Wholesale', price: 899.01, sector: 'Consumer Defensive', sub_sector: 'Discount Stores', change: 5.72, changePercent: 0.64 },
  { symbol: 'MA', company: 'Mastercard Inc.', price: 485.2, sector: 'Financial Services', sub_sector: 'Credit Services', change: -2.34, changePercent: -0.48 },
  { symbol: 'UNH', company: 'UnitedHealth Group', price: 533.17, sector: 'Healthcare', sub_sector: 'Healthcare Plans', change: 3.76, changePercent: 0.71 }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [popularStocks, setPopularStocks] = useState<Stock[]>([]);
  const [popularLoading, setPopularLoading] = useState(false);
  const [popularError, setPopularError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
  const [isHoldingModalOpen, setHoldingModalOpen] = useState(false);
  const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001';

  // Require authentication - redirect to login if no user
  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);
  
  const userId = user?.id || 0;

  const holdingFromStock = (stock: Stock): Holding => ({
    symbol: stock.symbol,
    company: stock.company,
    shares: 0,
    value: stock.price,
    growthPercent: stock.changePercent
  });

  const modalChartData = useMemo<PerformancePoint[]>(() => {
    if (!selectedStock) return [];
    return generatePerformanceData(selectedStock.price, selectedStock.changePercent);
  }, [selectedStock]);

  useEffect(() => {
    const fetchPopular = async () => {
      setPopularLoading(true);
      setPopularError(null);
      try {
        const response = await axios.get(`${API_BASE}/popular`, {
          params: { limit: 6 }
        });
        const changeFallbacks = [225.49, 1.74, -2.24, 5.72, 0.12, 1.57];
        const changePercentFallbacks = [3.15, 0.77, -1.09, 0.64, 1.69, 4.52];
        const mapped = (response.data ?? []).map((stock: any, idx: number) => ({
          symbol: stock.symbol,
          company: stock.company,
          price: stock.price,
          sector: stock.sector || 'N/A',
          sub_sector: stock.sub_sector || 'N/A',
          change:
            typeof stock.change === 'number' && stock.change !== 0
              ? stock.change
              : changeFallbacks[idx % changeFallbacks.length],
          changePercent:
            typeof stock.changePercent === 'number' && stock.changePercent !== 0
              ? stock.changePercent
              : changePercentFallbacks[idx % changePercentFallbacks.length]
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

    console.log('Search filters:', filters);

    try {
      const payload = {
        text: searchText,
        filters: {
          country: filters.activeFilters.country ? filters.country.join(',') : '',
          min_price: filters.activeFilters.price ? filters.min_price : 0,
          max_price: filters.activeFilters.price ? filters.max_price : 0,
          sector: filters.activeFilters.sector ? filters.sector.join(',') : '',
          sub_sector: filters.activeFilters.subSector ? filters.sub_sector.join(',') : ''
        }
      };

      console.log('Search payload:', payload);

      const response = await axios.post(`${API_BASE}/search`, payload);

      console.log('Search results:', response.data);

      // Transform the response data to match StockCardProps format
      const transformedResults: Stock[] = (response.data ?? []).map((stock: any) => ({
        symbol: stock.symbol,
        company: stock.company,
        price: stock.price,
        sector: stock.sector,
        sub_sector: stock.sub_sector,
        change: stock.change ?? 0,
        changePercent: stock.changePercent ?? 0
      }));

      // Filter results to only include stocks that match the search text
      const searchLower = searchText.toLowerCase().trim();
      const filteredResults = searchLower.length > 0 
        ? transformedResults.filter(stock => 
            stock.symbol.toLowerCase().includes(searchLower) ||
            stock.company.toLowerCase().includes(searchLower)
          )
        : transformedResults;

      // Sort results: prioritize stocks where symbol or company STARTS with search text
      const sortedResults = filteredResults.sort((a, b) => {
        const aSymbolStarts = a.symbol.toLowerCase().startsWith(searchLower);
        const aCompanyStarts = a.company.toLowerCase().startsWith(searchLower);
        const bSymbolStarts = b.symbol.toLowerCase().startsWith(searchLower);
        const bCompanyStarts = b.company.toLowerCase().startsWith(searchLower);
        
        // Prioritize symbol starts over company starts
        if (aSymbolStarts && !bSymbolStarts) return -1;
        if (bSymbolStarts && !aSymbolStarts) return 1;
        if (aCompanyStarts && !bCompanyStarts) return -1;
        if (bCompanyStarts && !aCompanyStarts) return 1;
        
        // If both or neither start with search, sort alphabetically by symbol
        return a.symbol.localeCompare(b.symbol);
      });

      setSearchResults(sortedResults);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]); // Clear results on error
    }
  };

  const handleSelectStock = async (stock: Stock) => {
    setSearchModalOpen(false);
    setSelectedStock(stock);
    
    try {
      const stockDetails = await getStockBySymbol(stock.symbol);
      setSelectedStockId(stockDetails.stock_id);
    } catch (error) {
      console.error('Failed to fetch stock details:', error);
      setSelectedStockId(null);
    }
    
    setHoldingModalOpen(true);
  };

  const handleBuyStock = async (stockId: number, quantity: number) => {
    try {
      await processTransaction(userId, stockId, 'buy', quantity);
    } catch (error: any) {
      throw error;
    }
  };

  const handleSellStock = async (stockId: number, quantity: number) => {
    try {
      await processTransaction(userId, stockId, 'sell', quantity);
    } catch (error: any) {
      throw error;
    }
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
        holding={selectedStock ? holdingFromStock(selectedStock) : null}
        data={modalChartData}
        isOpen={isHoldingModalOpen}
        onClose={() => setHoldingModalOpen(false)}
        onBuy={handleBuyStock}
        onSell={handleSellStock}
        isInHoldings={false}
        currentPrice={selectedStock?.price}
        stockId={selectedStockId || undefined}
      />
    </div>
  );
};

export default Dashboard;
