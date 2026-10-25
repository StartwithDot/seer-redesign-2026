// Run against the existing driver browser; this script never starts a server.
export async function verifyDocumentScroll(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(300, 600);
  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(500);
  const down = await page.evaluate(() => window.scrollY);
  if (down < 100) throw new Error(`Document did not scroll down: ${down}`);
  for (let index = 0; index < 5; index++) await page.mouse.wheel(0, -2000);
  await page.waitForTimeout(500);
  const up = await page.evaluate(() => window.scrollY);
  if (up > 1) throw new Error(`Document did not return to top: ${up}`);
  return { down, up };
}
