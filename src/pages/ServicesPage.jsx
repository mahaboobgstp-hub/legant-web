import { useNavigate } from "react-router-dom";
import Services from "../components/Services";

export default function ServicesPage() {

  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", position: "relative" }}>

      <h2>Our Services</h2>

      <Services />

      {/* 🔥 FLOATING BUTTON */}
      <button
        className="floating-btn"
        onClick={() => navigate("/book")}
      >
        Book Pickup
      </button>

    </div>
  );
}
