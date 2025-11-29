import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <main className="container mx-auto px-6 relative z-10">
        {/* Navbar */}
        <nav className="flex justify-between items-center py-8 mb-16 animate-fade-in">
          <div className="text-2xl font-bold tracking-tight">
            Centr<span className="text-indigo-400">Align</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/auth/register" className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-medium transition-all">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-32 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-sm text-gray-300">AI-Powered Form Generation</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            Create forms with <br />
            <span className="gradient-text">intelligent context</span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform natural language into dynamic forms. Our AI learns from your history to generate the perfect structure, every time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] w-full sm:w-auto"
            >
              Start Building Free
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-semibold text-lg transition-all w-full sm:w-auto"
            >
              View Features
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/5 py-12 mb-32 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {[
            { label: 'Forms Generated', value: '10k+' },
            { label: 'Active Users', value: '2.5k+' },
            { label: 'Completion Rate', value: '98%' },
            { label: 'Avg. Gen Time', value: '<3s' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-6 mb-32">
          {[
            {
              icon: "✨",
              title: "AI Generation",
              desc: "Describe your needs in plain English. We handle the complex schema generation instantly."
            },
            {
              icon: "🧠",
              title: "Context Memory",
              desc: "The system remembers your preferences and past forms to ensure consistency across your workflow."
            },
            {
              icon: "🚀",
              title: "Instant Deploy",
              desc: "Get a shareable public link immediately. No coding or complex setup required."
            },
            {
              icon: "🎨",
              title: "Dynamic Fields",
              desc: "Support for all input types including file uploads, rich text, and conditional logic."
            },
            {
              icon: "📊",
              title: "Real-time Analytics",
              desc: "Track submissions and engagement as they happen with our live dashboard."
            },
            {
              icon: "🔒",
              title: "Secure & Scalable",
              desc: "Enterprise-grade security with scalable infrastructure to handle millions of responses."
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="glass p-8 rounded-2xl animate-fade-in"
              style={{ animationDelay: `${0.3 + (i * 0.1)} s` }}
            >
              <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="relative rounded-3xl overflow-hidden mb-20 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20" />
          <div className="relative glass p-16 text-center border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of developers and businesses building better forms with AI.
            </p>
            <Link
              href="/auth/register"
              className="inline-block px-10 py-4 bg-white text-indigo-950 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
            >
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 text-center text-gray-500 text-sm">
          <p>© 2024 CentrAlign. Built with AI-powered intelligence.</p>
        </footer>
      </main>
    </div>
  );
}

