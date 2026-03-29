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

  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));

    const list = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setOrders(list);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const ref = doc(db, "orders", id);
    await updateDoc(ref, { status: newStatus });
    fetchOrders();
  };

  useEffect(() => {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "/login";
    }
  });
}, []);

  const logout = async () => {
  const auth = getAuth();
  await signOut(auth);
  window.location.href = "/login";
};

  return (
    <div style={{ padding: 30 }}>
     <div style={{ display: "flex", justifyContent: "space-between" }}>
  <h2>Admin Dashboard</h2>
  <button onClick={logout}>Logout</button>
</div>

      {orders.map(order => (
        <div key={order.id} style={{
          border: "1px solid #ccc",
          padding: 15,
          marginBottom: 15
        }}>
          <p><b>Name:</b> {order.name}</p>
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>Items:</b> {order.items}</p>
          <p><b>Status:</b> {order.status}</p>

          {order.imageUrl && (
            <img src={order.imageUrl} width="150" />
          )}

          <br /><br />

          <button onClick={() => updateStatus(order.id, "Picked Up")}>
            Picked Up
          </button>

          <button onClick={() => updateStatus(order.id, "Ironing")}>
            Ironing
          </button>

          <button onClick={() => updateStatus(order.id, "Delivered")}>
            Delivered
          </button>
        </div>
      ))}
    </div>
  );
}
