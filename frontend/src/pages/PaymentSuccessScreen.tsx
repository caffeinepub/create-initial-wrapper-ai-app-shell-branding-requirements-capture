import { useEffect, useRef } from 'react';
import { CheckCircle, Coins, Loader2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePurchaseCoinsWithStripe } from '../hooks/usePurchaseCoinsWithStripe';
import { useCoinPurchasePlans } from '../hooks/useCoinPurchasePlans';
import { toast } from 'sonner';
import type { RouteKey } from '../hooks/useHashRoute';

interface PaymentSuccessScreenProps {
  onNavigate: (view: RouteKey) => void;
}

export default function PaymentSuccessScreen({ onNavigate }: PaymentSuccessScreenProps) {
  const { mutate: purchaseCoinsWithStripe, isPending, isSuccess, isError, error, data: newBalance } = usePurchaseCoinsWithStripe();
  const { data: plans } = useCoinPurchasePlans();
  const hasProcessed = useRef(false);
  const planIdRef = useRef<bigint | null>(null);

  useEffect(() => {
    if (hasProcessed.current) return;

    // Parse query params from hash fragment
    // Hash format: #payment-success?session_id=xxx&plan_id=yyy
    const hashPart = window.location.hash;
    const queryStart = hashPart.indexOf('?');
    if (queryStart === -1) return;

    const queryString = hashPart.slice(queryStart + 1);
    const params = new URLSearchParams(queryString);
    const sessionId = params.get('session_id');
    const planIdStr = params.get('plan_id');

    if (!sessionId || !planIdStr) return;

    hasProcessed.current = true;
    const planId = BigInt(planIdStr);
    planIdRef.current = planId;

    purchaseCoinsWithStripe(
      { stripeSessionId: sessionId, planId },
      {
        onSuccess: (balance) => {
          toast.success(`Coins added successfully! New balance: ${Number(balance)}`);
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Failed to credit coins. Please contact support.');
        },
      }
    );
  }, [purchaseCoinsWithStripe]);

  // Find the plan to display the coin amount credited
  const purchasedPlan = plans?.find((p) => planIdRef.current !== null && p.id === planIdRef.current);
  const coinsAdded = purchasedPlan ? Number(purchasedPlan.coinAmount) : null;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardHeader className="pb-4">
          {isPending && (
            <>
              <div className="flex justify-center mb-4">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
              </div>
              <CardTitle className="text-2xl">Processing Payment</CardTitle>
              <CardDescription>
                Please wait while we verify your payment and credit your coins...
              </CardDescription>
            </>
          )}

          {isSuccess && (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">Payment Successful! 🎉</CardTitle>
              <CardDescription>
                Your coins have been added to your account and are ready to use.
              </CardDescription>
            </>
          )}

          {isError && (
            <>
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-2xl text-destructive">Processing Error</CardTitle>
              <CardDescription>
                {(error as any)?.message || 'There was an issue crediting your coins.'}
              </CardDescription>
            </>
          )}

          {!isPending && !isSuccess && !isError && (
            <>
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">Invalid Payment Link</CardTitle>
              <CardDescription>
                No payment session found. Please try purchasing again.
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {isSuccess && (
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                <span className="font-semibold text-lg">
                  {coinsAdded !== null
                    ? `${coinsAdded.toLocaleString()} coins added!`
                    : 'Coins credited to your account!'}
                </span>
              </div>
              {newBalance !== undefined && (
                <p className="text-sm opacity-80">
                  New balance: <strong>{Number(newBalance).toLocaleString()} coins</strong>
                </p>
              )}
            </div>
          )}

          {isError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm text-left">
              <p className="font-medium mb-1">What to do next:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>If you were charged, please contact support with your session details.</li>
                <li>Your coins balance has not been affected if the error occurred.</li>
                <li>You can retry the purchase from the dashboard.</li>
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => onNavigate('dashboard')}
              className="w-full gap-2"
              disabled={isPending}
            >
              <ArrowLeft className="h-4 w-4" />
              Go to Dashboard
            </Button>

            {isError && (
              <Button
                variant="outline"
                onClick={() => {
                  hasProcessed.current = false;
                  window.location.reload();
                }}
                className="w-full gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
