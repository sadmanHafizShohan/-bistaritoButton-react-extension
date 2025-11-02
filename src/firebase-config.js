// src/firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCHLFIitVXkdBN72LgkTFn09J3H3ZZSmV4", // আপনার API Key
    authDomain: "bistarito-ext-auth.firebaseapp.com",
    projectId: "bistarito-ext-auth",
    storageBucket: "bistarito-ext-auth.firebasestorage.app",
    messagingSenderId: "798616228433",
    appId: "1:798616228433:web:45c662ad6852e27b959e70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // <-- Firestore চালু করা হলো

export { auth, db }; // <-- db-কে এক্সপোর্ট করা