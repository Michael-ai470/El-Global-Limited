// js/pages/el-business.js
// El-Business landing motion: deliberately light, because the division is its tools.
// js/site.js runs what every inner page shares (smooth scroll, the hero grid's settle and
// drift, section heading reveals). This module loads BEFORE site.js: site.js's scope is
// all of <main>, which opens the motion gate, so the hero's gated text must already have
// its start state by then.
//
//   Hero   the copy rises line by line, the result still fades in beside it, and the
//          whole block lifts away on scroll (heroIntro, as on Jet-El)
// The tool pages themselves (valuation, deal memo, red flag) have no motion at all.
import { createMotion } from '../motion/core.js?v=c81884f095';
import { heroIntro } from '../recipes/hero-intro.js?v=202d3feb35';
import { overlayNav, preloaderLifted } from '../chrome.js?v=52793ad2ba';

const hero = document.querySelector('.eb-hero');

// Navbar: transparent over the full-screen hero, the glass bar once past it.
overlayNav(hero);

createMotion(hero, (env) => heroIntro(hero, env, { ready: preloaderLifted() }));
