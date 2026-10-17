// js/eb/deal-memo.js
// The El-Business deal memo. The memo is written as the visitor types (js/eb/tool.js):
// no waiting, and nothing invented. Whatever is left blank shows as "To be confirmed",
// so the memo never states terms, risks or a valuation the visitor did not give.
import { tool, money, full, copy, printResult, mobileBar, esc, symbol } from './tool.js?v=105886350e';

const INDUSTRIES = {
  technology: 'Technology / SaaS', healthcare: 'Healthcare', financial: 'Financial services', manufacturing: 'Manufacturing',
  consumer: 'Consumer / retail', energy: 'Energy / utilities', realestate: 'Real estate', professional: 'Professional services',
  media: 'Media / entertainment', infrastructure: 'Infrastructure',
};
const STRUCTURES = {
  share: 'Share purchase (100%)', asset: 'Asset purchase', majority: 'Majority stake', minority: 'Minority investment',
  merger: 'Merger of equals', mbo: 'Management buyout (MBO)',
};
// Total weeks for each timeline; the process phases below are spread across it.
const TIMELINES = { '1-3': ['1–3 months', 12], '3-6': ['3–6 months', 24], '6-12': ['6–12 months', 48], '12+': ['12+ months', 60] };
const PHASES = [
  ['Indicative offer and NDA', 0.12],
  ['Due diligence: financial, legal, commercial, operational', 0.6],
  ['SPA negotiation and agreed documents', 0.85],
  ['Signing and completion, subject to conditions', 1],
];

const TBC = 'To be confirmed';
const tbc = (what) => `<span class="tbc">${what ? `${TBC}: ${esc(what)}` : TBC}</span>`;
const text = (s) => (s || '').trim();

/** The memo's headline for the chosen structure. */
function title(m) {
  const t = esc(m.target);
  const a = esc(m.acquirer);
  if (m.structure === 'merger') return `Proposed merger of ${a} and ${t}`;
  if (m.structure === 'minority') return `Proposed investment in ${t} by ${a}`;
  if (m.structure === 'mbo') return `Proposed management buyout of ${t}`;
  return `Proposed acquisition of ${t} by ${a}`;
}

/** Pure: the memo's content from the inputs, or what is still needed. */
export function draft(v) {
  const m = {
    target: text(v.target),
    acquirer: text(v.acquirer),
    author: text(v.author),
    industry: INDUSTRIES[v.industry],
    size: Number.isFinite(v.size) && v.size > 0 ? v.size : NaN,
    structure: v.structure,
    structureLabel: STRUCTURES[v.structure],
    timeline: TIMELINES[v.timeline],
    rationale: text(v.rationale),
    terms: text(v.terms),
    risks: text(v.risks),
  };
  const needed = [
    { label: 'Target company', done: !!m.target },
    { label: 'Acquirer or buyer', done: !!m.acquirer },
  ];
  if (needed.some((n) => !n.done)) return { needed };
  const optional = ['industry', 'size', 'structureLabel', 'timeline', 'rationale', 'terms', 'risks'];
  const missing = optional.filter((k) => (k === 'size' ? !Number.isFinite(m.size) : !m[k])).length;
  return { ...m, needed, ok: true, missing, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) };
}

function phases(m) {
  const weeks = m.timeline?.[1];
  let from = 1;
  return PHASES.map(([what, share], i) => {
    const to = weeks ? Math.max(from + 1, Math.round(weeks * share)) : 0;
    const when = weeks ? `Weeks ${from}–${to}` : tbc();
    from = to + 1;
    return `<tr><td>Phase ${i + 1}</td><td>${what}</td><td>${when}</td></tr>`;
  }).join('');
}

