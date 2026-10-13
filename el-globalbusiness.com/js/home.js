// js/home.js
// Homepage motion. Loaded as a module after the deferred scripts in js/vendor/.
// A multi-page site, so nothing needs tearing down: the next page load clears everything.
//
// Top to bottom:
//   Hero              jet scroll sequence (recipe 6.9)
//   After the hero    subtitle words gather, stats roll
//   Who We Are        five divisions peel away (fold-stack)
//   Mission           words light up as you read
//   Our Divisions     the five pillars on a side rail
//   Why El-Global     the heading parts around a picture, then the five reasons index
//   Our Values        the four principles as a pinned dot-field pipeline
//   Where We Operate  opens through a cabin window, city cards open in turn
//   Partners          the route map draws itself
import { createMotion } from './motion/core.js?v=c81884f095';
import { startSmoothScroll } from './motion/smooth-scroll.js?v=ec39c1450d';
import { scrollSequence } from './recipes/scroll-sequence.js?v=5d9698b6c2';
import { foldStack } from './recipes/fold-stack.js?v=740a0d0d76';
import { sideRail } from './recipes/side-rail.js?v=06da116d88';
import { textReveal, batchReveal, wordLight, wordGather, rollNumbers } from './recipes/text.js?v=d3a73b24c3';
import { partOpen } from './recipes/part-open.js?v=78aec58d0e';
import { indexList, indexFigures } from './recipes/index-list.js?v=0a58c7de72';
import { dotPipe } from './recipes/dot-pipe.js?v=fba9c1d5b3';
import { windowPortal } from './recipes/window-portal.js?v=c0b5f437d5';
import { cardReveal } from './recipes/card-reveal.js?v=23f1019318';
import { routeMap } from './recipes/route-map.js?v=70e320f0de';
import { overlayNav, preloaderLifted } from './chrome.js?v=52793ad2ba';

// Anchor links scroll through Lenis, clearing the fixed navbar (64px once scrolled, plus 20).
// main.js leaves anchors alone while Lenis is running.
startSmoothScroll({ anchors: { offset: -84 } });

const frame = (dir) => (i) => `img/hero/${dir}/jet_${String(i).padStart(4, '0')}.webp`;
const $ = (sel) => document.querySelector(sel);
const hero = $('[data-seq]');

// Navbar: transparent over the hero, the glass bar once it has scrolled past.
overlayNav(hero);

createMotion(hero, (env) =>
  scrollSequence(hero, env, {
    src: frame('desktop'),
    count: 120,
    small: { src: frame('phone'), count: 61 },
    focus: [0.43, 0.5], // keep the door in view on narrow screens at the start, centre by the end
    ready: preloaderLifted(),
  }),
);

// The text and block reveals, anywhere on the page below the hero.
const main = $('#main');
createMotion(main, (env) => {
  textReveal(main, env);
  batchReveal(main);
  wordLight(main, env);
  wordGather(main, env);
  rollNumbers(main, env);
});

// Who We Are: the five divisions peel away one after another while the section is pinned.
const fold = $('[data-fold]');
createMotion(fold, (env) => foldStack(fold, env));

// Our Divisions: the five pillars slide in sideways while the section is pinned.
const rail = $('[data-rail]');
createMotion(rail, (env) => sideRail(rail, env));

// Why El-Global: "What Sets Us Apart" parts around a picture, then the index.
const part = $('[data-part]');
createMotion(part, (env) => partOpen(part, env));
const index = $('[data-index]');
createMotion(index, (env) => indexList(index, env), { when: '(min-width: 900px)' });
createMotion(index, () => indexFigures(index), { when: '(max-width: 899px)' });

// Our Values: the pinned pipeline with the dot field.
const pipe = $('[data-pipe]');
createMotion(pipe, (env) => dotPipe(pipe, env));

// Where We Operate: through the cabin window, then the city cards.
const portal = $('[data-portal]');
createMotion(portal, (env) => windowPortal(portal, env));
const presence = $('.presence-section');
createMotion(presence, () => cardReveal(presence));

// Partners: the route map.
const map = $('[data-map]');
createMotion(map, (env) => routeMap(map, env));
