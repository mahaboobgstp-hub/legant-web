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
    setServices([]); // reset form
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
  const markReceived = async (id) => {
    if (services.length === 0) {
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
      .eq("id", id);

    alert("Order received successfully!");

    setActiveOrderId(null);
    setServices([]);
    fetchOrders();
  };

  const markDelivered = async (id) => {

  await supabase
    .from("orders")
    .update({
      status: "CLOSED"
    })
    .eq("id", id);

  alert("Order closed successfully!");

  fetchOrders();
};

  return (
    <div className="container">
      <h2>Agent Panel</h2>

      {orders.map(order => (
        <div key={order.id} className="card" style={{ marginTop: 20 }}>

          <h3>{order.customer_name}</h3>
          <p>Status: {order.status}</p>
          <p>
  <b>Order ID:</b>
  {" "}
  {order.id.slice(0, 8)}
</p>

<p>
  <b>Total Bill:</b>
  ₹{order.bill_amount || 0}
</p>

<p>
  <b>Clothes Count:</b>
  {order.clothes_count || 0}
</p>

<p>
  <b>Payment:</b>
  {order.payment_status || "PENDING"}
</p>
          {order.status === "OUT_FOR_DELIVERY" && (

  <button
    onClick={() => markDelivered(order.id)}
    style={{
      marginTop: 15
    }}
  >
    Delivered
  </button>

)}

          {/* ACCEPT */}
          {order.status === "BOOKED" && (
            <button onClick={() => acceptOrder(order.id)}>
              Accept
            </button>
          )}

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
