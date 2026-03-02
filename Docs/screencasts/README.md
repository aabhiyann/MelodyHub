# QA Screencasts

Short screen recordings for key flows where movement and animation matter. Use for visual regression and UX review.

## Naming convention

`{flow}-{viewport}-{variant}.webm` — e.g. `player-expand-mobile.webm`, `auth-signin-desktop.webm`.

## Recommended recordings

| Filename | Description | Viewport |
|----------|-------------|----------|
| **first-impression-load-desktop.webm** | Initial page load, layout stability | 1440×900 |
| **first-impression-load-mobile.webm** | Initial page load on mobile | 390×844 |
| **player-mini-to-expanded-desktop.webm** | Mini bar → full player slide-up | 1440×900 |
| **player-mini-to-expanded-mobile.webm** | Mini bar → full-screen player on mobile | 390×844 |
| **player-expand-collapse-mobile.webm** | Expand and collapse cycle | 390×844 |
| **nav-tab-switch-mobile.webm** | Bottom nav tab transitions | 390×844 |
| **notifications-dropdown-desktop.webm** | Bell click, dropdown open/close | 1440×900 |
| **modal-open-close.webm** | Create playlist or AI modal open/close | 1440×900 |

Capture with browser DevTools (e.g. Chrome Recorder) or a tool like OBS. Keep each under 15 seconds.
