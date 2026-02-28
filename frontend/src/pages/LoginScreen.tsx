import { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, LogIn, AlertCircle } from 'lucide-react';
import { useHashRoute } from '../hooks/useHashRoute';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginScreen() {
  const { login, loginStatus, identity, loginError } = useInternetIdentity();
  const { navigate } = useHashRoute();

  const isLoggingIn = loginStatus === 'logging-in';
  const isLoginError = loginStatus === 'loginError';

  // Redirect to dashboard after successful login
  useEffect(() => {
    if (identity) {
      navigate('dashboard');
    }
  }, [identity, navigate]);

  const handleLogin = async () => {
    try {
      // Detect if popup blockers might interfere
      const testPopup = window.open('', '_blank', 'width=1,height=1');
      if (!testPopup || testPopup.closed || typeof testPopup.closed === 'undefined') {
        toast.warning('Popup Blocker Detected', {
          description: 'Please allow popups for this site to enable login.',
        });
      } else {
        testPopup.close();
      }

      await login();
    } catch (error: any) {
      if (error.message === 'User is already authenticated') {
        navigate('dashboard');
      } else {
        toast.error('Login Failed', {
          description: error?.message || 'An unexpected error occurred during login. Please try again.',
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="/assets/generated/wrapper-ai-logo.dim_512x512.png"
                alt="Shake AI Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl"
              />
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Shake AI
                </h1>
                <span className="text-xs text-muted-foreground font-normal">
                  AI-Powered Assistant
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <Card className="w-full max-w-md shadow-lg border-2">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl">Welcome to Shake AI</CardTitle>
            <CardDescription className="text-base">
              Sign in with Internet Identity to access your AI assistant dashboard, chat, and all features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Alert */}
            {isLoginError && loginError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {loginError.message || 'Login failed. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full h-12 text-base"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>
                Shake AI uses Internet Identity for secure, passwordless authentication.
              </p>
              <p className="text-xs">
                Your data is private and stored on the Internet Computer blockchain.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Shake AI. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
