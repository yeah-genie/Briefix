"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

// Animated Demo Component
function AnimatedDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
    ];

    const loop = setInterval(() => {
      setPhase(0);
      setTimeout(() => setPhase(1), 500);
      setTimeout(() => setPhase(2), 1500);
      setTimeout(() => setPhase(3), 2500);
      setTimeout(() => setPhase(4), 3500);
    }, 6000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, [isInView]);

  const steps = [
    {
      num: "01",
      title: "Connect",
      desc: "Link GitHub, Vercel, Analytics",
      content: (
        <div className="flex gap-2 mt-3">
          {[
            { icon: "GitHub", color: phase >= 1 ? "bg-white text-black" : "bg-zinc-800 text-zinc-600" },
            { icon: "Vercel", color: phase >= 1 ? "bg-white text-black" : "bg-zinc-800 text-zinc-600" },
            { icon: "GA", color: phase >= 1 ? "bg-white text-black" : "bg-zinc-800 text-zinc-600" },
          ].map((item, i) => (
            <motion.div
              key={item.icon}
              className={`px-2.5 py-1.5 rounded text-[10px] font-medium transition-all duration-300 ${item.color}`}
              animate={phase >= 1 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ delay: i * 0.1 }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      num: "02",
      title: "Ship",
      desc: "Push code as usual",
      content: (
        <div className="font-mono text-[11px] mt-3 space-y-1">
          <p className="text-zinc-600">$ git push origin main</p>
          <motion.p 
            className="text-emerald-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
          >
            ✓ Deployed to production
          </motion.p>
        </div>
      ),
    },
    {
      num: "03",
      title: "Detect",
      desc: "Auto-tracked experiment",
      content: (
        <motion.div 
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded mt-3 text-xs transition-all duration-300 ${
            phase >= 3 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-zinc-800 text-zinc-600"
          }`}
        >
          <motion.span 
            className={`w-2 h-2 rounded-full ${phase >= 3 ? "bg-blue-400" : "bg-zinc-600"}`}
            animate={phase >= 3 ? { scale: [1, 1.3, 1] } : {}}
            transition={{ repeat: phase >= 3 ? Infinity : 0, duration: 1 }}
          />
          {phase >= 3 ? "Experiment started" : "Waiting..."}
        </motion.div>
      ),
    },
    {
      num: "04",
      title: "Learn",
      desc: "See impact instantly",
      content: (
        <motion.div 
          className="flex items-center gap-2 mt-3"
          animate={{ opacity: phase >= 4 ? 1 : 0.4 }}
        >
          <span className="text-zinc-600 text-sm">12%</span>
          <svg className="w-4 h-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span className={`text-sm font-semibold ${phase >= 4 ? "text-emerald-400" : "text-zinc-600"}`}>
            18%
          </span>
          {phase >= 4 && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded"
            >
              +50%
            </motion.span>
          )}
        </motion.div>
      ),
    },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Progress bar */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-zinc-800 mx-4" />
      <motion.div 
        className="absolute top-5 left-4 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500"
        initial={{ width: "0%" }}
        animate={{ 
          width: phase >= 4 ? "calc(100% - 32px)" : 
                 phase >= 3 ? "calc(75% - 24px)" : 
                 phase >= 2 ? "calc(50% - 16px)" : 
                 phase >= 1 ? "calc(25% - 8px)" : "0%" 
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                phase > i ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-600"
              }`}>
                {step.num}
              </span>
              <span className="text-white font-medium text-sm">{step.title}</span>
            </div>
            <p className="text-xs text-zinc-500">{step.desc}</p>
            {step.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Live Experiment Feed
function LiveFeed() {
  const experiments = [
    { title: "Checkout redesign", result: "success", change: "+12%", time: "2h" },
    { title: "New pricing tier", result: "success", change: "+8%", time: "1d" },
    { title: "Homepage CTA", result: "neutral", change: "0%", time: "2d" },
    { title: "Onboarding skip", result: "fail", change: "-3%", time: "3d" },
  ];

  return (
    <div className="space-y-1.5">
      {experiments.map((exp, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between py-2 px-3 bg-zinc-900/40 border border-zinc-800/60 rounded-lg text-sm"
        >
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${
              exp.result === "success" ? "bg-emerald-400" : 
              exp.result === "fail" ? "bg-red-400" : "bg-zinc-600"
            }`} />
            <span className="text-zinc-400">{exp.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${
              exp.result === "success" ? "text-emerald-400" : 
              exp.result === "fail" ? "text-red-400" : "text-zinc-600"
            }`}>
              {exp.change}
            </span>
            <span className="text-[10px] text-zinc-700">{exp.time}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [waitlistCount, setWaitlistCount] = useState(247);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/waitlist");
        const data = await res.json();
        if (res.ok && data.count) {
          setWaitlistCount(data.count);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setWaitlistCount(prev => prev + 1);
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/[0.03] blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-5 h-12 flex items-center justify-between">
          <Link href="/" className="font-semibold text-white text-sm">
            Briefix
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1">
              Log in
            </Link>
            <Link href="/signup" className="text-xs bg-white text-black font-medium px-3 py-1.5 rounded-md hover:bg-zinc-200 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - Compact */}
      <section className="pt-24 pb-8 px-5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-xl mx-auto mb-10"
          >
            <div className="inline-flex items-center gap-2 text-[10px] text-zinc-500 border border-zinc-800 rounded-full px-2.5 py-1 mb-4">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              Zero-effort experiment tracking
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-3">
              Experiments track themselves.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                You just ship.
              </span>
            </h1>
            
            <p className="text-zinc-500 text-sm mb-5">
              Connect once. Every deploy becomes a tracked experiment with automatic impact analysis.
            </p>

            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 bg-white text-black font-medium text-sm px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Start free
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* How it works - Horizontal */}
          <AnimatedDemo />
        </div>
      </section>

      {/* Value props + Feed */}
      <section className="py-10 px-5 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-white mb-1.5">
                Ship faster, learn faster
              </h2>
              <p className="text-sm text-zinc-500 mb-5">
                No spreadsheets. No manual tracking. Just ship and learn.
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "Zero", label: "manual work" },
                  { value: "Auto", label: "detection" },
                  { value: "5min", label: "setup" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-[10px] text-zinc-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">Live experiments</h3>
                <span className="text-[10px] text-zinc-600">Auto-detected</span>
              </div>
              <LiveFeed />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features inline */}
      <section className="py-8 px-5 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500"
          >
            {[
              "GitHub & Vercel sync",
              "Automatic before/after",
              "Weekly AI reports",
              "Team knowledge base",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-5 border-t border-zinc-800/50">
        <div className="max-w-sm mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-bold text-white mb-2">
              Ready to ship smarter?
            </h2>
            <p className="text-sm text-zinc-500 mb-4">
              Join {waitlistCount}+ teams on the waitlist.
            </p>

            {status === "success" ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <svg className="w-5 h-5 text-emerald-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-white">You're on the list!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                  disabled={status === "loading"}
                />
                <button 
                  type="submit" 
                  className="bg-white text-black font-medium text-sm px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "..." : "Join"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 px-5 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-[10px] text-zinc-700">
          <span>© 2025 Briefix</span>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-500 transition-colors">
            @yejin
          </a>
        </div>
      </footer>
    </div>
  );
}
