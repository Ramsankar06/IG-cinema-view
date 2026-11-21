window.IGCinema = window.IGCinema || {};

window.IGCinema.Toast = (() => {
  let toastEl = null;
  let dismissTimeout = null;

  function getToastElement() {
    if (!toastEl || !document.body?.contains(toastEl)) {
      toastEl = document.createElement('div');
      toastEl.className = 'ig-cinema-toast';
      document.body?.appendChild(toastEl);
    }
    return toastEl;
  }

  function show(message, isActive) {
    const el = getToastElement();
    if (!el) return;

    el.innerHTML = `
      <span class="ig-cinema-toast-dot ${isActive ? 'active' : 'inactive'}"></span>
      <span class="ig-cinema-toast-title">Cinema View: <strong>${isActive ? 'ON' : 'OFF'}</strong></span>
      <span class="ig-cinema-toast-shortcut">${navigator.platform.toUpperCase().includes('MAC') ? 'Option+C' : 'Alt+C'}</span>
    `;

    el.classList.add('visible');

    if (dismissTimeout) clearTimeout(dismissTimeout);
    dismissTimeout = setTimeout(() => {
      el.classList.remove('visible');
    }, 1800);
  }

  return { show };
})();
