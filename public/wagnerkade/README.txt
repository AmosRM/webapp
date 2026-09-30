Upload this folder as it is: index.html is the page, photos/ holds the 9 images it shows.

- Keep the folder together. Every path in the page is relative (photos/...), so it works in any folder on any host,
  or opened straight from disk.
- The page needs the network once it runs: the 3D model loads three.js from jsDelivr:
  https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js
  https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/
  Without it (offline, or the CDN blocked) the page still shows the property notes and photographs and says the
  3D model could not load.
- manifest.json lists every file with its size and SHA-256, and where each image came from.
- Regenerate this folder with skill/room-from-photos/package.py; never edit index.html here by hand.
