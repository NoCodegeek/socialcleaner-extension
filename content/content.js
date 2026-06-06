/**
 * SocialCleaner - Content Script
 * Detects the current platform and routes commands to the right module.
 *
 * Adding a new platform:
 * 1. Create content/platforms/yourplatform.js
 * 2. Import it here
 * 3. Add it to the `platforms` array
 */

import Facebook from './platforms/facebook.js';
import Instagram from './platforms/instagram.js';
import Twitter from './platforms/twitter.js';

// ── Platform registry ──────────────────────────────────────────────────────
const platforms = [Facebook, Instagram, Twitter];

// Detect which platform we're on
function detectPlatform() {
  return platforms.find(p => p.isValidPage()) || null;
}

// ── Message handler from popup ─────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== 'content') return;

  const platform = detectPlatform();

  switch (message.type) {

    case 'DETECT':
      // Tell popup which platform (if any) is detected
      sendResponse({
        detected: !!platform,
        platformName: platform?.name || null
      });
      break;

    case 'START':
      if (!platform) {
        sendResponse({ error: 'No supported platform detected.' });
        return;
      }
      platform.run(message.options);
      sendResponse({ ok: true });
      break;

    case 'STOP':
      if (platform) platform.stop();
      sendResponse({ ok: true });
      break;

    case 'GET_COUNT':
      sendResponse({ count: platform?.getCount() || 0 });
      break;
  }

  return true;
});
