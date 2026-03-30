import { useNavigate } from "react-router-dom";

export default function ServicesPreview() {

  const navigate = useNavigate();

  return (
    <div className="services-preview">

      <div className="services-grid">

        <div
          className="service-card"
          onClick={() => navigate("/book")}
        >
          <img src="/images/truck.png" alt="pickup" />
          <h3>Free Pickup & Delivery</h3>
        </div>

        <div
          className="service-card"
          onClick={() => navigate("/book")}
        >
          <img src="/images/ironing.png" alt="ironing" />
          <h3>Quick & Reliable</h3>
        </div>

        <div
          className="service-card"
          onClick={() => navigate("/book")}
        >
          <img src="/images/box.png" alt="quality" />
          <h3>Satisfaction Guaranteed</h3>
        </div>

      </div>

    </div>
  );
}
