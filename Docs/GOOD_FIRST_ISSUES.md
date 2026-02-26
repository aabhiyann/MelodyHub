# Good First Issues

Welcome to MelodyHub! If you're looking to contribute but aren't sure where to start, you're in the right place. These issues are specifically curated to be accessible for newcomers to the codebase.

## UI/UX & Styling
- **Audit Tooltip Z-Indexes:** Check for any tooltips across the application that might be rendering beneath overlapping modal backgrounds or heavy glassmorphic panels. Ensure global z-index scaling is consistent.
- **Verify Safe-Area Paddings:** We recently updated `#main-content` to use `pb-32` bottom padding. We need contributors to test the application on extreme viewport sizes (e.g., iPhone SE vs iPhone 16 Pro Max) and verify there is no awkward clipping on scrollable components.
- **Identify Legacy Tailwind Extraneous Classes:** Search the `frontend/` components for redundant utility classes (e.g., assigning `block` overriding `flex`, or declaring `relative` when the parent is already forcing absolute constraints).

## Backend & API
- **Standardize Error Messages:** Ensure all API error responses (`res.status(400).json(...)`) use a consistent structural pattern `{ success: false, message: string }` across all controllers.
- **Audit Limiter Thresholds:** We loosened the global rate limit to `500/15m` to support initial socket polling payload bursts. Explore ways to implement a separate, stricter rate limiter exclusively for Auth/Login endpoints to prevent brute-forcing.

## How to Claim an Issue
If you'd like to work on one of these, please review `CONTRIBUTING.md` for our branch workflow, and open a PR with the prefix `fix/` or `feat/`.
