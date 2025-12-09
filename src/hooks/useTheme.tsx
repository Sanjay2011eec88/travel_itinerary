import { useEffect } from 'react';
import { useProfile } from './useProfile';

export function useTheme() {
  const { profile } = useProfile();

  useEffect(() => {
    // Apply dark mode based on user profile
    if (profile?.dark_mode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile?.dark_mode]);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return {
    isDark: profile?.dark_mode || false,
    toggleTheme,
  };
}
