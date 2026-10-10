// js/home.js
// Homepage motion: smooth scroll and the jet hero (recipe 6.9).
// Loaded as a module after the deferred scripts in js/vendor/. A multi-page site,
// so nothing needs tearing down: the next page load clears everything.
import { createMotion } from './motion/core.js';
import { startSmoothScroll } from './motion/smooth-scroll.js';
import { scrollSequence } from './recipes/scroll-sequence.js';

// Anchor links scroll through Lenis, clearing the fixed navbar (64px once scrolled, plus 20).
// main.js leaves anchors alone while Lenis is running.
startSmoothScroll({ anchors: { offset: -84 } });

// The preloader from components.js covers the page until main.js lifts it after load.
// Resolves when it starts to fade, or at once if there is none.
const preloaderLifted = () =>
  new Promise((resolve) => {
    const preloader = document.getElementById('preloader');
    if (!preloader || preloader.classList.contains('loaded')) return resolve();
    const observer = new MutationObserver(() => {
      if (!preloader.classList.contains('loaded')) return;
      observer.disconnect();
      resolve();
    });
    observer.observe(preloader, { attributes: true, attributeFilter: ['class'] });
  });

const frame = (dir) => (i) => `img/hero/${dir}/jet_${String(i).padStart(4, '0')}.webp`;
const hero = document.querySelector('[data-seq]');

createMotion(hero, (env) =>
  scrollSequence(hero, env, {
    src: frame('desktop'),
    count: 120,
    small: { src: frame('phone'), count: 61 },
    focus: [0.43, 0.5], // keep the door in view on narrow screens at the start, centre by the end
    ready: preloaderLifted(),
  }),
);
