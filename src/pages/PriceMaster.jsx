import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function PriceMaster() {

  const [prices, setPrices] = useState([]);

  const [service, setService] = useState("");
  const [item, setItem] = useState("");
  const [unit, setUnit] = useState("piece");
  const [price, setPrice] = useState("");

  // ✅ FETCH PRICES
  const fetchPrices = async () => {

    const { data, error } = await supabase
      .from("price_master")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("FETCH ERROR:", error);
      return;
    }

    setPrices(data || []);
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  // ✅ ADD PRICE
  const addPrice = async () => {

    if (!service || !item || !price) {
      alert("Please fill all fields");
      return;
    }

    const { error } = await supabase
      .from("price_master")
      .insert([
        {
          service,
          item,
          unit,
          price: Number(price)
        }
      ]);

    if (error) {
      console.error("INSERT ERROR:", error);
      alert("Error adding price");
      return;
    }

    alert("Price added successfully!");

    setService("");
    setItem("");
    setUnit("piece");
    setPrice("");

    fetchPrices();
  };

  return (
    <div className="container">

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}
      >
        <h2>Price Master</h2>

        <button
          className="btn"
          onClick={() => window.location.href = "/admin"}
        >
          Back to Admin
        </button>
      </div>

      {/* ADD PRICE CARD */}
      <div
        className="card"
        style={{
          padding: 20,
          marginBottom: 25
        }}
      >

        <h3>Add / Update Price</h3>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 15
          }}
        >

          {/* SERVICE */}
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="input"
          >
            <option value="">Select Service</option>

            <option value="washing">
              Washing
            </option>

            <option value="ironing">
              Ironing
            </option>

            <option value="drycleaning">
              Dry Cleaning
            </option>

            <option value="stain">
              Stain Removal
            </option>

            <option value="saree_rolling">
              Saree Rolling
            </option>

            <option value="polishing">
              Polishing
            </option>

          </select>

          {/* ITEM */}
          <input
            className="input"
            placeholder="Item Name"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />

          {/* UNIT */}
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="input"
          >
            <option value="piece">Piece</option>
            <option value="kg">Kg</option>
          </select>

          {/* PRICE */}
          <input
            type="number"
            className="input"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {/* BUTTON */}
          <button
            className="btn"
            onClick={addPrice}
          >
            Save Price
          </button>

        </div>

      </div>

      {/* PRICE TABLE */}
      <div className="card">

        <h3>Current Price List</h3>

        <div
          style={{
            overflowX: "auto",
            marginTop: 20
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >

            <thead>

              <tr
                style={{
                  background: "#1e3a8a",
                  color: "white"
                }}
              >

                <th style={thStyle}>Service</th>
                <th style={thStyle}>Item</th>
                <th style={thStyle}>Unit</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Created</th>

              </tr>

            </thead>

            <tbody>

              {prices.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: 20,
                      textAlign: "center"
                    }}
                  >
                    No prices found
                  </td>
                </tr>
              )}

              {prices.map((p) => (

                <tr key={p.id}>

                  <td style={tdStyle}>
                    {p.service}
                  </td>

                  <td style={tdStyle}>
                    {p.item}
                  </td>

                  <td style={tdStyle}>
                    {p.unit}
                  </td>

                  <td style={tdStyle}>
                    ₹{p.price}
                  </td>

                  <td style={tdStyle}>
                    {new Date(p.created_at).toLocaleString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

// ✅ TABLE HEADER STYLE
const thStyle = {
  padding: 12,
  border: "1px solid #ddd",
  textAlign: "left"
};

// ✅ TABLE DATA STYLE
const tdStyle = {
  padding: 12,
  border: "1px solid #ddd"
};
