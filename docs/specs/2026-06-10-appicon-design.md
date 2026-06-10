# appicon — per-app home-screen icons

**Date:** 2026-06-10 · **Status:** approved (caguabot, in-session)

## Problem

Every web app gets saved to the iPhone home screen from Safari. Apps without a real
`apple-touch-icon.png` get the generic screenshot tile, so the home screen is a wall of
indistinguishable bookmarks. Icons must be generated for every new project automatically
and backfilled onto the phone-served apps.

## Decision

Claude-designed glyph icons: at project setup, Claude designs one bold, full-bleed SVG
per app — a single symbol that says what the app *is* — on a dedicated background color
from a fixed palette, so no two apps share a color. A small local CLI renders the SVG to
the full icon set.

## Components

### 1. The CLI — `tools/appicon/`

- `bin/appicon.mjs`, Node, one dependency: `sharp` (rasterizes SVG via libvips).
- Usage: `appicon <icon.svg> --out <dir> [--name <project>]`
- Outputs into `--out`: `apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png`,
  `favicon.png` (48×48), plus a copy of the source as `icon.svg`.
- Prints the HTML `<link>` tags to paste (apple-touch-icon + favicon), and a note for
  Next.js apps (file-convention `apple-icon.png` in `app/`).
- SVG contract: square viewBox, flat background rect (iOS adds its own rounded mask —
  never bake rounded corners), one centered glyph, readable at 60 px.

### 2. The palette registry

Fixed 12-color palette; each project claims one. The taken-list lives in the
`project-workspace-setup` skill (the thing that's already read at project-mint time).

| # | Color | Hex | Taken by |
|---|-------|-----|----------|
| 1 | Orange | `#F2542D` | crux |
| 2 | Ink black | `#16161A` | phone-terminal |
| 3 | Indigo | `#4F46E5` | interviewprep |
| 4 | Teal | `#0F766E` | consulting |
| 5 | Coffee brown | `#6F4E37` | larepisa |
| 6 | Crimson | `#D7263D` | rawcam-pwa |
| 7 | Forest | `#1B7A3D` | financial (portfolio) |
| 8 | Amber | `#D99000` | — |
| 9 | Slate blue | `#3B5B8C` | — |
| 10 | Magenta | `#B83280` | — |
| 11 | Cyan | `#0E7490` | — |
| 12 | Plum | `#6B21A8` | tradingbot (PolyBot dash) |

### 3. New-project hook

New step in `~/.claude/skills/project-workspace-setup/SKILL.md`: design the glyph SVG →
commit to `docs/brand/icon.svg` → claim the next free palette color (update the skill's
table) → run `appicon` → wire the link tags into the app shell.

### 4. Backfill (this session)

| App | Repo | Glyph idea | Wiring target |
|-----|------|-----------|---------------|
| crux | `~/Desktop/1/projects/personal/crux` | carabiner / crimp hold | `index.html` (no icon links yet) |
| interviewprep | `~/Desktop/1/projects/personal/interviewprep` | `{ }` braces + cursor | `index.html` (no icon links yet) |
| phone-terminal | `~/Desktop/1/tools/phone-terminal` | `>_` prompt | ttyd serves no static files → embed 180px PNG as **data URI** link in `src/keybar.head.html`; rebuild via `src/build.sh` |
| consulting | `~/Desktop/1/projects/client/consulting` | ascending bars | `frontend/index.html` + `frontend/public/` |
| larepisa | `~/Desktop/1/projects/personal/larepisa` | cup on a shelf | replace SVG touch-icon links in `index.html` with PNG set in `public/` (iOS ignores SVG apple-touch-icons — this is why it shows a screenshot today) |
| rawcam-pwa | `~/projects/experiments/rawcam-pwa` | aperture | replace `icons/icon-192/512.png`, add 180px `apple-touch-icon.png` + link, keep `manifest.json` paths |

## Out of scope

No PWA-manifest overhauls, no rebranding of client apps with real branding
(dinara, accessos), no AI image-generation APIs, no `.ico` output (PNG favicons are
universally supported).

## Verification

- `appicon` run on a test SVG produces all four PNGs at exact sizes (`sips -g pixelWidth`).
- Each backfilled app: icon files exist in the static dir, link tags present, and for the
  Vite apps the files are under `public/` so they survive builds.
