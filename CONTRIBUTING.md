# Contributing to SocialCleaner

Thanks for contributing! Here's how to add support for a new platform.

---

## Adding a New Platform

### 1. Create the platform file

Create `content/platforms/yourplatform.js`:

```js
/**
 * SocialCleaner - YourPlatform Module
 */

let _stop = false;
let _total = 0;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function sendStatus(message, count) {
  chrome.runtime.sendMessage({
    target: 'popup',
    type: 'STATUS',
    message,
    count: count ?? _total
  });
}

// Must return true when on the correct page for this platform
function isValidPage() {
  return window.location.href.includes('yourplatform.com/correct-path');
}

// Main automation logic
async function run({ delayMs = 1500, batchSize = 30, breakMs = 5000 } = {}) {
  _stop = false;
  // Your unfollow logic here
}

function stop() { _stop = true; }
function getCount() { return _total; }

export default { name: 'YourPlatform', run, stop, getCount, isValidPage };
```

### 2. Register it in content.js

```js
import YourPlatform from './platforms/yourplatform.js';
const platforms = [Facebook, Instagram, Twitter, YourPlatform];
```

### 3. Add a warning hint in popup.js

In the platform detection block, add a hint for your platform's URL.

---

## Standard Platform Interface

Every platform file **must** export:

| Export | Type | Description |
|---|---|---|
| `name` | string | Display name shown in popup |
| `isValidPage()` | function → boolean | Returns true if on correct URL |
| `run(options)` | async function | Main automation logic |
| `stop()` | function | Sets stop flag |
| `getCount()` | function → number | Returns total actions taken |

---

## Pull Request Checklist

- [ ] Platform file follows the standard interface
- [ ] `isValidPage()` is specific enough to avoid false positives
- [ ] `sendStatus()` is called regularly so popup stays updated
- [ ] Batch break logic is included
- [ ] Stop flag is checked in every loop iteration
- [ ] README updated with new platform info
