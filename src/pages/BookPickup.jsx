import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function BookPickup() {
  const [name, setName] = useState("");
  const [items, setItems] = useState(0);
  const navigate = useNavigate();

  const submitOrder = async () => {
    await addDoc(collection(db, "orders"), {
      name,
      items,
      status: "Pickup Scheduled",
      createdAt: new Date()
    });

    navigate("/summary");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Book Pickup</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Number of Clothes"
        onChange={(e) => setItems(e.target.value)}
      />

      <button onClick={submitOrder}>
        Confirm Pickup
      </button>
    </div>
  );
}
