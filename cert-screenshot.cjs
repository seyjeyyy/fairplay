const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Quick login as Organizer
  await page.click('text=Organizer');
  await page.waitForTimeout(2500);

  // Go to certificates page
  await page.goto('http://localhost:5173/organizer/certificates', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:/Users/kikos/AppData/Local/Temp/cert1.png' });

  // Select first event in dropdown
  const selects = await page.locator('select').all();
  if (selects.length > 0) {
    await selects[0].selectOption({ index: 1 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'C:/Users/kikos/AppData/Local/Temp/cert2.png' });

    // Click Generate All Certificates
    const genBtn = page.locator('button', { hasText: 'Generate' }).first();
    if (await genBtn.count() > 0) {
      await genBtn.click();
      await page.waitForTimeout(2500);
      await page.screenshot({ path: 'C:/Users/kikos/AppData/Local/Temp/cert3.png' });
    }

    // Click first Preview button
    const previewBtn = page.locator('button', { hasText: 'Preview' }).first();
    if (await previewBtn.count() > 0) {
      await previewBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'C:/Users/kikos/AppData/Local/Temp/cert4.png' });
    }
  }

  await browser.close();
  console.log('done');
})().catch(e => { console.error(e.message); process.exit(1); });
