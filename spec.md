# Specification

## Summary
**Goal:** Integrate real Stripe live-mode payments to allow users to purchase coins via three defined packages, with full backend verification, coin crediting, and transaction history tracking.

**Planned changes:**
- Add backend methods: `getCoinPlans` (100/$1.99, 500/$7.99, 1000/$14.99), `createStripeCheckoutSession` (live mode), and `verifyAndCreditCoins` to atomically credit coins after successful payment
- Record a coin purchase transaction entry (type 'credit') in the user's transaction history upon successful payment, visible in TransactionHistoryPanel
- Update `CoinPurchaseDialog` to display the three real packages and redirect users to the live Stripe-hosted checkout page
- Add `PaymentSuccessScreen` that reads session/plan IDs from the URL, calls backend to verify and credit coins, and updates the displayed balance
- Add `PaymentFailureScreen` informing the user no charge was made with a retry option
- Configure `VITE_STRIPE_PUBLISHABLE_KEY` for live-mode Stripe.js initialization and document it in `frontend/.env.example`

**User-visible outcome:** Users can purchase coin packages using real Stripe payments, see their updated coin balance immediately after a successful purchase, and view coin purchase entries in their transaction history.
