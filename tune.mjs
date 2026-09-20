import { chromium } from 'playwright';
import fs from 'fs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 700 } });

const CANDIDATES = {
  'current': 'linear-gradient(100deg, rgba(36,27,51,0.86) 20%, rgba(63,42,134,0.55) 60%, rgba(36,27,51,0.25))',
  'A': 'linear-gradient(100deg, rgba(36,27,51,0.93) 0%, rgba(36,27,51,0.84) 45%, rgba(63,42,134,0.70) 75%, rgba(36,27,51,0.55) 100%)',
  'B': 'linear-gradient(100deg, rgba(36,27,51,0.95) 0%, rgba(36,27,51,0.88) 50%, rgba(63,42,134,0.76) 78%, rgba(36,27,51,0.62) 100%)',
  'C': 'linear-gradient(100deg, rgba(36,27,51,0.90) 0%, rgba(36,27,51,0.80) 50%, rgba(63,42,134,0.64) 80%, rgba(36,27,51,0.42) 100%)',
};

for (const centre of ['cherthala']) {
  await p.goto(`http://localhost:3150/hospitals/${centre}`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1800);
  for (const [name, grad] of Object.entries(CANDIDATES)) {
    await p.evaluate((g) => {
      let s = document.getElementById('tune'); if (!s) { s = document.createElement('style'); s.id='tune'; document.head.appendChild(s); }
      s.textContent = `.hosp-hero::before{ background: ${g} !important; }`;
      document.querySelector('.hosp-hero-content').style.visibility = 'hidden';
    }, grad);
    await p.waitForTimeout(250);
    const box = await p.evaluate(() => { const r = document.querySelector('.hosp-hero-content').getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) }; });
    await p.screenshot({ path: `/tmp/t-${name}.png`, clip: box });
  }
}
await b.close(); console.log('captured');
