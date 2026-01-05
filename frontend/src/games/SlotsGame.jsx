import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Slot symbols with their properties
const SYMBOLS = [
  { id: 'seven', emoji: '7️⃣', name: 'Lucky 7', multiplier: 100, color: 'from-red-500 to-red-700' },
  { id: 'diamond', emoji: '💎', name: 'Diamond', multiplier: 50, color: 'from-cyan-400 to-blue-600' },
  { id: 'crown', emoji: '👑', name: 'Crown', multiplier: 25, color: 'from-amber-400 to-yellow-600' },
  { id: 'bell', emoji: '🔔', name: 'Bell', multiplier: 15, color: 'from-yellow-400 to-amber-600' },
  { id: 'cherry', emoji: '🍒', name: 'Cherry', multiplier: 10, color: 'from-red-400 to-pink-600' },
  { id: 'lemon', emoji: '🍋', name: 'Lemon', multiplier: 5, color: 'from-yellow-300 to-yellow-500' },
  { id: 'orange', emoji: '🍊', name: 'Orange', multiplier: 3, color: 'from-orange-400 to-orange-600' },
  { id: 'grape', emoji: '🍇', name: 'Grape', multiplier: 2, color: 'from-purple-400 to-purple-600' },
];

// Single Reel component
const Reel = ({ isSpinning, finalSymbol, reelIndex, onStop }) => {
  const [displaySymbols, setDisplaySymbols] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const intervalRef = useRef(null);
  const hasStoppedRef = useRef(false);

  // Initialize with random symbols
  useEffect(() => {
    const initialSymbols = [];
    for (let i = 0; i < 5; i++) {
      initialSymbols.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }
    setDisplaySymbols(initialSymbols);
  }, []);

  // Handle spinning
  useEffect(() => {
    if (isSpinning && !spinning) {
      setSpinning(true);
      hasStoppedRef.current = false;

      // Start spinning - rapidly change symbols
      intervalRef.current = setInterval(() => {
        setDisplaySymbols(prev => {
          const newSymbols = [...prev];
          newSymbols.pop();
          newSymbols.unshift(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
          return newSymbols;
        });
      }, 80);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSpinning, spinning]);

  // Handle stop with final symbol
  useEffect(() => {
    if (finalSymbol && spinning && !hasStoppedRef.current) {
      hasStoppedRef.current = true;

      // Stop after delay based on reel index (staggered stop)
      const stopDelay = 800 + reelIndex * 600;

      setTimeout(() => {
        clearInterval(intervalRef.current);

        // Set final symbol in middle position
        setDisplaySymbols(prev => {
          const newSymbols = [...prev];
          newSymbols[2] = finalSymbol;
          // Also update adjacent symbols for visual variety
          newSymbols[1] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          newSymbols[3] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          return newSymbols;
        });

        setSpinning(false);
        onStop?.();
      }, stopDelay);
    }
  }, [finalSymbol, spinning, reelIndex, onStop]);

  return (
    <div className="relative w-24 h-72 overflow-hidden">
      {/* Reel frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-xl border-2 border-amber-500/50">
        {/* Inner area */}
        <div className="absolute inset-1 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden">
          {/* Symbols container */}
          <div className="flex flex-col items-center justify-center h-full">
            {displaySymbols.slice(1, 4).map((symbol, index) => (
              <div
                key={`${symbol.id}-${index}`}
                className={`w-full h-[70px] flex items-center justify-center text-4xl transition-all duration-100 ${
                  index === 1 ? 'scale-125' : 'opacity-40 scale-90'
                }`}
              >
                <span className={spinning ? 'blur-[2px]' : ''}>{symbol.emoji}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Win line indicator */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[72px] pointer-events-none">
          <div className="absolute inset-0 border-y-2 border-amber-400/40" />
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-l-full shadow-lg shadow-amber-500/50" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-10 bg-gradient-to-l from-amber-400 to-amber-600 rounded-r-full shadow-lg shadow-amber-500/50" />
        </div>
      </div>

      {/* Top/bottom shadows */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none rounded-t-xl" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none rounded-b-xl" />
    </div>
  );
};

export default function SlotsGame({ result, isPlaying, onAnimationComplete, showResultInGame }) {
  const [reelSymbols, setReelSymbols] = useState([null, null, null]);
  const [stoppedReels, setStoppedReels] = useState(0);
  const [spinHistory, setSpinHistory] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const animationCompleteCalledRef = useRef(false);

  // Reset when new spin starts
  useEffect(() => {
    if (isPlaying && !result) {
      setStoppedReels(0);
      setReelSymbols([null, null, null]);
      animationCompleteCalledRef.current = false;
    }
  }, [isPlaying, result]);

  // Store result when showResultInGame becomes true
  useEffect(() => {
    if (showResultInGame && result) {
      setLastResult(result);
      // Add to history
      setSpinHistory(prev => [
        {
          reels: result.reels,
          won: result.won,
          multiplier: result.multiplier,
          winAmount: result.winAmount
        },
        ...prev.slice(0, 9)
      ]);
    }
  }, [showResultInGame, result]);

  // Handle result - set final symbols
  useEffect(() => {
    if (result && result.reels && isPlaying) {
      const symbols = result.reels.map(reelResult =>
        SYMBOLS.find(s => s.id === reelResult) || SYMBOLS[0]
      );
      setReelSymbols(symbols);
    }
  }, [result, isPlaying]);

  // Handle reel stop
  const handleReelStop = useCallback((reelIndex) => {
    setStoppedReels(prev => {
      const newCount = prev + 1;

      // All reels stopped - trigger modal (don't show result in game yet)
      if (newCount === 3 && result && !animationCompleteCalledRef.current) {
        animationCompleteCalledRef.current = true;

        // Brief pause then show modal
        setTimeout(() => {
          onAnimationComplete?.();
        }, 400);
      }

      return newCount;
    });
  }, [result, onAnimationComplete]);

  return (
    <div className="space-y-6">
      {/* Slot Machine Frame */}
      <div className="relative">
        {/* Machine background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 via-slate-900 to-amber-900/30 rounded-3xl" />

        {/* Decorative top bar */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-t-2xl shadow-lg">
          <div className="absolute inset-x-0 top-1 h-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full mx-4" />
        </div>

        {/* Lucky 7 Sign */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={isPlaying ? {
              scale: [1, 1.08, 1],
              rotate: [-2, 2, -2]
            } : {
              scale: [1, 1.03, 1],
              rotate: [-1, 1, -1]
            }}
            transition={{ duration: isPlaying ? 0.3 : 2, repeat: Infinity }}
            className="relative"
          >
            <div className={`px-6 py-2 bg-gradient-to-b from-red-500 via-red-600 to-red-700 rounded-lg shadow-lg ${isPlaying ? 'shadow-red-500/70' : 'shadow-red-500/50'}`}>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-yellow-300 drop-shadow-lg">LUCKY</span>
                <span className="text-3xl">7️⃣</span>
              </div>
            </div>
            {/* Animated light bulbs */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  top: i < 3 ? '-4px' : 'auto',
                  bottom: i >= 3 ? '-4px' : 'auto',
                  left: `${(i % 3) * 40 + 15}%`,
                }}
                animate={{
                  backgroundColor: isPlaying
                    ? ['#fbbf24', '#ef4444', '#22c55e', '#fbbf24']
                    : ['#fbbf24', '#ef4444', '#fbbf24'],
                  boxShadow: isPlaying
                    ? ['0 0 10px #fbbf24', '0 0 15px #ef4444', '0 0 15px #22c55e', '0 0 10px #fbbf24']
                    : ['0 0 10px #fbbf24', '0 0 10px #ef4444', '0 0 10px #fbbf24']
                }}
                transition={{ duration: isPlaying ? 0.2 : 0.5, repeat: Infinity, delay: i * 0.08 }}
              />
            ))}
          </motion.div>
        </div>

        {/* Main slot content */}
        <div className="relative pt-10 pb-6 px-6">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-amber-500/50 rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-amber-500/50 rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-amber-500/50 rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-amber-500/50 rounded-br-3xl" />

          {/* Status text */}
          <div className="text-center mb-4">
            <motion.p
              animate={isPlaying ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
              className={`text-lg font-bold ${isPlaying ? 'text-amber-400' : showResultInGame && lastResult ? (lastResult.won ? 'text-green-400' : 'text-red-400') : 'text-gray-400'}`}
            >
              {isPlaying ? '🎰 SPINNING... 🎰' : showResultInGame && lastResult ? (lastResult.won ? '🎉 WINNER! 🎉' : 'Try Again!') : 'Place your bet to spin!'}
            </motion.p>
          </div>

          {/* Reels container */}
          <div className="flex justify-center gap-3 py-4">
            {[0, 1, 2].map((reelIndex) => (
              <Reel
                key={reelIndex}
                isSpinning={isPlaying}
                finalSymbol={reelSymbols[reelIndex]}
                reelIndex={reelIndex}
                onStop={() => handleReelStop(reelIndex)}
              />
            ))}
          </div>

          {/* Win/Loss result shown only after modal closes */}
          {showResultInGame && lastResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none ${lastResult.won ? '' : ''}`}
            >
              <div className={`px-8 py-4 rounded-2xl shadow-2xl border-2 ${
                lastResult.won
                  ? 'bg-green-500/20 border-green-500/50 shadow-green-500/30'
                  : 'bg-red-500/20 border-red-500/50 shadow-red-500/30'
              }`}>
                <p className={`text-3xl font-black text-center ${lastResult.won ? 'text-green-400' : 'text-red-400'}`}>
                  {lastResult.won ? `+$${lastResult.winAmount?.toFixed(2)}` : 'No Win'}
                </p>
                {lastResult.won && (
                  <p className="text-sm font-bold text-green-300 text-center mt-1">
                    {lastResult.multiplier}x
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Side decorations */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-40 bg-gradient-to-r from-amber-700 to-amber-600 rounded-l-xl shadow-inner">
          <div className="absolute inset-y-4 left-1 w-1 bg-amber-400/30 rounded-full" />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-40 bg-gradient-to-l from-amber-700 to-amber-600 rounded-r-xl shadow-inner">
          <div className="absolute inset-y-4 right-1 w-1 bg-amber-400/30 rounded-full" />
        </div>
      </div>

      {/* Paytable */}
      <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-4 border border-amber-500/30">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-sm">📋</span>
          </div>
          <h3 className="text-lg font-bold text-amber-400">Paytable</h3>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {SYMBOLS.map((symbol) => (
            <div
              key={symbol.id}
              className="relative overflow-hidden bg-slate-900/50 rounded-xl p-3 border border-slate-700/50 hover:border-amber-500/50 transition-colors group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${symbol.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative text-center">
                <span className="text-3xl block mb-1">{symbol.emoji}</span>
                <p className="text-xs text-gray-400 truncate">{symbol.name}</p>
                <p className="text-sm font-bold text-amber-400">{symbol.multiplier}x</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-900/50 rounded-xl border border-green-500/20">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-400">Match 3 symbols to win!</span>
            <span className="text-gray-500">|</span>
            <span className="text-amber-400">2 matches = partial win</span>
          </div>
        </div>
      </div>

      {/* Spin History */}
      {spinHistory.length > 0 && (
        <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-4 border border-amber-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <span className="text-xs">🎰</span>
              </div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Recent Spins</h3>
            </div>
            <span className="text-xs text-gray-500">{spinHistory.length} spins</span>
          </div>

          <div className="space-y-2">
            {spinHistory.slice(0, 5).map((spin, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  spin.won
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-slate-800/50 border border-slate-700/30'
                } ${index === 0 ? 'ring-2 ring-amber-500/30' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {spin.reels.map((reelId, i) => {
                      const symbol = SYMBOLS.find(s => s.id === reelId);
                      return (
                        <span key={i} className="text-2xl">{symbol?.emoji || '?'}</span>
                      );
                    })}
                  </div>
                  {spin.won && (
                    <span className="px-2 py-0.5 bg-amber-500/20 rounded text-xs font-bold text-amber-400">
                      {spin.multiplier}x
                    </span>
                  )}
                </div>
                <div className={`font-bold ${spin.won ? 'text-green-400' : 'text-red-400'}`}>
                  {spin.won ? `+$${spin.winAmount?.toFixed(2)}` : 'No Win'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
