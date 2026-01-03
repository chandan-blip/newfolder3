import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Legal() {
  const [activeTab, setActiveTab] = useState('terms');

  const tabs = [
    { id: 'terms', label: 'Terms of Service' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'responsible', label: 'Responsible Gaming' },
    { id: 'aml', label: 'AML Policy' },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-gray-900/50 via-[#0f172a] to-slate-900/50" />

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-gray-400 to-gray-600 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Legal <span className="text-gray-400">Information</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Important legal documents and policies governing the use of our platform.
            </p>
          </motion.div>

          {/* Last updated */}
          <div className="text-center mb-8">
            <span className="px-4 py-2 rounded-full bg-[#1e293b] text-gray-400 text-sm">
              Last updated: January 1, 2026
            </span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 snap-center px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900'
                  : 'bg-[#1e293b] text-gray-400 hover:bg-[#334155] border border-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert prose-gray max-w-none"
        >
          {activeTab === 'terms' && (
            <div className="space-y-8">
              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-400 leading-relaxed">
                  By accessing or using Casino, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility</h2>
                <p className="text-gray-400 leading-relaxed mb-4">To use our services, you must:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Be at least 18 years of age (or the legal gambling age in your jurisdiction)</li>
                  <li>Have the legal capacity to enter into a binding agreement</li>
                  <li>Not be a resident of a restricted jurisdiction</li>
                  <li>Not be a politically exposed person (PEP)</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">3. Account Registration</h2>
                <p className="text-gray-400 leading-relaxed">
                  You may only open one account. Multiple accounts are strictly prohibited and may result in immediate termination and confiscation of funds. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">4. Deposits and Withdrawals</h2>
                <p className="text-gray-400 leading-relaxed">
                  All deposits and withdrawals are subject to our verification procedures. We reserve the right to request identity verification at any time. Processing times may vary depending on the payment method and verification status.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">5. Bonuses and Promotions</h2>
                <p className="text-gray-400 leading-relaxed">
                  All bonuses are subject to wagering requirements and specific terms. Abuse of promotional offers may result in account termination. We reserve the right to modify or cancel promotions at any time.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-8">
              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                <p className="text-gray-400 leading-relaxed mb-4">We collect information that you provide directly:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Account information (email, username, password)</li>
                  <li>Identity verification documents</li>
                  <li>Payment information</li>
                  <li>Communication preferences</li>
                  <li>Gaming history and preferences</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>To provide and maintain our services</li>
                  <li>To process transactions and send related information</li>
                  <li>To verify your identity and prevent fraud</li>
                  <li>To send promotional communications (with your consent)</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                <p className="text-gray-400 leading-relaxed">
                  We implement industry-standard security measures including SSL encryption, secure data storage, and regular security audits. Your data is protected against unauthorized access, alteration, or destruction.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                <p className="text-gray-400 leading-relaxed mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Withdraw consent for marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'responsible' && (
            <div className="space-y-8">
              <div className="p-6 rounded-2xl border border-amber-500/30 bg-linear-to-b from-amber-500/10 to-[#0f172a]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Gambling Should Be Fun</h2>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  If gambling stops being fun or starts affecting your life negatively, it's time to take a break. We're committed to promoting responsible gambling and providing tools to help you stay in control.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">Self-Exclusion Options</h2>
                <ul className="space-y-4 text-gray-400">
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">24h</span>
                    <div>
                      <p className="text-white font-medium">Cool-off Period</p>
                      <p className="text-sm">Take a 24-hour break from gambling</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">7d</span>
                    <div>
                      <p className="text-white font-medium">Weekly Self-Exclusion</p>
                      <p className="text-sm">Block access for one week</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">∞</span>
                    <div>
                      <p className="text-white font-medium">Permanent Self-Exclusion</p>
                      <p className="text-sm">Permanently close your account</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">Deposit Limits</h2>
                <p className="text-gray-400 leading-relaxed">
                  Set daily, weekly, or monthly deposit limits to control your spending. Limits can be decreased immediately but increases require a 24-hour waiting period.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">Get Help</h2>
                <p className="text-gray-400 leading-relaxed mb-4">If you or someone you know has a gambling problem, please contact:</p>
                <div className="space-y-2">
                  <a href="#" className="block p-3 rounded-lg bg-[#0f172a] border border-gray-700 text-blue-400 hover:border-blue-500 transition-colors">
                    Gamblers Anonymous - www.gamblersanonymous.org
                  </a>
                  <a href="#" className="block p-3 rounded-lg bg-[#0f172a] border border-gray-700 text-blue-400 hover:border-blue-500 transition-colors">
                    National Problem Gambling Helpline - 1-800-522-4700
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'aml' && (
            <div className="space-y-8">
              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">Anti-Money Laundering Policy</h2>
                <p className="text-gray-400 leading-relaxed">
                  Casino is committed to preventing money laundering and terrorist financing. We comply with all applicable AML regulations and implement robust Know Your Customer (KYC) procedures.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">Customer Due Diligence</h2>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Identity verification for all customers</li>
                  <li>Enhanced due diligence for high-risk customers</li>
                  <li>Ongoing monitoring of customer activity</li>
                  <li>Source of funds verification when required</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h2 className="text-2xl font-bold text-white mb-4">Suspicious Activity Reporting</h2>
                <p className="text-gray-400 leading-relaxed">
                  We are obligated to report suspicious transactions to the relevant authorities. This includes unusual betting patterns, structuring of deposits, and other indicators of money laundering.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* Contact */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a] text-center">
          <h3 className="text-lg font-bold text-white mb-2">Questions about our policies?</h3>
          <p className="text-gray-400 mb-4">Contact our legal team for clarification</p>
          <a
            href="mailto:legal@casino.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            legal@casino.com
          </a>
        </div>
      </section>
    </div>
  );
}
