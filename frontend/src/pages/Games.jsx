import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import GameCard from '../components/games/GameCard';
import { GameCardSkeleton } from '../components/common/LoadingSkeleton';

const gameTypes = [
  { value: '', label: 'All Games', icon: '🎮' },
  { value: 'slots', label: 'Slots', icon: '🎰' },
  { value: 'roulette', label: 'Roulette', icon: '🎡' },
  { value: 'blackjack', label: 'Blackjack', icon: '🃏' },
  { value: 'dice', label: 'Dice', icon: '🎲' },
  { value: 'crash', label: 'Crash', icon: '📈' },
  { value: 'poker', label: 'Poker', icon: '♠️' },
  { value: 'baccarat', label: 'Baccarat', icon: '💎' },
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
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          {/* Casino Chip Icon */}
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30" />
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <span className="text-white text-xl">🎮</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Casino Games</h1>
        </div>
        <p className="text-gray-400">
          Choose from our selection of provably fair games
        </p>
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
        <div className="flex flex-wrap justify-center gap-2">
          {gameTypes.map((type, index) => (
            <motion.button
              key={type.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              onClick={() => setSelectedType(type.value)}
              className={`relative px-4 py-2 rounded-xl font-medium transition-all overflow-hidden group ${
                selectedType === type.value
                  ? 'text-white shadow-lg shadow-amber-500/30'
                  : 'text-gray-400 hover:text-white bg-[#1e293b] border border-amber-500/20'
              }`}
            >
              {selectedType === type.value && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </>
              )}
              <span className="relative flex items-center gap-2">
                <span>{type.icon}</span>
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 opacity-50" />
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
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500/50" />
        <div className="flex gap-3 text-2xl opacity-30">
          <span>♠</span>
          <span className="text-red-500">♥</span>
          <span className="text-red-500">♦</span>
          <span>♣</span>
        </div>
        <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500/50" />
      </motion.div>
    </div>
  );
}
