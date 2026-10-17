# Changelog

## v21.0.10 — 2026-10-18

- Added Park Walk — All-Weather Scene Guide with 40 bilingual photography scenes and scene-specific presets.
- Covers paths, sunlight, hard noon shadows, open shade, overcast, highlights, backlight, flare, foliage, flowers, ponds, rain, people, movement, pets, groups, picnic, panorama, mist, blue hour, park lamps, night portraits, reflections and light trails.

## v21.0.9 — 2026-10-17

- Moved every Photo Field Case button inside the searchable field-case grid; this fixes missing cards in the grid and global field-case filtering.
- Refreshed release, package and service-worker cache versions after the layout correction.

## v21.0.8 — 2026-10-17

- Repaired invalid DOM nesting that placed Waterfront Café, Sunset, Backlit Plant and Passport Photo cases inside Aquarium.
- Hardened photo-case navigation and added safeguards for missing/nested detail cards.
- Expanded sunset presets with water reflections and added a bilingual Wedding Guest case for couple portraits, candid moments, group photos, low-light reception and details.
- Added validation and UI tests for every Photo Field Case route, its detail content and back navigation.

## v21.0.7 — 2026-10-17

- Added a self-healing fallback in `pwa.js` that recreates the Check Update button and update notice when an older cached HTML page lacks them.
- Bumped the service-worker cache version to refresh existing installs.

## v21.0.6 — 2026-10-17

- Added bilingual Photo Field Case: Sunset — Color, Silhouette & Foreground.
- Included presets for sunset colors, silhouettes, layered lifestyle and blue hour, plus composition and exposure guidance.

## v21.0.5 — 2026-10-17

- Added bilingual Photo Field Case: Backlit Ornamental Plant — Leaf Glow.
- Included four presets for leaf glow, translucent veins, silhouette and soft rim light, plus composition, highlight protection, focus and accessory tips.

## v21.0.4 — 2026-10-17

- Fixed missing `checkUpdate`, `updateNotice`, and `releaseLabel` elements that caused `pwa.js` to stop before registering the service worker.
- Added a visible Check Update control and update notice styling.
- Added a one-time service-worker recovery activation so existing cached installs can receive the fix.

## v21.0.3 — 2026-10-17

- Added a bilingual Waterfront Café — Golden Hour photo field case with four compositions: lifestyle foreground, skyline/lamppost, coffee detail, and cinematic silhouette.
- Included Sony A6000 + 50mm F1.8 exposure presets, framing tips, highlight control and DRO guidance.

## v21.0.2 — 2026-10-12

- Added a bilingual Passport Photo 4×6 cm field case for Sony A6000 + 50mm F1.8.
- Included camera setup, lighting, pose, exposure, crop, print/export and links to official Vietnamese passport-photo requirements.

## v21.0.1 — 2026-10-11

- Added the bilingual Sony A6000 in-camera “Hanoi Morning Film” JPEG recipe to the Morning Warm Sun — Tree-Lined Road photo case.
- Included Creative Style, WB shift, exposure guidance, optional Autumn Leaves comparison, and a warning before overwriting an MR memory slot.

## v21.0.0 — 2026-10-08

- Completed the V19–V21 navigation, field tools and maintenance scope in one release.
- Added searchable catalog, bilingual/unaccented search, filters, field shortcuts and saved Photo/Video preflight.
- Added consistent photo preset workflow summaries and keyboard access for existing cards.
- Moved Photo OS into its own screen and closed prior views when opening cases.
- Separated styles, legacy logic, video case data, new field tools and PWA logic.
- Added explicit loaded-version display, update checks and user-controlled activation of a waiting worker.
- Added a bounded app-shell cache, one-time V18–V20 migration and offline navigation fallback for query URLs.
- Added automated validation/tests and production-only artifact staging before Pages deploy.

## v19.0.0

Photo Start Here, MR1/MR2/MR3 chooser, control ladder and quick rules.

## v18.0.3

Ignored extension and out-of-scope requests in the service worker.

## v18.0.2

Activated the Pages workflow under `.github/workflows/`.

## v18.0.1 and earlier

Project-relative PWA paths and the original Photo/Video content. Historical notes remain in `version.json` and Git history.
