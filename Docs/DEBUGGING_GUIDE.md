# Developer Debugging Guide & Lessons Learned

This document tracks common pitfalls, tricky bugs, and architectural constraints discovered during the development and QA of MelodyHub.

## 1. Express Middleware Ordering (CORS vs Rate Limiting)
**The Bug:** The frontend reports `CORS Error: Missing Access-Control-Allow-Origin header` when interacting with the API under heavy load or initial socket polling.
**The Cause:** The `express-rate-limit` middleware was placed *above* the `cors()` middleware in the Express initialization (`app.ts`). When a client hit the rate limit (e.g., sending many `OPTIONS` preflight requests during connection), the rate limiter instantly returned a `429 Too Many Requests` response *before* the CORS middleware could append the required headers. The browser received a 429 without CORS headers and misreported it as a strict CORS violation.
**The Fix:** Always initialize `app.use(cors(...))` immediately after `const app = express()` and **before** any rate limiters, helmet headers, or routing.

## 2. Mobile Bottom Navigation & Safe Areas
**The Bug:** Content at the very bottom of infinite scroll lists (like the Home or Browse tabs) gets permanently hidden behind the fixed `BottomTabBar`.
**The Cause:** Modern mobile devices (especially iOS) have a "Safe Area" home indicator at the bottom of the screen. A standard padding like `pb-16` or `pb-24` might clear the height of the custom UI tab bar, but fails to account for the additional OS-level safe area margin.
**The Fix:** Apply generous bottom padding (e.g., `pb-32` or `pb-36`) specifically to the `#main-content` wrapper to ensure the bottom-most array items can be scrolled completely into the upper viewport. Use `paddingBottom: 'env(safe-area-inset-bottom)'` on the fixed nav bar itself.

## 3. Tailwind Flexbox Constraints (The `block` Override)
**The Bug:** A flex container suddenly loses its layout properties and elements start rendering underneath each other (or off-screen) when certain states are active.
**The Cause:** Using the `block` class on dynamic state renders (e.g., explicitly setting `className={cn("hidden md:flex", isOpen ? "block" : "hidden")}`) completely destroys the `flex` display property. The container reverts to standard block flow, pushing internal elements out of typical flex bounds.
**The Fix:** If an element defaults to Flexbox, state overrides should toggle between `flex` and `hidden`—**never** `block`. Example: `isOpen ? "flex" : "hidden md:flex"`.
