import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import useWalletStore from '../store/walletStore';
import useLanguageStore from '../store/languageStore';
import useThemeStore from '../store/themeStore';

const themes = [
  { code: 'dark', name: 'Dark', icon: '🌙', description: 'Default dark theme', color: 'from-slate-600 to-slate-700' },
  { code: 'light', name: 'Light', icon: '☀️', description: 'Clean light theme', color: 'from-amber-100 to-amber-200' },
  { code: 'neon', name: 'Neon', icon: '💚', description: 'Vibrant neon colors', color: 'from-green-500 to-cyan-500' },
  { code: 'royal', name: 'Royal', icon: '👑', description: 'Luxurious gold theme', color: 'from-amber-500 to-purple-600' },
];

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿' },
];

export default function Settings() {
  const { user } = useAuthStore();
  const { currency, setCurrency } = useWalletStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { theme, setTheme } = useThemeStore();
  const [selectedCurrency, setSelectedCurrency] = useState(currency || 'USD');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    promotions: false,
    betResults: true,
  });

  const handleThemeChange = (code) => {
    setTheme(code);
    const selectedTheme = themes.find(th => th.code === code);
    toast.success(`Theme: ${selectedTheme?.name}`);
  };

  const handleLanguageChange = (code) => {
    setLanguage(code);
    const lang = languages.find(l => l.code === code);
    toast.success(`${t('language')}: ${lang?.nativeName || lang?.name}`);
  };

  const handleCurrencyChange = (code) => {
    setSelectedCurrency(code);
    setCurrency(code);
    toast.success(`${t('currency')}: ${code}`);
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
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
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30" />
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">{t('settingsTitle')}</h1>
        </div>
        <p className="text-gray-400">{t('customizeExperience')}</p>
      </motion.div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-amber-500/20"
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl" />

          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-white text-sm">🎨</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Theme</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">Choose your preferred theme</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {themes.map((th, index) => (
                <motion.button
                  key={th.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => handleThemeChange(th.code)}
                  className={`relative p-4 rounded-xl border transition-all text-center overflow-hidden group ${
                    theme === th.code
                      ? 'border-amber-500 ring-2 ring-amber-500/30'
                      : 'border-gray-700 bg-[#0f172a] hover:border-gray-600'
                  }`}
                >
                  {theme === th.code && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${th.color} opacity-20`} />
                  )}
                  <span className="relative text-2xl block mb-2">{th.icon}</span>
                  <span className="relative text-sm font-medium block text-white">{th.name}</span>
                  <span className="relative text-xs text-gray-500 block mt-1">{th.description}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Language Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-blue-500/20"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white text-sm">🌍</span>
            </div>
            <h2 className="text-xl font-semibold text-white">{t('language')}</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">{t('selectLanguage')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {languages.map((lang, index) => (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.03 * index }}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-3 rounded-xl border transition-all text-left ${
                  language === lang.code
                    ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30'
                    : 'border-gray-700 bg-[#0f172a] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <span className="text-sm font-medium block text-white">{lang.nativeName}</span>
                    <span className="text-xs text-gray-500">{lang.name}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Currency Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-green-500/20"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">$</span>
            </div>
            <h2 className="text-xl font-semibold text-white">{t('currency')}</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">{t('chooseCurrency')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currencies.map((curr, index) => (
              <motion.button
                key={curr.code}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.03 * index }}
                onClick={() => handleCurrencyChange(curr.code)}
                className={`p-3 rounded-xl border transition-all ${
                  selectedCurrency === curr.code
                    ? 'border-green-500 bg-green-500/10 ring-2 ring-green-500/30'
                    : 'border-gray-700 bg-[#0f172a] hover:border-gray-600'
                }`}
              >
                <span className="block text-2xl mb-1">{curr.symbol}</span>
                <span className="text-sm font-medium text-white">{curr.code}</span>
                <span className="block text-xs text-gray-500">{curr.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-purple-500/20"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm">🔔</span>
            </div>
            <h2 className="text-xl font-semibold text-white">{t('notifications')}</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">{t('manageNotifications')}</p>
          <div className="space-y-3">
            {[
              { key: 'email', label: t('emailNotifications'), desc: t('receiveEmail'), icon: '✉️' },
              { key: 'push', label: t('pushNotifications'), desc: t('browserPush'), icon: '📱' },
              { key: 'promotions', label: t('promotionalOffers'), desc: t('receiveBonus'), icon: '🎁' },
              { key: 'betResults', label: t('betResults'), desc: t('notifyBets'), icon: '🎲' },
            ].map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex items-center justify-between p-4 rounded-xl bg-[#0f172a] border border-purple-500/10 hover:border-purple-500/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange(item.key)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    notifications[item.key] ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      notifications[item.key] ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-cyan-500/20"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <span className="text-white text-sm">🔒</span>
            </div>
            <h2 className="text-xl font-semibold text-white">{t('privacySecurity')}</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: t('changePassword'), desc: t('updatePassword'), icon: '🔑' },
              { label: t('twoFactor'), desc: t('addSecurity'), icon: '🛡️' },
              { label: t('activeSessions'), desc: t('manageDevices'), icon: '📱' },
            ].map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0f172a] border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div className="text-left">
                    <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">{item.label}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden bg-[#1e293b] rounded-2xl p-6 border border-red-500/20"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

          <h2 className="text-xl font-semibold text-white mb-4">{t('account')}</h2>
          <div className="space-y-3">
            <button className="w-full p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-colors text-left group">
              <div className="flex items-center gap-3">
                <span className="text-xl">⏸️</span>
                <div>
                  <p className="font-medium group-hover:text-yellow-300">{t('selfExclusion')}</p>
                  <p className="text-sm text-yellow-400/70">{t('selfExclusionDesc')}</p>
                </div>
              </div>
            </button>
            <button className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-left group">
              <div className="flex items-center gap-3">
                <span className="text-xl">🗑️</span>
                <div>
                  <p className="font-medium group-hover:text-red-300">{t('deleteAccount')}</p>
                  <p className="text-sm text-red-400/70">{t('deleteAccountDesc')}</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center justify-center gap-4 text-gray-500"
      >
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500/50" />
        <div className="flex gap-3 text-2xl opacity-30">
          <span>♠</span>
          <span className="text-red-500">♥</span>
          <span className="text-red-500">♦</span>
          <span>♣</span>
        </div>
        <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500/50" />
      </motion.div>
    </div>
  );
}
