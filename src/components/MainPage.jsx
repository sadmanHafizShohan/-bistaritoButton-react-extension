// src/components/MainPage.jsx

import React from 'react';
import { signOut } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

  const MainPage = ({ user }) => {
    const username = user.email ? user.email.split('@')[0] : 'User';

    const handleOpenBistarito = () => {    chrome.runtime.sendMessage({ action: "open_bistaritto" });
  };

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const sessionRef = doc(db, 'active_sessions', user.uid);
        await deleteDoc(sessionRef);
      }
    } catch (error) {
      console.error("Failed to delete session on logout:", error);
    } finally {
      await signOut(auth);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="main-title">Welcome, Mr. {username}🥳</h1>
        <p className="main-subtitle">Press CTRL+SHIFT+H Or click the button</p>
        <button onClick={handleOpenBistarito} className="main-action-button">
          🚀 Open All
        </button>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div className="footer-info">
        <p>if you have any issue contact me.</p>
        <p>
          Sadman Hafiz Shohan | snrshohan21@gmail.com | 01709613535(whatsapp only)
        </p>
      </div>
    </div>
  );
};

export default MainPage;