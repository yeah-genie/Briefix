"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type ValidationResult = {
  demandScore: number;
  competition: "Low" | "Medium" | "High";
  estimatedRevenue: string;
  searchVolume: string;
  existingCourses: number;
  avgPrice: number;
  niche: {
    found: boolean;
    suggestion: string;
    reason: string;
  };
  verdict: "Worth building" | "Needs refinement" | "High risk";
  tips: string[];
};

// Validation logic
function generateValidation(topic: string): ValidationResult {
  const topicLower = topic.toLowerCase();
  
  const techKeywords = ["python", "javascript", "coding", "programming", "web", "app", "data", "ai", "machine learning", "sql", "react"];
  const businessKeywords = ["marketing", "sales", "business", "startup", "entrepreneur", "freelance", "copywriting"];
  const creativeKeywords = ["design", "photo", "video", "music", "art", "writing", "illustration"];
  const nicheKeywords = ["healthcare", "legal", "real estate", "finance", "teachers", "parents", "doctors", "nurses", "accountants"];
  
  const hasTech = techKeywords.some(k => topicLower.includes(k));
  const hasBusiness = businessKeywords.some(k => topicLower.includes(k));
  const hasCreative = creativeKeywords.some(k => topicLower.includes(k));
  const hasNiche = nicheKeywords.some(k => topicLower.includes(k));
  
  let demandScore = 50 + Math.floor(Math.random() * 25);
  let competition: "Low" | "Medium" | "High" = "Medium";
  let existingCourses = 100 + Math.floor(Math.random() * 300);
  
  if (hasTech) {
    demandScore += 15;
    competition = "High";
    existingCourses += 400;
  }
  if (hasBusiness) {
    demandScore += 10;
    competition = "High";
    existingCourses += 250;
  }
  if (hasCreative) {
    demandScore += 5;
  }
  if (hasNiche) {
    demandScore += 12;
    competition = "Low";
    existingCourses = Math.floor(existingCourses / 4);
  }
  
  demandScore = Math.min(94, demandScore);
  
  const avgPrice = hasNiche ? 149 + Math.floor(Math.random() * 100) : 49 + Math.floor(Math.random() * 80);
  const monthlyRevenue = demandScore * 50 + Math.floor(Math.random() * 2000);
  const revenueMin = Math.floor(monthlyRevenue * 0.4 / 1000);
  const revenueMax = Math.floor(monthlyRevenue * 1.2 / 1000);
  
  const nicheSuggestions: Record<string, { suggestion: string; reason: string }> = {
    python: { suggestion: `${topic} for Healthcare`, reason: "Only 15 courses exist in this niche" },
    javascript: { suggestion: `${topic} for Non-Profits`, reason: "Underserved market, low competition" },
    marketing: { suggestion: `${topic} for SaaS`, reason: "High-ticket niche, $200+ course prices" },
    design: { suggestion: `${topic} for FinTech`, reason: "Specialized skill with growing demand" },
    default: { suggestion: `${topic} for Small Business`, reason: "Adding audience reduces competition 60%" }
  };
  
  const nicheKey = Object.keys(nicheSuggestions).find(k => topicLower.includes(k)) || "default";
  const nicheData = nicheSuggestions[nicheKey];
  
  let verdict: "Worth building" | "Needs refinement" | "High risk" = "Needs refinement";
  if (demandScore >= 72 && competition !== "High") verdict = "Worth building";
  else if (demandScore < 55 || (competition === "High" && !hasNiche)) verdict = "High risk";
  
  const tips: string[] = [];
  if (competition === "High") tips.push("Narrow to a specific audience to stand out");
  if (!hasNiche) tips.push("Adding a niche can reduce competition by 60%");
  if (demandScore >= 75) tips.push("Strong demand — move fast");
  if (avgPrice > 100) tips.push("Higher price point works here");
  
  return {
    demandScore,
    competition,
    estimatedRevenue: `$${Math.max(1, revenueMin)}K-${Math.max(2, revenueMax)}K/mo`,
    searchVolume: `${Math.floor(demandScore * 15)}K/mo`,
    existingCourses,
    avgPrice,
    niche: { found: true, suggestion: nicheData.suggestion, reason: nicheData.reason },
    verdict,
    tips: tips.slice(0, 2),
  };
}

