import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdysVRaELP5d5Bd8h6_hktiJaKYywRm2k",
  authDomain: "legant2-3903a.firebaseapp.com",
  projectId: "legant2-3903a",
  storageBucket: "legant2-3903a.firebasestorage.app",
  messagingSenderId: "561245016518",
  appId: "1:561245016518:web:c4f3fa31f27221158122c7"
};

const app = initializeApp(firebaseConfig);

// ✅ THESE ARE REQUIRED
export const db = getFirestore(app);
export const storage = getStorage(app);
