"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface MockIdea {
  id: number;
  title: string;
  score: number;
  status: "inbox" | "evaluating" | "top" | "killed";
}

// Animated App Mockup Component
function AppMockup() {
  const [activeTab, setActiveTab] = useState<"inbox" | "top" | "killed">("inbox");
  const [typingText, setTypingText] = useState("");

  // Auto-cycle through tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => {
        if (prev === "inbox") return "top";
        if (prev === "top") return "killed";
        return "inbox";
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Typing animation
  useEffect(() => {
    const phrases = ["Customer feedback portal", "API marketplace", "Team retrospective tool"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const type = () => {
      const currentPhrase = phrases[phraseIndex];
      
      if (!isDeleting) {
        setTypingText(currentPhrase.slice(0, charIndex + 1));
        charIndex++;
        
        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(type, 2000);
          return;
        }
      } else {
        setTypingText(currentPhrase.slice(0, charIndex - 1));
        charIndex--;
        
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      
      setTimeout(type, isDeleting ? 30 : 80);
    };
    
    const timeout = setTimeout(type, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const ideas: MockIdea[] = [
    { id: 1, title: "AI-powered analytics dashboard", score: 87, status: "top" },
    { id: 2, title: "Mobile app for team sync", score: 72, status: "top" },
    { id: 3, title: "Browser extension for bookmarks", score: 45, status: "inbox" },
    { id: 4, title: "Newsletter automation tool", score: 0, status: "evaluating" },
    { id: 5, title: "Social media scheduler", score: 23, status: "killed" },
  ];

  const filteredIdeas = ideas.filter(idea => {
    if (activeTab === "inbox") return idea.status === "inbox" || idea.status === "evaluating";
    if (activeTab === "top") return idea.status === "top";
    return idea.status === "killed";
  });

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

        <div className="flex min-h-[340px]">
          {/* Sidebar */}
          <div className="w-48 border-r border-zinc-800/80 bg-[#0a0a0c] p-3 hidden sm:block">
            <div className="space-y-1">
              {[
                { id: "inbox", label: "Inbox", count: 2 },
                { id: "top", label: "Top Ideas", count: 2 },
                { id: "killed", label: "Killed", count: 1 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id 
                      ? "bg-zinc-800/80 text-white" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-xs ${activeTab === tab.id ? "text-zinc-400" : "text-zinc-600"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800/80">
              <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-3 px-3">
                Quick Stats
              </div>
              <div className="space-y-3 px-3">
                <div>
                  <div className="text-lg font-semibold text-white">24</div>
                  <div className="text-[10px] text-zinc-600">Ideas evaluated</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-emerald-400">8</div>
                  <div className="text-[10px] text-zinc-600">Shipped this month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-4">
            {/* Add new idea input */}
            <div className="relative mb-4">
              <input
                type="text"
                value={typingText}
                readOnly
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                placeholder="Add new idea..."
              />
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-400"
              />
            </div>

            {/* Ideas list */}
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredIdeas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border ${
                      idea.status === "killed" 
                        ? "border-red-500/20 bg-red-500/5" 
                        : idea.status === "evaluating"
                          ? "border-blue-500/30 bg-blue-500/5"
                          : "border-zinc-800 bg-zinc-900/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {idea.status === "evaluating" ? (
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 rounded-full border-2 border-blue-500/30 border-t-blue-500"
                          />
                        ) : (
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-medium ${
                            idea.status === "killed" 
                              ? "bg-red-500/20 text-red-400" 
                              : idea.status === "top"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-zinc-800 text-zinc-500"
                          }`}>
                            {idea.status === "killed" ? "×" : idea.score}
                          </div>
                        )}
                        <span className={`text-sm ${
                          idea.status === "killed" ? "text-zinc-600 line-through" : "text-white"
                        }`}>
                          {idea.title}
                        </span>
                      </div>
                      {idea.status === "top" && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          Top pick
                        </span>
                      )}
                      {idea.status === "evaluating" && (
                        <span className="text-[10px] text-blue-400">
                          Scoring...
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
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
              Now in private beta
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
              Turn 50 scattered ideas
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400">
                into 1 shipped product
              </span>
            </h1>
            
            <p className="text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto">
              Stop losing ideas in Notion docs. Collect, evaluate, and prioritize with a scoring system that actually works.
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
              Get early access
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* App Mockup */}
          <AppMockup />
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-20 px-6">
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
                  Join <span className="text-white font-medium">{waitlistCount}+</span> makers on the waitlist
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
        <div className="max-w-2xl mx-auto">
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
              <span>ICE scoring framework</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Kill ideas with conviction</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Ship what matters</span>
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
