import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useWalletStore from '../../store/walletStore';
import useLanguageStore from '../../store/languageStore';

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { balance, currency } = useWalletStore();
  const { t } = useLanguageStore();
  const [casinoExpanded, setCasinoExpanded] = useState(true);

  const mainNavItems = [
    {
      path: '/',
      label: t('home'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      path: '/dashboard',
      label: t('dashboard'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      auth: true,
    },
    {
      path: '/wallet',
      label: t('wallet'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      auth: true,
    },
    {
      path: '/history',
      label: t('betHistory'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      auth: true,
    },
    {
      path: '/profile',
      label: t('profile'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      auth: true,
    },
  ];

  const rewardsItems = [
    {
      path: '/vip',
      label: 'VIP Club',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      badge: 'VIP',
      badgeColor: 'from-amber-500 to-yellow-500',
    },
    {
      path: '/bonuses',
      label: 'Bonuses',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      badge: 'HOT',
      badgeColor: 'from-red-500 to-orange-500',
    },
    {
      path: '/refer',
      label: 'Refer & Earn',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: '$$$',
      badgeColor: 'from-green-500 to-emerald-500',
    },
  ];

  const infoItems = [
    {
      path: '/provably-fair',
      label: 'Provably Fair',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      path: '/about',
      label: 'About Us',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      path: '/legal',
      label: 'Legal',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
    {
      path: '/support',
      label: 'Live Support',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      live: true,
    },
    {
      path: '/language',
      label: 'Language',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
    },
  ];

  const casinoGames = [
    {
      path: '/games?type=slots',
      label: t('slots'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM9 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
        </svg>
      ),
    },
    {
      path: '/games?type=roulette',
      label: t('roulette'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      path: '/games?type=blackjack',
      label: t('blackjack'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      path: '/games?type=dice',
      label: t('dice'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      path: '/games?type=crash',
      label: t('crash'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      path: '/games?type=poker',
      label: t('poker'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      path: '/games?type=baccarat',
      label: t('baccarat'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  const filteredMainNav = mainNavItems.filter(
    (item) => !item.auth || isAuthenticated
  );

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const isActivePath = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  const sidebarWidth = isCollapsed ? 80 : 280;

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 bottom-0 w-70 bg-[#0f172a] border-r border-gray-800 z-50 flex flex-col"
      >
        <SidebarContent
          isCollapsed={false}
          isAuthenticated={isAuthenticated}
          balance={balance}
          formatBalance={formatBalance}
          filteredMainNav={filteredMainNav}
          isActivePath={isActivePath}
          casinoExpanded={casinoExpanded}
          setCasinoExpanded={setCasinoExpanded}
          onClose={onClose}
          location={location}
          casinoGames={casinoGames}
          rewardsItems={rewardsItems}
          infoItems={infoItems}
          t={t}
        />
      </motion.aside>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarWidth }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden lg:flex fixed left-0 top-0 bottom-0 bg-surface border-r border-gray-800 z-30 flex-col"
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 bg-surface border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-light transition-colors z-50"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <SidebarContent
          isCollapsed={isCollapsed}
          isAuthenticated={isAuthenticated}
          balance={balance}
          formatBalance={formatBalance}
          filteredMainNav={filteredMainNav}
          isActivePath={isActivePath}
          casinoExpanded={casinoExpanded}
          setCasinoExpanded={setCasinoExpanded}
          onClose={() => {}}
          location={location}
          casinoGames={casinoGames}
          rewardsItems={rewardsItems}
          infoItems={infoItems}
          t={t}
        />
      </motion.aside>
    </>
  );
}

function SidebarContent({
  isCollapsed,
  isAuthenticated,
  balance,
  formatBalance,
  filteredMainNav,
  isActivePath,
  casinoExpanded,
  setCasinoExpanded,
  onClose,
  location,
  casinoGames,
  rewardsItems,
  infoItems,
  t,
}) {
  const [rewardsExpanded, setRewardsExpanded] = useState(true);
  const [infoExpanded, setInfoExpanded] = useState(false);
  return (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-white">{t('casino')}</span>
          )}
        </Link>
      </div>

      {/* Balance Card (if authenticated) */}
      {isAuthenticated && !isCollapsed && (
        <div className="px-3 py-4">
          <Link
            to="/wallet"
            onClick={onClose}
            className="block relative overflow-hidden rounded-2xl group"
          >
            {/* Casino-style gradient background */}
            <div className="absolute inset-0 bg-linear-to-br from-amber-500 via-yellow-500 to-amber-600 opacity-90" />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

            {/* Decorative patterns */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-16 h-16 opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                <path d="M50 10 L90 90 L10 90 Z" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            {/* Content */}
            <div className="relative p-4">
              {/* Top row with chip icon */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg border-2 border-yellow-200/50">
                    <span className="text-amber-800 font-bold text-xs">$</span>
                  </div>
                  <span className="text-amber-100 text-xs font-medium uppercase tracking-wider">{t('balance')}</span>
                </div>
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                </div>
              </div>

              {/* Balance amount */}
              <div className="mb-3">
                <p className="text-2xl font-bold text-white drop-shadow-lg tracking-wide">
                  {formatBalance(balance)}
                </p>
              </div>

              {/* Bottom action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-100/90 text-xs">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium">{t('clickToDeposit')}</span>
                </div>
                <svg className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Border glow */}
            <div className="absolute inset-0 rounded-2xl border border-yellow-300/30 group-hover:border-yellow-300/60 transition-colors" />
          </Link>
        </div>
      )}

      {/* Collapsed Balance Icon */}
      {isAuthenticated && isCollapsed && (
        <div className="px-2 py-4">
          <Link
            to="/wallet"
            onClick={onClose}
            className="flex items-center justify-center w-full p-3 rounded-xl bg-linear-to-br from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 transition-all shadow-lg group"
            title={formatBalance(balance)}
          >
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-yellow-300 to-amber-500 flex items-center justify-center border-2 border-yellow-200/50 group-hover:scale-110 transition-transform">
              <span className="text-amber-800 font-bold text-sm">$</span>
            </div>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {/* Main Navigation */}
        <div className="mb-6">
          {!isCollapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t('menu')}
            </p>
          )}
          <ul className="space-y-1">
            {filteredMainNav.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isCollapsed ? 'justify-center' : ''
                  } ${
                    isActivePath(item.path)
                      ? 'bg-primary/20 text-primary'
                      : 'text-gray-400 hover:text-white hover:bg-surface-light'
                  }`}
                >
                  {item.icon}
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Casino Games */}
        <div className="mb-6">
          {!isCollapsed ? (
            <button
              onClick={() => setCasinoExpanded(!casinoExpanded)}
              className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-400"
            >
              <span>{t('casino')}</span>
              <svg
                className={`w-4 h-4 transition-transform ${casinoExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-full flex justify-center mb-2">
              <span className="text-lg">🎰</span>
            </div>
          )}
          <AnimatePresence>
            {(casinoExpanded || isCollapsed) && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 overflow-hidden"
              >
                <li>
                  <Link
                    to="/games"
                    onClick={onClose}
                    title={isCollapsed ? t('allGames') : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isCollapsed ? 'justify-center' : ''
                    } ${
                      location.pathname === '/games' && !location.search
                        ? 'bg-primary/20 text-primary'
                        : 'text-gray-400 hover:text-white hover:bg-surface-light'
                    }`}
                  >
                    <span className="text-lg">🎮</span>
                    {!isCollapsed && <span className="font-medium">{t('allGames')}</span>}
                  </Link>
                </li>
                {casinoGames.map((game) => (
                  <li key={game.path}>
                    <Link
                      to={game.path}
                      onClick={onClose}
                      title={isCollapsed ? game.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isCollapsed ? 'justify-center' : ''
                      } ${
                        isActivePath(game.path)
                          ? 'bg-primary/20 text-primary'
                          : 'text-gray-400 hover:text-white hover:bg-surface-light'
                      }`}
                    >
                      {game.icon}
                      {!isCollapsed && <span className="font-medium">{game.label}</span>}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Rewards & Bonuses Section */}
        <div className="mb-6">
          {!isCollapsed ? (
            <button
              onClick={() => setRewardsExpanded(!rewardsExpanded)}
              className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-400"
            >
              <span className="flex items-center gap-2">
                <span className="text-amber-500">★</span>
                Rewards
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${rewardsExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-full flex justify-center mb-2">
              <span className="text-lg">🎁</span>
            </div>
          )}
          <AnimatePresence>
            {(rewardsExpanded || isCollapsed) && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 overflow-hidden"
              >
                {rewardsItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      title={isCollapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isCollapsed ? 'justify-center' : ''
                      } ${
                        location.pathname === item.path
                          ? 'bg-primary/20 text-primary'
                          : 'text-gray-400 hover:text-white hover:bg-surface-light'
                      }`}
                    >
                      {item.icon}
                      {!isCollapsed && (
                        <span className="flex-1 font-medium">{item.label}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded bg-linear-to-r ${item.badgeColor} text-white`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Info & Support Section */}
        <div className="mb-6">
          {!isCollapsed ? (
            <button
              onClick={() => setInfoExpanded(!infoExpanded)}
              className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-400"
            >
              <span className="flex items-center gap-2">
                <span className="text-blue-500">ℹ</span>
                Info & Support
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${infoExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-full flex justify-center mb-2">
              <span className="text-lg">ℹ️</span>
            </div>
          )}
          <AnimatePresence>
            {(infoExpanded || isCollapsed) && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 overflow-hidden"
              >
                {infoItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      title={isCollapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isCollapsed ? 'justify-center' : ''
                      } ${
                        location.pathname === item.path
                          ? 'bg-primary/20 text-primary'
                          : 'text-gray-400 hover:text-white hover:bg-surface-light'
                      }`}
                    >
                      {item.icon}
                      {!isCollapsed && (
                        <span className="flex-1 font-medium">{item.label}</span>
                      )}
                      {!isCollapsed && item.live && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-green-500/20 text-green-400 border border-green-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          LIVE
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Bottom Settings */}
      <div className="border-t border-gray-800 p-2">
        <Link
          to="/settings"
          onClick={onClose}
          title={isCollapsed ? t('settings') : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-light transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {!isCollapsed && <span className="font-medium">{t('settings')}</span>}
        </Link>

        {/* Legal Links */}
        {!isCollapsed && (
          <div className="mt-4 pt-4 border-t border-gray-800 px-2">
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <Link to="/terms" className="hover:text-gray-400 transition-colors">{t('terms')}</Link>
              <span>·</span>
              <Link to="/privacy" className="hover:text-gray-400 transition-colors">{t('privacy')}</Link>
              <span>·</span>
              <Link to="/responsible-gaming" className="hover:text-gray-400 transition-colors">{t('responsibleGaming')}</Link>
            </div>
            <p className="mt-2 text-xs text-gray-600">© 2026 Casino. All rights reserved.</p>
          </div>
        )}
      </div>
    </>
  );
}
