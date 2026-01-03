import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProvablyFair() {
  const [serverSeed, setServerSeed] = useState('');
  const [clientSeed, setClientSeed] = useState('');
  const [nonce, setNonce] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  const handleVerify = () => {
    // Demo verification
    if (serverSeed && clientSeed && nonce) {
      setVerifyResult({
        hash: 'a3f2b8c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
        result: '45.67',
        valid: true,
      });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-900/30 via-[#0f172a] to-cyan-900/30" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-[15%] w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-blue-400 via-cyan-500 to-blue-600 p-1 shadow-2xl shadow-blue-500/30">
                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Provably <span className="bg-linear-to-r from-blue-400 via-cyan-500 to-blue-400 bg-clip-text text-transparent">Fair</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Every game outcome is verifiable. We use cryptographic algorithms to ensure complete transparency and fairness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            How It <span className="text-blue-400">Works</span>
          </h2>
          <p className="text-gray-400">Our provably fair system in 4 simple steps</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Server Seed',
              desc: 'Before each game, we generate a secret server seed and show you its hash (encrypted version).',
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              ),
              color: 'from-blue-500 to-blue-600',
            },
            {
              step: '02',
              title: 'Client Seed',
              desc: 'You provide your own client seed, which you can change anytime to ensure randomness.',
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
              color: 'from-cyan-500 to-cyan-600',
            },
            {
              step: '03',
              title: 'Game Result',
              desc: 'The result is calculated using both seeds combined with a nonce (game number).',
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ),
              color: 'from-purple-500 to-purple-600',
            },
            {
              step: '04',
              title: 'Verify',
              desc: 'After the game, we reveal the server seed so you can verify the result was fair.',
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              color: 'from-green-500 to-green-600',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a] p-6"
            >
              {/* Step number */}
              <div className="absolute top-4 right-4 text-4xl font-black text-gray-800">{item.step}</div>

              <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center mb-4 text-white shadow-lg`}>
                {item.icon}
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Verification Tool */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-linear-to-b from-[#1e293b] to-[#0f172a] p-8"
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-blue-500/40 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-blue-500/40 rounded-br-2xl" />

          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Verify Your <span className="text-blue-400">Game</span>
          </h2>

          <div className="max-w-2xl mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Server Seed (Revealed)</label>
              <input
                type="text"
                value={serverSeed}
                onChange={(e) => setServerSeed(e.target.value)}
                placeholder="Enter the revealed server seed"
                className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Client Seed</label>
              <input
                type="text"
                value={clientSeed}
                onChange={(e) => setClientSeed(e.target.value)}
                placeholder="Enter your client seed"
                className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nonce (Game Number)</label>
              <input
                type="text"
                value={nonce}
                onChange={(e) => setNonce(e.target.value)}
                placeholder="Enter the nonce"
                className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              onClick={handleVerify}
              className="w-full py-4 rounded-xl font-bold text-white bg-linear-to-r from-blue-500 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/30 transition-shadow"
            >
              Verify Result
            </button>

            {verifyResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-green-500/10 border border-green-500/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-400 font-semibold">Verification Successful</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-400">
                    Hash: <span className="text-white font-mono text-xs break-all">{verifyResult.hash}</span>
                  </p>
                  <p className="text-gray-400">
                    Result: <span className="text-white font-semibold">{verifyResult.result}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Algorithm Details */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Technical <span className="text-blue-400">Details</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">#</span> Algorithm
            </h3>
            <div className="bg-[#0f172a] rounded-lg p-4 font-mono text-sm text-gray-400 overflow-x-auto">
              <pre>{`// HMAC-SHA256 Algorithm
result = HMAC_SHA256(
  server_seed,
  client_seed + ":" + nonce
)

// Convert to game result
game_result = hexToFloat(result)`}</pre>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">#</span> Security Measures
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>SHA-256 hashing for server seed commitment</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>HMAC-SHA256 for result generation</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Server seed revealed only after game completion</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Cryptographically secure random number generation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Frequently Asked <span className="text-blue-400">Questions</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: 'What is provably fair gaming?',
              a: 'Provably fair is a technology that allows players to verify that game outcomes are truly random and not manipulated. It uses cryptographic algorithms to ensure transparency.',
            },
            {
              q: 'Can the casino cheat?',
              a: 'No. The server seed hash is provided before you place your bet, and combined with your client seed. We cannot change the outcome after you bet.',
            },
            {
              q: 'How do I change my client seed?',
              a: 'Go to your profile settings and find the "Fairness" section. You can change your client seed at any time, which will be used for future games.',
            },
            {
              q: 'What games are provably fair?',
              a: 'All original games on our platform including Dice, Crash, Limbo, Mines, and more use our provably fair system.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl border border-gray-700/50 bg-linear-to-b from-[#1e293b] to-[#0f172a]"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
              <p className="text-gray-400">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
