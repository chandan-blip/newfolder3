import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useWalletStore from '../store/walletStore';
import useGameStore from '../store/gameStore';
import WalletWidget from '../components/wallet/WalletWidget';
import GameCard from '../components/games/GameCard';
import { GameCardSkeleton, BetHistorySkeleton } from '../components/common/LoadingSkeleton';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { balance, fetchBalance } = useWalletStore();
  const { featuredGames, betHistory, fetchFeaturedGames, fetchBetHistory, isLoading } = useGameStore();

  useEffect(() => {
    fetchBalance();
    fetchFeaturedGames();
    fetchBetHistory({ limit: 5 });
  }, [fetchBalance, fetchFeaturedGames, fetchBetHistory]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          {/* User Avatar Chip */}
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30" />
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {user?.username?.charAt(0).toUpperCase() || 'P'}
              </span>
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0f172a]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-amber-400">{user?.username || 'Player'}</span>!
            </h1>
            <p className="text-gray-400">
              Ready to try your luck today?
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Balance', value: formatCurrency(balance), icon: '💰', color: 'from-green-500 to-green-600', textColor: 'text-green-400' },
              { label: 'Total Bets', value: '42', icon: '🎲', color: 'from-blue-500 to-blue-600', textColor: 'text-blue-400' },
              { label: 'Win Rate', value: '68%', icon: '📊', color: 'from-amber-500 to-amber-600', textColor: 'text-amber-400' },
              { label: 'Net Profit', value: '+$234', icon: '🏆', color: 'from-emerald-500 to-emerald-600', textColor: 'text-emerald-400' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="relative overflow-hidden rounded-2xl group"
              >
                {/* Background */}
                <div className="absolute inset-0 bg-[#1e293b] border border-amber-500/10" />
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-500/20 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-500/20 rounded-br-2xl" />

                {/* Hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                <div className="relative p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{stat.icon}</span>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Play */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600" />
                  <div className="absolute inset-1 rounded-full bg-[#0f172a] flex items-center justify-center">
                    <span className="text-amber-400 text-xs font-bold">★</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white">Quick Play</h2>
              </div>
              <Link
                to="/games"
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                View All Games
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isLoading
                ? [...Array(4)].map((_, i) => <GameCardSkeleton key={i} />)
                : featuredGames.slice(0, 4).map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              </div>
              <Link
                to="/history"
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                View All
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="relative overflow-hidden bg-[#1e293b] rounded-2xl border border-amber-500/20">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/20 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/20 rounded-tr-2xl" />

              {isLoading ? (
                <div className="p-4">
                  <BetHistorySkeleton />
                </div>
              ) : betHistory.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <p className="text-gray-400 mb-4">No bets yet. Start playing!</p>
                  <Link
                    to="/games"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:scale-105 transition-transform"
                  >
                    Browse Games
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-amber-500/10">
                  {betHistory.map((bet, index) => (
                    <motion.div
                      key={bet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 hover:bg-amber-500/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          bet.status === 'won' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          <span className="text-2xl">
                            {bet.game?.type === 'dice' && '🎲'}
                            {bet.game?.type === 'crash' && '📈'}
                            {bet.game?.type === 'roulette' && '🎡'}
                            {!bet.game?.type && '🎮'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium group-hover:text-amber-400 transition-colors">
                            {bet.game?.name || 'Game'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(bet.placedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-lg ${
                            bet.status === 'won' ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {bet.status === 'won' ? '+' : '-'}
                          {formatCurrency(
                            bet.status === 'won' ? bet.actualWin : bet.amount
                          )}
                        </p>
                        <p className={`text-sm capitalize ${
                          bet.status === 'won' ? 'text-green-400/60' : 'text-red-400/60'
                        }`}>{bet.status}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <WalletWidget />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-amber-500/20"
          >
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            </div>

            <div className="space-y-3">
              <Link
                to="/wallet?action=deposit"
                className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-green-400 font-medium group-hover:text-green-300">Deposit Funds</span>
              </Link>

              <Link
                to="/games"
                className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                </div>
                <span className="text-amber-400 font-medium group-hover:text-amber-300">Play Games</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-purple-400 font-medium group-hover:text-purple-300">Edit Profile</span>
              </Link>
            </div>
          </motion.div>

          {/* VIP Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-amber-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👑</span>
                <h3 className="text-lg font-semibold text-white">VIP Progress</h3>
              </div>
              <span className="text-amber-400 text-sm font-medium">Bronze</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Level 2</span>
                <span className="text-amber-400">420/1000 XP</span>
              </div>
              <div className="h-3 bg-[#0f172a] rounded-full overflow-hidden">
                <div className="h-full w-[42%] bg-gradient-to-r from-amber-500 to-amber-400 rounded-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">580 XP to reach Silver</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
