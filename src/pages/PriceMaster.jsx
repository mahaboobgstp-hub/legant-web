import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function PriceMaster() {

  const [prices, setPrices] = useState([]);
  const [service, setService] = useState("");
  const [item, setItem] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");

  // 🔹 FETCH PRICES
  const fetchPrices = async () => {
    const { data } = await supabase
      .from("price_master")
      .select("*")
      .order("created_at", { ascending: false });

    setPrices(data);
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  // 🔹 ADD NEW PRICE
  const addPrice = async () => {
    if (!service || !item || !price) {
      alert("Fill all fields");
      return;
    }

    await supabase.from("price_master").insert([
      {
        service,
        item,
        unit,
        price: Number(price)
      }
    ]);

    alert("Price added!");
    setService("");
    setItem("");
    setUnit("");
    setPrice("");

    fetchPrices();
  };

  return (
    <div className="container">

      <h2>Price Master</h2>

      {/* ADD NEW PRICE */}
      <div className="card">

        <select onChange={(e) => setService(e.target.value)}>
          <option>Select Service</option>
          <option value="washing">Washing</option>
          <option value="ironing">Ironing</option>
          <option value="drycleaning">Dry Cleaning</option>
          <option value="stain">Stain Removal</option>
        </select>

        <input
          placeholder="Item (shirt, pant, saree...)"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />

        <select onChange={(e) => setUnit(e.target.value)}>
          <option value="piece">Piece</option>
          <option value="kg">Kg</option>
        </select>

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button onClick={addPrice}>Add / Update Price</button>

      </div>

      {/* PRICE LIST */}
      <div style={{ marginTop: 20 }}>

        {prices.map(p => (
          <div key={p.id} className="card">

            <p><b>{p.service}</b> - {p.item}</p>
            <p>₹{p.price} per {p.unit}</p>
            <p style={{ fontSize: 12, color: "gray" }}>
              {new Date(p.created_at).toLocaleString()}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}
