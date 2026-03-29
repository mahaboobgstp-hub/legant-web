export default function Hero() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "50px"
    }}>
      <div>
        <h1>Premium Ironing Service</h1>
        <p>Pickup & Delivery at your doorstep</p>
        <button className="btn">Book Pickup</button>
      </div>

      <img src="/images/hero.png" width="300" />
    </div>
  );
}
