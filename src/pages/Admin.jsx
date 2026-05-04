import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Admin() {

  const [orders, setOrders] = useState([]);

  // ✅ FETCH ORDERS
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching:", error);
    } else {
      setOrders(data);
    }
  };

  // ✅ REALTIME LISTENER
  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) console.error(error);
  };

  // ✅ MARK READY (SEND FOR DELIVERY)
  const markReady = async (id) => {
    const { error } = await supabase
      .from("orders")
      .update({
        status: "READY"
      })
      .eq("id", id);

    if (error) console.error(error);
  };

  return (
    <div className="container">

      <h2>Admin Dashboard</h2>

      {orders.length === 0 && (
        <p style={{ marginTop: 20 }}>No orders found</p>
      )}

      <button
  className="btn"
  onClick={() => window.location.href = "/price-master"}
>
  Price Master
</button>
      
      {orders.map(order => (
        <div
          key={order.id}
          className="card"
          style={{ marginTop: 20 }}
        >

          {/* CUSTOMER INFO */}
          <h3>{order.customer_name}</h3>
          <p>📞 {order.phone}</p>
          <p>📍 {order.address}</p>

          {/* CLOTHES */}
          <p>🧺 Total Clothes: {order.clothes_count}</p>

          <p>
            👕 Items:
            Shirts: {order.shirts || 0} |
            Pants: {order.pants || 0} |
            Others: {order.others || 0}
          </p>

          {/* SERVICES */}
          <p>
            🧼 Services:
            {order.washing && " Washing"}
            {order.ironing && " Ironing"}
            {order.drycleaning && " Dry Cleaning"}
            {order.stain && " Stain Removal"}
          </p>

          {/* BILL */}
          <p>💰 Bill: ₹{order.bill_amount || 0}</p>

          {/* STATUS */}
          <p>
            📌 Status:
            <span
              className={`status ${order.status?.toLowerCase()}`}
              style={{ marginLeft: 10 }}
            >
              {order.status}
            </span>
          </p>

          {/* PAYMENT */}
          <p>
            💳 Payment: {order.payment_status}
          </p>

          {/* ACTIONS */}
          <div style={{ marginTop: 15 }}>

            {order.status === "BOOKED" && (
              <button
                className="btn"
                onClick={() => updateStatus(order.id, "ACCEPTED")}
              >
                Accept
              </button>
            )}

            {order.status === "RECEIVED" && (
              <button
                className="btn"
                onClick={() => markReady(order.id)}
              >
                Ready to Deliver
              </button>
            )}

            {order.status === "READY" && (
              <button
                className="btn"
                onClick={() =>
                  updateStatus(order.id, "OUT_FOR_DELIVERY")
                }
              >
                Send to Agent
              </button>
            )}

            {order.status === "OUT_FOR_DELIVERY" && (
              <button
                className="btn"
                onClick={() =>
                  updateStatus(order.id, "DELIVERED")
                }
              >
                Mark Delivered
              </button>
            )}

          </div>

        </div>
      ))}

    </div>
  );
}
