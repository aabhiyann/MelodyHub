# 🎓 Software Testing: The 30-Minute Crash Course

> **The Golden Rule**: "Testing is just code that checks if your other code works."

---

## 1. The Concepts (The "Buzzwords")

| Concept | What it means | MelodyHub Example |
| :--- | :--- | :--- |
| **Unit Testing** | Testing *one tiny piece* in isolation (a single function or component). No database, no API. | `formatDuration(65)` returns `"1:05"`. |
| **Integration Testing** | Testing how *multiple pieces* work together. Does the API talk to the DB? | `POST /api/login` actually creates a session in the DB. |
| **E2E (End-to-End)** | Testing the *entire flow* like a user. | Automated bot opens Chrome, clicks "Login", types password. (We plan this, but haven't built it yet). |
| **Mocking** | Faking a complex part (like a database or API) so you can test the rest easily. | "Pretend the API returned 5 songs" so I can test if the list renders 5 items. |

---

## 2. Your Toolkit (What we use)

### Backend (The "Heavy Lifters")
*   **Jest**: The "Runner". It finds files ending in `.test.ts` and runs them.
*   **Supertest**: The "Fake Caller". It sends HTTP requests (GET/POST) to your Express app without needing a browser.
*   **MongoMemoryServer**: The "Fake DB". It spins up a real MongoDB in your RAM.
    *   *Why?* It's faster than a real DB and starts empty every time, so tests don't conflict.

### Frontend (The "Speedsters")
*   **Vitest**: The "Runner". Like Jest, but built for Vite. fast.
*   **React Testing Library**: The "User Simulator".
    *   *Instead of:* `check if variable 'isOpen' is true`
    *   *It does:* `screen.getByText('Welcome')` (Checks what the user *sees*).

---

## 3. Real Code Examples (Read this if they ask "How?")

### A. Unit Test (Pure Logic)
**File**: `frontend/src/lib/__tests__/utils.test.ts`
*What it does*: Tests the music player time formatter.
```typescript
it('formats seconds correctly', () => {
    // Input: 125 seconds
    // Expected Output: "2:05"
    expect(formatDuration(125)).toBe('2:05'); 
});
```

### B. Integration Test (API + DB)
**File**: `backend/src/__tests__/auth.integration.test.ts`
*What it does*: Tests the entire login flow.
```typescript
it('should create a user', async () => {
    // 1. Send Fake Request
    const res = await request.post('/api/auth/callback').send(mockUser);
    
    // 2. Check HTTP Code
    expect(res.status).toBe(200);

    // 3. Check REAL Database (The "Integration" part)
    const user = await User.findOne({ email: 'test@test.com' });
    expect(user).toBeTruthy(); // Confirm it actually saved!
});
```

### C. Component Test (UI)
**File**: `frontend/src/pages/__tests__/SearchPage.test.tsx`
*What it does*: Checks if the Search page works.
```typescript
it('filters songs', async () => {
    // 1. Render the component in memory
    render(<SearchPage />);
    
    // 2. Find the input and type "Hello"
    const input = screen.getByPlaceholderText('Search...');
    await userEvent.type(input, 'Hello');

    // 3. Verify "Hello World" appears on screen
    expect(screen.getByText('Hello World')).toBeInTheDocument();
});
```

---

## 4. Q&A Speed Round

**Q: "Do you do TDD (Test Driven Development)?"**
*A: "Not strictly. I usually write the code first, then add tests to ensure it covers edge cases and prevents future regressions."*

**Q: "What is regression testing?"**
*A: "It's just running my existing test suite. Every time I run `npm test` before a commit, I'm doing regression testing—ensuring my new code didn't break old features."*

**Q: "Why Vitest instead of Jest for frontend?"**
*A: "Because we use Vite as our builder. Vitest shares the same config, so I don't need to duplicate setup. It's also much faster."*
