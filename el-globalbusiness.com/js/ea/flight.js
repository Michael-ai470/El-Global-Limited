// js/ea/flight.js
// El-Access flight page: flight.html?id=EA101. Not motion. Fills the page from js/ea/data.js,
// fills the request form's hidden fields (so the team gets the flight with the request) and
// offers more flights from the same city. An unknown id shows "That flight has gone".
import { flightById, search, rowHtml, money, duration, longDate, esc, EXAMPLE, markInvite } from './lib.js?v=1280348b3d';
import { enquiryForm } from '../recipes/enquiry-form.js?v=e5c4ed6300';

const $ = (s) => document.querySelector(s);
const set = (k, v) => { const el = $(`[data-f-${k}]`); if (el) el.textContent = v; };

// Destination photos already on the site; anything else gets the jet on the apron.
const PHOTOS = {
  Dubai: ['dubai-burj-khalifa', [700, 800, 900]],
  'New York': ['new-york-skyline-twilight', [700, 800, 900]],
  London: ['london-tower-bridge', [700, 800, 900]],
  Geneva: ['swiss-alps', [700, 800, 900]],
  Zurich: ['swiss-alps', [700, 800, 900]],
  'Cape Town': ['cape-town-table-mountain', [700, 800, 900]],
  Madrid: ['madrid-skyline', [700, 800, 900]],
  Lagos: ['nigeria', [700]],
};
const FALLBACK = ['private-jet-airstair', [1000, 1200, 1400]];

const f = flightById(new URLSearchParams(location.search).get('id'));
if (!f) {
  $('[data-missing]').hidden = false;
  document.title = 'Flight not found — El-Access';
} else {
  $('[data-flight]').hidden = false;
  const route = `${f.fromAirport.city} to ${f.toAirport.city}`;
  document.title = `${route}, ${longDate(f.date)} — El-Access`;
  set('id', f.id);
  $('[data-f-title]').innerHTML = `${esc(f.fromAirport.city)}<i aria-hidden="true">&rarr;</i><span class="ea-visually-hidden"> to </span>${esc(f.toAirport.city)}`;
  set('lead', `${longDate(f.date)} · departs between ${f.window.replace('–', ' and ')} local time`);
  set('from-code', f.from);
  set('from-name', `${f.fromAirport.name}, ${f.fromAirport.city}`);
  set('to-code', f.to);
  set('to-name', `${f.toAirport.name}, ${f.toAirport.city}`);
  set('dur', `about ${duration(f.hours)}`);
  set('craft', f.aircraft);
  set('cat', f.category);
  set('seats', `Up to ${f.seats}`);
  set('window', `${f.window}, ${longDate(f.date)}`);
  set('time', `About ${duration(f.hours)}`);
  set('price', money(f.price));
  set('charter', money(f.charter));
  set('save', f.saving ? `${f.saving}% less` : '');
  set('example', EXAMPLE ? 'Example fare, for illustration.' : '');

  const [photo, sizes] = PHOTOS[f.toAirport.city] || FALLBACK;
  const img = $('[data-f-photo]');
  img.src = `../img/photos/${photo}-${sizes[sizes.length - 1]}.webp`;
  img.srcset = sizes.map((w) => `../img/photos/${photo}-${w}.webp ${w}w`).join(', ');
  img.sizes = '(max-width: 1024px) 100vw, 60vw';
  img.alt = PHOTOS[f.toAirport.city] ? `${f.toAirport.city}` : 'A private jet on the apron with its stairs down';

  // The request carries the flight.
  const fill = { flight: f.id, route: `${route} (${f.from} to ${f.to}), ${f.aircraft}`, departs: `${longDate(f.date)}, ${f.window}`, price: `${money(f.price)} whole aircraft` };
  document.querySelectorAll('[data-f-input]').forEach((el) => { el.value = fill[el.dataset.fInput] || ''; });
  const form = $('form[data-enquiry]');
  form.dataset.subject = `El-Access request: ${f.id}, ${route}`;
  const pax = $('[data-f-pax]');
  pax.innerHTML = Array.from({ length: f.seats }, (_, i) => `<option${i === 1 ? ' selected' : ''}>${i + 1}</option>`).join('');
  markInvite(form);
  enquiryForm($('.ea-book'));

  // More from the same city.
  const more = search({ from: f.fromAirport.city }).filter((x) => x.id !== f.id).slice(0, 5);
  const list = $('[data-f-more]');
  if (more.length) {
    $('[data-f-more-title]').innerHTML = `More from <em>${esc(f.fromAirport.city)}</em>`;
    $('[data-f-more-link]').href = `flights.html?from=${encodeURIComponent(f.fromAirport.city)}`;
    list.innerHTML = more.map((x) => `<li>${rowHtml(x)}</li>`).join('');
  } else {
    list.closest('section').hidden = true;
  }
}
