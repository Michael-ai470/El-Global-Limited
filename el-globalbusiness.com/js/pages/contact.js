// js/pages/contact.js
// Enquire page. js/site.js runs what every inner page shares (smooth scroll, the hero layer's
// settle and drift, section heading reveals). This module loads BEFORE site.js: site.js's
// scope is all of <main>, which opens the motion gate, so the hero's gated text must already
// have its start state by then.
//
// Top to bottom:
//   Hero          the heading types itself out with a caret; a gold stroke underlines
//                 "Conversation" (type-hero)
//   The form      honest sending: a real POST, a sent panel or a plain failure with a
//                 ready-written email; inline errors; division cards; copy buttons
//                 (enquiry-form; not motion). The form and the details rise in.
//   Offices       a gold block wipes each picture in (block-wipe); each office shows its
//                 local time (clocks; not motion)
import { createMotion } from '../motion/core.js?v=c81884f095';
import { typeHero } from '../recipes/type-hero.js?v=b0b4d5801f';
import { enquiryForm } from '../recipes/enquiry-form.js?v=232d18e659';
import { blockWipe } from '../recipes/block-wipe.js?v=50b7324ace';
import { clocks } from '../recipes/clocks.js?v=81b54816b0';
import { batchReveal } from '../recipes/text.js?v=44c82cd1c2';
import { overlayNav, preloaderLifted } from '../chrome.js?v=52793ad2ba';

const $ = (sel) => document.querySelector(sel);

// Navbar: transparent over the full-screen hero, the glass bar once past it (as on the
// homepage).
const hero = $('.contact-hero');
overlayNav(hero);

createMotion(hero, (env) => typeHero(hero, env, { ready: preloaderLifted() }));

const contact = $('.contact-section');
if (contact) enquiryForm(contact);
createMotion(contact, () => batchReveal(contact));

const offices = $('.offices-section');
if (offices) clocks(offices);
createMotion(offices, (env) => blockWipe(offices, env));
