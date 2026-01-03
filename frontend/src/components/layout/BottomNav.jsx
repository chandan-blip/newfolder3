import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useLanguageStore from '../../store/languageStore';

export default function BottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { t } = useLanguageStore();

  const navItems = [
    {
      path: '/',
      label: t('home'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      path: '/games',
      label: t('games'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      path: '/wallet',
      label: t('wallet'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      auth: true,
    },
    {
      path: '/history',
      label: t('history'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      auth: true,
    },
    {
      path: '/profile',
      label: t('profile'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      auth: true,
    },
  ];

  // Filter items based on auth state
  const filteredItems = navItems.filter(
    (item) => !item.auth || isAuthenticated
  );

  // Limit to 5 items max for bottom nav
  const displayItems = filteredItems.slice(0, 5);

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-800 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {displayItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors ${
              isActivePath(item.path)
                ? 'text-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1 font-medium truncate max-w-full">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
