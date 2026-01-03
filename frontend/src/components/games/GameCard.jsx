import { Link } from 'react-router-dom';

const gameTypeColors = {
  slots: 'from-purple-500 to-pink-500',
  roulette: 'from-red-500 to-orange-500',
  blackjack: 'from-green-500 to-emerald-500',
  dice: 'from-blue-500 to-cyan-500',
  crash: 'from-yellow-500 to-orange-500',
  poker: 'from-indigo-500 to-purple-500',
  baccarat: 'from-rose-500 to-red-500',
};

const gameTypeIcons = {
  slots: '🎰',
  roulette: '🎡',
  blackjack: '🃏',
  dice: '🎲',
  crash: '📈',
  poker: '♠️',
  baccarat: '🎴',
};

export default function GameCard({ game }) {
  const { id, name, slug, type, description, thumbnailUrl, minBet, maxBet, rtp, isFeatured } = game;

  return (
    <Link to={`/games/${slug}`} className="block group">
      <div className="relative bg-surface rounded-xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
        {/* Image / Placeholder */}
        <div className="relative h-40 overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${
                gameTypeColors[type] || 'from-gray-600 to-gray-800'
              } flex items-center justify-center`}
            >
              <span className="text-5xl">{gameTypeIcons[type] || '🎮'}</span>
            </div>
          )}

          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
              Featured
            </div>
          )}

          {/* RTP Badge */}
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg">
            RTP: {(rtp * 100).toFixed(1)}%
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="px-6 py-2 gradient-primary text-white rounded-lg font-medium transform scale-90 group-hover:scale-100 transition-transform duration-300">
              Play Now
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white group-hover:text-primary transition-colors">
              {name}
            </h3>
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {type}
            </span>
          </div>

          {description && (
            <p className="text-sm text-gray-400 line-clamp-2 mb-3">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Min: <span className="text-white">${minBet}</span>
            </span>
            <span className="text-gray-400">
              Max: <span className="text-white">${maxBet}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
