# triple. studio

Responsive studio landing page built with React, TypeScript and Vite. The migration preserves the original page copy, CSS illustrations, layout, service modes, sticky card stack and responsive navigation.

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

The production output is `dist/`. The preview server serves it at http://127.0.0.1:4173/triple-studio/.

## Structure

- `src/components/` — page sections and service illustrations
- `src/hooks/` — navigation-independent interaction and form lifecycle logic
- `src/constants/` — service copy and contact configuration
- `src/api/contact.ts` — FormSubmit request and timeout handling
- `src/utils/serviceStack.ts` — card measurement and scroll opacity
- `src/styles/` — original CSS grouped by responsibility, with the original cascade order
- `.github/workflows/` — pull request validation and GitHub Pages publication

An invisible, inert copy of the whole-project cards measures their natural height without changing the live React content. Both service modes use this height, matching the original stack. It is excluded from focus and the accessibility tree.

## GitHub Pages

The Vite base path is `/triple-studio/`. Publication uses the built `dist/` artifact; the source files cannot be served directly as a static React application.

A repository administrator or maintainer must enable **Settings → Pages → Build and deployment → Source: GitHub Actions**. This is a private repository, so its owner's plan must support Pages for private repositories. Publishing the site does not require making the source repository public.

After review and merge into `main`, the **Deploy GitHub Pages** workflow validates, builds and publishes the site. Pull requests only run CI and never publish. The workflow can also be rerun manually on `main`. No personal access token or hosting secret is required.

The expected address after a successful deployment is https://chiawen-kao.github.io/triple-studio/. Check the deployment job's URL and verify assets, anchors, navigation and the contact flow there before announcing the site. To roll back, revert the relevant change on `main` and let the workflow rebuild the previous version.

## Contact form

Requests are addressed to `kaiwang2027@gmail.com` through FormSubmit. The action identifier in `src/constants/contact.ts` is a public submission address, not a secret. The `email` field supplies the visitor's reply address. Never put SMTP credentials in this client application.

The form validates required fields, disables controls while sending, prevents duplicate requests, preserves entries on failure and resets them only after the service confirms success. Requests time out after 20 seconds and are not retried automatically. A timeout can happen after a request was accepted. A hidden honeypot provides basic bot filtering.

**Delivery limitation:** earlier local tests continued to receive an activation-required response after activation. Activation released queued mail, but stable subsequent delivery remains unverified. The migration preserves this integration and its failure feedback; it does not resolve that external delivery problem. Visitors can use the direct email link.

Before treating the form as ready, submit a clearly labelled test from the published URL, complete activation if requested, then confirm a second request succeeds without another activation and arrives with all four fields and the correct Reply-To. Also check Spam. HTTP 200 alone is not delivery confirmation. Automated tests mock the service and do not send mail.

## Design scope

The hero canvas and team portraits retain the original placeholders. Pricing remains scope-based. A chat request does not confirm a meeting time. New artwork, copy changes and replacing the form provider are outside this framework migration.
