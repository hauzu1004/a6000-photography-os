# Roadmap delivery — v21.0.0

Production: https://hauzu1004.github.io/a6000-photography-os/

This release implements the agreed V19–V21 scope on top of the existing V19 Photo OS. Version numbers are consolidated into one release, with earlier Git history and release notes retained.

| Phase | Delivered |
| --- | --- |
| V19: daily use | Existing Photo OS/MR guidance retained; global search opens Photo/Video presets and field cases; consistent goal/settings/shoot/review summary on photo presets; loaded version displayed; waiting-worker update prompt |
| V20: field tools | Saved Photo and Video preflight; mode/light/subject/purpose filters; explicit 50mm scope; shortcuts for five-minute setup, outdoor, moving subject, cinematic and low light; mobile layout and keyboard controls |
| V21: maintenance | CSS and JS separated from HTML; video case data separated from rendering; synchronized release command; asset/manifest/syntax/version validation; UI and worker regression tests; clean dist artifact; tests required before deployment; changelog and operating instructions |

## Acceptance and practical limits

- Unit checks cover navigation between modes, bilingual/unaccented search, filters, saved checklists, damaged storage, worker precache, request filtering, legacy cache migration, offline navigation and update confirmation.
- Validate checks all local assets, manifest scope, script syntax, duplicate IDs, release alignment and Photo/Video screen boundaries.
- Browser checks cover the live UI, console errors, search-to-case navigation and a 390px layout. These do not substitute for installation testing on every physical Android/iOS device.
- External Sony documentation links require internet. App content is available offline after its first successful online installation.
- Only the 50mm lens is supported; the lens selector describes that fixed scope, not a multi-lens recommendation engine.
- No Netlify production is created. The single published site remains GitHub Pages; preview is local.
- Existing detailed camera content is retained. This software release is not a fresh technical audit of every historical photography recommendation.
