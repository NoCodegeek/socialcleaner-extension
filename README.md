# ⚡ SocialCleaner

> Automate unfollowing pages and accounts across Facebook, Instagram, and Twitter/X.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Chrome-yellow)

---

## ✨ Features

- ✅ **Facebook** — Unfollow all liked pages automatically
- 🚧 **Instagram** — Coming soon
- 🚧 **Twitter/X** — Coming soon
- ⏸️ Start, Stop, and Resume anytime
- 🔄 Auto batch breaks to avoid rate limiting
- ⚠️ Page detection — warns if you're on the wrong URL
- 🎛️ Configurable speed, batch size, and break duration

---

## ⚠️ Disclaimer

This extension automates actions on social media platforms. Use it responsibly.
Excessive automation may violate the Terms of Service of Facebook, Instagram, or Twitter/X
and could result in temporary restrictions on your account.

**Use at your own risk.**

---

## 🚀 Installation (Chrome)

> Not yet on the Chrome Web Store. Install manually:

1. Download or clone this repository:
   ```bash
   git clone https://github.com/NoCodegeek/socialcleaner-extension.git
   ```
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the `socialcleaner-extension` folder
6. The ⚡ SocialCleaner icon will appear in your toolbar

---

## 📖 Usage

### Facebook — Unfollow Liked Pages

1. Go to:
   ```
   https://www.facebook.com/pages/?category=liked&ref=bookmarks
   ```
2. Click **Sort** → **Earliest liked first**
3. Click the ⚡ SocialCleaner icon in your Chrome toolbar
4. Adjust settings if needed (speed, batch size, break duration)
5. Click **Start**
6. Let it run — it will auto-scroll and unfollow all active pages

---

## ⚙️ Settings

| Setting | Default | Description |
|---|---|---|
| Speed (ms) | 1500 | Delay between each unfollow |
| Batch size | 30 | Unfollows before taking a break |
| Break (ms) | 5000 | How long to pause between batches |

---

## 🛠️ Controls

| Button | Action |
|---|---|
| **Start** | Begin unfollowing |
| **Stop** | Pause after current action |
| **Resume** | Continue from where stopped |

---

## 🗂️ Project Structure

```
socialcleaner-extension/
├── manifest.json              # Extension config
├── background.js              # Message routing
├── popup/
│   ├── popup.html             # Extension UI
│   ├── popup.css              # Styles
│   └── popup.js               # UI logic
├── content/
│   ├── content.js             # Platform detector & router
│   └── platforms/
│       ├── facebook.js        # ✅ Facebook logic
│       ├── instagram.js       # 🚧 Placeholder
│       └── twitter.js         # 🚧 Placeholder
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add new platform support.

---

## 📄 License

MIT © [NoCodeGeek](https://github.com/NoCodegeek)
