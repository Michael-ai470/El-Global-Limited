// js/site.js
// Motion for every page except the homepage (which has js/home.js).
// Loaded as a module after the deferred scripts in js/vendor/. Keeps to what every
// inner page shares, so one file serves all of them:
//   - smooth scrolling (Lenis), with anchor links clearing the fixed navbar
//   - the page hero's background settles and drifts as you scroll away from it
//   - section headings rise line by line the first time they are seen
//   - quotes and statements marked [data-word-light] light up word by word
// The older reveal classes (.reveal and friends, driven by main.js) stay as they are.
import { createMotion, gsap, MOTION } from './motion/core.js?v=c81884f095';
import { startSmoothScroll } from './motion/smooth-scroll.js?v=ec39c1450d';
import { textReveal, wordLight, rollNumbers } from './recipes/text.js?v=d3a73b24c3';

startSmoothScroll({ anchors: { offset: -84 } });

const main = document.querySelector('main') || document.body;

// Page hero: the section whose class ends in "-hero", and its "-hero-bg" layer.
const hero = main.querySelector('section[class$="-hero"], section[class*="-hero "]');
const heroBg = hero?.querySelector('[class$="-hero-bg"], [class*="-hero-bg "]');
// The scope is the background layer, not the whole hero, so a page module that runs the
// hero's copy (js/pages/*.js) keeps its gated text hidden until it has set it up.
createMotion(heroBg, () => {
  // Load: the picture eases back from a slight zoom. Scroll: it drifts down and the
  // copy lifts away a little, so the hero reads as a layer the page slides over.
  gsap.from(heroBg, { scale: 1.12, duration: MOTION.duration.hero, ease: MOTION.ease.reveal, lazy: false });
  gsap.fromTo(
    heroBg,
    { yPercent: 0 },
    {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
    },
  );
});

// Section headings below the hero. Headings inside forms, cards and the footer are
// left alone; only the big section titles get the line reveal.
createMotion(main, (env) => {
  main.querySelectorAll('section h2').forEach((h2) => {
    if (hero && hero.contains(h2)) return;
    if (h2.closest('form, footer, .card, [class*="card"], .modal')) return;
    h2.setAttribute('data-reveal-text', '');
  });
  textReveal(main, env);
  wordLight(main, env);
  rollNumbers(main, env);
});
