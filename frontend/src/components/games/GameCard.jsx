import { Link } from 'react-router-dom';

const gameTypeColors = {
  dice: { gradient: 'from-blue-500 via-cyan-500 to-blue-600', accent: 'blue', glow: 'blue-500' },
};

const gameTypeIcons = {
  dice: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
};

const defaultIcon = (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function GameCard({ game }) {
  const { name, slug, type, description, thumbnailUrl, minBet, maxBet, rtp, isFeatured } = game;
  const colors = gameTypeColors[type] || { gradient: 'from-gray-600 via-gray-700 to-gray-800', accent: 'gray', glow: 'gray-500' };
  const icon = gameTypeIcons[type] || defaultIcon;

  return (
    <Link to={`/games/${slug}`} className="block group">
      <div className="relative bg-linear-to-b from-[#1e293b] to-[#0f172a] rounded-2xl overflow-hidden border border-gray-800/50 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10">
        {/* Outer glow on hover */}
        <div className={`absolute -inset-0.5 bg-linear-to-r ${colors.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-500`} />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-500/20 rounded-tl-2xl z-10 group-hover:border-amber-500/40 transition-colors" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-500/20 rounded-tr-2xl z-10 group-hover:border-amber-500/40 transition-colors" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-500/20 rounded-bl-2xl z-10 group-hover:border-amber-500/40 transition-colors" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-500/20 rounded-br-2xl z-10 group-hover:border-amber-500/40 transition-colors" />

        {/* Card suit watermarks */}
        <div className="absolute top-16 right-2 text-2xl opacity-5 group-hover:opacity-10 transition-opacity">♠</div>
        <div className="absolute bottom-16 left-2 text-2xl opacity-5 group-hover:opacity-10 transition-opacity text-red-500">♥</div>

        {/* Image / Placeholder */}
        <div className="relative h-44 overflow-hidden">
          {thumbnailUrl ? (
            <>
              <img
                src={thumbnailUrl}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] via-transparent to-transparent" />
            </>
          ) : (
            <div className={`relative w-full h-full bg-linear-to-br ${colors.gradient} flex items-center justify-center overflow-hidden`}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 text-4xl animate-pulse">♠</div>
                <div className="absolute top-4 right-4 text-4xl animate-pulse delay-100 text-red-300">♥</div>
                <div className="absolute bottom-4 left-4 text-4xl animate-pulse delay-200 text-red-300">♦</div>
                <div className="absolute bottom-4 right-4 text-4xl animate-pulse delay-300">♣</div>
              </div>

              {/* Circular glow behind icon */}
              <div className="absolute w-32 h-32 rounded-full bg-white/10 blur-2xl" />

              {/* Icon container */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
                  <div className="text-white/90">
                    {icon}
                  </div>
                </div>
              </div>

              {/* Bottom gradient fade */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#0f172a] to-transparent" />
            </div>
          )}

          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-3 left-3 z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 blur-md opacity-50 animate-pulse" />
                <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-amber-500 via-yellow-500 to-amber-500 text-amber-900 text-xs font-bold rounded-full shadow-lg">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  Featured
                </div>
              </div>
            </div>
          )}

          {/* RTP Badge */}
          <div className="absolute bottom-3 right-3 z-20">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70 backdrop-blur-md rounded-lg border border-white/10">
              <div className={`w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse`} />
              <span className="text-white text-xs font-medium">RTP: {(rtp * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Hot badge for high RTP */}
          {rtp >= 0.97 && (
            <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-red-500/90 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              Hot
            </div>
          )}

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 blur-lg opacity-50" />
                <button className="relative flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 via-yellow-500 to-amber-500 text-amber-900 rounded-xl font-bold shadow-xl hover:shadow-amber-500/30 transition-shadow">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-4">
          {/* Top glow line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-amber-500/30 to-transparent" />

          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors text-lg leading-tight">
                {name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-linear-to-r ${colors.gradient} text-white`}>
                  {type}
                </span>
              </div>
            </div>
            {/* Mini chip decoration */}
            <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="text-amber-900 text-xs font-bold">$</span>
            </div>
          </div>

          {description && (
            <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
              {description}
            </p>
          )}

          {/* Bet Range */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Min Bet</p>
              <p className="text-sm font-bold text-green-400">${minBet}</p>
            </div>
            <div className="w-px h-8 bg-linear-to-b from-transparent via-gray-600 to-transparent" />
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Max Bet</p>
              <p className="text-sm font-bold text-amber-400">${maxBet}</p>
            </div>
            <div className="w-px h-8 bg-linear-to-b from-transparent via-gray-600 to-transparent" />
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Players</p>
              <p className="text-sm font-bold text-blue-400">{Math.floor(Math.random() * 100) + 20}</p>
            </div>
          </div>
        </div>

        {/* Bottom shine effect on hover */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}
