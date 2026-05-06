import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Agent() {

  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);

  // 🔥 services per active order
  const [services, setServices] = useState({
  washing: [],
  ironing: [],
  drycleaning: [],
  stain: [],
  saree: []
});

  const sendWhatsApp = (
  phone,
  message
) => {

  const cleanPhone = `91${phone}`;

  const url =
    `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

  window.open(
    url,
    "whatsappWindow"
  );
};
  // 🔹 FETCH ORDERS
  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data);
  };

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

  // ✅ ACCEPT ORDER
  const acceptOrder = async (id) => {
    await supabase
      .from("orders")
      .update({ status: "ACCEPTED" })
      .eq("id", id);

    setActiveOrderId(id);
    setServices({
  washing: [],
  ironing: [],
  drycleaning: [],
  stain: [],
  saree: []
});
  };

  // 🔹 ADD SERVICE ROW
  const addServiceRow = (type) => {

  setServices(prev => ({
    ...prev,

    [type]: [
      ...prev[type],

      {
        item: "",
        quantity: 1,
        unit: type === "washing" ? "kg" : "piece",
        price: 0,
        total: 0
      }
    ]
  }));
};

  const removeServiceRow = (
  serviceType,
  index
) => {

  const updated = {
    ...services
  };

  updated[serviceType].splice(index, 1);

  setServices(updated);
};

  // 🔹 UPDATE SERVICE ROW
 const updateService = async (
  serviceType,
  index,
  field,
  value
) => {

  const updated = {
    ...services
  };

  updated[serviceType][index][field] = value;

  const row = updated[serviceType][index];

  // FETCH PRICE
  if (field === "item") {

    const { data, error } = await supabase
  .from("price_master")
  .select("*")
  .ilike("service", serviceType)
  .ilike("item", value)
  .maybeSingle();

console.log("PRICE FETCH:", data, error);

    if (data) {

  updated[serviceType][index].price =
    Number(data.price);

} else {

  updated[serviceType][index].price = 0;
}
  }

  row.total =
    (row.quantity || 0) *
    (row.price || 0);

  setServices(updated);
};
  // 🔹 TOTAL BILL
  const totalBill =
  Object.values(services)
    .flat()
    .reduce(
      (sum, row) => sum + row.total,
      0
    );
  // ✅ MARK RECEIVED
  const markReceived = async (order) => {

  const allRows = Object.values(services).flat();

  if (allRows.length === 0) {

    alert("Please add at least one service");
    return;
  }

  await supabase
    .from("orders")
    .update({
      status: "RECEIVED",
      services_data: services,
      bill_amount: totalBill
    })
    .eq("id", order.id);

  // ✅ WHATSAPP
  sendWhatsApp(
  order.phone,

`✨ *Elegant Laundry Services*

Hello *${order.customer_name}* 👋

✅ Your order has been received successfully.

🧾 *Order ID:* ${order.order_number}

👕 *Clothes Count:* ${order.clothes_count}

💰 *Total Bill:* ₹${totalBill}

📍 Status: *RECEIVED*

Thank you for choosing Elegant Laundry 🙏`
);

  alert("Order received successfully!");

  setActiveOrderId(null);

  setServices({
    washing: [],
    ironing: [],
    drycleaning: [],
    stain: [],
    saree: []
  });

  fetchOrders();
};

  const markDelivered = async (order) => {

  await supabase
    .from("orders")
    .update({
      status: "CLOSED"
    })
    .eq("id", order.id);

  // ✅ WHATSAPP
  sendWhatsApp(
    order.phone,

    `Hello ${order.customer_name},

Your order ${order.order_number} has been delivered successfully.

Thank you for choosing Elegant Laundry.`
  );

  alert("Order closed successfully!");

  fetchOrders();
};
 

  return (
    <div className="container">
      <h2>Agent Panel</h2>
      {/* TABLE HEADER */}
<div
  style={{
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#fff",
    borderRadius: 12,
    padding: "14px 18px",
    marginBottom: 12
  }}
>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1.4fr 2fr 1.2fr 1fr 1fr 1.2fr 1fr",
      gap: 10,
      fontSize: 13,
      fontWeight: 700,
      color: "#0d2c91",
      textTransform: "uppercase",
      whiteSpace: "nowrap"
    }}
  >

    <div>Order ID</div>
    <div>Customer</div>
    <div>Status</div>
    <div>Clothes</div>
    <div>Bill</div>
    <div>Payment</div>
    <div>Action</div>

  </div>
</div>

      {orders.map(order => (
        <div key={order.id} className="card" style={{ marginTop: 20 }}>

          <div
  key={order.id}
  style={{
    background: "#fff",
    borderRadius: 12,
    padding: "14px 18px",
    marginBottom: 12,
    overflow: "hidden"
  }}
>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1.4fr 2fr 1.2fr 1fr 1fr 1.2fr 1fr",
      alignItems: "center",
      gap: 10,
      fontSize: 13,
      whiteSpace: "nowrap"
    }}
  >

    {/* ORDER ID */}
    <div
      style={{
        fontWeight: 700,
        color: "#0d2c91"
      }}
    >
      {order.order_number}
    </div>

    {/* CUSTOMER */}
    <div
      style={{
        fontWeight: 600,
        overflow: "hidden",
textOverflow: "ellipsis",
whiteSpace: "nowrap"
      }}
    >
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

    {/* ACTION */}
    <div>
      {order.status === "BOOKED" && (
        <button
          onClick={() => acceptOrder(order.id)}
          style={{
            background: "#0d2c91",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600
          }}
        >
          Accept
        </button>
      )}

      {order.status === "OUT_FOR_DELIVERY" && (
        <button
          onClick={() => markDelivered(order)}
          style={{
            background: "green",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600
          }}
        >
          Delivered
        </button>
      )}
    </div>

  </div>

  {/* ACCEPTED ORDER FORM */}
  {(order.status === "ACCEPTED" || activeOrderId === order.id) && (
    <div style={{ marginTop: 20 }}>

      {/* YOUR EXISTING SERVICES UI HERE */}

    </div>
  )}

</div>
         

          {/* 🔥 FORM */}
          {(order.status === "ACCEPTED" || activeOrderId === order.id) && (
            <div style={{ marginTop: 20 }}>

              <h4>Add Services</h4>

              <button onClick={() => addServiceRow("washing")}>+ Washing</button>
              <button onClick={() => addServiceRow("ironing")}>+ Ironing</button>
              <button onClick={() => addServiceRow("drycleaning")}>+ Dry Cleaning</button>
              <button onClick={() => addServiceRow("stain")}>+ Stain Removal</button>
              <button onClick={() => addServiceRow("saree")}>+ Saree Rolling</button>

              {/* SERVICE ROWS */}
              {Object.entries(services).map(
  ([serviceType, rows]) => (

    rows.length > 0 && (

      <div
        key={serviceType}
        style={{
          marginTop: 20,
          padding: 15,
          border: "1px solid #ddd",
          borderRadius: 8
        }}
      >

        <h3>
          {serviceType.toUpperCase()}
        </h3>

        {rows.map((s, i) => (

          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 10,
              alignItems: "center"
            }}
          >

            {/* ITEM */}
            <select
              value={s.item}
              onChange={(e) =>
                updateService(
                  serviceType,
                  i,
                  "item",
                  e.target.value.toLowerCase()
                )
              }
            >
              <option value="">
                Select Item
              </option>

              <option value="shirt">
                Shirt
              </option>

              <option value="pant">
                Pant
              </option>

              <option value="saree">
                Saree
              </option>

              <option value="blanket">
                Blanket
              </option>

              <option value="blazer">
                Blazer
              </option>

              <option value="general">
                General
              </option>

            </select>

            {/* QTY */}
            <input
              type="number"
              value={s.quantity}
              placeholder={
                serviceType === "washing"
                  ? "KG"
                  : "Pieces"
              }
              onChange={(e) =>
                updateService(
                  serviceType,
                  i,
                  "quantity",
                  Number(e.target.value)
                )
              }
            />

            {/* PRICE */}
            <input
              type="number"
              value={s.price}
              readOnly
            />

            {/* TOTAL */}
            <div>
              ₹{s.total}
            </div>

            {/* ADD */}
            <button
              onClick={() =>
                addServiceRow(serviceType)
              }
            >
              ➕
            </button>

            {/* REMOVE */}
            <button
              onClick={() =>
                removeServiceRow(
                  serviceType,
                  i
                )
              }
            >
              ❌
            </button>

          </div>
        ))}

      </div>
    )
  )
)}             
              <h3 style={{ marginTop: 20 }}>
                Total Bill: ₹{totalBill}
              </h3>

              <button onClick={() => markReceived(order)}>
                Confirm Received
              </button>

            </div>
          )}

        </div>
      ))}

    </div>
  );
}
