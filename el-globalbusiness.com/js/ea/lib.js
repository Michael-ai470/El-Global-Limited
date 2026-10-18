// js/ea/lib.js
// El-Access: the flight data made usable (dates, prices, durations), the search filter, and
// the search form that sits in the home hero and on the results page. Not motion: everything
// here runs for every visitor.
import { AIRPORTS, AIRCRAFT, FLIGHTS, EXAMPLE } from './data.js?v=11f874ecbf';

export { EXAMPLE };

// ── The El-Access header ──────────────────────────────────────────────────
// Back: the page the visitor came from, if it is on this site; otherwise the El-Global
// homepage (the link's own href). The phone menu closes once a link is chosen.
(function header() {
  const back = document.querySelector('[data-back]');
  if (back) {
    let from = null;
    try { from = document.referrer ? new URL(document.referrer) : null; } catch { from = null; }
    if (from && from.origin === location.origin && from.href !== location.href) {
      back.href = from.href;
      back.setAttribute('aria-label', 'Back to the previous page');
      back.addEventListener('click', (e) => {
        if (history.length > 1) { e.preventDefault(); history.back(); }
      });
    } else {
      back.setAttribute('aria-label', 'Back to El-Global');
    }
  }
  document.querySelectorAll('.ea-menu-panel a').forEach((a) =>
    a.addEventListener('click', () => { const d = a.closest('details'); if (d) d.open = false; }));
})();

// ── Invitations (Refer & earn) ────────────────────────────────────────────
// A visitor who arrives through an invite link (?invite) is remembered on this device, and
// their requests carry a note so the team can apply the $300.
const INVITE_KEY = 'ea-invite';
try {
  if (new URLSearchParams(location.search).has('invite')) localStorage.setItem(INVITE_KEY, '1');
} catch { /* private mode: the note is simply not added */ }
export const invited = () => { try { return localStorage.getItem(INVITE_KEY) === '1'; } catch { return false; } };
export const INVITE_URL = 'https://el-globalbusiness.com/el-access/?invite=friend';
/** Adds the invite note to a request form, if this visitor was invited. */
export function markInvite(form) {
  if (!form || !invited() || form.querySelector('input[name="invite"]')) return;
  const input = Object.assign(document.createElement('input'), { type: 'hidden', name: 'invite', value: 'Invited by a friend: $300 off the first flight' });
  input.dataset.label = 'Invite';
  form.prepend(input);
}

/** @param {string} code */
export function airport(code) {
  const a = AIRPORTS[code];
  return a ? { code, city: a[0], name: a[1], country: a[2], lat: a[3], lon: a[4] } : null;
}

const DAY = 864e5;
const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Great-circle distance in nautical miles. */
function nm(a, b) {
  const r = (d) => (d * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lon - a.lon) / 2) ** 2;
  return 2 * 3440.1 * Math.asin(Math.sqrt(h));
}

/** A flight from the data file with everything a page needs worked out. */
function enrich(f) {
  const from = airport(f.from);
  const to = airport(f.to);
  const ac = AIRCRAFT[f.aircraft] || ['Private jet', 8, 450];
  const date = new Date(today().getTime() + f.day * DAY);
  const hours = nm(from, to) / ac[2] + 0.4;
  return {
    ...f,
    from: f.from,
    to: f.to,
    fromAirport: from,
    toAirport: to,
    category: ac[0],
    seats: ac[1],
    date,
    hours,
    saving: f.charter > f.price ? Math.round((1 - f.price / f.charter) * 100) : 0,
    perSeat: Math.round(f.price / ac[1] / 10) * 10,
  };
}

let cache = null;
/** All flights, enriched, soonest first. */
export function flights() {
  if (!cache) cache = FLIGHTS.filter((f) => AIRPORTS[f.from] && AIRPORTS[f.to]).map(enrich).sort((a, b) => a.day - b.day || a.window.localeCompare(b.window));
  return cache;
}
export const flightById = (id) => flights().find((f) => f.id.toLowerCase() === String(id || '').toLowerCase()) || null;

