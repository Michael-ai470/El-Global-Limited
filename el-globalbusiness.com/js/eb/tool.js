// js/eb/tool.js
// Shared plumbing for the El-Business tools. Not motion: everything here runs for every
// visitor. Each tool page module (valuation.js, deal-memo.js, red-flag.js) calls tool()
// with its form and a compute function, and gets live results as the visitor types.
//
// What every tool gets from here:
//   - a currency (GBP / USD / EUR) chosen once and remembered across the tools
//   - money fields that read "25m", "2.5bn", "750k" or "25,000,000" and show 25,000,000
//   - inputs saved on this device as they are typed, restored on the next visit; a link
//     that carries the inputs (?name=value) so a result can be shared
//   - "Try an example" and "Clear" buttons
//   - copy to clipboard, print only the result, and a result bar pinned to phone screens
//
// Markup contract:
//   form[data-tool="<key>"]          the inputs, each with a name; money inputs carry
//                                    data-money; [data-error="<name>"] slots for errors
//   [data-currency] > button[data-cur="GBP|USD|EUR"]
//   [data-example], [data-clear], [data-saved]
//   [data-cur-symbol]                any element that should show the currency symbol

const CURRENCIES = {
  GBP: { symbol: '£', locale: 'en-GB' },
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
};
const CUR_KEY = 'eb-currency';

let currency = (() => {
  try {
    return CURRENCIES[localStorage.getItem(CUR_KEY)] ? localStorage.getItem(CUR_KEY) : 'GBP';
  } catch {
    return 'GBP';
  }
})();

export const getCurrency = () => currency;
export const symbol = () => CURRENCIES[currency].symbol;

/** £48.2m, $1.25bn, €750k: short money for headlines. */
export function money(v) {
  if (!Number.isFinite(v)) return '—';
  const s = symbol();
  const a = Math.abs(v);
  const sign = v < 0 ? '−' : '';
  if (a >= 1e9) return `${sign}${s}${(a / 1e9).toFixed(a >= 1e10 ? 1 : 2)}bn`;
  if (a >= 1e6) return `${sign}${s}${(a / 1e6).toFixed(1)}m`; // one decimal always, so a range reads evenly
  if (a >= 1e3) return `${sign}${s}${Math.round(a / 1e3).toLocaleString('en-GB')}k`;
  return `${sign}${s}${Math.round(a).toLocaleString('en-GB')}`;
}

/** 25,000,000: full figures for fields and tables. */
export const full = (v) => (Number.isFinite(v) ? Math.round(v).toLocaleString('en-GB') : '');

/** Reads "25m", "2.5bn", "750k", "£25,000,000", "25 000 000". NaN when empty or unreadable. */
export function parseMoney(raw) {
  const s = String(raw ?? '').trim().toLowerCase().replace(/[£$€,\s]/g, '').replace(/[−–]/g, '-');
  if (!s) return NaN;
  const m = s.match(/^(-?\d*\.?\d+)(k|m|mm|mn|bn|b)?$/);
  if (!m) return NaN;
  const n = parseFloat(m[1]);
  const mult = { k: 1e3, m: 1e6, mm: 1e6, mn: 1e6, b: 1e9, bn: 1e9 }[m[2]] || 1;
  return n * mult;
}

