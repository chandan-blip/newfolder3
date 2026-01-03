import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import { BetHistorySkeleton } from '../components/common/LoadingSkeleton';

export default function BetHistory() {
  const [filter, setFilter] = useState('all');
  const { betHistory, fetchBetHistory, isLoading } = useGameStore();

  useEffect(() => {
    fetchBetHistory({
      limit: 50,
      status: filter !== 'all' ? filter : undefined,
    });
  }, [filter, fetchBetHistory]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const filterOptions = [
    {
      value: 'all',
      label: 'All',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      color: 'amber',
    },
    {
      value: 'won',
      label: 'Won',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green',
    },
    {
      value: 'lost',
      label: 'Lost',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'red',
    },
    {
      value: 'pending',
      label: 'Pending',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'yellow',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 py-8 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-blue-500/10 to-blue-500/5 rounded-2xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-4 left-8 text-blue-500/10 text-4xl">♠</div>
        <div className="absolute top-4 right-8 text-blue-400/10 text-4xl">♥</div>
        <div className="absolute bottom-4 left-12 text-blue-400/10 text-3xl">♦</div>
        <div className="absolute bottom-4 right-12 text-blue-500/10 text-3xl">♣</div>

        <div className="relative text-center">
          <div className="inline-flex items-center gap-4 mb-4">
            {/* Casino Chip Icon */}
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 shadow-lg shadow-blue-500/40 animate-pulse" />
              <div className="absolute inset-0.5 rounded-full bg-linear-to-br from-blue-500 to-blue-700" />
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-blue-300/50 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Bet <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-500">History</span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                View all your past bets
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center md:overflow-visible mb-6"
      >
        {filterOptions.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * index }}
            onClick={() => setFilter(option.value)}
            className={`relative px-4 py-2 rounded-xl font-medium transition-all overflow-hidden group snap-center shrink-0 ${
              filter === option.value
                ? 'text-white shadow-lg'
                : 'text-gray-400 hover:text-white bg-[#1e293b] border border-amber-500/20'
            }`}
            style={{
              boxShadow: filter === option.value ? `0 10px 25px -5px rgba(${option.color === 'amber' ? '245, 158, 11' : option.color === 'green' ? '34, 197, 94' : option.color === 'red' ? '239, 68, 68' : '234, 179, 8'}, 0.3)` : 'none'
            }}
          >
            {filter === option.value && (
              <>
                <div className={`absolute inset-0 bg-linear-to-r ${
                  option.color === 'amber' ? 'from-amber-500 via-yellow-500 to-amber-500' :
                  option.color === 'green' ? 'from-green-500 to-green-600' :
                  option.color === 'red' ? 'from-red-500 to-red-600' :
                  'from-yellow-500 to-yellow-600'
                }`} />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </>
            )}
            <span className="relative flex items-center gap-2">
              {option.icon}
              {option.label}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Bet List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden bg-[#1e293b] rounded-2xl border border-blue-500/20"
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-blue-500/30 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-500/30 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-500/30 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-blue-500/30 rounded-br-2xl" />

        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent" />

        {isLoading ? (
          <div className="p-4">
            <BetHistorySkeleton />
          </div>
        ) : betHistory.length === 0 ? (
          <div className="p-12 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-gray-600 to-gray-700 opacity-50" />
              <div className="absolute inset-2 rounded-full bg-[#1e293b] flex items-center justify-center">
                <span className="text-4xl">🎲</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No bets yet
            </h3>
            <p className="text-gray-400">
              Start playing to see your bet history here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-blue-500/10">
            {betHistory.map((bet, index) => (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-4 hover:bg-blue-500/5 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Game icon chip */}
                    <div className={`relative w-14 h-14 rounded-xl overflow-hidden ${
                      bet.status === 'won' ? 'bg-green-500/20' : bet.status === 'lost' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                    }`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl">
                          {bet.game?.type === 'dice' && '🎲'}
                          {bet.game?.type === 'crash' && '📈'}
                          {bet.game?.type === 'roulette' && '🎡'}
                          {bet.game?.type === 'slots' && '🎰'}
                          {bet.game?.type === 'blackjack' && '🃏'}
                          {!bet.game?.type && '🎮'}
                        </span>
                      </div>
                      {/* Status indicator */}
                      <div className={`absolute bottom-1 right-1 w-3 h-3 rounded-full ${
                        bet.status === 'won' ? 'bg-green-500' : bet.status === 'lost' ? 'bg-red-500' : 'bg-yellow-500'
                      } ring-2 ring-[#1e293b]`} />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                        {bet.game?.name || 'Unknown Game'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDate(bet.placedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-400 text-sm">
                      Bet: <span className="text-white">{formatCurrency(bet.amount)}</span>
                    </p>
                    <p
                      className={`font-bold text-lg ${
                        bet.status === 'won'
                          ? 'text-green-400'
                          : bet.status === 'lost'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {bet.status === 'won' && `+${formatCurrency(bet.actualWin)}`}
                      {bet.status === 'lost' && `-${formatCurrency(bet.amount)}`}
                      {bet.status === 'pending' && 'Pending'}
                    </p>
                  </div>
                </div>

                {bet.multiplier && (
                  <div className="mt-3 flex gap-4 text-sm">
                    <span className="px-2 py-1 bg-amber-500/10 rounded text-amber-400">
                      {bet.multiplier}x Multiplier
                    </span>
                    {bet.betData && (
                      <span className="text-gray-500 truncate max-w-xs">
                        {JSON.stringify(bet.betData).slice(0, 50)}...
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-[#1e293b] to-transparent pointer-events-none" />
      </motion.div>

      {/* Summary Stats */}
      {betHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            {
              label: 'Total Bets',
              value: betHistory.length,
              icon: '📊',
              color: 'from-blue-500 to-blue-600',
              border: 'border-blue-500/20'
            },
            {
              label: 'Won',
              value: betHistory.filter(b => b.status === 'won').length,
              icon: '🏆',
              color: 'from-green-500 to-green-600',
              border: 'border-green-500/20'
            },
            {
              label: 'Lost',
              value: betHistory.filter(b => b.status === 'lost').length,
              icon: '😢',
              color: 'from-red-500 to-red-600',
              border: 'border-red-500/20'
            },
            {
              label: 'Win Rate',
              value: `${((betHistory.filter(b => b.status === 'won').length / betHistory.length) * 100).toFixed(1)}%`,
              icon: '📈',
              color: 'from-amber-500 to-amber-600',
              border: 'border-amber-500/20'
            },
          ].map((stat, i) => (
            <div key={i} className={`relative overflow-hidden bg-[#1e293b] rounded-xl p-4 border ${stat.border}`}>
              <div className="flex items-center gap-2 mb-1">
                <span>{stat.icon}</span>
                <span className="text-gray-400 text-sm">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Footer decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center justify-center gap-4 text-gray-500"
      >
        <div className="w-12 h-0.5 bg-linear-to-r from-transparent to-blue-500/50" />
        <div className="flex gap-3 text-2xl opacity-30">
          <span>♠</span>
          <span className="text-red-500">♥</span>
          <span className="text-red-500">♦</span>
          <span>♣</span>
        </div>
        <div className="w-12 h-0.5 bg-linear-to-l from-transparent to-blue-500/50" />
      </motion.div>
    </div>
  );
}
