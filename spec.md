# Specification

## Summary
**Goal:** Fix the Groq API key integration, improve error handling, and add client-side API key validation in the AI Chat feature.

**Planned changes:**
- Fix `useChat.ts` to correctly read, trim, and pass the user-entered Groq API key as `Authorization: Bearer <key>` in all API requests
- Replace the hardcoded `VITE_GROQ_API_KEY` in `frontend/.env` with a placeholder; ensure the app prioritizes the key entered by the user at runtime
- Improve error handling in `useChat.ts` and `AIChatScreen.tsx` to display distinct inline messages for 401 (Invalid API Key), 429 (Rate limit exceeded), and network errors
- Add client-side validation on the API key input field to check that the value starts with `gsk_` and meets a minimum length, showing an inline error if the format is incorrect

**User-visible outcome:** Users can enter a valid Groq API key in the app and send messages without authentication errors. If an error occurs (invalid key, rate limit, network failure), a clear and actionable message is shown inline in the chat UI. Invalid key formats are caught before submission.
