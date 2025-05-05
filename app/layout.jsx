import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ThemeConfigProvider from '@/components/ThemeConfigProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FTU2 Connect',
  description: 'Kết nối sinh viên FTU2',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ThemeProvider>
          <ThemeConfigProvider>
            {children}
          </ThemeConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 