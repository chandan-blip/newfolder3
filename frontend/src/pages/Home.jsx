import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import useAuthStore from '../store/authStore';
import GameCard from '../components/games/GameCard';
import { GameCardSkeleton } from '../components/common/LoadingSkeleton';
import WalletWidget from '../components/wallet/WalletWidget';

// Demo data generators for live bets
const usernames = [
  'LuckyAce777', 'DiamondKing', 'RoyalFlush', 'CryptoWhale', 'NightOwl99',
  'GoldenEagle', 'SilverFox42', 'RedDragon88', 'BlueStorm', 'PurpleHaze',
  'ThunderBolt', 'StarPlayer', 'MoonWalker', 'SunChaser', 'FirePhoenix',
  'IceKing2024', 'StormRider', 'ShadowHunter', 'LightBringer', 'DarkKnight'
];

const games = [
  { name: 'Lucky Slots', icon: '🎰', type: 'slots' },
  { name: 'Blackjack Pro', icon: '🃏', type: 'blackjack' },
  { name: 'Roulette VIP', icon: '🎡', type: 'roulette' },
  { name: 'Crash Rocket', icon: '🚀', type: 'crash' },
  { name: 'Dice Master', icon: '🎲', type: 'dice' },
  { name: 'Poker Kings', icon: '♠️', type: 'poker' },
  { name: 'Baccarat Elite', icon: '🎴', type: 'baccarat' },
  { name: 'Mega Fortune', icon: '💎', type: 'slots' },
];

const generateRandomBet = () => {
  const isWin = Math.random() > 0.45;
  const amount = Math.floor(Math.random() * 500) + 10;
  const multiplier = isWin ? (Math.random() * 10 + 1.1).toFixed(2) : 0;
  const winAmount = isWin ? (amount * parseFloat(multiplier)).toFixed(2) : 0;
  const game = games[Math.floor(Math.random() * games.length)];

  return {
    id: Date.now() + Math.random(),
    username: usernames[Math.floor(Math.random() * usernames.length)],
    game,
    amount,
    multiplier: parseFloat(multiplier),
    winAmount: parseFloat(winAmount),
    isWin,
    timestamp: new Date(),
    avatar: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
    avatarColor: [
      'from-amber-400 to-yellow-500',
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-green-400 to-green-600',
      'from-red-400 to-red-600',
      'from-pink-400 to-pink-600',
      'from-cyan-400 to-cyan-600',
    ][Math.floor(Math.random() * 7)],
  };
};

