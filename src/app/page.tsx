"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Integration icons
const integrations = [
  { name: "GitHub", icon: "M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" },
  { name: "Vercel", icon: "M12 1L24 22H0L12 1z" },
  { name: "Analytics", icon: "M3 3v18h18v-2H5V3H3zm4 12h2v4H7v-4zm4-5h2v9h-2v-9zm4-3h2v12h-2V7z" },
];

interface Experiment {
  id: number;
  title: string;
  source: string;
  result: "success" | "neutral" | "fail" | "pending";
  change: string;
  timestamp: string;
}

// Animated App Mockup - Autopilot Experiment Tracking
function AppMockup() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [showDetection, setShowDetection] = useState(false);
  const [detectionText, setDetectionText] = useState("");
  const [animationPhase, setAnimationPhase] = useState(0);

  const allExperiments: Experiment[] = [
    { id: 1, title: "Pricing page redesign", source: "GitHub", result: "success", change: "+12% conversion", timestamp: "2 days ago" },
    { id: 2, title: "Checkout flow simplified", source: "Vercel", result: "success", change: "+8% completion", timestamp: "4 days ago" },
    { id: 3, title: "CTA button color change", source: "GitHub", result: "neutral", change: "No change", timestamp: "1 week ago" },
    { id: 4, title: "Onboarding skip option", source: "Vercel", result: "fail", change: "-5% retention", timestamp: "1 week ago" },
  ];

  // Animation sequence
  useEffect(() => {
    const runAnimation = async () => {
      // Phase 1: Show detection popup
      await new Promise(r => setTimeout(r, 1500));
      setDetectionText("checkout.tsx modified");
      setShowDetection(true);
      
      // Phase 2: Add new experiment
      await new Promise(r => setTimeout(r, 2000));
      setShowDetection(false);
      setExperiments([
        { id: 0, title: "New checkout flow", source: "GitHub", result: "pending", change: "Analyzing...", timestamp: "Just now" },
        ...allExperiments.slice(0, 3)
      ]);
      
      // Phase 3: Update result
      await new Promise(r => setTimeout(r, 2500));
      setExperiments(prev => prev.map(exp => 
        exp.id === 0 
          ? { ...exp, result: "success" as const, change: "+15% conversion" }
          : exp
      ));
      setAnimationPhase(1);
      
      // Reset and repeat
      await new Promise(r => setTimeout(r, 4000));
      setExperiments(allExperiments.slice(0, 4));
      setAnimationPhase(0);
    };

    setExperiments(allExperiments.slice(0, 4));
    const interval = setInterval(runAnimation, 12000);
    runAnimation();
    
    return () => clearInterval(interval);
  }, []);

  const getResultStyle = (result: Experiment["result"]) => {
    switch (result) {
      case "success": return "bg-emerald-500/20 text-emerald-400";
      case "fail": return "bg-red-500/20 text-red-400";
      case "neutral": return "bg-zinc-500/20 text-zinc-400";
      case "pending": return "bg-blue-500/20 text-blue-400";
    }
  };

  const getResultIcon = (result: Experiment["result"]) => {
    switch (result) {
      case "success": return "↑";
      case "fail": return "↓";
      case "neutral": return "−";
      case "pending": return "◌";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative w-full max-w-3xl mx-auto"
    >
      {/* Glow effect */}
      <div className="absolute -inset-px bg-gradient-to-b from-zinc-700/50 to-transparent rounded-xl blur-sm" />
      
      {/* App window */}
      <div className="relative bg-[#0c0c0e] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-[#111113]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
            </div>
            <span className="text-xs text-zinc-500 ml-2">Briefix</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-[10px] text-white font-medium">
              Y
            </div>
          </div>
        </div>

        <div className="flex min-h-[380px]">
          {/* Sidebar with integrations */}
          <div className="w-52 border-r border-zinc-800/80 bg-[#0a0a0c] p-4 hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-3">
              Connected
            </div>
            <div className="space-y-2 mb-6">
              {integrations.map((int, i) => (
                <motion.div
                  key={int.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-zinc-800/40"
                >
                  <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d={int.icon} />
                  </svg>
                  <span className="text-xs text-zinc-400">{int.name}</span>
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </motion.div>
              ))}
            </div>

            <div className="border-t border-zinc-800/80 pt-4">
              <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-3">
                This Week
              </div>
              <div className="space-y-3 px-1">
                <div>
                  <div className="text-xl font-semibold text-white">12</div>
                  <div className="text-[10px] text-zinc-600">Auto-detected</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-emerald-400">8</div>
                  <div className="text-[10px] text-zinc-600">Successful</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-zinc-500">3</div>
                  <div className="text-[10px] text-zinc-600">Needs review</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 relative">
            {/* Detection popup */}
            <AnimatePresence>
              {showDetection && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-4 left-4 right-4 z-10 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-blue-400"
                    />
                    <div className="flex-1">
                      <div className="text-xs text-blue-300 font-medium">Change detected</div>
                      <div className="text-[11px] text-blue-400/70">{detectionText}</div>
                    </div>
                    <div className="text-[10px] text-blue-400/60">Tracking started</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-white">Recent Experiments</h3>
                <p className="text-[10px] text-zinc-600">Auto-detected from your deployments</p>
              </div>
              <div className="text-[10px] text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded">
                Last 7 days
              </div>
            </div>

            {/* Experiments list */}
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {experiments.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg border transition-all ${
                      exp.result === "pending" 
                        ? "border-blue-500/30 bg-blue-500/5" 
                        : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {exp.result === "pending" ? (
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 rounded-md border-2 border-blue-500/30 border-t-blue-500 flex items-center justify-center"
                          />
                        ) : (
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium ${getResultStyle(exp.result)}`}>
                            {getResultIcon(exp.result)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm text-white">{exp.title}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-zinc-600">via {exp.source}</span>
                            <span className="text-[10px] text-zinc-700">·</span>
                            <span className="text-[10px] text-zinc-600">{exp.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.div 
                          key={exp.change}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`text-xs font-medium ${
                            exp.result === "success" ? "text-emerald-400" :
                            exp.result === "fail" ? "text-red-400" :
                            exp.result === "pending" ? "text-blue-400" :
                            "text-zinc-500"
                          }`}
                        >
                          {exp.change}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Weekly insight */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: animationPhase === 1 ? 1 : 0.5 }}
              className="mt-4 p-3 rounded-lg bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20"
            >
              <div className="flex items-start gap-2">
                <div className="text-violet-400 text-sm">💡</div>
                <div>
                  <div className="text-[11px] text-violet-300 font-medium">Weekly Insight</div>
                  <div className="text-[10px] text-violet-400/70 mt-0.5">
                    Checkout flow changes have +11% avg. impact. UI-only changes show minimal effect.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
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
    <div className="min-h-screen bg-[#09090b]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-blue-500/[0.07] to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-violet-500/[0.03] blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-white tracking-tight">
            Briefix
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm bg-white text-black font-medium px-4 py-1.5 rounded-md hover:bg-zinc-200 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 text-xs text-zinc-400 border border-zinc-800 rounded-full px-3 py-1.5 bg-zinc-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Autopilot experiment tracking
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center max-w-3xl mx-auto mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Experiments track themselves.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400">
                You just ship.
              </span>
            </h1>
            
            <p className="text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto">
              Connect your stack, ship as usual. Every deploy becomes a tracked experiment with automatic before/after analysis.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-16"
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 bg-white text-black font-medium text-sm px-6 py-3 rounded-lg hover:bg-zinc-200 transition-all shadow-lg shadow-white/10"
            >
              Start tracking for free
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* App Mockup */}
          <AppMockup />
        </div>
      </section>

      {/* How it works - minimal */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "1",
                title: "Connect once",
                desc: "Link GitHub, Vercel, and your analytics. Takes 2 minutes.",
              },
              {
                step: "2", 
                title: "Ship as usual",
                desc: "Deploy changes like you always do. No new workflows to learn.",
              },
              {
                step: "3",
                title: "Get insights",
                desc: "Every change is tracked. See what works, what doesn't.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-400 mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-16 px-6 border-t border-zinc-800/50">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {status === "success" ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-medium mb-1">You're on the list!</p>
                <p className="text-sm text-zinc-400">We'll notify you when we launch.</p>
              </div>
            ) : (
              <>
                <p className="text-zinc-400 mb-6">
                  Join <span className="text-white font-medium">{waitlistCount}+</span> teams waiting
                </p>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                    disabled={status === "loading"}
                  />
                  <button 
                    type="submit" 
                    className="bg-white text-black font-medium text-sm px-5 py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "..." : "Join"}
                  </button>
                </form>
                {status === "error" && (
                  <p className="text-xs text-red-400 mt-3">Something went wrong. Try again.</p>
                )}
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features - minimal */}
      <section className="py-12 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm text-zinc-500"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Zero manual tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Auto before/after analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Weekly AI insights</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <span>© 2025 Briefix</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-zinc-400 transition-colors">Log in</Link>
            <Link href="/signup" className="hover:text-zinc-400 transition-colors">Sign up</Link>
            <span className="text-zinc-700">·</span>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
              Built by @yejin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
