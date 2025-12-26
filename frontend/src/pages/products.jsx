import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

const productCategories = [
  {
    id: "automation",
    name: "Industrial Automation",
    icon: "🏭",
    description: "Complete automation solutions for modern manufacturing",
    products: [
      {
        id: "auto-1",
        name: "PLC Controller Pro X500",
        description:
          "Advanced programmable logic controller with 256 I/O points, Ethernet connectivity, and integrated motion control capabilities.",
        price: "₹2,499",
        image: "🎛️",
        specs: [
          "256 I/O Points",
          "EtherNet/IP",
          "Motion Control",
          "IEC 61131-3",
        ],
        stock: 15,
        rating: 4.8,
        reviews: 124,
      },
      {
        id: "auto-2",
        name: 'HMI Panel 15" Touch',
        description:
          "Industrial-grade touch screen interface with high-resolution display, multi-protocol support, and rugged design for harsh environments.",
        price: "₹1,299",
        image: "📱",
        specs: ['15" Display', "1080p Resolution", "IP65 Rated", "Multi-Touch"],
        stock: 23,
        rating: 4.6,
        reviews: 89,
      },
      {
        id: "auto-3",
        name: "Servo Drive System 5kW",
        description:
          "High-precision servo drive with advanced motion algorithms, real-time feedback, and compact design for tight spaces.",
        price: "₹899",
        image: "⚙️",
        specs: ["5kW Power", "32-bit Processor", "EtherCAT", "Safety STO"],
        stock: 31,
        rating: 4.9,
        reviews: 156,
      },
      {
        id: "auto-4",
        name: "VFD 20HP Smart Drive",
        description:
          "Variable frequency drive with built-in PLC, energy optimization, and predictive maintenance features.",
        price: "₹749",
        image: "🔄",
        specs: ["20HP Rating", "Built-in PLC", "Energy Save", "IoT Ready"],
        stock: 45,
        rating: 4.7,
        reviews: 203,
      },
      {
        id: "auto-5",
        name: "Industrial Robot Arm 6-Axis",
        description:
          "Versatile 6-axis robot arm with 10kg payload capacity, ideal for pick-and-place, welding, and assembly applications.",
        price: "₹15,999",
        image: "🤖",
        specs: ["6-Axis", "10kg Payload", "1200mm Reach", "±0.02mm Accuracy"],
        stock: 5,
        rating: 4.9,
        reviews: 67,
      },
      {
        id: "auto-6",
        name: "Conveyor Motor Drive",
        description:
          "Specialized drive for conveyor applications with synchronized multi-motor control and energy regeneration.",
        price: "₹1,199",
        image: "🔧",
        specs: ["Multi-Motor Sync", "Regenerative", "Modbus RTU", "IP54"],
        stock: 28,
        rating: 4.5,
        reviews: 91,
      },
    ],
  },
  {
    id: "sensors",
    name: "Sensors & IoT",
    icon: "📡",
    description: "Smart sensors and IoT devices for real-time monitoring",
    products: [
      {
        id: "sensor-1",
        name: "Industrial Temperature Sensor",
        description:
          "High-accuracy RTD temperature sensor with 4-20mA output, suitable for extreme environments up to 500°C.",
        price: "₹129",
        image: "🌡️",
        specs: [
          "-50 to 500°C",
          "±0.1°C Accuracy",
          "4-20mA Output",
          "SS316 Housing",
        ],
        stock: 156,
        rating: 4.7,
        reviews: 312,
      },
      {
        id: "sensor-2",
        name: "Vibration Analyzer Pro",
        description:
          "3-axis vibration sensor with built-in FFT analysis, wireless connectivity, and predictive maintenance algorithms.",
        price: "₹249",
        image: "📳",
        specs: ["3-Axis", "FFT Analysis", "Wireless", "Battery: 2 Years"],
        stock: 67,
        rating: 4.8,
        reviews: 178,
      },
      {
        id: "sensor-3",
        name: "Smart Pressure Transmitter",
        description:
          "Digital pressure transmitter with HART protocol, 0.04% accuracy, and built-in diagnostics.",
        price: "₹349",
        image: "🔵",
        specs: ["0-1000 PSI", "0.04% Accuracy", "HART 7", "LCD Display"],
        stock: 89,
        rating: 4.6,
        reviews: 145,
      },
      {
        id: "sensor-4",
        name: "Ultrasonic Flow Meter",
        description:
          "Non-invasive clamp-on flow meter for liquids, easy installation without pipe cutting.",
        price: "₹599",
        image: "💧",
        specs: ["Clamp-On", "±1% Accuracy", "DN25-DN300", "Data Logging"],
        stock: 34,
        rating: 4.5,
        reviews: 87,
      },
      {
        id: "sensor-5",
        name: "Proximity Sensor Kit",
        description:
          "Complete kit with inductive, capacitive, and photoelectric sensors for various detection needs.",
        price: "₹189",
        image: "🎯",
        specs: ["3 Sensor Types", "PNP/NPN", "M12 Connector", "IP67"],
        stock: 112,
        rating: 4.7,
        reviews: 234,
      },
      {
        id: "sensor-6",
        name: "IoT Gateway Hub",
        description:
          "Central hub for connecting multiple sensors, with cloud connectivity, edge computing, and protocol conversion.",
        price: "₹449",
        image: "🌐",
        specs: ["100+ Sensors", "MQTT/OPC-UA", "Edge Computing", "4G/WiFi"],
        stock: 42,
        rating: 4.8,
        reviews: 156,
      },
    ],
  },
  {
    id: "power",
    name: "Power Distribution",
    icon: "⚡",
    description: "Reliable power management and distribution solutions",
    products: [
      {
        id: "power-1",
        name: "MCCB 400A 3-Pole",
        description:
          "Molded case circuit breaker with adjustable thermal-magnetic trip, high breaking capacity.",
        price: "₹189",
        image: "🔌",
        specs: ["400A Rating", "3-Pole", "50kA Breaking", "Adjustable Trip"],
        stock: 78,
        rating: 4.8,
        reviews: 189,
      },
      {
        id: "power-2",
        name: "MV Switchgear Panel",
        description:
          "Medium voltage switchgear assembly with vacuum circuit breakers, metering, and protection relays.",
        price: "₹14,999",
        image: "🎚️",
        specs: ["11kV/630A", "Vacuum CB", "IEC 62271", "Arc Resistant"],
        stock: 3,
        rating: 4.9,
        reviews: 45,
      },
      {
        id: "power-3",
        name: "Online UPS 10kVA",
        description:
          "Double-conversion online UPS with pure sine wave output, hot-swappable batteries, and remote monitoring.",
        price: "₹2,899",
        image: "🔋",
        specs: [
          "10kVA/9kW",
          "Online Double-Conversion",
          "0ms Transfer",
          "SNMP Card",
        ],
        stock: 19,
        rating: 4.7,
        reviews: 134,
      },
      {
        id: "power-4",
        name: "Dry-Type Transformer 500kVA",
        description:
          "Cast resin dry-type transformer for indoor installation, low noise, and maintenance-free operation.",
        price: "₹8,499",
        image: "⚡",
        specs: ["500kVA", "11kV/415V", "Class F Insulation", "IP21"],
        stock: 7,
        rating: 4.6,
        reviews: 56,
      },
      {
        id: "power-5",
        name: "Power Factor Controller",
        description:
          "Automatic power factor correction controller with 12 stages, harmonic measurement, and energy monitoring.",
        price: "₹549",
        image: "📊",
        specs: ["12 Stages", "0.99 PF Target", "Harmonic Analysis", "Modbus"],
        stock: 52,
        rating: 4.5,
        reviews: 98,
      },
      {
        id: "power-6",
        name: "Surge Protection Device",
        description:
          "Type 1+2 combined surge protector for complete facility protection against lightning and switching surges.",
        price: "₹299",
        image: "🛡️",
        specs: ["Type 1+2", "100kA", "Remote Signal", "Pluggable Modules"],
        stock: 89,
        rating: 4.7,
        reviews: 167,
      },
    ],
  },
  {
    id: "software",
    name: "Software Solutions",
    icon: "💻",
    description: "Enterprise software for industrial operations",
    products: [
      {
        id: "soft-1",
        name: "SCADA Platform Enterprise",
        description:
          "Full-featured SCADA system with unlimited tags, redundancy, historian, and mobile access.",
        price: "₹9,999",
        image: "📊",
        specs: ["Unlimited Tags", "Hot Standby", "Web Client", "Historian"],
        stock: 999,
        rating: 4.8,
        reviews: 234,
      },
      {
        id: "soft-2",
        name: "MES Manufacturing Suite",
        description:
          "Complete manufacturing execution system for production tracking, quality management, and OEE monitoring.",
        price: "₹14,999",
        image: "🏭",
        specs: [
          "Production Tracking",
          "Quality Module",
          "OEE Dashboard",
          "ERP Integration",
        ],
        stock: 999,
        rating: 4.9,
        reviews: 178,
      },
      {
        id: "soft-3",
        name: "Asset Management Pro",
        description:
          "Comprehensive asset lifecycle management with preventive maintenance scheduling and spare parts inventory.",
        price: "₹4,999",
        image: "📋",
        specs: ["Work Orders", "PM Scheduling", "Inventory", "Mobile App"],
        stock: 999,
        rating: 4.6,
        reviews: 145,
      },
      {
        id: "soft-4",
        name: "AI Predictive Analytics",
        description:
          "Machine learning platform for predictive maintenance, anomaly detection, and failure prediction.",
        price: "₹7,999",
        image: "🤖",
        specs: [
          "ML Algorithms",
          "Anomaly Detection",
          "RUL Prediction",
          "API Access",
        ],
        stock: 999,
        rating: 4.7,
        reviews: 112,
      },
      {
        id: "soft-5",
        name: "Energy Management System",
        description:
          "Monitor and optimize energy consumption across facilities with real-time analytics and reporting.",
        price: "₹5,999",
        image: "🔋",
        specs: [
          "Real-time Monitoring",
          "Cost Analysis",
          "ISO 50001",
          "Dashboards",
        ],
        stock: 999,
        rating: 4.5,
        reviews: 89,
      },
      {
        id: "soft-6",
        name: "PLC Programming Suite",
        description:
          "Universal PLC programming software supporting multiple vendors with simulation and version control.",
        price: "₹1,999",
        image: "💻",
        specs: ["Multi-Vendor", "IEC 61131-3", "Simulator", "Git Integration"],
        stock: 999,
        rating: 4.8,
        reviews: 267,
      },
    ],
  },
];

