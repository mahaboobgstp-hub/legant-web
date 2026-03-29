import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar">

      <h2 className="logo">Elegant</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <a href="#">Services</a>
        <a href="#">Pricing</a>
        <a href="#">Track Order</a>
        <a href="#">Contact</a>
      </div>

       <Link to="/login">
        <button className="login-btn">Login / Sign Up</button>
      </Link>

    </div>
  );
}
