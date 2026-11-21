# IG Cinema View

IG Cinema View is a Manifest V3 Google Chrome extension that transforms Instagram Web into an immersive, widescreen viewing experience. It expands feed posts and horizontal videos to cinema dimensions, adapts portrait media responsively, maintains high-resolution asset delivery, and preserves native Instagram navigation.

---

## Features

- **Widescreen Cinema Layout**: Expands horizontal feeds, posts, and videos across the viewport up to 1200px width with automatic proportional height scaling.
- **Adaptive Orientation**: Intelligently distinguishes landscape, square, and portrait content, preventing pillarboxing or empty side voids on portrait media.
- **Strict Route Isolation**: Operates exclusively on the Home feed (`instagram.com/`). Reels (`/reels/`, `/reel/`), Explore, and Stories remain untouched in their native layout.
- **Persistent Header and Stories**: Maintains full visibility and spacing for top navigation and the Stories tray.
- **Audio Controls**: Video audio mute and unmute toggles remain accessible and layered above media overlays.
- **High-Resolution Media**: Enforces maximum resolution descriptors from media source sets without disrupting native lazy loading.
- **Global Keyboard Shortcut**: Toggle Cinema Mode instantly with `Option + C` (macOS) or `Alt + C` (Windows and Linux).

---

## Architecture and File Structure

```
extension/
├── manifest.json                 Manifest V3 configuration
├── background/
│   └── service-worker.js         Background state and shortcut command handler
├── popup/
│   ├── popup.html                Extension popup interface
│   ├── popup.css                 Popup styles
│   └── popup.js                  Popup toggle and settings controller
├── styles/
│   ├── cinema-core.css           Tokens and toast notification overlay styles
│   ├── cinema-layout.css         Feed container sizing and centering rules
│   └── cinema-media.css          Media scaling, article sizing, and control rules
├── src/
│   ├── config.js                 Constants, selectors, and class names
│   ├── content-main.js           Main content script orchestrator
│   └── modules/
│       ├── layout-manager.js     Feed expansion, orientation, and widget management
│       ├── media-scaler.js       Resolution scaling and image descriptor handler
│       ├── state-manager.js      State persistence, route checks, and class synchronization
│       └── toast.js              Heads-up display notifications
└── icons/
    ├── icon16.png                16x16 icon
    ├── icon48.png                48x48 icon
    └── icon128.png               128x128 icon
```

---

## Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Ramsankar06/IG-cinema-view.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the upper-right corner.
4. Click **Load unpacked** in the top-left menu.
5. Select the `extension/` directory (or repository root containing `manifest.json`).
6. Navigate to `https://www.instagram.com/` to use the extension.

---

## Usage

- **Toggle Cinema Mode**: Press `Option + C` (macOS) or `Alt + C` (Windows / Linux), or toggle via the extension popup in the Chrome toolbar.
- **Navigation**: Use the left sidebar to navigate. When switching to Reels or Explore, Cinema Mode automatically yields control to native Instagram.

---

## Keyboard Shortcuts

| Platform | Shortcut | Action |
| :--- | :--- | :--- |
| macOS | `Option + C` (`⌥ + C`) | Toggle Cinema Mode ON / OFF |
| Windows / Linux | `Alt + C` | Toggle Cinema Mode ON / OFF |

---

## Technical Specifications

- **Manifest Version**: 3
- **Permissions**: `storage`
- **Host Permissions**: `https://www.instagram.com/*`
- **Dependencies**: None (Zero-dependency vanilla JavaScript and CSS)