// Product Detail Modal Component
function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-xl font-bold text-white">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl h-80 flex items-center justify-center text-9xl">
              {product.image}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-yellow-500">
                  {"★".repeat(Math.floor(product.rating))}
                  {"☆".repeat(5 - Math.floor(product.rating))}
                </div>
                <span className="text-gray-400 text-sm">
                  ({product.reviews} reviews)
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                {product.name}
              </h3>
              <p className="text-gray-400 mb-4">{product.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-green-500">
                  {product.price}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ₹{
                  product.stock > 20 
                    ? "bg-green-500/10 text-green-500" 
                    : product.stock > 5 
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-red-500/10 text-red-500"
                }`}
                >
                  {product.stock > 20
                    ? "In Stock"
                    : product.stock > 0
                    ? `Only ₹{product.stock} left`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">
                  Key Specifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.specs.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-lg"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center bg-gray-800 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-white hover:bg-gray-700 rounded-l-xl transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-white font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-4 py-2 text-white hover:bg-gray-700 rounded-r-xl transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-400 text-sm">
                  Total:{" "}
                  <span className="text-white font-bold">
                    ₹
                    {(
                      parseFloat(product.price.replace(/[₹,]/g, "")) * quantity
                    ).toLocaleString()}
                  </span>
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 border-t border-gray-800 pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-2xl mb-2">🚚</div>
                <h4 className="font-semibold text-white mb-1">Free Shipping</h4>
                <p className="text-gray-400 text-sm">On orders over ₹500</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-2xl mb-2">🔄</div>
                <h4 className="font-semibold text-white mb-1">
                  30-Day Returns
                </h4>
                <p className="text-gray-400 text-sm">Easy returns policy</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-2xl mb-2">🛡️</div>
                <h4 className="font-semibold text-white mb-1">
                  2-Year Warranty
                </h4>
                <p className="text-gray-400 text-sm">
                  Full manufacturer warranty
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Sidebar Component
function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  removeFromCart,
  getCartTotal,
  clearCart,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🛒 Shopping Cart
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-400 mb-6">
                Add some products to get started
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-gray-800/50 rounded-xl p-4"
                >
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-3xl">
                    {item.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm mb-1">
                      {item.name}
                    </h4>
                    <p className="text-green-500 font-semibold">{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 bg-gray-700 rounded text-white text-sm hover:bg-gray-600 transition-colors"
                      >
                        −
                      </button>
                      <span className="text-white text-sm w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 bg-gray-700 rounded text-white text-sm hover:bg-gray-600 transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer - Fixed at bottom */}
        {cartItems.length > 0 && (
          <div className="flex-shrink-0 p-6 border-t border-gray-800 bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-2xl font-bold text-white">
                ₹{getCartTotal().toLocaleString()}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="px-4 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
              <Link
                to="/checkout"
                onClick={onClose}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl text-center hover:shadow-lg hover:shadow-green-500/25 transition-all"
              >
                Checkout →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(productCategories[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useCart();

  // Handle URL params for category and search
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    if (categoryParam) {
      const found = productCategories.find(
        (cat) =>
          cat.id === categoryParam ||
          cat.name.toLowerCase().includes(categoryParam.toLowerCase())
      );
      if (found) setActiveCategory(found);
    }

    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  // Update URL when category changes
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSearchParams({ category: cat.id });
  };

  // Filter and sort products
  const filteredProducts = activeCategory.products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (
            parseFloat(a.price.replace(/[₹,]/g, "")) -
            parseFloat(b.price.replace(/[₹,]/g, ""))
          );
        case "price-high":
          return (
            parseFloat(b.price.replace(/[₹,]/g, "")) -
            parseFloat(a.price.replace(/[₹,]/g, ""))
          );
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleAddToCart = (product, e) => {
    e?.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg shadow-green-500/25 flex items-center justify-center hover:scale-110 transition-transform"
      >
        <span className="text-2xl">🛒</span>
        {getCartCount() > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        )}
      </button>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-green-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-green-500">Products</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Explore our comprehensive range of industrial automation products,
              sensors, power solutions, and software platforms.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 pl-12 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {productCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ₹{
                  activeCategory.id === cat.id
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                    : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700"
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Category Description & Sort */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">
                {activeCategory.name}
              </h2>
              <p className="text-gray-400 text-sm">
                {activeCategory.description}
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-green-500 cursor-pointer appearance-none pr-10 min-w-[160px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "16px",
                }}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all duration-300 cursor-pointer flex flex-col"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                  {product.image}
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-medium rounded-full">
                      Low Stock
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col h-full">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center text-yellow-500 text-sm">
                      {"★".repeat(Math.floor(product.rating))}
                    </div>
                    <span className="text-gray-500 text-xs">
                      ({product.reviews})
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-500 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                    {product.description}
                  </p>

                  {/* Specs Preview */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.specs.slice(0, 2).map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded"
                      >
                        {spec}
                      </span>
                    ))}
                    {product.specs.length > 2 && (
                      <span className="px-2 py-0.5 text-gray-500 text-xs">
                        +{product.specs.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xl font-bold text-green-500 whitespace-nowrap">
                      {product.price}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="px-4 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <span>🛒</span> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-400">Try adjusting your search term</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need Custom Solutions?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Our team can help you design and implement custom automation
              solutions tailored to your specific needs.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        getCartTotal={getCartTotal}
        clearCart={clearCart}
      />
    </div>
  );
}
