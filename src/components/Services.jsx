import { useNavigate } from "react-router-dom";

export default function Services() {

  const navigate = useNavigate();

  return (
    <div className="services-section">

      <h2 className="services-title">Our Services</h2>

      <div className="services-grid">

        <div className="service-card" onClick={() => navigate("/book")}>
          <img src="/images/pickup.png" />
          <h3>Doorstep Pickup & Delivery</h3>
          <p>
            We collect your clothes from your home and deliver them back fresh,
            neatly ironed, and ready to wear.
          </p>
        </div>

        <div className="service-card" onClick={() => navigate("/book")}>
          <img src="/images/ironing.png" />
          <h3>Professional Ironing</h3>
          <p>
            High-quality steam ironing handled with care to ensure your clothes
            look crisp and perfect every time.
          </p>
        </div>

        <div className="service-card" onClick={() => navigate("/book")}>
          <img src="/images/delivery.png" />
          <h3>Quality & Satisfaction Guaranteed</h3>
          <p>
            We ensure reliable service, timely delivery, and complete
            satisfaction with every order.
          </p>
        </div>

      </div>

    </div>
  );
}
