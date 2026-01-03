import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Language() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', region: 'Americas' },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', region: 'Europe' },
    { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷', region: 'Americas' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', region: 'Europe' },
    { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', region: 'Europe' },
    { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹', region: 'Europe' },
    { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', region: 'Europe' },
    { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳', region: 'Asia' },
    { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', region: 'Asia' },
    { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷', region: 'Asia' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', region: 'Middle East' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', region: 'Middle East' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', region: 'Asia' },
    { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭', region: 'Asia' },
    { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳', region: 'Asia' },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Asia' },
    { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱', region: 'Europe' },
    { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', region: 'Europe' },
    { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪', region: 'Europe' },
    { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴', region: 'Europe' },
    { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮', region: 'Europe' },
    { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰', region: 'Europe' },
    { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿', region: 'Europe' },
    { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷', region: 'Europe' },
  ];

  const regions = ['Americas', 'Europe', 'Asia', 'Middle East'];

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedLanguages = regions.reduce((acc, region) => {
    const regionLangs = filteredLanguages.filter((lang) => lang.region === region);
    if (regionLangs.length > 0) {
      acc[region] = regionLangs;
    }
    return acc;
  }, {});

  const handleLanguageSelect = (code) => {
    setSelectedLanguage(code);
    // In a real app, this would trigger language change
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-900/30 via-[#0f172a] to-blue-900/30" />

        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[20%] w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-[20%] w-80 h-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Floating flags */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-[10%] text-4xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🇺🇸</div>
          <div className="absolute top-[25%] right-[15%] text-4xl opacity-20 animate-bounce" style={{ animationDuration: '4s' }}>🇪🇸</div>
          <div className="absolute bottom-[30%] left-[20%] text-4xl opacity-20 animate-bounce" style={{ animationDuration: '3.5s' }}>🇯🇵</div>
          <div className="absolute bottom-[20%] right-[25%] text-4xl opacity-20 animate-bounce" style={{ animationDuration: '2.5s' }}>🇩🇪</div>
          <div className="absolute top-[40%] left-[30%] text-4xl opacity-20 animate-bounce" style={{ animationDuration: '4.5s' }}>🇨🇳</div>
          <div className="absolute bottom-[40%] right-[10%] text-4xl opacity-20 animate-bounce" style={{ animationDuration: '3.2s' }}>🇫🇷</div>
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
                <div className="absolute -inset-4 bg-linear-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-cyan-400 to-blue-600 p-1 shadow-2xl shadow-blue-500/30">
                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                    <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Select <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Language</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose your preferred language. We support 24+ languages worldwide.
            </p>

            {/* Current language */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-[#1e293b] border border-gray-700"
            >
              <span className="text-xl">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
              <span className="text-white font-medium">
                {languages.find(l => l.code === selectedLanguage)?.name}
              </span>
              <span className="text-xs text-gray-500">Current</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search languages..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1e293b] border border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
          />
        </div>
      </section>

      {/* Language Grid */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        {Object.entries(groupedLanguages).map(([region, langs]) => (
          <motion.div
            key={region}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-linear-to-r from-cyan-400 to-blue-500" />
              {region}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {langs.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`relative p-4 rounded-xl border transition-all text-left group ${
                    selectedLanguage === lang.code
                      ? 'bg-linear-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50'
                      : 'bg-[#1e293b] border-gray-700/50 hover:border-cyan-500/30'
                  }`}
                >
                  {selectedLanguage === lang.code && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">{lang.flag}</span>
                  <p className="text-white font-semibold">{lang.name}</p>
                  <p className="text-sm text-gray-400">{lang.native}</p>
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        {filteredLanguages.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-gray-400">No languages found matching "{searchQuery}"</p>
          </div>
        )}
      </section>

      {/* Save Button */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-linear-to-b from-[#1e293b] to-[#0f172a] border border-gray-700/50">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
            <div>
              <p className="text-white font-semibold">
                {languages.find(l => l.code === selectedLanguage)?.name}
              </p>
              <p className="text-sm text-gray-400">
                {languages.find(l => l.code === selectedLanguage)?.native}
              </p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
            Save Language
          </button>
        </div>
      </section>

      {/* Info */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl border border-gray-700/50 bg-[#0f172a]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Language Settings</h4>
              <p className="text-gray-400 text-sm">
                Your language preference will be saved to your account and applied across all devices.
                Some content may still appear in English if a translation is not yet available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Help with translation */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl border border-cyan-500/30 bg-linear-to-r from-cyan-500/10 to-blue-500/10">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shrink-0">
              🌍
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-lg mb-1">Help Us Translate</h4>
              <p className="text-gray-400 text-sm">
                Don't see your language? Help us expand by contributing translations.
              </p>
            </div>
            <button className="px-6 py-2 rounded-xl border border-cyan-500/50 text-cyan-400 font-semibold hover:bg-cyan-500/10 transition-colors">
              Contribute
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
