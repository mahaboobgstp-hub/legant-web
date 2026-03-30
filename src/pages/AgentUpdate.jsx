import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";

export default function AgentUpdate() {

  const [orderId, setOrderId] = useState("");
  const [shirt, setShirt] = useState(0);
  const [pants, setPants] = useState(0);
  const [agentName, setAgentName] = useState("");

  const handleUpdate = async () => {

    const ironing = shirt * 10 + pants * 12;
    const pickup = 20;
    const delivery = 20;
    const total = ironing + pickup + delivery;

    try {
      await updateDoc(doc(db, "orders", orderId), {
        items: { shirt, pants },
        pricing: { ironing, pickup, delivery, total },
        agent: {
          name: agentName,
          pickupTime: new Date().toLocaleTimeString()
        },
        status: "picked"
      });
 // ✅ WHATSAPP MESSAGE
    const message = `Order Updated ✅
Shirts: ${shirt}
Pants: ${pants}
Total: ₹${total}`;

    window.open(
      `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`
    );
      alert("Updated successfully");

    } catch (err) {
      console.error(err);
      alert("Error updating");
    }
  };

  useEffect(() => {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== "admin@legant.com") {
      window.location.href = "/";
    }
  });
}, []);

  return (
    <div className="container">

      <h2>Agent Update</h2>

      <input className="input" placeholder="Order ID"
        onChange={(e) => setOrderId(e.target.value)} />

      <input className="input" type="number" placeholder="Shirts"
        onChange={(e) => setShirt(Number(e.target.value))} />

      <input className="input" type="number" placeholder="Pants"
        onChange={(e) => setPants(Number(e.target.value))} />

      <input className="input" placeholder="Agent Name"
        onChange={(e) => setAgentName(e.target.value)} />

      <button className="btn" onClick={handleUpdate}>
        Update Order
      </button>

    </div>
  );
}
