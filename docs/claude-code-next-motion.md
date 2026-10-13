# Prompt for Claude Code: finish the motion on the inner pages

Paste everything below the line into Claude Code, opened on `C:\My Web Sites\El-Global Limited`.

---

We are finishing the web motion on the El-Global site before any colour or styling work. Read `docs/web-motion-engine.md` and `docs/motion-map.md` first, and follow both. The homepage is done; do not change its sections unless a step below says so.

Ground rules:
- Reuse the recipes already in `el-globalbusiness.com/js/recipes/` (`text.js`, `part-open.js`, `index-list.js`, `dot-pipe.js`, `window-portal.js`, `card-reveal.js`, `route-map.js`, `side-rail.js`, `fold-stack.js`). Write a new recipe only when none fits, in the same shape.
- Every page loads `js/site.js`. For page-specific motion, add a small module per page (for example `js/pages/jet-el.js`) and load it before `site.js` (see `docs/motion-map.md`, "Page modules"). Do not grow `site.js` with page-specific code.
- One signature moment per page at most, plus quiet reveals. No more than one pinned section per inner page.
- No CSS colour or font changes in this pass.
- Do not touch `img/hero/` or the homepage hero.

Work through these in order, one commit per step:

1. **Jet-El (`jet-el/index.html`).** "What Jet-El Offers" becomes the index from the homepage (`index-list.js`): the service list on one side, a picture that wipes to each service on the other. Phones get each row's own picture. "Our Process" becomes a quiet line that draws down the left of the steps as you scroll (a scrubbed `scaleY` on one element), with each step lighting up as the line reaches it.

2. **H&L (`hl/index.html`, `hl/hotels.html`, `hl/real-estate.html`).** On `hl/index.html`, the "What H&L Offers" heading parts around a picture with `part-open.js`. On the two sub-pages, the feature cards open with `card-reveal.js` (add `data-city` and make sure the card has `.city-card-bg` and `.city-card-content` layers, or generalise the recipe's two selectors through options).

3. **The 1% (`one-percent/*.html`).** On `yacht-marina-deals.html`, the deal cards open with `card-reveal.js`. On `cbi.html`, the three pathways roll their headline numbers with `data-roll` (give those numbers a flat colour, as the recipe notes say).

4. **El&Rock (`el-rock/index.html`).** The process steps become a pinned pipeline with `dot-pipe.js`. Add four glyphs to its `GLYPHS` table for the steps (sell-side, buy-side, due diligence, structuring), drawn on the same 24-unit grid as the others.

5. **Token-El (`token-el/index.html`).** "What You Can Tokenize" becomes a pipeline with `dot-pipe.js`, with glyphs for a jet, a yacht, a building and a framed picture.

6. **About (`about.html`).** The founder portrait opens with the clip reveal used for the phone pictures in `index-list.js` (`indexFigures`), and "Five Divisions, One Vision" gets `data-word-light` on its intro line.

7. **Clean up the old motion in `js/main.js`.** Remove the custom cursor, the card tilt, the scroll parallax and the magnetic buttons. They run on every page outside the motion core and ignore reduced motion. Replace the magnetic buttons with recipe 6.6 from the engine, run with `{ when: 'hover' }`, on `.nav-cta` and the primary buttons. Keep the toasts, form validation, mobile nav and the `.reveal` observer.

8. **Page transitions (engine 6.8), adapted for a multi-page site.** A cover wipes up when an internal link is clicked, the browser navigates, and the next page starts covered and wipes away once `site.js` runs. Skip it for anchors, new tabs, modifier-clicks and downloads. Lift the preloader from `components.js` on pages reached through the transition so the two never stack. Under reduced motion, navigate straight away.

After each step, run the checks in section 7 of the engine at 1440 x 900 and 390 x 844 with touch, scripts off, and reduced motion on. Also check that the console is clean on a full scroll down and back up, and that there is no sideways scroll on the phone size. Report what you changed, which files you touched, and anything you could not verify.
