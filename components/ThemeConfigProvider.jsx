'use client';

import { ConfigProvider, theme as antdTheme } from 'antd';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export default function ThemeConfigProvider({ children }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#0057a3',
          colorBgContainer: isDark ? '#141414' : '#ffffff',
          colorText: isDark ? '#ffffff' : '#000000',
        },
        components: {
          Menu: {
            darkItemBg: '#141414',
            darkItemSelectedBg: '#1f1f1f',
            darkItemHoverBg: '#1f1f1f',
            darkItemColor: '#ffffff',
          },
          Card: {
            colorBgContainer: isDark ? '#141414' : '#ffffff',
            colorTextBase: isDark ? '#ffffff' : '#000000',
          },
          Layout: {
            bodyBg: isDark ? '#000000' : '#f0f2f5',
            headerBg: isDark ? '#141414' : '#001529',
          }
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
}