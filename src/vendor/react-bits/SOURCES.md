# Animation sources

Retrieved from the official React Bits registry on 23 November 2026.

- Ballpit: https://reactbits.dev/backgrounds/ballpit
- Registry: https://reactbits.dev/r/Ballpit-TS-CSS.json
- Scroll Reveal: https://reactbits.dev/text-animations/scroll-reveal
- Registry: https://reactbits.dev/r/ScrollReveal-TS-CSS.json
- License: MIT + Commons Clause, reproduced in LICENSE.md. These components are embedded in this studio website, not redistributed as a component product.

Ballpit retains the upstream WebGL sphere renderer and collision solver. Shader code is separated; local changes add pause and keyboard-triggered impulses, unavailable feedback and touch scroll compatibility. The large vendor simulation stays together to preserve a reviewable relationship with its upstream source. Application controls and responsive layout live outside the vendor module.

Scroll Reveal retains the upstream word splitting, reveal interpolation and scroll progress calculation, restricted to the rise/scrub configuration used by the studio. It respects reduced motion and cleans up its inline styles.
