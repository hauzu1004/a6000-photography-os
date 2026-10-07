# A6000 + 50mm Photo + Video OS

Production: **https://hauzu1004.github.io/a6000-photography-os/**

Current release: **v21.0.0**. Use this same URL for everyday work; no ZIP download or local server is needed.

## Everyday use

1. Open the app online once so its offline files install.
2. Choose Photo or Video, or search for a subject in English or Vietnamese (accents optional).
3. Open **Filters · field workflows · preflight** for light/subject/purpose filters, quick workflows and checklists.
4. The label next to **Check update** identifies the version actually loaded in this tab.
5. When a new worker is ready, choose **Update now** or **Later**. Updating keeps local checklists and language preference.

Install using your browser's Install app / Add to Home Screen command. External documentation links require a connection. Offline content becomes available only after a successful first online visit.

## Development and validation

Use Node.js 24 (minimum 22):

```sh
npm ci
npm test
npm run build
npm run serve
```

Preview at `http://localhost:3001/a6000-photography-os/`. Localhost supports the service worker, so it can be exercised before deployment. A development change to a precached asset requires a new worker/cache version or clearing **only the local preview** worker/cache; do not clear production storage unnecessarily.

## Release process

```sh
npm run release -- v21.0.1 "Describe the change"
npm test
npm run build
git add .
git commit -m "Release v21.0.1: describe the change"
git push origin main
```

The release command updates `version.json`, `release.js`, `service-worker.js`, `package.json` and the lockfile together. Append the release description to `CHANGELOG.md`. Commit all release changes atomically. Never reuse a cache version for changed app assets.

`.github/workflows/deploy.yml` installs locked development dependencies, validates release/assets, runs regression checks, stages only production files into `dist/`, then uploads/deploys Pages. A failed check prevents publication.

Pages is the only production target. Preserve the existing Pages configuration; the workflow is already active. Netlify is not required.

After release, verify the latest Actions run corresponds to the current `main` commit and succeeds. Check the live version, worker, manifest, both icons and app scripts. Open the app, confirm the displayed release and try Photo, Video and a search result.

## Source layout

- `index.html`: preserved Photo/Video content and page structure.
- `app.css`, `field-tools.css`: existing and new responsive styles.
- `legacy-app.js`: original navigation and interactions, with navigation/storage fixes.
- `field-cases.js`: video case data separate from rendering.
- `field-tools.js`: search catalog, field filters, workflow summaries, quick links and checklists.
- `pwa.js`: registration, loaded-version status and update UI.
- `service-worker.js`: scoped cache, legacy migration and offline app shell.
- `version.json`, `release.js`: release metadata.
- `scripts/`: release, validation, regression checks, staging and local preview.
- `ROADMAP.md`, `CHANGELOG.md`: scope and release history.

## Recovery and data

- If upgrading from V18/V19, close all app tabs and reopen once if the old interface persists. The new worker includes migration from those legacy caches.
- An update failure leaves the current app available; retry **Check update** when online.
- **Start a new session** resets only the new field preflight checks after confirmation. Original checklists are separate and preserved.
- Checklists live in this browser profile, not in an account. Clearing site data or uninstalling the profile may erase them.
- Extension `runtime.lastError` messages must be diagnosed in the extension; this app ignores extension requests. Confirm the source before changing app code.
- To roll back, restore known-good app source in a new commit and run the release command with a *newer* version. Do not reuse an older cache name or rewrite Git history.

## Verification limits

Regression tests model offline/cache/update behavior. Browser checks cover actual layout and navigation. Installation and standalone launch behavior should also be checked on the user's physical iOS/Android devices; those devices are not available in this workspace.
