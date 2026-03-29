import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBnqeAvsQcYhnu5JDw8B1Qz_8_AMzQp-oU",
  authDomain: "legant-ac98f.firebaseapp.com",
  projectId: "legant-ac98f",
  storageBucket: "legant-ac98f.firebasestorage.app",
  messagingSenderId: "722038074359",
  appId: "1:722038074359:web:bb4786c1a11644e14d9cf2"
};

const app = initializeApp(firebaseConfig);

// ✅ THESE TWO ARE VERY IMPORTANT
export const db = getFirestore(app);
export const storage = getStorage(app);
