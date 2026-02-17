#!/usr/bin/env node
/**
 * screenshot_game.mjs — Headless screenshot of the game's OfficeScene
 *
 * Usage: node scripts/screenshot_game.mjs [output_path]
 *
 * Launches Chrome, navigates to the running dev server, waits for boot,
 * jumps directly to OfficeScene, waits for rendering, takes a screenshot.
 */

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const OUTPUT = process.argv[2] || 'screenshots/office_scene.png';
const GAME_URL = 'http://localhost:5173/scammer/';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    args: [
      '--window-size=1280,720',
      '--disable-gpu',
      '--no-sandbox',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  // Set a fake API key so the game doesn't block us
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('scammer_sim_openai_api_key', 'sk-fake-for-screenshot');
  });

  // Expose the Phaser game instance globally when it's created
  await page.evaluateOnNewDocument(() => {
    // Intercept Phaser.Game constructor to capture the instance
    const origDefineProperty = Object.defineProperty;
    let captured = false;
    const observer = new MutationObserver(() => {
      if (!captured && window.Phaser && window.Phaser.GAMES && window.Phaser.GAMES.length > 0) {
        window.__PHASER_GAME__ = window.Phaser.GAMES[0];
        captured = true;
        observer.disconnect();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  });

  console.log('Navigating to game...');
  await page.goto(GAME_URL, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for Phaser to be ready and canvas to exist
  console.log('Waiting for Phaser boot...');
  await page.waitForSelector('canvas', { timeout: 15000 });

  // Wait for boot to finish and menu to appear
  await new Promise(r => setTimeout(r, 5000));

  // Get the game instance and jump to office
  console.log('Jumping to OfficeScene...');
  const jumped = await page.evaluate(() => {
    const game = window.__PHASER_GAME__ ||
      (window.Phaser && window.Phaser.GAMES && window.Phaser.GAMES[0]);
    if (!game) return 'no game instance';

    // Stop all running scenes and start office directly
    const sm = game.scene;
    sm.getScenes(true).forEach(s => {
      if (s.scene.key !== 'office') sm.stop(s.scene.key);
    });
    sm.start('office', { level: 1 });
    return 'ok';
  });
  console.log('Jump result:', jumped);

  // Wait for office scene to fully render (assets, animations, etc.)
  await new Promise(r => setTimeout(r, 3000));

  // Ensure output directory exists
  const dir = path.dirname(OUTPUT);
  fs.mkdirSync(dir, { recursive: true });

  // Take screenshot of just the canvas element for clean capture
  const canvas = await page.$('canvas');
  if (canvas) {
    console.log(`Taking canvas screenshot -> ${OUTPUT}`);
    await canvas.screenshot({ path: OUTPUT, type: 'png' });
  } else {
    console.log(`Taking full page screenshot -> ${OUTPUT}`);
    await page.screenshot({ path: OUTPUT, type: 'png' });
  }

  await browser.close();
  console.log('Done!');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
