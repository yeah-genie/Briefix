import Link from "next/link";
import Image from "next/image";

// ===================================
// CHALK - LANDING PAGE
// Clean dark minimal design
// ===================================

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Chalk" width={32} height={32} className="rounded-lg" />
            <span className="font-semibold text-lg">Chalk</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-[#a1a1aa] hover:text-white transition">
              Dashboard
            </Link>
            <Link
              href="/login"
              className="text-sm px-4 py-2 bg-[#10b981] text-black rounded-lg font-medium hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-16">
        <div className="max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 mb-8">
            <span className="text-[#10b981] text-sm">AP Subject Analytics</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Turn lessons into <span className="text-[#10b981]">data</span>,
            <br />
            and data into <span className="text-[#10b981]">proof</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-[#a1a1aa] mb-10 max-w-2xl mx-auto leading-relaxed">
            Chalk automatically analyzes your tutoring sessions to objectively track student growth.
            <br />
            Stop saying &quot;they worked hard&quot; — prove it with numbers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-[#10b981] text-black rounded-xl font-semibold text-lg hover:opacity-90 transition"
            >
              Start for Free
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-[#18181b] border border-[#27272a] rounded-xl font-semibold text-lg hover:border-[#3f3f46] transition"
            >
              See Features
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#10b981]">300+</div>
              <div className="text-sm text-[#71717a]">AP Topics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#10b981]">7</div>
              <div className="text-sm text-[#71717a]">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#10b981]">AI</div>
              <div className="text-sm text-[#71717a]">Powered</div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-[#a1a1aa] text-center mb-16 max-w-2xl mx-auto">
            We analyze your lesson content to automatically track which concepts your students understand.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#18181b] border border-[#27272a]">
              <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Session Analysis</h3>
              <p className="text-[#a1a1aa]">
                Automatically extract topics from your lessons and analyze student comprehension levels.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#18181b] border border-[#27272a]">
              <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth Tracking</h3>
              <p className="text-[#a1a1aa]">
                Visualize student progress over time with graphs that provide objective evidence of improvement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#18181b] border border-[#27272a]">
              <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Parent Sharing</h3>
              <p className="text-[#a1a1aa]">
                Share progress reports with parents via a single link and build trust with data-driven insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AP Subjects Preview */}
      <section className="py-24 px-6 bg-[#0f0f12]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Supported Subjects</h2>
          <p className="text-[#a1a1aa] text-center mb-16">
            Structured knowledge graphs based on official College Board curriculum
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* AP Calculus AB */}
            <div className="p-6 rounded-2xl bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <span className="text-blue-400 font-bold">∫</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AP Calculus AB</h3>
                  <p className="text-sm text-[#71717a]">8 Units · 44 Topics</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-[#27272a] rounded text-xs text-[#a1a1aa]">Limits</span>
                <span className="px-2 py-1 bg-[#27272a] rounded text-xs text-[#a1a1aa]">Derivatives</span>
                <span className="px-2 py-1 bg-[#27272a] rounded text-xs text-[#a1a1aa]">Integrals</span>
                <span className="px-2 py-1 bg-[#27272a] rounded text-xs text-[#a1a1aa]">Differential Equations</span>
              </div>
            </div>

            {/* AP Physics 1 */}
            <div className="p-6 rounded-2xl bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <span className="text-purple-400 font-bold">⚛</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AP Physics 1</h3>
                  <p className="text-sm text-[#71717a]">8 Units · 37 Topics</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-[#27272a] rounded text-xs text-[#a1a1aa]">Kinematics</span>
                <span className="px-2 py-1 bg-[#27272a] rounded text-xs text-[#a1a1aa]">Dynamics</span>
                <span className="px-2 py-1 bg-[#27272a] rounded text-xs text-[#a1a1aa]">Energy</span>
                <span className="px-2 py-1 bg-[#27272a] rounded text-xs text-[#a1a1aa]">Momentum</span>
              </div>
            </div>
          </div>

          <p className="text-center text-[#71717a] text-sm mt-8">
            + AP Biology, Psychology, US History, World History, Chemistry
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#27272a]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Chalk" width={24} height={24} className="rounded-md" />
            <span className="font-medium">Chalk</span>
          </div>
          <p className="text-sm text-[#71717a]">
            © 2024 Chalk. Learning Analytics Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
