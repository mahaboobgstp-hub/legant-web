import { Link } from "react-router-dom";
import "../assets/styles.css";

export default function Navbar() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 40px",
      background: "white"
    }}>
      <h2>Legant</h2>

      <div>
        <Link to="/" style={{ marginRight: 20 }}>Home</Link>
        <Link to="/book">Book</Link>
      </div>
    </div>
  );
}
