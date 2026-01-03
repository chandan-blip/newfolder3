import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useGameStore from '../store/gameStore';
import useWalletStore from '../store/walletStore';
import useAuthStore from '../store/authStore';
import socketService from '../services/socket';

export default function GamePlay() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentGame, fetchGame, isLoading } = useGameStore();
  const { balance, fetchBalance } = useWalletStore();
  const { isAuthenticated } = useAuthStore();

  const [betAmount, setBetAmount] = useState('1');
  const [betData, setBetData] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState(null);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    fetchGame(slug);
    if (isAuthenticated) {
      fetchBalance();
    }
  }, [slug, fetchGame, fetchBalance, isAuthenticated]);

  useEffect(() => {
    if (currentGame && isAuthenticated) {
      const token = localStorage.getItem('accessToken');
      socketService.connect(token);
      socketService.joinGame(slug);

      socketService.on('game:joined', (data) => {
        setGameState(data.state);
      });

      socketService.on('bet:confirmed', (data) => {
        setIsPlaying(true);
      });

      socketService.on('game:result', (data) => {
        setResult(data.result);
        setIsPlaying(false);
        fetchBalance();
      });

      socketService.on('bet:error', (data) => {
        toast.error(data.message);
        setIsPlaying(false);
      });

      return () => {
        socketService.leaveGame(slug);
        socketService.off('game:joined');
        socketService.off('bet:confirmed');
        socketService.off('game:result');
        socketService.off('bet:error');
      };
    }
  }, [currentGame, isAuthenticated, slug, fetchBalance]);

  const handleBet = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/games/${slug}` } } });
      return;
    }

    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bet amount');
      return;
    }

    if (amount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (amount < currentGame.minBet) {
      toast.error(`Minimum bet is $${currentGame.minBet}`);
      return;
    }

    if (amount > currentGame.maxBet) {
      toast.error(`Maximum bet is $${currentGame.maxBet}`);
      return;
    }

    setResult(null);
    socketService.placeBet(slug, amount, betData);
  };

  const renderGameInterface = () => {
    if (!currentGame) return null;

    switch (currentGame.type) {
      case 'dice':
        return <DiceGame betData={betData} setBetData={setBetData} result={result} />;
      case 'crash':
        return <CrashGame gameState={gameState} result={result} />;
      case 'roulette':
        return <RouletteGame betData={betData} setBetData={setBetData} result={result} />;
      default:
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-gray-600 to-gray-700 flex items-center justify-center">
              <span className="text-3xl">🎮</span>
            </div>
            <p className="text-gray-400">Game type not supported yet</p>
          </div>
        );
    }
  };

  if (isLoading || !currentGame) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30" />
            <div className="absolute inset-1 rounded-lg bg-[#1e293b] flex items-center justify-center">
              <span className="text-2xl">
                {currentGame.type === 'dice' && '🎲'}
                {currentGame.type === 'crash' && '📈'}
                {currentGame.type === 'roulette' && '🎡'}
                {currentGame.type === 'slots' && '🎰'}
                {!['dice', 'crash', 'roulette', 'slots'].includes(currentGame.type) && '🎮'}
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{currentGame.name}</h1>
            <p className="text-gray-400">{currentGame.description}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-amber-500/20"
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-amber-500/30 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amber-500/30 rounded-br-2xl" />

          <div className="relative">
            {renderGameInterface()}
          </div>
        </motion.div>

        {/* Bet Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Balance */}
          {isAuthenticated && (
            <div className="relative overflow-hidden bg-[#1e293b] rounded-2xl p-4 border border-green-500/20">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-green-500 to-transparent" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-white font-bold">$</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Your Balance</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bet Amount */}
          <div className="relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-amber-500/20">
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-amber-500 to-transparent" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-white text-sm">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-white">Place Bet</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-400/80 mb-2 uppercase tracking-wider">
                  Bet Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-amber-500 font-bold">$</span>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    min={currentGame.minBet}
                    max={currentGame.maxBet}
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-[#0f172a] border-2 border-amber-500/30 rounded-xl text-xl text-white font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '/2', action: () => setBetAmount((prev) => (parseFloat(prev) / 2).toFixed(2)) },
                  { label: 'x2', action: () => setBetAmount((prev) => (parseFloat(prev) * 2).toFixed(2)) },
                  { label: 'Min', action: () => setBetAmount(currentGame.minBet.toString()) },
                  { label: 'Max', action: () => setBetAmount(Math.min(balance, currentGame.maxBet).toString()) },
                ].map((btn, i) => (
                  <button
                    key={i}
                    onClick={btn.action}
                    className="relative py-2 rounded-lg font-medium text-gray-300 overflow-hidden group transition-all hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-800 group-hover:from-amber-600 group-hover:to-amber-700 transition-all" />
                    <div className="absolute inset-0.5 rounded-lg bg-[#1e293b] group-hover:bg-amber-600/20" />
                    <span className="relative group-hover:text-white">{btn.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleBet}
                disabled={isPlaying}
                className="w-full relative py-4 rounded-xl font-bold text-lg text-white overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
              >
                <div className="absolute inset-0 bg-linear-to-r from-amber-500 via-yellow-500 to-amber-500" />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  {isPlaying ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Playing...
                    </>
                  ) : isAuthenticated ? (
                    <>
                      <span className="text-xl">🎲</span>
                      Place Bet
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login to Play
                    </>
                  )}
                </span>
              </button>

              <p className="text-xs text-amber-400/60 text-center">
                Min: ${currentGame.minBet} | Max: ${currentGame.maxBet}
              </p>
            </div>
          </div>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative overflow-hidden rounded-2xl p-6 border ${
                result.won
                  ? 'border-green-500/30 bg-green-500/10'
                  : 'border-red-500/30 bg-red-500/10'
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent ${
                result.won ? 'via-green-500' : 'via-red-500'
              } to-transparent`} />

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-linear-to-br flex items-center justify-center ${
                  result.won ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'
                }">
                  <span className="text-3xl">{result.won ? '🏆' : '😢'}</span>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                  {result.won ? 'You Won!' : 'You Lost'}
                </h3>
                {result.won && (
                  <p className="text-3xl font-bold text-green-400">
                    +${result.winAmount?.toFixed(2)}
                  </p>
                )}
                {result.multiplier && (
                  <p className="text-gray-400 mt-2">
                    Multiplier: <span className="text-amber-400 font-bold">{result.multiplier}x</span>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Dice Game Component
function DiceGame({ betData, setBetData, result }) {
  const [target, setTarget] = useState(50);
  const [condition, setCondition] = useState('under');

  useEffect(() => {
    setBetData({ target, condition });
  }, [target, condition, setBetData]);

  const winChance = condition === 'under' ? target : 100 - target;
  const multiplier = (99 / winChance).toFixed(4);

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 p-1 shadow-xl shadow-amber-500/30 mx-auto">
            <div className="w-full h-full rounded-xl bg-[#0f172a] flex items-center justify-center">
              <span className="text-5xl font-bold text-white">
                {result ? result.roll?.toFixed(2) : '--'}
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-400 mt-4">Roll Result</p>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-amber-400 font-medium">Target: {target}</span>
          <span className="text-gray-400">Roll {condition}</span>
        </div>
        <input
          type="range"
          min="1"
          max="98"
          value={target}
          onChange={(e) => setTarget(parseInt(e.target.value))}
          className="w-full h-3 bg-[#0f172a] rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setCondition('under')}
          className={`flex-1 relative py-4 rounded-xl font-bold transition-all overflow-hidden ${
            condition === 'under'
              ? 'text-white shadow-lg shadow-green-500/30'
              : 'text-gray-400 bg-[#0f172a] border border-gray-700'
          }`}
        >
          {condition === 'under' && (
            <div className="absolute inset-0 bg-linear-to-r from-green-500 to-green-600" />
          )}
          <span className="relative">Roll Under {target}</span>
        </button>
        <button
          onClick={() => setCondition('over')}
          className={`flex-1 relative py-4 rounded-xl font-bold transition-all overflow-hidden ${
            condition === 'over'
              ? 'text-white shadow-lg shadow-red-500/30'
              : 'text-gray-400 bg-[#0f172a] border border-gray-700'
          }`}
        >
          {condition === 'over' && (
            <div className="absolute inset-0 bg-linear-to-r from-red-500 to-red-600" />
          )}
          <span className="relative">Roll Over {target}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0f172a] rounded-xl p-4 text-center border border-amber-500/20">
          <p className="text-sm text-gray-400 mb-1">Win Chance</p>
          <p className="text-2xl font-bold text-amber-400">{winChance}%</p>
        </div>
        <div className="bg-[#0f172a] rounded-xl p-4 text-center border border-green-500/20">
          <p className="text-sm text-gray-400 mb-1">Multiplier</p>
          <p className="text-2xl font-bold text-green-400">{multiplier}x</p>
        </div>
      </div>
    </div>
  );
}

