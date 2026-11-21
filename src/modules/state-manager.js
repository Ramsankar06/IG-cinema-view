window.IGCinema = window.IGCinema || {};

window.IGCinema.StateManager = (() => {
  const { STORAGE_KEYS, CLASSES } = window.IGCinema.Config;
  let isEnabledByUser = true;
  const listeners = new Set();

  function isHomeFeed() {
    const rawPath = window.location.pathname || '';
    const path = rawPath.replace(/\/+$/, '') || '/';
    return path === '/' || path === '/index.php';
  }

  async function init() {
    if (chrome?.storage?.local) {
      const data = await chrome.storage.local.get({ [STORAGE_KEYS.ENABLED]: true });
      isEnabledByUser = data[STORAGE_KEYS.ENABLED] ?? true;
      sync();

      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes[STORAGE_KEYS.ENABLED] !== undefined) {
          isEnabledByUser = Boolean(changes[STORAGE_KEYS.ENABLED].newValue);
          sync();
        }
      });
    } else {
      sync();
    }
  }

  function sync() {
    const onHome = isHomeFeed();
    const shouldBeActive = isEnabledByUser && onHome;

    const root = document.documentElement;
    const body = document.body;

    if (shouldBeActive) {
      root?.classList.add(CLASSES.ACTIVE);
      body?.classList.add(CLASSES.ACTIVE);
    } else {
      root?.classList.remove(CLASSES.ACTIVE);
      body?.classList.remove(CLASSES.ACTIVE, CLASSES.NAV_REVEALED);
    }

    notify(shouldBeActive);
    return shouldBeActive;
  }

  async function toggle() {
    isEnabledByUser = !isEnabledByUser;
    const active = sync();

    if (chrome?.storage?.local) {
      await chrome.storage.local.set({ [STORAGE_KEYS.ENABLED]: isEnabledByUser });
    }
    return active;
  }

  function getActive() {
    return isEnabledByUser && isHomeFeed();
  }

  function getEnabledByUser() {
    return isEnabledByUser;
  }

  function onChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  function notify(state) {
    for (const cb of listeners) {
      try {
        cb(state);
      } catch (err) {
        console.error(err);
      }
    }
  }

  return {
    init,
    sync,
    toggle,
    getActive,
    getEnabledByUser,
    isHomeFeed,
    onChange,
  };
})();
