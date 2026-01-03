import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Support() {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'system', text: 'Welcome to Casino Support! How can we help you today?' },
  ]);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const supportAgents = [
    { name: 'Sarah', status: 'online', avatar: '👩‍💼', specialty: 'Account & Payments' },
    { name: 'Mike', status: 'online', avatar: '👨‍💼', specialty: 'Technical Support' },
    { name: 'Emma', status: 'online', avatar: '👩‍🔧', specialty: 'VIP Support' },
  ];

  const faqs = [
    {
      category: 'Account',
      questions: [
        { q: 'How do I verify my account?', a: 'Go to Settings > Verification and upload a valid government ID and proof of address. Verification usually takes 24-48 hours.' },
        { q: 'I forgot my password. How do I reset it?', a: 'Click "Forgot Password" on the login page, enter your email, and follow the reset link sent to your inbox.' },
        { q: 'Can I have multiple accounts?', a: 'No, each player is only allowed one account. Multiple accounts will be suspended and funds confiscated.' },
      ],
    },
    {
      category: 'Deposits & Withdrawals',
      questions: [
        { q: 'What payment methods do you accept?', a: 'We accept Bitcoin, Ethereum, Litecoin, USDT, and various other cryptocurrencies. Bank transfers and cards are available in select regions.' },
        { q: 'How long do withdrawals take?', a: 'Crypto withdrawals are instant after approval. Processing time is typically under 10 minutes.' },
        { q: 'What are the minimum deposit/withdrawal amounts?', a: 'Minimum deposit is $10 and minimum withdrawal is $20. VIP members have higher limits and faster processing.' },
      ],
    },
    {
      category: 'Games & Fairness',
      questions: [
        { q: 'How does Provably Fair work?', a: 'Our provably fair system uses cryptographic hashing to ensure every game outcome is random and verifiable. Check our Provably Fair page for details.' },
        { q: 'Are the games rigged?', a: 'Absolutely not. All our games use certified RNGs and provably fair technology. Every bet can be independently verified.' },
        { q: 'What is the house edge?', a: 'House edge varies by game. Dice has 1%, Crash has 3%, and slots range from 3-5%. Full details are in each game\'s info section.' },
      ],
    },
    {
      category: 'Bonuses & VIP',
      questions: [
        { q: 'How do I claim bonuses?', a: 'Available bonuses are shown in the Bonuses page. Click "Claim" before making a deposit to activate the bonus.' },
        { q: 'What are wagering requirements?', a: 'Wagering requirements mean you must bet a certain multiple of your bonus before withdrawing. For example, 35x on a $100 bonus = $3,500 in bets.' },
        { q: 'How does the VIP program work?', a: 'Earn XP by playing games. Every $1 wagered = 1 XP. Progress through 100 levels to unlock rewards, cashback, and exclusive perks.' },
      ],
    },
  ];

  const contactOptions = [
    { icon: '💬', title: 'Live Chat', description: '24/7 instant support', action: 'Start Chat', color: 'from-green-500 to-emerald-600' },
    { icon: '📧', title: 'Email', description: 'support@casino.com', action: 'Send Email', color: 'from-blue-500 to-cyan-600' },
    { icon: '📱', title: 'Telegram', description: '@CasinoSupport', action: 'Open Telegram', color: 'from-sky-500 to-blue-600' },
    { icon: '🐦', title: 'Twitter', description: '@CasinoOfficial', action: 'Tweet Us', color: 'from-gray-500 to-gray-600' },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = { id: Date.now(), type: 'user', text: chatMessage };
    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');

    // Simulate agent response
    setTimeout(() => {
      const responses = [
        "Thanks for your message! An agent will be with you shortly.",
        "I understand. Let me look into that for you.",
        "Great question! Here's what I can tell you...",
      ];
      const agentResponse = {
        id: Date.now() + 1,
        type: 'agent',
        agent: 'Sarah',
        text: responses[Math.floor(Math.random() * responses.length)],
      };
      setChatMessages((prev) => [...prev, agentResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-green-900/30 via-[#0f172a] to-emerald-900/30" />

        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[20%] w-64 h-64 rounded-full bg-green-500/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-[20%] w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-green-400 to-emerald-600 p-1 shadow-2xl shadow-green-500/30">
                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Live <span className="bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Support</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We're here to help 24/7. Get instant support from our friendly team.
            </p>

            {/* Online agents indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-green-400 text-sm font-medium">{supportAgents.length} Agents Online</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { id: 'chat', label: 'Live Chat', icon: '💬' },
            { id: 'faq', label: 'FAQ', icon: '❓' },
            { id: 'contact', label: 'Contact', icon: '📞' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white'
                  : 'bg-[#1e293b] text-gray-400 hover:bg-[#334155] border border-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Live Chat */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* Chat window */}
              <div className="lg:col-span-2 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a] overflow-hidden flex flex-col h-[500px]">
                {/* Chat header */}
                <div className="p-4 border-b border-gray-700/50 flex items-center justify-between bg-[#1e293b]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                      👩‍💼
                    </div>
                    <div>
                      <p className="text-white font-semibold">Sarah</p>
                      <p className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Online
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Avg. response: &lt;1 min</span>
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.type === 'user'
                            ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-br-none'
                            : msg.type === 'system'
                            ? 'bg-[#0f172a] border border-gray-700 text-gray-400 text-sm'
                            : 'bg-[#1e293b] text-white rounded-bl-none'
                        }`}
                      >
                        {msg.agent && (
                          <p className="text-xs text-green-400 mb-1">{msg.agent}</p>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700/50 bg-[#0f172a]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 rounded-xl bg-[#1e293b] border border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>

              {/* Agents sidebar */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                  <h3 className="text-lg font-bold text-white mb-4">Available Agents</h3>
                  <div className="space-y-3">
                    {supportAgents.map((agent, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#0f172a] border border-gray-700/50">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-2xl">
                          {agent.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold">{agent.name}</p>
                          <p className="text-xs text-gray-400">{agent.specialty}</p>
                        </div>
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                  <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {['Account Issue', 'Payment Help', 'Game Problem', 'Bonus Question'].map((action, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setChatMessage(`I need help with: ${action}`);
                        }}
                        className="w-full px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-700/50 text-gray-400 text-sm text-left hover:border-green-500/50 hover:text-green-400 transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {faqs.map((category, catIndex) => (
                <div key={catIndex}>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm">
                      {catIndex + 1}
                    </span>
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.questions.map((faq, faqIndex) => {
                      const key = `${catIndex}-${faqIndex}`;
                      const isExpanded = expandedFaq === key;
                      return (
                        <div
                          key={faqIndex}
                          className="rounded-xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a] overflow-hidden"
                        >
                          <button
                            onClick={() => setExpandedFaq(isExpanded ? null : key)}
                            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                          >
                            <span className="text-white font-medium">{faq.q}</span>
                            <svg
                              className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4">
                                  <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Contact */}
          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactOptions.map((option, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a] text-center group hover:border-green-500/50 transition-all"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${option.color} mx-auto mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                      {option.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{option.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{option.description}</p>
                    <button className={`px-6 py-2 rounded-xl bg-linear-to-r ${option.color} text-white font-semibold text-sm hover:shadow-lg transition-shadow`}>
                      {option.action}
                    </button>
                  </div>
                ))}
              </div>

              {/* Response time info */}
              <div className="mt-8 p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
                <h3 className="text-lg font-bold text-white mb-4">Average Response Times</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#0f172a] border border-gray-700/50 text-center">
                    <p className="text-2xl font-bold text-green-400">&lt;1 min</p>
                    <p className="text-sm text-gray-400">Live Chat</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0f172a] border border-gray-700/50 text-center">
                    <p className="text-2xl font-bold text-blue-400">&lt;1 hour</p>
                    <p className="text-sm text-gray-400">Email</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0f172a] border border-gray-700/50 text-center">
                    <p className="text-2xl font-bold text-purple-400">&lt;5 min</p>
                    <p className="text-sm text-gray-400">Telegram</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
