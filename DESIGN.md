# SHIELD NEWS design

Reference: [Mintlify design-md](https://getdesign.md/mintlify/design-md), from [voltagent/awesome-design-md](https://github.com/voltagent/awesome-design-md/tree/main/design-md/mintlify).

- Canvas/standard cards #ffffff; quieter surfaces #fafafa/#f7f7f7; hairline #e5e5e5.
- Ink #0a0a0a; body #3a3a3c; secondary #5a5a5c. Mint #00d4a4, active mint #00b48a, soft mint #7cebcb.
- Mint is reserved for brand marks, active indicators and selected actions. Main buttons are black pills with white type. Small text stays dark for readable contrast.
- Locally hosted Inter for UI; Japanese system fallbacks. Display 36–56px/600, card titles 22–28px/600, article prose 16px with 1.95 leading. Dates use tabular numerals.
- 1280px container, 32px desktop/16px mobile gutters, 4/8px spacing rhythm. Cards use 12px corners; inputs 8px; buttons and filter chips full pills.
- Keep deeper reading surfaces flat. The homepage has one subtle mint Spotlight; news cards use thin borders and at most a small hover shadow.
- Retain the lead-story/supporting-stories split and news-feed/archive rail. Article text is capped at 800px. Collapse navigation below 1024px, cards below 768px; preserve 44px mobile controls.
- React Bits BlurText is adapted to CSS keyframes for a one-time title reveal; Aceternity Spotlight supplies the decorative SVG; Uiverse's arrow capsule animates the news-feed action. See THIRD-PARTY.md for sources and licenses.
- The homepage's right-hand globe uses a soft Three.js sphere: continuous mint land, white oceans, terrain normals, an independent transparent cloud shell and a restrained atmospheric rim. No markers or labels. A one-second turn and simultaneous zoom move from a complete globe into a circular Japan close-up (36°N, 138°E), once per session. Land stays fixed after arrival; only clouds and the glow drift subtly. The smaller mobile globe remains beside the title, with the edition date below.
- Load the 3D engine in a separate chunk and self-host all textures. Start the one-second animation once textures and shaders are ready. Clouds render at roughly 12 fps after settling; pause offscreen/in hidden tabs. Reduced-motion mode renders Japan immediately and stops the render loop. A matching static image covers missing WebGL2, failed texture loads and disabled JavaScript.
- Preserve news data, source attribution, timestamps, sample labels, search, category links, archives and language selection.
