import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Confetti particle component
const Particle = ({ index, isWin }) => {
  const colors = isWin
    ? ['#fbbf24', '#f59e0b', '#eab308', '#facc15', '#fde047', '#22c55e', '#4ade80', '#ffffff']
    : ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomX = Math.random() * 500 - 250;
  const randomDelay = Math.random() * 0.5;
  const randomDuration = 2 + Math.random() * 2;
  const randomRotation = Math.random() * 720 - 360;
  const size = Math.random() * 12 + 6;

  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: [0, -150, 500],
        x: [0, randomX * 0.5, randomX],
        opacity: [1, 1, 0],
        rotate: randomRotation,
        scale: [1, 1.2, 0.5]
      }}
      transition={{ duration: randomDuration, delay: randomDelay, ease: "easeOut" }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        backgroundColor: randomColor,
        borderRadius: index % 3 === 0 ? '50%' : index % 3 === 1 ? '0%' : '2px',
        top: '40%',
        left: '50%',
        zIndex: 60,
        boxShadow: `0 0 ${size/2}px ${randomColor}`,
      }}
    />
  );
};

// Realistic Crown SVG
const Crown = ({ className }) => (
  <svg className={className} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Gold metallic gradients */}
      <linearGradient id="goldBase" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fff7cc" />
        <stop offset="15%" stopColor="#ffe066" />
        <stop offset="30%" stopColor="#ffd700" />
        <stop offset="50%" stopColor="#ffb800" />
        <stop offset="70%" stopColor="#e6a200" />
        <stop offset="85%" stopColor="#cc8800" />
        <stop offset="100%" stopColor="#996600" />
      </linearGradient>
      <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fffef0" />
        <stop offset="50%" stopColor="#ffd700" />
        <stop offset="100%" stopColor="#b8860b" />
      </linearGradient>
      <linearGradient id="goldDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#d4a800" />
        <stop offset="100%" stopColor="#8b6914" />
      </linearGradient>
      <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#996600" />
        <stop offset="20%" stopColor="#ffd700" />
        <stop offset="40%" stopColor="#fffacd" />
        <stop offset="60%" stopColor="#ffd700" />
        <stop offset="100%" stopColor="#996600" />
      </linearGradient>

      {/* Ruby gem gradient */}
      <radialGradient id="ruby" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ff6b6b" />
        <stop offset="30%" stopColor="#ee0000" />
        <stop offset="60%" stopColor="#cc0000" />
        <stop offset="100%" stopColor="#660000" />
      </radialGradient>
      <linearGradient id="rubyShine" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* Sapphire gem gradient */}
      <radialGradient id="sapphire" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#87ceeb" />
        <stop offset="30%" stopColor="#4169e1" />
        <stop offset="60%" stopColor="#0000cd" />
        <stop offset="100%" stopColor="#00008b" />
      </radialGradient>

      {/* Emerald gem gradient */}
      <radialGradient id="emerald" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#90ee90" />
        <stop offset="30%" stopColor="#00cc00" />
        <stop offset="60%" stopColor="#008800" />
        <stop offset="100%" stopColor="#004400" />
      </radialGradient>

      {/* Diamond gradient */}
      <radialGradient id="diamond" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#e0e0e0" />
        <stop offset="60%" stopColor="#c0c0c0" />
        <stop offset="100%" stopColor="#a0a0a0" />
      </radialGradient>

      {/* Filters for depth */}
      <filter id="crownShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.5"/>
      </filter>
      <filter id="gemGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="innerShadow">
        <feOffset dx="0" dy="2"/>
        <feGaussianBlur stdDeviation="1" result="offset-blur"/>
        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
        <feFlood floodColor="#000" floodOpacity="0.3" result="color"/>
        <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
        <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
      </filter>
    </defs>

    {/* Crown shadow */}
    <ellipse cx="100" cy="115" rx="70" ry="8" fill="#000" opacity="0.3" />

    {/* Crown base band */}
    <path d="M25 95 L175 95 L175 110 Q100 120 25 110 Z" fill="url(#goldShine)" filter="url(#innerShadow)" />
    <path d="M28 97 L172 97 L172 108 Q100 116 28 108 Z" fill="url(#goldBase)" />

    {/* Crown body */}
    <path d="M30 95 L30 60 L55 75 L80 35 L100 55 L120 35 L145 75 L170 60 L170 95 Z"
          fill="url(#goldBase)" filter="url(#crownShadow)" />

    {/* Crown body overlay for depth */}
    <path d="M35 92 L35 63 L57 76 L80 40 L100 58 L120 40 L143 76 L165 63 L165 92 Z"
          fill="url(#goldHighlight)" opacity="0.6" />

    {/* Crown peaks with orbs */}
    {/* Left peak */}
    <circle cx="80" cy="32" r="10" fill="url(#goldBase)" />
    <circle cx="80" cy="32" r="8" fill="url(#goldHighlight)" />
    <circle cx="77" cy="29" r="3" fill="#fffef0" opacity="0.8" />

    {/* Center peak - tallest */}
    <circle cx="100" cy="20" r="14" fill="url(#goldBase)" />
    <circle cx="100" cy="20" r="11" fill="url(#goldHighlight)" />
    <circle cx="96" cy="16" r="4" fill="#fffef0" opacity="0.9" />

    {/* Right peak */}
    <circle cx="120" cy="32" r="10" fill="url(#goldBase)" />
    <circle cx="120" cy="32" r="8" fill="url(#goldHighlight)" />
    <circle cx="117" cy="29" r="3" fill="#fffef0" opacity="0.8" />

    {/* Decorative arches */}
    <path d="M40 95 Q60 80 80 95" stroke="url(#goldDark)" strokeWidth="3" fill="none" />
    <path d="M80 95 Q100 80 120 95" stroke="url(#goldDark)" strokeWidth="3" fill="none" />
    <path d="M120 95 Q140 80 160 95" stroke="url(#goldDark)" strokeWidth="3" fill="none" />

    {/* Center large sapphire */}
    <ellipse cx="100" cy="75" rx="12" ry="14" fill="url(#sapphire)" filter="url(#gemGlow)" />
    <ellipse cx="96" cy="70" rx="5" ry="6" fill="url(#rubyShine)" />
    <ellipse cx="100" cy="75" rx="12" ry="14" stroke="#4169e1" strokeWidth="1" fill="none" opacity="0.5" />

    {/* Left ruby */}
    <ellipse cx="55" cy="82" rx="9" ry="10" fill="url(#ruby)" filter="url(#gemGlow)" />
    <ellipse cx="52" cy="78" rx="4" ry="4" fill="url(#rubyShine)" />

    {/* Right emerald */}
    <ellipse cx="145" cy="82" rx="9" ry="10" fill="url(#emerald)" filter="url(#gemGlow)" />
    <ellipse cx="142" cy="78" rx="4" ry="4" fill="url(#rubyShine)" />

    {/* Small diamonds on band */}
    <circle cx="70" cy="102" r="4" fill="url(#diamond)" filter="url(#gemGlow)" />
    <circle cx="68" cy="100" r="1.5" fill="#fff" opacity="0.9" />

    <circle cx="100" cy="102" r="5" fill="url(#diamond)" filter="url(#gemGlow)" />
    <circle cx="97" cy="99" r="2" fill="#fff" opacity="0.9" />

    <circle cx="130" cy="102" r="4" fill="url(#diamond)" filter="url(#gemGlow)" />
    <circle cx="128" cy="100" r="1.5" fill="#fff" opacity="0.9" />

    {/* Gold trim details */}
    <path d="M25 95 L175 95" stroke="#fffacd" strokeWidth="1" opacity="0.6" />
    <path d="M30 60 L30 95" stroke="#fffacd" strokeWidth="1" opacity="0.4" />
    <path d="M170 60 L170 95" stroke="#fffacd" strokeWidth="1" opacity="0.4" />
  </svg>
);

