import { useNavigate } from "react-router-dom";

export default function Pricing() {

  const navigate = useNavigate();

  const items = [
    { name: "Shirt", price: "₹10", img: "/images/shirt.png" },
    { name: "T-Shirt", price: "₹8", img: "/images/tshirt.png" },
    { name: "Pants", price: "₹12", img: "/images/pants.png" },
    { name: "Jeans", price: "₹15", img: "/images/jeans.png" },
    { name: "Saree", price: "₹20", img: "/images/saree.png" },
    { name: "Bedsheet", price: "₹25", img: "/images/bedsheet.png" }
  ];

  return (
    <div className="pricing-section">

      <h2 className="pricing-title">Our Pricing</h2>

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
      <button
        className="btn"
        onClick={() => navigate("/book")}
        style={{ marginTop: "40px" }}
      >
        Book Pickup
      </button>

    </div>
  );
}