function render(m, out) {
  if (!m.ok) {
    out.innerHTML = `<div class="eb-needed"><h3>Your memo appears here</h3>
      <p>Name the two parties and the memo starts writing itself. Anything you leave blank is marked "${TBC}", never made up.</p>
      <ul>${m.needed.map((n) => `<li class="${n.done ? 'is-done' : ''}">${esc(n.label)}</li>`).join('')}</ul></div>`;
    return;
  }
  const size = Number.isFinite(m.size) ? `${symbol()}${full(m.size)} <span class="eb-memo-short">(${money(m.size)})</span>` : tbc();
  out.innerHTML = `
    ${m.missing ? `<p class="eb-note" data-no-print>${m.missing} ${m.missing === 1 ? 'section is' : 'sections are'} marked "${TBC}". Fill them in on the left and the memo updates.</p>` : ''}
    <article class="eb-memo">
      <div class="eb-memo-top"><b>El-Business · Deal memo</b><span>${m.date}${m.author ? ` · Prepared by ${esc(m.author)}` : ''}</span></div>
      <h2>Investment memorandum</h2>
      <p class="eb-memo-sub">${title(m)}</p>

      <h3>1. Transaction overview</h3>
      <table>
        <tr><th>Target</th><td>${esc(m.target)}</td></tr>
        <tr><th>Acquirer</th><td>${esc(m.acquirer)}</td></tr>
        <tr><th>Industry</th><td>${m.industry ? esc(m.industry) : tbc()}</td></tr>
        <tr><th>Deal size</th><td>${size}</td></tr>
        <tr><th>Structure</th><td>${m.structureLabel ? esc(m.structureLabel) : tbc()}</td></tr>
        <tr><th>Timeline</th><td>${m.timeline ? m.timeline[0] : tbc()}</td></tr>
      </table>

      <h3>2. Strategic rationale</h3>
      <p>${m.rationale ? esc(m.rationale) : tbc('why the buyer wants the target, and the synergies expected')}</p>

      <h3>3. Valuation</h3>
      <p>${Number.isFinite(m.size)
        ? `Proposed consideration of ${symbol()}${full(m.size)}. Implied multiples to be tested against the target's audited revenue and EBITDA, and against recent transactions in the sector.`
        : tbc('the proposed consideration')}</p>

      <h3>4. Key terms and conditions</h3>
      <p>${m.terms ? esc(m.terms) : tbc('pricing mechanism, conditions, protections')}</p>

      <h3>5. Key risks</h3>
      <p>${m.risks ? `${esc(m.risks)}\nEach to be tested in due diligence.` : tbc('the main risks to test in due diligence')}</p>

      <h3>6. Indicative process</h3>
      <table class="eb-memo-steps">
        <tr><th>Phase</th><th>Step</th><th>When</th></tr>
        ${phases(m)}
      </table>

      <p class="eb-memo-foot">Prepared with El-Business for discussion only. Not an offer or commitment. Figures are as entered and have not been verified. Confidential.</p>
    </article>`;
}

/** The memo as plain text, for the clipboard. */
function plain(m) {
  if (!m.ok) return '';
  const or = (s) => s || TBC;
  return [
    `INVESTMENT MEMORANDUM — ${m.date}${m.author ? ` — Prepared by ${m.author}` : ''}`,
    title(m).replace(/&amp;/g, '&'),
    '',
    '1. Transaction overview',
    `Target: ${m.target}`,
    `Acquirer: ${m.acquirer}`,
    `Industry: ${or(m.industry)}`,
    `Deal size: ${Number.isFinite(m.size) ? `${symbol()}${full(m.size)}` : TBC}`,
    `Structure: ${or(m.structureLabel)}`,
    `Timeline: ${or(m.timeline?.[0])}`,
    '',
    '2. Strategic rationale', or(m.rationale), '',
    '3. Valuation', Number.isFinite(m.size) ? `Proposed consideration of ${symbol()}${full(m.size)}.` : TBC, '',
    '4. Key terms and conditions', or(m.terms), '',
    '5. Key risks', or(m.risks), '',
    'Prepared with El-Business for discussion only. Not an offer or commitment. Confidential.',
  ].join('\n');
}

const form = document.querySelector('form[data-tool="deal-memo"]');
const out = document.querySelector('[data-result]');
if (form && out) {
  let last = { ok: false };
  const bar = mobileBar(document.querySelector('[data-mobile-bar]'), document.querySelector('[data-results]'));
  const api = tool({
    form,
    example: {
      target: 'Pinnacle Systems Ltd', acquirer: 'Meridian Holdings PLC', author: '', industry: 'technology', size: '50m',
      structure: 'share', timeline: '3-6',
      rationale: 'Adds a recurring-revenue software platform to Meridian\'s services business, with cross-selling into its 400 enterprise clients.',
      terms: 'Locked-box mechanism. 20% of consideration as a two-year earn-out. Founder non-competes. W&I insurance.',
      risks: 'Top three clients are 38% of revenue. Founder dependency in product. Integration of two finance systems.',
    },
    compute: (v) => {
      last = draft(v);
      render(last, out);
      document.querySelectorAll('[data-needs-result]').forEach((b) => (b.disabled = !last.ok));
      bar(last.ok ? `<span>Deal memo</span><b>${esc(last.target)}</b><span aria-hidden="true">View ↓</span>` : '');
    },
  });
  document.querySelector('[data-copy]')?.addEventListener('click', (e) => copy(plain(last), e.currentTarget));
  document.querySelector('[data-share]')?.addEventListener('click', (e) => copy(api.link(), e.currentTarget));
  document.querySelector('[data-print]')?.addEventListener('click', printResult);
}
