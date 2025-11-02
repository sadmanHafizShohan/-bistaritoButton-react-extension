// public/background.js

// Function to inject the content script
async function executeContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js'],
    });
    console.log('Content script injected successfully.');
  } catch (e) {
    console.error('Failed to inject content script:', e);
  }
}

// Main handler for the "open_bistaritto" action
async function handleOpenBistarito() {
  // Check if the user is logged in from chrome.storage
  const { isLoggedIn } = await chrome.storage.local.get(['isLoggedIn']);

  if (isLoggedIn) {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      await executeContentScript(tab.id);
    }
  } else {
    // Notify the user that they need to log in
    console.log('User is not logged in. Cannot execute command.');
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png', // Make sure you have this icon
      title: 'Login Required',
      message: 'Please log in to the extension to use this feature.',
    });
  }
}

// Listener for keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  console.log('Command received:', command);
  if (command === 'open_bistaritto') {
    await handleOpenBistarito();
  }
});

// Listener for messages from the popup (React App)
chrome.runtime.onMessage.addListener((request, sender) => {
  // Security check: only accept messages from our own extension
  if (sender.id !== chrome.runtime.id) {
    console.warn('Message received from untrusted sender:', sender);
    return;
  }

  if (request.action === 'open_bistaritto') {
    handleOpenBistarito();
  }

  // Return true to indicate you wish to send a response asynchronously
  return true;
});

// Set default login state when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isLoggedIn: false });
});