// ── Formatting ────────────────────────────────────────────────────────────
export const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`;
export function duration(h) {
  const m = Math.round(h * 60 / 5) * 5;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
}
export function dayLabel(date) {
  const diff = Math.round((date.getTime() - today().getTime()) / DAY);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}
export const longDate = (date) => date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
export const isoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ── A board row (home board and results list) ─────────────────────────────
export const cells = (f) => ({
  when: dayLabel(f.date),
  window: f.window,
  route: `${f.fromAirport.city}→${f.toAirport.city}`,
  routeMeta: `${f.from} to ${f.to} · ${duration(f.hours)}`,
  craft: f.aircraft,
  craftMeta: `${f.category} · ${f.seats} seats`,
  price: money(f.price),
  priceMeta: f.saving ? `${f.saving}% below charter` : '',
});
export const rowHtml = (f) => {
  const c = cells(f);
  const [a, b] = c.route.split('→');
  return `<a class="ea-row" href="flight.html?id=${f.id}" data-id="${f.id}">
      <span class="ea-when"><b data-cell="when">${esc(c.when)}</b><span data-cell="window">${esc(c.window)}</span></span>
      <span class="ea-route"><b data-cell="route">${esc(a)}<i aria-hidden="true">&rarr;</i><span class="ea-visually-hidden"> to </span>${esc(b)}</b><span data-cell="routeMeta">${esc(c.routeMeta)}</span></span>
      <span class="ea-craft"><b data-cell="craft">${esc(c.craft)}</b><span data-cell="craftMeta">${esc(c.craftMeta)}</span></span>
      <span class="ea-price"><b data-cell="price">${esc(c.price)}</b><span class="ea-save" data-cell="priceMeta">${esc(c.priceMeta)}</span></span>
      <span class="ea-arrow" aria-hidden="true">&rarr;</span>
    </a>`;
};


// ── Places: what the search boxes offer ───────────────────────────────────
/** One entry per city, with its airports. */
export function places() {
  const map = new Map();
  for (const [code, a] of Object.entries(AIRPORTS)) {
    const key = a[0];
    if (!map.has(key)) map.set(key, { city: a[0], country: a[2], codes: [] });
    map.get(key).codes.push(code);
  }
  return [...map.values()].sort((a, b) => a.city.localeCompare(b.city));
}

/** Does an airport match what was typed: city, country, airport name or code. */
export function matches(code, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  const a = airport(code);
  if (!a) return false;
  return a.code.toLowerCase() === q || a.city.toLowerCase() === q || a.country.toLowerCase() === q || a.city.toLowerCase().startsWith(q) || a.name.toLowerCase().startsWith(q);
}

export const CATEGORIES = ['Turboprop', 'Light jet', 'Midsize jet', 'Super midsize jet', 'Heavy jet', 'Ultra long range'];

/**
 * The flights for a search. A date shows flights within 3 days of it, nearest first.
 * @param {{from?: string, to?: string, date?: string, pax?: string|number, cat?: string, sort?: string}} q
 */
export function search(q = {}) {
  let list = flights().filter((f) => matches(f.from, q.from) && matches(f.to, q.to));
  const pax = Number(q.pax) || 0;
  if (pax) list = list.filter((f) => f.seats >= pax);
  if (q.cat) list = list.filter((f) => f.category === q.cat);
  let near = null;
  if (q.date) {
    const want = new Date(`${q.date}T00:00:00`).getTime();
    if (Number.isFinite(want)) {
      near = (f) => Math.abs(f.date.getTime() - want) / DAY;
      list = list.filter((f) => near(f) <= 3);
    }
  }
  const sorts = {
    soonest: (a, b) => (near ? near(a) - near(b) : 0) || a.date - b.date || a.window.localeCompare(b.window),
    price: (a, b) => a.price - b.price,
    saving: (a, b) => b.saving - a.saving,
  };
  return [...list].sort(sorts[q.sort] || sorts.soonest);
}

// ── The search form ───────────────────────────────────────────────────────
// Markup: form[data-ea-search] with inputs name="from", "to" (each inside [data-place] with a
// [role=listbox] sibling list), "date", "pax", and an optional [data-swap] button.
// The place inputs are comboboxes: type to filter the cities, arrows to move, Enter to pick.

/** @param {HTMLFormElement} form */
export function searchForm(form) {
  if (!form) return;
  const all = places();
  const date = form.querySelector('input[name="date"]');
  if (date) date.min = isoDate(today());

  // Fill from the address on the results page.
  const params = new URLSearchParams(location.search);
  for (const name of ['from', 'to', 'date', 'pax']) {
    const el = form.elements.namedItem(name);
    if (el && params.get(name)) el.value = params.get(name);
  }

  form.querySelectorAll('[data-place]').forEach((wrap, n) => {
    const input = wrap.querySelector('input');
    const list = wrap.querySelector('[role="listbox"]');
    if (!input || !list) return;
    const id = `${input.name}-${n}-options`;
    list.id = id;
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', id);
    let active = -1;
    let shown = [];

    const close = () => {
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    };
    const paint = () => {
      list.querySelectorAll('[role="option"]').forEach((li, i) => {
        li.setAttribute('aria-selected', String(i === active));
        if (i === active) input.setAttribute('aria-activedescendant', li.id);
      });
    };
    const open = () => {
      const q = input.value.trim().toLowerCase();
      shown = all.filter((p) => !q || p.city.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.codes.some((c) => c.toLowerCase() === q)).slice(0, 7);
      if (!shown.length) return close();
      list.innerHTML = shown
        .map((p, i) => `<li role="option" id="${id}-${i}" data-city="${esc(p.city)}"><b>${esc(p.city)}</b><span>${esc(p.country)} · ${p.codes.join(', ')}</span></li>`)
        .join('');
      list.classList.toggle('is-up', form.dataset.open === 'up');   // the hero search sits at the bottom of the screen
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      active = -1;
    };
    const pick = (i) => {
      if (!shown[i]) return;
      input.value = shown[i].city;
      close();
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    input.addEventListener('input', open);
    input.addEventListener('focus', open);
    input.addEventListener('keydown', (e) => {
      if (list.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) open();
      if (e.key === 'ArrowDown') { active = Math.min(shown.length - 1, active + 1); paint(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { active = Math.max(0, active - 1); paint(); e.preventDefault(); }
      else if (e.key === 'Enter' && !list.hidden && active >= 0) { pick(active); e.preventDefault(); }
      else if (e.key === 'Escape') close();
    });
    // mousedown, not click: it lands before the input's blur closes the list
    list.addEventListener('mousedown', (e) => {
      const li = e.target.closest('[role="option"]');
      if (!li) return;
      e.preventDefault();
      pick([...list.children].indexOf(li));
    });
    input.addEventListener('blur', () => setTimeout(close, 120));
  });

  // Submit to the results page with only the fields that were filled in. The results page
  // handles its own submit (data-live) and never navigates.
  form.addEventListener('submit', (e) => {
    if (form.hasAttribute('data-live')) return;
    e.preventDefault();
    const q = new URLSearchParams();
    for (const [k, v] of new FormData(form)) if (String(v).trim()) q.set(k, String(v).trim());
    location.href = `${form.getAttribute('action')}${q.toString() ? `?${q}` : ''}`;
  });

  form.querySelector('[data-swap]')?.addEventListener('click', () => {
    const a = form.elements.namedItem('from');
    const b = form.elements.namedItem('to');
    if (!a || !b) return;
    [a.value, b.value] = [b.value, a.value];
    form.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
