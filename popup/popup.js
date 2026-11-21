document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('cinemaToggle');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const STORAGE_KEY = 'cinemaModeEnabled';

  function updateUI(isEnabled) {
    toggle.checked = isEnabled;
    if (isEnabled) {
      statusDot.classList.remove('inactive');
      statusText.textContent = 'Active';
      statusText.style.color = '#10b981';
    } else {
      statusDot.classList.add('inactive');
      statusText.textContent = 'Disabled';
      statusText.style.color = '#a1a1aa';
    }
  }

  if (chrome?.storage?.local) {
    chrome.storage.local.get({ [STORAGE_KEY]: true }, (result) => {
      const isEnabled = result[STORAGE_KEY] ?? true;
      updateUI(isEnabled);
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes[STORAGE_KEY] !== undefined) {
        updateUI(Boolean(changes[STORAGE_KEY].newValue));
      }
    });
  }

  toggle.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    updateUI(isEnabled);

    if (chrome?.storage?.local) {
      chrome.storage.local.set({ [STORAGE_KEY]: isEnabled });
    }
  });
});
