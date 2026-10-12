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
- Reduced-motion mode renders titles immediately, disables decorative animation and removes moving hover transitions. Animation needs no JavaScript; titles have a complete screen-reader text equivalent.
- Preserve news data, source attribution, timestamps, sample labels, search, category links, archives and language selection.
