# Dependency installation

The `/seer-2026` hero now uses React Three Fiber, Three.js, and GSAP as required by the design brief. Their versions are declared in `package.json`.

Run this from `/Users/leo/Documents/POIDH/poidh2` before building:

```sh
npm install
npm run build
```

After the commands pass, remove this file and record the browser results in `/Users/leo/Documents/POIDH/poidh2/docs/qa/SEER-2026-REDESIGN-QA.md`.

The current IDE terminal bridge did not execute even a one-line shell script during this session, so it could not produce `package-lock.json` or run the browser QA pass. This note should be removed after a successful install and build.