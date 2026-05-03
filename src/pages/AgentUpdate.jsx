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
        quantity: 0,
        unit: type === "washing" ? "kg" : "piece",
        price: 0,
        total: 0
      }
    ]);
  };

  // 🔹 UPDATE SERVICE ROW
  const updateService = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;

    updated[index].total =
      (updated[index].quantity || 0) * (updated[index].price || 0);

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

              {/* SERVICE ROWS */}
              {services.map((s, i) => (
                <div key={i} style={{
                  marginTop: 15,
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8
                }}>

                  <p><b>{s.service.toUpperCase()}</b></p>

                  <select
                    onChange={(e) => updateService(i, "item", e.target.value)}
                  >
                    <option>Select Item</option>
                    <option>Shirt</option>
                    <option>Pant</option>
                    <option>Saree</option>
                    <option>Blanket</option>
                  </select>

                  <input
                    type="number"
                    placeholder={`Quantity (${s.unit})`}
                    onChange={(e) => updateService(i, "quantity", Number(e.target.value))}
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    onChange={(e) => updateService(i, "price", Number(e.target.value))}
                  />

                  <p>Total: ₹{s.total}</p>

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
