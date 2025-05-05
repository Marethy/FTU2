'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeConfigProvider } from '@/components/ThemeConfigProvider';
import { ConfigProvider } from 'antd';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import './globals.css';

function RootLayoutContent({ children }) {
  const { theme } = useContext(ThemeContext);
  
  return (
    <html lang="vi">
      <body data-theme={theme}>
        <ThemeConfigProvider>
          {children}
        </ThemeConfigProvider>
      </body>
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <RootLayoutContent>{children}</RootLayoutContent>
    </ThemeProvider>
  );
} 