document.addEventListener('DOMContentLoaded', () => {
  // Feature cards glow (desktop only)
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (!isMobile) {
    const wrappers = document.querySelectorAll('.feature-card-wrapper');

    wrappers.forEach(wrapper => {
      wrapper.addEventListener('mousemove', e => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        wrapper.style.setProperty('--glow-x', `${x}px`);
        wrapper.style.setProperty('--glow-y', `${y}px`);
      });
    });
  }

  // Navbar scroll
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 0);
  }, { passive: true });

  // Smooth scroll for nav links
  document.querySelectorAll('.navbar__links a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Scroll spy
  const navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');
  const sections = Array.from(navLinks).map(link =>
    document.querySelector(link.getAttribute('href'))
  ).filter(Boolean);

  function updateActiveLink() {
    const offset = navbar.offsetHeight + 100;
    const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2;
    let current = null;

    if (atBottom) {
      current = sections[sections.length - 1];
    } else {
      sections.forEach(section => {
        if (section.getBoundingClientRect().top <= offset) {
          current = section;
        }
      });
    }

    navLinks.forEach(link => {
      link.classList.toggle(
        'navbar__link--active',
        current && link.getAttribute('href') === `#${current.id}`
      );
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // How to Use tabs
  const tabs = document.querySelectorAll('.howto__tab');
  const panels = document.querySelectorAll('.howto__panel');

  function activateTab(tabName) {
    tabs.forEach(t => t.classList.remove('howto__tab--active'));
    panels.forEach(p => p.classList.remove('howto__panel--active'));

    const tab = document.querySelector(`.howto__tab[data-tab="${tabName}"]`);
    const panel = document.querySelector(`[data-panel="${tabName}"]`);
    if (tab) tab.classList.add('howto__tab--active');
    if (panel) panel.classList.add('howto__panel--active');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });

  // OS detection
  function detectOS() {
    const ua = navigator.userAgent || '';

    if (/Windows/.test(ua)) return 'windows';
    if (/Mac/.test(ua)) return 'macos';
    if (/Linux/.test(ua)) return 'linux';
    return null;
  }

  const os = detectOS();

  if (os) {
    document.querySelectorAll(`.download__card[data-os="${os}"]`).forEach(card => {
      card.classList.add('download__card--detected');
    });

    activateTab(os);
  }

  // Share buttons
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);

  const shareUrls = {
    telegram: `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`,
    x: `https://x.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
    vk: `https://vk.com/share.php?url=${pageUrl}&title=${pageTitle}`,
    reddit: `https://www.reddit.com/submit?url=${pageUrl}&title=${pageTitle}`,
  };

  document.querySelectorAll('.footer__share-btn').forEach(btn => {
    const network = btn.dataset.share;
    if (shareUrls[network]) {
      btn.href = shareUrls[network];
    }
  });
});
