// js/pages/token-el.js
// Token-El page motion. js/site.js runs what every inner page shares (smooth scroll, the
// hero layer's settle and drift, section heading reveals, [data-roll] numbers). This module
// loads BEFORE site.js: site.js's scope is all of <main>, which opens the motion gate, so the
// hero's gated text must already have its start state by then.
//
// Top to bottom (none of it repeats the other division pages), told as tokens:
//   Hero          the asset mosaic: a full-screen photo cut into tiles that flip, wave by
//                 wave, through jet, yacht, villa and art; the asset row names them and,
//                 on hover screens, turns the mosaic to one; the heading's letters assemble
//                 in random order; on scroll the picture fractures (mosaic-hero)
//   Stats         the four figures roll in ([data-roll], site.js)
//   How a token   a gold coin turns through each asset's imprint and the fraction one
//                 token buys; the scroll turns it on wide screens, arrows/tap/swipe
//                 elsewhere (mint-coin; works without motion)
//   The Vision    own a fraction: a slider buys cells of a villa photo; tokens, share and
//                 yield update (fraction; works without motion)
//   Assets        two-faced tokens: they spin in edge-on and turn over to their terms on
//                 hover, click or Enter (coins; turning works without motion)
//   The chain     blocks mined in turn, hashes churning then locking; a light runs along
//                 the built chain (chain-mine)
//   Trust         each card's ledger line types itself out and ticks (ledger-type)
//   Register      a progress chain lights a node per completed field (form-chain; not motion)
import { createMotion } from '../motion/core.js?v=c81884f095';
import { mosaicHero } from '../recipes/mosaic-hero.js?v=74c1968ad8';
import { mintCoin, mintScrub, mintTilt, mintIntro } from '../recipes/mint-coin.js?v=936b573b44';
import { fraction, fractionMotion } from '../recipes/fraction.js?v=2e251c392c';
import { coinFlip, coinsMotion, coinsHover } from '../recipes/coins.js?v=92734a2027';
import { chainMine, chainPulse } from '../recipes/chain-mine.js?v=2086163887';
import { ledgerType } from '../recipes/ledger-type.js?v=471ec2376b';
import { formChain } from '../recipes/form-chain.js?v=1038031eb2';
import { batchReveal } from '../recipes/text.js?v=44c82cd1c2';
import { overlayNav, preloaderLifted } from '../chrome.js?v=52793ad2ba';

const $ = (sel) => document.querySelector(sel);

// Navbar: transparent over the full-screen hero, the glass bar once past it (as on the
// homepage).
const hero = $('.te-hero');
overlayNav(hero);

createMotion(hero, (env) => mosaicHero(hero, env, { ready: preloaderLifted() }));

// The coin works for everyone (arrows, tap, swipe); wide screens hand it to the scroll.
const mint = $('[data-mint]');
const coin = mint ? mintCoin(mint) : null;
createMotion(mint, () => mintIntro(mint));
createMotion(mint, (env) => mintScrub(coin, env), { when: '(min-width: 1025px)' });
createMotion(mint, (env) => mintTilt(mint, env), { when: 'hover' });

// The slider and the coins work for everyone; their motion is layered on top.
const vision = $('.te-intro');
const slider = vision ? fraction(vision) : null;
createMotion(vision, (env) => fractionMotion(slider, env));

const assets = $('.te-assets');
const flip = assets ? coinFlip(assets) : null;
createMotion(assets, (env) => coinsMotion(assets, flip, env));
createMotion(assets, (env) => coinsHover(flip, env), { when: 'hover' });

const chain = $('[data-chain]');
createMotion(chain, (env) => chainMine(chain, env));
// The light needs the chain on one row.
createMotion(chain, (env) => chainPulse(chain, env), { when: '(min-width: 900px)' });

const trust = $('.te-features');
createMotion(trust, (env) => {
  batchReveal(trust);
  ledgerType(trust, env);
});

const register = $('.te-register');
if (register) formChain(register);

