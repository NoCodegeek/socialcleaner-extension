/**
 * SocialCleaner - Content Script
 * All platform logic is bundled here since Chrome content scripts
 * do not support ES module imports.
 *
 * To add a new platform:
 * 1. Add a new platform object in the `platforms` array below
 * 2. Implement: name, isValidPage(), run(options), stop(), getCount()
 */

// ── Shared helpers ─────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function sendStatus(message, count) {
  try {
    chrome.runtime.sendMessage({ target: 'popup', type: 'STATUS', message, count });
  } catch(e) {}
}

function sendDone(count) {
  try {
    chrome.runtime.sendMessage({ target: 'popup', type: 'DONE', count });
  } catch(e) {}
}

// ── Facebook Platform ──────────────────────────────────────────────────────

const Facebook = (() => {
  let _stop = false;
  let _total = 0;

  async function scrollDown() {
    window.scrollBy({ top: 800, behavior: 'smooth' });
    await sleep(2000);
  }

  async function takeBatchBreak(breakMs) {
    sendStatus(`⏸️ Batch break — loading more pages...`, _total);
    for (let i = 0; i < 3; i++) {
      window.scrollBy({ top: 1000, behavior: 'smooth' });
      await sleep(1000);
    }
    sendStatus(`⏳ Waiting ${breakMs / 1000}s before resuming...`, _total);
    await sleep(breakMs);
    sendStatus(`▶️ Resuming...`, _total);
  }

  async function unfollowVisible(delayMs, batchSize, breakMs) {
    const buttons = document.querySelectorAll('[aria-label="Following"]');
    if (buttons.length === 0) return;

    sendStatus(`🔍 Found ${buttons.length} active buttons on screen`, _total);
    let batchCount = 0;

    for (const btn of buttons) {
      if (_stop) return;

      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(500);
      btn.click();
      _total++;
      batchCount++;
      sendStatus(`✅ Unfollowed #${_total} (batch: ${batchCount}/${batchSize})`, _total);

      if (batchCount % batchSize === 0) {
        await takeBatchBreak(breakMs);
        batchCount = 0;
      } else {
        await sleep(delayMs);
      }
    }
  }

  async function run({ delayMs = 1500, batchSize = 30, breakMs = 5000 } = {}) {
    _stop = false;
    sendStatus(`🚀 Starting...`, _total);

    let noButtonRounds = 0;

    while (true) {
      if (_stop) {
        sendStatus(`⛔ Stopped.`, _total);
        break;
      }

      const buttons = document.querySelectorAll('[aria-label="Following"]');

      if (buttons.length === 0) {
        noButtonRounds++;
        sendStatus(`⏳ No buttons — scrolling... (${noButtonRounds}/5)`, _total);
        if (noButtonRounds >= 5) {
          sendStatus(`🏁 All done!`, _total);
          sendDone(_total);
          break;
        }
        await scrollDown();
        continue;
      }

      noButtonRounds = 0;
      await unfollowVisible(delayMs, batchSize, breakMs);
      await scrollDown();
    }
  }

  function stop() { _stop = true; }
  function getCount() { return _total; }
  function isValidPage() {
    return window.location.href.includes('facebook.com/pages') &&
           window.location.href.includes('category=liked');
  }

  return { name: 'Facebook', run, stop, getCount, isValidPage };
})();

// ── Instagram Platform (placeholder) ──────────────────────────────────────

const Instagram = (() => {
  function isValidPage() { return window.location.href.includes('instagram.com'); }
  async function run() { sendStatus('🚧 Instagram support coming soon!'); }
  function stop() {}
  function getCount() { return 0; }
  return { name: 'Instagram', run, stop, getCount, isValidPage };
})();

// ── Twitter/X Platform (placeholder) ──────────────────────────────────────

const Twitter = (() => {
  function isValidPage() {
    return window.location.href.includes('twitter.com') ||
           window.location.href.includes('x.com');
  }
  async function run() { sendStatus('🚧 Twitter/X support coming soon!'); }
  function stop() {}
  function getCount() { return 0; }
  return { name: 'Twitter/X', run, stop, getCount, isValidPage };
})();

// ── Platform registry ──────────────────────────────────────────────────────

const platforms = [Facebook, Instagram, Twitter];

function detectPlatform() {
  return platforms.find(p => p.isValidPage()) || null;
}

// ── Message listener ───────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== 'content') return;

  const platform = detectPlatform();

  switch (message.type) {

    case 'DETECT':
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
