import React from "react";
import { Routes, Route } from "react-router-dom";
import { Footer, Fab } from "./shared/Shared";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import RealEstate from "./pages/RealEstate";
import Hospitality from "./pages/Hospitality";
import Renewable from "./pages/Renewable";
import Procurement from "./pages/Procurement";
import Telecom from "./pages/Telecom";

export default function App() {
  return (
    <div
      style={{
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/real-estate" element={<RealEstate />} />
        <Route path="/hospitality" element={<Hospitality />} />
        <Route path="/renewable" element={<Renewable />} />
        <Route path="/procurement" element={<Procurement />} />
        <Route path="/telecom" element={<Telecom />} />

        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
      <Fab />
    </div>
  );
}
