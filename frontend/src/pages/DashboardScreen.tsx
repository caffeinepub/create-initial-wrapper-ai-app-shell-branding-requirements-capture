import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCoinBalance } from '../hooks/useCoinBalance';
import { useGetCallerUserProfile } from '../hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionHistoryPanel } from '../components/TransactionHistoryPanel';
import {
  MessageSquare,
  Video,
  Clapperboard,
  Mail,
  ImageIcon,
  Coins,
  Sparkles,
  User,
  CheckCircle,
} from 'lucide-react';

export default function DashboardScreen() {
  const { identity } = useInternetIdentity();
  const { data: coinBalance, isLoading: balanceLoading } = useCoinBalance();
  const { data: userProfile } = useGetCallerUserProfile();

  const principal = identity?.getPrincipal().toString() ?? 'Not connected';
  const displayName = userProfile?.displayName ?? 'User';
  const balance = coinBalance !== undefined ? Number(coinBalance) : null;

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat',
      description: 'Chat with AI assistant for any task',
      cost: '20 coins/message',
      view: 'chat',
    },
    {
      icon: Video,
      title: 'YouTube Script',
      description: 'Generate scripts, voiceovers, subtitles & SEO packs',
      cost: '20 coins/generation',
      view: 'youtube-script',
    },
    {
      icon: Clapperboard,
      title: 'AI Video Maker',
      description: 'Create complete video production plans',
      cost: '20 coins/video',
      view: 'ai-video-maker',
    },
    {
      icon: Mail,
      title: 'Cold Email',
      description: 'Generate professional cold email sequences',
      cost: '20 coins/email',
      view: 'cold-email',
    },
    {
      icon: ImageIcon,
      title: 'AI Image Generator',
      description: 'Generate stunning AI images from text prompts',
      cost: '10 coins/image',
      view: 'ai-image-generator',
    },
    {
      icon: User,
      title: 'Profile',
      description: 'Manage your account settings and preferences',
      cost: 'Free',
      view: 'profile',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome to Shake AI, {displayName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your Shake AI dashboard overview
          </p>
        </div>
        <Badge variant="secondary" className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
          <span className="text-xs font-medium">Connected</span>
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Coin Balance Card */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              Coin Balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{balance ?? 0}</span>
                <span className="text-sm text-muted-foreground">coins</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Principal ID Card */}
        <Card className="sm:col-span-2 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Your Account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate mt-1">{principal}</p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Available Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.view}
                className="hover:border-primary/50 transition-colors cursor-default"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <Badge variant="outline" className="mt-3 text-xs">
                    {feature.cost}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Transaction History */}
      <TransactionHistoryPanel />

      {/* Getting Started */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Getting Started with Shake AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• You received <strong>200 free coins</strong> on your first login to get started.</p>
          <p>• Each AI feature costs coins — use them wisely or purchase more anytime.</p>
          <p>• Navigate using the top menu to access all AI tools.</p>
          <p>• Your data is securely stored on the Internet Computer blockchain.</p>
        </CardContent>
      </Card>
    </div>
  );
}
