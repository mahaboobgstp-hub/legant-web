import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Book from "./pages/Book";

import Login from "./pages/Login";
import PriceMaster from "./pages/PriceMaster";
import Navbar from "./components/Navbar";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AgentUpdate from "./pages/AgentUpdate";

export default function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Book />} />
       
        <Route path="/login" element={<Login />} />
        <Route path="/price-master" element={<PriceMaster />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/agent" element={<AgentUpdate />} />
      </Routes>

    </BrowserRouter>
  );
}
