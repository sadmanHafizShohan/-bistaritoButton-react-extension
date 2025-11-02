// public/content.js

(function () {
  'use strict';

  // Function to check if an element is visible
  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return (
      el.offsetParent !== null &&
      style.visibility !== 'hidden' &&
      parseFloat(style.opacity) > 0
    );
  }

  // Function to wait for a specific time
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Main function to find and open all "details" buttons
  async function openAllDetails() {
    console.log("[Bistarito Ext] Searching for 'bistarito' buttons...");

    // This selector is very specific and might break if the website changes.
    // For future improvement, this could be a user-configurable setting.
    const spans = Array.from(document.querySelectorAll('span.text-white.text-13'))
      .filter(el => el.textContent.trim() === 'বিস্তারিত' && isVisible(el));

    if (spans.length === 0) {
      // UX improvement: Instead of an alert, a more subtle notification could be shown.
      alert('❌ কোনো দৃশ্যমান "বিস্তারিত" বাটন খুঁজে পাওয়া যায়নি।');
      return;
    }

    // UX improvement: Instead of a confirm, a custom modal could be used.
    const confirmOpen = confirm(`✅ ${spans.length} টি দৃশ্যমান "বিস্তারিত" বাটন পাওয়া গেছে। সবগুলো নতুন ট্যাবে খুলতে চান?`);
    if (!confirmOpen) {
      return;
    }

    let openedCount = 0;
    for (const span of spans) {
      try {
        const clickableParent = span.closest('a, button');

        if (clickableParent && isVisible(clickableParent)) {
          if (clickableParent.tagName === 'A' && clickableParent.href) {
            const newTab = window.open(clickableParent.href, '_blank');
            if (!newTab) {
              alert('⚠️ আপনার ব্রাউজারের Popup Blocker নতুন ট্যাব খুলতে বাধা দিচ্ছে। অনুগ্রহ করে এই সাইটের জন্য Popup Allow করে আবার চেষ্টা করুন।');
              return; // Stop if popup blocker is active
            }
            openedCount++;
          } else {
            clickableParent.click();
            openedCount++;
          }
        } else {
          // Fallback to clicking the span itself
          span.click();
          openedCount++;
        }
        // This fixed delay is not very reliable. A better approach would be to
        // wait for a specific event or element on the new page.
        await wait(500); // Pause between each click
      } catch (error) {
        console.error('[Bistarito Ext] Error opening a "details" button:', error);
      }
    }

    if (openedCount > 0) {
      alert(`🎯 মোট ${openedCount} টি "বিস্তারিত" ট্যাব খোলার চেষ্টা করা হয়েছে।`);
    }
  }

  // The script is injected on demand, so we can run the function directly.
  openAllDetails();
})();