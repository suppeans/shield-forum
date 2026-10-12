# Design and component sources

The components below are adapted for SHIELD NEWS, rather than installed as whole UI libraries.

- **React Bits / BlurText**, copyright (c) 2026 David Haz.
  [Source](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/BlurText/BlurText.tsx), [demo](https://reactbits.dev/text-animations/blur-text).
  License: MIT + Commons Clause, retained in `licenses/react-bits.txt`.
  Adaptation: retain character staggering and blur/translate keyframes; use CSS instead of Motion/IntersectionObserver because the heading is already in the initial viewport. Render inline spans for valid heading markup, provide one accessible text equivalent, and honor reduced motion.
- **Aceternity UI / Spotlight**, by Manu Arora.
  [Source registry](https://ui.aceternity.com/registry/spotlight.json), [demo](https://ui.aceternity.com/components/spotlight), [terms](https://ui.aceternity.com/licence).
  Adaptation: preserve the elliptical SVG and Gaussian blur; use ordinary CSS, the Mintlify accent, decorative semantics and per-instance React IDs. Respect reduced motion. Uses the public free component, with no paid template or block.
- **Uiverse.io / new-bird-34**, by adamgiebl (Adam Giebl).
  [Source](https://github.com/uiverse-io/galaxy/blob/main/Buttons/adamgiebl_new-bird-34.html), [demo](https://uiverse.io/adamgiebl/new-bird-34).
  License: MIT, retained in `licenses/uiverse.txt`.
  Adaptation: use an anchor for the news-feed destination; remove inset shadows, use black/mint pills, and limit capsule expansion so the label remains visible. Include keyboard focus and reduced motion.
- **Inter**, by Rasmus Andersson.
  [Source](https://github.com/rsms/inter), SIL Open Font License 1.1 retained in `licenses/inter.txt`. The variable WOFF2 is self-hosted under `public/fonts/`.

The Mintlify reference is an independent design analysis from [voltagent/awesome-design-md](https://github.com/voltagent/awesome-design-md) (MIT). SHIELD NEWS keeps its own name, content and editorial identity.
