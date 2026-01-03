import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const result = await login(email, password);

    if (result.success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-br from-amber-900/10 via-[#0f172a] to-purple-900/10" />

      {/* Floating Casino Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-20 h-20 rounded-full bg-linear-to-br from-amber-400 to-amber-600 opacity-10 blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-[10%] w-24 h-24 rounded-full bg-linear-to-br from-purple-400 to-purple-600 opacity-10 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-[5%] w-16 h-16 rounded-full bg-linear-to-br from-green-400 to-green-600 opacity-10 blur-xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Card suits */}
        <div className="absolute top-32 left-[20%] text-8xl opacity-5 rotate-12">♠</div>
        <div className="absolute bottom-32 right-[20%] text-8xl opacity-5 -rotate-12 text-red-500">♥</div>
        <div className="absolute top-1/2 right-[10%] text-6xl opacity-5 rotate-6 text-red-500">♦</div>
        <div className="absolute bottom-1/3 left-[15%] text-6xl opacity-5 -rotate-6">♣</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative overflow-hidden bg-[#1e293b] rounded-2xl border border-amber-500/20 shadow-2xl shadow-amber-500/5">
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-amber-500/30 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amber-500/30 rounded-br-2xl" />

          {/* Top glow bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-amber-500 to-transparent" />

          <div className="relative p-8">
            <div className="text-center mb-8">
              {/* Casino Chip Logo */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center mb-4"
              >
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30" />
                  <div className="absolute inset-1 rounded-full bg-linear-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-dashed border-amber-300/50 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">C</span>
                    </div>
                  </div>
                  {/* Chip notches */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-amber-300/40 rounded-b" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-amber-300/40 rounded-t" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-3 bg-amber-300/40 rounded-r" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-3 bg-amber-300/40 rounded-l" />
                </div>
              </motion.div>

              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              <p className="text-gray-400 mt-2">Sign in to continue your winning streak</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-medium text-amber-400/80 mb-2 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-[#0f172a] border-2 border-amber-500/20 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-amber-400/80 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-[#0f172a] border-2 border-amber-500/20 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
                >
                  <p className="text-sm text-red-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative py-4 rounded-xl font-bold text-lg text-white overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
              >
                <div className="absolute inset-0 bg-linear-to-r from-amber-500 via-yellow-500 to-amber-500" />
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
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Decorative bottom element */}
            <div className="mt-8 flex items-center justify-center gap-3 text-gray-500">
              <div className="w-8 h-0.5 bg-linear-to-r from-transparent to-amber-500/30" />
              <div className="flex gap-2 text-lg opacity-30">
                <span>♠</span>
                <span className="text-red-500">♥</span>
                <span className="text-red-500">♦</span>
                <span>♣</span>
              </div>
              <div className="w-8 h-0.5 bg-linear-to-l from-transparent to-amber-500/30" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
