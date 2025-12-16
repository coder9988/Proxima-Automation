import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const productCategories = [
  {
    id: "low-voltage",
    label: "Low Voltage Products",
    icon: "⚡",
    title: "Low Voltage Products and Systems",
    description: "Protection, control and distribution for homes, buildings and industry.",
    ranges: ["MCB & MCCB", "Contactors", "Switchboards", "Distribution Panels"],
  },
  {
    id: "residential",
    label: "Residential Solutions",
    icon: "🏠",
    title: "Residential and Small Business",
    description: "Smart, safe and efficient solutions for homes, shops and small offices.",
    ranges: ["Smart Home", "Switches & Sockets", "Home Energy Monitoring"],
  },
  {
    id: "industrial",
    label: "Industrial Automation",
    icon: "🏭",
    title: "Industrial Automation and Control",
    description: "PLCs, drives, HMIs and control gear for industrial machines and processes.",
    ranges: ["PLC Series", "Variable Speed Drives", "HMI Panels"],
  },
  {
    id: "solar",
    label: "Solar & Energy",
    icon: "☀️",
    title: "Solar & Energy Storage",
    description: "Inverters, controllers and storage solutions for solar power systems.",
    ranges: ["Solar Inverters", "Battery Storage", "Monitoring Gateways"],
  },
];

export default function Navbar() {
  const [showProducts, setShowProducts] = useState(false);
  const [activeCategory, setActiveCategory] = useState(productCategories[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/software", label: "Software" },
    { path: "/services", label: "Services" },
    { path: "/solutions", label: "Solutions" },
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
                        <div
                          key={cat.id}
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
                        </div>
                      ))}
                    </div>

                    {/* Right Panel */}
                    <div className="flex-1 p-6">
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        {activeCategory.title}
                        <span className="text-green-500">→</span>
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">{activeCategory.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {activeCategory.ranges.map((range) => (
                          <Link
                            key={range}
                            to="/products"
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

            {navLinks.slice(1).map((link) => (
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
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
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
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl py-2">
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-xs text-gray-400">{user?.email}</p>
                      <p className="text-xs text-green-500 capitalize">{user?.role}</p>
                    </div>
                    <Link
                      to="/software"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
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
            {navLinks.map((link) => (
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
                  to="/software"
                  className="block mx-4 mt-2 px-5 py-3 bg-gray-800 text-white text-sm font-semibold rounded-xl text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
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
