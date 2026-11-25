# True Mirror & Face Photo Helper — The Face Analysis (browser extension)

Take a straight, well-lit photo of your own face: true mirror vs camera view, face guide grid,
lighting check, photo flip, save locally — then measure it with the free tools on
[thefaceanalysis.com](https://thefaceanalysis.com/?utm_source=github&utm_medium=extension-repo).

Manifest V3, permission `storage` only, no host permissions, no content scripts, no remote code,
no analytics. Camera access goes through the browser's own prompt; frames never leave the device.

    npm ci
    npm run check          # tsc + build + web-ext lint
    # e2e: see test/README.md (Playwright Chromium with a fake camera)

`dist/` gets a Chrome/Edge/Opera zip and a Firefox zip. Store listing text: `store/STORE.md`.
Third-party font licences in `LICENSES/`.
