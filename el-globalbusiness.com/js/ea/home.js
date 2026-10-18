// js/ea/home.js
// El-Access home. Loads BEFORE js/site.js: site.js's scope is all of <main>, which opens the
// motion gate, so the hero's gated parts must have their start state first. site.js adds the
// sky's settle and drift and the section heading reveals.
//
//   Hero    the jet glides in from the left as the copy rises (heroIntro), floats gently,
//           and climbs away to the right as you scroll. Three layers, one job each:
//           [data-jet] scroll, [data-jet-float] float, [data-jet-img] arrival.
//   Board   departures from js/ea/data.js; every few seconds one row turns over to a new
//           leg, its characters flipping like an airport board. Only while the board is on
//           screen and the tab is visible; never under reduced motion.
//   Routes, example   filled from the data (not motion).
//   Refer   Invite friends (the share sheet, or an email) and Copy invite link. Not motion.
//   Close   the jet at sunset eases out of a slight zoom as the section scrolls in.
import { createMotion, gsap, MOTION } from '../motion/core.js?v=c81884f095';
import { heroIntro } from '../recipes/hero-intro.js?v=202d3feb35';
import { overlayNav, preloaderLifted } from '../chrome.js?v=52793ad2ba';
import { flights, flightById, search, searchForm, money, duration, cells, rowHtml, esc, EXAMPLE, invited, INVITE_URL } from './lib.js?v=1280348b3d';
import { ROUTES } from './data.js?v=11f874ecbf';

const $ = (s, root = document) => root.querySelector(s);

// ── Hero ──────────────────────────────────────────────────────────────────
const hero = $('.ea-hero');
overlayNav(hero);
searchForm($('[data-ea-search]'));
// The header's Search flights jumps to the hero search: put the cursor in From.
document.querySelectorAll('a[href="#search"]').forEach((a) =>
  a.addEventListener('click', () => setTimeout(() => $('#s-from')?.focus({ preventScroll: true }), 700)));

