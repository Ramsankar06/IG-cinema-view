(() => {
  'use strict';

  const { StateManager, LayoutManager, MediaScaler, Toast } = window.IGCinema;

  let scanTimer = null;
  let lastPathname = location.pathname;

  function handleKeyDown(e) {
    const activeEl = document.activeElement;
    const isTyping =
      activeEl &&
      (activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.isContentEditable ||
        activeEl.getAttribute('role') === 'textbox');

    if (isTyping) return;

    const isKeyC =
      e.code === 'KeyC' ||
      e.key === 'c' ||
      e.key === 'C' ||
      e.key === 'ç' ||
      e.key === 'Ç';

    if (e.altKey && isKeyC) {
      e.preventDefault();
      e.stopPropagation();

      if (!StateManager.isHomeFeed()) {
        Toast.show('Cinema View is for Home Feed only', false);
        return;
      }

      StateManager.toggle().then((isActive) => {
        Toast.show(isActive ? 'Cinema Mode: ON' : 'Cinema Mode: OFF', isActive);
        if (isActive) {
          LayoutManager.scan();
          MediaScaler.scan();
        }
      });
    }
  }

  function triggerScan() {
    if (!StateManager.getActive()) return;

    if (scanTimer) clearTimeout(scanTimer);
    scanTimer = setTimeout(() => {
      if (StateManager.getActive()) {
        LayoutManager.scan();
        MediaScaler.scan();
      }
    }, 120);
  }

  function handleRouteChange() {
    if (location.pathname !== lastPathname) {
      lastPathname = location.pathname;
      const isActive = StateManager.sync();
      if (isActive) {
        triggerScan();
      }
    }
  }

  const origPushState = history.pushState;
  history.pushState = function (...args) {
    origPushState.apply(this, args);
    handleRouteChange();
  };

  const origReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    origReplaceState.apply(this, args);
    handleRouteChange();
  };

  window.addEventListener('popstate', handleRouteChange);
  setInterval(handleRouteChange, 100);

  window.addEventListener('click', () => {
    setTimeout(handleRouteChange, 40);
  }, true);

  async function bootstrap() {
    await StateManager.init();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onDOMReady);
    } else {
      onDOMReady();
    }
  }

  function onDOMReady() {
    LayoutManager.init();

    const runInitialScan = () => {
      if (StateManager.getActive()) {
        LayoutManager.scan();
        MediaScaler.scan();
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(runInitialScan, { timeout: 1000 });
    } else {
      setTimeout(runInitialScan, 300);
    }

    window.addEventListener('keydown', handleKeyDown, true);

    const observer = new MutationObserver((mutations) => {
      let hasNewArticles = false;
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          for (const node of m.addedNodes) {
            if (node.nodeType === 1 && (node.tagName === 'ARTICLE' || node.querySelector?.('article'))) {
              hasNewArticles = true;
              break;
            }
          }
        }
        if (hasNewArticles) break;
      }

      if (hasNewArticles && StateManager.getActive()) {
        triggerScan();
      }
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  bootstrap();
})();
