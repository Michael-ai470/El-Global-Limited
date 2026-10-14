// js/pages/hl.js
// H&L page motion. js/site.js runs what every inner page shares (smooth scroll, the hero
// photo's settle and drift, section heading reveals). This module loads BEFORE site.js:
// site.js's scope is all of <main>, which opens the motion gate, so the hero's gated text
// must already have its start state by then.
//
// Top to bottom (none of it repeats the Jet-El page):
//   Hero          the photo opens from a postcard, words flip up, the line comes into
//                 focus; the copy parts in depth on scroll (hero-frame)
//   The Division  the photo opens like window shutters (shutters)
//   Services      wide screens: pinned diptych, a diagonal wipe with a gold rim (diptych);
//                 the page's one pinned section. Phones: two cards.
//   Markets       the destination board; a photo follows the cursor (market-board)
//   Advantage     the cards assemble from a scatter; a light follows the cursor (assemble)
//   Process       each step behind a door that swings open (doors)
//   Off-market    a keyhole onto the photo, steered by the cursor (keyhole); cards rise
import { createMotion, MOTION } from '../motion/core.js?v=c81884f095';
import { heroFrame } from '../recipes/hero-frame.js?v=5a5f797911';
import { shutters } from '../recipes/shutters.js?v=adda5a24de';
import { diptych } from '../recipes/diptych.js?v=7fa5b91397';
import { marketBoard, marketPeek } from '../recipes/market-board.js?v=960a3803a3';
import { assemble, spotlight } from '../recipes/assemble.js?v=5d03e30998';
import { doors } from '../recipes/doors.js?v=408e465a53';
import { keyhole, keyholeFollow } from '../recipes/keyhole.js?v=7cd6e9829e';
import { batchReveal } from '../recipes/text.js?v=44c82cd1c2';
import { overlayNav, preloaderLifted } from '../chrome.js?v=52793ad2ba';

const $ = (sel) => document.querySelector(sel);

// Navbar: transparent over the full-screen hero, the glass bar once past it (as on the
// homepage).
const hero = $('.hl-hero');
overlayNav(hero);

createMotion(hero, (env) => heroFrame(hero, env, { ready: preloaderLifted() }));

const intro = $('.hl-intro');
createMotion(intro, (env) => shutters(intro, env));

// Wide screens only: phones never pin (engine default).
const dip = $('[data-diptych]');
createMotion(dip, (env) => diptych(dip, env), { when: '(min-width: 900px)' });

const board = $('[data-board]');
createMotion(board, (env) => marketBoard(board, env));
createMotion(board, (env) => marketPeek(board, env), { when: 'hover' });

const why = $('[data-assemble]');
createMotion(why, () => assemble(why));
createMotion(why, (env) => spotlight(why, env), { when: 'hover' });

// Rebuilt when the grid changes between one, two and four columns, so the doors in a row
// keep opening one after another.
const steps = $('[data-doors]');
createMotion(steps, (env) => doors(steps, env), { when: '(min-width: 1025px)' });
createMotion(steps, (env) => doors(steps, env), { when: '(min-width: 769px) and (max-width: 1024px)' });
createMotion(steps, (env) => doors(steps, env), { when: '(max-width: 768px)' });

// Hover screens steer the keyhole; touch screens let it open all the way with the scroll.
const band = $('[data-keyhole]');
createMotion(band, (env) => {
  const steer = window.matchMedia(MOTION.query.hover).matches;
  keyhole(band, env, { full: !steer });
  if (steer) keyholeFollow(band, env);
});
const offmarket = $('.offmarket');
createMotion(offmarket, () => batchReveal(offmarket));
