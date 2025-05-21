'use client';

import ThemeConfigProvider from '@/components/ThemeConfigProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { useEffect } from 'react';

export default function Providers({ children }) {
  useEffect(() => {
    // Theme logic is now handled by ThemeContext
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