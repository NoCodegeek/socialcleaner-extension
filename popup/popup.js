/**
 * SocialCleaner - Popup Controller
 * Manages UI state and communicates with the content script via background.js
 */

// ── DOM refs ───────────────────────────────────────────────────────────────
const counter      = document.getElementById('counter');
const statusEl     = document.getElementById('status');
const warning      = document.getElementById('warning');
const warningText  = document.getElementById('warning-text');
const platformBadge = document.getElementById('platform-badge');
const platformName  = document.getElementById('platform-name');
const btnStart     = document.getElementById('btn-start');
const btnStop      = document.getElementById('btn-stop');
const btnResume    = document.getElementById('btn-resume');
const inputDelay   = document.getElementById('delay');
const inputBatch   = document.getElementById('batch');
const inputBreak   = document.getElementById('break');

// ── State ──────────────────────────────────────────────────────────────────
let isRunning = false;
let isStopped = false;

// ── Helpers ────────────────────────────────────────────────────────────────
function setStatus(msg) {
  statusEl.textContent = msg;
}

function setCounter(n) {
  counter.textContent = n;
}

function showWarning(msg) {
  warningText.textContent = msg;
  warning.classList.remove('hidden');
  platformBadge.classList.add('hidden');
  btnStart.disabled = true;
}

function showReady(name) {
  warning.classList.add('hidden');
  platformName.textContent = name;
  platformBadge.classList.remove('hidden');
  btnStart.disabled = false;
  setStatus('Ready. Press Start.');
}

function setRunningState() {
  isRunning = true;
  isStopped = false;
  btnStart.classList.add('hidden');
  btnResume.classList.add('hidden');
  btnStop.classList.remove('hidden');
  // Lock settings while running
  inputDelay.disabled = true;
  inputBatch.disabled = true;
  inputBreak.disabled = true;
}

function setStoppedState() {
  isRunning = false;
  isStopped = true;
  btnStop.classList.add('hidden');
  btnStart.classList.add('hidden');
  btnResume.classList.remove('hidden');
  inputDelay.disabled = false;
  inputBatch.disabled = false;
  inputBreak.disabled = false;
}

function setDoneState() {
  isRunning = false;
  isStopped = false;
  btnStop.classList.add('hidden');
  btnResume.classList.add('hidden');
  btnStart.classList.remove('hidden');
  inputDelay.disabled = false;
  inputBatch.disabled = false;
  inputBreak.disabled = false;
}

function getOptions() {
  return {
    delayMs: parseInt(inputDelay.value) || 1500,
    batchSize: parseInt(inputBatch.value) || 30,
    breakMs: parseInt(inputBreak.value) || 5000
  };
}

// ── Send message to content script ────────────────────────────────────────
function sendToContent(type, extra = {}) {
  chrome.runtime.sendMessage({ target: 'content', type, ...extra });
}

// ── Platform detection on popup open ──────────────────────────────────────
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs[0]) {
    showWarning('No active tab found.');
    return;
  }

  chrome.tabs.sendMessage(tabs[0].id, { target: 'content', type: 'DETECT' }, (response) => {
    if (chrome.runtime.lastError || !response) {
      showWarning('SocialCleaner is not active on this page. Navigate to a supported page.');
      return;
    }

    if (!response.detected) {
      // Give a specific hint based on URL
      const url = tabs[0].url || '';
      if (url.includes('facebook.com')) {
        showWarning('Go to: facebook.com/pages/?category=liked&ref=bookmarks');
      } else if (url.includes('instagram.com')) {
        showWarning('Instagram support coming soon!');
      } else if (url.includes('twitter.com') || url.includes('x.com')) {
        showWarning('Twitter/X support coming soon!');
      } else {
        showWarning('Navigate to a supported social media page.');
      }
      return;
    }

    showReady(response.platformName);
  });
});

// ── Button handlers ────────────────────────────────────────────────────────
btnStart.addEventListener('click', () => {
  setRunningState();
  setStatus('🚀 Starting...');
  sendToContent('START', { options: getOptions() });
});

btnStop.addEventListener('click', () => {
  setStoppedState();
  setStatus('⛔ Stopping after current action...');
  sendToContent('STOP');
});

btnResume.addEventListener('click', () => {
  setRunningState();
  setStatus('▶️ Resuming...');
  sendToContent('START', { options: getOptions() });
});

// ── Listen for updates from content script ─────────────────────────────────
chrome.runtime.onMessage.addListener((message) => {
  if (message.target !== 'popup') return;

  if (message.type === 'STATUS') {
    setStatus(message.message);
    if (message.count !== undefined) setCounter(message.count);
  }

  if (message.type === 'DONE') {
    setCounter(message.count);
    setStatus(`🏁 All done! ${message.count} pages unfollowed.`);
    setDoneState();
  }
});
