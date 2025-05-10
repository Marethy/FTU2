import ThemeConfigProvider from '@/components/ThemeConfigProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { App } from 'antd';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FTU2 Connect',
  description: 'Kết nối sinh viên FTU2',
};

// Client Component
function Providers({ children }) {
  return (
    <ThemeProvider>
      <ThemeConfigProvider>
        {children}
      </ThemeConfigProvider>
    </ThemeProvider>
  );
}

// Server Component
export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          <App>
            {children}
          </App>
        </Providers>
      </body>
    </html>
  );
} 