window.IGCinema = window.IGCinema || {};

window.IGCinema.MediaScaler = (() => {
  const { CLASSES } = window.IGCinema.Config;

  function upgradeImage(img) {
    if (!img) return;

    const alt = (img.getAttribute('alt') || '').toLowerCase();
    if (
      alt.includes('profile picture') ||
      alt.includes('profile photo') ||
      img.closest('header') ||
      img.classList.contains('ig-cinema-avatar')
    ) {
      return;
    }

    img.setAttribute(CLASSES.OPTIMIZED, 'true');
  }

  function upgradeVideo(video) {
    if (!video) return;
    video.setAttribute(CLASSES.OPTIMIZED, 'true');
  }

  function scan(container = document) {
    const images = container.querySelectorAll('article img');
    images.forEach(upgradeImage);

    const videos = container.querySelectorAll('article video');
    videos.forEach(upgradeVideo);
  }

  return {
    scan,
    upgradeImage,
    upgradeVideo,
  };
})();