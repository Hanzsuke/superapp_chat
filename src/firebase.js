// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; //

const firebaseConfig = {
  apiKey: "AIzaSyDzYE52CdEUXCuLBS5c9ueLWoELzXRxirI",
  authDomain: "superapp-9e85d.firebaseapp.com",
  projectId: "superapp-9e85d",
  storageBucket: "superapp-9e85d.firebasestorage.app",
  messagingSenderId: "1093548671779",
  appId: "1:1093548671779:web:0e5f25d0c251bbd9ed0296"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // 