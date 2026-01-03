import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const themes = ['dark', 'light', 'neon', 'royal', 'custom'];

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      themes,

      setTheme: (themeName) => {
        if (themes.includes(themeName)) {
          // Remove old theme stylesheet
          const oldLink = document.getElementById('theme-stylesheet');
          if (oldLink) {
            oldLink.remove();
          }

          // Add new theme stylesheet
          const link = document.createElement('link');
          link.id = 'theme-stylesheet';
          link.rel = 'stylesheet';
          link.href = `/src/themes/${themeName}.css`;
          document.head.appendChild(link);

          set({ theme: themeName });
        }
      },

      initializeTheme: () => {
        const { theme } = get();
        const existingLink = document.getElementById('theme-stylesheet');

        if (!existingLink) {
          const link = document.createElement('link');
          link.id = 'theme-stylesheet';
          link.rel = 'stylesheet';
          link.href = `/src/themes/${theme}.css`;
          document.head.appendChild(link);
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
