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
        className="relative flex items-center gap-2 px-4 py-2 rounded-xl overflow-hidden group"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-linear-to-r from-amber-500/20 to-yellow-500/20 group-hover:from-amber-500/30 group-hover:to-yellow-500/30 transition-colors" />
        <div className="absolute inset-0 border border-amber-500/30 rounded-xl" />

        {/* Chip icon */}
        <div className="relative w-6 h-6 rounded-full bg-linear-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg border border-yellow-300/50">
          <span className="text-amber-800 font-bold text-xs">$</span>
        </div>

        <span className="relative font-bold text-amber-400">
          {formatBalance(balance)}
        </span>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Casino gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-amber-500 via-yellow-500 to-amber-600" />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white">
          <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M50 20 L80 50 L50 80 L20 50 Z" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>

      {/* Sparkle effects */}
      <div className="absolute top-4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
      <div className="absolute top-8 right-1/3 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse delay-100" />
      <div className="absolute bottom-12 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-200" />

      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg border-2 border-yellow-200/50">
              <span className="text-amber-800 font-bold text-lg">$</span>
            </div>
            <div>
              <p className="text-amber-100/80 text-xs font-medium uppercase tracking-wider">Your Balance</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-amber-100/60 text-xs">Live</span>
              </div>
            </div>
          </div>
          <Link
            to="/wallet"
            className="flex items-center gap-1 text-sm text-amber-100 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
          >
            <span>View</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Balance display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white drop-shadow-lg tracking-wide">
              {formatBalance(balance)}
            </span>
          </div>
          <p className="text-amber-100/60 text-sm mt-1">{currency} Account</p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/wallet?action=deposit"
            className="group flex items-center justify-center gap-2 px-4 py-3 bg-white text-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Deposit
          </Link>
          <Link
            to="/wallet?action=withdraw"
            className="group flex items-center justify-center gap-2 px-4 py-3 bg-black/20 text-white rounded-xl font-semibold hover:bg-black/30 transition-all border border-white/20 hover:border-white/40"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Withdraw
          </Link>
        </div>
      </div>

      {/* Border glow */}
      <div className="absolute inset-0 rounded-2xl border border-yellow-300/20 pointer-events-none" />
    </motion.div>
  );
}
