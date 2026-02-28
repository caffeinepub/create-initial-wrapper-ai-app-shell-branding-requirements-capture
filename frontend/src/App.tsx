import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import AppContent from './components/AppContent';
import { Toaster } from '@/components/ui/sonner';
import { useMemo } from 'react';
import PwaInstallBanner from './components/PwaInstallBanner';

function App() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <AppContent />
        <Toaster />
        <PwaInstallBanner />
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}

export default App;
