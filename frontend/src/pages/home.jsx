import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: "📊",
      title: "Real-Time Monitoring",
      description: "Monitor all your machines in real-time with live metrics and instant alerts.",
    },
    {
      icon: "🔧",
      title: "Predictive Maintenance",
      description: "AI-powered predictions to prevent breakdowns before they happen.",
    },
    {
      icon: "⚡",
      title: "Energy Optimization",
      description: "Reduce energy costs with smart load balancing and efficiency insights.",
    },
    {
      icon: "🛡️",
      title: "Fault Detection",
      description: "Automatic fault detection with detailed diagnostics and solutions.",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "50+", label: "Machines Supported" },
    { value: "24/7", label: "Monitoring" },
    { value: "10ms", label: "Response Time" },
  ];

  const solutions = [
    {
      icon: "🏭",
      title: "Manufacturing",
      description: "Complete automation solutions for production lines and assembly plants.",
    },
    {
      icon: "⚡",
      title: "Energy & Utilities",
      description: "Smart grid management and power distribution monitoring.",
    },
    {
      icon: "🏢",
      title: "Buildings",
      description: "Intelligent building management and HVAC control systems.",
    },
    {
      icon: "🚗",
      title: "Automotive",
      description: "Advanced automation for automotive manufacturing and testing.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Industrial Automation Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Smart Factory
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              Automation
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Monitor, control, and optimize your industrial machines with real-time data, 
            predictive maintenance, and intelligent fault detection.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/software"
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              Launch Dashboard
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/solutions"
              className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all"
            >
              Explore Solutions
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for
              <span className="text-green-500"> Modern Industry</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to monitor and control your industrial automation systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-green-500/50 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-green-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Real-Time Machine
                <span className="text-green-500"> Dashboard</span>
              </h2>
              <p className="text-gray-400 mb-8">
                Get instant visibility into all your machines with our intuitive dashboard. 
                Monitor temperature, vibration, current, voltage, and more in real-time.
              </p>
              
              <div className="space-y-4">
                {["Live metrics visualization", "Instant alert notifications", "Historical data analysis", "Predictive maintenance insights"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/software"
                className="inline-flex items-center gap-2 mt-8 text-green-500 font-semibold hover:text-green-400 transition-colors"
              >
                Try the Dashboard
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Mock Dashboard Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Temperature", value: "72°C", color: "green" },
                    { label: "Vibration", value: "5.2 mm/s", color: "green" },
                    { label: "Current", value: "45 A", color: "yellow" },
                  ].map((metric, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
                      <div className={`text-lg font-semibold ${metric.color === 'green' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-32 bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-500 text-sm">
                  📈 Live Chart Preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Industry <span className="text-green-500">Solutions</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Tailored automation solutions for every industry sector.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution, index) => (
              <Link
                key={index}
                to="/solutions"
                className="group p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-green-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{solution.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-500 transition-colors">
                  {solution.title}
                </h3>
                <p className="text-gray-400 text-sm">{solution.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Factory?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Start monitoring your machines today with our powerful automation platform.
            </p>
            <Link
              to="/software"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
            >
              Get Started Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                  P
                </div>
                <span className="text-xl font-bold text-white">Proxima</span>
              </div>
              <p className="text-gray-400 text-sm">
                Industrial automation platform for modern factories.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Products</h3>
              <div className="space-y-2">
                {["Dashboard", "Monitoring", "Analytics", "Alerts"].map((item) => (
                  <Link key={item} to="/products" className="block text-gray-400 text-sm hover:text-green-500 transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                {["About", "Careers", "Blog", "Contact"].map((item) => (
                  <Link key={item} to="/" className="block text-gray-400 text-sm hover:text-green-500 transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "GitHub"].map((item) => (
                  <a key={item} href="#" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            © 2025 Proxima Automation. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
