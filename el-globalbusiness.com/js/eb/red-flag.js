// js/eb/red-flag.js
// The El-Business red flag check. Results update as the visitor types (js/eb/tool.js).
//
// Every check runs only on what was entered: a blank field is "not provided", never zero,
// so a missing figure can't raise or clear a flag. The score counts only the areas that
// could be checked, and the coverage line says how many that was.
import { tool, money, copy, printResult, mobileBar, esc, parseNumber } from './tool.js?v=105886350e';

const has = (n) => Number.isFinite(n);
const pct = (v, d = 1) => `${v.toFixed(d)}%`;
const LEVELS = { high: 3, medium: 2, low: 1 };
const LABEL = { high: 'High', medium: 'Medium', low: 'Low', none: 'Not checked' };

/** The five areas, each a list of checks: [needs, run(d) -> { level, text }]. */
const AREAS = [
  {
    key: 'financial', title: 'Profitability and growth',
    checks: [
      [['revenue', 'ebitda'], (d) => {
        if (d.revenue <= 0) return { level: 'high', text: 'Revenue is zero or negative.' };
        const m = (d.ebitda / d.revenue) * 100;
        if (m < 5) return { level: 'high', text: `EBITDA margin of ${pct(m)} is very thin: test the cost base and how earnings are recognised.` };
        if (m < 10) return { level: 'medium', text: `EBITDA margin of ${pct(m)} is below most sector norms: review the cost structure.` };
        return { level: 'low', text: `EBITDA margin of ${pct(m)} is within a healthy range.` };
      }],
      [['growth'], (d) => {
        if (d.growth < -5) return { level: 'high', text: `Revenue fell ${pct(-d.growth)} year on year: find out why before pricing the deal.` };
        if (d.growth < 0) return { level: 'medium', text: `Revenue slipped ${pct(-d.growth)} year on year.` };
        if (d.growth > 40) return { level: 'medium', text: `Growth of ${pct(d.growth)} is unusually fast: separate organic growth from acquisitions and one-offs.` };
        return { level: 'low', text: `Growth of ${pct(d.growth)} raises no concern on its own.` };
      }],
    ],
  },
  {
    key: 'revenue', title: 'Revenue quality',
    checks: [
      [['topCustomer'], (d) => {
        if (d.topCustomer > 40) return { level: 'high', text: `The largest customer is ${pct(d.topCustomer, 0)} of revenue: a heavy dependency. Read that contract closely.` };
        if (d.topCustomer > 20) return { level: 'medium', text: `The largest customer is ${pct(d.topCustomer, 0)} of revenue: check term, notice and change-of-control clauses.` };
        return { level: 'low', text: `The largest customer is ${pct(d.topCustomer, 0)} of revenue: reasonably spread.` };
      }],
      [['revenue', 'employees'], (d) => {
        if (d.employees <= 0) return null;
        const per = d.revenue / d.employees;
        if (per < 50000) return { level: 'medium', text: `Revenue per employee of ${money(per)} is low: check utilisation and headcount plans.` };
        return { level: 'low', text: `Revenue per employee of ${money(per)}.` };
      }],
    ],
  },
  {
    key: 'wc', title: 'Working capital',
    checks: [
      [['revenue', 'receivables'], (d) => {
        if (d.revenue <= 0) return null;
        const dso = (d.receivables / d.revenue) * 365;
        if (dso > 90) return { level: 'high', text: `Customers take about ${Math.round(dso)} days to pay: ask for the ageing schedule and test revenue recognition.` };
        if (dso > 60) return { level: 'medium', text: `Customers take about ${Math.round(dso)} days to pay: review the ageing schedule.` };
        return { level: 'low', text: `Customers pay in about ${Math.round(dso)} days.` };
      }],
      [['revenue', 'payables'], (d) => {
        if (d.revenue <= 0) return null;
        const dpo = (d.payables / d.revenue) * 365;
        if (dpo > 90) return { level: 'medium', text: `Suppliers wait about ${Math.round(dpo)} days for payment (on revenue): a sign of cash pressure.` };
        return { level: 'low', text: `Suppliers are paid in about ${Math.round(dpo)} days (on revenue).` };
      }],
    ],
  },
  {
    key: 'debt', title: 'Debt',
    checks: [
      [['debt', 'ebitda'], (d) => {
        if (d.debt <= 0) return { level: 'low', text: 'No debt reported.' };
        if (d.ebitda <= 0) return { level: 'high', text: `${money(d.debt)} of debt with no positive EBITDA to service it.` };
        const x = d.debt / d.ebitda;
        if (x > 4) return { level: 'high', text: `Debt is ${x.toFixed(1)}× EBITDA: highly leveraged. Review covenants and refinancing dates.` };
        if (x > 2.5) return { level: 'medium', text: `Debt is ${x.toFixed(1)}× EBITDA: check covenant headroom.` };
        return { level: 'low', text: `Debt is ${x.toFixed(1)}× EBITDA: conservative.` };
      }],
    ],
  },
  {
    key: 'team', title: 'Team and key people',
    checks: [
      [['employees'], (d) => {
        if (d.employees < 10) return { level: 'high', text: `A team of ${d.employees} means heavy reliance on a few people: plan retention and handover.` };
        if (d.employees < 30) return { level: 'medium', text: `A team of ${d.employees}: assess management depth and succession.` };
        return { level: 'low', text: `A team of ${d.employees} suggests reasonable depth.` };
      }],
    ],
  },
];
const TOTAL_CHECKS = AREAS.reduce((n, a) => n + a.checks.length, 0);
const FIELD_LABEL = { revenue: 'revenue', ebitda: 'EBITDA', growth: 'growth', topCustomer: 'largest customer share', employees: 'employees', receivables: 'receivables', payables: 'payables', debt: 'total debt' };

