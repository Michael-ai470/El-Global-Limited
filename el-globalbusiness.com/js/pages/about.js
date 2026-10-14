// js/pages/about.js
// About page motion. js/site.js runs what every inner page shares (smooth scroll, the hero
// layer's settle and drift, section heading reveals). This module loads BEFORE site.js:
// site.js's scope is all of <main>, which opens the motion gate, so the hero's gated text
// must already have its start state by then.
//
// Top to bottom (none of it repeats the homepage or the division pages):
//   Hero          the camera flies through a giant "1%" cut out of black, the photo showing
//                 through the numerals; then the heading lands (mask-zoom)
//   Our Story     the photo stands up from lying flat; the "5" flips in (stand-up)
//   Activities    a rail of cards to grab and throw, leaning with the drag (drag-rail);
//                 phones swipe it natively
//   Ecosystem     the five divisions orbit the firm; pointing at one pauses the orbit and
//                 shows it in the centre (orbit)
//   Values        each name in big type slides in from alternating sides (type-slide)
//   Founder       the portrait develops like a darkroom print (develop)
//   Presence      each office shows its local time and whether it is open (clocks; not motion)
import { createMotion } from '../motion/core.js?v=c81884f095';
import { maskZoom } from '../recipes/mask-zoom.js?v=3b79c945aa';
import { standUp, flipCount } from '../recipes/stand-up.js?v=59bbb72da9';
import { dragRail } from '../recipes/drag-rail.js?v=ab638b13a0';
import { orbit } from '../recipes/orbit.js?v=789b000687';
import { typeSlide } from '../recipes/type-slide.js?v=7b8145f2b8';
import { develop } from '../recipes/develop.js?v=a1f78913e6';
import { clocks } from '../recipes/clocks.js?v=81b54816b0';
import { batchReveal } from '../recipes/text.js?v=44c82cd1c2';
import { overlayNav, preloaderLifted } from '../chrome.js?v=52793ad2ba';

const $ = (sel) => document.querySelector(sel);

// Navbar: transparent over the full-screen hero, the glass bar once past it (as on the
// homepage).
const hero = $('.about-hero');
overlayNav(hero);

createMotion(hero, (env) => maskZoom(hero, env, { ready: preloaderLifted() }));

const story = $('.story-section');
createMotion(story, (env) => {
  standUp(story);
  flipCount(story, env);
});

const activities = $('.activities-section');
createMotion(activities, (env) => dragRail(activities, env), { when: '(min-width: 769px)' });

// The orbit's layout is CSS from 1025px; the recipe checks it is on before it runs.
const eco = $('[data-orbit]');
createMotion(eco, (env) => orbit(eco, env), { when: '(min-width: 1025px)' });
createMotion(eco, () => batchReveal(eco), { when: '(max-width: 1024px)' });

const values = $('.values-deep');
createMotion(values, () => typeSlide(values));

const founder = $('.founder-section');
createMotion(founder, () => develop(founder));

const presence = $('.presence-compact');
if (presence) clocks(presence);
createMotion(presence, () => batchReveal(presence));
