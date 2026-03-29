export default function Hero() {
  return (
    <div className="hero">

      <div className="hero-left">
        <h1>
          Premium Ironing Service <br />
          at Your Doorstep
        </h1>

        <p>Pickup & Delivery Available!</p>

        <button className="btn">Book Pickup</button>
      </div>

      <div className="hero-right">
        <img src="/images/delivery-boy.png" alt="delivery" />
      </div>

      {/* Background Icons */}
      <img src="/images/truck.png" className="bg-icon truck" />
      <img src="/images/hanger.png" className="bg-icon hanger" />
      <img src="/images/box.png" className="bg-icon box" />

    </div>
  );
}
