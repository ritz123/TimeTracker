/**
 * Renders marketing/slideshow.html to marketing/slideshow.pdf (A4 landscape, one slide per page).
 * Requires: npm install && npx playwright install chromium
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(here, 'slideshow.html');
const pdfPath = path.join(here, 'slideshow.pdf');
const url = pathToFileURL(htmlPath).href;

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  console.log('Wrote', pdfPath);
} finally {
  await browser.close();
}
