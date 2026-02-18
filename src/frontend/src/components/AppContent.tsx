import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoginScreen from '../pages/LoginScreen';
import AuthenticatedLayout from './AuthenticatedLayout';

export default function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();

  // Show loading state while checking for stored identity
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth gate: if no identity, show only login screen
  if (!identity) {
    return <LoginScreen />;
  }

  // Authenticated: show full app
  return <AuthenticatedLayout />;
}
