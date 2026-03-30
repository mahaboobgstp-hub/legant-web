import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Track() {

  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!phone) {
      alert("Enter phone number");
      return;
    }

    setLoading(true);

    try {
      const q = query(
        collection(db, "orders"),
        where("phone", "==", phone)
      );

      const snapshot = await getDocs(q);

      const data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });

      setOrders(data);

    } catch (err) {
      console.error(err);
      alert("Error fetching orders");
    }

    setLoading(false);
  };

  return (
    <div className="track-wrapper">

      <div className="track-box">

        <h2>Track Your Order</h2>

        <p>Enter your phone number to check status</p>

        <input
          className="input"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className="btn" onClick={handleTrack}>
          {loading ? "Checking..." : "Track Order"}
        </button>

      </div>

      {/* RESULTS */}
      <div className="track-results">

        {orders.map(order => (
          <div key={order.id} className="track-card">

            <h4>Order ID: {order.id}</h4>

            <p>Clothes: {order.clothes}</p>

            <p>
              Status:
              <span className={`status ${order.status}`}>
                {order.status}
              </span>
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}
