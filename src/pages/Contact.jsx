export default function Contact() {
  return (
    <div className="contact-section">

      <h2>Contact Us</h2>
      <p>Have questions? We're here to help you.</p>

      <div className="contact-container">

        {/* LEFT SIDE */}
        <div className="contact-info">

          <h3>Get in Touch</h3>

          <p><strong>📞 Phone:</strong> +91 9876543210</p>

          <p><strong>💬 WhatsApp:</strong> +91 9876543210</p>

          <p><strong>📧 Email:</strong> support@elegant.com</p>

          <p><strong>📍 Location:</strong> Your City, India</p>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
          >
            <button className="btn" style={{ marginTop: "15px" }}>
              Chat on WhatsApp
            </button>
          </a>

        </div>

        {/* RIGHT SIDE */}
        <div className="contact-form">

          <h3>Send a Message</h3>

          <input className="input" placeholder="Your Name" />

          <input className="input" placeholder="Phone Number" />

          <textarea
            className="input"
            placeholder="Your Message"
            rows="4"
          />

          <button className="btn">Send Message</button>

        </div>

      </div>

    </div>
  );
}
