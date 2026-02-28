import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ShoppingItem, CoinPurchasePlan } from '../backend';

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateStripeCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (plan: CoinPurchasePlan): Promise<CheckoutSession> => {
      if (!actor) throw new Error('Actor not available');

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      // Use hash-based routing with query params for success/cancel URLs
      const successUrl = `${baseUrl}/#payment-success?session_id={CHECKOUT_SESSION_ID}&plan_id=${plan.id}`;
      const cancelUrl = `${baseUrl}/#payment-failure`;

      // Parse numeric value from price string (e.g. "₹99" → 99, "₹449" → 449)
      const priceNumeric = parseFloat(plan.price.replace(/[^0-9.]/g, ''));
      // Convert to smallest currency unit (paise for INR)
      const priceInSmallestUnit = Math.round(priceNumeric * 100);

      const shoppingItem: ShoppingItem = {
        productName: plan.name,
        productDescription: `${Number(plan.coinAmount)} coins for your Shake AI account`,
        quantity: BigInt(1),
        priceInCents: BigInt(priceInSmallestUnit),
        currency: plan.currencyCode.toLowerCase(),
      };

      const result = await actor.createCheckoutSession([shoppingItem], successUrl, cancelUrl);
      const session = JSON.parse(result) as CheckoutSession;

      if (!session?.url) {
        throw new Error('Payment session could not be created. Please try again or contact support.');
      }

      return session;
    },
  });
}
