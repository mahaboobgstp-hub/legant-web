import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Admin() {

  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] =
  useState(null);

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
  const markReady = async (order) => {

  const { error } = await supabase
    .from("orders")
    .update({
      status: "READY"
    })
    .eq("id", order.id);

  if (error) {

    console.error(error);

  } else {

    const paymentLink =
  `upi://pay?pa=9704424945-6@ybl&pn=Sd Mahaboob Basha&am=${order.bill_amount}&cu=INR&tn=${order.order_number}`;
    sendWhatsApp(
  order.phone,

`🚚 *Elegant Laundry Services*

Hello *${order.customer_name}* 👋

Your order is now *OUT FOR DELIVERY*.

🧾 *Order ID:* ${order.order_number}

💰 *Amount Payable:* ₹${order.bill_amount}

💳 *Pay Online:*
${paymentLink}

Or pay cash to delivery agent.

Thank you 🙏`
);
  }
};

  const sendWhatsApp = (
  phone,
  message
) => {

  const cleanPhone =
    `91${phone}`;

  const url =
    `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
};

 
  return (
    <div className="container">
      <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20
}}>

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
      </div>
      
      {/* HEADER */}
<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "1.2fr 1.5fr 1fr 1fr 1fr 1fr 1.5fr",
    gap: 10,
    padding: "14px 20px",
    background: "#fff",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 13,
    marginBottom: 15,
    position: "sticky",
    top: 0,
    zIndex: 100
  }}
>
  <div>ORDER ID</div>
  <div>CUSTOMER</div>
  <div>STATUS</div>
  <div>CLOTHES</div>
  <div>BILL</div>
  <div>PAYMENT</div>
  <div>ACTION</div>
</div>

{/* ROWS */}
{orders.map(order => (

  <div
    key={order.id}
    style={{
      display: "grid",
      gridTemplateColumns:
        "1.2fr 1.5fr 1fr 1fr 1fr 1fr 1.5fr",
      gap: 10,
      alignItems: "center",
      background: "#fff",
      padding: "16px 20px",
      borderRadius: 12,
      marginBottom: 12,
      fontSize: 14
    }}
  >

    {/* ORDER ID */}
    <div
      style={{
        fontWeight: 700,
        color: "#0d3b96"
      }}
    >
      {order.order_number}
    </div>

    {/* CUSTOMER */}
    <div>
      {order.customer_name}
    </div>

    {/* STATUS */}
    <div>
      {order.status}
    </div>

    {/* CLOTHES */}
    <div>
      {order.clothes_count || 0} Clothes
    </div>

    {/* BILL */}
    <div>
      ₹{order.bill_amount || 0}
    </div>

    {/* PAYMENT */}
    <div>
      {order.payment_status || "PENDING"}
    </div>

    {/* ACTIONS */}
    <div
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap"
      }}
    >

      {order.status === "BOOKED" && (
        <button
          className="btn"
          onClick={() =>
            updateStatus(order.id, "ACCEPTED")
          }
        >
          Accept
        </button>
      )}

      {order.status === "RECEIVED" && (
        <button
          className="btn"
          onClick={() => markReady(order)}
        >
          Ready
        </button>
      )}

      {order.status === "READY" && (
        <button
          className="btn"
          onClick={() =>
            updateStatus(
              order.id,
              "OUT_FOR_DELIVERY"
            )
          }
        >
          Send
        </button>
      )}

      {order.status === "OUT_FOR_DELIVERY" && (
        <button
          className="btn"
          onClick={() =>
            updateStatus(
              order.id,
              "DELIVERED"
            )
          }
        >
          Delivered
        </button>
      )}
      <button
  className="btn"
  style={{
    background: "#444"
  }}
  onClick={() =>
    setExpandedOrder(
      expandedOrder === order.id
        ? null
        : order.id
    )
  }
>
  Details
</button>

    </div>
    {expandedOrder === order.id && (

  <div
  style={{
    padding: 20,
    background: "#f8f9fc",
    borderRadius: 10,
    marginTop: 15,
    width: "100%",
    display: "flex",
    gap: 30,
    alignItems: "flex-start"
  }}
>

    <div
  style={{
    flex: 2,
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: 20,
    alignItems: "start"
  }}
>

  <div>
    <b>Customer</b><br />
    {order.customer_name}
  </div>

  <div>
    <b>Phone</b><br />
    {order.phone}
  </div>

  <div>
    <b>Address</b><br />
    {order.address}
  </div>

  <div>
    <b>Order ID</b><br />
    {order.order_number}
  </div>

  <div>
    <b>Status</b><br />
    {order.status}
  </div>

  <div>
    <b>Total Clothes</b><br />
    {order.clothes_count}
  </div>

  <div>
    <b>Total Bill</b><br />
    ₹{order.bill_amount || 0}
  </div>

  <div>
    <b>Payment Status</b><br />
    {order.payment_status || "PENDING"}
  </div>

  <div>
    <b>Payment Mode</b><br />
    {order.payment_mode || "Not Paid"}
  </div>

  <div>
    <b>Order Date</b><br />
    {new Date(order.created_at)
      .toLocaleDateString()}
  </div>

  <div>
    <b>Order Time</b><br />
    {new Date(order.created_at)
      .toLocaleTimeString()}
  </div>

</div>
   
      <div style={{ flex: 1 }}>
<div>
    LEFT GRID
  </div>
  <b>Services Ordered</b>

  {order.services_data &&
    Object.entries(order.services_data)
      .filter(([_, items]) => items.length > 0)
      .map(([service, items]) => (

        <div
          key={service}
          style={{
            marginTop: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            overflow: "hidden"
          }}
        >

          {/* SERVICE HEADER */}
          <div
            style={{
              background: "#f0f3fa",
              padding: "8px 12px",
              fontWeight: 700,
              textTransform: "uppercase"
            }}
          >
            {service}
          </div>

          {/* TABLE HEADER */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "2fr 1fr 1fr 1fr",
              padding: "8px 12px",
              fontWeight: 600,
              borderBottom: "1px solid #eee",
              background: "#fafafa"
            }}
          >
            <div>Item</div>
            <div>Qty</div>
            <div>Rate</div>
            <div>Total</div>
          </div>

          {/* ITEMS */}
          {items.map((item, index) => (

            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "2fr 1fr 1fr 1fr",
                padding: "8px 12px",
                borderBottom:
                  "1px solid #f1f1f1"
              }}
            >
              <div>{item.item}</div>
              <div>
                {item.quantity} {item.unit}
              </div>
              <div>₹{item.price}</div>
              <div>₹{item.total}</div>
            </div>

          ))}

        </div>
       

      ))}
</div>
</div>
    {order.image_url && (
      <img
        src={order.image_url}
        alt="clothes"
        style={{
          width: 150,
          borderRadius: 10,
          marginTop: 10
        }}
      />
    )}

  </div>
)}

  </div>
   
))}

    </div>
  );
}
