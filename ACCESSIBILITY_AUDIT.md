# MelodyHub Accessibility Audit Checklist

## ✅ WCAG 2.1 Level AA Compliance

### 1. Perceivable

#### 1.1 Text Alternatives
- [ ] All images have alt text
- [ ] Decorative images use alt=""
- [ ] Icon buttons have aria-label
- [ ] Complex images have detailed descriptions

#### 1.2 Time-based Media
- [ ] Audio/video have captions (if applicable)
- [ ] Audio descriptions provided (if applicable)

#### 1.3 Adaptable
- [ ] Semantic HTML used (<nav>, <main>, <article>)
- [ ] Heading hierarchy correct (h1 → h2 → h3)
- [ ] Form labels associated with inputs
- [ ] Reading order is logical

#### 1.4 Distinguishable
- [ ] Color contrast 4.5:1 for normal text
- [ ] Color contrast 3:1 for large text (18px+)
- [ ] Color contrast 3:1 for UI components
- [ ] Text resizable up to 200%
- [ ] No text in images (except logos)
- [ ] prefers-reduced-motion respected

---

### 2. Operable

#### 2.1 Keyboard Accessible
- [ ] All functionality keyboard accessible
- [ ] No keyboard traps
- [ ] Skip link present
- [ ] Focus order logical
- [ ] Keyboard shortcuts documented

#### 2.2 Enough Time
- [ ] No time limits (or adjustable)
- [ ] Pause/stop for auto-updating content

#### 2.3 Seizures
- [ ] No flashing content >3 times per second

#### 2.4 Navigable
- [ ] Page title descriptive
- [ ] Focus visible (3px outline)
- [ ] Link text descriptive (no "click here")
- [ ] Multiple ways to find pages (menu, search)
- [ ] Headings descriptive

#### 2.5 Input Modalities
- [ ] Touch targets 44x44px minimum
- [ ] No motion-only gestures
- [ ] Label in name matches accessible name

---

### 3. Understandable

#### 3.1 Readable
- [ ] Lang attribute on <html>
- [ ] Language changes marked with lang
- [ ] Unusual words defined

#### 3.2 Predictable
- [ ] Navigation consistent
- [ ] Components behave predictably
- [ ] No context changes on focus
- [ ] No context changes on input (without warning)

#### 3.3 Input Assistance
- [ ] Form errors identified
- [ ] Labels/instructions provided
- [ ] Error suggestions provided
- [ ] Required fields marked
- [ ] Error prevention for critical actions

---

### 4. Robust

#### 4.1 Compatible
- [ ] Valid HTML
- [ ] ARIA used correctly
- [ ] Name, role, value for all UI components
- [ ] Status messages announced (aria-live)

---

## 🧪 Testing Checklist

### Automated Testing
- [ ] Run Axe DevTools (0 violations)
- [ ] Run Lighthouse (100 accessibility score)
- [ ] Run pa11y (0 errors)
- [ ] Run jest-axe tests

### Keyboard Testing
- [ ] Tab through entire application
- [ ] Access all interactive elements
- [ ] No keyboard traps
- [ ] Focus visible at all times
- [ ] Skip links work
- [ ] Escape closes modals

### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] All content announced correctly
- [ ] Form errors announced
- [ ] Dynamic content updates announced

### Visual Testing
- [ ] Zoom to 200% (no loss of content)
- [ ] Text-only zoom (readable)
- [ ] High contrast mode (readable)
- [ ] Dark mode (sufficient contrast)
- [ ] Color blindness simulation (ChromeLens)

### Mobile Testing
- [ ] Touch targets 44x44px
- [ ] No horizontal scrolling at 320px
- [ ] Orientation works (portrait/landscape)
- [ ] Zoom enabled (no user-scalable=no)

---

## 🐛 Common Issues & Fixes

### Missing Alt Text
**Issue:** `<img src="album.jpg">`
**Fix:** `<img src="album.jpg" alt="Album cover for Dark Side of the Moon by Pink Floyd">`

### Poor Color Contrast
**Issue:** Gray text (#999) on white background (2.8:1)
**Fix:** Darker gray (#5  66) for 4.5:1 ratio

### Missing Form Labels
**Issue:** `<input type="email">`
**Fix:** 
```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Icon Buttons Without Labels
**Issue:** `<button><SearchIcon /></button>`
**Fix:** `<button aria-label="Search"><SearchIcon /></button>`

### Keyboard Trap in Modal
**Issue:** Focus escapes modal
**Fix:** Use useFocusTrap hook

### Animations for Reduced Motion
**Issue:** Animations play regardless of preference
**Fix:** Use useReducedMotion hook

### Missing Focus Indicators
**Issue:** No visible focus state
**Fix:** Add focus-visible styles (already in accessibility.css)

---

## 📊 Accessibility Score Goals

| Tool | Current | Target |
|------|---------|--------|
| Lighthouse | TBD | 100 |
| Axe | TBD | 0 violations |
| WAVE | TBD | 0 errors |
| Pa11y | TBD | 0 errors |

---

##Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Tool](https://wave.webaim.org/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [VoiceOver Guide](https://www.apple.com/accessibility/voiceover/)

---

## Next Steps

1. Run automated tests
2. Fix all violations
3. Manual keyboard testing
4. Screen reader testing
5. User testing with people with disabilities
6. Publish accessibility statement
