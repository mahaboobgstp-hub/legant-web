import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Agent() {

  const [orders, setOrders] = useState([]);

  // ✅ INPUT STATES (FIXED)
  const [shirts, setShirts] = useState(0);
  const [pants, setPants] = useState(0);
  const [others, setOthers] = useState(0);

  const [washing, setWashing] = useState(false);
  const [ironing, setIroning] = useState(false);
  const [drycleaning, setDrycleaning] = useState(false);
  const [stain, setStain] = useState(false);

  const [bill, setBill] = useState(0);

  // 🔹 FETCH
  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*");
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

  // ✅ ACCEPT FIXED
  const accept = async (id) => {
    await supabase
      .from("orders")
      .update({ status: "ACCEPTED" })
      .eq("id", id);
  };

  // ✅ BILL CALCULATION
  useEffect(() => {
    let total = 0;

    const count = shirts + pants + others;

    if (washing) total += count * 10;
    if (ironing) total += count * 5;
    if (drycleaning) total += count * 20;
    if (stain) total += count * 15;

    setBill(total);
  }, [shirts, pants, others, washing, ironing, drycleaning, stain]);

  // ✅ RECEIVED (FIXED)
  const markReceived = async (id) => {
    await supabase
      .from("orders")
      .update({
        status: "RECEIVED",
        shirts,
        pants,
        others,
        washing,
        ironing,
        drycleaning,
        stain,
        bill_amount: bill
      })
      .eq("id", id);

    alert("Order received!");
    fetchOrders();
  };

  return (
    <div>
      <h2>Agent Panel</h2>

      {orders.map(order => (
        <div key={order.id} className="card">

          <h3>{order.customer_name}</h3>
          <p>Status: {order.status}</p>

          {/* ✅ ACCEPT */}
          {order.status === "BOOKED" && (
            <button onClick={() => accept(order.id)}>
              Accept
            </button>
          )}

          {/* ✅ FORM AFTER ACCEPT */}
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
