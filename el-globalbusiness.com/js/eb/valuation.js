// js/eb/valuation.js
// The El-Business valuation tool. Results update as the visitor types (js/eb/tool.js).
//
// The model (indicative, multiples-based):
//   - Earnings method (primary): EBITDA × the sector's EV/EBITDA range, adjusted for the
//     company's stage and growth.
//   - Revenue method (cross-check): revenue × the sector's EV/Revenue range, adjusted for stage.
//   - Confidence: how complete the inputs are, plus how far the two methods agree.
// EBITDA can come from revenue × margin when it is not entered; when both are entered and
// disagree, the tool says so and uses EBITDA.
import { tool, money, full, copy, printResult, mobileBar, esc, symbol } from './tool.js?v=105886350e';

const SECTORS = {
  technology:     { label: 'Technology / SaaS',      evEbitda: [12, 18], evRev: [3, 6] },
  healthcare:     { label: 'Healthcare',             evEbitda: [10, 16], evRev: [2, 5] },
  financial:      { label: 'Financial services',     evEbitda: [8, 14],  evRev: [2, 4] },
  manufacturing:  { label: 'Manufacturing',          evEbitda: [6, 10],  evRev: [1, 2.5] },
  consumer:       { label: 'Consumer / retail',      evEbitda: [7, 12],  evRev: [1, 3] },
  energy:         { label: 'Energy / utilities',     evEbitda: [5, 9],   evRev: [1, 2] },
  realestate:     { label: 'Real estate',            evEbitda: [10, 16], evRev: [3, 6] },
  media:          { label: 'Media / entertainment',  evEbitda: [8, 14],  evRev: [2, 4] },
  professional:   { label: 'Professional services',  evEbitda: [8, 14],  evRev: [1.5, 3] },
  infrastructure: { label: 'Infrastructure',         evEbitda: [8, 14],  evRev: [1.5, 3] },
};
const STAGES = { startup: ['Early stage', 0.7], growth: ['Growth stage', 1.15], mature: ['Mature', 1.0], turnaround: ['Turnaround', 0.6] };

const growthFactor = (g) => (!Number.isFinite(g) ? 1 : g > 25 ? 1.25 : g > 15 ? 1.12 : g > 5 ? 1 : g > 0 ? 0.9 : 0.75);
const pct = (v, d = 1) => `${v.toFixed(d)}%`;

/** Pure: the valuation from the inputs, or what is still needed. */
export function valuate(v) {
  const sector = SECTORS[v.industry];
  const revenue = v.revenue;
  let ebitda = v.ebitda;
  const margin = Number.isFinite(parseFloat(v.margin)) ? parseFloat(v.margin) : NaN;
  const growth = Number.isFinite(parseFloat(v.growth)) ? parseFloat(v.growth) : NaN;
  const notes = [];

  let derived = false;
  if (!Number.isFinite(ebitda) && Number.isFinite(revenue) && Number.isFinite(margin)) {
    ebitda = (revenue * margin) / 100;
    derived = true;
  }
  const needed = [
    { label: 'Industry sector', done: !!sector },
    { label: 'Annual revenue', done: Number.isFinite(revenue) && revenue > 0 },
    { label: 'EBITDA, or an EBITDA margin', done: Number.isFinite(ebitda) },
  ];
  if (needed.some((n) => !n.done)) return { needed };

  if (derived) notes.push(`EBITDA worked out from revenue × your ${pct(margin)} margin: ${money(ebitda)}.`);
  if (!derived && Number.isFinite(margin)) {
    const implied = (ebitda / revenue) * 100;
    if (Math.abs(implied - margin) > 2) notes.push({ warn: true, text: `Your margin (${pct(margin)}) differs from EBITDA ÷ revenue (${pct(implied)}). The range uses EBITDA.` });
  }

  const stage = STAGES[v.stage];
  const stageAdj = stage ? stage[1] : 1;
  const gAdj = growthFactor(growth);
  const earningsOk = ebitda > 0;
  const earn = earningsOk ? [sector.evEbitda[0] * stageAdj * gAdj, sector.evEbitda[1] * stageAdj * gAdj].map((m) => m * ebitda) : null;
  const rev = [sector.evRev[0] * stageAdj, sector.evRev[1] * stageAdj].map((m) => m * revenue);
  if (!earningsOk) notes.push({ warn: true, text: 'EBITDA is zero or negative, so EV/EBITDA does not apply. The range below uses revenue multiples only.' });

  const main = earn || rev;
  const mid = (main[0] + main[1]) / 2;

  // How far the methods agree: the overlap of the two ranges as a share of their span.
  let agree = 0;
  if (earn) {
    const overlap = Math.max(0, Math.min(earn[1], rev[1]) - Math.max(earn[0], rev[0]));
    const span = Math.max(earn[1], rev[1]) - Math.min(earn[0], rev[0]);
    agree = span > 0 ? overlap / span : 0;
  }
  const inputs = ['company', 'industry', 'geography', 'revenue', 'ebitda', 'growth', 'margin', 'stage'];
  const filled = inputs.filter((k) => (typeof v[k] === 'number' ? Number.isFinite(v[k]) : !!v[k])).length;
  const confidence = Math.round(Math.min(95, 35 + (filled / inputs.length) * 35 + agree * 25));

  return {
    needed,
    ok: true,
    company: v.company?.trim(),
    sector,
    stage: stage?.[0],
    growth,
    ebitda,
    revenue,
    range: main,
    mid,
    earn,
    rev,
    agree,
    filled,
    confidence,
    multiple: earn ? mid / ebitda : NaN,
    revMultiple: mid / revenue,
    gAdj,
    stageAdj,
    margin: (ebitda / revenue) * 100,
    notes,
  };
}

