import { useNavigate } from "react-router-dom";

export default function Services() {

  const navigate = useNavigate();

  return (
    <div className="services" id="services">

      <div className="service-item" onClick={() => navigate("/book")}>
        <img src="/images/pickup.png" />
        <p>Free Pickup & Delivery</p>
      </div>

      <div className="service-item" onClick={() => navigate("/book")}>
        <img src="/images/iron.png" />
        <p>Quick & Reliable</p>
      </div>

      <div className="service-item" onClick={() => navigate("/book")}>
        <img src="/images/delivery.png" />
        <p>Satisfaction Guaranteed</p>
      </div>

    </div>
  );
}
