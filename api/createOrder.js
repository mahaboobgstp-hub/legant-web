import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdysVRaELP5d5Bd8h6_hktiJaKYywRm2k",
  authDomain: "legant2-3903a.firebaseapp.com",
  projectId: "legant2-3903a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { name, phone, address, items } = req.body;

    await addDoc(collection(db, "orders"), {
      name,
      phone,
      address,
      items,
      status: "Pickup Requested",
      createdAt: new Date()
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
