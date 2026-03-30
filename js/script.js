const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('is-visible');

    // Mobile browsers (especially iOS Safari) may delay video loading until it's explicitly asked.
    // Trigger loading/play when the revealed block enters the viewport.
    const videos = entry.target.querySelectorAll('video');
    videos.forEach((video) => {
      try {
        video.load();
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch (e) {
        // Autoplay can be blocked; loading is still the best-effort goal here.
      }
    });

    observer.unobserve(entry.target);
  });
}, {
  threshold: 0.14
});

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

const sparks = document.querySelectorAll('.gold-spark');
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;
  sparks.forEach((spark, index) => {
    const factor = (index + 1) * 8;
    spark.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

// Autoplay on mobile can be blocked until the first user gesture.
// Best-effort fallback: when the user touches/clicks the page, try to play/load review videos.
const tryPlayReviewVideos = () => {
  document.querySelectorAll('#reviews video.review-video').forEach((video) => {
    try {
      video.muted = true;
      video.load();
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (e) {
      // Ignore autoplay/play errors.
    }
  });
};

const onFirstGesture = () => tryPlayReviewVideos();
window.addEventListener('touchstart', onFirstGesture, { once: true, passive: true });
window.addEventListener('pointerdown', onFirstGesture, { once: true, passive: true });
window.addEventListener('click', onFirstGesture, { once: true });
