import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

// VIP Level data generator
const generateVIPLevels = () => {
  const levels = [];
  const tierNames = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Elite', 'Legend', 'Mythic', 'Immortal', 'Supreme'];
  const tierColors = [
    { bg: 'from-amber-700 to-amber-900', text: 'text-amber-400', border: 'border-amber-500/30' },
    { bg: 'from-gray-400 to-gray-600', text: 'text-gray-300', border: 'border-gray-400/30' },
    { bg: 'from-yellow-500 to-amber-600', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    { bg: 'from-cyan-400 to-cyan-600', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    { bg: 'from-blue-400 to-blue-600', text: 'text-blue-400', border: 'border-blue-500/30' },
    { bg: 'from-purple-500 to-purple-700', text: 'text-purple-400', border: 'border-purple-500/30' },
    { bg: 'from-orange-500 to-red-600', text: 'text-orange-400', border: 'border-orange-500/30' },
    { bg: 'from-pink-500 to-rose-600', text: 'text-pink-400', border: 'border-pink-500/30' },
    { bg: 'from-indigo-500 to-violet-600', text: 'text-indigo-400', border: 'border-indigo-500/30' },
    { bg: 'from-amber-400 via-yellow-500 to-amber-600', text: 'text-amber-300', border: 'border-amber-400/50' },
  ];

  for (let i = 1; i <= 100; i++) {
    const tierIndex = Math.floor((i - 1) / 10);
    const tier = tierNames[tierIndex];
    const tierColor = tierColors[tierIndex];
    const subLevel = ((i - 1) % 10) + 1;

    // Progressive XP requirements
    const xpRequired = Math.floor(100 * Math.pow(1.15, i));

    // Benefits scale with level
    const cashbackRate = (0.5 + (i * 0.05)).toFixed(2);
    const weeklyBonus = Math.floor(10 + (i * 5));
    const withdrawalLimit = Math.floor(1000 + (i * 100));
    const rakeback = Math.min(50, 5 + (i * 0.45)).toFixed(1);

    levels.push({
      level: i,
      tier,
      subLevel,
      tierColor,
      xpRequired,
      benefits: {
        cashback: `${cashbackRate}%`,
        weeklyBonus: `$${weeklyBonus}`,
        withdrawalLimit: `$${withdrawalLimit.toLocaleString()}`,
        rakeback: `${rakeback}%`,
        prioritySupport: i >= 20,
        personalManager: i >= 50,
        exclusiveEvents: i >= 30,
        customLimits: i >= 70,
        luxuryGifts: i >= 80,
        vipTrips: i >= 90,
      },
    });
  }

  return levels;
};

export default function VIP() {
  const { isAuthenticated } = useAuthStore();
  const [selectedTier, setSelectedTier] = useState(0);
  const [hoveredLevel, setHoveredLevel] = useState(null);

  const vipLevels = useMemo(() => generateVIPLevels(), []);
  const currentLevel = 12; // Demo: user's current level
  const currentXP = 850;
  const nextLevelXP = vipLevels[currentLevel]?.xpRequired || 1000;

  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Elite', 'Legend', 'Mythic', 'Immortal', 'Supreme'];
  const tierColors = [
    'from-amber-700 to-amber-900',
    'from-gray-400 to-gray-600',
    'from-yellow-500 to-amber-600',
    'from-cyan-400 to-cyan-600',
    'from-blue-400 to-blue-600',
    'from-purple-500 to-purple-700',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-violet-600',
    'from-amber-400 via-yellow-500 to-amber-600',
  ];

  const filteredLevels = vipLevels.filter(
    (level) => Math.floor((level.level - 1) / 10) === selectedTier
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-br from-amber-900/30 via-[#0f172a] to-purple-900/30" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-[15%] w-40 h-40 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[20%] text-6xl opacity-5 rotate-12">♠</div>
          <div className="absolute top-40 right-[25%] text-5xl opacity-5 -rotate-12 text-red-500">♥</div>
          <div className="absolute bottom-20 left-[30%] text-5xl opacity-5 rotate-6 text-red-500">♦</div>
          <div className="absolute bottom-40 right-[20%] text-6xl opacity-5 -rotate-6">♣</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* VIP Badge */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-amber-400 via-yellow-500 to-amber-600 p-1 shadow-2xl shadow-amber-500/30">
                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-10 h-10 text-amber-400 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              VIP <span className="bg-linear-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">Club</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              100 exclusive levels of rewards, benefits, and VIP treatment. The more you play, the more you earn.
            </p>
          </motion.div>

          {/* Current Level Card */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                {/* Top glow */}
                <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-linear-to-r from-transparent via-amber-500 to-transparent" />

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/40 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/40 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-500/40 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/40 rounded-br-2xl" />

                <div className="relative p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Level badge */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-linear-to-br from-yellow-500 to-amber-600 p-1">
                        <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-3xl font-black text-amber-400">{currentLevel}</span>
                            <p className="text-[10px] text-amber-400/80 uppercase tracking-wider">Level</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-linear-to-r from-yellow-500 to-amber-600 text-[10px] font-bold text-amber-900 uppercase">
                        Silver II
                      </div>
                    </div>

                    {/* Progress info */}
                    <div className="flex-1 w-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Progress to Level {currentLevel + 1}</span>
                        <span className="text-sm font-bold text-amber-400">{currentXP} / {nextLevelXP} XP</span>
                      </div>

                      {/* Progress bar */}
                      <div className="relative h-4 rounded-full bg-[#0f172a] border border-amber-500/20 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentXP / nextLevelXP) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="absolute inset-y-0 left-0 bg-linear-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-full"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                      </div>

                      {/* Quick stats */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-400">1.1%</p>
                          <p className="text-[10px] text-gray-500 uppercase">Cashback</p>
                        </div>
                        <div className="w-px h-8 bg-gray-700" />
                        <div className="text-center">
                          <p className="text-lg font-bold text-purple-400">$70</p>
                          <p className="text-[10px] text-gray-500 uppercase">Weekly Bonus</p>
                        </div>
                        <div className="w-px h-8 bg-gray-700" />
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-400">10.4%</p>
                          <p className="text-[10px] text-gray-500 uppercase">Rakeback</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Tier Selector */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {tiers.map((tier, index) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(index)}
              className={`shrink-0 snap-center px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                selectedTier === index
                  ? `bg-linear-to-r ${tierColors[index]} text-white shadow-lg`
                  : 'bg-[#1e293b] text-gray-400 hover:bg-[#334155] border border-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{tier}</span>
                <span className="text-xs opacity-70">
                  {index * 10 + 1}-{(index + 1) * 10}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Levels Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {filteredLevels.map((level, index) => (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredLevel(level.level)}
              onMouseLeave={() => setHoveredLevel(null)}
              className={`relative overflow-hidden rounded-xl border transition-all cursor-pointer ${
                level.level <= currentLevel
                  ? `${level.tierColor.border} bg-linear-to-b from-[#1e293b] to-[#0f172a]`
                  : 'border-gray-700/50 bg-[#0f172a]/50'
              } ${hoveredLevel === level.level ? 'scale-105 z-10 shadow-xl' : ''}`}
            >
              {/* Unlocked indicator */}
              {level.level <= currentLevel && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Current level indicator */}
              {level.level === currentLevel && (
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-500 via-emerald-500 to-green-500 animate-pulse" />
              )}

              <div className="p-4">
                {/* Level number */}
                <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${level.tierColor.bg} flex items-center justify-center mb-3 ${
                  level.level > currentLevel ? 'opacity-50' : ''
                }`}>
                  <span className="text-lg font-black text-white">{level.level}</span>
                </div>

                {/* Tier name */}
                <p className={`text-sm font-semibold ${level.level <= currentLevel ? level.tierColor.text : 'text-gray-500'}`}>
                  {level.tier} {level.subLevel}
                </p>

                {/* XP required */}
                <p className="text-xs text-gray-500 mt-1">
                  {level.xpRequired.toLocaleString()} XP
                </p>

                {/* Hover benefits preview */}
                {hoveredLevel === level.level && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 pt-3 border-t border-gray-700/50 space-y-1"
                  >
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Cashback</span>
                      <span className="text-green-400">{level.benefits.cashback}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Rakeback</span>
                      <span className="text-purple-400">{level.benefits.rakeback}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Weekly</span>
                      <span className="text-amber-400">{level.benefits.weeklyBonus}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Exclusive <span className="text-amber-400">Benefits</span>
          </h2>
          <p className="text-gray-400">Unlock incredible rewards as you level up</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Cashback Rewards',
              description: 'Get up to 5.5% cashback on all your bets. Higher levels mean bigger returns.',
              color: 'from-green-500 to-emerald-600',
              unlockLevel: 1,
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              ),
              title: 'Weekly Bonuses',
              description: 'Receive up to $510 in weekly bonuses automatically credited to your account.',
              color: 'from-purple-500 to-violet-600',
              unlockLevel: 1,
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
              title: 'Rakeback',
              description: 'Earn up to 50% rakeback on every game you play. The ultimate VIP perk.',
              color: 'from-blue-500 to-cyan-600',
              unlockLevel: 1,
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ),
              title: 'Priority Support',
              description: '24/7 dedicated support with faster response times for VIP members.',
              color: 'from-amber-500 to-orange-600',
              unlockLevel: 20,
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
              title: 'Personal Manager',
              description: 'Get your own dedicated VIP manager to assist with all your needs.',
              color: 'from-pink-500 to-rose-600',
              unlockLevel: 50,
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'VIP Trips',
              description: 'Exclusive all-expenses-paid trips to luxury destinations worldwide.',
              color: 'from-indigo-500 to-purple-600',
              unlockLevel: 90,
            },
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a] p-6 group hover:border-gray-600 transition-colors"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${benefit.color} flex items-center justify-center mb-4 text-white shadow-lg`}>
                {benefit.icon}
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{benefit.description}</p>

              {/* Unlock level */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-gray-500">
                  Unlocks at Level <span className="text-amber-400 font-semibold">{benefit.unlockLevel}</span>
                </span>
              </div>

              {/* Hover effect */}
              <div className={`absolute inset-0 bg-linear-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-b from-[#1e293b] to-[#0f172a] p-8"
        >
          {/* Background decorations */}
          <div className="absolute top-4 right-4 text-6xl opacity-5">♠</div>
          <div className="absolute bottom-4 left-4 text-5xl opacity-5 text-red-500">♥</div>

          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            How to <span className="text-amber-400">Level Up</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Play Games', desc: 'Every bet you place earns you XP points towards the next level.' },
              { step: '02', title: 'Earn XP', desc: 'Higher stakes mean more XP. Special events offer bonus XP multipliers.' },
              { step: '03', title: 'Unlock Rewards', desc: 'Each level unlocks better rewards, cashback, and exclusive perks.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-amber-500 to-yellow-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-black text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
