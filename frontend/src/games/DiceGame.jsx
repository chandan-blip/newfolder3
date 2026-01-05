import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function DiceGame({ setBetData, result, isPlaying, onAnimationComplete, showResultInGame }) {
  const [target, setTarget] = useState(50);
  const [condition, setCondition] = useState('under');
  const [isRolling, setIsRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState([]);
  const [animatedRoll, setAnimatedRoll] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const animationCompleteCalledRef = useRef(false);

  // Calculate stats
  const winChance = condition === 'under' ? target : 100 - target;
  const houseEdge = 1; // 1%
  const multiplier = ((100 - houseEdge) / winChance).toFixed(4);
  const profitOnWin = (parseFloat(multiplier) - 1).toFixed(4);

  // Update betData for parent component
  useEffect(() => {
    setBetData({
      target: parseInt(target),
      condition,
    });
  }, [target, condition, setBetData]);

  // Start rolling animation when isPlaying becomes true
  useEffect(() => {
    if (isPlaying && !result) {
      setIsRolling(true);
      animationCompleteCalledRef.current = false;

      // Start the rolling number animation
      const interval = setInterval(() => {
        setAnimatedRoll((Math.random() * 100).toFixed(2));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isPlaying, result]);

  // Handle result - continue animation then trigger modal
  useEffect(() => {
    if (result && isPlaying && !animationCompleteCalledRef.current) {
      animationCompleteCalledRef.current = true;

      // Continue animation for 1.5 more seconds after result arrives
      let count = 0;
      const interval = setInterval(() => {
        setAnimatedRoll((Math.random() * 100).toFixed(2));
        count++;
        if (count > 30) { // ~1.5 seconds at 50ms interval
          clearInterval(interval);
          setAnimatedRoll(result.roll?.toFixed(2));
          setIsRolling(false);

          // Trigger modal immediately (don't show result in game yet)
          setTimeout(() => {
            onAnimationComplete?.();
          }, 200);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [result, isPlaying, onAnimationComplete]);

  // Store result and add to history when showResultInGame becomes true
  useEffect(() => {
    if (showResultInGame && result) {
      setLastResult(result);
      if (result.roll !== undefined) {
        setRollHistory(prev => [
          { roll: result.roll, won: result.won, target: result.target, condition: result.condition },
          ...prev.slice(0, 19)
        ]);
      }
    }
  }, [showResultInGame, result]);

  // Quick bet presets
  const presets = [
    { label: '10%', chance: 10 },
    { label: '25%', chance: 25 },
    { label: '50%', chance: 50 },
    { label: '75%', chance: 75 },
    { label: '90%', chance: 90 },
  ];

  const applyPreset = (chance) => {
    if (condition === 'under') {
      setTarget(chance);
    } else {
      setTarget(100 - chance);
    }
  };

  const getSliderBackground = () => {
    const percentage = target;
    if (condition === 'under') {
      return `linear-gradient(to right, #22c55e 0%, #22c55e ${percentage}%, #ef4444 ${percentage}%, #ef4444 100%)`;
    } else {
      return `linear-gradient(to right, #ef4444 0%, #ef4444 ${percentage}%, #22c55e ${percentage}%, #22c55e 100%)`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Display */}
      <div className="relative">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-linear-to-b from-amber-500/5 to-transparent rounded-3xl" />

        <div className="relative text-center py-8">
          {/* Dice Icon */}
          <div className="flex justify-center mb-4">
            <motion.div
              animate={isRolling ? {
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              } : {}}
              transition={isRolling ? {
                rotate: { duration: 0.5, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.3, repeat: Infinity }
              } : {}}
              className="relative"
            >
              <div className={`w-20 h-20 bg-linear-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl shadow-2xl flex items-center justify-center transform ${isRolling ? '' : 'rotate-12 hover:rotate-0'} transition-transform duration-300 ${isRolling ? 'shadow-amber-500/60' : 'shadow-amber-500/40'}`}>
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                  <motion.div
                    animate={isRolling ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 0.2, repeat: Infinity }}
                    className="grid grid-cols-2 gap-1.5"
                  >
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                  </motion.div>
                </div>
              </div>
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl blur-xl -z-10 transition-all ${isRolling ? 'bg-amber-500/50 scale-125' : 'bg-amber-500/30'}`} />
            </motion.div>
          </div>

          {/* Roll Result Display */}
          <div className="relative inline-block">
            <motion.div
              animate={isRolling ? {
                boxShadow: ['0 0 20px rgba(251, 191, 36, 0.4)', '0 0 40px rgba(251, 191, 36, 0.6)', '0 0 20px rgba(251, 191, 36, 0.4)']
              } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
              className={`relative overflow-hidden rounded-2xl p-1 ${
                showResultInGame && lastResult?.won === true ? 'bg-linear-to-br from-green-400 to-green-600' :
                showResultInGame && lastResult?.won === false ? 'bg-linear-to-br from-red-400 to-red-600' :
                'bg-linear-to-br from-amber-400 via-yellow-500 to-amber-600'
              } shadow-2xl ${showResultInGame && lastResult?.won === true ? 'shadow-green-500/40' : showResultInGame && lastResult?.won === false ? 'shadow-red-500/40' : 'shadow-amber-500/40'}`}
            >
              <div className="bg-[#0f172a] rounded-xl px-12 py-6">
                <motion.span
                  key={animatedRoll}
                  initial={isRolling ? { y: -20, opacity: 0 } : {}}
                  animate={{ y: 0, opacity: 1 }}
                  className={`text-6xl font-bold tabular-nums ${
                    isRolling ? 'text-amber-400' :
                    showResultInGame && lastResult?.won === true ? 'text-green-400' :
                    showResultInGame && lastResult?.won === false ? 'text-red-400' :
                    'text-white'
                  }`}
                >
                  {isRolling ? animatedRoll : (showResultInGame && lastResult?.roll?.toFixed(2)) || '--'}
                </motion.span>
              </div>
            </motion.div>

            {/* Win/Loss Badge */}
            {showResultInGame && lastResult && !isRolling && (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-sm font-bold ${
                  lastResult.won ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                } shadow-lg`}
              >
                {lastResult.won ? 'WIN!' : 'LOSE'}
              </motion.div>
            )}
          </div>

          <motion.p
            animate={isRolling ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-gray-400 mt-4 text-sm"
          >
            {isRolling ? '🎲 Rolling... 🎲' : 'Roll Result'}
          </motion.p>
        </div>
      </div>

      {/* Slider Section */}
      <div className="relative bg-linear-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-6 border border-amber-500/20">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-500/30 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-500/30 rounded-br-2xl" />

        {/* Target Display */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Target:</span>
            <span className="text-2xl font-bold text-amber-400">{target.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Roll {condition}</span>
            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
              condition === 'under' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {condition === 'under' ? `< ${target}` : `> ${target}`}
            </span>
          </div>
        </div>

        {/* Visual Range Display */}
        <div className="relative mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>

          {/* Custom Slider Track */}
          <div className="relative h-12 rounded-xl overflow-hidden">
            <div
              className="absolute inset-0 rounded-xl"
              style={{ background: getSliderBackground() }}
            />

            {/* Slider */}
            <input
              type="range"
              min="2"
              max="98"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value))}
              disabled={isPlaying}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
            />

            {/* Target Line Indicator */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg shadow-white/50 transition-all duration-100"
              style={{ left: `${target}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
            </div>

            {/* Zone Labels */}
            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
              <span className={`font-bold text-sm ${condition === 'under' ? 'text-white' : 'text-white/70'}`}>
                {condition === 'under' ? 'WIN' : 'LOSE'}
              </span>
              <span className={`font-bold text-sm ${condition === 'over' ? 'text-white' : 'text-white/70'}`}>
                {condition === 'over' ? 'WIN' : 'LOSE'}
              </span>
            </div>
          </div>
        </div>

        {/* Condition Toggle Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setCondition('under')}
            disabled={isPlaying}
            className={`flex-1 relative py-4 rounded-xl font-bold text-lg transition-all overflow-hidden disabled:opacity-50 ${
              condition === 'under'
                ? 'text-white shadow-lg shadow-green-500/30 scale-[1.02]'
                : 'text-gray-400 bg-[#0f172a] border border-gray-700 hover:border-green-500/50'
            }`}
          >
            {condition === 'under' && (
              <div className="absolute inset-0 bg-linear-to-r from-green-500 to-green-600" />
            )}
            <span className="relative flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Roll Under
            </span>
          </button>
          <button
            onClick={() => setCondition('over')}
            disabled={isPlaying}
            className={`flex-1 relative py-4 rounded-xl font-bold text-lg transition-all overflow-hidden disabled:opacity-50 ${
              condition === 'over'
                ? 'text-white shadow-lg shadow-red-500/30 scale-[1.02]'
                : 'text-gray-400 bg-[#0f172a] border border-gray-700 hover:border-red-500/50'
            }`}
          >
            {condition === 'over' && (
              <div className="absolute inset-0 bg-linear-to-r from-red-500 to-red-600" />
            )}
            <span className="relative flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Roll Over
            </span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Quick Win Chance</p>
          <div className="flex gap-2">
            {presets.map((preset) => (
              <button
                key={preset.chance}
                onClick={() => applyPreset(preset.chance)}
                disabled={isPlaying}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                  winChance === preset.chance
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#0f172a] rounded-xl p-4 text-center border border-amber-500/20 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-linear-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mb-1">Win Chance</p>
            <p className="text-xl font-bold text-amber-400">{winChance.toFixed(2)}%</p>
          </div>

          <div className="bg-[#0f172a] rounded-xl p-4 text-center border border-green-500/20 hover:border-green-500/40 transition-colors">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-linear-to-br from-green-400/20 to-green-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mb-1">Multiplier</p>
            <p className="text-xl font-bold text-green-400">{multiplier}x</p>
          </div>

          <div className="bg-[#0f172a] rounded-xl p-4 text-center border border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-linear-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mb-1">Profit on Win</p>
            <p className="text-xl font-bold text-purple-400">+{profitOnWin}x</p>
          </div>
        </div>
      </div>

      {/* Roll History */}
      {rollHistory.length > 0 && (
        <div className="bg-linear-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-4 border border-amber-500/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Rolls</h3>
            <span className="text-xs text-gray-500">{rollHistory.length} rolls</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {rollHistory.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  item.won
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                } ${index === 0 ? 'ring-2 ring-amber-500/50 scale-105' : ''}`}
              >
                {item.roll.toFixed(2)}
                {index === 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!lastResult && rollHistory.length === 0 && !isPlaying && (
        <div className="text-center text-gray-500 text-sm p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <p>Set your target and choose to roll under or over.</p>
          <p className="mt-1">Then click "Place Bet" on the right to roll!</p>
        </div>
      )}
    </div>
  );
}
