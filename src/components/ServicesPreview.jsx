import { useNavigate } from "react-router-dom";

export default function ServicesPreview() {

  const navigate = useNavigate();

  return (
    <div className="services-preview">

      <h2>Our Services</h2>

      <div className="services-grid">

        <div className="service-card" onClick={() => navigate("/book")}>
          <img src="/images/wash.png" />
          <h3>Washing</h3>
        </div>

        <div className="service-card" onClick={() => navigate("/book")}>
          <img src="/images/dryclean.png" />
          <h3>Dry Cleaning</h3>
        </div>

        <div className="service-card" onClick={() => navigate("/book")}>
          <img src="/images/ironing.png" />
          <h3>Ironing</h3>
        </div>

        <div className="service-card" onClick={() => navigate("/book")}>
          <img src="/images/stain.png" />
          <h3>Stain Removal</h3>
        </div>

        <div className="service-card" onClick={() => navigate("/book")}>
          <img src="/images/sareerolling.png" />
          <h3>Saree Polishing & Rolling</h3>
        </div>
        
       <div className="service-card" onClick={() => navigate("/book")}>
          <img src="/images/pickup.png" />
          <h3>Free Pickup & Delivery</h3>
        </div>
        
      </div>

    </div>
  );
}
