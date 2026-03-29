import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import PhotoUpload from "../components/PhotoUpload";

export default function BookPickup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState("");

  const submitOrder = async () => {
    await addDoc(collection(db, "orders"), {
      name,
      phone,
      items,
      status: "Pickup Scheduled",
      createdAt: new Date()
    });

    alert("Order placed!");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Book Pickup</h2>

        <input placeholder="Name" onChange={e => setName(e.target.value)} /><br /><br />
        <input placeholder="Phone" onChange={e => setPhone(e.target.value)} /><br /><br />
        <input placeholder="Clothes Count" onChange={e => setItems(e.target.value)} /><br /><br />

        <button className="btn" onClick={submitOrder}>
          Confirm Pickup
        </button>
      </div>
    </div>
  );
}
