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

      const storyLink = document.querySelector('main a[href*="/stories/"], main button[aria-label*="Story" i]');
      if (storyLink) {
        let sc = storyLink.parentElement;
        while (sc && sc.tagName !== 'MAIN' && sc.parentElement && !sc.parentElement.querySelector('article')) {
          sc = sc.parentElement;
        }
        if (sc && !sc.querySelector('article')) {
          sc.classList.add('ig-cinema-stories-tray');
          sc.style.setProperty('max-width', '630px', 'important');
          sc.style.setProperty('width', '100%', 'important');
          sc.style.setProperty('margin', '0 auto 24px auto', 'important');
        }
      }
    } catch {}
  }

  function isCarousel(article) {
    if (article.querySelector('ul')) return true;
    if (article.querySelector('button[aria-label*="Next" i], button[aria-label*="Previous" i]')) return true;
    if (article.querySelector('div[role="tablist"]')) return true;
    return false;
  }

  function applyWidescreen(article) {
    try {
      if (isCarousel(article)) return;

      article.setAttribute('data-cinema-mode', 'widescreen');

      let p = article.parentElement;
      while (p && p.tagName !== 'MAIN' && p !== document.body) {
        p.style.setProperty('max-width', '100%', 'important');
        p.style.setProperty('width', '100%', 'important');
        p = p.parentElement;
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

  function detectAndApplyWidescreen(article) {
    try {
      if (isCarousel(article)) {
        article.removeAttribute('data-cinema-mode');
        return;
      }

      const aspectContainer = article.querySelector('div[style*="padding-bottom"]');
      if (aspectContainer) {
        const pb = parseFloat(aspectContainer.style.paddingBottom || '100');
        if (pb <= 78 && pb > 30) {
          applyWidescreen(article);
          return;
        } else if (pb > 78) {
          article.removeAttribute('data-cinema-mode');
          return;
        }
      }

      const video = article.querySelector('video');
      if (video) {
        if (video.videoWidth && video.videoHeight) {
          if (video.videoWidth > video.videoHeight * 1.15) {
            applyWidescreen(article);
          } else {
            article.removeAttribute('data-cinema-mode');
          }
          return;
        } else {
          const checkVideo = () => {
            if (isCarousel(article)) return;
            if (video.videoWidth && video.videoHeight && video.videoWidth > video.videoHeight * 1.15) {
              applyWidescreen(article);
            }
          };
          video.addEventListener('loadedmetadata', checkVideo, { once: true });
          video.addEventListener('play', checkVideo, { once: true });
        }
      }

      const img = article.querySelector('img:not(.ig-cinema-avatar):not([alt*="profile" i])');
      if (img) {
        if (img.naturalWidth && img.naturalHeight) {
          if (img.naturalWidth > img.naturalHeight * 1.15) {
            applyWidescreen(article);
          } else {
            article.removeAttribute('data-cinema-mode');
          }
          return;
        } else {
          const checkImg = () => {
            if (isCarousel(article)) return;
            if (img.naturalWidth && img.naturalHeight && img.naturalWidth > img.naturalHeight * 1.15) {
              applyWidescreen(article);
            }
          };
          if (img.complete) {
            checkImg();
          } else {
            img.addEventListener('load', checkImg, { once: true });
          }
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

      detectAndApplyWidescreen(article);
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