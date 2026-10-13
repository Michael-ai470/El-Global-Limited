# El-Global motion map

What moves on the site, what drives it, and where the code lives. Every recipe follows
docs/web-motion-engine.md: it runs inside `createMotion`, does nothing under reduced
motion, and leaves the content readable with scripts off.

Last updated 12 October 2026.

## Homepage (`index.html`, wired in `js/home.js`)

| Section | What happens | Driven by | Recipe | Styles |
|---|---|---|---|---|
| Hero | Jet scroll sequence: apron, stairs, cabin, windows; "Welcome to the 1%" arrives at the end | Scrub, sticky | `js/recipes/scroll-sequence.js` (engine 6.9) | inline in `index.html`, `css/nav-overlay.css` |
| After the hero | Subtitle words start spread out and close up; stats roll into place like a counter | Scrub (words), once (numbers) | `wordGather`, `rollNumbers` in `js/recipes/text.js` | `css/motion-text.css` |
| Who We Are | The five division images peel off one after another (WebGL page curl) | Scrub, sticky | `js/recipes/fold-stack.js` | `css/fold-stack.css` |
| Mission | The quote's words light up as you read down | Scrub | `wordLight` in `text.js` | inline |
| Activities | The three blocks rise in turn | Once | `batchReveal` in `text.js` | inline |
| Our Divisions | Five panels slide in sideways | Scrub, sticky | `js/recipes/side-rail.js` | `css/side-rail.css` |
| Why El-Global, opener | "What Sets Us / Apart" parts while a picture opens between the words; the lead arrives over it | Scrub, sticky | `js/recipes/part-open.js` | `css/why.css` |
| Why El-Global, index | Five reasons; wide screens keep a picture beside the list that wipes to the reason crossing the middle of the screen; phones open each row's own picture | Scroll position, sticky frame | `js/recipes/index-list.js` | `css/why.css` |
| Our Values | Pinned pipeline: the active principle opens in the list while a field of dots redraws itself as that principle's symbol (diamond, lock, pillars, bulb) | Scrub, sticky | `js/recipes/dot-pipe.js` | `css/values.css` |
| Where We Operate | The section opens through a cabin window that widens to the full screen, then the heading rises | Scrub, sticky | `js/recipes/window-portal.js` | `css/presence.css` |
| City cards | Pictures open from the bottom edge in turn, text follows | Once | `js/recipes/card-reveal.js` | `css/presence.css` |
| Our Global Partners | Dotted world map: dots sweep in, offices light up, routes draw to each partner city, pins land; then lights travel the routes while it is on screen | Once, then a loop while visible | `js/recipes/route-map.js` | `css/presence.css`, dots in `img/world-dots.svg` |
| Headings marked `data-reveal-text` | Lines rise out of a mask | Once | `textReveal` in `text.js` | none |

Sticky sections (in order): hero, Who We Are, Our Divisions, Why opener, Our Values, Where We Operate.
Do not add another pinned section next to these without taking one away.

## Inner pages (all 22, wired in `js/site.js`)

- Smooth scrolling (Lenis) with anchor links clearing the navbar.
- The page hero's `*-hero-bg` layer eases back from a slight zoom on load and drifts as you scroll away.
- Every section `h2` (outside the hero, forms, cards and the footer) rises line by line the first time it is seen.
- Any element marked `data-word-light` lights up word by word; any number marked `data-roll` rolls in.
- The older `.reveal` classes driven by `js/main.js` still run as before.

### Page modules (`js/pages/*.js`)

A page module loads **before** `js/site.js` in that page's `<head>`. `site.js`'s scope is all of `<main>`, which opens the motion gate, so a page's gated hero text must have its start state first.

