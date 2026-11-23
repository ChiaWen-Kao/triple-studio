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
- `src/components/cases/` — coordinated text and visual case-study chapters
- `src/hooks/useCaseCarousel.ts` — visibility, playback and chapter timing
- `src/constants/cases.ts` — three case studies and their chapter content
- `src/constants/questions.json` — shared visible questions and search content
- `src/api/contact.ts` and `src/hooks/useContactForm.ts` — contact request lifecycle
- `src/styles/` — shared tokens and feature-specific styles
- `scripts/build-search-content.mjs` — static introductory content, structured data and sitemap

## Motion and accessibility

The hero uses locally modelled connectors, with pointer response and a pause control. The scroll journey connects idea, thinking and outcome. A second scene moves through a corridor of product ideas before the contact section. Scenes load separately, stop drawing off-screen and release their graphics resources on unmount.

Case studies advance every 6.5 seconds only while visible. Text and animation share one chapter index. Hover and keyboard focus pause advancement; manual chapter selection pauses until Play is requested. Reduced motion disables autoplay and pinned scene transitions, retaining the information and manual controls. The narrow layout stacks the case text above its visual and presents the three process chapters in reading order.

The visual direction follows the inspected reference's floating objects, text reveals and spatial scroll transitions with Wendava's own palette, geometry and content. Reference-site media and client work are not included.

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
