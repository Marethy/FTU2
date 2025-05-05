'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeConfigProvider } from '@/components/ThemeConfigProvider';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

function ClientProviders({ children }) {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div data-theme={theme}>
      <ThemeConfigProvider>
        {children}
      </ThemeConfigProvider>
    </div>
  );
}

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <ClientProviders>{children}</ClientProviders>
    </ThemeProvider>
  );
} 