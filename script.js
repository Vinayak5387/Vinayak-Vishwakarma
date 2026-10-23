// ── Content ──
const VIDEOS = {
  'Music videos': [
    ['WAi1iuvC5qc', 'Geeta Rabari — Zankaar 3.0', 'Music video'],
    ['MABDpIhi7hE', 'Dhurandhar', 'Music video'],
    ['YQvAjmC0sN4', 'Jaysinh Gadhavi', 'Music video'],
    ['EHrLyw7lyMM', 'Tu Hain To (Piano)', 'Music video']
  ],
  'Wedding': [
    ['YKbzrXE32sU', 'Wedding Teaser 2024', 'Wedding'],
    ['9PY9ueEI-oA', 'Wedding Highlight', 'Wedding']
  ],
  'STIHL India': [
    ['CYaJiWAOb_k', 'STIHL India', 'Brand commercial'],
    ['Fey9uCoy6NQ', 'Vadodara — 1st Farmer', 'Brand documentary'],
    ['YNzpb0z7-YE', 'STIHL — Second Final', 'Brand commercial'],
    ['Ptv-AFnToWU', 'STIHL — 3rd Farmer', 'Brand documentary']
  ]
};

const SITES = [
  ['https://khalnayakpower.github.io/rashi-marketing/', 'Rashi Marketing', 'Business landing page'],
  ['https://mail-go-phi.vercel.app', 'Mail Go', 'Website'],
  ['https://www.fitfriendly.in/', 'FitFriendly', 'Website']
];

const PLAY = '<span class="play-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="7,4 20,12 7,20"/></svg></span>';

document.getElementById('video-tracks').innerHTML = Object.entries(VIDEOS).map(([track, list]) => `
  <div class="track-head">${track}<small>${list.length} ${list.length > 1 ? 'videos' : 'video'}</small></div>
  <div class="video-grid">${list.map(([id, title, kind]) => `
    <div class="vcard video-card" data-video-id="${id}" role="button" tabindex="0">
      <div class="thumb"><img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="${title}" loading="lazy" />${PLAY}</div>
      <strong>${title}</strong><span>${kind}</span>
    </div>`).join('')}
  </div>`).join('');

document.getElementById('web-grid').innerHTML = SITES.map(([url, name, kind]) => `
  <div class="web-card" data-url="${url}" role="button" tabindex="0" aria-label="Preview ${name}">
    <div class="browser">
      <div class="browser-bar"><span class="browser-dots"><i></i><i></i><i></i></span><span class="browser-url">${url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span></div>
      <div class="browser-view"><img src="https://s0.wp.com/mshots/v1/${url}?w=1280&h=720" alt="${name} preview" loading="lazy" /></div>
    </div>
    <div class="web-meta"><strong>${name}</strong><span>${kind}</span></div>
  </div>`).join('');

// ── Playhead: the page is a timeline (24 fps, 2:30 long) ──
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const reel = document.querySelector('.reel');
const tc = document.getElementById('timecode');
const ph = document.getElementById('playhead');
let ticking = false;
function updatePlayhead() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  ph.style.setProperty('--p', p);
  const f = Math.round(p * 150 * 24), pad = n => String(n).padStart(2, '0');
  tc.textContent = `${pad(Math.floor(f / 86400))}:${pad(Math.floor(f / 1440) % 60)}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`;
  if (reel && !reduce) {
    const r = reel.getBoundingClientRect();
    reel.style.setProperty('--ry', Math.max(-30, Math.min(30, -(r.top + r.height / 2 - innerHeight / 2) * 0.06)) + 'px');
  }
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updatePlayhead); } }, { passive: true });
addEventListener('resize', updatePlayhead);
updatePlayhead();

// ── Active nav link ──
const links = document.querySelectorAll('.nav-links a');
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('section[id]').forEach(s => io.observe(s));

// ── Helpers ──
const onActivate = (el, fn) => {
  el.addEventListener('click', fn);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
};

// ── Video modal ──
const vModal = document.getElementById('video-modal');
const vFrame = document.getElementById('modal-iframe');

function openVideo(id) {
  vFrame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  vModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeVideo() {
  vModal.classList.remove('open');
  setTimeout(() => { vFrame.src = ''; }, 300);
  document.body.style.overflow = '';
}
document.querySelectorAll('.video-card[data-video-id]').forEach(c => onActivate(c, () => openVideo(c.dataset.videoId)));
document.getElementById('modal-close').addEventListener('click', closeVideo);
document.getElementById('modal-backdrop').addEventListener('click', closeVideo);

// ── Web preview modal ──
const wModal = document.getElementById('web-modal');
const wFrame = document.getElementById('web-modal-iframe');

function openWeb(url) {
  document.getElementById('web-modal-url-text').textContent = url.replace(/^https?:\/\//, '');
  document.getElementById('web-modal-newtab').href = url;
  wModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => { wFrame.src = url; }, 80);
}
function closeWeb() {
  wModal.classList.remove('open');
  setTimeout(() => { wFrame.src = ''; }, 300);
  document.body.style.overflow = '';
}
document.querySelectorAll('.web-card[data-url]').forEach(c => onActivate(c, () => openWeb(c.dataset.url)));
['web-modal-close', 'web-modal-close-dot', 'web-modal-backdrop'].forEach(id => document.getElementById(id).addEventListener('click', closeWeb));
document.getElementById('web-modal-refresh').addEventListener('click', () => {
  const s = wFrame.src; wFrame.src = ''; setTimeout(() => { wFrame.src = s; }, 60);
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (vModal.classList.contains('open')) closeVideo();
  if (wModal.classList.contains('open')) closeWeb();
});

// ── Scroll reveals ──
document.querySelectorAll('.section-title').forEach(t => {
  t.innerHTML = '<span class="ln"><span>' + t.textContent + '</span></span>';
});
document.querySelectorAll('.section-title, .contact-title').forEach(t => t.setAttribute('data-t', ''));
document.querySelectorAll('.section-sub, .service, .track-head, .vcard, .web-card, .contact-btns').forEach(el => {
  const i = [...el.parentElement.children].indexOf(el);
  el.setAttribute('data-r', '');
  el.style.setProperty('--d', (i % 3) * 0.1 + 's');
});
const rio = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); }
}), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('[data-r], [data-t]').forEach(el => rio.observe(el));

// ── Pointer effects (mouse only) ──
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
  const cur = document.getElementById('cursor'), label = cur.firstElementChild;
  let x = 0, y = 0, cx = 0, cy = 0;
  addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
  (function loop() {
    cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
    cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-video-id], .web-card');
    cur.classList.toggle('on', !!t);
    document.documentElement.classList.toggle('has-cursor', !!t);
    if (t) label.textContent = t.dataset.videoId ? 'Play' : 'Open';
  });
  document.addEventListener('mouseleave', () => { cur.classList.remove('on'); document.documentElement.classList.remove('has-cursor'); });

  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });
}
