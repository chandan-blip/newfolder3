import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import useAuthStore from '../store/authStore';
import GameCard from '../components/games/GameCard';
import { GameCardSkeleton } from '../components/common/LoadingSkeleton';
import WalletWidget from '../components/wallet/WalletWidget';

export default function Home() {
  const { featuredGames, recentBets, fetchFeaturedGames, fetchRecentBets, isLoading } = useGameStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchFeaturedGames();
    fetchRecentBets(10);
  }, [fetchFeaturedGames, fetchRecentBets]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Casino Theme */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-[#0f172a] to-purple-900/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        {/* Floating Casino Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Decorative chips */}
          <div className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 opacity-20 blur-sm animate-pulse" />
          <div className="absolute top-40 right-[15%] w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 opacity-20 blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-[20%] w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 opacity-15 blur-sm animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-60 right-[25%] w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 opacity-20 blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />

          {/* Card suits decoration */}
          <div className="absolute top-32 left-[30%] text-6xl opacity-5 rotate-12">♠</div>
          <div className="absolute top-48 right-[20%] text-5xl opacity-5 -rotate-12 text-red-500">♥</div>
          <div className="absolute bottom-32 left-[15%] text-5xl opacity-5 rotate-6 text-red-500">♦</div>
          <div className="absolute bottom-48 right-[30%] text-6xl opacity-5 -rotate-6">♣</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Casino Logo/Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center mb-8"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-1 shadow-2xl shadow-amber-500/30">
                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-dashed border-amber-400/50 flex items-center justify-center">
                      <span className="text-3xl font-bold text-amber-400">C</span>
                    </div>
                  </div>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Play. Win.{' '}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
                Repeat.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Experience the thrill of real-time casino gaming with provably fair games,
              instant payouts, and 24/7 live action.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/games"
                  className="group relative w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="relative text-white flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Playing
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative text-white flex items-center justify-center gap-2">
                      Get Started Free
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    to="/games"
                    className="w-full sm:w-auto px-8 py-4 bg-[#1e293b] border border-amber-500/30 text-white rounded-xl font-semibold text-lg hover:bg-[#334155] hover:border-amber-500/50 transition-all"
                  >
                    Browse Games
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Casino Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {[
              { label: 'Active Players', value: '1,234+', icon: '👥', color: 'from-blue-500 to-blue-600' },
              { label: 'Games Available', value: '50+', icon: '🎮', color: 'from-purple-500 to-purple-600' },
              { label: 'Total Payouts', value: '$1.2M+', icon: '💰', color: 'from-amber-500 to-amber-600' },
              { label: 'Win Rate', value: '96.5%', icon: '🏆', color: 'from-green-500 to-green-600' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative overflow-hidden rounded-2xl p-4 text-center group"
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-[#1e293b] border border-amber-500/20" />
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/20 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/20 rounded-br-2xl" />

                {/* Hover glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative">
                  <span className="text-2xl mb-2 block">{stat.icon}</span>
                  <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {/* Casino chip icon */}
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600" />
              <div className="absolute inset-1 rounded-full bg-[#0f172a] flex items-center justify-center">
                <span className="text-amber-400 text-sm font-bold">★</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Games</h2>
          </div>
          <Link
            to="/games"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [...Array(6)].map((_, i) => <GameCardSkeleton key={i} />)
            : featuredGames.slice(0, 6).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
        </div>
      </section>

      {/* Live Activity Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bets */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-sm font-medium uppercase tracking-wider">Live</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Live Bets</h2>
            </div>

            <div className="relative overflow-hidden bg-[#1e293b] rounded-2xl border border-amber-500/20">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl" />

              <div className="divide-y divide-amber-500/10">
                {recentBets.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                      <span className="text-2xl">🎲</span>
                    </div>
                    <p className="text-gray-400">No recent bets yet. Be the first to play!</p>
                  </div>
                ) : (
                  recentBets.slice(0, 10).map((bet, index) => (
                    <motion.div
                      key={bet.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 hover:bg-amber-500/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {bet.user?.username?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium group-hover:text-amber-400 transition-colors">
                            {bet.user?.username || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {bet.game?.name || 'Game'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-lg ${
                            bet.status === 'won' ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {bet.status === 'won' ? '+' : '-'}$
                          {bet.status === 'won'
                            ? bet.actualWin?.toFixed(2)
                            : bet.amount?.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {bet.multiplier ? `${bet.multiplier}x` : ''}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {isAuthenticated && <WalletWidget />}

            {/* Top Wins */}
            <div className="relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-amber-500/20">
              {/* Header decoration */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <span className="text-white text-sm">🏆</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Top Wins Today</h3>
              </div>

              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-500/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${i < 3 ? '' : 'opacity-50'}`}>
                        {['🥇', '🥈', '🥉', '4.', '5.'][i]}
                      </span>
                      <span className="text-gray-300">Player{i + 1}</span>
                    </div>
                    <span className="text-green-400 font-bold">
                      +${(Math.random() * 1000 + 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 w-32 h-32 border-4 border-white rounded-full" />
              <div className="absolute bottom-8 right-8 w-24 h-24 border-4 border-white rounded-full" />
              <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white transform rotate-45" />
              <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-white transform rotate-45" />
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

            {/* Content */}
            <div className="relative p-8 md:p-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full mb-6">
                <span className="text-xl">🎁</span>
                <span className="text-white font-medium">Limited Time Offer</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Winning?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of players and experience the best online casino platform.
                Get $100 bonus on your first deposit!
              </p>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0f172a] text-amber-400 rounded-xl font-bold text-lg hover:bg-[#1e293b] transition-colors group"
              >
                Create Free Account
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* Footer decoration */}
      <div className="flex items-center justify-center gap-4 py-8 text-gray-500">
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500/50" />
        <div className="flex gap-3 text-2xl opacity-30">
          <span>♠</span>
          <span className="text-red-500">♥</span>
          <span className="text-red-500">♦</span>
          <span>♣</span>
        </div>
        <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500/50" />
      </div>
    </div>
  );
}
