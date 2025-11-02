// public/content.js

(function () {
  'use strict';

  // একটি উপাদান দৃশ্যমান কিনা তা পরীক্ষা করার ফাংশন
  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return (
      el.offsetParent !== null &&
      style.visibility !== 'hidden' &&
      parseFloat(style.opacity) > 0
    );
  }

  // অপেক্ষা করার ফাংশন
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // মূল ফাংশন
  async function openAllDetails() {
    console.log('[Bistarito Ext] বিস্তারিত বাটন খোঁজা হচ্ছে...');

    const spans = Array.from(document.querySelectorAll('span.text-white.text-13'))
      .filter(el => el.textContent.trim() === 'বিস্তারিত' && isVisible(el));

    if (spans.length === 0) {
      alert('❌ কোনো দৃশ্যমান "বিস্তারিত" বাটন খুঁজে পাওয়া যায়নি।');
      return;
    }

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
              return;
            }
            openedCount++;
          } else {
            clickableParent.click();
            openedCount++;
          }
        } else {
          span.click();
          openedCount++;
        }
        await wait(500); // প্রতিটি ক্লিকের মাঝে বিরতি
      } catch (error) {
        console.error('[Bistarito Ext] একটি "বিস্তারিত" বাটন খুলতে সমস্যা হয়েছে:', error);
      }
    }

    if (openedCount > 0) {
      alert(`🎯 মোট ${openedCount} টি "বিস্তারিত" ট্যাব খোলার চেষ্টা করা হয়েছে।`);
    }
  }

  // যেহেতু content.js শুধুমাত্র বাটন ক্লিকের মাধ্যমে ইনজেক্ট হচ্ছে,
  // তাই MutationObserver এর প্রয়োজন নেই। সরাসরি ফাংশনটি চালানো হবে।
  openAllDetails();
})();