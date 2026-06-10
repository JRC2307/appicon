# appicon

Renders a square glyph SVG into the standard web-app icon set so every app saved from
Safari to the iPhone home screen gets a real, recognizable tile.

```bash
node ~/Desktop/1/tools/appicon/bin/appicon.mjs <icon.svg> --out <static-dir> [--name <project>]
```

Outputs: `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `favicon.png` (48),
plus the source copied as `icon.svg`. Prints the `<link>` tags to paste.

## SVG contract

- Square `viewBox`, **full-bleed flat background rect** — iOS applies its own rounded
  mask, never bake rounded corners or padding-to-transparent.
- One bold centered glyph, readable at 60 px.
- Background color comes from the 12-color palette in the `project-workspace-setup`
  skill (each project claims one — no two apps share a color).

Design + per-project wiring conventions: see `docs/specs/2026-06-10-appicon-design.md`
and the icon step in `~/.claude/skills/project-workspace-setup/SKILL.md`.
