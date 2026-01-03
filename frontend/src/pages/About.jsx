import { motion } from 'framer-motion';

export default function About() {
  const stats = [
    { value: '2M+', label: 'Active Players', icon: '👥' },
    { value: '$50M+', label: 'Paid Out', icon: '💰' },
    { value: '500+', label: 'Games', icon: '🎮' },
    { value: '24/7', label: 'Support', icon: '🛡️' },
  ];

  const features = [
    {
      title: 'Provably Fair',
      description: 'Every game outcome can be independently verified using cryptographic algorithms.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Instant Payouts',
      description: 'Withdraw your winnings instantly with our automated payout system.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-amber-500 to-yellow-600',
    },
    {
      title: 'Secure Platform',
      description: 'Bank-grade encryption and security measures protect your funds and data.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'VIP Program',
      description: '100 exclusive levels with increasing rewards, cashback, and personalized service.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
    },
  ];

  const team = [
    { name: 'Alex Chen', role: 'CEO & Founder', avatar: '👨‍💼', years: '10+ years in iGaming' },
    { name: 'Sarah Miller', role: 'CTO', avatar: '👩‍💻', years: '15+ years in Security' },
    { name: 'James Wilson', role: 'Head of Operations', avatar: '👨‍🔧', years: '8+ years in Operations' },
    { name: 'Emily Brown', role: 'Head of Support', avatar: '👩‍💼', years: '12+ years in Customer Service' },
  ];

  const milestones = [
    { year: '2020', event: 'Company Founded', description: 'Started with a vision to create the fairest casino platform' },
    { year: '2021', event: 'Global Launch', description: 'Expanded to 100+ countries with multi-language support' },
    { year: '2022', event: '1M Players', description: 'Reached our first million registered players milestone' },
    { year: '2023', event: 'VIP Program', description: 'Launched our revolutionary 100-level VIP program' },
    { year: '2024', event: 'Industry Leader', description: 'Recognized as the most trusted crypto casino platform' },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/30 via-[#0f172a] to-purple-900/30" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Decorative cards */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[5%] text-6xl opacity-10 rotate-[-15deg]">♠</div>
          <div className="absolute top-[30%] right-[8%] text-5xl opacity-10 rotate-[20deg]">♥</div>
          <div className="absolute bottom-[25%] left-[15%] text-5xl opacity-10 rotate-[10deg]">♦</div>
          <div className="absolute bottom-[20%] right-[12%] text-6xl opacity-10 rotate-[-10deg]">♣</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-indigo-500/30 via-purple-500/30 to-indigo-500/30 rounded-full blur-xl animate-pulse" />
                <div className="relative w-28 h-28 rounded-full bg-linear-to-br from-indigo-400 via-purple-500 to-indigo-600 p-1 shadow-2xl shadow-purple-500/30">
                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                    <span className="text-5xl">🎰</span>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              About <span className="bg-linear-to-r from-indigo-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">Casino</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              We're on a mission to create the most transparent, fair, and exciting online gaming experience.
              Built by players, for players.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="relative overflow-hidden p-6 rounded-2xl bg-linear-to-b from-[#1e293b] to-[#0f172a] border border-gray-700/50 text-center group hover:border-purple-500/50 transition-colors"
              >
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-3xl mb-2 block">{stat.icon}</span>
                <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Story</h2>
          <div className="w-24 h-1 bg-linear-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              Casino was born from a simple idea: create a gaming platform where fairness isn't just a promise—it's mathematically provable.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Founded in 2020 by a team of gaming enthusiasts and blockchain experts, we set out to revolutionize the online casino industry. We believed that players deserved better: instant payouts, transparent odds, and games that couldn't be rigged.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Today, we're proud to serve over 2 million players worldwide, having paid out more than $50 million in winnings. Our provably fair system has been independently audited and verified, making us one of the most trusted names in online gaming.
            </p>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-indigo-500 via-purple-500 to-indigo-500" />
            <div className="space-y-6">
              {milestones.map((milestone, i) => (
                <div key={i} className="relative pl-20">
                  <div className="absolute left-6 top-1 w-5 h-5 rounded-full bg-linear-to-br from-indigo-400 to-purple-600 border-4 border-[#0f172a]" />
                  <div className="p-4 rounded-xl bg-[#1e293b]/50 border border-gray-700/50">
                    <span className="text-xs font-bold text-purple-400">{milestone.year}</span>
                    <h4 className="text-white font-semibold">{milestone.event}</h4>
                    <p className="text-sm text-gray-400">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Us</h2>
          <div className="w-24 h-1 bg-linear-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden p-6 rounded-2xl bg-linear-to-b from-[#1e293b] to-[#0f172a] border border-gray-700/50 group hover:border-purple-500/50 transition-all"
            >
              <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Leadership Team</h2>
          <div className="w-24 h-1 bg-linear-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-linear-to-b from-[#1e293b] to-[#0f172a] border border-gray-700/50 group hover:border-purple-500/50 transition-all"
            >
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                {member.avatar}
              </div>
              <h3 className="text-lg font-bold text-white">{member.name}</h3>
              <p className="text-purple-400 text-sm font-medium">{member.role}</p>
              <p className="text-gray-500 text-xs mt-2">{member.years}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Licenses & Certifications */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-linear-to-b from-[#1e293b] to-[#0f172a] border border-gray-700/50"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Licenses & Certifications</h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold">Licensed & Regulated</h4>
              <p className="text-gray-400 text-sm mt-1">Operating under Curacao Gaming License</p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold">SSL Encrypted</h4>
              <p className="text-gray-400 text-sm mt-1">256-bit SSL encryption for all data</p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h4 className="text-white font-semibold">Independently Audited</h4>
              <p className="text-gray-400 text-sm mt-1">Regular third-party security audits</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-8 rounded-2xl bg-linear-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 border border-purple-500/30"
        >
          <h3 className="text-2xl font-bold text-white mb-3">Ready to Experience the Difference?</h3>
          <p className="text-gray-400 mb-6">Join millions of players who trust Casino for fair, transparent gaming.</p>
          <button className="px-8 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
            Start Playing Now
          </button>
        </motion.div>
      </section>
    </div>
  );
}
