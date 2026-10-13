// js/pages/jet-el.js
// Jet-El page motion. js/site.js runs what every inner page shares (smooth scroll, the
// hero video's settle and drift, section heading reveals, [data-word-light] text). This
// module loads BEFORE site.js: site.js's scope is all of <main>, which opens the motion
// gate, so the hero's gated text must already have its start state by then.
//
// Top to bottom:
//   Hero          the copy arrives in order, then lifts away on scroll (hero-intro)
//   The Division  the picture opens out of a slit; the lead lights up as you read
//   Services      wide screens: the pinned deck, one card per scroll step (card-deck);
//                 phones: a swipe row (CSS only)
//   Advantage     the spotlight list (spot-list)
//   Process       the flight line with the jet (flight-path), across or down
// The deck is the page's one pinned section.
import { createMotion } from '../motion/core.js?v=c81884f095';
import { heroIntro } from '../recipes/hero-intro.js?v=202d3feb35';
import { imageOpen } from '../recipes/image-open.js?v=8981938817';
import { cardDeck } from '../recipes/card-deck.js?v=1b2764849e';
import { spotList } from '../recipes/spot-list.js?v=c2679e306f';
import { flightPath } from '../recipes/flight-path.js?v=52da247260';
import { overlayNav, preloaderLifted } from '../chrome.js?v=52793ad2ba';

const $ = (sel) => document.querySelector(sel);
const WIDE = '(min-width: 900px)';
const NARROW = '(max-width: 899px)';

// Navbar: transparent over the full-screen hero, the glass bar once it has scrolled past,
// exactly as on the homepage.
const hero = $('.jetel-hero');
overlayNav(hero);

// Hero: eyebrow, heading and subheading arrive in order; the copy lifts away on scroll.
createMotion(hero, (env) => heroIntro(hero, env, { ready: preloaderLifted() }));

// The Division: the picture opens as it scrolls in.
const intro = $('.jetel-intro');
createMotion(intro, () => imageOpen(intro));

// Services: the deck on wide screens only. Phones never pin (engine default).
const deck = $('[data-deck]');
createMotion(deck, (env) => cardDeck(deck, env), { when: WIDE });

// The Jet-El Advantage: the spotlight list, at every width.
const spot = $('[data-spot]');
createMotion(spot, (env) => spotList(spot, env));

// Our Process: the flight line across the steps, or down them on narrow screens.
const flight = $('[data-flight]');
createMotion(flight, (env) => flightPath(flight, env, { axis: 'x' }), { when: WIDE });
createMotion(flight, (env) => flightPath(flight, env, { axis: 'y' }), { when: NARROW });
