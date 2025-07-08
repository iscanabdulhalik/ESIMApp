import { initializeApp, getApps } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import functions from "@react-native-firebase/functions";

// Firebase config from .env
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.FIREBASE_AUTH_DOMAIN || "datagoesim-fa033.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "datagoesim-fa033",
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET || "datagoesim-fa033.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "838330201778",
  appId: process.env.FIREBASE_APP_ID || "demo-app-id",
};

// Initialize Firebase if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Export Firebase services
export { auth, firestore, functions };
export default app;
