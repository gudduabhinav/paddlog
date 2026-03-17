const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const docsDir = path.resolve('docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  console.log('Taking screenshot of Homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(docsDir, 'home.png'), fullPage: false });

  console.log('Taking screenshot of About Us...');
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(docsDir, 'about.png'), fullPage: false });

  console.log('Taking screenshot of Services...');
  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(docsDir, 'services.png'), fullPage: false });

  console.log('Taking screenshot of Admin Login...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(docsDir, 'admin-login.png'), fullPage: false });

  console.log('Taking screenshot of Book Shipment...');
  await page.goto('http://localhost:3000/book', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(docsDir, 'book-shipment.png'), fullPage: false });

  await browser.close();
  console.log('Screenshots completed.');
})();
