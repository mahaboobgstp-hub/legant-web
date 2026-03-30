import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase"; // your firebase config
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="navbar">

      <h2 className="logo">Elegant</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/track">Track Order</Link>
        <Link to="/contact" onClick={() => console.log("clicked contact")}>
  Contact
</Link>
      </div>

      {/* 🔥 CONDITIONAL BUTTON */}
      {user ? (
  <div>
    <span style={{ marginRight: 10 }}>
      {user.phoneNumber || "User"}
    </span>
    <button className="login-btn" onClick={handleLogout}>
      Logout
    </button>
  </div>
) : (
  <Link to="/login">
    <button className="login-btn">Login / Sign Up</button>
  </Link>
)}

    </div>
  );
}
