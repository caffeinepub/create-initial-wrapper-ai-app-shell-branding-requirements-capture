import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { coinQueryKeys } from './coinQueryKeys';

export function usePurchaseCoinsWithStripe() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      stripeSessionId,
      planId,
    }: {
      stripeSessionId: string;
      planId: bigint;
    }): Promise<bigint> => {
      if (!actor) throw new Error('Actor not available');
      // Returns the new coin balance after crediting
      const newBalance = await actor.purchaseCoinsWithStripe(stripeSessionId, planId);
      return newBalance;
    },
    onSuccess: () => {
      // Invalidate all coin-related queries so the UI updates immediately
      queryClient.invalidateQueries({ queryKey: coinQueryKeys.balance });
      queryClient.invalidateQueries({ queryKey: coinQueryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: coinQueryKeys.plans });
    },
  });
}
