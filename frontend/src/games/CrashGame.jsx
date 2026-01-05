import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import socketService from '../services/socket';

export default function CrashGame({ gameState, result, isPlaying, onAnimationComplete, showResultInGame }) {
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashed, setCrashed] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const animationCompleteCalledRef = useRef(false);

  useEffect(() => {
    socketService.on('game:crash_tick', (data) => {
      setMultiplier(data.multiplier);
      setCrashed(false);
    });

    socketService.on('game:crash_end', (data) => {
      setCrashed(true);
      setMultiplier(data.crashPoint || multiplier);
    });

    return () => {
      socketService.off('game:crash_tick');
      socketService.off('game:crash_end');
    };
  }, [multiplier]);

  // Reset when isPlaying starts
  useEffect(() => {
    if (isPlaying && !result) {
      setCrashed(false);
      animationCompleteCalledRef.current = false;
    }
  }, [isPlaying, result]);

  // Handle result
  useEffect(() => {
    if (result && isPlaying && !animationCompleteCalledRef.current) {
      animationCompleteCalledRef.current = true;

      // Animate the multiplier to the result
      const targetMultiplier = result.multiplier || result.crashPoint || 1.00;
      let current = 1.00;
      const steps = 30;
      const increment = (targetMultiplier - 1) / steps;

      const interval = setInterval(() => {
        current += increment;
        if (current >= targetMultiplier) {
          clearInterval(interval);
          setMultiplier(targetMultiplier);
          setCrashed(!result.won);

          // Notify parent to show modal (don't show result in game yet)
          setTimeout(() => {
            onAnimationComplete?.();
          }, 600);
        } else {
          setMultiplier(current);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [result, isPlaying, onAnimationComplete]);

  // Store result when showResultInGame becomes true
  useEffect(() => {
    if (showResultInGame && result) {
      setLastResult(result);
    }
  }, [showResultInGame, result]);

  const getMultiplierColor = () => {
    if (crashed || (showResultInGame && lastResult?.won === false)) return 'text-red-400';
    if (showResultInGame && lastResult?.won) return 'text-green-400';
    if (multiplier >= 5) return 'text-purple-400';
    if (multiplier >= 2) return 'text-amber-400';
    return 'text-white';
  };

  const getRingColor = () => {
    if (crashed || (showResultInGame && lastResult?.won === false)) return 'from-red-400 to-red-600';
    if (showResultInGame && lastResult?.won) return 'from-green-400 to-green-600';
    if (multiplier >= 5) return 'from-purple-400 to-purple-600';
    if (multiplier >= 2) return 'from-amber-400 to-amber-600';
    return 'from-amber-400 to-amber-600';
  };

  return (
    <div className="space-y-6">
      {/* Main multiplier display */}
      <div className="text-center py-8">
        <div className="relative inline-block">
          {/* Outer glow */}
          <motion.div
            animate={isPlaying && !crashed ? {
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className={`absolute -inset-4 rounded-full bg-gradient-to-br ${getRingColor()} blur-2xl opacity-30`}
          />

          {/* Main circle */}
          <motion.div
            animate={crashed ? { scale: [1, 0.95, 1] } : isPlaying ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: crashed ? 0.3 : 0.5, repeat: crashed ? 3 : Infinity }}
            className={`relative w-52 h-52 rounded-full bg-gradient-to-br ${getRingColor()} p-1 shadow-2xl mx-auto`}
            style={{
              boxShadow: crashed
                ? '0 0 60px rgba(239, 68, 68, 0.5)'
                : showResultInGame && lastResult?.won
                ? '0 0 60px rgba(34, 197, 94, 0.5)'
                : '0 0 40px rgba(251, 191, 36, 0.4)'
            }}
          >
            <div className="w-full h-full rounded-full bg-[#0f172a] flex flex-col items-center justify-center">
              <motion.span
                key={multiplier}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-6xl font-bold tabular-nums ${getMultiplierColor()}`}
              >
                {multiplier.toFixed(2)}x
              </motion.span>
              {crashed && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm font-bold mt-2"
                >
                  CRASHED!
                </motion.span>
              )}
              {showResultInGame && lastResult?.won && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-sm font-bold mt-2"
                >
                  CASHED OUT!
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Animated rings */}
          {isPlaying && !crashed && !(showResultInGame && lastResult) && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/30 animate-ping" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-full border-2 border-dashed border-amber-500/20"
              />
            </>
          )}
        </div>

        {/* Status text */}
        <motion.p
          animate={isPlaying && !crashed && !(showResultInGame && lastResult) ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-gray-400 mt-6 text-lg"
        >
          {crashed ? '💥 Rocket Crashed!' :
           showResultInGame && lastResult?.won ? '🎉 You Won!' :
           isPlaying ? '🚀 Going up...' :
           gameState?.status === 'betting' ? 'Place your bet and cash out before crash!' :
           'Watch the multiplier rise!'}
        </motion.p>
      </div>

      {/* Graph visualization */}
      <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-6 border border-amber-500/20 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-slate-700/50"
              style={{ top: `${i * 25}%` }}
            >
              <span className="absolute -left-8 -top-2 text-xs text-gray-500">
                {(5 - i) * 2}x
              </span>
            </div>
          ))}
        </div>

        {/* Crash line visualization */}
        <div className="relative h-40">
          <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id="crashLine" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor={crashed ? "#ef4444" : "#fbbf24"} />
              </linearGradient>
              <linearGradient id="crashFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isPlaying ? Math.min(multiplier / 10, 1) : 0.1 }}
              d={`M 0 160 Q ${100 * (multiplier / 10)} ${160 - (multiplier * 15)} ${Math.min(400, multiplier * 40)} ${Math.max(10, 160 - multiplier * 30)} L ${Math.min(400, multiplier * 40)} 160 Z`}
              fill="url(#crashFill)"
            />

            {/* Line */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isPlaying ? Math.min(multiplier / 10, 1) : 0.1 }}
              transition={{ duration: 0.1 }}
              d={`M 0 160 Q ${100 * (multiplier / 10)} ${160 - (multiplier * 15)} ${Math.min(400, multiplier * 40)} ${Math.max(10, 160 - multiplier * 30)}`}
              stroke="url(#crashLine)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {/* Current point */}
            {isPlaying && (
              <motion.circle
                cx={Math.min(400, multiplier * 40)}
                cy={Math.max(10, 160 - multiplier * 30)}
                r="6"
                fill={crashed ? "#ef4444" : "#fbbf24"}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </svg>

          {/* Rocket icon */}
          {isPlaying && !crashed && (
            <motion.div
              className="absolute text-3xl"
              style={{
                left: `${Math.min(90, (multiplier / 10) * 100)}%`,
                bottom: `${Math.min(85, multiplier * 8)}%`,
              }}
              animate={{ rotate: [-15, 15, -15] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              🚀
            </motion.div>
          )}

          {/* Explosion on crash */}
          {crashed && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2, 1.5], opacity: [0, 1, 0.8] }}
              className="absolute text-5xl"
              style={{
                left: `${Math.min(85, (multiplier / 10) * 100)}%`,
                bottom: `${Math.min(80, multiplier * 8)}%`,
              }}
            >
              💥
            </motion.div>
          )}
        </div>
      </div>

      {/* Result display */}
      {showResultInGame && lastResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden text-center p-5 rounded-2xl ${
            lastResult.won
              ? 'bg-gradient-to-r from-green-500/10 via-green-500/20 to-green-500/10 border border-green-500/30'
              : 'bg-gradient-to-r from-red-500/10 via-red-500/20 to-red-500/10 border border-red-500/30'
          }`}
        >
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent ${lastResult.won ? 'via-green-500' : 'via-red-500'} to-transparent`} />
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">{lastResult.won ? '🎉' : '💥'}</span>
            <div>
              <p className={`text-2xl font-bold ${lastResult.won ? 'text-green-400' : 'text-red-400'}`}>
                {lastResult.won ? `You Won $${lastResult.winAmount?.toFixed(2)}!` : 'Crashed!'}
              </p>
              <p className="text-gray-400 text-sm">
                {lastResult.won
                  ? `Cashed out at ${lastResult.multiplier?.toFixed(2)}x`
                  : `Crashed at ${lastResult.crashPoint?.toFixed(2) || multiplier.toFixed(2)}x`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      {!isPlaying && !lastResult && (
        <div className="text-center text-gray-500 text-sm p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <p>Place your bet and watch the multiplier rise!</p>
          <p className="mt-1">Cash out before it crashes to win big.</p>
        </div>
      )}
    </div>
  );
}