export default function Home() {
  const { featuredGames, fetchFeaturedGames, isLoading } = useGameStore();
  const { isAuthenticated } = useAuthStore();
  const [liveBets, setLiveBets] = useState([]);
  const [totalBetsToday, setTotalBetsToday] = useState(12847);
  const [totalWonToday, setTotalWonToday] = useState(284563.42);

  // Animated stats
  const [stats, setStats] = useState({
    activePlayers: 1234,
    gamesPlayed: 48293,
    totalPayouts: 1247832.50,
    winRate: 96.5,
  });

  // Generate initial bets
  const generateInitialBets = useCallback(() => {
    const initialBets = [];
    for (let i = 0; i < 10; i++) {
      initialBets.push(generateRandomBet());
    }
    return initialBets;
  }, []);

  useEffect(() => {
    fetchFeaturedGames();

    // Initialize with some bets
    setLiveBets(generateInitialBets());

    // Add new bet every 1-3 seconds
    const betsInterval = setInterval(() => {
      const newBet = generateRandomBet();

      setLiveBets(prev => {
        const updated = [newBet, ...prev.slice(0, 9)];
        return updated;
      });

      // Update stats
      setTotalBetsToday(prev => prev + 1);
      if (newBet.isWin) {
        setTotalWonToday(prev => prev + newBet.winAmount);
      }
    }, Math.random() * 2000 + 1000);

    // Update stats every 2-5 seconds
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        activePlayers: prev.activePlayers + Math.floor(Math.random() * 10) - 4,
        gamesPlayed: prev.gamesPlayed + Math.floor(Math.random() * 5) + 1,
        totalPayouts: prev.totalPayouts + Math.random() * 500 + 50,
        winRate: Math.min(99.9, Math.max(94, prev.winRate + (Math.random() - 0.5) * 0.2)),
      }));
    }, 3000);

    return () => {
      clearInterval(betsInterval);
      clearInterval(statsInterval);
    };
  }, [fetchFeaturedGames, generateInitialBets]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Casino Theme */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-br from-amber-900/20 via-[#0f172a] to-purple-900/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        {/* Floating Casino Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Decorative chips */}
          <div className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-linear-to-br from-amber-400 to-amber-600 opacity-20 blur-sm animate-pulse" />
          <div className="absolute top-40 right-[15%] w-12 h-12 rounded-full bg-linear-to-br from-red-400 to-red-600 opacity-20 blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-[20%] w-20 h-20 rounded-full bg-linear-to-br from-purple-400 to-purple-600 opacity-15 blur-sm animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-60 right-[25%] w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-green-600 opacity-20 blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />

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
            {/* Premium Casino Logo with Animated Ring */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 15 }}
              className="inline-flex items-center justify-center mb-10"
            >
              <div className="relative">
                {/* Outer rotating ring */}
                <div className="absolute -inset-4 rounded-full border-2 border-dashed border-amber-500/30 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute -inset-8 rounded-full border border-amber-500/10 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />

                {/* Floating card suits around logo */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl animate-bounce" style={{ animationDuration: '2s' }}>♠</div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-2xl text-red-500 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>♥</div>
                <div className="absolute top-1/2 -left-8 -translate-y-1/2 text-2xl text-red-500 animate-bounce" style={{ animationDuration: '2s', animationDelay: '1s' }}>♦</div>
                <div className="absolute top-1/2 -right-8 -translate-y-1/2 text-2xl animate-bounce" style={{ animationDuration: '2s', animationDelay: '1.5s' }}>♣</div>

                {/* Main logo chip */}
                <div className="relative w-28 h-28 rounded-full bg-linear-to-br from-amber-400 via-yellow-500 to-amber-600 p-1.5 shadow-2xl shadow-amber-500/40">
                  {/* Inner ring pattern */}
                  <div className="absolute inset-2 rounded-full border-4 border-amber-300/30" />
                  <div className="w-full h-full rounded-full bg-linear-to-br from-[#1a1a2e] to-[#0f172a] flex items-center justify-center">
                    {/* Chip edge notches */}
                    <div className="absolute inset-0 rounded-full">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-3 h-1.5 bg-amber-400/60 rounded-full"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${i * 45}deg) translateX(52px) translateY(-50%)`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="relative w-20 h-20 rounded-full border-4 border-amber-400/50 flex items-center justify-center bg-linear-to-br from-amber-500/10 to-transparent">
                      <div className="text-center">
                        <span className="text-4xl font-black bg-linear-to-b from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">C</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Multiple glow layers */}
                <div className="absolute inset-0 rounded-full bg-amber-500/30 blur-xl animate-pulse" />
                <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-2xl" />
              </div>
            </motion.div>

            {/* Animated Welcome Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 mb-6 rounded-full bg-linear-to-r from-amber-500/10 via-yellow-500/20 to-amber-500/10 border border-amber-500/30 backdrop-blur-sm"
            >
              <div className="flex -space-x-1">
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-[10px] text-white font-bold border-2 border-[#0f172a]">A</div>
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[10px] text-white font-bold border-2 border-[#0f172a]">K</div>
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold border-2 border-[#0f172a]">J</div>
              </div>
              <div className="w-px h-5 bg-amber-500/30" />
              <span className="text-sm text-amber-400 font-medium">1,847+ Players Online Now</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </motion.div>

            {/* Main Heading with Animated Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
                <span className="inline-block">Play.</span>{' '}
                <span className="inline-block relative">
                  <span className="bg-linear-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">Win.</span>
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-500/30" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <path d="M0,6 Q25,0 50,6 T100,6" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </span>{' '}
                <span className="inline-block">
                  <span className="bg-linear-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">Repeat.</span>
                </span>
              </h1>

              {/* Jackpot counter style subtitle */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-400 font-bold text-sm">$1.2M+ Paid Out Today</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 hidden sm:block" />
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="text-purple-400 font-bold text-sm">Provably Fair</span>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Experience the thrill of real-time casino gaming with{' '}
              <span className="text-white font-medium">instant payouts</span>,{' '}
              <span className="text-amber-400 font-medium">VIP rewards</span>, and{' '}
              <span className="text-green-400 font-medium">24/7 live action</span>.
            </motion.p>

            {/* Premium CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {isAuthenticated ? (
                <Link
                  to="/games"
                  className="group relative w-full sm:w-auto overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-amber-500 via-yellow-500 to-amber-500 group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <div className="relative px-10 py-5 flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="block text-white font-bold text-lg">Start Playing</span>
                      <span className="block text-amber-200/80 text-xs">100+ Games Available</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative w-full sm:w-auto overflow-hidden rounded-2xl"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-amber-500 via-yellow-500 to-amber-500" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    {/* Shine pulse effect */}
                    <div className="absolute top-0 left-0 w-full h-full">
                      <div className="absolute top-0 -left-4 w-8 h-full bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
                    </div>
                    <div className="relative px-10 py-5 flex items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <span className="text-2xl">🎰</span>
                      </div>
                      <div className="text-left">
                        <span className="block text-white font-bold text-lg">Get $100 Free Bonus</span>
                        <span className="block text-amber-200/80 text-xs">No deposit required</span>
                      </div>
                      <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </Link>

                  <Link
                    to="/games"
                    className="group relative w-full sm:w-auto px-8 py-5 rounded-2xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[#1e293b] border border-amber-500/30 rounded-2xl group-hover:border-amber-500/60 transition-colors" />
                    <div className="absolute inset-0 bg-linear-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 group-hover:via-amber-500/10 transition-all" />
                    <span className="relative flex items-center justify-center gap-2 text-white font-semibold text-lg">
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Browse Games
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">NEW</span>
                    </span>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-white/5"
            >
              {[
                { icon: '🔒', label: 'SSL Secured' },
                { icon: '⚡', label: 'Instant Payouts' },
                { icon: '🎮', label: '100+ Games' },
                { icon: '🏆', label: 'VIP Rewards' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-500">
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-xs font-medium hidden sm:block">{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Casino Stats - Premium Animated Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {[
              {
                label: 'Active Players',
                value: stats.activePlayers.toLocaleString(),
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                color: 'from-blue-400 to-blue-600',
                bgColor: 'blue',
                suffix: '',
                live: true,
              },
              {
                label: 'Games Played',
                value: stats.gamesPlayed.toLocaleString(),
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: 'from-purple-400 to-purple-600',
                bgColor: 'purple',
                suffix: '',
                live: true,
              },
              {
                label: 'Total Payouts',
                value: '$' + (stats.totalPayouts / 1000000).toFixed(2) + 'M',
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: 'from-amber-400 to-amber-600',
                bgColor: 'amber',
                suffix: '+',
                live: true,
              },
              {
                label: 'Win Rate',
                value: stats.winRate.toFixed(1),
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                color: 'from-green-400 to-green-600',
                bgColor: 'green',
                suffix: '%',
                live: false,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative overflow-hidden rounded-2xl group cursor-pointer"
              >
                {/* Card background with gradient border effect */}
                <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-20`} />
                <div className="absolute inset-px bg-linear-to-b from-[#1e293b] to-[#0f172a] rounded-2xl" />

                {/* Corner decorations */}
                <div className={`absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-${stat.bgColor}-500/40 rounded-tl-2xl`} />
                <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-${stat.bgColor}-500/40 rounded-br-2xl`} />

                {/* Top glow line */}
                <div className={`absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-${stat.bgColor}-500/50 to-transparent`} />

                {/* Hover effects */}
                <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                {/* Background pattern */}
                <div className="absolute bottom-2 right-2 text-3xl opacity-5">
                  {['♠', '♣', '♥', '♦'][index]}
                </div>

                {/* Content */}
                <div className="relative p-5">
                  {/* Icon with glow */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`relative w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <div className={`absolute inset-0 rounded-xl bg-linear-to-br ${stat.color} blur-md opacity-50`} />
                      <div className="relative text-white">
                        {stat.icon}
                      </div>
                    </div>
                    {stat.live && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] text-green-400 font-medium uppercase">Live</span>
                      </div>
                    )}
                  </div>

                  {/* Value with animation hint */}
                  <div className="mb-1">
                    <motion.p
                      key={stat.value}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-2xl md:text-3xl font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.value}{stat.suffix}
                    </motion.p>
                  </div>

                  {/* Label */}
                  <p className="text-sm text-gray-400 font-medium">{stat.label}</p>

                  {/* Micro trend indicator */}
                  <div className="mt-2 flex items-center gap-1">
                    <svg className={`w-3 h-3 ${stat.bgColor === 'green' ? 'text-green-400' : 'text-green-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="text-[10px] text-gray-500">
                      {stat.bgColor === 'blue' ? '+12 this hour' :
                       stat.bgColor === 'purple' ? '+847 today' :
                       stat.bgColor === 'amber' ? '+$24.5K today' :
                       'Verified fair'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-10"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-linear-to-r from-purple-500/5 via-purple-500/10 to-purple-500/5 rounded-2xl -mx-4 px-4" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />

          {/* Card suit decorations */}
          <div className="absolute top-2 left-4 text-purple-500/10 text-2xl">♠</div>
          <div className="absolute top-2 right-4 text-red-500/10 text-2xl">♥</div>
          <div className="absolute bottom-2 left-8 text-red-500/10 text-xl">♦</div>
          <div className="absolute bottom-2 right-8 text-purple-500/10 text-xl">♣</div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-4">
              {/* Premium chip icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-lg animate-pulse" />
                <div className="relative w-14 h-14 rounded-full bg-linear-to-br from-purple-400 via-purple-500 to-purple-700 p-0.5 shadow-lg shadow-purple-500/30">
                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-purple-400/50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Featured <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-purple-600">Games</span>
                </h2>
                <p className="text-sm text-gray-400 mt-1">Hand-picked favorites with the best odds</p>
              </div>
            </div>

            {/* View All button */}
            <Link
              to="/games"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
            >
              <span className="font-medium">View All Games</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />
        </motion.div>

        {/* Games Grid with container styling */}
        <div className="relative">
          {/* Background glow */}
          <div className="absolute -inset-4 bg-linear-to-b from-purple-500/5 via-transparent to-transparent rounded-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? [...Array(6)].map((_, i) => <GameCardSkeleton key={i} />)
              : featuredGames.slice(0, 6).map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GameCard game={game} />
                  </motion.div>
                ))}
          </div>

          {/* Bottom decoration */}
          <div className="flex items-center justify-center gap-4 mt-10 text-gray-600">
            <div className="w-16 h-px bg-linear-to-r from-transparent to-purple-500/30" />
            <div className="flex gap-2 text-lg opacity-40">
              <span>♠</span>
              <span className="text-red-500">♥</span>
              <span className="text-red-500">♦</span>
              <span>♣</span>
            </div>
            <div className="w-16 h-px bg-linear-to-l from-transparent to-purple-500/30" />
          </div>
        </div>
      </section>

      {/* Live Activity Section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Bets - Premium Casino Feed */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden bg-linear-to-b from-[#1e293b] to-[#0f172a] rounded-2xl border border-red-500/30">
              {/* Animated top glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-500 to-transparent" />
              <div className="absolute top-0 left-1/4 w-1/2 h-8 bg-red-500/20 blur-xl" />

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-red-500/40 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-red-500/40 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-red-500/40 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-red-500/40 rounded-br-2xl" />

              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-12 left-8 text-6xl">♠</div>
                <div className="absolute top-1/3 right-12 text-5xl text-red-500">♥</div>
                <div className="absolute bottom-1/3 left-16 text-4xl text-red-500">♦</div>
                <div className="absolute bottom-12 right-8 text-5xl">♣</div>
              </div>

              {/* Header */}
              <div className="relative p-4 border-b border-red-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Live pulse icon */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/40 rounded-full blur-md animate-ping" />
                      <div className="relative w-10 h-10 rounded-full bg-linear-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        Live Bets
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-xs text-red-400 font-medium">LIVE</span>
                        </span>
                      </h3>
                      <p className="text-xs text-gray-400">Real-time betting activity</p>
                    </div>
                  </div>
                  {/* Stats pills */}
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
                      <span className="text-xs text-green-400 font-semibold">{totalBetsToday.toLocaleString()} bets today</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column Headers */}
              <div className="relative px-4 py-2 border-b border-white/5 bg-black/20">
                <div className="flex items-center text-xs text-gray-500 uppercase tracking-wider font-medium">
                  <div className="flex-1">Player</div>
                  <div className="w-28 text-center hidden sm:block">Game</div>
                  <div className="w-24 text-center">Bet</div>
                  <div className="w-20 text-center hidden sm:block">Multi</div>
                  <div className="w-28 text-right">Payout</div>
                </div>
              </div>

              {/* Live Bets Feed */}
              <div className="relative divide-y divide-white/5 overflow-hidden">
                {liveBets.slice(0, 10).map((bet, index) => (
                  <motion.div
                    key={bet.id}
                    layout
                    initial={{ opacity: 0, y: -56 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                      opacity: { duration: 0.3, delay: 0.1 },
                      y: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                    }}
                    className={`group relative flex items-center px-4 py-3 cursor-pointer ${
                      index === 0
                        ? bet.isWin
                          ? 'bg-linear-to-r from-green-500/10 via-green-500/5 to-transparent'
                          : 'bg-linear-to-r from-red-500/10 via-red-500/5 to-transparent'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* New bet indicator */}
                    {index === 0 && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-amber-400 via-yellow-500 to-amber-400 animate-pulse" />
                    )}

                    {/* Player info */}
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      <div className={`relative shrink-0 w-10 h-10 rounded-full bg-linear-to-br ${bet.avatarColor} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-sm">{bet.avatar}</span>
                        {bet.isWin && bet.multiplier >= 5 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold truncate ${index === 0 ? (bet.isWin ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>
                          {bet.username}
                        </p>
                        <p className="text-xs text-gray-500 sm:hidden truncate">{bet.game.name}</p>
                      </div>
                    </div>

                    {/* Game */}
                    <div className="w-28 hidden sm:flex items-center justify-center gap-2">
                      <span className="text-lg">{bet.game.icon}</span>
                      <span className="text-sm text-gray-400 truncate">{bet.game.name}</span>
                    </div>

                    {/* Bet Amount */}
                    <div className="w-24 text-center">
                      <span className="text-sm text-gray-300 font-medium">${bet.amount.toFixed(2)}</span>
                    </div>

                    {/* Multiplier */}
                    <div className="w-20 hidden sm:flex justify-center">
                      {bet.isWin ? (
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          bet.multiplier >= 5
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {bet.multiplier.toFixed(2)}x
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                    </div>

                    {/* Payout */}
                    <div className="w-28 text-right">
                      <p className={`font-bold ${bet.isWin ? 'text-green-400' : 'text-red-400'}`}>
                        {bet.isWin ? '+' : '-'}${bet.isWin ? bet.winAmount.toFixed(2) : bet.amount.toFixed(2)}
                      </p>
                      {bet.isWin && bet.multiplier >= 3 && (
                        <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
                          {bet.multiplier >= 8 ? 'MEGA WIN' : bet.multiplier >= 5 ? 'BIG WIN' : 'NICE WIN'}
                        </p>
                      )}
                    </div>

                    {/* Hover shine effect for new bet */}
                    {index === 0 && (
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Footer stats */}
              <div className="relative p-4 border-t border-red-500/20 bg-black/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-gray-400">1,847 players online</span>
                    </div>
                    <div className="hidden sm:block w-px h-4 bg-gray-700" />
                    <div className="hidden sm:flex items-center gap-2 text-gray-400">
                      <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Updates every second</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-green-400 font-bold">${totalWonToday.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-xs text-gray-500">won today</span>
                  </div>
                </div>
              </div>

              {/* Bottom glow */}
              <div className="absolute bottom-0 left-1/4 w-1/2 h-8 bg-red-500/10 blur-xl" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {isAuthenticated && <WalletWidget />}

            {/* Top Wins - Premium Casino Leaderboard */}
            <div className="relative overflow-hidden bg-linear-to-b from-[#1e293b] to-[#0f172a] rounded-2xl border border-amber-500/30">
              {/* Animated top glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-500 to-transparent" />
              <div className="absolute top-0 left-1/4 w-1/2 h-8 bg-amber-500/20 blur-xl" />

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/40 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/40 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-500/40 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/40 rounded-br-2xl" />

              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-8 right-4 text-6xl">♠</div>
                <div className="absolute bottom-12 left-4 text-5xl text-red-500">♥</div>
                <div className="absolute top-1/2 right-8 text-4xl text-red-500">♦</div>
                <div className="absolute bottom-4 right-12 text-5xl">♣</div>
              </div>

              {/* Header */}
              <div className="relative p-4 border-b border-amber-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Trophy icon with glow */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-md animate-pulse" />
                      <div className="relative w-10 h-10 rounded-full bg-linear-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Top Wins</h3>
                      <p className="text-xs text-amber-400/80">Today's Champions</p>
                    </div>
                  </div>
                  {/* Live indicator */}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-400 font-medium">LIVE</span>
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="relative p-4 space-y-2">
                {[
                  { rank: 1, name: 'LuckyAce777', game: 'Slots', amount: 2847.50, avatar: 'A', color: 'from-amber-400 to-yellow-500' },
                  { rank: 2, name: 'DiamondKing', game: 'Blackjack', amount: 1923.00, avatar: 'D', color: 'from-gray-300 to-gray-400' },
                  { rank: 3, name: 'RoyalFlush', game: 'Poker', amount: 1456.75, avatar: 'R', color: 'from-amber-600 to-amber-700' },
                  { rank: 4, name: 'CryptoWhale', game: 'Roulette', amount: 892.30, avatar: 'C', color: 'from-blue-500 to-blue-600' },
                  { rank: 5, name: 'NightOwl99', game: 'Crash', amount: 654.20, avatar: 'N', color: 'from-purple-500 to-purple-600' },
                ].map((winner, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`group relative flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      i === 0
                        ? 'bg-linear-to-r from-amber-500/20 via-yellow-500/10 to-transparent border border-amber-500/30 hover:border-amber-500/50'
                        : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                    }`}
                  >
                    {/* Rank badge */}
                    <div className={`relative shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      i === 0 ? 'bg-linear-to-br from-amber-400 to-yellow-600 text-amber-900 shadow-lg shadow-amber-500/30' :
                      i === 1 ? 'bg-linear-to-br from-gray-300 to-gray-500 text-gray-800' :
                      i === 2 ? 'bg-linear-to-br from-amber-600 to-amber-800 text-amber-200' :
                      'bg-[#334155] text-gray-400'
                    }`}>
                      {i < 3 ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                        </svg>
                      ) : winner.rank}
                    </div>

                    {/* Player avatar */}
                    <div className={`relative shrink-0 w-10 h-10 rounded-full bg-linear-to-br ${winner.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-sm">{winner.avatar}</span>
                      {i === 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Player info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold truncate ${i === 0 ? 'text-amber-400' : 'text-white'}`}>
                          {winner.name}
                        </span>
                        {i === 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded uppercase">
                            Hot
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{winner.game}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        <span>2m ago</span>
                      </div>
                    </div>

                    {/* Win amount */}
                    <div className="shrink-0 text-right">
                      <div className={`font-bold ${i === 0 ? 'text-lg text-green-400' : 'text-green-400'}`}>
                        +${winner.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                        {i === 0 ? 'Jackpot' : 'Win'}
                      </div>
                    </div>

                    {/* Hover shine effect for top winner */}
                    {i === 0 && (
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Footer stats */}
              <div className="relative p-4 border-t border-amber-500/20 bg-black/20">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-400">1,234 players online</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="font-semibold">$48,293 won today</span>
                  </div>
                </div>
              </div>

              {/* Bottom glow */}
              <div className="absolute bottom-0 left-1/4 w-1/2 h-8 bg-amber-500/10 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-linear-to-r from-amber-600 via-yellow-500 to-amber-600" />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 w-32 h-32 border-4 border-white rounded-full" />
              <div className="absolute bottom-8 right-8 w-24 h-24 border-4 border-white rounded-full" />
              <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white transform rotate-45" />
              <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-white transform rotate-45" />
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

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
        <div className="w-12 h-0.5 bg-linear-to-r from-transparent to-amber-500/50" />
        <div className="flex gap-3 text-2xl opacity-30">
          <span>♠</span>
          <span className="text-red-500">♥</span>
          <span className="text-red-500">♦</span>
          <span>♣</span>
        </div>
        <div className="w-12 h-0.5 bg-linear-to-l from-transparent to-amber-500/50" />
      </div>
    </div>
  );
}
