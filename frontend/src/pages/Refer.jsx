import { useState } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

export default function Refer() {
  const { isAuthenticated, user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode || 'CASINO2024';
  const referralLink = `https://casino.com/ref/${referralCode}`;

  // Demo stats
  const stats = {
    totalReferrals: 24,
    activeReferrals: 18,
    pendingEarnings: 156.50,
    totalEarnings: 1247.80,
    tier: 'Gold',
    commissionRate: 30,
  };

  const recentReferrals = [
    { username: 'Player***42', date: '2 hours ago', status: 'active', earned: '$45.20' },
    { username: 'Lucky***88', date: '1 day ago', status: 'active', earned: '$32.50' },
    { username: 'High***er', date: '3 days ago', status: 'pending', earned: '$0.00' },
    { username: 'Mega***in', date: '5 days ago', status: 'active', earned: '$78.30' },
    { username: 'Star***77', date: '1 week ago', status: 'active', earned: '$23.80' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tiers = [
    { name: 'Bronze', referrals: 0, commission: 20, color: 'from-amber-700 to-amber-900' },
    { name: 'Silver', referrals: 5, commission: 25, color: 'from-gray-400 to-gray-600' },
    { name: 'Gold', referrals: 15, commission: 30, color: 'from-yellow-500 to-amber-600' },
    { name: 'Platinum', referrals: 30, commission: 35, color: 'from-cyan-400 to-cyan-600' },
    { name: 'Diamond', referrals: 50, commission: 40, color: 'from-blue-400 to-purple-600' },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-green-900/30 via-[#0f172a] to-emerald-900/30" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-green-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-[15%] w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[20%] text-6xl opacity-5">💰</div>
          <div className="absolute top-40 right-[25%] text-5xl opacity-5">🎁</div>
          <div className="absolute bottom-20 left-[30%] text-5xl opacity-5">💎</div>
          <div className="absolute bottom-40 right-[20%] text-6xl opacity-5">🚀</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Badge */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-green-400 via-emerald-500 to-green-600 p-1 shadow-2xl shadow-green-500/30">
                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Refer & <span className="bg-linear-to-r from-green-400 via-emerald-500 to-green-400 bg-clip-text text-transparent">Earn</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Invite friends and earn up to 40% commission on their gaming activity. Unlimited earnings potential!
            </p>
          </motion.div>

          {/* Referral Link Card */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative overflow-hidden rounded-2xl border border-green-500/30 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-linear-to-r from-transparent via-green-500 to-transparent" />

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Your Referral Link
                  </h3>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 px-4 py-3 bg-[#0f172a] border border-gray-700 rounded-xl text-white text-sm focus:outline-none"
                    />
                    <button
                      onClick={handleCopy}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-linear-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30'
                      }`}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-sm text-gray-400">Share via:</span>
                    <div className="flex gap-2">
                      {['Twitter', 'Telegram', 'WhatsApp'].map((platform) => (
                        <button
                          key={platform}
                          className="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-gray-700 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {[
                { label: 'Total Referrals', value: stats.totalReferrals, icon: '👥', color: 'from-blue-500 to-blue-600' },
                { label: 'Active Referrals', value: stats.activeReferrals, icon: '✓', color: 'from-green-500 to-green-600' },
                { label: 'Pending', value: `$${stats.pendingEarnings}`, icon: '⏳', color: 'from-amber-500 to-amber-600' },
                { label: 'Total Earned', value: `$${stats.totalEarnings}`, icon: '💰', color: 'from-purple-500 to-purple-600' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a] p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${stat.color} flex items-center justify-center text-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Commission <span className="text-green-400">Tiers</span>
          </h2>
          <p className="text-gray-400">Earn more as you refer more players</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl border p-6 text-center ${
                tier.name === stats.tier
                  ? 'border-green-500/50 bg-linear-to-b from-green-500/10 to-[#0f172a]'
                  : 'border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]'
              }`}
            >
              {tier.name === stats.tier && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-green-500 text-[10px] font-bold text-white">
                  CURRENT
                </div>
              )}

              <div className={`w-16 h-16 rounded-full bg-linear-to-br ${tier.color} flex items-center justify-center mx-auto mb-4`}>
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
              <p className="text-3xl font-black text-green-400 mb-2">{tier.commission}%</p>
              <p className="text-xs text-gray-500">{tier.referrals}+ referrals</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Referrals */}
      {isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]"
          >
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Referrals
              </h3>
            </div>

            <div className="divide-y divide-gray-700/50">
              {recentReferrals.map((ref, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{ref.username[0]}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{ref.username}</p>
                      <p className="text-xs text-gray-500">{ref.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{ref.earned}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      ref.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {ref.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-green-500/30 bg-linear-to-b from-[#1e293b] to-[#0f172a] p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            How It <span className="text-green-400">Works</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Share Your Link', desc: 'Share your unique referral link with friends and on social media.' },
              { step: '02', title: 'Friends Sign Up', desc: 'When they register and start playing, they become your referral.' },
              { step: '03', title: 'Earn Commission', desc: 'Get up to 40% of the house edge on all their bets, forever.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
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
