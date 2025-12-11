// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import "../css/home.css";

const productCategories = [
  {
    id: "low-voltage",
    label: "Low Voltage Products and Systems",
    icon: "🧰",
    title: "Low Voltage Products and Systems",
    description:
      "Protection, control and distribution for homes, buildings and industry.",
    ranges: ["MCB & MCCB", "Contactors", "Switchboards", "Distribution Panels"],
  },
  {
    id: "residential",
    label: "Residential and Small Business",
    icon: "🏠",
    title: "Residential and Small Business",
    description:
      "Smart, safe and efficient solutions for homes, shops and small offices.",
    ranges: ["Smart Home", "Switches & Sockets", "Home Energy Monitoring"],
  },
  {
    id: "industrial",
    label: "Industrial Automation and Control",
    icon: "🏭",
    title: "Industrial Automation and Control",
    description:
      "PLCs, drives, HMIs and control gear for industrial machines and processes.",
    ranges: ["PLC Series", "Variable Speed Drives", "HMI Panels"],
  },
  {
    id: "solar",
    label: "Solar & Energy Storage",
    icon: "☀️",
    title: "Solar & Energy Storage",
    description:
      "Inverters, controllers and storage solutions for solar power systems.",
    ranges: ["Solar Inverters", "Battery Storage", "Monitoring Gateways"],
  },
];

export default function Navbar() {
  const [showProducts, setShowProducts] = useState(false);
  const [activeCategory, setActiveCategory] = useState(productCategories[0]);

  return (
    <nav className="navbar">
      {/* <div className="logo">SmartEnergy Hub</div> */}

      <ul className="nav-links">
        {/* PRODUCTS with mega menu */}
        <li className="nav-item">
          <Link to="/">Home</Link>
        </li>
        <li
          className="nav-item products-item"
          onMouseEnter={() => setShowProducts(true)}
          onMouseLeave={() => setShowProducts(false)}
        >
          <span className="nav-link-text">Products ▾</span>

          {showProducts && (
            <div className="mega-menu">
              {/* Left column: categories */}
              <ul className="mega-left">
                {productCategories.map((cat) => (
                  <li
                    key={cat.id}
                    className={
                      "mega-left-item" +
                      (activeCategory.id === cat.id ? " active" : "")
                    }
                    onMouseEnter={() => setActiveCategory(cat)}
                  >
                    <span className="mega-left-icon">{cat.icon}</span>
                    <span className="mega-left-label">{cat.label}</span>
                  </li>
                ))}
              </ul>

              {/* Right column: details for activeCategory */}
              <div className="mega-right">
                <h3 className="mega-title">
                  {activeCategory.title} <span>›</span>
                </h3>
                <p className="mega-desc">{activeCategory.description}</p>

                <div className="mega-ranges">
                  {activeCategory.ranges.map((range) => (
                    <div key={range} className="mega-range-card">
                      <h4>{range} ›</h4>
                      <p>Short description text about {range}…</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </li>
        <li className="nav-item">
          <Link to="/software">Software</Link>
        </li>
        <li className="nav-item">
          <Link to="/services">Services</Link>
        </li>
        <li className="nav-item">
          <Link to="/solutions">Solutions</Link>
        </li>
      </ul>
    </nav>
  );
}
