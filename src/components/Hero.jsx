import { useNavigate } from "react-router-dom";

export default function Hero() {

  const navigate = useNavigate();

  return (
    <div className="hero">

      <div className="hero-left">

        <h1>
          Premium Laundry & Dry Clean <br />
          Services at Your Doorstep
        </h1>

        <p className="hero-sub">
          Washing • Dry Cleaning • Ironing • Stain Removal • Saree Care
        </p>

        {/* 🔥 PHONE = BUSINESS DRIVER */}
        <p className="hero-phone">
          Call or WhatsApp: <span>+91 98765 43210</span>
        </p>

        <div className="hero-buttons">

          <button className="btn" onClick={() => navigate("/book")}>
            Book Pickup
          </button>

        
        </div>

      </div>

      <div className="hero-right">
        <img src="/images/deliveryboy.png" />
      </div>

    </div>
  );
}
