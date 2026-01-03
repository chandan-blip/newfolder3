import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    const result = await register({
      email: formData.email,
      username: formData.username,
      password: formData.password,
    });

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-br from-green-900/10 via-[#0f172a] to-amber-900/10" />

      {/* Floating Casino Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[10%] w-20 h-20 rounded-full bg-linear-to-br from-green-400 to-green-600 opacity-10 blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-[10%] w-24 h-24 rounded-full bg-linear-to-br from-amber-400 to-amber-600 opacity-10 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-[5%] w-16 h-16 rounded-full bg-linear-to-br from-purple-400 to-purple-600 opacity-10 blur-xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Card suits */}
        <div className="absolute top-20 right-[25%] text-8xl opacity-5 -rotate-12 text-red-500">♥</div>
        <div className="absolute bottom-20 left-[25%] text-8xl opacity-5 rotate-12">♠</div>
        <div className="absolute top-1/3 left-[10%] text-6xl opacity-5 rotate-6">♣</div>
        <div className="absolute bottom-1/3 right-[15%] text-6xl opacity-5 -rotate-6 text-red-500">♦</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative overflow-hidden bg-[#1e293b] rounded-2xl border border-green-500/20 shadow-2xl shadow-green-500/5">
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-green-500/30 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-green-500/30 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-green-500/30 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-green-500/30 rounded-br-2xl" />

          {/* Top glow bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-green-500 to-transparent" />

          <div className="relative p-8">
            <div className="text-center mb-8">
              {/* Casino Chip Logo */}
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center mb-4"
              >
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-green-400 via-emerald-500 to-green-600 shadow-lg shadow-green-500/30" />
                  <div className="absolute inset-1 rounded-full bg-linear-to-br from-green-500 to-green-700 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-dashed border-green-300/50 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">+</span>
                    </div>
                  </div>
                  {/* Chip notches */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-green-300/40 rounded-b" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-green-300/40 rounded-t" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-3 bg-green-300/40 rounded-r" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-3 bg-green-300/40 rounded-l" />
                </div>
              </motion.div>

              <h1 className="text-2xl font-bold text-white">Create Account</h1>
              <p className="text-gray-400 mt-2">Join us and start your winning journey</p>

              {/* Bonus Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-amber-500/10 border border-amber-500/30 rounded-full"
              >
                <span className="text-lg">🎁</span>
                <span className="text-amber-400 text-sm font-medium">$100 Welcome Bonus!</span>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-green-400/80 mb-2 uppercase tracking-wider">
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
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-[#0f172a] border-2 rounded-xl text-white placeholder-gray-500 focus:ring-2 transition-all outline-none ${
                      errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-green-500/20 focus:border-green-500 focus:ring-green-500/20'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Username Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-green-400/80 mb-2 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-[#0f172a] border-2 rounded-xl text-white placeholder-gray-500 focus:ring-2 transition-all outline-none ${
                      errors.username ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-green-500/20 focus:border-green-500 focus:ring-green-500/20'
                    }`}
                  />
                </div>
                {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
              </div>

              {/* Password Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-green-400/80 mb-2 uppercase tracking-wider">
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
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-[#0f172a] border-2 rounded-xl text-white placeholder-gray-500 focus:ring-2 transition-all outline-none ${
                      errors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-green-500/20 focus:border-green-500 focus:ring-green-500/20'
                    }`}
                  />
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-green-400/80 mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-[#0f172a] border-2 rounded-xl text-white placeholder-gray-500 focus:ring-2 transition-all outline-none ${
                      errors.confirmPassword ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-green-500/20 focus:border-green-500 focus:ring-green-500/20'
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
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
                className="w-full relative py-4 rounded-xl font-bold text-lg text-white overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
              >
                <div className="absolute inset-0 bg-linear-to-r from-green-500 via-emerald-500 to-green-500" />
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Create Account
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-green-400 hover:text-green-300 transition-colors font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Decorative bottom element */}
            <div className="mt-8 flex items-center justify-center gap-3 text-gray-500">
              <div className="w-8 h-0.5 bg-linear-to-r from-transparent to-green-500/30" />
              <div className="flex gap-2 text-lg opacity-30">
                <span>♠</span>
                <span className="text-red-500">♥</span>
                <span className="text-red-500">♦</span>
                <span>♣</span>
              </div>
              <div className="w-8 h-0.5 bg-linear-to-l from-transparent to-green-500/30" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
