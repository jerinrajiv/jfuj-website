// portfolio.js — single source of truth for all shoots
// Edit portfolio.json to add/remove/reorder stories. This script auto-updates
// the nav and home page grid on every page.

(async () => {
  try {
    const stories = await fetch('/portfolio.json').then(r => r.json());
    const page = location.pathname.split('/').pop() || 'index.html';

    // ── Desktop nav: insert story links before About ───────────────────
    const aboutNavItem = document.querySelector('.nav-links a[href="about.html"]')?.closest('li');
    if (aboutNavItem) {
      aboutNavItem.insertAdjacentHTML('beforebegin',
        stories.map(s => {
          const cur = page === s.url ? ' aria-current="page"' : '';
          return `<li><a href="${s.url}"${cur}>${s.nav}</a></li>`;
        }).join('')
      );
    }

    // ── Mobile overlay: insert story links before About ────────────────
    const aboutOverlay = document.querySelector('#navOverlay a[href="about.html"]');
    if (aboutOverlay) {
      aboutOverlay.insertAdjacentHTML('beforebegin',
        stories.map(s => `<a href="${s.url}">${s.nav}</a>`).join('')
      );
      // Re-attach close listener to all overlay links including injected ones
      const hamburger = document.getElementById('hamburger');
      const overlay   = document.getElementById('navOverlay');
      overlay.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => {
          hamburger.classList.remove('open');
          overlay.classList.remove('open');
          hamburger.setAttribute('aria-expanded', false);
          overlay.setAttribute('aria-hidden', true);
          document.body.style.overflow = '';
        })
      );
    }

    // ── Portfolio grid (home page only) ───────────────────────────────
    const grid = document.getElementById('stories');
    if (grid?.classList.contains('portfolio-grid')) {
      grid.innerHTML = stories.map(s => `
        <a href="${s.url}" class="portfolio-card">
          <div class="portfolio-card-img">
            <img src="${s.cover}" alt="${s.alt}" loading="lazy">
          </div>
          <span class="portfolio-card-label">${s.label}</span>
          <span class="portfolio-card-name">${s.name}</span>
          <span class="portfolio-card-count">${s.meta}</span>
        </a>`
      ).join('');

      // Animate cards in with IntersectionObserver
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        }),
        { threshold: 0.06 }
      );
      grid.querySelectorAll('.portfolio-card').forEach(el => {
        el.classList.add('reveal');
        obs.observe(el);
      });
    }
  } catch (e) {
    console.error('portfolio.js failed to load:', e);
  }
})();
