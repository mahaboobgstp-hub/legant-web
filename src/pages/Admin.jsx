import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

export default function Admin() {

  const [orders, setOrders] = useState([]);

  // 🔥 FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));

      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(list);

    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔥 UPDATE STATUS
  const updateStatus = async (id, newStatus) => {
    try {
      const ref = doc(db, "orders", id);

      await updateDoc(ref, {
        status: newStatus
      });

      fetchOrders();

    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // 🔥 PROTECT ADMIN ACCESS
  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== "admin@legant.com") {
        window.location.href = "/";
      }
    });
  }, []);

  // 🔥 LOGOUT
  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="container">

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>Admin Dashboard</h2>
        <button className="btn" onClick={logout}>Logout</button>
      </div>

      {/* NO ORDERS */}
      {orders.length === 0 && (
        <p style={{ marginTop: 20 }}>No orders found</p>
      )}

      {/* ORDERS LIST */}
      {orders.map(order => (
        <div
          className="card"
          key={order.id}
          style={{ marginTop: 20 }}
        >

          {/* BASIC INFO */}
          <h3>{order.name || "No Name"}</h3>
          <p>📞 {order.phone || "No Phone"}</p>

          {/* ITEMS */}
          <p>
            👕 Items:
            {order.items
              ? ` Shirts: ${order.items.shirt || 0}, Pants: ${order.items.pants || 0}`
              : " Not added yet"}
          </p>

          {/* PRICING */}
          <p>
            💰 Total: ₹{order.pricing?.total || 0}
          </p>

          {/* AGENT */}
          <p>
            👨‍🔧 Agent: {order.agent?.name || "Not assigned"}
          </p>

          {/* STATUS */}
          <p>
            📌 Status:
            <span
              className={`status ${order.status?.toLowerCase()}`}
              style={{ marginLeft: 10 }}
            >
              {order.status || "pending"}
            </span>
          </p>

          {/* IMAGE */}
          {order.imageUrl && (
            <img
              src={order.imageUrl}
              alt="clothes"
              width="150"
              style={{
                borderRadius: 8,
                marginTop: 10
              }}
            />
          )}

          {/* ACTION BUTTONS */}
          <div style={{ marginTop: 15 }}>

            <button
              className="btn"
              onClick={() => updateStatus(order.id, "pending")}
            >
              Pending
            </button>

            <button
              className="btn"
              onClick={() => updateStatus(order.id, "picked")}
              style={{ marginLeft: 10 }}
            >
              Picked
            </button>

            <button
              className="btn"
              onClick={() => updateStatus(order.id, "delivered")}
              style={{ marginLeft: 10 }}
            >
              Delivered
            </button>

          </div>

        </div>
      ))}

    </div>
  );
}
