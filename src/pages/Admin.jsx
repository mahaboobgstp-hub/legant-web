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
    <div className="container">
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <h2>Admin Dashboard</h2>
    <button className="btn" onClick={logout}>Logout</button>
  </div>

  {orders.map(order => (
    <div className="card" key={order.id} style={{ marginTop: 20 }}>
      
      <h3>{order.name}</h3>
      <p>📞 {order.phone}</p>
      <p>👕 Items: {order.items}</p>
      <p>📌 Status: <b>{order.status}</b></p>

      {order.imageUrl && (
        <img src={order.imageUrl} width="150" style={{ borderRadius: 8 }} />
      )}

      <div style={{ marginTop: 15 }}>
        <button className="btn" onClick={() => updateStatus(order.id, "Picked Up", order.phone)}>Picked Up</button>
        <button className="btn" onClick={() => updateStatus(order.id, "Ironing", order.phone)} style={{ marginLeft: 10 }}>Ironing</button>
        <button className="btn" onClick={() => updateStatus(order.id, "Delivered", order.phone)} style={{ marginLeft: 10 }}>Delivered</button>
      </div>

    </div>
  ))}
</div>
  );
}
