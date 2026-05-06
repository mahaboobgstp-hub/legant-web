import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Agent() {

  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);

  // 🔥 services per active order
  const [services, setServices] = useState([]);

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

  setServices(prev => [
    ...prev,
    {
      service: type,
      item: "",
      quantity: 1,
      unit: type === "washing" ? "kg" : "piece",
      price: 0,
      total: 0
    }
  ]);
};

  const removeServiceRow = (index) => {

  const updated = [...services];

  updated.splice(index, 1);

  setServices(updated);
};

  // 🔹 UPDATE SERVICE ROW
  const updateService = async (index, field, value) => {

  const updated = [...services];

  updated[index][field] = value;

  // 🔥 FETCH PRICE AUTOMATICALLY
  if (
    field === "item" ||
    field === "service"
  ) {

    const service = updated[index].service;
    const item = value;

    const { data } = await supabase
      .from("price_master")
      .select("*")
      .eq("service", service)
      .ilike("item", item)
      .single();

    if (data) {
      updated[index].price = data.price;
    }
  }

  // 🔥 CALCULATE TOTAL
  updated[index].total =
    (updated[index].quantity || 0) *
    (updated[index].price || 0);

  setServices(updated);
};

  // 🔹 TOTAL BILL
  const totalBill = services.reduce((sum, s) => sum + s.total, 0);

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

  return (
    <div className="container">
      <h2>Agent Panel</h2>

      {orders.map(order => (
        <div key={order.id} className="card" style={{ marginTop: 20 }}>

          <h3>{order.customer_name}</h3>
          <p>Status: {order.status}</p>

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
              {services.map((s, i) => (

  <div
    key={i}
    style={{
      marginTop: 15,
      padding: 15,
      border: "1px solid #ddd",
      borderRadius: 8
    }}
  >

    <p>
      <b>{s.service.toUpperCase()}</b>
    </p>

    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap"
      }}
    >

      {/* ITEM */}
      <select
        value={s.item}
        onChange={(e) =>
          updateService(i, "item", e.target.value.toLowerCase())
        }
      >
        <option value="">Select Item</option>
        <option value="shirt">Shirt</option>
        <option value="pant">Pant</option>
        <option value="saree">Saree</option>
        <option value="blanket">Blanket</option>
        <option value="blazer">Blazer</option>
        <option value="general">General</option>
      </select>

      {/* QUANTITY */}
      <input
        type="number"
        value={s.quantity}
        placeholder={`Qty (${s.unit})`}
        onChange={(e) =>
          updateService(
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
        placeholder="Price"
      />

      {/* ROW TOTAL */}
      <div>
        ₹{s.total}
      </div>

      {/* ADD ROW */}
      <button
        onClick={() => addServiceRow(s.service)}
      >
        ➕
      </button>

      {/* REMOVE ROW */}
      <button
        onClick={() => removeServiceRow(i)}
      >
        ❌
      </button>

    </div>

  </div>
))}
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
