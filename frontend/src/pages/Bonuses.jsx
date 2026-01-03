import { useState } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

export default function Bonuses() {
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('available');

  const bonuses = {
    available: [
      {
        id: 1,
        title: 'Welcome Bonus',
        description: '100% match on your first deposit up to $500',
        type: 'deposit',
        value: '100%',
        maxValue: '$500',
        minDeposit: '$20',
        wagering: '35x',
        expiresIn: '7 days',
        color: 'from-amber-500 to-yellow-600',
        icon: '🎁',
        featured: true,
      },
      {
        id: 2,
        title: 'Daily Reload',
        description: '50% bonus on your daily deposit',
        type: 'deposit',
        value: '50%',
        maxValue: '$100',
        minDeposit: '$10',
        wagering: '25x',
        expiresIn: '24 hours',
        color: 'from-blue-500 to-cyan-600',
        icon: '🔄',
      },
      {
        id: 3,
        title: 'Free Spins Friday',
        description: '100 free spins on selected slots',
        type: 'spins',
        value: '100',
        maxValue: 'Free Spins',
        minDeposit: '$25',
        wagering: '20x',
        expiresIn: '3 days',
        color: 'from-purple-500 to-pink-600',
        icon: '🎰',
      },
      {
        id: 4,
        title: 'Cashback Weekend',
        description: '15% cashback on weekend losses',
        type: 'cashback',
        value: '15%',
        maxValue: '$200',
        minDeposit: 'None',
        wagering: '1x',
        expiresIn: 'Every weekend',
        color: 'from-green-500 to-emerald-600',
        icon: '💸',
      },
      {
        id: 5,
        title: 'High Roller Bonus',
        description: '200% bonus for deposits over $1000',
        type: 'deposit',
        value: '200%',
        maxValue: '$2000',
        minDeposit: '$1000',
        wagering: '40x',
        expiresIn: '14 days',
        color: 'from-indigo-500 to-purple-600',
        icon: '💎',
        vip: true,
      },
    ],
    active: [
      {
        id: 101,
        title: 'Welcome Bonus',
        progress: 65,
        wagered: '$1,300',
        remaining: '$700',
        expires: '5 days left',
        color: 'from-amber-500 to-yellow-600',
      },
    ],
    history: [
      { id: 201, title: 'Daily Reload', amount: '$50', date: '2024-01-15', status: 'completed' },
      { id: 202, title: 'Free Spins', amount: '50 Spins', date: '2024-01-12', status: 'expired' },
      { id: 203, title: 'Cashback', amount: '$35.50', date: '2024-01-08', status: 'completed' },
    ],
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-red-900/30 via-[#0f172a] to-orange-900/30" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-[15%] w-40 h-40 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        {/* Decorative */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[20%] text-6xl opacity-10 animate-bounce" style={{ animationDuration: '3s' }}>🎁</div>
          <div className="absolute top-40 right-[25%] text-5xl opacity-10 animate-bounce" style={{ animationDuration: '4s' }}>💰</div>
          <div className="absolute bottom-20 left-[30%] text-5xl opacity-10 animate-bounce" style={{ animationDuration: '3.5s' }}>🎰</div>
          <div className="absolute bottom-40 right-[20%] text-6xl opacity-10 animate-bounce" style={{ animationDuration: '2.5s' }}>💎</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-red-400 via-orange-500 to-red-600 p-1 shadow-2xl shadow-red-500/30">
                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                    <span className="text-4xl">🎁</span>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Casino <span className="bg-linear-to-r from-red-400 via-orange-500 to-red-400 bg-clip-text text-transparent">Bonuses</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Claim exclusive bonuses and promotions. More ways to win, more reasons to play!
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              { label: 'Active Bonuses', value: '5+', color: 'text-green-400' },
              { label: 'Max Bonus', value: '$2,000', color: 'text-amber-400' },
              { label: 'Free Spins', value: '100+', color: 'text-purple-400' },
            ].map((stat, i) => (
              <div key={i} className="px-6 py-3 rounded-xl bg-[#1e293b]/80 border border-gray-700/50">
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-gray-400 text-sm ml-2">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { id: 'available', label: 'Available', count: bonuses.available.length },
            { id: 'active', label: 'Active', count: bonuses.active.length },
            { id: 'history', label: 'History', count: bonuses.history.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-linear-to-r from-red-500 to-orange-600 text-white'
                  : 'bg-[#1e293b] text-gray-400 hover:bg-[#334155] border border-gray-700'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bonuses.available.map((bonus, index) => (
              <motion.div
                key={bonus.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border bg-linear-to-b from-[#1e293b] to-[#0f172a] ${
                  bonus.featured ? 'border-amber-500/50 md:col-span-2' : 'border-gray-700/50'
                }`}
              >
                {/* Featured badge */}
                {bonus.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-linear-to-r from-amber-500 to-yellow-600 text-[10px] font-bold text-amber-900 uppercase">
                    Featured
                  </div>
                )}

                {/* VIP badge */}
                {bonus.vip && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-linear-to-r from-purple-500 to-indigo-600 text-[10px] font-bold text-white uppercase">
                    VIP Only
                  </div>
                )}

                {/* Top accent */}
                <div className={`h-1 bg-linear-to-r ${bonus.color}`} />

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${bonus.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {bonus.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{bonus.title}</h3>
                      <p className="text-sm text-gray-400">{bonus.description}</p>
                    </div>
                  </div>

                  {/* Value highlight */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-4xl font-black bg-linear-to-r ${bonus.color} bg-clip-text text-transparent`}>
                      {bonus.value}
                    </span>
                    <span className="text-gray-400">up to {bonus.maxValue}</span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="px-3 py-2 rounded-lg bg-[#0f172a] border border-gray-700/50">
                      <p className="text-[10px] text-gray-500 uppercase">Min Deposit</p>
                      <p className="text-sm font-semibold text-white">{bonus.minDeposit}</p>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-[#0f172a] border border-gray-700/50">
                      <p className="text-[10px] text-gray-500 uppercase">Wagering</p>
                      <p className="text-sm font-semibold text-white">{bonus.wagering}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Expires: {bonus.expiresIn}</span>
                    <button className={`px-6 py-2.5 rounded-xl font-semibold bg-linear-to-r ${bonus.color} text-white hover:shadow-lg transition-shadow`}>
                      Claim Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'active' && (
          <div className="space-y-4">
            {bonuses.active.length > 0 ? (
              bonuses.active.map((bonus) => (
                <motion.div
                  key={bonus.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a] p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${bonus.color} flex items-center justify-center text-3xl`}>
                      🎁
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{bonus.title}</h3>

                      {/* Progress bar */}
                      <div className="relative h-3 rounded-full bg-[#0f172a] border border-gray-700/50 overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${bonus.progress}%` }}
                          className={`absolute inset-y-0 left-0 bg-linear-to-r ${bonus.color} rounded-full`}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Wagered: <span className="text-white font-semibold">{bonus.wagered}</span></span>
                        <span className="text-gray-400">Remaining: <span className="text-amber-400 font-semibold">{bonus.remaining}</span></span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{bonus.progress}%</p>
                      <p className="text-xs text-amber-400">{bonus.expires}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🎰</span>
                <p className="text-gray-400">No active bonuses. Claim one from available bonuses!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="overflow-hidden rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
            <div className="divide-y divide-gray-700/50">
              {bonuses.history.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{item.amount}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Terms */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl border border-gray-700/50 bg-[#0f172a]">
          <h3 className="text-lg font-bold text-white mb-4">Bonus Terms & Conditions</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              All bonuses are subject to wagering requirements before withdrawal
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              Maximum bet while bonus is active: $5 per spin/hand
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              Only one bonus can be active at a time
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              Bonuses expire if not used within the specified time period
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
