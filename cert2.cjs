
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const btns = await page.locator('button').allTextContents();
  console.log('Buttons:', JSON.stringify(btns));
  const orgBtn = page.locator('button', { hasText: 'Organizer' });
  if (await orgBtn.count() > 0) {
    await orgBtn.first().click();
    await page.waitForTimeout(3500);
    console.log('URL:', page.url());
    await page.goto('http://localhost:5173/organizer/certificates', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const selects = await page.locator('select').all();
    console.log('Selects:', selects.length);
    if (selects.length > 0) {
      const opts = await selects[0].locator('option').allTextContents();
      console.log('Options:', JSON.stringify(opts));
      if (opts.length > 1) {
        await selects[0].selectOption({ index: 1 });
        await page.waitForTimeout(2000);
        const genBtn = page.locator('button').filter({ hasText: /Generate/ });
        if (await genBtn.count() > 0) { await genBtn.first().click(); await page.waitForTimeout(3000); }
        const previewBtn = page.locator('button').filter({ hasText: /Preview/ });
        if (await previewBtn.count() > 0) { await previewBtn.first().click(); await page.waitForTimeout(2000); }
        await page.screenshot({ path: 'C:/Users/kikos/AppData/Local/Temp/cert-final.png' });
      }
    }
  }
  await browser.close();
  console.log('done');
})().catch(e => console.error(e.message));
