export default function Services() {
  return (
    <div className="container">
      <h2>Our Services</h2>

      <div style={{ display: "flex", gap: 20 }}>
        
        <div className="card">
          <img src="/images/pickup.png" width="60" />
          <h3>Pickup</h3>
          <p>We collect clothes from your home</p>
        </div>

        <div className="card">
          <img src="/images/ironing.png" width="60" />
          <h3>Ironing</h3>
          <p>Professional ironing service</p>
        </div>

        <div className="card">
          <img src="/images/delivery.png" width="60" />
          <h3>Delivery</h3>
          <p>Delivered back neatly</p>
        </div>

      </div>
    </div>
  );
}
