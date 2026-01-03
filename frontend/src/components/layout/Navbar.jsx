import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useWalletStore from '../../store/walletStore';
import useLanguageStore from '../../store/languageStore';

// Demo notifications data
const demoNotifications = [
  { id: 1, category: 'wins', title: 'Big Win!', message: 'You won $1,250.00 on Lucky Slots!', time: '2 min ago', icon: '🏆', color: 'from-green-500 to-emerald-600', read: false },
  { id: 2, category: 'wins', title: 'Jackpot!', message: 'Mega Fortune jackpot hit: $5,000!', time: '15 min ago', icon: '💰', color: 'from-amber-500 to-yellow-600', read: false },
  { id: 3, category: 'bonuses', title: 'Bonus Credited', message: 'Your 100% deposit bonus is ready!', time: '1 hour ago', icon: '🎁', color: 'from-purple-500 to-pink-600', read: false },
  { id: 4, category: 'bonuses', title: 'Free Spins', message: '50 free spins added to your account', time: '2 hours ago', icon: '🎰', color: 'from-blue-500 to-cyan-600', read: true },
  { id: 5, category: 'promotions', title: 'Weekend Special', message: '200% bonus on deposits this weekend!', time: '3 hours ago', icon: '⭐', color: 'from-orange-500 to-red-600', read: true },
  { id: 6, category: 'promotions', title: 'VIP Upgrade', message: 'You\'re 500 XP away from Gold tier!', time: '5 hours ago', icon: '👑', color: 'from-yellow-500 to-amber-600', read: true },
  { id: 7, category: 'system', title: 'Security Alert', message: 'New login from Chrome on Windows', time: '1 day ago', icon: '🔒', color: 'from-gray-500 to-gray-600', read: true },
  { id: 8, category: 'system', title: 'Verification Complete', message: 'Your account has been verified', time: '2 days ago', icon: '✅', color: 'from-green-500 to-green-600', read: true },
  { id: 9, category: 'transactions', title: 'Deposit Received', message: '$500.00 deposited successfully', time: '3 days ago', icon: '💳', color: 'from-blue-500 to-indigo-600', read: true },
  { id: 10, category: 'transactions', title: 'Withdrawal Sent', message: '$250.00 sent to your wallet', time: '4 days ago', icon: '📤', color: 'from-cyan-500 to-blue-600', read: true },
];

const notificationCategories = [
  { id: 'all', label: 'All', icon: '📬', count: 10 },
  { id: 'wins', label: 'Wins', icon: '🏆', count: 2 },
  { id: 'bonuses', label: 'Bonuses', icon: '🎁', count: 2 },
  { id: 'promotions', label: 'Promos', icon: '⭐', count: 2 },
  { id: 'transactions', label: 'Transactions', icon: '💳', count: 2 },
  { id: 'system', label: 'System', icon: '🔔', count: 2 },
];

export default function Navbar({ onMenuClick, sidebarCollapsed, isDesktop }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeNotificationCategory, setActiveNotificationCategory] = useState('all');
  const [notifications, setNotifications] = useState(demoNotifications);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { balance, currency } = useWalletStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const filteredNotifications = activeNotificationCategory === 'all'
    ? notifications
    : notifications.filter(n => n.category === activeNotificationCategory);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const navbarLeft = isDesktop ? (sidebarCollapsed ? 80 : 280) : 0;

  return (
    <>
    <nav
      className="fixed top-0 right-0 z-40 glass safe-top transition-[left] duration-300"
      style={{ left: `${navbarLeft}px` }}
    >
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button (mobile) */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-light transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile Logo */}
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
            </Link>
          </div>

          {/* Center - Search (optional, can be added later) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={t('searchGames')}
                className="w-full pl-10 pr-4 py-2 bg-surface-light border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Balance Display */}
                <Link
                  to="/wallet"
                  className="flex items-center gap-2 bg-surface-light px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-400 font-semibold">
                    {formatBalance(balance)}
                  </span>
                </Link>

                {/* Notifications */}
                <button
                  onClick={() => setIsNotificationsOpen(true)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-light transition-colors relative"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 bg-linear-to-r from-red-500 to-pink-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-light transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-[#1e293b] rounded-xl shadow-xl border border-gray-700 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-white font-medium">{user?.username}</p>
                          <p className="text-sm text-gray-400">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-surface-light hover:text-white transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {t('profile')}
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-surface-light hover:text-white transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {t('settings')}
                        </Link>
                        <hr className="border-gray-700" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-surface-light transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          {t('logout')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t('signUp')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>

      {/* Notifications Off-Canvas */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Off-Canvas Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0f172a] border-l border-amber-500/20 z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-4 border-b border-amber-500/20">
                {/* Top glow */}
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Notification bell icon with casino chip style */}
                    <div className="relative w-10 h-10">
                      <div className="absolute inset-0 rounded-full bg-linear-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30" />
                      <div className="absolute inset-0.5 rounded-full bg-linear-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Notifications</h2>
                      <p className="text-xs text-gray-400">{unreadCount} unread messages</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="px-3 py-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Categories with horizontal scroll */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
                  {notificationCategories.map((category) => {
                    const categoryUnread = category.id === 'all'
                      ? unreadCount
                      : notifications.filter(n => n.category === category.id && !n.read).length;

                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveNotificationCategory(category.id)}
                        className={`relative shrink-0 snap-center px-4 py-2 rounded-xl font-medium text-sm transition-all overflow-hidden ${
                          activeNotificationCategory === category.id
                            ? 'text-white shadow-lg shadow-amber-500/20'
                            : 'text-gray-400 hover:text-white bg-[#1e293b] border border-gray-700/50 hover:border-amber-500/30'
                        }`}
                      >
                        {activeNotificationCategory === category.id && (
                          <>
                            <div className="absolute inset-0 bg-linear-to-r from-amber-500 via-yellow-500 to-amber-500" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                          </>
                        )}
                        <span className="relative flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                          {categoryUnread > 0 && (
                            <span className={`min-w-4.5 h-4.5 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                              activeNotificationCategory === category.id
                                ? 'bg-white/20 text-white'
                                : 'bg-red-500 text-white'
                            }`}>
                              {categoryUnread}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center mb-4">
                      <span className="text-4xl">📭</span>
                    </div>
                    <p className="text-gray-400 text-center">No notifications in this category</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-800/50">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => markAsRead(notification.id)}
                        className={`relative p-4 cursor-pointer transition-all hover:bg-white/5 ${
                          !notification.read ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-amber-400 to-yellow-600 rounded-r-full" />
                        )}

                        <div className="flex gap-4">
                          {/* Icon */}
                          <div className={`relative shrink-0 w-12 h-12 rounded-xl bg-linear-to-br ${notification.color} flex items-center justify-center shadow-lg`}>
                            <span className="text-2xl">{notification.icon}</span>
                            {/* Chip notches */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-white/20 rounded-b" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-white/20 rounded-t" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`font-semibold truncate ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                                {notification.title}
                              </h4>
                              <span className="shrink-0 text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-800 bg-[#0f172a]">
                <button className="w-full py-3 rounded-xl bg-linear-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-amber-400 font-medium hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Notification Settings
                </button>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber-500/20 rounded-tl-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-amber-500/20 rounded-bl-2xl pointer-events-none" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
