import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/home";
import Products from "./pages/Products";
import Software from "./pages/Software";
import Services from "./pages/Services";
import Solutions from "./pages/Solutions";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/software" element={<Software />} />
        <Route path="/services" element={<Services />} />
        <Route path="/solutions" element={<Solutions />} />
      </Routes>
    </>
  );
}

export default App;
