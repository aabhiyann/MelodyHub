# Chat UI

**Feature:** Real-time chat with friends.  
**References:** DESIGN_PLAN.md (Chat), CHANGELOG.md.

---

## Overview

- **Page:** frontend/src/pages/ChatPage.tsx
- **State:** ChatStore (frontend/src/stores/ChatStore.ts)
- **Real-time:** ChatManager provider + Socket.io (messages, typing, friend requests)

Users see a list of conversations (friends). Selecting a friend shows the message thread. Messages are sent/received in real time. Friend requests are handled in the notification system (bell), not only on the chat page.

---

## Design (DESIGN_PLAN)

- **Bubbles:** iMessage-style. Sender (self) right, accent gradient/solid (#22C55E). Receiver (other) left, elevated background + subtle border.
- **Timestamps:** Caption style; reveal on hover/tap.
- **Typing indicator:** Other-bubble style, muted text, animated three dots (keyframe typing-dot in tailwind.config.ts).
- **Auto-scroll:** After every sent message; optional new-messages chip when user scrolls up.

---

## Key files

- pages/ChatPage.tsx — Layout, conversation list, message list, input, typing indicator, bubble styling
- stores/ChatStore.ts — Conversations, messages, friends, send message, accept/reject friend request
- providers/ChatManager.ts — Socket.io: connect, send message, typing, friend request accept/reject, refetch on friend_request_accepted / new_notification
- tailwind.config.ts — typing-dot keyframe for typing indicator

---

## Deep linking

From another user Profile, Message button navigates to Chat and opens the conversation with that user when they are in the friends list. Implemented via openUserId in route state / useLocation and effect in ChatPage to open the correct conversation.

---

## Friend requests

Pending friend requests are shown in the notification bell dropdown (top right), not only on the chat page. Accept/decline inline. See NOTIFICATIONS.md. Chat page may still show a friends list; accepting a request in the bell updates both sides in real time (no manual reload).
