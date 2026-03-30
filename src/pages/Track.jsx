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

      const querySnapshot = await getDocs(q);

      const results = [];

      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      setOrders(results);

    } catch (err) {
      console.error(err);
      alert("Error fetching orders");
    }

    setLoading(false);
  };

  return (
    <div className="track-section">

      <h2>Track Your Order</h2>

      <p>Enter your phone number to check your order status</p>

      {/* INPUT */}
      <input
        className="input"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button className="btn" onClick={handleTrack}>
        {loading ? "Checking..." : "Track Order"}
      </button>

      {/* RESULTS */}
      <div className="track-results">

        {orders.length === 0 && !loading && (
          <p>No orders found</p>
        )}

        {orders.map((order) => (
          <div key={order.id} className="track-card">

            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Clothes:</strong> {order.clothes}</p>
            <p>
              <strong>Status:</strong>{" "}
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
