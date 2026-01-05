import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useGameStore from '../store/gameStore';
import useWalletStore from '../store/walletStore';
import useAuthStore from '../store/authStore';
import socketService from '../services/socket';
import DiceGame from '../games/DiceGame';
import CrashGame from '../games/CrashGame';
import RouletteGame from '../games/RouletteGame';
import SlotsGame from '../games/SlotsGame';
import GameResultModal from '../components/GameResultModal';

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
  const [showResultModal, setShowResultModal] = useState(false);
  const [showResultInGame, setShowResultInGame] = useState(false);

  const handleCloseModal = useCallback(() => {
    setShowResultModal(false);
    setShowResultInGame(true); // Show result in game UI after modal closes
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setIsPlaying(false);
    setShowResultModal(true);
    fetchBalance();
  }, [fetchBalance]);

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

      socketService.on('bet:confirmed', () => {
        setIsPlaying(true);
      });

      socketService.on('game:result', (data) => {
        // Store result but keep playing state for animation
        setResult(data.result);
        // Animation will handle showing result, then we show modal
        // The game component will set isPlaying to false when animation completes
      });

      socketService.on('bet:error', (data) => {
        toast.error(data.message);
        setIsPlaying(false);
      });

      socketService.on('bet:rejected', (data) => {
        toast.error(data.reason || 'Bet was rejected');
        setIsPlaying(false);
      });

      return () => {
        socketService.leaveGame(slug);
        socketService.off('game:joined');
        socketService.off('bet:confirmed');
        socketService.off('game:result');
        socketService.off('bet:error');
        socketService.off('bet:rejected');
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
    setShowResultInGame(false);
    setIsPlaying(true);
    socketService.placeBet(slug, amount, betData);
  };

  const renderGameInterface = () => {
    if (!currentGame) return null;

    switch (currentGame.type) {
      case 'dice':
        return <DiceGame betData={betData} setBetData={setBetData} result={result} isPlaying={isPlaying} onAnimationComplete={handleAnimationComplete} showResultInGame={showResultInGame} />;
      case 'crash':
        return <CrashGame gameState={gameState} result={result} isPlaying={isPlaying} onAnimationComplete={handleAnimationComplete} showResultInGame={showResultInGame} />;
      case 'roulette':
        return <RouletteGame betData={betData} setBetData={setBetData} result={result} isPlaying={isPlaying} onAnimationComplete={handleAnimationComplete} showResultInGame={showResultInGame} />;
      case 'slots':
        return <SlotsGame result={result} isPlaying={isPlaying} onAnimationComplete={handleAnimationComplete} showResultInGame={showResultInGame} />;
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

          {/* Last Result Summary */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative overflow-hidden rounded-2xl p-4 border cursor-pointer hover:scale-[1.02] transition-transform ${
                result.won
                  ? 'border-green-500/30 bg-green-500/10'
                  : 'border-red-500/30 bg-red-500/10'
              }`}
              onClick={() => setShowResultModal(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    result.won ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <span className="text-xl">{result.won ? '🏆' : '😢'}</span>
                  </div>
                  <div>
                    <p className={`font-bold ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                      {result.won ? 'You Won!' : 'You Lost'}
                    </p>
                    <p className="text-xs text-gray-500">Tap to view details</p>
                  </div>
                </div>
                <p className={`text-xl font-bold ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                  {result.won ? `+$${result.winAmount?.toFixed(2)}` : `-$${result.amount?.toFixed(2)}`}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Game Result Modal */}
      <GameResultModal
        isOpen={showResultModal}
        onClose={handleCloseModal}
        result={result}
        gameType={currentGame?.type}
      />
    </div>
  );
}