/** Pure: the report from the inputs. */
export function assess(v) {
  const d = {
    revenue: v.revenue, ebitda: v.ebitda, debt: v.debt, receivables: v.receivables, payables: v.payables,
    growth: parseNumber(v.growth), topCustomer: parseNumber(v.topCustomer), employees: Math.round(parseNumber(v.employees)),
  };
  let run = 0;
  const areas = AREAS.map((a) => {
    const findings = [];
    const missing = new Set();
    for (const [needs, check] of a.checks) {
      const gaps = needs.filter((k) => !has(d[k]));
      if (gaps.length) {
        gaps.forEach((k) => missing.add(FIELD_LABEL[k]));
        continue;
      }
      const f = check(d);
      if (f) {
        findings.push(f);
        run++;
      }
    }
    const level = findings.reduce((top, f) => (LEVELS[f.level] > (LEVELS[top] || 0) ? f.level : top), 'none');
    return { ...a, findings, level, missing: [...missing] };
  });
  const checked = areas.filter((a) => a.level !== 'none');
  if (!checked.length) return { ok: false, areas };
  const count = (lv) => checked.filter((a) => a.level === lv).length;
  const high = count('high');
  const medium = count('medium');
  const low = count('low');
  // Each area starts at 100 and loses for its worst flag; the score is the average of the areas checked.
  const score = Math.round(checked.reduce((s, a) => s + ({ high: 25, medium: 62, low: 100 })[a.level], 0) / checked.length);
  return { ok: true, company: (v.company || '').trim(), areas, high, medium, low, score, run, coverage: run / TOTAL_CHECKS };
}

const verdict = (r) => (r.high ? 'Needs attention before going further' : r.medium ? 'Points to probe in due diligence' : 'No red flags in what was entered');

function render(r, out) {
  if (!r.ok) {
    out.innerHTML = `<div class="eb-needed"><h3>Your report appears here</h3>
      <p>Enter any figure and its check runs straight away. Blank fields are left out, not counted as zero. Start with these:</p>
      <ul><li>Annual revenue</li><li>EBITDA</li><li>Any other figure you have</li></ul></div>`;
    return;
  }
  out.innerHTML = `
    <div class="eb-headline">
      <small>${r.company ? `${esc(r.company)} · ` : ''}Red flag check</small>
      <strong>${verdict(r)}</strong>
      <p>${r.run} of ${TOTAL_CHECKS} checks run from the figures entered (${Math.round(r.coverage * 100)}% coverage)</p>
    </div>
    <div class="eb-score">
      <div><b class="is-high">${r.high}</b><span>High</span></div>
      <div><b class="is-medium">${r.medium}</b><span>Medium</span></div>
      <div><b class="is-low">${r.low}</b><span>Low</span></div>
      <div><b>${r.score}</b><span>Score / 100</span></div>
    </div>
    <div class="eb-section">
      ${r.areas.map((a) => `
        <div class="eb-risk">
          <div class="eb-risk-head"><h3>${a.title}</h3><span class="eb-sev ${a.level}">${LABEL[a.level]}</span></div>
          ${a.findings.length ? `<ul>${a.findings.map((f) => `<li class="is-${f.level}">${esc(f.text)}</li>`).join('')}</ul>` : ''}
          ${a.missing.length ? `<p class="eb-risk-missing">${a.findings.length ? 'More with' : 'Add'} ${a.missing.join(', ')} to check this.</p>` : ''}
        </div>`).join('')}
    </div>
    <p class="eb-disclaimer">A first screen from headline figures, not due diligence. The score covers only the areas checked. El&amp;Rock runs full financial, legal and commercial diligence.</p>`;
}

function plain(r) {
  if (!r.ok) return '';
  const lines = [`Red flag check${r.company ? ` — ${r.company}` : ''}`, `${verdict(r)}. Score ${r.score}/100 · ${r.high} high, ${r.medium} medium, ${r.low} low · ${r.run} of ${TOTAL_CHECKS} checks run`, ''];
  for (const a of r.areas) {
    lines.push(`${a.title}: ${LABEL[a.level]}`);
    a.findings.forEach((f) => lines.push(`  - [${LABEL[f.level]}] ${f.text}`));
  }
  lines.push('', 'A first screen from headline figures, not due diligence (El-Business).');
  return lines.join('\n');
}

const form = document.querySelector('form[data-tool="red-flag"]');
const out = document.querySelector('[data-result]');
if (form && out) {
  let last = { ok: false };
  const bar = mobileBar(document.querySelector('[data-mobile-bar]'), document.querySelector('[data-results]'));
  const api = tool({
    form,
    example: { company: 'Target Holdings Ltd', revenue: '15m', ebitda: '1.2m', growth: '12', debt: '5.5m', receivables: '3.4m', payables: '1.8m', topCustomer: '35', employees: '120' },
    compute: (v) => {
      last = assess(v);
      render(last, out);
      document.querySelectorAll('[data-needs-result]').forEach((b) => (b.disabled = !last.ok));
      bar(last.ok ? `<span>Red flags</span><b>${last.high} high · ${last.medium} medium</b><span aria-hidden="true">View ↓</span>` : '');
    },
  });
  document.querySelector('[data-copy]')?.addEventListener('click', (e) => copy(plain(last), e.currentTarget));
  document.querySelector('[data-share]')?.addEventListener('click', (e) => copy(api.link(), e.currentTarget));
  document.querySelector('[data-print]')?.addEventListener('click', printResult);
}
