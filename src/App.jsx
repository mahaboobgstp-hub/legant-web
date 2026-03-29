import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookPickup from "./pages/BookPickup";
import OrderSummary from "./pages/OrderSummary";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookPickup />} />
        <Route path="/summary" element={<OrderSummary />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
