# Notifications

**Feature:** Global notification bell with dropdown; friend requests first, then other notifications.  
**References:** [DESIGN_PLAN.md](../DESIGN_PLAN.md) (Notifications), [CHANGELOG.md](../../CHANGELOG.md).

---

## Overview

- **Bell:** Top-right in TopBar (web); accessible on mobile. Red badge with unread count (number; "99+" when over 99).
- **Dropdown:** Friend requests block first (accept/decline inline, no redirect). Then list of other notifications (follows, likes, comments, system). Each item: optional avatar, message text, relative timestamp, unread indicator (left border). "Mark all as read." Empty state: "You're all caught up."

Friend requests are **not** shown only on the chat page; they live in this notification system so users can act from any page.

---

## Design (DESIGN_PLAN)

- Friend requests: Accept = primary (accent), Decline = outline.
- Notifications: Avatar from metadata when available; relative time (e.g. "5m ago"); unread = left border accent.

---

## Key files

| File | Purpose |
|------|---------|
| `components/features/notifications/NotificationBell.tsx` | Bell button, badge count, toggles dropdown. |
| `components/features/notifications/NotificationDropdown.tsx` | Dropdown content: friend requests block, then filtered list (FRIEND_REQUEST excluded from list), mark all read, empty state. |
| `components/features/notifications/NotificationItem.tsx` | Single notification: avatar (from metadata), title/body, relative timestamp, unread left border. |
| `stores/NotificationStore` (or equivalent) | Notifications list, unread count, fetch, mark read. |
| `lib/utils.ts` | `formatRelativeTime(date)` for "Just now", "5m ago", "Yesterday", etc. |

---

## Backend

- **Friend request:** When a user sends a friend request, backend creates a `FRIEND_REQUEST` notification with metadata: `senderId`, `requestId`, `senderImageUrl`, `senderName`. Socket emits `new_notification` with a **plain object** (e.g. Mongoose doc `toObject()`) so the client receives a consistent shape.
- **Real-time:** Accepting a friend request updates both sides; socket events (e.g. `friend_request_accepted`, `new_notification`) trigger refetch so no manual reload is needed.

---

## Filtering

- In the dropdown, `FRIEND_REQUEST` notifications are shown only in the "Friend requests" block. They are **filtered out** from the generic notification list below to avoid duplication.