createMotion(hero, (env) => {
  heroIntro(hero, env, { ready: preloaderLifted() });
  const jet = $('[data-jet]', hero);
  const float = $('[data-jet-float]', hero);
  const img = $('[data-jet-img]', hero);
  if (!jet || !float || !img) return;
  // Arrival: from low on the left, banking level as it comes.
  if (env.intro) {
    gsap.fromTo(img, { xPercent: -42, yPercent: 26, rotation: 4, autoAlpha: 0 }, { xPercent: 0, yPercent: 0, rotation: 0, autoAlpha: 1, duration: 2.8, delay: 0.2, ease: MOTION.ease.reveal, lazy: false });
  }
  // Float: a slow rise and fall, as if riding the air.
  gsap.to(float, { y: -12, rotation: -0.6, duration: 4.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  // Scroll: climbs away to the upper right while the page slides over the sky.
  gsap.to(jet, {
    xPercent: 22, yPercent: -55, scale: 0.84, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
  });
});

// ── Board ─────────────────────────────────────────────────────────────────
const board = $('[data-board]');
const note = $('[data-board-note]');
const ROWS = 7;
const stamp = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
if (board) {
  const all = flights();
  const shown = all.slice(0, ROWS);
  const pool = all.slice(ROWS);
  board.insertAdjacentHTML('beforeend', shown.map((f) => `<li>${rowHtml(f)}</li>`).join(''));
  if (note) note.textContent = `${EXAMPLE ? 'Example fares' : 'Live fares'} · updated ${stamp()}`;

  createMotion(board, (env) => {
    let timer = 0;
    let visible = false;
    const flip = (el) => {
      // Each character becomes its own cell and turns down into place.
      const text = el.textContent;
      el.classList.add('ea-flap');
      el.innerHTML = [...text].map((ch) => `<span>${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
      gsap.fromTo(el.children, { rotationX: -90, opacity: 0 }, {
        rotationX: 0, opacity: 1, duration: 0.42, ease: 'power2.out', stagger: 0.022,
        onComplete: () => { el.textContent = text; el.classList.remove('ea-flap'); },
      });
    };
    const turn = () => {
      if (!visible || document.hidden || !pool.length) return;
      // A real board stays in time order: a row only turns over to a leg that fits between
      // its neighbours. Try the rows in a random order; if none can take a new leg, wait.
      const key = (f) => f.day * 1e4 + parseInt(f.window.replace(':', ''), 10);
      let i = -1;
      let next = null;
      for (const r of [...shown.keys()].sort(() => Math.random() - 0.5)) {
        const lo = r > 0 ? key(shown[r - 1]) : -Infinity;
        const hi = r < shown.length - 1 ? key(shown[r + 1]) : Infinity;
        const at = pool.findIndex((f) => key(f) >= lo && key(f) <= hi);
        if (at >= 0) { i = r; next = pool.splice(at, 1)[0]; break; }
      }
      if (!next) return;
      pool.push(shown[i]);
      shown[i] = next;
      const link = board.querySelectorAll('a.ea-row')[i];
      if (!link) return;
      const c = cells(next);
      link.href = `flight.html?id=${next.id}`;
      link.dataset.id = next.id;
      const [a, b] = c.route.split('→');
      const route = link.querySelector('[data-cell="route"]');
      route.innerHTML = `${esc(a)}<i aria-hidden="true">&rarr;</i><span class="ea-visually-hidden"> to </span>${esc(b)}`;
      gsap.fromTo(route, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, ease: MOTION.ease.reveal });
      for (const key of ['when', 'window', 'routeMeta', 'craft', 'craftMeta', 'price', 'priceMeta']) {
        const el = link.querySelector(`[data-cell="${key}"]`);
        if (!el) continue;
        el.textContent = c[key];
        if (key === 'price' || key === 'when' || key === 'craft') flip(el);
      }
      if (note) note.textContent = `${EXAMPLE ? 'Example fares' : 'Live fares'} · updated ${stamp()}`;
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.25 });
    io.observe(board);
    timer = window.setInterval(turn, 5200);
    env.onCleanup(() => { window.clearInterval(timer); io.disconnect(); });
  });
}

// ── Popular routes ────────────────────────────────────────────────────────
const routes = $('[data-routes]');
if (routes) {
  routes.innerHTML = ROUTES.map((r) => {
    const list = search({ from: r.from, to: r.to });
    if (!list.length) return '';
    const low = Math.min(...list.map((f) => f.price));
    const href = `flights.html?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`;
    return `<a class="ea-route-card" href="${href}">
        <img src="../img/photos/${r.photo}-800.webp" srcset="../img/photos/${r.photo}-700.webp 700w, ../img/photos/${r.photo}-800.webp 800w, ../img/photos/${r.photo}-900.webp 900w" sizes="(max-width: 900px) 78vw, 33vw" width="800" height="600" loading="lazy" decoding="async" alt="${esc(r.alt)}">
        <div><h3>${esc(r.from)}<i aria-hidden="true">&rarr;</i><span class="ea-visually-hidden"> to </span>${esc(r.to)}</h3><p>From ${money(low)} · ${list.length} ${list.length === 1 ? 'flight' : 'flights'}</p></div>
      </a>`;
  }).join('');
}

// ── The worked example: the first London to Nice leg, or the biggest saving ──
const ex = $('[data-example]');
const f = flightById('EA101') || [...flights()].sort((a, b) => b.saving - a.saving)[0];
if (ex && f) {
  const set = (k, v) => { const el = $(`[data-ex-${k}]`, ex); if (el) el.innerHTML = v; };
  set('craft', `${esc(f.aircraft)} · ${f.seats} seats`);
  set('route', `${esc(f.fromAirport.city)}<i aria-hidden="true">&rarr;</i>${esc(f.toAirport.city)}`);
  set('detail', `${esc(f.fromAirport.name)} to ${esc(f.toAirport.name)} · about ${duration(f.hours)}`);
  set('charter', money(f.charter));
  set('price', money(f.price));
  set('save', `${f.saving}% less`);
  set('seat', `${money(f.perSeat)} a seat with ${f.seats} aboard`);
  const bar = $('[data-ex-bar-b]', ex);
  if (bar) bar.style.width = `${Math.max(4, Math.round((f.price / f.charter) * 100))}%`;
}

// ── Refer and earn ────────────────────────────────────────────────────────
const INVITE_TEXT = 'Fly private for less: El-Access lists empty-leg private jet flights, typically 50 to 75% below a full charter. This link takes $300 off your first flight:';
const inviteStatus = $('[data-invite-status]');
const say = (t) => { if (inviteStatus) inviteStatus.textContent = t; };
$('[data-invite]')?.addEventListener('click', async () => {
  if (navigator.share) {
    try { await navigator.share({ title: 'El-Access: $300 off your first flight', text: INVITE_TEXT, url: INVITE_URL }); } catch { /* closed the sheet */ }
    return;
  }
  location.href = `mailto:?subject=${encodeURIComponent('$300 off a private flight')}&body=${encodeURIComponent(`${INVITE_TEXT}
${INVITE_URL}`)}`;
});
$('[data-invite-copy]')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(INVITE_URL);
    say('Link copied. Send it to anyone you would like to fly with.');
  } catch {
    say(`Copy this link: ${INVITE_URL}`);
  }
});
// Arrived through an invite: say so where it matters, in the hero.
if (invited()) {
  const proof = $('.ea-proof');
  proof?.insertAdjacentHTML('afterbegin', '<li class="ea-invited"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 8.5 3 3 7-7"/></svg>$300 off your first flight, from your invite</li>');
}

// ── The close ─────────────────────────────────────────────────────────────
const finale = $('.ea-finale');
createMotion(finale, () => {
  const img = $('[data-finale-img]', finale);
  if (!img) return;
  gsap.fromTo(img, { scale: 1.14 }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: finale, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
  });
});