// Realistic Shield Frame
const ShieldFrame = ({ isWin }) => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 520" fill="none" preserveAspectRatio="none">
    <defs>
      {/* Win gradients - Rich gold */}
      <linearGradient id="shieldBorderWin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fffef0" />
        <stop offset="20%" stopColor="#ffd700" />
        <stop offset="50%" stopColor="#daa520" />
        <stop offset="80%" stopColor="#b8860b" />
        <stop offset="100%" stopColor="#8b6914" />
      </linearGradient>
      <linearGradient id="shieldInnerWin" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1a1f35" />
        <stop offset="30%" stopColor="#0d1220" />
        <stop offset="70%" stopColor="#0a0f1a" />
        <stop offset="100%" stopColor="#1a1f35" />
      </linearGradient>
      <linearGradient id="shieldGlowWin" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#ffd700" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ffd700" stopOpacity="0.2" />
      </linearGradient>

      {/* Loss gradients - Deep crimson */}
      <linearGradient id="shieldBorderLoss" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6666" />
        <stop offset="20%" stopColor="#dc143c" />
        <stop offset="50%" stopColor="#b22222" />
        <stop offset="80%" stopColor="#8b0000" />
        <stop offset="100%" stopColor="#4a0000" />
      </linearGradient>
      <linearGradient id="shieldInnerLoss" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2a1a1a" />
        <stop offset="30%" stopColor="#1a0d0d" />
        <stop offset="70%" stopColor="#150a0a" />
        <stop offset="100%" stopColor="#2a1a1a" />
      </linearGradient>

      {/* Metallic edge effect */}
      <linearGradient id="metalEdge" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
      </linearGradient>

      {/* Filters */}
      <filter id="shieldShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor={isWin ? "#ffd700" : "#ff0000"} floodOpacity="0.4"/>
      </filter>
      <filter id="innerGlow">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    {/* Outer glow */}
    <path
      d="M200 8 L390 50 L390 290 Q390 420 200 510 Q10 420 10 290 L10 50 Z"
      fill={isWin ? "url(#shieldGlowWin)" : "none"}
      filter="url(#shieldShadow)"
    />

    {/* Main border - thick metallic */}
    <path
      d="M200 12 L385 52 L385 288 Q385 415 200 502 Q15 415 15 288 L15 52 Z"
      fill={isWin ? "url(#shieldBorderWin)" : "url(#shieldBorderLoss)"}
    />

    {/* Inner border highlight */}
    <path
      d="M200 20 L378 58 L378 285 Q378 408 200 493 Q22 408 22 285 L22 58 Z"
      fill="url(#metalEdge)"
      opacity="0.5"
    />

    {/* Inner dark area */}
    <path
      d="M200 28 L372 64 L372 282 Q372 400 200 484 Q28 400 28 282 L28 64 Z"
      fill={isWin ? "url(#shieldInnerWin)" : "url(#shieldInnerLoss)"}
    />

    {/* Decorative inner border line */}
    <path
      d="M200 40 L360 74 L360 276 Q360 388 200 468 Q40 388 40 276 L40 74 Z"
      stroke={isWin ? "#ffd700" : "#dc143c"}
      strokeWidth="1"
      fill="none"
      opacity="0.3"
    />

    {/* Corner ornaments */}
    <circle cx="40" cy="74" r="6" fill={isWin ? "#ffd700" : "#dc143c"} opacity="0.6" />
    <circle cx="360" cy="74" r="6" fill={isWin ? "#ffd700" : "#dc143c"} opacity="0.6" />
    <circle cx="40" cy="74" r="3" fill="#fff" opacity="0.4" />
    <circle cx="360" cy="74" r="3" fill="#fff" opacity="0.4" />
  </svg>
);

