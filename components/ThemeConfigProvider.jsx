'use client';

import { ConfigProvider, theme as antdTheme } from 'antd';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export default function ThemeConfigProvider({ children }) {
  const { theme } = useContext(ThemeContext);
  const algorithm =
    theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;
  return (
    <ConfigProvider theme={{ algorithm, token: { colorPrimary: '#0057a3' } }}>
      {children}
    </ConfigProvider>
  );
} 