import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Sparkles, LayoutDashboard, MessageSquare, User, Video, Film, Menu, X, Mail, ImageIcon, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardScreen from '../pages/DashboardScreen';
import AIChatScreen from '../pages/AIChatScreen';
import ProfileScreen from '../pages/ProfileScreen';
import YouTubeScriptScreen from '../pages/YouTubeScriptScreen';
import AIVideoMakerScreen from '../pages/AIVideoMakerScreen';
import ColdEmailScreen from '../pages/ColdEmailScreen';
import AIImageGeneratorScreen from '../pages/AIImageGeneratorScreen';
import { useHashRoute } from '../hooks/useHashRoute';
import { useCoinBalance } from '../hooks/useCoinBalance';
import { CoinPurchaseDialog } from './CoinPurchaseDialog';
import { LOW_BALANCE_THRESHOLD } from '../constants/coins';

export default function AuthenticatedLayout() {
  const { actor, isFetching } = useActor();
  const { currentView, navigate } = useHashRoute();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const { data: coinBalance, isLoading: balanceLoading, isFetched: balanceFetched } = useCoinBalance();

  const { data: appInfo, isLoading: isLoadingAppInfo } = useQuery<string>({
    queryKey: ['appInfo'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getAppInfo();
    },
    enabled: !!actor && !isFetching,
  });

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return <AIChatScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'youtube-script':
        return <YouTubeScriptScreen />;
      case 'ai-video-maker':
        return <AIVideoMakerScreen />;
      case 'cold-email':
        return <ColdEmailScreen />;
      case 'ai-image-generator':
        return <AIImageGeneratorScreen />;
      case 'dashboard':
      default:
        return <DashboardScreen />;
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isLowBalance = coinBalance !== undefined && coinBalance <= LOW_BALANCE_THRESHOLD;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
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
                {appInfo && !isLoadingAppInfo && (
                  <span className="text-xs text-muted-foreground font-normal">
                    {appInfo}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Coin Balance Display */}
              {balanceLoading && !balanceFetched ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                  <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : (
                coinBalance !== undefined && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    <Coins className="h-4 w-4" />
                    <span className="text-sm font-semibold">{coinBalance}</span>
                  </div>
                )
              )}

              {/* Upgrade Button (Low Balance) */}
              {isLowBalance && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPurchaseDialogOpen(true)}
                  className="hidden sm:flex border-primary text-primary hover:bg-primary/10"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  Buy Coins
                </Button>
              )}

              {/* Desktop Navigation */}
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('dashboard')}
                className="hidden md:flex"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={currentView === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('chat')}
                className="hidden md:flex"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Chat
              </Button>
              <Button
                variant={currentView === 'youtube-script' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('youtube-script')}
                className="hidden md:flex"
              >
                <Video className="h-4 w-4 mr-2" />
                YouTube Script
              </Button>
              <Button
                variant={currentView === 'ai-video-maker' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('ai-video-maker')}
                className="hidden md:flex"
              >
                <Film className="h-4 w-4 mr-2" />
                AI Video Maker
              </Button>
              <Button
                variant={currentView === 'ai-image-generator' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('ai-image-generator')}
                className="hidden md:flex"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                AI Image
              </Button>
              <Button
                variant={currentView === 'cold-email' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('cold-email')}
                className="hidden md:flex"
              >
                <Mail className="h-4 w-4 mr-2" />
                Cold Email
              </Button>
              <Button
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('profile')}
                className="hidden md:flex"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {isLowBalance && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setPurchaseDialogOpen(true); closeMobileMenu(); }}
                  className="w-full justify-start border-primary text-primary"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  Buy Coins
                </Button>
              )}
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => { navigate('dashboard'); closeMobileMenu(); }}
                className="w-full justify-start"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={currentView === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => { navigate('chat'); closeMobileMenu(); }}
                className="w-full justify-start"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Chat
              </Button>
              <Button
                variant={currentView === 'youtube-script' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => { navigate('youtube-script'); closeMobileMenu(); }}
                className="w-full justify-start"
              >
                <Video className="h-4 w-4 mr-2" />
                YouTube Script
              </Button>
              <Button
                variant={currentView === 'ai-video-maker' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => { navigate('ai-video-maker'); closeMobileMenu(); }}
                className="w-full justify-start"
              >
                <Film className="h-4 w-4 mr-2" />
                AI Video Maker
              </Button>
              <Button
                variant={currentView === 'ai-image-generator' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => { navigate('ai-image-generator'); closeMobileMenu(); }}
                className="w-full justify-start"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                AI Image Generator
              </Button>
              <Button
                variant={currentView === 'cold-email' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => { navigate('cold-email'); closeMobileMenu(); }}
                className="w-full justify-start"
              >
                <Mail className="h-4 w-4 mr-2" />
                Cold Email
              </Button>
              <Button
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => { navigate('profile'); closeMobileMenu(); }}
                className="w-full justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-6 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Wrapper AI. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with{' '}
              <span className="text-destructive">❤</span>{' '}
              using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Coin Purchase Dialog */}
      <CoinPurchaseDialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen} />
    </div>
  );
}
