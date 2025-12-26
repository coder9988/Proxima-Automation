import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const productCategories = [
  {
    id: "automation",
    label: "Industrial Automation",
    icon: "🏭",
    title: "Industrial Automation and Control",
    description: "PLCs, drives, HMIs and control gear for industrial machines and processes.",
    ranges: ["PLC Controller", "HMI Panel", "Servo Drive", "VFD Drive"],
  },
  {
    id: "sensors",
    label: "Sensors & IoT",
    icon: "📡",
    title: "Smart Sensors and IoT Devices",
    description: "Real-time monitoring with industrial-grade sensors and IoT connectivity.",
    ranges: ["Temperature Sensor", "Vibration Sensor", "Pressure Transmitter", "Flow Meter"],
  },
  {
    id: "power",
    label: "Power Distribution",
    icon: "⚡",
    title: "Power Distribution Systems",
    description: "Protection, control and distribution for homes, buildings and industry.",
    ranges: ["Circuit Breaker", "Switchgear", "UPS Systems", "Transformer"],
  },
  {
    id: "software",
    label: "Software Solutions",
    icon: "💻",
    title: "Enterprise Software Platforms",
    description: "SCADA, MES, and AI-powered analytics for industrial operations.",
    ranges: ["SCADA Platform", "MES Suite", "Asset Management", "Predictive Analytics"],
  },
];

export default function Navbar() {
  const [showProducts, setShowProducts] = useState(false);
  const [activeCategory, setActiveCategory] = useState(productCategories[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount, setIsCartOpen } = useCart();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard", authRequired: true },
    { path: "/software", label: "Software" },
    { path: "/services", label: "Services" },
    { path: "/solutions", label: "Solutions" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-500/25 group-hover:shadow-green-500/40 transition-all">
              P
            </div>
            <span className="text-xl font-bold text-white">
              Proxima<span className="text-green-500">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-green-500/10 text-green-500"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Home
            </Link>

            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowProducts(true)}
              onMouseLeave={() => setShowProducts(false)}
            >
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all flex items-center gap-1">
                Products
                <svg className={`w-4 h-4 transition-transform ${showProducts ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega Menu */}
              {showProducts && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex">
                    {/* Left Panel */}
                    <div className="w-64 bg-gray-950 p-4 border-r border-gray-800">
                      {productCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/products?category=${cat.id}`}
                          onClick={() => setShowProducts(false)}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                            activeCategory.id === cat.id
                              ? "bg-green-500/10 border-l-2 border-green-500"
                              : "hover:bg-gray-800"
                          }`}
                          onMouseEnter={() => setActiveCategory(cat)}
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <span className={`text-sm font-medium ${activeCategory.id === cat.id ? 'text-green-500' : 'text-gray-300'}`}>
                            {cat.label}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* Right Panel */}
                    <div className="flex-1 p-6">
                      <Link 
                        to={`/products?category=${activeCategory.id}`}
                        onClick={() => setShowProducts(false)}
                        className="text-lg font-bold text-white mb-2 flex items-center gap-2 hover:text-green-500 transition-colors"
                      >
                        {activeCategory.title}
                        <span className="text-green-500">→</span>
                      </Link>
                      <p className="text-sm text-gray-400 mb-4">{activeCategory.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {activeCategory.ranges.map((range) => (
                          <Link
                            key={range}
                            to={`/products?category=${activeCategory.id}&search=${encodeURIComponent(range)}`}
                            onClick={() => setShowProducts(false)}
                            className="p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 border border-gray-700/50 hover:border-green-500/50 transition-all group"
                          >
                            <h4 className="text-sm font-semibold text-white group-hover:text-green-500 transition-colors">
                              {range}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">Explore range →</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(1).filter(link => !link.authRequired || isAuthenticated).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-green-500/10 text-green-500"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={() => {
                navigate("/products");
                setTimeout(() => setIsCartOpen(true), 100);
              }}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white">{user?.name}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-xs text-gray-400">{user?.email}</p>
                      <p className="text-xs text-green-500 capitalize">{user?.role}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/software"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      Monitor
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            {navLinks.filter(link => !link.authRequired || isAuthenticated).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive(link.path) ? "text-green-500 bg-green-500/10" : "text-gray-300"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 border-t border-gray-800 mt-4">
                  <p className="text-sm font-medium text-white mb-1">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  className="block mx-4 mt-2 px-5 py-3 bg-gray-800 text-white text-sm font-semibold rounded-xl text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/software"
                  className="block mx-4 mt-2 px-5 py-3 bg-green-500/10 text-green-500 text-sm font-semibold rounded-xl text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Monitor Machines
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full mx-4 mt-2 px-5 py-3 bg-red-500/10 text-red-500 text-sm font-semibold rounded-xl text-center"
                  style={{ width: 'calc(100% - 2rem)' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block mx-4 mt-4 px-5 py-3 bg-gray-800 text-white text-sm font-semibold rounded-xl text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block mx-4 mt-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-xl text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
