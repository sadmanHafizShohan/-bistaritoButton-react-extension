// src/App.jsx

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import './App.css'; // স্টাইলিং এর জন্য

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ব্যবহারকারীর লগইন অবস্থা পর্যবেক্ষণ করা হচ্ছে
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // chrome.storage এ লগইন অবস্থা সেভ করা
      chrome.storage.local.set({ isLoggedIn: !!currentUser });
    });

    // কম্পোনেন্ট আনমাউন্ট হলে listener টি বন্ধ করা হবে
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loader">Loading...</div>; // ডেটা লোড হওয়ার সময় লোডার দেখানো
  }

  return (
    <div className="App">
      {user ? <MainPage /> : <LoginPage />}
    </div>
  );
}

export default App;