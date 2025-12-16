import { Link } from "react-router-dom";

const services = [
  {
    icon: "🔧",
    title: "Installation & Commissioning",
    description: "Professional installation and setup of automation systems, ensuring optimal performance from day one.",
    features: ["On-site installation", "System integration", "Testing & validation", "Documentation"],
  },
  {
    icon: "🛠️",
    title: "Maintenance & Support",
    description: "Comprehensive maintenance programs to keep your systems running at peak efficiency.",
    features: ["Preventive maintenance", "24/7 emergency support", "Spare parts management", "Performance optimization"],
  },
  {
    icon: "📊",
    title: "Consulting & Engineering",
    description: "Expert consulting services for automation strategy, system design, and process optimization.",
    features: ["Process analysis", "System architecture", "ROI assessment", "Technology roadmap"],
  },
  {
    icon: "🎓",
    title: "Training & Education",
    description: "Comprehensive training programs for your team on automation systems and best practices.",
    features: ["Operator training", "Technical certification", "Online courses", "Hands-on workshops"],
  },
  {
    icon: "🔄",
    title: "System Upgrades",
    description: "Modernize your existing systems with the latest technology and features.",
    features: ["Legacy migration", "Software updates", "Hardware upgrades", "Performance tuning"],
  },
  {
    icon: "📡",
    title: "Remote Monitoring",
    description: "24/7 remote monitoring and diagnostics for proactive issue resolution.",
    features: ["Real-time monitoring", "Alert management", "Remote diagnostics", "Performance reports"],
  },
];

const processSteps = [
  { step: "01", title: "Consultation", description: "We analyze your needs and challenges" },
  { step: "02", title: "Design", description: "Custom solution architecture" },
  { step: "03", title: "Implementation", description: "Professional installation & setup" },
  { step: "04", title: "Support", description: "Ongoing maintenance & optimization" },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-green-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-green-500">Services</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            End-to-end automation services from consultation to ongoing support. 
            We're your partner in industrial transformation.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:bg-green-500/20 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Process</h2>
            <p className="text-gray-400">How we deliver excellence</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-green-500/20 mb-4">{step.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8">Contact our team to discuss your automation needs.</p>
            <Link
              to="/software"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
