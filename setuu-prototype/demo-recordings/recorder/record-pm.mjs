/**
 * Setuu Enterprise — PM Role Demo Recording
 * Uses Puppeteer Screen Recorder for Full HD MP4 output.
 */

import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '..');
const BASE_URL = 'http://localhost:3000';

const EMAIL = 'pm0@praimo.com';
const PASSWORD = 'password123';
const PROJECT_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000000'; // Force project ID so we don't miss project pages

async function slowScroll(page, duration = 3000) {
  await page.evaluate(async (dur) => {
    const distance = document.body.scrollHeight;
    const step = Math.max(distance / (dur / 50), 10);
    let scrolled = 0;
    await new Promise((resolve) => {
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        scrolled += step;
        if (scrolled >= distance) { clearInterval(timer); resolve(); }
      }, 50);
    });
  }, duration);
}

async function visitPage(page, url, label, waitMs = 3500) {
  console.log(`  📄 ${label} → ${url}`);
  try {
    await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle2', timeout: 15000 });
  } catch { console.log(`    ⚠️  Timeout on ${url}, continuing...`); }
  await new Promise(r => setTimeout(r, waitMs));
  await slowScroll(page, 1500);
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 800));
}

async function clickButtonByText(page, text, waitMs = 1500) {
  try {
    const clicked = await page.evaluate((txt) => {
      const buttons = [...document.querySelectorAll('button, a, [role="button"], [role="tab"]')];
      const match = buttons.find(b => b.textContent?.trim().toLowerCase().includes(txt.toLowerCase()));
      if (match) { match.click(); return true; }
      return false;
    }, text);
    if (clicked) { console.log(`    🖱️  Clicked: "${text}"`); await new Promise(r => setTimeout(r, waitMs)); }
  } catch { /* ignore */ }
}

async function clickAllTabs(page, waitMs = 1200) {
  try {
    const tabTexts = await page.evaluate(() => {
      const tabs = [...document.querySelectorAll('[role="tab"], button[class*="tab"], button.border-b-2')];
      return tabs.map(t => t.textContent?.trim()).filter(Boolean);
    });
    for (const tabText of tabTexts) {
      await clickButtonByText(page, tabText, waitMs);
      await slowScroll(page, 800);
      await page.evaluate(() => window.scrollTo(0, 0));
    }
  } catch { /* ignore */ }
}

(async () => {
  console.log('🎬 Starting PM Demo Recording (1080p MP4)...');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--window-size=1920,1080', '--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const recorder = new PuppeteerScreenRecorder(page, {
    fps: 30,
    videoFrame: { width: 1920, height: 1080 },
    aspectRatio: '16:9',
  });
  
  await recorder.start(path.join(OUTPUT_DIR, 'pm-demo-HD.mp4'));
  console.log('🔴 Recording started\n');

  // ─── LOGIN ──────────────────────────────────────────────────────────
  console.log('1️⃣  LOGIN FLOW');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.click('input[type="email"]');
  await page.type('input[type="email"]', EMAIL, { delay: 50 });
  await new Promise(r => setTimeout(r, 300));
  await page.click('input[type="password"]');
  await page.type('input[type="password"]', PASSWORD, { delay: 50 });
  await new Promise(r => setTimeout(r, 300));
  await page.click('button[type="submit"]');
  console.log('  ✅ Submitted login form');
  await new Promise(r => setTimeout(r, 6000));

  // ─── COMMAND CENTER ─────────────────────────────────────────────────
  console.log('\n2️⃣  COMMAND CENTER');
  await visitPage(page, '/pm', 'PM Command Center', 4000);
  await clickAllTabs(page);

  // ─── PROJECTS ───────────────────────────────────────────────────────
  console.log('\n3️⃣  PROJECTS');
  await visitPage(page, '/pm/projects', 'Projects Tracking Hub', 3000);

  // ─── NEW PROJECT WIZARD ─────────────────────────────────────────────
  console.log('\n4️⃣  NEW PROJECT WIZARD');
  await visitPage(page, '/pm/projects/new', 'New Project Wizard', 3000);
  await clickAllTabs(page);

  // ─── PROJECT DETAIL PAGES ───────────────────────────────────────────
  console.log(`\n5️⃣  PROJECT DETAIL PAGES (${PROJECT_ID})`);
  const pp = [
    ['Dashboard', ''], ['Timeline', '/timeline'], ['Milestones', '/milestones'],
    ['Materials', '/materials'], ['Material Receipt', '/materials/receipt'],
    ['Drawings', '/drawings'], ['Issues', '/issues'], ['New Issue', '/issues/new'],
    ['Team', '/team'], ['Resources', '/resources'], ['Collaboration', '/collaboration'],
    ['Changes', '/changes'], ['New Change', '/changes/new'], ['Flags', '/flags'],
    ['Requirements', '/requirements'], ['Muster', '/muster'],
    ['Updates', '/update'], ['Handover', '/handover'], ['Config', '/config'],
  ];
  for (const [label, suffix] of pp) {
    await visitPage(page, `/pm/projects/${PROJECT_ID}${suffix}`, label);
    await clickAllTabs(page);
  }

  // ─── GLOBAL PAGES ──────────────────────────────────────────────────
  console.log('\n6️⃣  GLOBAL PAGES');
  const gp = [
    ['Calendar', '/pm/calendar'], ['Global Issues', '/pm/issues'],
    ['New Issue', '/pm/issues/new'], ['Global Milestones', '/pm/milestones'],
    ['Global Materials', '/pm/materials'], ['Global Resources', '/pm/resources'],
    ['Resource Analytics', '/pm/resources/analytics'],
    ['Resource Productivity', '/pm/resources/productivity'],
    ['Financials', '/pm/financials'], ['Reports', '/pm/reports'],
    ['Change Requests', '/pm/changes'], ['Handovers', '/pm/handovers'],
    ['Personnel', '/pm/personnel'], ['Lessons Learned', '/pm/lessons'],
    ['Productivity', '/pm/productivity'],
  ];
  for (const [l, u] of gp) { await visitPage(page, u, l); await clickAllTabs(page); }

  // ─── UTILITY PAGES ────────────────────────────────────────────────
  console.log('\n7️⃣  UTILITY PAGES');
  const up = [
    ['Notifications', '/pm/notifications'], ['Profile', '/pm/profile'],
    ['Support Tickets', '/pm/support'], ['Offline Sync', '/pm/sync'],
    ['More Menu', '/pm/more'],
  ];
  for (const [l, u] of up) { await visitPage(page, u, l); await clickAllTabs(page); }

  // ─── FINAL ────────────────────────────────────────────────────────
  console.log('\n🏁 Final dashboard shot...');
  await visitPage(page, '/pm', 'Final Dashboard', 3500);

  await recorder.stop();
  console.log('\n✅ Saved: demo-recordings/pm-demo-HD.mp4');
  await browser.close();
  console.log('🎬 PM Demo Complete!\n');
})();
