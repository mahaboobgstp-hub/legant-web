import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/pricing.css";

export default function Pricing() {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState(() => {
  const map = {
    washing: "wash",
    ironing: "iron",
    drycleaning: "dry",
    stain: "stain",
    saree: "saree"
  };

  return map[location.state?.service] || "wash";
});
  const location = useLocation();
  const selectedService = location.state?.service;
  const services = {
    wash: {
      title: "Wash",
      image: "/images/wash.png",
      items: [
        { name: "Washing (Per Kg)", price: "₹70 / kg" }
      ]
    },

    iron: {
      title: "Iron",
      image: "/images/ironing.png",
      items: [
        { name: "Shirt", price: "₹10", img: "/images/shirt.png" },
        { name: "T-Shirt", price: "₹8", img: "/images/tshirt.png" },
        { name: "Pants / Trousers", price: "₹12", img: "/images/pants.png" },
        { name: "Jeans", price: "₹15", img: "/images/jeans.png" },
        { name: "Saree", price: "₹20", img: "/images/saree.png" },
        { name: "Bedsheet", price: "₹25", img: "/images/bedsheet.png" },
        { name: "Bridal Lehenga", price: "₹40", img: "/images/gagra.png" },
        { name: "Salwar Kameez", price: "₹20", img: "/images/salwar.png" },
        { name: "Kurta Set", price: "₹25", img: "/images/mensalwar.png" },
        { name: "Silk Dhoti", price: "₹30", img: "/images/panches.png" }
      ]
    },

    dry: {
      title: "Dry Clean",
      image: "/images/dryclean.png",
      items: [
        { name: "Saree", price: "₹150" },
        { name: "Blazer", price: "₹200" },
        { name: "Suit", price: "₹250" },
        { name: "Jacket", price: "₹180" },
        { name: "Lehenga", price: "₹300" }
      ]
    },

    stain: {
      title: "Stain Removal",
      image: "/images/stain.png",
      items: [
        { name: "Light Stain", price: "₹30" },
        { name: "Medium Stain", price: "₹60" },
        { name: "Heavy Stain", price: "₹100" }
      ]
    },

    saree: {
      title: "Saree Care",
      image: "/images/sareerolling.png",
      items: [
        { name: "Saree Rolling", price: "₹80" },
        { name: "Saree Polishing", price: "₹120" }
      ]
    }
  };

  const service = services[activeService];

    return (
  <div className="pricing-container">

    {/* LEFT SIDE (Services + Items) */}
    <div className="left-panel">

      <h2 className="logo">CleanUP</h2>

      <div className="content-row">

        {/* SERVICES */}
        <div className="service-buttons">
          {Object.keys(services).map((key) => (
            <button
              key={key}
              className={activeService === key ? "active" : ""}
              onClick={() => setActiveService(key)}
            >
              {services[key].title}
            </button>
          ))}
        </div>

        {/* ITEMS (NOW CENTER) */}
        <div className="price-list">
          {service.items.map((item, i) => (
            <div key={i} className="price-item">

              {item.img && <img src={item.img} alt={item.name} />}

              <span>{item.name}</span>
              <span>{item.price}</span>

            </div>
          ))}
        </div>

      </div>

      {/* CTA */}
      <button
        className="checkout-btn"
        onClick={() => navigate("/book")}
      >
        Schedule Pickup
      </button>

    </div>

    {/* RIGHT IMAGE */}
    <div className="right-panel">
      <img src={service.image} alt={service.title} />
    </div>

  </div>
);
}
