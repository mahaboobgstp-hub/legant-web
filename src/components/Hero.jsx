
  import { useNavigate } from "react-router-dom";

export default function Hero() {

  const navigate = useNavigate();

  return (
    <div className="hero">

      {/* LEFT */}
      <div className="hero-left">

        <h1>
          Premium Ironing Service <br />
          at Your Doorstep
        </h1>

        <p className="hero-sub">
          Pickup & Delivery Available | Fast & Reliable
        </p>

        {/* 🔥 PHONE CTA */}
        <p className="hero-phone">
          📞 Call Now: <span>+91 98765 43210</span>
        </p>

        <div className="hero-buttons">
          <button
            className="btn"
            onClick={() => navigate("/book")}
          >
            Book Pickup
          </button>

          <a href="tel:+919876543210">
            <button className="btn-outline">
              Call Now
            </button>
          </a>
        </div>

      </div>

      {/* RIGHT IMAGE */}
      <div className="hero-right">
        <img src="/images/delivery-boy.png" alt="delivery" />
      </div>

    </div>
  );
}
