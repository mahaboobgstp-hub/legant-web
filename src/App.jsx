import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Book from "./pages/Book";
import Track from "./pages/Track";
import Login from "./pages/Login";
import ServicesPage from "./pages/ServicesPage";
import Navbar from "./components/Navbar";
import Pricing from "./pages/Pricing";

export default function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Book />} />
        <Route path="/track" element={<Track />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>

    </BrowserRouter>
  );
}