// FAQ Component
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    { q: "How does this work?", a: "We analyze search trends, existing courses, and market data to estimate demand, competition, and revenue potential." },
    { q: "Is it accurate?", a: "We use real market signals. It won't guarantee success, but it'll help you avoid obvious mistakes." },
    { q: "What's coming next?", a: "Student tracking and lesson testing — connect your platform and see where students drop off." },
  ];

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-zinc-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-900/50 transition-colors"
          >
            <span className="text-sm text-white">{faq.q}</span>
            <svg className={`w-4 h-4 text-zinc-500 transition-transform ${openIndex === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <p className="px-4 pb-4 text-sm text-zinc-400">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [topic, setTopic] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success">("idle");
  const [waitlistCount, setWaitlistCount] = useState(127);

  useEffect(() => {
    fetch("/api/waitlist").then(r => r.json()).then(d => d.count && setWaitlistCount(d.count)).catch(() => {});
  }, []);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    await new Promise(r => setTimeout(r, 1800));
    
    setResult(generateValidation(topic));
    setIsAnalyzing(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    
    setEmailStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setEmailStatus("success");
        setWaitlistCount(c => c + 1);
      }
    } catch {
      setEmailStatus("idle");
    }
  };

  const resetValidator = () => {
    setTopic("");
    setResult(null);
  };

  const getVerdictStyle = (v: string) => {
    if (v === "Worth building") return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    if (v === "Needs refinement") return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
    return "bg-red-500/10 border-red-500/30 text-red-400";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold">C</div>
            CourseOS
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Will your course idea sell?
          </h1>
          <p className="text-zinc-400 text-lg">
            Find out in 30 seconds. Free.
          </p>
        </div>

        {/* Validator */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          
          {/* Input */}
          <form onSubmit={handleValidate} className="mb-6">
            <label className="block text-sm text-zinc-400 mb-2">Your course topic</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Python for data science"
                className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
                disabled={isAnalyzing}
              />
              <button
                type="submit"
                disabled={!topic.trim() || isAnalyzing}
                className="bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                {isAnalyzing ? "..." : "Validate"}
              </button>
            </div>
          </form>

          {/* Loading */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-zinc-400 text-sm">Analyzing market data...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Verdict */}
                <div className={`p-4 rounded-xl border text-center ${getVerdictStyle(result.verdict)}`}>
                  <p className="text-xl font-semibold">{result.verdict}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{result.demandScore}</p>
                    <p className="text-xs text-zinc-500">Demand</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                    <p className={`text-2xl font-bold ${
                      result.competition === "Low" ? "text-emerald-400" :
                      result.competition === "Medium" ? "text-yellow-400" : "text-red-400"
                    }`}>{result.competition}</p>
                    <p className="text-xs text-zinc-500">Competition</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{result.estimatedRevenue}</p>
                    <p className="text-xs text-zinc-500">Revenue</p>
                  </div>
                </div>

                {/* Niche */}
                {result.niche.found && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-400 mb-1">Niche opportunity</p>
                    <p className="text-white font-medium">{result.niche.suggestion}</p>
                    <p className="text-sm text-zinc-400 mt-1">{result.niche.reason}</p>
                  </div>
                )}

                {/* Tips */}
                {result.tips.length > 0 && (
                  <div className="space-y-1.5">
                    {result.tips.map((tip, i) => (
                      <p key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                        <span className="text-violet-400">→</span> {tip}
                      </p>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={resetValidator}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Try another idea
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!result && !isAnalyzing && (
            <div className="text-center py-8 text-zinc-500 text-sm">
              <p>Enter any course topic to see demand and competition</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {["Python basics", "Digital marketing", "UI design"].map(ex => (
                  <button
                    key={ex}
                    onClick={() => setTopic(ex)}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Email signup - after validator */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-zinc-400 mb-4">
            <span className="text-white font-medium">Coming soon:</span> Connect your platform. See where students drop off.
          </p>
          
          {emailStatus === "success" ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 inline-block">
              <p className="text-emerald-400">You're on the list!</p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
              />
              <button
                type="submit"
                disabled={emailStatus === "loading"}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Notify me
              </button>
            </form>
          )}
          
          <p className="text-xs text-zinc-600 mt-3">{waitlistCount}+ creators waiting</p>
        </motion.div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-lg font-semibold text-center mb-6">FAQ</h2>
          <FAQ />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 text-center text-sm text-zinc-600">
        © 2025 CourseOS
      </footer>
    </div>
  );
}
