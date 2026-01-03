import { create } from 'zustand';
import { walletAPI } from '../services/api';

const useWalletStore = create((set, get) => ({
  balance: 0,
  currency: 'USD',
  transactions: [],
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    try {
      const response = await walletAPI.getBalance();
      const { balance, currency } = response.data.data;
      set({ balance, currency });
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  },

  deposit: async (amount) => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletAPI.deposit(amount);
      const { balance } = response.data.data;
      set({ balance, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Deposit failed';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  withdraw: async (amount) => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletAPI.withdraw(amount);
      const { balance } = response.data.data;
      set({ balance, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Withdrawal failed';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  fetchTransactions: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await walletAPI.getTransactions(params);
      const { transactions } = response.data.data;
      set({ transactions, isLoading: false });
      return transactions;
    } catch (error) {
      set({ isLoading: false });
      return [];
    }
  },

  updateBalance: (newBalance) => {
    set({ balance: newBalance });
  },

  setCurrency: (newCurrency) => {
    set({ currency: newCurrency });
  },

  clearError: () => set({ error: null }),
}));

export default useWalletStore;
