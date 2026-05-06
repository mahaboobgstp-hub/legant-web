import { useState } from "react";
import { supabase } from "../supabaseClient";
import PhotoUpload from "../components/PhotoUpload";

export default function BookPickup() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [clothesCount, setClothesCount] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // ✅ SUBMIT ORDER (SUPABASE)
  const handleSubmit = async () => {

    if (!name || !phone || !address || !clothesCount) {
      alert("Please fill all fields");
      return;
    }
// 🔥 GET LAST ORDER

const { data: lastOrder } = await supabase
  .from("orders")
  .select("order_number")
  .order("created_at", { ascending: false })
  .limit(1)
  .single();

// 🔥 GENERATE NEXT NUMBER

let nextNumber = 1001;

if (lastOrder?.order_number) {

  const last = parseInt(
    lastOrder.order_number.split("-")[2]
  );

  nextNumber = last + 1;
}

const orderNumber = `ELS-NLR-${nextNumber}`;
    const { error } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          customer_name: name,
          phone: phone,
          address: address,
          clothes_count: Number(clothesCount),
          image_url: imageUrl || null,
          status: "BOOKED",
          payment_status: "PENDING"
        }
      ]);

    if (error) {
      console.error("Error:", error);
      alert("Error booking pickup");
    } else {
      alert("Pickup booked successfully!");

      // ✅ RESET FORM
      setName("");
      setPhone("");
      setAddress("");
      setClothesCount("");
      setImageUrl("");
    }
  };

  return (
    <div className="container">
      <div className="card">

        <h2>Schedule Pickup</h2>

        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <input
          className="input"
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />

        <input
          className="input"
          placeholder="Clothes Count"
          type="number"
          value={clothesCount}
          onChange={e => setClothesCount(e.target.value)}
        />

        <h4>Upload Clothes Photo</h4>

        <PhotoUpload setImageUrl={setImageUrl} />

        {imageUrl && (
          <img
            src={imageUrl}
            alt="preview"
            width="120"
            style={{ marginTop: 10, borderRadius: 8 }}
          />
        )}

        <br /><br />

        <button className="btn" onClick={handleSubmit}>
          Confirm Pickup
        </button>

      </div>
    </div>
  );
}
