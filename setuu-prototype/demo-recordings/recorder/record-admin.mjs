/**
 * Setuu Enterprise — Admin Role Demo Recording
 * Uses Puppeteer Screen Recorder for Full HD MP4 output.
 */

import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '..');
const BASE_URL = 'http://localhost:3000';

const EMAIL = 'admin1@praimo.com';
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
  console.log('🎬 Starting Admin Demo Recording (1080p MP4)...');

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
  
  await recorder.start(path.join(OUTPUT_DIR, 'admin-demo-HD.mp4'));
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
  await visitPage(page, '/admin', 'Admin Command Center', 4000);
  await clickAllTabs(page);

  // ─── PROJECTS ───────────────────────────────────────────────────────
  console.log('\n3️⃣  PROJECTS');
  await visitPage(page, '/admin/projects', 'Projects Tracking Hub', 3000);
  await clickAllTabs(page);

  // ─── NEW PROJECT WIZARD ─────────────────────────────────────────────
  console.log('\n4️⃣  NEW PROJECT WIZARD');
  await visitPage(page, '/admin/projects/new', 'New Project Wizard', 3000);
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
    ['Updates', '/update'], ['New Update', '/update/new'], ['Daily Logs', '/update/daily-logs'],
    ['Handover', '/handover'], ['Retention', '/retention'], ['Custom Fields', '/custom-fields'],
    ['Config', '/config'],
  ];
  for (const [label, suffix] of pp) {
    await visitPage(page, `/admin/projects/${PROJECT_ID}${suffix}`, label);
    await clickAllTabs(page);
  }

  // ─── GLOBAL PAGES ──────────────────────────────────────────────────
  console.log('\n6️⃣  GLOBAL PAGES');
  const gp = [
    ['Calendar', '/admin/calendar'], ['Global Issues', '/admin/issues'],
    ['New Issue', '/admin/issues/new'], ['Global Materials', '/admin/materials'],
    ['Global Resources', '/admin/resources'], ['Resource Analytics', '/admin/resources/analytics'],
    ['Resource Productivity', '/admin/resources/productivity'],
    ['Financials', '/admin/financials'], ['Reports', '/admin/reports'],
    ['Change Requests', '/admin/changes'], ['Handovers', '/admin/handovers'],
    ['Personnel', '/admin/personnel'], ['Lessons Learned', '/admin/lessons'],
    ['Productivity', '/admin/productivity'],
  ];
  for (const [l, u] of gp) { await visitPage(page, u, l); await clickAllTabs(page); }

  // ─── ADMIN-SPECIFIC PAGES ─────────────────────────────────────────
  console.log('\n7️⃣  ADMIN-SPECIFIC PAGES');
  const ap = [
    ['User Management', '/admin/users'], ['Invite User', '/admin/users/invite'],
    ['Roles & Permissions', '/admin/users/roles'],
    ['Vendor Registry', '/admin/vendors'], ['Vendor Performance', '/admin/vendors/performance'],
    ['Client Directory', '/admin/clients'], ['Client Onboarding', '/admin/clients/onboarding'],
    ['Client Approvals', '/admin/clients/approvals'],
    ['Security Dashboard', '/admin/security'], ['Audit Logs', '/admin/security/audit'],
    ['Threat Scanner', '/admin/security/threats'], ['Duplicate Resolver', '/admin/security/duplicates'],
    ['Dropzone Tester', '/admin/security/dropzone'], ['Force Logout', '/admin/security/logout'],
    ['Org Settings', '/admin/settings'],
    ['Broadcasts', '/admin/broadcasts'], ['Moderation', '/admin/moderation'],
    ['Archive', '/admin/archive'], ['System Status', '/admin/status'],
  ];
  for (const [l, u] of ap) { await visitPage(page, u, l); await clickAllTabs(page); }

  // ─── UTILITY PAGES ────────────────────────────────────────────────
  console.log('\n8️⃣  UTILITY PAGES');
  const up = [
    ['Notifications', '/admin/notifications'], ['Profile', '/admin/profile'],
    ['Support Tickets', '/admin/support'], ['Offline Sync', '/admin/sync'],
  ];
  for (const [l, u] of up) { await visitPage(page, u, l); await clickAllTabs(page); }

  // ─── FINAL ────────────────────────────────────────────────────────
  console.log('\n🏁 Final dashboard shot...');
  await visitPage(page, '/admin', 'Final Dashboard', 3500);

  await recorder.stop();
  console.log('\n✅ Saved: demo-recordings/admin-demo-HD.mp4');
  await browser.close();
  console.log('🎬 Admin Demo Complete!\n');
})();
