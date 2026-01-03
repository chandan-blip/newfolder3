import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useWalletStore from '../../store/walletStore';
import useAuthStore from '../../store/authStore';

export default function WalletWidget({ compact = false }) {
  const { balance, currency, fetchBalance } = useWalletStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance();
    }
  }, [isAuthenticated, fetchBalance]);

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (!isAuthenticated) return null;

  if (compact) {
    return (
      <Link
        to="/wallet"
        className="flex items-center gap-2 bg-surface px-4 py-2 rounded-lg hover:bg-surface-light transition-colors"
      >
        <svg
          className="w-5 h-5 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <span className="font-semibold text-green-400">
          {formatBalance(balance)}
        </span>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl p-6 border border-gray-800"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Your Balance</h3>
        <Link
          to="/wallet"
          className="text-sm text-primary hover:text-primary-dark transition-colors"
        >
          View Wallet
        </Link>
      </div>

      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-bold text-green-400">
          {formatBalance(balance)}
        </span>
        <span className="text-sm text-gray-400">{currency}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/wallet?action=deposit"
          className="flex items-center justify-center gap-2 px-4 py-3 gradient-success text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Deposit
        </Link>
        <Link
          to="/wallet?action=withdraw"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-light text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          Withdraw
        </Link>
      </div>
    </motion.div>
  );
}
