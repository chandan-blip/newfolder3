import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import GameCard from '../components/games/GameCard';
import { GameCardSkeleton } from '../components/common/LoadingSkeleton';

const gameTypes = [
  {
    value: '',
    label: 'All Games',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    value: 'slots',
    label: 'Slots',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM9 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
      </svg>
    ),
  },
  {
    value: 'roulette',
    label: 'Roulette',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    value: 'blackjack',
    label: 'Blackjack',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    value: 'dice',
    label: 'Dice',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    value: 'crash',
    label: 'Crash',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    value: 'poker',
    label: 'Poker',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    value: 'baccarat',
    label: 'Baccarat',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

export default function Games() {
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { games, fetchGames, isLoading } = useGameStore();

  useEffect(() => {
    fetchGames({ type: selectedType || undefined });
  }, [selectedType, fetchGames]);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 py-8 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-linear-to-r from-amber-500/5 via-yellow-500/10 to-amber-500/5 rounded-2xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-amber-500/30 to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-4 left-8 text-amber-500/10 text-4xl">♠</div>
        <div className="absolute top-4 right-8 text-red-500/10 text-4xl">♥</div>
        <div className="absolute bottom-4 left-12 text-red-500/10 text-3xl">♦</div>
        <div className="absolute bottom-4 right-12 text-amber-500/10 text-3xl">♣</div>

        <div className="relative text-center">
          <div className="inline-flex items-center gap-4 mb-4">
            {/* Casino Chip Icon */}
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/40 animate-pulse" />
              <div className="absolute inset-0.5 rounded-full bg-linear-to-br from-amber-500 to-amber-700" />
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-300/50 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Casino <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-yellow-500">Games</span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Choose from our selection of provably fair games
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
        className="mb-8 space-y-4"
      >
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1e293b] border-2 border-amber-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
          />
        </div>

        {/* Type Filter - Casino Chips Style */}
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center md:overflow-visible">
          {gameTypes.map((type, index) => (
            <motion.button
              key={type.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              onClick={() => setSelectedType(type.value)}
              className={`relative px-4 py-2 rounded-xl font-medium transition-all overflow-hidden group snap-center shrink-0 ${
                selectedType === type.value
                  ? 'text-white shadow-lg shadow-amber-500/30'
                  : 'text-gray-400 hover:text-white bg-[#1e293b] border border-amber-500/20'
              }`}
            >
              {selectedType === type.value && (
                <>
                  <div className="absolute inset-0 bg-linear-to-r from-amber-500 via-yellow-500 to-amber-500" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                </>
              )}
              <span className="relative flex items-center gap-2">
                {type.icon}
                {type.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Games Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-gray-600 to-gray-700 opacity-50" />
              <div className="absolute inset-2 rounded-full bg-[#1e293b] flex items-center justify-center">
                <span className="text-4xl">🎮</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No games found
            </h3>
            <p className="text-gray-400">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GameCard game={game} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Footer decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex items-center justify-center gap-4 text-gray-500"
      >
        <div className="w-12 h-0.5 bg-linear-to-r from-transparent to-amber-500/50" />
        <div className="flex gap-3 text-2xl opacity-30">
          <span>♠</span>
          <span className="text-red-500">♥</span>
          <span className="text-red-500">♦</span>
          <span>♣</span>
        </div>
        <div className="w-12 h-0.5 bg-linear-to-l from-transparent to-amber-500/50" />
      </motion.div>
    </div>
  );
}
