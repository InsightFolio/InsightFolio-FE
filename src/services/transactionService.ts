import apiClient from './apiClient';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001';

export interface TransactionRequest {
  email: string;
  symbol: string;
  txn_type: 'buy' | 'sell';
  qty: number;
  price?: number;
}

export interface ProcessTransactionRequest {
  user_id: number;
  stock_id: number;
  txn_type: 'buy' | 'sell';
  qty: number;
}

export interface Transaction {
  transaction_id: number;
  user_id: number;
  stock_id: number;
  transaction_type: string;
  quantity_transac: number;
  price_transac: number;
  transaction_date: string;
}

export interface Holding {
  holding_id: number;
  user_id: number;
  stock_id: number;
  quantity: number;
  symbol?: string;
  company?: string;
  price?: number;
}

/**
 * Process a buy or sell transaction
 * Uses the backend's process_transaction endpoint which handles:
 * - Validation (funds, holdings, stock existence)
 * - Account balance updates
 * - Holdings updates
 * - Transaction recording
 */
export const processTransaction = async (
  userId: number,
  stockId: number,
  txnType: 'buy' | 'sell',
  quantity: number
): Promise<Transaction> => {
  try {
    const response = await apiClient.post('/transactions/execute', {
      stock_id: stockId,
      transaction_type: txnType,
      quantity: quantity
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Transaction failed. Please try again.');
  }
};

/**
 * Add a transaction record (alternative method)
 */
export const addTransaction = async (
  email: string,
  symbol: string,
  txnType: 'buy' | 'sell',
  quantity: number,
  price: number
): Promise<Transaction> => {
  try {
    const response = await apiClient.post('/transactions/add', {
      email,
      symbol,
      txn_type: txnType,
      qty: quantity,
      price
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to add transaction.');
  }
};

/**
 * Get user's holdings from backend
 */
export const getUserHoldings = async (userId: number): Promise<Holding[]> => {
  try {
    const response = await apiClient.get(`/holdings/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch holdings:', error);
    return [];
  }
};

/**
 * Get user's account balance
 */
export const getUserAccount = async (userId: number): Promise<{ balance: number }> => {
  try {
    const response = await apiClient.get(`/account/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch account:', error);
    // If account doesn't exist (404), return default balance of 0
    if (error.response?.status === 404) {
      console.warn(`Account not found for user ${userId}, returning default balance of 0`);
      return { balance: 0 };
    }
    throw error;
  }
};

/**
 * Get stock details by symbol
 */
export const getStockBySymbol = async (symbol: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/stocks/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock:', error);
    throw error;
  }
};
