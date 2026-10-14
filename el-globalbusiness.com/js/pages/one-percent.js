// js/pages/one-percent.js
// The 1% page motion. js/site.js runs what every inner page shares (smooth scroll, the
// hero photo's settle and drift, section heading reveals). This module loads BEFORE
// site.js: site.js's scope is all of <main>, which opens the motion gate, so the hero's
// gated copy must already have its start state by then.
//
// Top to bottom (none of it repeats Jet-El, H&L or the homepage):
//   Hero          "The 1%" drawn as the loader, gliding into the eyebrow; the heading by a
//                 gold-leaf sweep, the description written on line by line (mark-intro)
//   The Division  the photo comes out of frost; a gold highlighter marks a phrase (frost)
//   Services      expanding strips, following scroll, pointer and clicks (strips)
//   Advantage     one in a hundred: 99 dots dim, one glows gold (one-in-hundred)
//   Process       gold rings close round each step (rings)
//   CTA           the gold-leaf sweep on the heading; magnetic buttons (engine 6.6)
// Nothing on this page pins.
import { createMotion } from '../motion/core.js?v=c81884f095';
import { markIntro } from '../recipes/mark-intro.js?v=ecef8ecb4b';
import { unfrost, highlight } from '../recipes/frost.js?v=d47007351b';
import { strips } from '../recipes/strips.js?v=908f5a4e64';
import { oneInHundred } from '../recipes/one-in-hundred.js?v=a340971efe';
import { rings } from '../recipes/rings.js?v=29e5f5031d';
import { sweepOnEnter } from '../recipes/gold-sweep.js?v=d330d1b49f';
import { magnetic } from '../recipes/magnetic.js?v=e3e1f4c45b';
import { overlayNav } from '../chrome.js?v=52793ad2ba';

const $ = (sel) => document.querySelector(sel);

// Navbar: transparent over the full-screen hero, the glass bar once past it (as on the
// homepage).
const hero = $('.op-hero');
overlayNav(hero);
createMotion(hero, (env) => markIntro(hero, env));

const intro = $('.op-intro');
createMotion(intro, () => {
  unfrost(intro);
  highlight(intro);
});

const row = $('[data-strips]');
createMotion(row, (env) => strips(row, env), { when: '(min-width: 900px)' });

const why = $('.why-op');
createMotion(why, (env) => oneInHundred(why, env));

// Rebuilt when the grid changes between one, two and four columns, so the rings in a row
// keep closing one after another.
const steps = $('[data-rings]');
createMotion(steps, (env) => rings(steps, env), { when: '(min-width: 1025px)' });
createMotion(steps, (env) => rings(steps, env), { when: '(min-width: 769px) and (max-width: 1024px)' });
createMotion(steps, (env) => rings(steps, env), { when: '(max-width: 768px)' });

const cta = $('.op-cta');
createMotion(cta, () => sweepOnEnter(cta));
// A gentle pull: the two buttons sit side by side, so neither may lean into the other.
createMotion(cta, (env) => magnetic(cta, env, 0.18), { when: 'hover' });
