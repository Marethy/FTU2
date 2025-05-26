import ThemeConfigProvider from '@/components/ThemeConfigProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { App } from 'antd';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'activeU',
  description: 'Kết nối sinh viên activeU',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
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
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png " />
      </head>
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