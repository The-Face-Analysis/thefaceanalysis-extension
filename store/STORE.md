# Store listing — True Mirror & Face Photo Helper by The Face Analysis

Upload: `dist/thefaceanalysis-extension-chrome-<v>.zip` → Chrome Web Store, Edge Add-ons (same zip).
`dist/thefaceanalysis-extension-firefox-<v>.zip` → addons.mozilla.org (source: readable, unminified bundle;
if asked, upload this repo without node_modules/dist + "npm ci && npm run build").
Developer account: The Face Analysis's own account (separate from the other brands), verified with the
thefaceanalysis.com domain via Search Console.

## Name
True Mirror & Face Photo Helper by The Face Analysis  (en only — the site ships en only)

## Summary (≤132)
True mirror and camera view, lighting check, face guide grid and photo flip — take a straight, well-lit photo of your own face.

## Category
Chrome: Photos · Edge: Photos · Firefox: Photos, Music & Videos

## Description
See your face the way others do, and take a straight, well-lit photo of it — all on your own device.

TRUE MIRROR
• Switch between the mirror (flipped, the face you are used to) and the true view (how other people and cameras see you).
• Zoom up to 3×, a white light ring that brightens your face on screen, and a 3 or 10 second timer.

FACE GUIDE
• An oval with a centre line, an eye line and a thirds grid, so your face is level, centred and straight-on.

LIGHTING CHECK
• Reads the light inside the face guide: is it bright enough, is one side darker, is part of the face blown out?
• Tells you what to change — "turn toward the light", "move closer to the light", "soften the light".

FREEZE AND SAVE
• Freeze the frame, then save it as a JPEG in your downloads — as the camera sees you, or mirrored.

FLIP A PHOTO
• Drop, choose or paste any picture of yourself and see it as saved and flipped, side by side. Save the flipped version.

MEASURE IT
• One click opens a free measurement on thefaceanalysis.com — face symmetry, face shape, golden ratio, facial thirds, eye shape, canthal tilt, jawline. You upload the photo there yourself; the extension uploads nothing.

PRIVACY
The camera picture and your photos never leave your device. No account, no analytics, no tracking, no access to the websites you visit. Measurements on thefaceanalysis.com are proportions, not a medical or beauty verdict.

Made by The Face Analysis — free face measurement tools at thefaceanalysis.com.

## Single purpose (CWS field)
Help people take a straight, well-lit photo of their own face: a true-mirror camera view with a face guide and lighting check, a photo flipper, and saving the result locally.

## Permission justifications
- storage: remember the user's view settings (mirror/true view, zoom, guide, light ring, timer, chosen measurement).
- Camera: requested by the browser's own prompt on the extension's studio page (getUserMedia) when the user opens the mirror; it is not a manifest permission. Frames are processed in the page and never sent anywhere.
- No host permissions, no content scripts, no activeTab: the extension never reads or changes websites.
- Remote code: No.

## Data usage (CWS privacy tab)
Collects nothing. Tick none of the data types (the camera image is processed locally and not "collected" — it is never transmitted or stored by the developer). Certify: not sold, not used for unrelated purposes, not used for creditworthiness.
Privacy policy URL: https://thefaceanalysis.com/extension#privacy  (section must exist on the landing before submission)
Firefox `data_collection_permissions`: required ["none"] (already in the built manifest).

## Assets
- Icon 128: static/icons/128.png (site orb, transparent)
- Screenshots 1280×800 (store/):
  1. screenshot-1-mirror-guide.png — mirror view, face guide, "Good light"
  2. screenshot-2-true-view-light-ring.png — true view + light ring
  3. screenshot-3-light-check.png — lighting check catching side light
  4. screenshot-4-flip-photo.png — photo as saved vs flipped + measure card
  5. screenshot-5-toolbar-popup.png — toolbar popup
- Small promo tile 440×280: store/promo-small-440x280.png (source: store/tile.html)
- Regenerate: store/make-assets.mjs (see test/README.md for the camera feeds)
- Homepage: https://thefaceanalysis.com/extension
- Faces in screenshots: the site's own sample portraits (surgio_marketing/public/images/samples) — check their licence/model status before submitting.

## Before submitting
- thefaceanalysis.com/extension must be live (install/uninstall pages + #privacy) — install opens it.
- Review: "true mirror" is a generic term; no competitor names anywhere in the listing.
