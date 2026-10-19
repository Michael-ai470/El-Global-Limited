// js/recipes/type-line.js
// An opening line that types itself out, letter by letter, with a caret leading it (the
// Enquire hero's typing, recipe type-hero, made reusable for a line that is not a heading
// with an underline). Parts before it fade up first; parts after it follow once the caret
// has blinked and gone. Load only: whatever moves the block on scroll is someone else's job.
//
// Markup hooks: [data-type-line] the line (gated); [data-type-before] and [data-type-after]
// parts that fade up before and after it (gated). Every gated part sits inside the scope.

import { gsap, MOTION, getSplitText } from '../motion/core.js?v=c81884f095';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @param {Element} scope
 * @param {import('../motion/core.js').MotionEnv} env
 * @param {{ ready?: Promise<unknown>, caretClass?: string }} [options]  ready: wait for it
 *   (the preloader lifting) and the fonts, never more than 3 seconds.
 */
export function typeLine(scope, env, options = {}) {
  const line = scope.querySelector('[data-type-line]');
  if (!line || !env.intro) return;
  const before = Array.from(scope.querySelectorAll('[data-type-before]'));
  const after = Array.from(scope.querySelectorAll('[data-type-after]'));
  const all = [...before, line, ...after];
  gsap.set(all, { autoAlpha: 0, lazy: false });

  let alive = true;
  let timeline = null;
  let split = null;
  const caret = document.createElement('span');
  caret.className = options.caretClass || 'type-caret';
  caret.setAttribute('aria-hidden', 'true');
  env.onCleanup(() => {
    alive = false;
    timeline?.revert();
    caret.remove();
    split?.revert();
  });

  const settled = Promise.all([document.fonts?.ready, options.ready]).catch(() => {});
  Promise.race([settled, wait(3000)]).then(() => {
    if (!alive) return;
    const SplitText = getSplitText();
    if (!SplitText) return gsap.set(all, { autoAlpha: 1 });
    timeline = gsap.timeline({
      defaults: { ease: MOTION.ease.reveal },
      onComplete: () => {
        caret.remove();
        split?.revert(); // plain text again, so it reflows on resize
        split = null;
      },
    });
    let at = 0.1;
    for (const part of before) {
      timeline.fromTo(part, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: MOTION.duration.base }, at);
      at += 0.12;
    }
    split = SplitText.create(line, { type: 'chars,words' });
    const chars = /** @type {HTMLElement[]} */ (split.chars);
    gsap.set(chars, { autoAlpha: 0 });
    chars[0]?.before(caret);
    const place = (i) => chars[i]?.after(caret);
    at += 0.25;
    timeline.set(line, { autoAlpha: 1 }, at);
    // A human pace: a little slower after a space, like a thought between words.
    chars.forEach((ch, i) => {
      timeline.set(ch, { autoAlpha: 1 }, at).call(place, [i], at);
      const next = chars[i + 1];
      at += 0.05 + Math.random() * 0.03 + (next && ch.parentElement !== next.parentElement ? 0.12 : 0);
    });
    at += 0.6; // two blinks of the caret
    timeline.to(caret, { autoAlpha: 0, duration: 0.2 }, at);
    at += 0.15;
    for (const part of after) {
      timeline.fromTo(part, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: MOTION.duration.base }, at);
      at += 0.14;
    }
  });
}
