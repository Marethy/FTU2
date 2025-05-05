<<<<<<< HEAD
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ThemeConfigProvider from '@/components/ThemeConfigProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FTU2 Connect',
  description: 'Kết nối sinh viên FTU2',
};
=======
'use client';
>>>>>>> 1ac81d451b9bfa42d51bb2b5b795ddd4d1242225

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
<<<<<<< HEAD
      <body className={inter.className}>
        <ThemeProvider>
          <ThemeConfigProvider>
            {children}
          </ThemeConfigProvider>
        </ThemeProvider>
=======
      <body data-theme={theme}>
        <ThemeConfigProvider>
          {children}
        </ThemeConfigProvider>
>>>>>>> 1ac81d451b9bfa42d51bb2b5b795ddd4d1242225
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