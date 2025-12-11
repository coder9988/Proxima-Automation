import { useState, useRef } from "react";
import "../css/home.css";
// import "https://cdn.tailwindcss.com/";
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const sliderRef = useRef(null);

  const items = [
    "Low voltage products and systems",
    "Business automation & control",
    "Medium voltage distribution",
    "Critical Power, cooling and racks",
    "Residential and small buildings",
    "Industry automation and control",
  ];

  const categoriesData = {
    "Low voltage products and systems": [
      "Circuit Breakers",
      "Switch Disconnectors",
      "Fuse Switches",
      "Transformers",
    ],
    "Business automation & control": [
      "PLC Controllers",
      "HMI Displays",
      "SCADA Systems",
      "Sensors",
    ],
    "Medium voltage distribution": ["MV Switchgear", "Transformers"],
    "Critical Power, cooling and racks": ["UPS Systems", "Cooling Units"],
    "Residential and small buildings": ["Switches", "Outlets", "Feeder Panels"],
    "Industry automation and control": ["Servo Drives", "Motors", "Robotics"],
  };

  const nextSlide = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };
  const prevSlide = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  return (
    <>
      <h1>Home Page</h1>

      <div className="slider-container">
        <button className="slider-btn" onClick={prevSlide}>
          ◀
        </button>

        <div className="business-lines" ref={sliderRef}>
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedCategory(item)}
              className={selectedCategory === item ? "active" : ""}
            >
              {item}
            </div>
          ))}
        </div>

        <button className="slider-btn" onClick={nextSlide}>
          ▶
        </button>
      </div>

      {selectedCategory && (
        <div className="layout">
          <div className="left-panel">
            {categoriesData[selectedCategory].map((cat, i) => (
              <p key={i}>{cat}</p>
            ))}
          </div>

          <div className="right-panel">
            {categoriesData[selectedCategory].map((product, i) => (
              <div className="product-card" key={i}>
                <h3>{product}</h3>
                <p>Product description here</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mostordereds-section h-3/4 border border-black border-4 flex flex-col p-4 ">
        <div className="border border-black border-4 border-solid w-full h-1/3 flex items-center justify-center mb-4">
          Layer 1
        </div>
        <div className="border border-black border-4 border-solid w-full h-1/3  flex items-center justify-center mb-4">
          Layer 2
        </div>
        <div className="border border-black border-4 border-solid w-full h-1/3  flex items-center flex justify-start mb-4 gap-4 p-4">
          <div className="border border-black border-2 h-full mxy-10 w-1/3">
            <div className="border border-black border-2 w-full h-1/2">
              Products list A-Z
            </div>
            <div className="border border-black border-2 w-full h-1/2">
              Select products
            </div>
          </div>
          <div className="border border-black border-2 h-full mxy-10 w-1/3">
            <div className="border border-black border-2 w-full h-1/2">
              image
            </div>
            <div className="border border-black border-2 w-full h-1/2">
              image
            </div>
          </div>
          <div className="border border-black border-2 h-full mxy-10 w-1/3">
            <div className="border border-black border-2 w-full h-1/2">
              Browse by master range
            </div>
            <div className="border border-black border-2 w-full h-1/2">
              Looking for products documents or software
            </div>
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-section">
            <h2>Company</h2>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>

          <div class="footer-section">
            <h2>Products</h2>
            <a href="#">Web App</a>
            <a href="#">Mobile App</a>
            <a href="#">API Services</a>
          </div>

          <div class="footer-section">
            <h2>Follow Us</h2>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
          </div>
        </div>

        <p class="footer-bottom">© 2025 YourCompany. All rights reserved.</p>
      </footer>
    </>
  );
}
