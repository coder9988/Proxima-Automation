import { useState } from "react";

const productCategories = [
  {
    id: "automation",
    name: "Industrial Automation",
    icon: "🏭",
    products: [
      { name: "PLC Controllers", description: "Programmable logic controllers for process automation", price: "$2,499", image: "🎛️" },
      { name: "HMI Panels", description: "Touch-screen human machine interfaces", price: "$1,299", image: "📱" },
      { name: "Servo Drives", description: "High-precision motion control systems", price: "$899", image: "⚙️" },
      { name: "Variable Frequency Drives", description: "Motor speed and torque control", price: "$749", image: "🔄" },
    ],
  },
  {
    id: "sensors",
    name: "Sensors & IoT",
    icon: "📡",
    products: [
      { name: "Temperature Sensors", description: "Industrial-grade temperature monitoring", price: "$129", image: "🌡️" },
      { name: "Vibration Sensors", description: "Machine vibration analysis sensors", price: "$249", image: "📳" },
      { name: "Pressure Transmitters", description: "Accurate pressure measurement devices", price: "$349", image: "🔵" },
      { name: "Flow Meters", description: "Liquid and gas flow measurement", price: "$599", image: "💧" },
    ],
  },
  {
    id: "power",
    name: "Power Distribution",
    icon: "⚡",
    products: [
      { name: "Circuit Breakers", description: "Protection for electrical circuits", price: "$89", image: "🔌" },
      { name: "Switchgear", description: "Medium voltage switching equipment", price: "$4,999", image: "🎚️" },
      { name: "UPS Systems", description: "Uninterruptible power supply units", price: "$1,899", image: "🔋" },
      { name: "Transformers", description: "Power distribution transformers", price: "$2,499", image: "⚡" },
    ],
  },
  {
    id: "software",
    name: "Software Solutions",
    icon: "💻",
    products: [
      { name: "SCADA Platform", description: "Supervisory control and data acquisition", price: "$9,999", image: "📊" },
      { name: "MES Suite", description: "Manufacturing execution system", price: "$14,999", image: "🏭" },
      { name: "Asset Management", description: "Equipment lifecycle management", price: "$4,999", image: "📋" },
      { name: "Predictive Analytics", description: "AI-powered maintenance prediction", price: "$7,999", image: "🤖" },
    ],
  },
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState(productCategories[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = activeCategory.products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
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
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
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

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={index}
                className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all duration-300"
              >
                {/* Product Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-500 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-500">{product.price}</span>
                    <button className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-green-500 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
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
              Our team can help you design and implement custom automation solutions tailored to your specific needs.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
