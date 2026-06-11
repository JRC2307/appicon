# Roadmap — iterating on icons over time

The v1 loop is one-shot: design SVG → render → wire → re-add bookmark. These are the
improvements that would make the loop *iterative* — tweak a glyph, see the whole home
screen, re-render the fleet — roughly in order of value. None are started; pick one when
the itch is real, skip it when it isn't.

## 1. Contact sheet — judge icons the way the phone shows them

`appicon grid <dir-of-svgs|manifest>` → one PNG/HTML contact sheet rendering every icon at
**60 px** (home-screen size), with the iOS squircle mask composited and the app name in the
home-screen label font, against light and dark wallpaper swatches.

Why first: every design mistake so far (glyph too thin, too low, colors too close) is only
visible at 60 px next to its neighbors. Today that check means saving nine bookmarks.

## 2. Fleet manifest + `appicon sync` — one command to re-render everything

A small `icons.json` at a root of your choosing:

```json
[
  { "name": "crux", "svg": "~/…/crux/docs/brand/icon.svg", "out": "~/…/crux/icons", "color": "#F2542D" }
]
```

`appicon sync` re-renders every entry (skip if SVG unchanged — hash check). Turns "tweak
the carabiner stroke width" into a 5-second operation across the fleet, and replaces the
hand-maintained palette table: the manifest **is** the taken-color registry, and `sync`
fails loudly on a duplicate color.

## 3. Legibility lint

On render, downscale to 60 px and warn when a heuristic trips:
- glyph bounding box outside ~45–75 % of canvas (too small to read / no breathing room)
- contrast ratio between glyph and background < 3:1
- stroke widths that fall below ~1.5 px after downscale

Cheap to compute with sharp's raw pixel access; catches the two real mistakes made during
the initial rollout before they reach the phone.

## 4. Maskable safe-zone check (Android)

`icon-512.png` is offered as `purpose: any maskable` in manifests; maskable crops to a
central 80 % circle. Lint that the glyph stays inside the safe zone, or emit a separate
`icon-512-maskable.png` with auto-padding when it doesn't.

## 5. Dark / tinted icon variants

iOS 18+ renders home-screen icons in dark and tinted modes (dark wallpaper users see this
constantly). Investigate whether Safari web bookmarks participate (as of the initial
release, native apps do; web clips appear unaffected — re-test on new iOS versions).
If they ever do: `--dark <svg>` emitting the alternate set is the natural shape.

## 6. `npx` distribution

Publish as `@jrc2307/appicon` (bare `appicon` is taken on npm) so usage is
`npx @jrc2307/appicon icon.svg --out public` with no clone. Zero code changes — just
`npm publish` and a README tweak.

## 7. `--ico` output (only if something demands it)

Legacy `favicon.ico` via a `png-to-ico` dependency. Every modern browser accepts PNG
favicons; this exists on the list only to record that it was considered and skipped.

## Non-goals

- **AI image generation** — the whole point is hand-drawn, meaning-bearing glyphs.
- **Updating already-saved bookmarks** — iOS bakes icons at save time; no tool can fix
  that. The re-add step stays human.
- **A GUI** — the SVG is the interface.
