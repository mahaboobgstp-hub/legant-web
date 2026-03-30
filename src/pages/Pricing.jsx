import { useNavigate } from "react-router-dom";

export default function Pricing() {

  const navigate = useNavigate();

  const items = [
    { name: "Shirt", price: "₹10", img: "/images/shirt.png" },
    { name: "T-Shirt", price: "₹8", img: "/images/tshirt.png" },
    { name: "Pants / Trousers", price: "₹12", img: "/images/pants.png" },
    { name: "Jeans", price: "₹15", img: "/images/jeans.png" },
    { name: "Saree", price: "₹20", img: "/images/saree.png" },
    { name: "Bedsheet", price: "₹25", img: "/images/bedsheet.png" },

    // 🔥 Traditional Wear (Premium)
    { name: "Bridal Lehenga / Ghagra Choli", price: "₹40", img: "/images/gagra.png" },
    { name: "Salwar Kameez Set (Women)", price: "₹20", img: "/images/salwar.png" },
    { name: "Men's Traditional Kurta Set", price: "₹25", img: "/images/mensalwar.png" },
    { name: "Silk Dhoti (Pattu Panche)", price: "₹30", img: "/images/panches.png" }
  ];

  return (
    <div className="pricing-section">

      {/* TITLE */}
      <h2 className="pricing-title">Transparent Pricing</h2>

      <p className="pricing-subtitle">
        Simple, affordable, and premium ironing service pricing per item.
        No hidden charges. Pay only for what you give.
      </p>

      {/* GRID */}
      <div className="pricing-grid">

        {items.map((item, i) => (
          <div key={i} className="pricing-card">

            <img src={item.img} alt={item.name} />

            <h3>{item.name}</h3>

            <p className="price">{item.price} / piece</p>

          </div>
        ))}

      </div>

      {/* CTA */}
      <div className="pricing-cta">
        <h3>Ready to get started?</h3>
        <p>Schedule your pickup now and experience hassle-free ironing service.</p>

        <button
          className="btn"
          onClick={() => navigate("/book")}
        >
          Schedule Pickup
        </button>
      </div>

    </div>
  );
}
