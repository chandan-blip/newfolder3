import { create } from 'zustand';
import { gamesAPI } from '../services/api';

const useGameStore = create((set, get) => ({
  games: [],
  featuredGames: [],
  currentGame: null,
  recentBets: [],
  bigWins: [],
  betHistory: [],
  gameState: null,
  isLoading: false,
  error: null,

  fetchGames: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await gamesAPI.getGames(params);
      const { games } = response.data.data;
      set({ games, isLoading: false });
      return games;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch games' });
      return [];
    }
  },

  fetchFeaturedGames: async () => {
    try {
      const response = await gamesAPI.getFeatured();
      const { games } = response.data.data;
      set({ featuredGames: games });
    } catch (error) {
      console.error('Failed to fetch featured games:', error);
    }
  },

  fetchGame: async (slug) => {
    set({ isLoading: true, currentGame: null });
    try {
      const response = await gamesAPI.getGameBySlug(slug);
      const { game } = response.data.data;
      set({ currentGame: game, isLoading: false });
      return game;
    } catch (error) {
      set({ isLoading: false, error: 'Game not found' });
      return null;
    }
  },

  fetchRecentBets: async (limit = 20) => {
    try {
      const response = await gamesAPI.getRecentBets(limit);
      const { bets } = response.data.data;
      set({ recentBets: bets });
    } catch (error) {
      console.error('Failed to fetch recent bets:', error);
    }
  },

  fetchBigWins: async (limit = 10) => {
    try {
      const response = await gamesAPI.getBigWins(limit);
      const { bets } = response.data.data;
      set({ bigWins: bets });
    } catch (error) {
      console.error('Failed to fetch big wins:', error);
    }
  },

  fetchBetHistory: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await gamesAPI.getBetHistory(params);
      const { bets } = response.data.data;
      set({ betHistory: bets, isLoading: false });
      return bets;
    } catch (error) {
      set({ isLoading: false });
      return [];
    }
  },

  setGameState: (state) => {
    set({ gameState: state });
  },

  addRecentBet: (bet) => {
    set((state) => ({
      recentBets: [bet, ...state.recentBets].slice(0, 50),
    }));
  },

  clearError: () => set({ error: null }),
}));

export default useGameStore;
