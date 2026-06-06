# ⚡ SocialCleaner

## 🌪️ The Feed That Wouldn't End

Ah yes. 2010.

A simpler time. You were young, optimistic, and absolutely thrilled to like that pizza brand's Facebook page in exchange for a 10% coupon you never used. You followed a motivational quotes page. Then another. Then a celebrity fan page for someone who is now, somehow, a podcaster. Then a local gym you went to twice.

Fast forward to today. Your Facebook feed is an archaeological dig of your past questionable decisions — sponsored posts sandwiched between pages that haven't uploaded since the Obama administration, and a "Daily Inspiration" account that posts the same sunset JPEG every 72 hours.

You decided to clean it up manually. Brave. Noble, even.

Click. Unfollow. Scroll. Click. Unfollow. Scroll. Forty pages down. Four hundred and sixty to go.

You considered just deleting your account. Starting fresh. Faking your own death online.

But then — **SocialCleaner**.

A humble little Chrome extension that does the digital equivalent of hiring someone to clean out your attic while you sit downstairs pretending it isn't happening. It scrolls. It unfollows. It takes polite little breaks so Facebook doesn't get suspicious. It doesn't judge you for following "Minion Memes Official" in 2015. It just quietly, efficiently fixes it.

No drama. No therapy required. Just you, your browser, and an extension doing the work you've been putting off since the fourth season of Game of Thrones.

**SocialCleaner ⚡ — because someone had to.**

*Instagram and Twitter/X support coming soon, for those of you with more bad decisions to undo.*

---

![Version](https://img.shields.io/badge/version-1.0.1-green)
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
│   ├── content.js             # Platform detector & all platform logic
│   └── platforms/
│       ├── facebook.js        # ✅ Facebook (reference copy)
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
