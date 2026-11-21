const STORAGE_KEY = 'cinemaModeEnabled';

chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get({ [STORAGE_KEY]: true });
  updateBadge(data[STORAGE_KEY]);
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes[STORAGE_KEY] !== undefined) {
    updateBadge(Boolean(changes[STORAGE_KEY].newValue));
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-cinema-mode') {
    const data = await chrome.storage.local.get({ [STORAGE_KEY]: true });
    const newState = !data[STORAGE_KEY];
    await chrome.storage.local.set({ [STORAGE_KEY]: newState });
    updateBadge(newState);
  }
});

function updateBadge(isEnabled) {
  if (isEnabled) {
    chrome.action.setBadgeText({ text: 'ON' });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
  } else {
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#6b7280' });
  }
}
