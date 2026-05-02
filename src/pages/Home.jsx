import Hero from "../components/Hero";
import ServicesPreview from "../components/ServicesPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesPreview />

      <div style={{ textAlign: "center", padding: "40px" }}>
  <h2>Why Choose Elegant?</h2>

  <p>✔ Free Pickup & Delivery</p>
  <p>✔ Affordable Pricing</p>
  <p>✔ Trusted Professionals</p>
  <p>✔ Fast Turnaround</p>
</div>
    </>
  );
}
