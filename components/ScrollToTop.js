import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ScrollToTop() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // Handle initial page load
    handleRouteChange();

    // Handle route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return null;
} 