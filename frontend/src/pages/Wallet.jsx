import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useWalletStore from '../store/walletStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Wallet() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('action') || 'deposit');
  const [amount, setAmount] = useState('');
  const { balance, currency, transactions, fetchBalance, fetchTransactions, deposit, withdraw, isLoading } = useWalletStore();

  useEffect(() => {
    fetchBalance();
    fetchTransactions({ limit: 20 });
  }, [fetchBalance, fetchTransactions]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    let result;
    if (activeTab === 'deposit') {
      result = await deposit(numAmount);
      if (result.success) {
        toast.success(`Successfully deposited ${formatCurrency(numAmount)}`);
        setAmount('');
      }
    } else {
      result = await withdraw(numAmount);
      if (result.success) {
        toast.success(`Successfully withdrawn ${formatCurrency(numAmount)}`);
        setAmount('');
      }
    }

    if (!result.success) {
      toast.error(result.error);
    }
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 py-8 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-linear-to-r from-amber-500/5 via-yellow-500/10 to-amber-500/5 rounded-2xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-amber-500/30 to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-4 left-8 text-amber-500/10 text-4xl">♠</div>
        <div className="absolute top-4 right-8 text-red-500/10 text-4xl">♥</div>
        <div className="absolute bottom-4 left-12 text-red-500/10 text-3xl">♦</div>
        <div className="absolute bottom-4 right-12 text-amber-500/10 text-3xl">♣</div>

        <div className="relative text-center">
          <div className="inline-flex items-center gap-4 mb-4">
            {/* Casino Chip Icon */}
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/40 animate-pulse" />
              <div className="absolute inset-0.5 rounded-full bg-linear-to-br from-amber-500 to-amber-700" />
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-300/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">$</span>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Casino <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-yellow-500">Wallet</span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Manage your casino funds securely
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl mb-8 group"
      >
        {/* Casino-style gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-amber-500 via-yellow-500 to-amber-600 opacity-90" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-24 h-24 border-4 border-white rounded-full" />
          <div className="absolute top-8 right-8 w-16 h-16 border-4 border-white rounded-full" />
          <div className="absolute bottom-4 left-4 w-20 h-20 border-4 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white transform rotate-45" />
          <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-white transform rotate-45" />
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

        {/* Sparkle dots */}
        <div className="absolute top-6 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-8 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Content */}
        <div className="relative p-8 flex items-center gap-6">
          {/* Large Casino Chip */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-amber-300 to-amber-700 shadow-xl" />
            <div className="absolute inset-2 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-dashed border-amber-200/60 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">$</span>
              </div>
            </div>
            {/* Chip edge notches */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-amber-200/40 rounded-b" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-amber-200/40 rounded-t" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-3 bg-amber-200/40 rounded-r" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-3 bg-amber-200/40 rounded-l" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-white/80 text-sm uppercase tracking-wider font-medium">Available Balance</p>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>
            <p className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              {formatCurrency(balance)}
            </p>
            <p className="text-white/70 text-sm mt-2">Ready to play</p>
          </div>
        </div>

        {/* Bottom border glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-amber-300 to-transparent" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Casino-style Deposit/Withdraw Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden bg-[#1e293b] rounded-2xl border border-amber-500/20 shadow-xl shadow-amber-500/5"
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-500/30 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/30 rounded-br-2xl" />

          <div className="relative p-6">
            {/* Casino Chip Tabs */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setActiveTab('deposit')}
                className={`flex-1 relative py-4 rounded-xl font-bold text-lg transition-all overflow-hidden group ${
                  activeTab === 'deposit'
                    ? 'text-white shadow-lg shadow-green-500/30'
                    : 'text-gray-400 hover:text-white bg-[#0f172a]'
                }`}
              >
                {activeTab === 'deposit' && (
                  <>
                    <div className="absolute inset-0 bg-linear-to-br from-green-500 via-emerald-500 to-green-600" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                  </>
                )}
                <span className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Deposit
                </span>
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`flex-1 relative py-4 rounded-xl font-bold text-lg transition-all overflow-hidden group ${
                  activeTab === 'withdraw'
                    ? 'text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-400 hover:text-white bg-[#0f172a]'
                }`}
              >
                {activeTab === 'withdraw' && (
                  <>
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500 via-violet-500 to-purple-600" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                  </>
                )}
                <span className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  Withdraw
                </span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input with Casino styling */}
              <div className="relative">
                <label className="block text-sm font-medium text-amber-400/80 mb-2 uppercase tracking-wider">
                  Enter Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-amber-500 font-bold">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    className="w-full pl-12 pr-4 py-4 bg-[#0f172a] border-2 border-amber-500/30 rounded-xl text-2xl text-white font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                  Quick Select
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      type="button"
                      onClick={() => setAmount(quickAmount.toString())}
                      className="relative py-3 rounded-xl font-bold text-gray-300 overflow-hidden group transition-all hover:scale-105"
                    >
                      {/* Chip background */}
                      <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-800 group-hover:from-amber-600 group-hover:to-amber-700 transition-all" />
                      <div className="absolute inset-0.5 rounded-xl bg-[#1e293b] group-hover:bg-amber-600/20" />
                      {/* Chip edge effect */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-slate-600 group-hover:bg-amber-400/50 rounded-b transition-colors" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-slate-600 group-hover:bg-amber-400/50 rounded-t transition-colors" />
                      <span className="relative group-hover:text-white">${quickAmount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full relative py-4 rounded-xl font-bold text-lg text-white overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === 'deposit'
                    ? 'shadow-lg shadow-green-500/30'
                    : 'shadow-lg shadow-purple-500/30'
                }`}
              >
                <div className={`absolute inset-0 ${
                  activeTab === 'deposit'
                    ? 'bg-linear-to-br from-green-500 via-emerald-500 to-green-600'
                    : 'bg-linear-to-br from-purple-500 via-violet-500 to-purple-600'
                }`} />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                {/* Shine effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      {activeTab === 'deposit' ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      )}
                      {activeTab === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
                    </>
                  )}
                </span>
              </button>
            </form>

            <p className="mt-4 text-sm text-amber-400/60 text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {activeTab === 'deposit'
                ? 'Demo mode: Deposits are instant and free'
                : 'Demo mode: Withdrawals are instant'}
            </p>
          </div>
        </motion.div>

        {/* Casino-style Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden bg-[#1e293b] rounded-2xl border border-amber-500/20 shadow-xl shadow-amber-500/5"
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl" />

          {/* Header */}
          <div className="relative px-6 py-4 border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              {/* Small casino chip */}
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-amber-400 to-amber-600" />
                <div className="absolute inset-1 rounded-full bg-linear-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">$</span>
                </div>
              </div>
              <h2 className="text-lg font-bold text-white">Transaction History</h2>
            </div>
          </div>

          <div className="divide-y divide-amber-500/10 max-h-96 overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="p-8 text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-gray-600 to-gray-700 opacity-50" />
                  <div className="absolute inset-2 rounded-full bg-[#0f172a] flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-400">No transactions yet</p>
                <p className="text-gray-500 text-sm mt-1">Start playing to see your history</p>
              </div>
            ) : (
              transactions.map((tx, index) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 hover:bg-amber-500/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {/* Transaction type chip */}
                    <div
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
                        ['deposit', 'win', 'bonus'].includes(tx.type)
                          ? 'bg-linear-to-br from-green-500 to-green-600'
                          : 'bg-linear-to-br from-red-500 to-red-600'
                      }`}
                    >
                      <div className={`absolute inset-0.5 rounded-full flex items-center justify-center ${
                        ['deposit', 'win', 'bonus'].includes(tx.type)
                          ? 'bg-green-500/20'
                          : 'bg-red-500/20'
                      }`}>
                        {['deposit', 'win', 'bonus'].includes(tx.type) ? (
                          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-semibold capitalize group-hover:text-amber-400 transition-colors">
                        {tx.type}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(tx.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        parseFloat(tx.amount) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {parseFloat(tx.amount) >= 0 ? '+' : ''}
                      {formatCurrency(Math.abs(parseFloat(tx.amount)))}
                    </p>
                    <p className="text-sm text-gray-500">
                      Bal: {formatCurrency(parseFloat(tx.balanceAfter))}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-[#1e293b] to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Footer decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center justify-center gap-4 text-gray-500"
      >
        <div className="w-8 h-0.5 bg-linear-to-r from-transparent to-amber-500/50" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-amber-500/30" />
          ))}
        </div>
        <span className="text-sm">Secure Transactions</span>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-amber-500/30" />
          ))}
        </div>
        <div className="w-8 h-0.5 bg-linear-to-l from-transparent to-amber-500/50" />
      </motion.div>
    </div>
  );
}
