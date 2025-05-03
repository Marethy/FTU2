import { ThemeProvider } from '../contexts/ThemeContext';
import ThemeConfigProvider from '../components/ThemeConfigProvider';
import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <ThemeProvider>
          <ThemeConfigProvider>
            {children}
          </ThemeConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 