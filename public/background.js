// public/background.js

// content.js ফাইলটিকে ইনজেক্ট করার জন্য একটি ফাংশন
async function executeContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
    console.log("Content script injected successfully.");
  } catch (e) {
    console.error("Failed to inject content script:", e);
  }
}

// কীবোর্ড শর্টকাট থেকে কমান্ড শোনার জন্য লিসেনার
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'open_bistaritto') {
    // ব্যবহারকারী লগইন করা আছে কিনা তা chrome.storage থেকে চেক করা
    const result = await chrome.storage.local.get(['isLoggedIn']);
    if (result.isLoggedIn) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        await executeContentScript(tab.id);
      }
    } else {
      console.log("User is not logged in. Cannot execute command.");
      // প্রয়োজনে ব্যবহারকারীকে একটি নোটিফিকেশন দেখানো যেতে পারে
    }
  }
});

// পপআপ (React App) থেকে মেসেজ শোনার জন্য লিসেনার
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'open_bistaritto') {
    const result = await chrome.storage.local.get(['isLoggedIn']);
    if (result.isLoggedIn) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        await executeContentScript(tab.id);
      }
    }
  }
  // Asynchronous response এর জন্য true রিটার্ন করা ভালো অভ্যাস
  return true;
});

// এক্সটেনশন ইনস্টল বা আপডেট হওয়ার সময় ডিফল্ট লগইন অবস্থা সেট করা
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isLoggedIn: false });
});