function render(r, out) {
  if (!r.ok) {
    out.innerHTML = `<div class="eb-needed"><h3>Your valuation appears here</h3>
      <p>Fill in these three and the range updates as you type. Everything else makes it more precise.</p>
      <ul>${r.needed.map((n) => `<li class="${n.done ? 'is-done' : ''}">${esc(n.label)}</li>`).join('')}</ul></div>`;
    return;
  }
  const hi = Math.max(r.range[1], r.rev[1]) * 1.1;
  const bar = (range, alt) => `<div class="eb-range-track"><span class="eb-range-bar${alt ? ' is-alt' : ''}" style="left:${(range[0] / hi) * 100}%;width:${((range[1] - range[0]) / hi) * 100}%"></span></div>`;
  const notes = r.notes.map((n) => (typeof n === 'string' ? { text: n } : n));
  out.innerHTML = `
    <div class="eb-headline">
      <small>${r.company ? `${esc(r.company)} · ` : ''}Enterprise value, indicative</small>
      <strong>${money(r.range[0])} – ${money(r.range[1])}</strong>
      <p>Midpoint ${money(r.mid)} · ${esc(r.sector.label)}${r.stage ? ` · ${esc(r.stage)}` : ''}</p>
    </div>
    <div class="eb-section">
      <h3>Two methods on one scale</h3>
      <div class="eb-ranges">
        ${r.earn ? `<div class="eb-range-row"><span>Earnings (EV/EBITDA)</span>${bar(r.earn)}</div>` : ''}
        <div class="eb-range-row"><span>Revenue (EV/Revenue)</span>${bar(r.rev, true)}</div>
      </div>
      <div class="eb-range-labels"><span>${money(0)}</span><span>${money(hi / 2)}</span><span>${money(hi)}</span></div>
      ${r.earn ? `<p class="eb-note">The methods overlap by ${Math.round(r.agree * 100)}%. ${r.agree > 0.4 ? 'They broadly agree.' : 'They diverge: check margins against sector norms.'}</p>` : ''}
    </div>
    <div class="eb-section">
      <h3>Multiples and metrics</h3>
      <div class="eb-stats">
        <div class="eb-stat"><b>${Number.isFinite(r.multiple) ? `${r.multiple.toFixed(1)}x` : '—'}</b><span>EV / EBITDA at the midpoint</span></div>
        <div class="eb-stat"><b>${r.revMultiple.toFixed(1)}x</b><span>EV / revenue at the midpoint</span></div>
        <div class="eb-stat"><b>${pct(r.margin)}</b><span>EBITDA margin</span></div>
        <div class="eb-stat"><b>${Math.round(r.gAdj * r.stageAdj * 100)}%</b><span>Growth and stage adjustment</span></div>
      </div>
    </div>
    <div class="eb-section">
      <h3>Confidence: ${r.confidence}%</h3>
      <div class="eb-meter"><i style="width:${r.confidence}%"></i></div>
      <p class="eb-note">From how complete the inputs are (${r.filled} of 8) and how closely the two methods agree.</p>
      ${notes.map((n) => `<p class="eb-note${n.warn ? ' is-warn' : ''}">${esc(n.text)}</p>`).join('')}
    </div>
    <p class="eb-disclaimer">Indicative only, from sector multiples. A formal valuation (DCF, precedent transactions, due diligence) is part of an El&amp;Rock engagement.</p>`;
}

function summary(r) {
  if (!r.ok) return '';
  return [
    `Indicative valuation${r.company ? ` — ${r.company}` : ''}`,
    `Enterprise value: ${money(r.range[0])} – ${money(r.range[1])} (midpoint ${money(r.mid)})`,
    `Sector: ${r.sector.label}${r.stage ? ` · ${r.stage}` : ''}`,
    `Revenue ${symbol()}${full(r.revenue)} · EBITDA ${symbol()}${full(r.ebitda)} (${pct(r.margin)} margin)`,
    Number.isFinite(r.multiple) ? `EV/EBITDA ${r.multiple.toFixed(1)}x · EV/Revenue ${r.revMultiple.toFixed(1)}x` : `EV/Revenue ${r.revMultiple.toFixed(1)}x`,
    `Confidence ${r.confidence}%`,
    'Indicative only, from sector multiples (El-Business).',
  ].join('\n');
}

const form = document.querySelector('form[data-tool="valuation"]');
const out = document.querySelector('[data-result]');
if (form && out) {
  let last = { ok: false };
  const bar = mobileBar(document.querySelector('[data-mobile-bar]'), document.querySelector('[data-results]'));
  const api = tool({
    form,
    example: { company: 'Acme Holdings Ltd', industry: 'technology', geography: 'uk', revenue: '25m', ebitda: '5m', growth: '18', margin: '', stage: 'growth' },
    compute: (v) => {
      last = valuate(v);
      render(last, out);
      document.querySelectorAll('[data-needs-result]').forEach((b) => (b.disabled = !last.ok));
      bar(last.ok ? `<span>Valuation</span><b>${money(last.range[0])} – ${money(last.range[1])}</b><span aria-hidden="true">View ↓</span>` : '');
    },
  });
  document.querySelector('[data-copy]')?.addEventListener('click', (e) => copy(summary(last), e.currentTarget));
  document.querySelector('[data-share]')?.addEventListener('click', (e) => copy(api.link(), e.currentTarget));
  document.querySelector('[data-print]')?.addEventListener('click', printResult);
}
