import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCR2Bbg35WB7n7rZxOvsO_KiUciD5MzRVc",
  authDomain: "spec-9233a.firebaseapp.com",
  projectId: "spec-9233a",
  storageBucket: "spec-9233a.firebasestorage.app",
  messagingSenderId: "219410789434",
  appId: "1:219410789434:web:2d3709a9e3ceecf2a8f103"
};

// Initialize Firebase App only if it doesn't exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Export app for other files that need it
export { app };
export default app;
