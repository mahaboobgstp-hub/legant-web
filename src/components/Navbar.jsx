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
        <a href="#services">Services</a>
        <a href="#">Pricing</a>
        <Link to="/track">Track Order</Link>
        <a href="#">Contact</a>
      </div>

      {/* 🔥 CONDITIONAL BUTTON */}
      {user ? (
        <button className="login-btn" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <Link to="/login">
          <button className="login-btn">Login / Sign Up</button>
        </Link>
      )}

    </div>
  );
}