// Ornate divider
const OrnamentDivider = ({ isWin }) => (
  <svg className="w-48 h-8" viewBox="0 0 200 40" fill="none">
    <defs>
      <linearGradient id="ornamentGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="20%" stopColor={isWin ? "#b8860b" : "#8b0000"} />
        <stop offset="50%" stopColor={isWin ? "#ffd700" : "#dc143c"} />
        <stop offset="80%" stopColor={isWin ? "#b8860b" : "#8b0000"} />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
    {/* Center diamond */}
    <path d="M100 8 L108 20 L100 32 L92 20 Z" fill={isWin ? "#ffd700" : "#dc143c"} />
    <path d="M100 12 L105 20 L100 28 L95 20 Z" fill={isWin ? "#fffacd" : "#ff6666"} opacity="0.6" />
    {/* Lines */}
    <line x1="10" y1="20" x2="88" y2="20" stroke="url(#ornamentGold)" strokeWidth="2" />
    <line x1="112" y1="20" x2="190" y2="20" stroke="url(#ornamentGold)" strokeWidth="2" />
    {/* Side ornaments */}
    <circle cx="30" cy="20" r="3" fill={isWin ? "#ffd700" : "#dc143c"} opacity="0.6" />
    <circle cx="170" cy="20" r="3" fill={isWin ? "#ffd700" : "#dc143c"} opacity="0.6" />
    {/* Curls */}
    <path d="M45 20 Q50 12 60 15 Q55 20 60 25 Q50 28 45 20" stroke={isWin ? "#daa520" : "#b22222"} strokeWidth="1.5" fill="none" />
    <path d="M155 20 Q150 12 140 15 Q145 20 140 25 Q150 28 155 20" stroke={isWin ? "#daa520" : "#b22222"} strokeWidth="1.5" fill="none" />
  </svg>
);

