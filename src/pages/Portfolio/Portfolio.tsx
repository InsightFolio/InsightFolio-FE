import React, { useEffect, useMemo, useState } from 'react';
import TopNav from '../../components/layout/TopNav';
import BalanceSection, { PerformancePoint } from '../../components/portfolio/BalanceSection';
import HoldingsSection, { Holding } from '../../components/portfolio/HoldingsSection';
import HoldingDetailModal from '../../components/portfolio/HoldingDetailModal';
import { getUserHoldings, processTransaction, getUserAccount } from '../../services/transactionService';
import { useAuth } from '../../contexts/AuthContext';
import './Portfolio.css';

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
  const { user } = useAuth();
  
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accountBalance, setAccountBalance] = useState(0);
  const [holdingsValue, setHoldingsValue] = useState(0);

  // Require authentication - redirect to login if no user
  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);
  
  const userId = user?.id || 0;

  // Fetch holdings from backend
  useEffect(() => {
    if (!user || userId === 0) return;
    
    const fetchHoldings = async () => {
      setLoading(true);
      try {
        const holdingsData = await getUserHoldings(userId);
        
        // Transform backend holdings to match frontend Holding type
        const transformedHoldings: Holding[] = holdingsData.map((h: any) => {
          const symbol = h.stock_symbol || '';
          const company = h.stock_company || symbol;
          const quantity = h.quantity || 0;
          const currentPrice = h.stock_price || 0;
          const purchasePrice = h.purchase_price || h.cost_basis || h.average_cost || currentPrice;
          
          // Calculate growth percentage: ((current - purchase) / purchase) * 100
          const growthPercent = purchasePrice > 0 
            ? ((currentPrice - purchasePrice) / purchasePrice) * 100 
            : 0;
          
          return {
            symbol,
            company,
            shares: quantity,
            value: currentPrice * quantity,
            growthPercent,
            stock_id: h.stock_id
          };
        });
        
        setHoldings(transformedHoldings);
      } catch (error) {
        console.error('Failed to load holdings:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAccount = async () => {
      try {
        const account = await getUserAccount(userId);
        setAccountBalance(account.account_balance);
        setHoldingsValue(account.balance);
      } catch (error) {
        console.error('Failed to load account:', error);
      }
    };

    fetchHoldings();
    fetchAccount();
  }, [user, userId]);

  const refreshHoldings = async () => {
    try {
      const holdingsData = await getUserHoldings(userId);
      const transformedHoldings: Holding[] = holdingsData.map((h: any) => {
        const symbol = h.stock_symbol || '';
        const company = h.stock_company || symbol;
        const quantity = h.quantity || 0;
        const currentPrice = h.stock_price || 0;
        const purchasePrice = h.purchase_price || h.cost_basis || h.average_cost || currentPrice;
        
        const growthPercent = purchasePrice > 0 
          ? ((currentPrice - purchasePrice) / purchasePrice) * 100 
          : 0;
        
        return {
          symbol,
          company,
          shares: quantity,
          value: currentPrice * quantity,
          growthPercent,
          stock_id: h.stock_id
        };
      });
      setHoldings(transformedHoldings);

      const account = await getUserAccount(userId);
      setAccountBalance(account.account_balance);
      setHoldingsValue(account.balance);
    } catch (error) {
      console.error('Failed to refresh holdings:', error);
    }
  };

  // portfolioValue is calculated from backend holdingsValue + accountBalance
  const portfolioValue = useMemo(
    () => holdingsValue + accountBalance,
    [holdingsValue, accountBalance]
  );
  const totalShares = useMemo(() => holdings.reduce((sum, h) => sum + h.shares, 0), [holdings]);
  
  // Calculate portfolio growth based on holdings
  const portfolioGrowth = useMemo(() => {
    if (holdings.length === 0) return 0;
    const totalGrowth = holdings.reduce((sum, h) => sum + (h.growthPercent * h.value), 0);
    return holdingsValue > 0 ? totalGrowth / holdingsValue : 0;
  }, [holdings, holdingsValue]);

  const modalChartData = useMemo<PerformancePoint[]>(() => {
    if (!selectedHolding) return [];
    return holdingPerformance[selectedHolding.symbol] || [];
  }, [selectedHolding]);

  const handleSelectHolding = (holding: Holding) => {
    setSelectedHolding(holding);
    setModalOpen(true);
  };

  const handleBuyStock = async (stockId: number, quantity: number) => {
    try {
      await processTransaction(userId, stockId, 'buy', quantity);
      await refreshHoldings();
    } catch (error: any) {
      throw error;
    }
  };

  const handleSellStock = async (stockId: number, quantity: number) => {
    try {
      await processTransaction(userId, stockId, 'sell', quantity);
      await refreshHoldings();
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <div className="portfolio">
      <TopNav />
      <main className="portfolio__content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#206f27' }}>
            <p>Loading portfolio...</p>
          </div>
        ) : (
          <>
            <BalanceSection
              totalValue={holdingsValue}
              growthPercent={portfolioGrowth}
              holdingsCount={holdings.length}
              totalShares={totalShares}
              accountBalance={accountBalance}
              performance={portfolioPerformance}
            />

            <HoldingsSection holdings={holdings} onSelect={handleSelectHolding} />
          </>
        )}
      </main>

      <HoldingDetailModal
        holding={selectedHolding}
        data={modalChartData}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onBuy={handleBuyStock}
        onSell={handleSellStock}
        isInHoldings={true}
        currentPrice={selectedHolding ? selectedHolding.value / (selectedHolding.shares || 1) : 0}
        stockId={selectedHolding?.stock_id}
      />
    </div>
  );
};

export default Portfolio;
