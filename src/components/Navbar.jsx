import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (u?.email === "admin@legant.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="navbar">

      <h2 className="logo">Elegant</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <a href="#services">Services</a>
        <Link to="/pricing">Pricing</Link>
        
        <Link to="/contact">Contact</Link>

        {/* 🔥 ADMIN LINKS */}
        {isAdmin && (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/agent">Agent</Link>
          </>
        )}
      </div>

      {user ? (
        <button className="login-btn" onClick={logout}>
          Logout
        </button>
      ) : (
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
      )}

    </div>
  );
}
