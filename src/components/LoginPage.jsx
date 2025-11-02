// src/components/LoginPage.jsx

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

const getDeviceId = async () => {
  let { deviceId } = await chrome.storage.local.get('deviceId');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    await chrome.storage.local.set({ deviceId });
  }
  return deviceId;
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const deviceId = await getDeviceId();
      const sessionRef = doc(db, 'active_sessions', user.uid);

      await setDoc(sessionRef, {
        deviceId: deviceId,
        loginTimestamp: new Date(),
      });

    } catch (err) {
      if (err.code === 'permission-denied') {
        setError('This account is already active on another device.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Incorrect email or password.');
      } else {
        setError('An unexpected error occurred.');
      }
      console.error("Login failed:", err);
      if (auth.currentUser) {
        await auth.signOut();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">সব বিস্তারিত বাটন একসাথে খুলবে 🫠</h1>
        <p className="auth-subtitle">Please log in to continue 👀</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder='contact for email and password'
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder='contact info given below'
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="footer-info">
        <p>For single device use only.</p>
        <p>
          Sadman Hafiz Shohan | snrshohan21@gmail.com | 01709613535(whatsapp only)
        </p>
      </div>
    </div>
  );
};

export default LoginPage;