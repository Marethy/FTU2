'use client';

import { ConfigProvider, theme as antdTheme } from 'antd';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function App({ Component, pageProps }) {
  const { theme } = useContext(ThemeContext);
  
  return (
    <ConfigProvider
      theme={{
        algorithm: 
          theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: { colorPrimary: '#0057a3' }
      }}
    >
      <Component {...pageProps} />
    </ConfigProvider>
  );
} 