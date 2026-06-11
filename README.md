# appicon

Turn **one glyph SVG** into the complete web-app icon set:

```
apple-touch-icon.png  180×180   ← what the iPhone home screen shows
icon-192.png          192×192   ← PWA manifest
icon-512.png          512×512   ← PWA manifest / maskable
favicon.png            48×48    ← browser tab
icon.svg                        ← your source, copied alongside
```

Built for one specific itch: you self-host a bunch of little web apps (dashboards,
phone tools, trackers) and save them all from Safari to the iPhone home screen — where,
without a real `apple-touch-icon`, every one of them becomes the same unrecognizable
page-screenshot tile. Design one bold SVG per app, run `appicon`, paste two lines of HTML.

## Install

```bash
git clone https://github.com/JRC2307/appicon && cd appicon && npm install
```

One dependency: [sharp](https://sharp.pixelplumbing.com/) (rasterizes the SVG via libvips —
no browser, no ImageMagick).

## Use

```bash
node bin/appicon.mjs icon.svg --out path/to/your/app/public
```

It writes the five files and prints the tags to paste:

```html
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon.png">
```

Next.js app router: skip the tags — copy `apple-touch-icon.png` to `app/apple-icon.png`
and `icon-512.png` to `app/icon.png`.

### `--data-uri` — for servers that can't serve files

Some apps are a single HTML file behind a server with no static routes (a `ttyd` terminal,
a hand-rolled `http.server` with a route whitelist, an auth wall). For those:

```bash
node bin/appicon.mjs icon.svg --out /tmp/myapp --data-uri
```

prints the 180px icon as a ready-to-paste base64 link (~2–4 KB for a flat glyph):

```html
<link rel="apple-touch-icon" href="data:image/png;base64,iVBORw0K…">
```

Bonus property: if your server re-reads the HTML from disk per request, editing in a
data-URI icon is a **zero-restart deploy** — handy when the process can't be bounced.

## Drawing the SVG

The contract that makes icons look right on iOS:

- **Square `viewBox`, full-bleed flat background rect.** iOS applies its own rounded-corner
  mask — never bake in rounded corners or transparent padding.
- **One bold, centered glyph** that says what the app *is*. It must read at 60 px.
- Plain shapes (`rect`, `circle`, `polygon`, `path`) — avoid `<text>`, font availability
  under headless rasterizers is a lottery.

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#16161A"/>
  <polyline points="52,58 84,90 52,122" fill="none" stroke="#39D353"
            stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="96" y="114" width="38" height="14" rx="4" fill="#39D353"/>
</svg>
```

**Tip — one color per app.** Keep a small fixed palette and let each app claim a color;
at a glance your home screen reads by color before you've even parsed the glyphs.

## iOS gotchas this tool exists to dodge

Learned the hard way, encoded here so you don't have to:

1. **SVG `apple-touch-icon` links are silently ignored.** iOS falls back to a page
   screenshot. PNG only.
2. **Icons bake at save time.** iOS fetches the icon once, when the user taps
   *Add to Home Screen*. Ship a new icon → existing bookmarks keep the old one until
   deleted and re-added. Verify the icon URL returns 200 *before* saving.
3. **Auth-gated app? The icon must be on the login page** — that's the page Safari
   actually sees when the bookmark is saved.
4. **PWA manifests don't help Safari here.** `manifest.json` icons matter for Android/
   install banners; the home-screen tile on iOS comes from `apple-touch-icon` alone.

## Future

Planned/considered improvements (contact-sheet preview at 60 px, fleet manifest +
`appicon sync`, legibility lint, maskable safe-zone check): see
[docs/ROADMAP.md](docs/ROADMAP.md).

## License

MIT
