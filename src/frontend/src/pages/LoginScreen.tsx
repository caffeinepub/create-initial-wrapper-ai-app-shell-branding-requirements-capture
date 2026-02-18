import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, LogIn } from 'lucide-react';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
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
                alt="Wrapper AI Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl"
              />
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Wrapper AI
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
            <CardTitle className="text-2xl sm:text-3xl">Welcome to Wrapper AI</CardTitle>
            <CardDescription className="text-base">
              Sign in with Internet Identity to access your AI assistant dashboard, chat, and all features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  Sign in with Internet Identity
                </>
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>Secure authentication powered by Internet Computer</p>
              <p className="text-xs">New users receive 200 free coins on first login</p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} Wrapper AI. All rights reserved.
            </p>
            <p className="text-center sm:text-right">
              Built with{' '}
              <span className="text-primary inline-block animate-pulse">♥</span>{' '}
              using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'wrapper-ai'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
