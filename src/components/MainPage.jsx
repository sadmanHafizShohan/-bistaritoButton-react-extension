// src/components/MainPage.jsx

import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';

const MainPage = () => {
  const handleOpenBistarito = () => {
    // background.js কে মেসেজ পাঠানো হচ্ছে
    chrome.runtime.sendMessage({ action: "open_bistaritto" });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="main-container">
      <h3>Welcome</h3>
      <p>
        নিচের বাটনে চাপলে সব খুলে যাবে 🥴
      </p>
      <button onClick={handleOpenBistarito} className="open-btn">
        🚀 Open All Buttons
      </button>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default MainPage;