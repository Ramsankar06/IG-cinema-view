window.IGCinema = window.IGCinema || {};

window.IGCinema.LayoutManager = (() => {
  const { CLASSES } = window.IGCinema.Config;

  function cleanupMessageWidgets() {
    try {
      const candidates = document.querySelectorAll('div, button, a');
      for (const el of candidates) {
        const text = el.innerText?.trim();
        if (text === 'Messages' || text === 'Message') {
          const rect = el.getBoundingClientRect();
          if (
            rect.bottom > window.innerHeight - 120 &&
            rect.right > window.innerWidth - 320 &&
            rect.width > 0 &&
            rect.width < 260 &&
            rect.height > 0 &&
            rect.height < 90
          ) {
            let current = el;
            while (current && current !== document.body) {
              const r = current.getBoundingClientRect();
              if (r.width > 320 || r.height > 120) {
                break;
              }
              const pos = window.getComputedStyle(current).position;
              if (pos === 'fixed' || pos === 'absolute') {
                current.classList.add(CLASSES.MESSAGES_WIDGET);
                current.style.setProperty('display', 'none', 'important');
                break;
              }
              current = current.parentElement;
            }
          }
        }
      }
    } catch {}
  }

  function expandFeed() {
    try {
      const potentialSidebars = document.querySelectorAll('main > div > div, main section > div > div');
      for (const el of potentialSidebars) {
        const txt = el.textContent || '';
        if (txt.includes('Suggested for you') && (txt.includes('See all') || txt.includes('Follow') || txt.includes('Switch'))) {
          if (!el.querySelector('article')) {
            el.classList.add('ig-cinema-suggested-sidebar');
            el.style.setProperty('display', 'none', 'important');
          }
        }
      }

      const storyContainers = document.querySelectorAll('main div[style*="height: 101"], main div[style*="height: 100"], main div[style*="height: 85"]');
      for (const sc of storyContainers) {
        sc.classList.add('ig-cinema-stories-tray');
        sc.style.setProperty('max-width', '630px', 'important');
        sc.style.setProperty('margin', '0 auto 24px auto', 'important');
      }

      const articles = document.querySelectorAll('article');
      for (const article of articles) {
        let p = article.parentElement;
        if (p && p.tagName !== 'MAIN' && p !== document.body) {
          p.style.setProperty('max-width', '100%', 'important');
          p.style.setProperty('width', '100%', 'important');
        }
      }
    } catch {}
  }

  function detectOrientation(article) {
    try {
      if (article.querySelector('a[href*="/reels/"], a[href*="/reel/"]')) {
        article.removeAttribute('data-cinema-mode');
        return;
      }

      const aspectContainer = article.querySelector('div[style*="padding-bottom"]');
      if (aspectContainer) {
        const pb = parseFloat(aspectContainer.style.paddingBottom || '100');
        if (pb < 85) {
          article.setAttribute('data-cinema-mode', 'widescreen');
          return;
        } else {
          article.removeAttribute('data-cinema-mode');
          return;
        }
      }

      const video = article.querySelector('video');
      if (video) {
        if (video.videoWidth && video.videoHeight) {
          if (video.videoWidth > video.videoHeight * 1.15) {
            article.setAttribute('data-cinema-mode', 'widescreen');
          } else {
            article.removeAttribute('data-cinema-mode');
          }
          return;
        } else {
          video.addEventListener('loadedmetadata', () => {
            if (video.videoWidth > video.videoHeight * 1.15) {
              article.setAttribute('data-cinema-mode', 'widescreen');
              expandMediaWrappers(article);
            }
          }, { once: true });
        }
      }

      const img = article.querySelector('img:not(.ig-cinema-avatar):not([alt*="profile" i])');
      if (img && img.naturalWidth && img.naturalHeight) {
        if (img.naturalWidth > img.naturalHeight * 1.15) {
          article.setAttribute('data-cinema-mode', 'widescreen');
        } else {
          article.removeAttribute('data-cinema-mode');
        }
        return;
      }

      article.removeAttribute('data-cinema-mode');
    } catch {}
  }

  function expandMediaWrappers(article) {
    try {
      if (article.getAttribute('data-cinema-mode') !== 'widescreen') {
        return;
      }

      const mediaEl = article.querySelector('video, img:not(.ig-cinema-avatar):not([alt*="profile" i])');
      if (mediaEl) {
        let parent = mediaEl.parentElement;
        while (parent && parent !== article) {
          parent.classList.add(CLASSES.MEDIA_WRAPPER);
          parent.style.setProperty('max-width', '100%', 'important');
          parent.style.setProperty('width', '100%', 'important');
          parent = parent.parentElement;
        }
      }
    } catch {}
  }

  function enhanceArticle(article) {
    if (!article) return;

    try {
      const avatar = article.querySelector('img[alt*="profile" i], img[alt*="profile picture" i]');
      if (avatar) {
        avatar.classList.add('ig-cinema-avatar');
      }

      const audioBtn = article.querySelector(
        'button:has(svg[aria-label*="audio" i]), button[aria-label*="audio" i], button[aria-label*="sound" i], button[aria-label*="mute" i], [aria-label*="Audio" i], div[role="button"]:has(svg[aria-label*="audio" i])'
      );
      if (audioBtn) {
        audioBtn.classList.add(CLASSES.AUDIO_BTN);
      }

      detectOrientation(article);
      expandMediaWrappers(article);
      article.setAttribute(CLASSES.PROCESSED, 'true');
    } catch {}
  }

  function scan(container = document) {
    cleanupMessageWidgets();
    expandFeed();

    const articles = container.querySelectorAll('article');
    articles.forEach(enhanceArticle);
  }

  function init() {
    cleanupMessageWidgets();
    expandFeed();
  }

  return {
    init,
    scan,
    enhanceArticle,
    expandFeed,
  };
})();
