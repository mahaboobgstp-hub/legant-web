import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "20px 40px",
      background: "white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
    }}>
      <h2 style={{ color: "#1E40AF" }}>Legant</h2>

      <div>
        <Link to="/" style={{ marginRight: 20 }}>Home</Link>
        <Link to="/book">Book</Link>
      </div>
    </div>
  );
}
