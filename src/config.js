window.IGCinema = window.IGCinema || {};

window.IGCinema.Config = Object.freeze({
  STORAGE_KEYS: {
    ENABLED: 'cinemaModeEnabled',
  },
  CLASSES: {
    ACTIVE: 'ig-cinema-active',
    NAV_REVEALED: 'ig-nav-revealed',
    AUTHOR_HEADER: 'ig-cinema-author-header',
    AUDIO_BTN: 'ig-cinema-audio-btn',
    MEDIA_WRAPPER: 'ig-cinema-media-wrapper',
    SIDEBAR_CONTAINER: 'ig-cinema-sidebar-container',
    MESSAGES_WIDGET: 'ig-cinema-messages-widget',
    PROCESSED: 'data-ig-cinema-processed',
    OPTIMIZED: 'data-ig-cinema-optimized',
  },
  SELECTORS: {
    ARTICLES: 'article',
    FEED_MAIN: 'main, div[role="main"]',
    IMAGES: 'article img',
    VIDEOS: 'article video',
    AUDIO_BUTTONS: 'button[aria-label*="audio" i], button[aria-label*="sound" i], button[aria-label*="mute" i], button[aria-label*="volume" i]',
  },
  THRESHOLDS: {
    NAV_HOVER_ZONE_WIDTH: 40,
    NAV_SIDEBAR_COLLAPSE_WIDTH: 270,
    MAX_HEIGHT_VH: 88,
    MAX_WIDTH_VW: 94,
  },
});
