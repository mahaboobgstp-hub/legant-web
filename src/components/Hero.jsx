export default function Hero() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "60px"
    }}>
      <div>
        <h1 style={{ fontSize: "40px" }}>
          Premium Ironing Service 👕
        </h1>

        <p style={{ color: "#555", margin: "20px 0" }}>
          Doorstep pickup & delivery with trusted handling
        </p>

        <button className="btn">Book Pickup</button>
      </div>

      <img src="/images/hero.png" width="350" />
    </div>
  );
}
