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
          <p>{order.customer_name}</p>
          <p>Status: {order.status}</p>

          {order.status === "BOOKED" && (
            <button onClick={() => accept(order.id)}>Accept</button>
          )}

          {order.status === "ACCEPTED" && (
            <button onClick={() => received(order.id)}>Received</button>
          )}

          {order.status === "OUT_FOR_DELIVERY" && (
            <button onClick={() => delivered(order.id)}>Delivered</button>
          )}
        </div>
      ))}
    </div>
  );
}
