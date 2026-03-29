import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h1>Legant</h1>
      <p>Premium Ironing Service</p>

      <button onClick={() => navigate("/book")}>
        Book Pickup
      </button>
    </div>
  );
}
