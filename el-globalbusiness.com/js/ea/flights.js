// js/ea/flights.js
// El-Access results. Not motion. The search form updates the list in place (and the address,
// so a search can be shared); chips narrow by aircraft size; the sort reorders. When nothing
// matches, it says so, offers what else leaves from that city, and points to the request form.
import { search, searchForm, rowHtml, money, CATEGORIES, flights, EXAMPLE, esc, markInvite } from './lib.js?v=1280348b3d';
import { enquiryForm } from '../recipes/enquiry-form.js?v=e5c4ed6300';

const $ = (s) => document.querySelector(s);
const form = $('[data-ea-search]');
const list = $('[data-results]');
const count = $('[data-results-count]');   // not [data-count]: js/main.js counts those up
const title = $('[data-results-title]');
const chips = $('[data-cats]');
const sortBox = $('[data-sort]');
const routeFill = $('[data-route-fill]');

searchForm(form);
markInvite($('#request form'));
enquiryForm($('#request'));

const params = new URLSearchParams(location.search);
const state = {
  from: params.get('from') || '',
  to: params.get('to') || '',
  date: params.get('date') || '',
  pax: params.get('pax') || '',
  cat: params.get('cat') || '',
  sort: params.get('sort') || 'soonest',
};
if (sortBox) sortBox.value = state.sort;

// Chips: every aircraft size the data actually has.
const have = new Set(flights().map((f) => f.category));
const cats = CATEGORIES.filter((c) => have.has(c));
if (chips) {
  chips.innerHTML = [['', 'All aircraft'], ...cats.map((c) => [c, c])]
    .map(([v, t]) => `<button type="button" class="ea-chip" data-cat="${esc(v)}" aria-pressed="${String(state.cat === v)}">${esc(t)}</button>`)
    .join('');
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    state.cat = b.dataset.cat;
    chips.querySelectorAll('[data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render();
  });
}
sortBox?.addEventListener('change', () => { state.sort = sortBox.value; render(); });

const read = () => {
  for (const k of ['from', 'to', 'date', 'pax']) state[k] = String(form.elements.namedItem(k)?.value || '').trim();
};
let t = 0;
form?.addEventListener('submit', (e) => { e.preventDefault(); read(); render(); list?.scrollIntoView({ block: 'nearest' }); });
form?.addEventListener('change', () => { read(); render(); });
form?.addEventListener('input', (e) => {
  if (e.target.matches('input[type="text"]')) { clearTimeout(t); t = setTimeout(() => { read(); render(); }, 250); }
});

function heading() {
  const { from, to } = state;
  if (from && to) return `${esc(from)}<i aria-hidden="true">&rarr;</i><span class="ea-visually-hidden"> to </span>${esc(to)}`;
  if (from) return `Flights from ${esc(from)}`;
  if (to) return `Flights to ${esc(to)}`;
  return 'Empty-leg flights';
}

function render() {
  const results = search(state);
  if (title) title.innerHTML = heading();
  document.title = `${title?.textContent || 'Flights'} — El-Access`;
  // Keep the address in step, so the search can be shared or reloaded.
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(state)) if (v && !(k === 'sort' && v === 'soonest')) q.set(k, v);
  history.replaceState(null, '', `${location.pathname}${q.toString() ? `?${q}` : ''}${location.hash}`);
  if (routeFill && !routeFill.value && (state.from || state.to)) routeFill.placeholder = `e.g. ${state.from || 'anywhere'} to ${state.to || 'anywhere'}`;

  list.querySelectorAll('li:not(.ea-row-head)').forEach((li) => li.remove());
  if (results.length) {
    const low = Math.min(...results.map((f) => f.price));
    count.innerHTML = `<b>${results.length}</b> ${results.length === 1 ? 'flight' : 'flights'} · from ${money(low)}${state.date ? ' · within 3 days of your date' : ''}`;
    list.hidden = false;
    list.insertAdjacentHTML('beforeend', results.map((f) => `<li>${rowHtml(f)}</li>`).join(''));
    return;
  }
  // Nothing: say so plainly, and offer the nearest thing.
  const alt = state.from ? search({ from: state.from }) : [];
  count.innerHTML = '';
  list.insertAdjacentHTML('beforeend', `<li class="ea-empty">
      <h3>No empty legs match that yet</h3>
      <p>New ones are listed every day. <a class="ea-link" href="#request">Request this route</a> and we will tell you when one fits${alt.length ? `, or take one of these from ${esc(state.from)}:` : '.'}</p>
    </li>${alt.slice(0, 6).map((f) => `<li>${rowHtml(f)}</li>`).join('')}`);
}

const exampleNote = $('[data-example-note]');
if (exampleNote && EXAMPLE) exampleNote.textContent = 'Example fares, for illustration. Prices are for the whole aircraft; taxes and fees are itemised before you pay.';

render();
