# Wendava Studio

An English studio website built with React, TypeScript, Vite, GSAP and Three.js. The site introduces practical product, website and workflow services through concise copy, interactive scenes and three reserved case studies.

## Development

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173/triple-studio/.

```sh
npm run format
npm run lint
npm run test
npm run build
npm run preview
```

`npm run format:write` formats the source. The production output is `dist/`; preview serves it at http://127.0.0.1:4173/triple-studio/.

## Structure

- `src/components/motion/` — hero, scroll chapters and the spatial transition
- `src/graphics/` — procedural connector geometry and Three.js scene lifecycles
- `src/components/cases/` — featured-work grid, project viewer and coordinated case-study chapters
- `src/hooks/useProjectRail.ts` — horizontal desktop browsing and sustained-scroll next-project navigation
- `src/hooks/useProjectNavigation.ts` — project deep links and browser history
- `src/hooks/useCaseCarousel.ts` — visibility, playback and chapter timing
- `src/constants/cases.ts` — three case studies and their chapter content
- `src/constants/questions.json` — shared visible questions and search content
- `src/api/contact.ts` and `src/hooks/useContactForm.ts` — contact request lifecycle
- `src/styles/` — shared tokens and feature-specific styles
- `scripts/build-search-content.mjs` — static introductory content, structured data and sitemap

## Motion and accessibility

The hero embeds React Bits Ballpit with Wendava colors, physical collisions, drag-and-throw interaction, a keyboard-accessible impulse button and a pause control. React Bits Scroll Reveal provides the word-by-word introduction. The scroll journey connects idea, thinking and outcome. A second scene moves through a corridor of product ideas before the contact section. Scenes load separately, stop drawing off-screen and release their graphics resources on unmount.

Case studies advance every 6.5 seconds only while visible. Text and animation share one chapter index. Hover and keyboard focus pause advancement; manual chapter selection pauses until Play is requested. Reduced motion disables autoplay and pinned scene transitions, retaining the information and manual controls. On phones, each case keeps its animation, chapter text and controls together in a compact card. Horizontal swipes select a chapter; vertical gestures remain page scrolling. The three process chapters retain their pinned, scroll-driven transitions on phones as well as desktops. Reduced-motion preferences and short landscape viewports switch the process to a flowing reading layout so chapter text cannot be trapped below the screen.

The visual direction follows the inspected reference's floating objects, text reveals and spatial scroll transitions with Wendava's own palette, geometry and content. Reference-site media and client work are not included. The reusable component sources, local adaptations and MIT + Commons Clause license are documented in `src/vendor/react-bits/SOURCES.md` and `LICENSE.md`. No additional runtime dependency is needed for the sourced components.

## Mobile interaction design

The mobile layout follows observations of [Lusion](https://lusion.co/) (portrait hero, compact menu and full-screen navigation) and [Studio Dumbar’s Wabi case study](https://studiodumbar.com/work/wabi) (motion before concise narrative). These are interaction references; their media is not redistributed.

- The hero fills the first screen below a compact header, with visible motion controls and a scroll cue.
- Native modal navigation contains focus, locks background scrolling and restores focus when closed.
- The featured-work grid uses two columns on desktop and one column with 15px gutters on phones. Previews retain a 20:13 aspect ratio. Titles roll into view; desktop hover reveals the arrow and moves the title.
- Project details scroll horizontally on desktop and vertically on phones. Continuing to scroll at the desktop endpoint fills a 4.5-second progress indicator and opens the next project; stopping clears progress. The next-project preview expands to fill the screen before the new story appears. A button offers direct navigation; reduced motion skips the transition.
- Project links support direct entry and browser history. Back and Escape close the viewer, restore page scrolling and return focus to the originating tile.
- Case chapters retain synchronized text and visuals inside each project. Horizontal drags select chapters; arrows and tabs provide equivalent controls. Vertical and cancelled gestures do not change chapters.
- Mobile process and portal scroll distances are shorter than desktop, with progress labels and direct links to the next content section.
- The breakpoint is 768px. Reduced-motion preferences retain readable content and manual navigation.

## Content and search

The three case studies are explicitly marked as placeholders. Replace the reserved challenge, outcome and learning text in `src/constants/cases.ts` with approved project information. Team names and roles come from the original site; portraits remain placeholders. Do not add unverified customer claims or performance metrics.

The build adds a readable HTML introduction and questions before the interactive application loads. FAQ structured data and visible answers use the same content file. Organization, website and service data, canonical metadata, social descriptions and `sitemap.xml` use the GitHub Pages URL. Update the canonical URLs in `index.html` and the build script together when changing the domain. Structured data does not guarantee inclusion or enhanced display in search results.

## Contact form

The original FormSubmit integration and recipient, `kaiwang2027@gmail.com`, are retained. The form validates required fields, blocks duplicate submissions, preserves entries on failure and resets only after the service confirms acceptance. It times out after 20 seconds and does not retry automatically. Automated tests mock requests and do not send mail.

Delivery through FormSubmit remains unverified: the original integration previously returned activation-required responses. A successful request is not proof of inbox delivery. Keep the direct email link available. Before relying on form delivery, check an authorised test from the published URL, activation status, inbox arrival, fields and Reply-To. A chat request does not confirm a meeting time.

## Publication and recovery

The Vite base path remains `/triple-studio/`. The existing **Deploy GitHub Pages** workflow checks formatting, lint, tests and the build, then publishes `dist/` on pushes to `main`. Pull requests validate without publishing.

Live site: https://chiawen-kao.github.io/triple-studio/.

Verify the deployed revision and the actual page after publication, including local assets, navigation, chapter controls and contact feedback. To recover from a release regression, revert the relevant commit on `main` and allow the existing workflow to republish. Never force-push to roll back shared history.
