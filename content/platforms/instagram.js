/**
 * SocialCleaner - Instagram Platform Module
 * 🚧 Placeholder — coming soon!
 *
 * Future features:
 * - Unfollow all accounts
 * - Unfollow accounts that don't follow back
 */

function isValidPage() {
  return window.location.href.includes('instagram.com');
}

async function run(options) {
  console.warn('[SocialCleaner] Instagram support coming soon!');
}

function stop() {}
function getCount() { return 0; }

export default { name: 'Instagram', run, stop, getCount, isValidPage };
