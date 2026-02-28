import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, Coins, ShoppingCart } from 'lucide-react';
import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { TransactionType } from '../backend';

export function TransactionHistoryPanel() {
  const { data: transactions, isLoading } = useTransactionHistory();

  const formatAmount = (amount: bigint, type: TransactionType) => {
    const num = Number(amount);
    if (type === TransactionType.credit) {
      return `+${num.toLocaleString()}`;
    }
    return `-${num.toLocaleString()}`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000); // Convert nanoseconds to milliseconds
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: TransactionType, feature: string) => {
    if (type === TransactionType.credit) {
      const isPurchase = feature.toLowerCase().includes('purchase') || feature.toLowerCase().includes('stripe') || feature.toLowerCase().includes('bonus');
      return isPurchase
        ? <ShoppingCart className="h-4 w-4 text-green-600" />
        : <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    return <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getTransactionBadge = (type: TransactionType) => {
    if (type === TransactionType.credit) {
      return <Badge variant="outline" className="text-xs border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20">Credit</Badge>;
    }
    if (type === TransactionType.featureUsage) {
      return <Badge variant="outline" className="text-xs border-primary/50 text-primary">Usage</Badge>;
    }
    return <Badge variant="outline" className="text-xs border-destructive/50 text-destructive">Debit</Badge>;
  };

  return (
    <Card className="shadow-sm border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          Recent coin activity — purchases, feature usage, and rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : transactions && transactions.length > 0 ? (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {transactions.map((transaction, index) => {
                const isCredit = transaction.transactionType === TransactionType.credit;
                return (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCredit ? 'bg-green-500/10' : 'bg-destructive/10'
                        }`}
                      >
                        {getTransactionIcon(transaction.transactionType, transaction.feature)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium truncate">{transaction.feature}</p>
                          {getTransactionBadge(transaction.transactionType)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-sm font-semibold ${
                          isCredit ? 'text-green-600' : 'text-destructive'
                        }`}
                      >
                        {formatAmount(transaction.amount, transaction.transactionType)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Bal: {Number(transaction.balanceAfter).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Coins className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No transactions yet.</p>
            <p className="text-xs mt-1">Start using features or purchase coins to see your activity here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
