import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { userAPI } from '../services/api';
import Button from '../components/common/Button';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }

    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await userAPI.getStats();
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userAPI.updateProfile(formData);
      updateUser(response.data.data.user);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 shadow-lg shadow-purple-500/30" />
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
        </div>
        <p className="text-gray-400">Manage your account settings</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-purple-500/20"
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-500/30 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-purple-500/30 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-purple-500/30 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple-500/30 rounded-br-2xl" />

          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              {/* Avatar Chip */}
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30" />
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                {/* Chip notches */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-amber-300/40 rounded-b" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-amber-300/40 rounded-t" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-3 bg-amber-300/40 rounded-r" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-3 bg-amber-300/40 rounded-l" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.username}</h2>
                <p className="text-gray-400">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-sm font-medium capitalize">
                    {user?.role} Account
                  </span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-sm font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-400/80 mb-2 uppercase tracking-wider">
                    Username
                  </label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0f172a] border-2 border-purple-500/20 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-400/80 mb-2 uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#0f172a] border-2 border-purple-500/20 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-400/80 mb-2 uppercase tracking-wider">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#0f172a] border-2 border-purple-500/20 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative px-6 py-3 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-105 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600" />
                    <span className="relative flex items-center gap-2">
                      {isLoading && (
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      Save Changes
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-xl font-medium text-gray-400 bg-[#0f172a] border border-gray-700 hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Username', value: user?.username },
                    { label: 'Email', value: user?.email },
                    { label: 'First Name', value: user?.firstName || '-' },
                    { label: 'Last Name', value: user?.lastName || '-' },
                  ].map((field, i) => (
                    <div key={i} className="bg-[#0f172a] rounded-xl p-4 border border-purple-500/10">
                      <p className="text-sm text-gray-400 mb-1">{field.label}</p>
                      <p className="text-white font-medium">{field.value}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="relative px-6 py-3 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600" />
                  <span className="relative flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </span>
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-amber-500/20"
        >
          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-white text-sm">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Statistics</h3>
          </div>

          {stats ? (
            <div className="space-y-3">
              {[
                { label: 'Total Bets', value: stats.totalBets, color: 'text-white' },
                { label: 'Won', value: stats.wonBets, color: 'text-green-400' },
                { label: 'Lost', value: stats.lostBets, color: 'text-red-400' },
                { label: 'Win Rate', value: `${stats.winRate}%`, color: 'text-amber-400' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-amber-500/5 transition-colors">
                  <span className="text-gray-400">{stat.label}</span>
                  <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}

              <hr className="border-amber-500/20 my-2" />

              {[
                { label: 'Total Wagered', value: `$${stats.totalWagered?.toFixed(2)}`, color: 'text-white' },
                { label: 'Total Won', value: `$${stats.totalWon?.toFixed(2)}`, color: 'text-green-400' },
                { label: 'Net Profit', value: `${stats.netProfit >= 0 ? '+' : ''}$${stats.netProfit?.toFixed(2)}`, color: stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-amber-500/5 transition-colors">
                  <span className="text-gray-400">{stat.label}</span>
                  <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center animate-pulse">
                <span className="text-xl">📊</span>
              </div>
              <p className="text-gray-400">Loading stats...</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center justify-center gap-4 text-gray-500"
      >
        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-purple-500/50" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-purple-500/30" />
          ))}
        </div>
        <span className="text-sm">Secure Profile</span>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-purple-500/30" />
          ))}
        </div>
        <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-purple-500/50" />
      </motion.div>
    </div>
  );
}
