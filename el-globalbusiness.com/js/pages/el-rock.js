// js/pages/el-rock.js
// El&Rock page motion. js/site.js runs what every inner page shares (smooth scroll, the
// hero photo's settle and drift, section heading reveals). This module loads BEFORE site.js:
// site.js's scope is all of <main>, which opens the motion gate, so the hero's gated text
// must already have its start state by then.
//
// Top to bottom (none of it repeats Jet-El, H&L or The 1%), told as a deal:
//   Hero          the merger: the photo's two halves slide together on a gold seam,
//                 "Mergers &" and "Acquisitions" meet; a slim deal index along the
//                 bottom names the page's chapters (merge-hero)
//   Ticker        a quiet strip: the six services drift past slowly (ticker, engine 6.5)
//   The Division  the copy is declassified: redaction bars draw back line by line (redact)
//   Services      cards dealt onto the table, titles decoding; tilt under the cursor
//                 (deal-cards)
//   Process       wide screens: the steps stack like deal papers, with a progress meter;
//                 a "Closed" stamp lands on the last (stack). Phones: the steps rise.
//   Valuation     the tool works: an indicative range from the inputs, a scan and a
//                 count-up (valuation). The form itself runs without motion too.
//   Call to action  a chessboard sets itself behind "Your Next Move" (checker)
import { createMotion } from '../motion/core.js?v=c81884f095';
import { mergeHero } from '../recipes/merge-hero.js?v=b9f71df2f9';
import { ticker } from '../recipes/ticker.js?v=62cb3c3291';
import { redact } from '../recipes/redact.js?v=f8ff337b36';
import { dealCards, dealTilt } from '../recipes/deal-cards.js?v=8802b3ca13';
import { stack, stepsRise, closingStamp } from '../recipes/stack.js?v=6ff9502210';
import { valuationTool, valuationIntro } from '../recipes/valuation.js?v=be5d9b3a6d';
import { checker, checkerLight } from '../recipes/checker.js?v=6a66218600';
import { overlayNav, preloaderLifted } from '../chrome.js?v=52793ad2ba';

const $ = (sel) => document.querySelector(sel);

// Navbar: transparent over the full-screen hero, the glass bar once past it (as on the
// homepage).
const hero = $('.er-hero');
overlayNav(hero);

createMotion(hero, (env) => mergeHero(hero, env, { ready: preloaderLifted() }));

const band = $('[data-marquee]');
// Slow and quiet: a strip under the hero, not a second navbar.
createMotion(band, (env) => ticker(band, env, 26));

const intro = $('.er-intro');
createMotion(intro, (env) => redact(intro, env));

const services = $('.er-services');
createMotion(services, (env) => dealCards(services, env));
createMotion(services, (env) => dealTilt(services, env), { when: 'hover' });

// Wide screens stack the steps (CSS sticky, nothing pinned); narrower ones let them rise.
const process = $('.er-process');
createMotion(process, (env) => {
  stack(process, env);
  closingStamp(process);
}, { when: '(min-width: 1025px)' });
createMotion(process, () => {
  stepsRise(process);
  closingStamp(process);
}, { when: '(max-width: 1024px)' });

// The valuation form works for everyone; only its staging is motion.
const valuation = $('.er-valuation');
if (valuation) valuationTool(valuation);
createMotion(valuation, (env) => valuationIntro(valuation, env));

const cta = $('.er-cta');
createMotion(cta, (env) => checker(cta, env));
createMotion(cta, (env) => checkerLight(cta, env), { when: 'hover' });
