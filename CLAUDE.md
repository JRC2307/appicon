# appicon

CLI (Node/sharp) that rasterizes one glyph SVG into the full web-app icon set
(apple-touch-icon 180×180, icon-192.png, icon-512.png, favicon.png 48×48, plus
the source `icon.svg` copied alongside) so self-hosted apps saved from Safari
to the iPhone home screen get a real tile instead of a screenshot thumbnail.
Status: stable, maintaining — no server component, invoked ad hoc (and by
`project-workspace-setup`) whenever a new self-hosted app needs an icon set.

## Stack + key paths

- Node.js (ESM), single dependency: `sharp` (rasterizes SVG via libvips).
- Entry point: `bin/appicon.mjs` (exposed as the `appicon` bin in `package.json`).
- No config file — all options are CLI flags.

## Run locally

```bash
npm install
node bin/appicon.mjs icon.svg --out path/to/your/app/public
```

- `--data-uri` — prints the 180px icon as a base64 `data:` URI link instead of
  writing files (for servers with no static file routes).

## Deploy

Not deployed. Published as a public repo (`github.com/JRC2307/appicon`),
installed/run locally per project — there is nothing running on caguaserver
or any other host.

## Command Center

project_id: 26
tasks: http://caguaserver.triceratops-adelie.ts.net:8787/api/tasks?project_id=26
