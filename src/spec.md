# Specification

## Summary
**Goal:** Gate the app behind Internet Identity login and grant new users 200 coins on first login, with the balance shown immediately after authentication.

**Planned changes:**
- Enforce a home-page authentication gate: when not authenticated, render only the Login screen and block access/navigation to Dashboard and all AI tools.
- Add/confirm an auth initialization loading state that resolves into either the Login screen (unauthenticated) or the authenticated app layout (authenticated).
- Update Login screen copy to be fully in English and to reference only “Sign in with Internet Identity” (no email/password, Google, or Apple claims).
- Implement/verify backend-backed first-login initialization to grant 200 coins exactly once per new user (Principal), persist the coin balance to the user record, and display the stored balance in the authenticated UI (e.g., header/dashboard) immediately after login.

**User-visible outcome:** Users must sign in with Internet Identity to access the app; after first login they receive 200 coins once, and their current coin balance is visible in the authenticated UI and remains consistent across logouts/logins.
