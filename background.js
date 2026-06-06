/**
 * SocialCleaner - Background Service Worker
 * Handles message routing between popup and content scripts.
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Forward messages from popup to the active tab's content script
  if (message.target === 'content') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          sendResponse(response);
        });
      }
    });
    return true; // Keep channel open for async response
  }

  // Forward messages from content script to popup
  if (message.target === 'popup') {
    chrome.runtime.sendMessage(message);
  }
});
