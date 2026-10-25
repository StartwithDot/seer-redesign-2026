// Viewport-by-viewport screenshots (canvases only draw when visible, so full-page captures lie).
import { chromium } from "playwright-core";
const [,, url = "http://127.0.0.1:5174/", w = "1440", h = "900", prefix = "v"] = process.argv;
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.addInitScript(() => localStorage.setItem("futarchy.tour.v1", "done"));
await p.goto(url); await p.waitForTimeout(1500);
const total = await p.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < total; y += +h * 0.9) {
  await p.evaluate(v => window.scrollTo(0, v), y); await p.waitForTimeout(1300);
  await p.screenshot({ path: `e2e/out/${prefix}-${i++}.png` });
}
console.log("shots", i, "height", total);
await b.close();