| Page | Section | What happens | Driven by | Recipe | Styles |
|---|---|---|---|---|---|
| Jet-El (`jet-el/index.html`, `js/pages/jet-el.js`) | Hero | Full-screen video (1080p, 3.5 MB, poster = its first frame) behind a transparent navbar (glass bar once past, as on the homepage). On load: eyebrow fades, "Private Aviation Portfolio" and the subheading rise line by line out of a mask, then the service pills. On scroll the copy lifts and fades | Load (after the preloader), then scrub | `js/recipes/hero-intro.js`; navbar `overlayNav` in `js/chrome.js` | inline in the page, `css/nav-overlay.css`; heading in the display role of `css/type.css` |
| Jet-El | The Division | The picture opens out of a narrow slit and settles from a slight zoom; the lead paragraph lights up word by word | Scrub | `js/recipes/image-open.js`; `data-word-light` (site.js) | `css/jetel.css` |
| Jet-El | What Jet-El Offers | **The page's one pinned section.** Six cards as a fanned deck; each scroll step opens the top card from a strip to full width with its text, then it flies off and the deck turns. Side index tracks and jumps; the hero pills jump to their card. Phones: native swipe row, no pin | Scrub, sticky (wide screens only) | `js/recipes/card-deck.js` | `css/jetel.css` |
| Jet-El | The Jet-El Advantage | Spotlight list: the statement crossing the middle is lit and opens, the others dim to their titles; click or Enter brings one to the middle. Classes only, CSS eases | Scroll position | `js/recipes/spot-list.js` | `css/jetel.css` |
| Jet-El | Our Process | A flight line draws across the steps (down them on narrow screens) with a jet on its tip; each step lights as the jet reaches it | Scrub | `js/recipes/flight-path.js` | `css/jetel.css` |
| H&L (`hl/index.html`, `js/pages/hl.js`) | Hero | Full screen, copy centred. On load the photo opens from a framed postcard to full bleed, the heading's words flip up in 3D, the subheading comes into focus line by line, the pills pop in. On scroll heading, subheading and pills drift apart in depth. Navbar as on the homepage | Load (after the preloader), then scrub | `js/recipes/hero-frame.js`; `overlayNav` in `js/chrome.js` | `css/hl.css`, `css/nav-overlay.css`; heading in the display role |
| H&L | The Division | The photo opens like window shutters: seven slats swing down in turn | Scrub | `js/recipes/shutters.js` | `css/hl.css` |
| H&L | What H&L Offers | **The page's one pinned section.** Full-screen diptych: Hotels, then a diagonal wipe with a gold rim brings Luxury Real Estate in (one CSS variable, `--wipe-top`, drives both edges). Counter 01 / 02; the hero pills jump to each half. Phones: two cards, no pin | Scrub, sticky (wide screens only) | `js/recipes/diptych.js` | `css/hl.css` |
| H&L | Where We Operate | Destination board: rows rise and draw their rule; on hover screens a photo of the market follows the cursor and leans as it moves; touch screens show a photo in each row | Once; pointer | `js/recipes/market-board.js` | `css/hl.css` |
| H&L | The H&L Advantage | The four cards come in scattered and settle into the grid; a gold light follows the cursor across them | Scrub; pointer | `js/recipes/assemble.js` | `css/hl.css` |
| H&L | Our Process | Each step sits behind a numbered door that swings open on its hinge; doors in a row open one after another | Scrub | `js/recipes/doors.js` | `css/hl.css` |
| H&L | Off-Market | A keyhole: the vivid photo opens in a circle over a darkened copy; hover screens steer it with the cursor, touch screens open it all the way. Cards rise in turn | Scrub; pointer; once | `js/recipes/keyhole.js`; `batchReveal` | `css/hl.css` |

`js/chrome.js` holds the page furniture both kinds of page share: `overlayNav(hero)` (used with `.has-overlay-nav` on `<body>` and `css/nav-overlay.css`) and `preloaderLifted()`.

## Hooks you can use anywhere

| Attribute | Effect |
|---|---|
| `data-reveal-text` | Heading lines rise out of a mask, once |
| `data-reveal` | Block fades and rises with its neighbours, once |
| `data-word-light` | Words go from dim to full as the element crosses the screen |
| `data-word-gather` | Words start spread from the centre of their line and close up |
| `data-roll` | Digits roll into place, once (gradient text cannot show it: give it a flat colour) |

## Rules this project relies on

- `html.js` is added by the first script in every `<head>`. The legacy `.reveal` classes only hide content when it is there, and never under reduced motion (bottom of `css/style.css`).
- SplitText is `js/vendor/SplitText.min.js` (gsap 3.15.0, free since 3.13). `js/motion/core.js` registers it when a page loads it.
- No CSS `transition` on any element a recipe animates. Where a card has a hover transition, the recipe animates an inner layer instead (city cards: `.city-card-bg` and `.city-card-content`).
- Pictures still come from images.unsplash.com. Self-hosting them in `img/` is on the list for the finishing pass.
