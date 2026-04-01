// ── Sticky nav active link highlight on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = '#1d1d1f';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => obs.observe(s));

// ── Video Modal ──
const modal      = document.getElementById('video-modal');
const iframe     = document.getElementById('modal-iframe');
const closeBtn   = document.getElementById('modal-close');
const backdrop   = document.getElementById('modal-backdrop');

function openModal(videoId) {
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  setTimeout(() => { iframe.src = ''; }, 300);
  document.body.style.overflow = '';
}

document.querySelectorAll('.video-card[data-video-id]').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.videoId));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card.dataset.videoId);
    }
  });
});

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modal.classList.contains('open'))    closeModal();
    if (webModal.classList.contains('open')) closeWebModal();
  }
});

// ── Web Preview Modal ──
const webModal        = document.getElementById('web-modal');
const webIframe       = document.getElementById('web-modal-iframe');
const webUrlText      = document.getElementById('web-modal-url-text');
const webNewtab       = document.getElementById('web-modal-newtab');
const webRefresh      = document.getElementById('web-modal-refresh');
const webClose        = document.getElementById('web-modal-close');
const webCloseDot     = document.getElementById('web-modal-close-dot');
const webBackdrop     = document.getElementById('web-modal-backdrop');
const webBlocked      = document.getElementById('web-modal-blocked');
const webBlockedLink  = document.getElementById('web-blocked-link');

let blockCheckTimer = null;

function openWebModal(url, title) {
  // Reset state
  webBlocked.style.display = 'none';
  webIframe.style.display  = 'block';
  webIframe.src            = '';

  // Populate chrome bar
  webUrlText.textContent = url.replace(/^https?:\/\//, '');
  webNewtab.href         = url;
  webBlockedLink.href    = url;

  webModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Small delay then load iframe (avoids flash)
  setTimeout(() => { webIframe.src = url; }, 80);

  // Detect X-Frame-Options block after 4 s
  clearTimeout(blockCheckTimer);
  blockCheckTimer = setTimeout(() => {
    try {
      // If same-origin, accessing this won't throw
      const doc = webIframe.contentDocument || webIframe.contentWindow?.document;
      // blank page or about:blank means blocked
      if (!doc || doc.URL === 'about:blank' || doc.body?.innerHTML === '') {
        showBlocked(url);
      }
    } catch (e) {
      // Cross-origin throw = likely blocked, show fallback
      showBlocked(url);
    }
  }, 4000);
}

function showBlocked(url) {
  webIframe.style.display = 'none';
  webBlocked.style.display = 'flex';
  webBlockedLink.href = url;
}

function closeWebModal() {
  webModal.classList.remove('open');
  clearTimeout(blockCheckTimer);
  setTimeout(() => {
    webIframe.src = '';
    webBlocked.style.display = 'none';
    webIframe.style.display  = 'block';
  }, 300);
  document.body.style.overflow = '';
}

// Wire up web cards
document.querySelectorAll('.web-card[data-url]').forEach(card => {
  const open = () => openWebModal(card.dataset.url, card.dataset.title);
  card.addEventListener('click', open);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
});

webClose.addEventListener('click', closeWebModal);
webCloseDot.addEventListener('click', closeWebModal);
webBackdrop.addEventListener('click', closeWebModal);
webRefresh.addEventListener('click', () => {
  const src = webIframe.src;
  webIframe.src = '';
  webBlocked.style.display = 'none';
  webIframe.style.display  = 'block';
  setTimeout(() => { webIframe.src = src; }, 60);
});

