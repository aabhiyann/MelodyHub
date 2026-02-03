/**
 * README for Admin Setup
 * 
 * To make a user admin, follow these steps:
 */

# Admin Setup Guide

## Method 1: Using the makeAdmin script

```bash
cd backend
npm run build  # Compile TypeScript
node dist/scripts/makeAdmin.js <clerkId>
```

## Method 2: Direct MongoDB Update (Quickest)

```bash
mongosh melodyhub
```

```javascript
// Find all users
db.users.find({}, { fullName: 1, clerkId: 1, role: 1 }).pretty()

// Make a specific user admin by clerkId
db.users.updateOne(
  { clerkId: "user_391oXMCrU2iD3CgvwqTp17pVKZ8" },
  { $set: { role: "admin" } }
)

// Make the most recent user admin
db.users.updateOne(
  {},
  { $set: { role: "admin" } },
  { sort: { createdAt: -1 } }
)

// Verify
db.users.find({ role: "admin" }, { fullName: 1, role: 1 })
```

## Method 3: Environment Variable (Temporary)

Add to backend/.env:
```
ADMIN_EMAIL=your.email@example.com
```

This will grant admin access to any user with that email (checked via Clerk).

## Checking Admin Status

After making a user admin:
1. Refresh the frontend
2. Check the left sidebar - you should see an "Admin" link
3. Or check directly: http://localhost:5173/admin

## List All Users

```bash
cd backend
npx tsx scripts/listUsers.ts
```