// Crash Game Component
function CrashGame({ gameState, result }) {
  const [multiplier, setMultiplier] = useState(1.00);

  useEffect(() => {
    socketService.on('game:crash_tick', (data) => {
      setMultiplier(data.multiplier);
    });

    socketService.on('game:crash_end', (data) => {
      setMultiplier(1.00);
    });

    return () => {
      socketService.off('game:crash_tick');
      socketService.off('game:crash_end');
    };
  }, []);

  return (
    <div className="text-center py-12">
      <div className="relative inline-block">
        <div className="w-48 h-48 rounded-full bg-linear-to-br from-amber-400 to-amber-600 p-1 shadow-xl shadow-amber-500/30 mx-auto">
          <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
            <span className="text-6xl font-bold text-white">
              {multiplier.toFixed(2)}x
            </span>
          </div>
        </div>
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-full border-4 border-amber-500/30 animate-ping" />
      </div>
      <p className="text-gray-400 mt-6">
        {gameState?.status === 'betting' ? 'Waiting for bets...' : 'Multiplier rising!'}
      </p>
    </div>
  );
}

// Roulette Game Component
function RouletteGame({ betData, setBetData, result }) {
  const [betType, setBetType] = useState('red');

  useEffect(() => {
    setBetData({ betType, betValue: betType });
  }, [betType, setBetData]);

  const betOptions = [
    { value: 'red', label: 'Red', color: 'from-red-500 to-red-600', border: 'border-red-500/30' },
    { value: 'black', label: 'Black', color: 'from-gray-700 to-gray-800', border: 'border-gray-500/30' },
    { value: 'green', label: 'Green (0)', color: 'from-green-500 to-green-600', border: 'border-green-500/30' },
    { value: 'even', label: 'Even', color: 'from-blue-500 to-blue-600', border: 'border-blue-500/30' },
    { value: 'odd', label: 'Odd', color: 'from-purple-500 to-purple-600', border: 'border-purple-500/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="relative inline-block">
          <div
            className={`w-32 h-32 rounded-full p-1 shadow-xl mx-auto ${
              result?.winningColor === 'red'
                ? 'bg-linear-to-br from-red-500 to-red-600 shadow-red-500/30'
                : result?.winningColor === 'black'
                ? 'bg-linear-to-br from-gray-700 to-gray-800 shadow-gray-500/30'
                : result?.winningColor === 'green'
                ? 'bg-linear-to-br from-green-500 to-green-600 shadow-green-500/30'
                : 'bg-linear-to-br from-amber-400 to-amber-600 shadow-amber-500/30'
            }`}
          >
            <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {result ? result.winningNumber : '?'}
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-400 mt-4">
          {result ? `${result.winningColor} ${result.winningNumber}` : 'Place your bet'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {betOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setBetType(option.value)}
            className={`relative py-4 rounded-xl font-bold transition-all overflow-hidden ${
              betType === option.value
                ? 'text-white shadow-lg ring-2 ring-amber-500'
                : `text-gray-300 bg-[#0f172a] border ${option.border} hover:opacity-80`
            }`}
          >
            {betType === option.value && (
              <div className={`absolute inset-0 bg-linear-to-br ${option.color}`} />
            )}
            <span className="relative">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
