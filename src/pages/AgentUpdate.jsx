import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Agent() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchOrders()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*");
    setOrders(data);
  };

  const accept = async (id) => {
    await supabase
      .from("orders")
      .update({ status: "ACCEPTED" })
      .eq("id", id);
  };

  const received = async (id) => {
    await supabase
      .from("orders")
      .update({
        status: "RECEIVED",
        shirts: 5,
        pants: 3,
        washing: true,
        ironing: true,
        bill_amount: 350
      })
      .eq("id", id);
  };

  const delivered = async (id) => {
    await supabase
      .from("orders")
      .update({ status: "DELIVERED" })
      .eq("id", id);
  };

  return (
    <div>
      <h2>Agent Panel</h2>

      {orders.map(order => (
  <div key={order.id} className="card">

    <h3>{order.customer_name}</h3>
    <p>Status: {order.status}</p>

    {/* ACCEPT BUTTON */}
    {order.status === "BOOKED" && (
      <button onClick={() => acceptOrder(order)}>
        Accept
      </button>
    )}

    {/* 🔥 SHOW FORM WHEN ACCEPTED */}
    {order.status === "ACCEPTED" && (
      <div style={{ marginTop: 15 }}>

        <input
          type="number"
          placeholder="Shirts"
          onChange={(e) => setShirts(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Pants"
          onChange={(e) => setPants(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Others"
          onChange={(e) => setOthers(Number(e.target.value))}
        />

        <h4>Services</h4>

        <label>
          <input type="checkbox" onChange={(e) => setWashing(e.target.checked)} />
          Washing
        </label>

        <label>
          <input type="checkbox" onChange={(e) => setIroning(e.target.checked)} />
          Ironing
        </label>

        <label>
          <input type="checkbox" onChange={(e) => setDrycleaning(e.target.checked)} />
          Dry Cleaning
        </label>

        <label>
          <input type="checkbox" onChange={(e) => setStain(e.target.checked)} />
          Stain Removal
        </label>

        <h3>Bill: ₹{bill}</h3>

        <button onClick={() => markReceived(order.id)}>
          Confirm Received
        </button>

      </div>
    )}

  </div>
))}
    </div>
  );
}
