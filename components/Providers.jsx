'use client';

import ThemeConfigProvider from '@/components/ThemeConfigProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { useEffect } from 'react';

export default function Providers({ children }) {
  useEffect(() => {
    // Set initial theme based on system preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeProvider>
      <ConfigProvider
        locale={viVN}
        theme={{
          cssVar: true,
          hashed: false,
        }}
      >
        <ThemeConfigProvider>
          {children}
        </ThemeConfigProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}