import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 700 } });
await p.goto('http://localhost:3150/hospitals/cherthala', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1800);
// hide the text, so we sample the background it sits on
await p.evaluate(() => { document.querySelector('.hosp-hero-content').style.visibility = 'hidden'; });
await p.waitForTimeout(300);
const box = await p.evaluate(() => {
  const r = document.querySelector('.hosp-hero-content').getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
});
const buf = await p.screenshot({ clip: box });
const { createCanvas, loadImage } = await import('canvas').catch(() => ({}));
await p.screenshot({ path: '/tmp/hero-bg.png', clip: box });
console.log('sampled region', box);
await b.close();
