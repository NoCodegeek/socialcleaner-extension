/**
 * SocialCleaner - Facebook Platform Module
 * Handles unfollowing pages on facebook.com/pages/?category=liked
 *
 * How to add a new action in future:
 * - Add a new exported function (e.g. unfriendAll)
 * - Register it in content.js platformActions map
 */

let _stop = false;
let _totalUnfollowed = 0;

// ── Helpers ────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function sendStatus(message, count) {
  chrome.runtime.sendMessage({
    target: 'popup',
    type: 'STATUS',
    message,
    count: count ?? _totalUnfollowed
  });
}

async function scrollDown() {
  window.scrollBy({ top: 800, behavior: 'smooth' });
  await sleep(2000);
}

async function takeBatchBreak(breakMs) {
  sendStatus(`⏸️ Batch break — loading more pages...`);
  for (let i = 0; i < 3; i++) {
    window.scrollBy({ top: 1000, behavior: 'smooth' });
    await sleep(1000);
  }
  sendStatus(`⏳ Waiting ${breakMs / 1000}s before resuming...`);
  await sleep(breakMs);
  sendStatus(`▶️ Resuming...`);
}

// ── Core unfollow logic ────────────────────────────────────────────────────

async function unfollowVisible(delayMs, batchSize, breakMs) {
  const buttons = document.querySelectorAll('[aria-label="Following"]');

  if (buttons.length === 0) return 0;

  sendStatus(`🔍 Found ${buttons.length} active buttons on screen`);
  let batchCount = 0;

  for (const btn of buttons) {
    if (_stop) return batchCount;

    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await sleep(500);
    btn.click();

    _totalUnfollowed++;
    batchCount++;
    sendStatus(`✅ Unfollowed #${_totalUnfollowed} (batch: ${batchCount}/${batchSize})`);

    // Batch break every N unfollows
    if (batchCount % batchSize === 0) {
      await takeBatchBreak(breakMs);
      batchCount = 0;
    } else {
      await sleep(delayMs);
    }
  }

  return batchCount;
}

// ── Public API (called by content.js) ─────────────────────────────────────

async function run({ delayMs = 1500, batchSize = 30, breakMs = 5000 } = {}) {
  _stop = false;

  sendStatus(`🚀 Starting...`, _totalUnfollowed);

  let noButtonRounds = 0;

  while (true) {
    if (_stop) {
      sendStatus(`⛔ Stopped.`);
      break;
    }

    const buttons = document.querySelectorAll('[aria-label="Following"]');

    if (buttons.length === 0) {
      noButtonRounds++;
      sendStatus(`⏳ No buttons — scrolling... (${noButtonRounds}/5)`);

      if (noButtonRounds >= 5) {
        sendStatus(`🏁 All done!`);
        chrome.runtime.sendMessage({ target: 'popup', type: 'DONE', count: _totalUnfollowed });
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

function stop() {
  _stop = true;
}

function getCount() {
  return _totalUnfollowed;
}

// Validate we are on the correct Facebook page
function isValidPage() {
  return window.location.href.includes('facebook.com/pages') &&
         window.location.href.includes('category=liked');
}

export default { name: 'Facebook', run, stop, getCount, isValidPage };
