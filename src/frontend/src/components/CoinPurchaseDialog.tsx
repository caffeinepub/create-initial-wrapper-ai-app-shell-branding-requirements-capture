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
import { Coins, Check, Loader2 } from 'lucide-react';
import { useCoinPurchasePlans } from '../hooks/useCoinPurchasePlans';
import { usePurchaseCoins } from '../hooks/usePurchaseCoins';
import { toast } from 'sonner';

interface CoinPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CoinPurchaseDialog({ open, onOpenChange }: CoinPurchaseDialogProps) {
  const { data: plans, isLoading: plansLoading } = useCoinPurchasePlans();
  const { mutate: purchaseCoins, isPending: isPurchasing } = usePurchaseCoins();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const handlePurchase = () => {
    if (selectedPlanId === null) {
      toast.error('Please select a coin pack');
      return;
    }

    purchaseCoins(selectedPlanId, {
      onSuccess: (newBalance) => {
        toast.success(`Purchase successful! Your new balance is ${newBalance} coins.`);
        onOpenChange(false);
        setSelectedPlanId(null);
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Purchase failed. Please try again.');
      },
    });
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
            Select a coin pack to continue using all features without interruption
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
                return (
                  <Card
                    key={Number(plan.id)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary border-2 shadow-md'
                        : 'border-2 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPlanId(Number(plan.id))}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <CardDescription className="text-2xl font-bold text-foreground">
                            {Number(plan.coinAmount)} Coins
                          </CardDescription>
                        </div>
                        {isSelected && (
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Price: <span className="font-semibold text-foreground">{plan.price}</span>
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No coin packs available at the moment
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPurchasing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={selectedPlanId === null || isPurchasing}
              className="flex-1"
            >
              {isPurchasing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Purchase Coins'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