// Gem component for corners
const Gem = ({ color, size = 16, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <defs>
      <radialGradient id={`gem${color}`} cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor={color === 'ruby' ? '#ff8888' : color === 'sapphire' ? '#88aaff' : color === 'emerald' ? '#88ff88' : '#ffffff'} />
        <stop offset="40%" stopColor={color === 'ruby' ? '#ee0000' : color === 'sapphire' ? '#4444ee' : color === 'emerald' ? '#00cc00' : '#e0e0e0'} />
        <stop offset="100%" stopColor={color === 'ruby' ? '#660000' : color === 'sapphire' ? '#000066' : color === 'emerald' ? '#004400' : '#808080'} />
      </radialGradient>
      <filter id="gemShadow">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={color === 'ruby' ? '#ff0000' : color === 'sapphire' ? '#0000ff' : color === 'emerald' ? '#00ff00' : '#ffffff'} floodOpacity="0.5"/>
      </filter>
    </defs>
    {/* Gem base */}
    <path d="M20 2 L36 14 L30 38 L10 38 L4 14 Z" fill={`url(#gem${color})`} filter="url(#gemShadow)" />
    {/* Facets */}
    <path d="M20 2 L20 20 L36 14 Z" fill="#ffffff" opacity="0.3" />
    <path d="M20 2 L20 20 L4 14 Z" fill="#ffffff" opacity="0.15" />
    {/* Highlight */}
    <ellipse cx="14" cy="12" rx="4" ry="3" fill="#ffffff" opacity="0.7" />
  </svg>
);

export default function GameResultModal({ isOpen, onClose, result, gameType }) {
  const [particles, setParticles] = useState([]);
  const isWin = result?.won;

  useEffect(() => {
    if (isOpen && isWin) {
      setParticles(Array.from({ length: 80 }, (_, i) => i));
    } else {
      setParticles([]);
    }
  }, [isOpen, isWin]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => onClose(), 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const handleClose = useCallback(() => onClose(), [onClose]);

  if (!result) return null;

  const getGameIcon = () => {
    return gameType === 'dice' ? '🎲' : '🎮';
  };

  const getResultDetails = () => {
    if (gameType === 'dice') {
      return (
        <div className="flex items-center justify-center gap-8 mt-4">
          <div className="text-center">
            <p className="text-amber-400/60 text-xs uppercase tracking-[0.2em] font-semibold">Roll</p>
            <p className="text-4xl font-black text-white drop-shadow-lg">{result.roll?.toFixed(2)}</p>
          </div>
          <div className="w-px h-12 bg-linear-to-b from-transparent via-amber-500/50 to-transparent" />
          <div className="text-center">
            <p className="text-amber-400/60 text-xs uppercase tracking-[0.2em] font-semibold">Target</p>
            <p className="text-4xl font-black text-amber-400 drop-shadow-lg">
              {result.condition === 'under' ? '<' : '>'} {result.target}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="relative pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              {/* Confetti */}
              {particles.map((i) => (
                <Particle key={i} index={i} isWin={isWin} />
              ))}

              {/* Outer glow */}
              <div className={`absolute -inset-32 blur-3xl opacity-30 rounded-full ${
                isWin
                  ? 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500'
                  : 'bg-gradient-to-r from-red-700 via-red-500 to-red-700'
              }`} />

              {/* Main container */}
              <div className="relative">
                {/* Crown for WIN */}
                {isWin && (
                  <motion.div
                    initial={{ y: -30, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="absolute -top-24 left-1/2 -translate-x-1/2 z-20"
                  >
                    <Crown className="w-40 h-28 drop-shadow-2xl" />
                  </motion.div>
                )}

                {/* Skull for LOSS */}
                {!isWin && (
                  <motion.div
                    initial={{ y: -30, opacity: 0, rotate: -15 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2 z-20"
                  >
                    <div className="text-7xl filter drop-shadow-2xl">💀</div>
                  </motion.div>
                )}

                {/* Shield frame */}
                <ShieldFrame isWin={isWin} />

                {/* Content */}
                <div className="relative w-[400px] h-[520px] flex flex-col items-center pt-20 px-10 pb-8">

                  {/* Top ornament */}
                  <OrnamentDivider isWin={isWin} />

                  {/* Game icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="mt-2"
                  >
                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-2xl border-2 ${
                      isWin
                        ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 border-yellow-200 shadow-amber-500/60'
                        : 'bg-gradient-to-br from-red-400 via-red-500 to-red-700 border-red-300 shadow-red-500/60'
                    }`}>
                      {getGameIcon()}
                    </div>
                  </motion.div>

                  {/* Result text */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-4"
                  >
                    {isWin ? (
                      <>
                        <h2 className="text-6xl font-black tracking-tight drop-shadow-2xl">
                          <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-600">
                            VICTORY
                          </span>
                        </h2>
                        <p className="text-amber-300 text-lg mt-1 font-bold tracking-[0.3em] uppercase">Royal Triumph</p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-6xl font-black tracking-tight drop-shadow-2xl">
                          <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-200 via-red-400 to-red-700">
                            DEFEATED
                          </span>
                        </h2>
                        <p className="text-red-300 text-lg mt-1 font-bold tracking-[0.3em] uppercase">Rise Again</p>
                      </>
                    )}
                  </motion.div>

                  {/* Game result details */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {getResultDetails()}
                  </motion.div>

                  {/* Amount display */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    className="mt-4 w-full"
                  >
                    {isWin ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/30 to-amber-500/0 rounded-2xl blur-xl" />
                        <div className="relative bg-gradient-to-b from-amber-900/60 to-amber-950/80 rounded-2xl p-5 border border-amber-400/50 shadow-inner">
                          <div className="flex items-center justify-center gap-3 mb-2">
                            <span className="text-3xl">💰</span>
                            <p className="text-amber-300 text-sm uppercase tracking-[0.2em] font-bold">Royal Treasury</p>
                            <span className="text-3xl">💰</span>
                          </div>
                          <motion.p
                            initial={{ scale: 0.5 }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="text-center text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-500 drop-shadow-lg"
                          >
                            +${result.winAmount?.toFixed(2)}
                          </motion.p>
                          {result.multiplier && (
                            <p className="text-center text-amber-400/80 mt-2 text-sm font-medium">
                              Multiplier: <span className="text-amber-200 font-black text-xl">{result.multiplier}x</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="relative bg-gradient-to-b from-red-900/50 to-red-950/70 rounded-2xl p-5 border border-red-500/40 shadow-inner">
                        <p className="text-center text-red-300 text-sm uppercase tracking-[0.2em] font-bold mb-2">Lost in Battle</p>
                        <p className="text-center text-5xl font-black text-red-400 drop-shadow-lg">
                          -${result.amount?.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {/* Bottom ornament */}
                  <div className="mt-3">
                    <OrnamentDivider isWin={isWin} />
                  </div>

                  {/* Action button */}
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05, boxShadow: isWin ? '0 0 40px rgba(255,215,0,0.6)' : '0 0 40px rgba(220,20,60,0.6)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className={`mt-3 px-12 py-4 rounded-xl font-black text-white text-lg transition-all shadow-2xl border-2 ${
                      isWin
                        ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-yellow-300 shadow-amber-500/50'
                        : 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 border-red-400 shadow-red-500/50'
                    }`}
                  >
                    {isWin ? '👑 Claim Victory' : '⚔️ Battle Again'}
                  </motion.button>

                  {/* Royal card suits */}
                  <div className="flex justify-center gap-5 mt-3 opacity-50">
                    <span className="text-2xl text-red-400 drop-shadow">♥</span>
                    <span className="text-2xl text-amber-400 drop-shadow">♠</span>
                    <span className="text-2xl text-red-400 drop-shadow">♦</span>
                    <span className="text-2xl text-amber-400 drop-shadow">♣</span>
                  </div>
                </div>

                {/* Corner gems */}
                <div className="absolute top-24 left-10">
                  <Gem color="ruby" size={20} />
                </div>
                <div className="absolute top-24 right-10">
                  <Gem color="sapphire" size={20} />
                </div>
                <div className="absolute top-1/2 left-6">
                  <Gem color="emerald" size={16} />
                </div>
                <div className="absolute top-1/2 right-6">
                  <Gem color="diamond" size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
