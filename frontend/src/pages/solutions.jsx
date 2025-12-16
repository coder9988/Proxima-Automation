import { useState } from "react";
import { Link } from "react-router-dom";

const industries = [
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: "🏭",
    title: "Smart Manufacturing Solutions",
    description: "Transform your production line with intelligent automation, real-time monitoring, and predictive analytics.",
    benefits: [
      "30% increase in production efficiency",
      "50% reduction in downtime",
      "Real-time quality control",
      "Automated inventory management",
    ],
    features: ["Assembly Line Automation", "Quality Inspection Systems", "Production Scheduling", "OEE Monitoring"],
  },
  {
    id: "energy",
    name: "Energy & Utilities",
    icon: "⚡",
    title: "Energy Management Solutions",
    description: "Optimize energy distribution, monitor grid performance, and implement smart metering solutions.",
    benefits: [
      "20% reduction in energy costs",
      "Grid stability improvement",
      "Smart load balancing",
      "Renewable integration",
    ],
    features: ["Smart Grid Management", "Substation Automation", "Energy Analytics", "Demand Response"],
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: "🚗",
    title: "Automotive Automation",
    description: "End-to-end automation solutions for automotive manufacturing, testing, and quality assurance.",
    benefits: [
      "Precision manufacturing",
      "Automated testing",
      "Traceability compliance",
      "Flexible production",
    ],
    features: ["Robotic Assembly", "Paint Shop Automation", "Body-in-White Systems", "End-of-Line Testing"],
  },
  {
    id: "pharma",
    name: "Pharmaceuticals",
    icon: "💊",
    title: "Pharma Automation",
    description: "GMP-compliant automation for pharmaceutical manufacturing with full traceability and validation.",
    benefits: [
      "FDA/GMP compliance",
      "Batch consistency",
      "Full traceability",
      "Contamination prevention",
    ],
    features: ["Batch Processing", "Clean Room Automation", "Serialization", "Environmental Monitoring"],
  },
];

export default function Solutions() {
  const [activeIndustry, setActiveIndustry] = useState(industries[0]);

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-green-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Industry <span className="text-green-500">Solutions</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tailored automation solutions designed for your industry's unique challenges and requirements.
          </p>
        </div>
      </section>

      {/* Industry Selector */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Industry Tabs */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setActiveIndustry(industry)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
                  activeIndustry.id === industry.id
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                    : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700"
                }`}
              >
                <span className="text-2xl">{industry.icon}</span>
                {industry.name}
              </button>
            ))}
          </div>

          {/* Industry Details */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-6xl mb-6">{activeIndustry.icon}</div>
              <h2 className="text-3xl font-bold text-white mb-4">{activeIndustry.title}</h2>
              <p className="text-gray-400 mb-8">{activeIndustry.description}</p>

              <h3 className="text-lg font-semibold text-white mb-4">Key Benefits</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {activeIndustry.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/software"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
              >
                Explore Solution
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Features Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Solution Features</h3>
              <div className="space-y-4">
                {activeIndustry.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 font-bold">
                      {i + 1}
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Installations" },
              { value: "15+", label: "Industries" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "24/7", label: "Support" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-green-500 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Don't See Your Industry?</h2>
          <p className="text-gray-400 mb-8">We provide custom solutions for various industries. Contact us to discuss your needs.</p>
          <button className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}
