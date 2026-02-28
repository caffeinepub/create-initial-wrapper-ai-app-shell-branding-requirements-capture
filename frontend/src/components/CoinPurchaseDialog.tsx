import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Check, Loader2, ExternalLink, Zap, Star } from 'lucide-react';
import { useCoinPurchasePlans } from '../hooks/useCoinPurchasePlans';
import { useCreateStripeCheckoutSession } from '../hooks/useCreateStripeCheckoutSession';
import { toast } from 'sonner';
import type { CoinPurchasePlan } from '../backend';

interface CoinPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CoinPurchaseDialog({ open, onOpenChange }: CoinPurchaseDialogProps) {
  const { data: plans, isLoading: plansLoading } = useCoinPurchasePlans();
  const { mutate: createCheckoutSession, isPending: isRedirecting } = useCreateStripeCheckoutSession();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const handlePurchase = () => {
    if (selectedPlanId === null) {
      toast.error('Please select a coin pack first');
      return;
    }

    const selectedPlan = plans?.find((p) => Number(p.id) === selectedPlanId);
    if (!selectedPlan) {
      toast.error('Selected plan not found. Please refresh and try again.');
      return;
    }

    createCheckoutSession(selectedPlan, {
      onSuccess: (session) => {
        toast.success('Redirecting to secure payment...');
        // Must use window.location.href for Stripe redirect — never use router navigation
        window.location.href = session.url;
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to initiate payment. Please try again.');
      },
    });
  };

  const getPlanFeatures = (plan: CoinPurchasePlan): string[] => {
    const coins = Number(plan.coinAmount);
    const features: string[] = [];
    features.push(`${Math.floor(coins / 20)} AI Chat messages`);
    features.push(`${Math.floor(coins / 10)} AI Image generations`);
    if (coins >= 500) features.push('Priority support');
    if (coins >= 1000) features.push('Best value — save more per coin');
    return features;
  };

  const getBadge = (plan: CoinPurchasePlan) => {
    const coins = Number(plan.coinAmount);
    if (coins === 500) return { label: 'BEST VALUE', icon: Star };
    if (coins === 1000) return { label: 'MOST POPULAR', icon: Zap };
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Coins className="h-6 w-6 text-primary" />
            Purchase Coins
          </DialogTitle>
          <DialogDescription>
            Select a coin pack to unlock all AI features. Secure payment via Stripe — supports Cards, UPI, Net Banking &amp; Wallets.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {plansLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : plans && plans.length > 0 ? (
            <div className="grid gap-4">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === Number(plan.id);
                const features = getPlanFeatures(plan);
                const badge = getBadge(plan);

                return (
                  <Card
                    key={Number(plan.id)}
                    className={`cursor-pointer transition-all relative ${
                      isSelected
                        ? 'border-primary border-2 shadow-md bg-primary/5'
                        : 'border-2 border-border hover:border-primary/50 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedPlanId(Number(plan.id))}
                  >
                    {badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <badge.icon className="h-3 w-3" />
                          {badge.label}
                        </span>
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <CardDescription className="text-2xl font-bold text-foreground">
                            {Number(plan.coinAmount).toLocaleString()} Coins
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary">{plan.price}</span>
                          {isSelected && (
                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-4 w-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {features.length > 0 && (
                      <CardContent className="pt-0">
                        <ul className="space-y-1">
                          {features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="h-3 w-3 text-primary shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No coin packs available at the moment. Please try again later.
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isRedirecting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={selectedPlanId === null || isRedirecting || plansLoading}
              className="flex-1 gap-2"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting to Stripe...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Pay Securely with Stripe
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            🔒 Secure payment powered by Stripe. Your payment info is never stored on our servers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
