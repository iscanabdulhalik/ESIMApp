// src/config/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config - .env dosyasından alınıyor
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.FIREBASE_AUTH_DOMAIN || "datagoesim-fa033.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "datagoesim-fa033",
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET || "datagoesim-fa033.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "demo-app-id",
};

// Firebase'i initialize et
const app = initializeApp(firebaseConfig);

// Auth'u AsyncStorage persistence ile initialize et
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // Eğer auth zaten initialize edilmişse, mevcut instance'ı kullan
  auth = getAuth(app);
}

// Firestore'u initialize et
const firestore = getFirestore(app);

// Functions'ı initialize et
const functions = getFunctions(app);

export { auth, firestore, functions };
export default app;
