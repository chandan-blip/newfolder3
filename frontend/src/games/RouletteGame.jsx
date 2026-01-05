import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Roulette number colors
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const WHEEL_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

const getNumberColor = (num) => {
  if (num === 0 || num === '00') return 'green';
  if (RED_NUMBERS.includes(parseInt(num))) return 'red';
  return 'black';
};

export default function RouletteGame({ setBetData, result, isPlaying, onAnimationComplete, showResultInGame }) {
  const [selectedBet, setSelectedBet] = useState({ type: null, value: null });
  const [recentResults, setRecentResults] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [ballPosition, setBallPosition] = useState(0);
  const animationCompleteCalledRef = useRef(false);
  const spinIntervalRef = useRef(null);

  // Update betData whenever selection changes
  useEffect(() => {
    if (selectedBet.type && selectedBet.value !== null) {
      setBetData({
        betType: selectedBet.type,
        betValue: String(selectedBet.value),
      });
    }
  }, [selectedBet, setBetData]);

  // Start spinning when isPlaying becomes true
  useEffect(() => {
    if (isPlaying && !result) {
      setIsSpinning(true);
      animationCompleteCalledRef.current = false;

      // Start wheel spinning animation
      let rotation = wheelRotation;
      spinIntervalRef.current = setInterval(() => {
        rotation += 15;
        setWheelRotation(rotation);
        setBallPosition(prev => prev + 25);
      }, 50);
    }

    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
    };
  }, [isPlaying, result]);

  // Handle result - continue spinning then slow down and stop
  useEffect(() => {
    if (result && isPlaying && !animationCompleteCalledRef.current) {
      animationCompleteCalledRef.current = true;

      // Continue fast spinning for 1.5 seconds
      setTimeout(() => {
        // Slow down and stop
        if (spinIntervalRef.current) {
          clearInterval(spinIntervalRef.current);
        }

        // Calculate final position based on winning number
        const winningIndex = WHEEL_NUMBERS.indexOf(result.winningNumber);
        const targetRotation = wheelRotation + 720 + (winningIndex * (360 / 37));

        // Animate to final position
        let currentRotation = wheelRotation;
        const slowDownInterval = setInterval(() => {
          const diff = targetRotation - currentRotation;
          if (Math.abs(diff) < 2) {
            clearInterval(slowDownInterval);
            setWheelRotation(targetRotation);
            setIsSpinning(false);

            // Notify parent to show modal (don't show result in game yet)
            setTimeout(() => {
              onAnimationComplete?.();
            }, 600);
          } else {
            currentRotation += diff * 0.1;
            setWheelRotation(currentRotation);
          }
        }, 30);
      }, 1500);
    }
  }, [result, isPlaying, onAnimationComplete, wheelRotation]);

  // Store result and add to history when showResultInGame becomes true
  useEffect(() => {
    if (showResultInGame && result) {
      setLastResult(result);
      if (result.winningNumber !== undefined) {
        setRecentResults(prev => [
          result.winningNumber.toString().padStart(2, '0'),
          ...prev.slice(0, 9)
        ]);
      }
    }
  }, [showResultInGame, result]);

  const selectBet = (type, value) => {
    if (isPlaying) return;
    setSelectedBet({ type, value });
  };

  const isSelected = (type, value) => {
    return selectedBet.type === type && selectedBet.value === value;
  };

  const clearSelection = () => {
    if (isPlaying) return;
    setSelectedBet({ type: null, value: null });
  };

  // Grid numbers arranged in 3 rows (standard roulette layout)
  const row1 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
  const row2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
  const row3 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];

  const renderNumberCell = (num) => {
    const color = getNumberColor(num);
    const selected = isSelected('straight', num);
    const isWinning = showResultInGame && lastResult?.winningNumber === num;
    const bgColor = color === 'red'
      ? 'bg-linear-to-br from-red-600 to-red-700'
      : color === 'green'
      ? 'bg-linear-to-br from-green-600 to-green-700'
      : 'bg-linear-to-br from-slate-700 to-slate-800';

    return (
      <button
        key={num}
        onClick={() => selectBet('straight', num)}
        disabled={isPlaying}
        className={`relative w-9 h-9 sm:w-10 sm:h-10 ${bgColor} rounded-lg font-bold text-white text-sm hover:brightness-125 hover:scale-105 transition-all border-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed ${
          selected ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105' :
          isWinning ? 'border-green-400 ring-2 ring-green-400/50 animate-pulse' :
          'border-amber-500/20'
        }`}
      >
        {num}
        {selected && (
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
            <span className="text-[10px]">✓</span>
          </div>
        )}
      </button>
    );
  };

  const getBetLabel = () => {
    if (!selectedBet.type) return 'Select a bet position';
    const labels = {
      straight: `Number ${selectedBet.value}`,
      column: `Column ${selectedBet.value}`,
      dozen: `Dozen ${selectedBet.value}`,
      red: 'Red',
      black: 'Black',
      even: 'Even',
      odd: 'Odd',
      low: '1-18 (Low)',
      high: '19-36 (High)',
    };
    return labels[selectedBet.type] || `${selectedBet.type}: ${selectedBet.value}`;
  };

  const getPayoutInfo = () => {
    if (!selectedBet.type) return null;
    const payouts = {
      straight: '35:1',
      column: '2:1',
      dozen: '2:1',
      red: '1:1',
      black: '1:1',
      even: '1:1',
      odd: '1:1',
      low: '1:1',
      high: '1:1',
    };
    return payouts[selectedBet.type];
  };

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-600/20 to-amber-500/10 rounded-xl text-amber-400 text-sm border border-amber-500/30 hover:border-amber-400 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Provably Fair
        </button>

        {/* Recent Results */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {recentResults.length > 0 ? (
            recentResults.slice(0, 6).map((num, i) => {
              const color = getNumberColor(parseInt(num));
              const bgColor = color === 'red'
                ? 'from-red-500 to-red-600'
                : color === 'green'
                ? 'from-green-500 to-green-600'
                : 'from-slate-600 to-slate-700';
              return (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full bg-linear-to-br ${bgColor} flex items-center justify-center text-white text-xs font-bold border-2 ${i === 0 ? 'border-amber-400 shadow-lg shadow-amber-500/40' : 'border-amber-500/30'} transition-all`}
                >
                  {num}
                </div>
              );
            })
          ) : (
            <span className="text-gray-500 text-sm">No results yet</span>
          )}
        </div>

        <button
          onClick={clearSelection}
          disabled={isPlaying}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] rounded-xl text-gray-300 text-sm border border-amber-500/20 hover:border-red-500/50 hover:text-red-400 transition-all disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      </div>

      {/* Selected Bet Display */}
      <div className={`p-3 rounded-xl border transition-all ${
        selectedBet.type
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-slate-800/50 border-slate-700/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              selectedBet.type ? 'bg-linear-to-br from-amber-500 to-amber-600' : 'bg-slate-700'
            }`}>
              <span className="text-lg">{selectedBet.type ? '🎯' : '?'}</span>
            </div>
            <div>
              <p className={`font-semibold ${selectedBet.type ? 'text-amber-400' : 'text-gray-400'}`}>
                {isSpinning ? '🎡 Spinning...' : getBetLabel()}
              </p>
              {getPayoutInfo() && !isSpinning && (
                <p className="text-xs text-gray-500">Payout: <span className="text-green-400">{getPayoutInfo()}</span></p>
              )}
            </div>
          </div>
          {selectedBet.type && !isSpinning && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Click "Place Bet" below</p>
            </div>
          )}
        </div>
      </div>

      {/* Betting Grid */}
      <div className={`relative bg-linear-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-4 border border-amber-500/20 overflow-hidden ${isPlaying ? 'opacity-70' : ''}`}>
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-500/30 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/30 rounded-br-2xl" />

        {/* Glow effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />

        <div className="relative flex gap-2 justify-center overflow-x-auto pb-2">
          {/* Zero column */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => selectBet('straight', 0)}
              disabled={isPlaying}
              className={`relative w-9 sm:w-10 h-[124px] bg-linear-to-br from-green-600 to-green-700 rounded-lg font-bold text-white hover:brightness-125 hover:scale-105 transition-all flex items-center justify-center shadow-lg shadow-green-500/20 border-2 disabled:opacity-70 ${
                isSelected('straight', 0) ? 'border-amber-400 ring-2 ring-amber-400/50' :
                showResultInGame && lastResult?.winningNumber === 0 ? 'border-green-400 ring-2 ring-green-400/50 animate-pulse' :
                'border-amber-500/20'
              }`}
            >
              0
              {isSelected('straight', 0) && (
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                  <span className="text-[10px]">✓</span>
                </div>
              )}
            </button>
          </div>

          {/* Main number grid */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-1.5 sm:gap-2">{row1.map(renderNumberCell)}</div>
            <div className="flex gap-1.5 sm:gap-2">{row2.map(renderNumberCell)}</div>
            <div className="flex gap-1.5 sm:gap-2">{row3.map(renderNumberCell)}</div>
          </div>

          {/* 2:1 column bets */}
          <div className="flex flex-col gap-2 shrink-0">
            {[3, 2, 1].map((col) => (
              <button
                key={col}
                onClick={() => selectBet('column', col)}
                disabled={isPlaying}
                className={`relative w-9 sm:w-10 h-9 sm:h-10 bg-linear-to-br from-amber-600/30 to-amber-700/20 rounded-lg font-bold text-xs hover:from-amber-600/50 hover:to-amber-700/40 transition-all border-2 disabled:opacity-70 ${
                  isSelected('column', col) ? 'border-amber-400 text-amber-300 ring-2 ring-amber-400/50' : 'border-amber-500/30 text-amber-400'
                }`}
              >
                2:1
                {isSelected('column', col) && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                    <span className="text-[8px]">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dozen bets */}
        <div className="flex gap-2 mt-3 px-11">
          {[
            { label: '1st 12', value: 1 },
            { label: '2nd 12', value: 2 },
            { label: '3rd 12', value: 3 },
          ].map((bet) => (
            <button
              key={bet.value}
              onClick={() => selectBet('dozen', bet.value)}
              disabled={isPlaying}
              className={`relative flex-1 h-10 bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-lg font-semibold text-sm hover:text-amber-400 hover:border-amber-500/50 transition-all border-2 disabled:opacity-70 ${
                isSelected('dozen', bet.value) ? 'border-amber-400 text-amber-300 ring-2 ring-amber-400/50' : 'border-amber-500/20 text-gray-300'
              }`}
            >
              {bet.label}
              {isSelected('dozen', bet.value) && (
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                  <span className="text-[8px]">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Outside bets */}
        <div className="flex gap-2 mt-2 px-11">
          {[
            { label: '1-18', type: 'low', value: 'low', bg: 'from-slate-700/50 to-slate-800/50' },
            { label: 'Even', type: 'even', value: 'even', bg: 'from-slate-700/50 to-slate-800/50' },
            { label: 'Red', type: 'red', value: 'red', bg: 'from-red-600 to-red-700' },
            { label: 'Black', type: 'black', value: 'black', bg: 'from-slate-700 to-slate-800' },
            { label: 'Odd', type: 'odd', value: 'odd', bg: 'from-slate-700/50 to-slate-800/50' },
            { label: '19-36', type: 'high', value: 'high', bg: 'from-slate-700/50 to-slate-800/50' },
          ].map((bet) => (
            <button
              key={bet.type}
              onClick={() => selectBet(bet.type, bet.value)}
              disabled={isPlaying}
              className={`relative flex-1 h-10 bg-linear-to-br ${bet.bg} rounded-lg font-semibold text-sm hover:brightness-125 transition-all border-2 disabled:opacity-70 ${
                isSelected(bet.type, bet.value) ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-amber-500/20'
              } ${bet.type === 'red' || bet.type === 'black' ? 'text-white' : 'text-gray-300 hover:text-amber-400'}`}
            >
              {bet.label}
              {isSelected(bet.type, bet.value) && (
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                  <span className="text-[8px]">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Roulette Wheel */}
      <div className="relative h-36 sm:h-44 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ rotate: wheelRotation }}
            transition={{ duration: 0.05, ease: "linear" }}
            className="relative"
          >
            <svg width="380" height="190" viewBox="0 0 380 190" className="drop-shadow-2xl">
              <defs>
                <linearGradient id="wheelRim" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <filter id="wheelGlow">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.5"/>
                </filter>
              </defs>

              {/* Outer rim */}
              <ellipse cx="190" cy="190" rx="180" ry="180" fill="url(#wheelRim)" filter="url(#wheelGlow)" />
              <ellipse cx="190" cy="190" rx="170" ry="170" fill="#0f172a" />

              {WHEEL_NUMBERS.slice(0, 17).map((num, i) => {
                const angle = (i * 10.5) - 85;
                const startAngle = (angle - 5) * Math.PI / 180;
                const endAngle = (angle + 5) * Math.PI / 180;
                const innerRadius = 110;
                const outerRadius = 165;
                const cx = 190;
                const cy = 190;

                const x1 = cx + innerRadius * Math.cos(startAngle);
                const y1 = cy + innerRadius * Math.sin(startAngle);
                const x2 = cx + outerRadius * Math.cos(startAngle);
                const y2 = cy + outerRadius * Math.sin(startAngle);
                const x3 = cx + outerRadius * Math.cos(endAngle);
                const y3 = cy + outerRadius * Math.sin(endAngle);
                const x4 = cx + innerRadius * Math.cos(endAngle);
                const y4 = cy + innerRadius * Math.sin(endAngle);

                const color = getNumberColor(num);
                const fill = color === 'red' ? '#dc2626' : color === 'green' ? '#16a34a' : '#1e293b';

                const textRadius = (innerRadius + outerRadius) / 2;
                const textX = cx + textRadius * Math.cos(angle * Math.PI / 180);
                const textY = cy + textRadius * Math.sin(angle * Math.PI / 180);

                return (
                  <g key={num}>
                    <path
                      d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`}
                      fill={fill}
                      stroke="#d97706"
                      strokeWidth="1"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${angle + 90}, ${textX}, ${textY})`}
                    >
                      {num.toString().padStart(2, '0')}
                    </text>
                  </g>
                );
              })}

              {/* Inner circle */}
              <circle cx="190" cy="190" r="105" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
              <circle cx="190" cy="190" r="95" fill="url(#wheelRim)" />
              <circle cx="190" cy="190" r="85" fill="#1e293b" />
            </svg>
          </motion.div>

          {/* Ball indicator */}
          <motion.div
            animate={isSpinning ? {
              rotate: -ballPosition,
              scale: [1, 1.2, 1]
            } : {}}
            transition={{ duration: 0.1 }}
            className="absolute top-4 left-1/2 -translate-x-1/2"
          >
            <div className={`w-4 h-4 rounded-full bg-linear-to-br from-white to-gray-300 shadow-lg ${isSpinning ? 'shadow-white/60' : ''}`} />
          </motion.div>
        </div>

        {/* Spinning indicator text */}
        {isSpinning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500/20 rounded-full"
          >
            <span className="text-amber-400 font-bold text-sm">🎡 SPINNING...</span>
          </motion.div>
        )}

        {/* Decorative chips */}
        <div className="absolute bottom-6 right-4 sm:right-12 w-12 h-8 rounded-full bg-linear-to-br from-green-400 to-green-600 transform rotate-12 opacity-70 shadow-lg" />
        <div className="absolute bottom-10 right-2 sm:right-8 w-10 h-6 rounded-full bg-linear-to-br from-red-400 to-red-600 transform -rotate-6 opacity-70 shadow-lg" />
        <div className="absolute bottom-4 left-4 sm:left-12 w-10 h-6 rounded-full bg-linear-to-br from-amber-400 to-amber-600 transform -rotate-12 opacity-70 shadow-lg" />
      </div>

      {/* Result display */}
      {showResultInGame && lastResult && !isSpinning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden text-center p-5 rounded-2xl ${
            lastResult.won
              ? 'bg-linear-to-r from-green-500/10 via-green-500/20 to-green-500/10 border border-green-500/30'
              : 'bg-linear-to-r from-red-500/10 via-red-500/20 to-red-500/10 border border-red-500/30'
          }`}
        >
          <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent ${lastResult.won ? 'via-green-500' : 'via-red-500'} to-transparent`} />
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">{lastResult.won ? '🎉' : '😔'}</span>
            <p className={`text-2xl font-bold ${lastResult.won ? 'text-green-400' : 'text-red-400'}`}>
              {lastResult.won ? `You Won $${lastResult.winAmount?.toFixed(2)}!` : 'Better luck next time!'}
            </p>
          </div>
          <p className="text-gray-400">
            Winning number:
            <span className={`ml-2 px-3 py-1 rounded-full font-bold ${
              getNumberColor(lastResult.winningNumber) === 'red' ? 'bg-red-600 text-white' :
              getNumberColor(lastResult.winningNumber) === 'green' ? 'bg-green-600 text-white' :
              'bg-slate-700 text-white'
            }`}>
              {lastResult.winningNumber}
            </span>
            <span className="ml-2 capitalize text-gray-500">({lastResult.winningColor})</span>
          </p>
        </motion.div>
      )}

      {/* Instructions */}
      {!selectedBet.type && !lastResult && !isSpinning && (
        <div className="text-center text-gray-500 text-sm">
          <p>Click on a number or betting area to select your bet, then use the "Place Bet" button on the right</p>
        </div>
      )}
    </div>
  );
}