/** A plain number (percent, count): NaN when empty. */
export function parseNumber(raw) {
  const s = String(raw ?? '').trim().replace(/[,%\s]/g, '').replace(/[−–]/g, '-'); // a typed or pasted minus sign
  if (!s) return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

const debounce = (fn, ms) => {
  let t = 0;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
};

/**
 * Wires a tool. compute(values) is called on every change with the raw values by name
 * (money fields already parsed to numbers); render is up to the tool.
 * @param {{ form: HTMLFormElement, example: Record<string,string>, compute: (v: Record<string, any>) => void }} opts
 */
export function tool({ form, example, compute }) {
  const key = `eb-tool-${form.dataset.tool}`;
  const fields = Array.from(form.elements).filter((el) => el.name);
  const saved = document.querySelector('[data-saved]');

  const values = () => {
    const out = {};
    for (const el of fields) {
      if (el.type === 'radio' && !el.checked) continue;
      out[el.name] = el.hasAttribute('data-money') ? parseMoney(el.value) : el.value;
    }
    return out;
  };
  const raw = () => Object.fromEntries(fields.filter((el) => el.type !== 'radio' || el.checked).map((el) => [el.name, el.value]));
  const fill = (data) => {
    for (const el of fields) {
      if (!(el.name in data)) continue;
      if (el.type === 'radio') el.checked = el.value === data[el.name];
      else el.value = data[el.name];
      if (el.hasAttribute('data-money')) formatMoneyField(el);
    }
  };

  const store = debounce(() => {
    try {
      localStorage.setItem(key, JSON.stringify(raw()));
      if (saved) saved.textContent = 'Saved on this device';
    } catch {
      /* private mode: nothing saved, nothing breaks */
    }
  }, 400);

  const update = () => {
    compute(values());
    store();
  };

  // Money fields: show the full figure once the visitor leaves the field.
  for (const el of fields.filter((f) => f.hasAttribute('data-money'))) {
    el.addEventListener('blur', () => formatMoneyField(el));
  }
  form.addEventListener('input', (e) => {
    const err = form.querySelector(`[data-error="${e.target.name}"]`);
    if (err) err.textContent = '';
    e.target.removeAttribute?.('aria-invalid');
    update();
  });
  form.addEventListener('change', update);
  form.addEventListener('submit', (e) => e.preventDefault());

  // Start from the link's values, else what was saved, else empty.
  const params = new URLSearchParams(location.search);
  const fromLink = Object.fromEntries(fields.map((f) => f.name).filter((n) => params.has(n)).map((n) => [n, params.get(n)]));
  if (Object.keys(fromLink).length) fill(fromLink);
  else {
    try {
      const prev = JSON.parse(localStorage.getItem(key) || 'null');
      if (prev) {
        fill(prev);
        if (saved) saved.textContent = 'Restored from your last visit';
      }
    } catch {
      /* ignore */
    }
  }

  document.querySelector('[data-example]')?.addEventListener('click', () => {
    fill(example);
    update();
  });
  document.querySelector('[data-clear]')?.addEventListener('click', () => {
    form.reset();
    fields.forEach((el) => el.removeAttribute('aria-invalid'));
    form.querySelectorAll('[data-error]').forEach((el) => (el.textContent = ''));
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    if (saved) saved.textContent = '';
    history.replaceState(null, '', location.pathname);
    compute(values());
  });

  bindCurrency(() => {
    fields.filter((f) => f.hasAttribute('data-money')).forEach(formatMoneyField);
    compute(values());
  });

  compute(values());

  return {
    values,
    /** A link to this page that carries the current inputs. */
    link: () => {
      const p = new URLSearchParams();
      for (const [k, v] of Object.entries(raw())) if (v !== '') p.set(k, v);
      return `${location.origin}${location.pathname}?${p}`;
    },
    /** Marks a field wrong, with its message under it. */
    error: (name, message) => {
      const el = form.elements.namedItem(name);
      const slot = form.querySelector(`[data-error="${name}"]`);
      if (el && 'setAttribute' in el) el.setAttribute('aria-invalid', 'true');
      if (slot) slot.textContent = message;
    },
  };
}

function formatMoneyField(el) {
  const v = parseMoney(el.value);
  if (Number.isFinite(v)) el.value = full(v);
}

function bindCurrency(onChange) {
  const box = document.querySelector('[data-currency]');
  const paint = () => {
    box?.querySelectorAll('button[data-cur]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cur === currency)));
    document.querySelectorAll('[data-cur-symbol]').forEach((el) => (el.textContent = symbol()));
  };
  box?.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-cur]');
    if (!b) return;
    currency = b.dataset.cur;
    try {
      localStorage.setItem(CUR_KEY, currency);
    } catch {
      /* ignore */
    }
    paint();
    onChange();
  });
  paint();
}

/** Copies text; the button says "Copied" for a moment. */
export async function copy(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    flash(button, 'Copied');
  } catch {
    flash(button, 'Press Ctrl+C');
  }
}

function flash(button, label) {
  if (!button) return;
  const before = button.dataset.label || button.textContent;
  button.dataset.label = before;
  button.textContent = label;
  button.classList.add('is-done');
  setTimeout(() => {
    button.textContent = before;
    button.classList.remove('is-done');
  }, 1800);
}

/** Prints only the element marked [data-print-area] (css/eb.css). */
export function printResult() {
  document.body.classList.add('eb-printing');
  const done = () => {
    document.body.classList.remove('eb-printing');
    window.removeEventListener('afterprint', done);
  };
  window.addEventListener('afterprint', done);
  window.print();
  setTimeout(done, 1000); // browsers that never fire afterprint
}

/** The result bar pinned to phone screens: text, and a tap that scrolls to the result. */
export function mobileBar(bar, target) {
  if (!bar) return () => {};
  bar.addEventListener('click', (e) => {
    e.preventDefault();
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => (bar.dataset.seen = entry.isIntersecting ? '1' : '')) : null;
  io?.observe(target);
  return (html) => {
    if (!html) {
      bar.hidden = true;
      return;
    }
    bar.innerHTML = html;
    bar.hidden = false;
  };
}

/** Escapes text for HTML. */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
