import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import PhotoUpload from "../components/PhotoUpload";

export default function BookPickup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const submitOrder = async () => {
  try {
    await addDoc(collection(db, "orders"), {
      name,
      phone,
      items,
      imageUrl,   // ✅ This stores photo URL
      status: "Pickup Scheduled",
      createdAt: new Date()
    });

    alert("Order placed successfully!");

  } catch (error) {
    console.error(error);
    alert("Error placing order");
  }
};

    return (
    <div className="container">
      <div className="card">
        <h2>Book Pickup</h2>

        <input placeholder="Name" onChange={e => setName(e.target.value)} /><br /><br />
        <input placeholder="Phone" onChange={e => setPhone(e.target.value)} /><br /><br />
        <input placeholder="Clothes Count" onChange={e => setItems(e.target.value)} /><br /><br />


        <h4>Upload Clothes Photo</h4>

<PhotoUpload setImageUrl={setImageUrl} />

{imageUrl && (
  <img src={imageUrl} width="150" />
)}

        <button className="btn" onClick={submitOrder}>
          Confirm Pickup
        </button>
      </div>
    </div>
  );
}
