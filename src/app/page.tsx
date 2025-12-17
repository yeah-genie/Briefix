"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Icons - Actual brand logos
function ZoomIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#2D8CFF"/>
      <path d="M5 8.5C5 7.67 5.67 7 6.5 7h7c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5v-5z" fill="white"/>
      <path d="M15 10l4-2v6l-4-2v-2z" fill="white"/>
    </svg>
  );
}

function MeetIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5z" fill="#00897B"/>
      <path d="M7 9c0-.55.45-1 1-1h5c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1H8c-.55 0-1-.45-1-1V9z" fill="white"/>
      <path d="M14 10.5l3-1.5v4l-3-1.5v-1z" fill="white"/>
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
    </svg>
  );
}

// Animated cursor component
function AnimatedCursor({ x, y, clicking }: { x: number; y: number; clicking: boolean }) {
  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      animate={{ x, y, scale: clicking ? 0.9 : 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.84a.5.5 0 00-.85.37z" fill="white" stroke="black" strokeWidth="1.5"/>
      </svg>
      {clicking && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          className="absolute top-0 left-0 w-6 h-6 rounded-full bg-cyan-500/30"
        />
      )}
    </motion.div>
  );
}

// macOS window header
function WindowHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/50">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>
      <span className="text-xs text-zinc-500 ml-2">{title}</span>
    </div>
  );
}

// Interactive How It Works with cursor animation
function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 200, y: 150 });
  const [clicking, setClicking] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    
    const sequence = async () => {
      // Step 1: Connect - click Zoom
      await new Promise(r => setTimeout(r, 1000));
      setCursorPos({ x: 120, y: 80 });
      await new Promise(r => setTimeout(r, 500));
      setClicking(true);
      await new Promise(r => setTimeout(r, 200));
      setClicking(false);
      
      // Step 2: Analyze
      await new Promise(r => setTimeout(r, 2000));
      setActiveStep(1);
      setCursorPos({ x: 200, y: 150 });
      
      // Step 3: Learn
      await new Promise(r => setTimeout(r, 3000));
      setActiveStep(2);
      setCursorPos({ x: 150, y: 200 });
      await new Promise(r => setTimeout(r, 500));
      setClicking(true);
      await new Promise(r => setTimeout(r, 200));
      setClicking(false);
      
      // Loop
      await new Promise(r => setTimeout(r, 4000));
      setActiveStep(0);
      setCursorPos({ x: 200, y: 150 });
    };
    
    sequence();
    const interval = setInterval(sequence, 12000);
    return () => clearInterval(interval);
  }, [isInView]);

  const steps = [
    { title: "Connect", desc: "Link your Zoom account or upload session recordings" },
    { title: "Analyze", desc: "AI processes speech patterns, engagement, and clarity" },
    { title: "Learn", desc: "See exactly which explanations worked best" },
  ];

  return (
    <div ref={ref} className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left: Steps */}
      <div className="space-y-2">
        {steps.map((step, i) => (
          <motion.button
            key={step.title}
            onClick={() => setActiveStep(i)}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            className={`w-full text-left p-5 rounded-xl border transition-all duration-300 ${
              activeStep === i 
                ? "bg-zinc-900/80 border-zinc-700" 
                : "bg-transparent border-transparent hover:bg-zinc-900/40"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                activeStep === i ? "bg-white text-black" : "bg-zinc-800 text-zinc-500"
              }`}>
                {i + 1}
              </div>
              <div>
                <h3 className={`font-medium transition-colors ${activeStep === i ? "text-white" : "text-zinc-500"}`}>
                  {step.title}
                </h3>
                <p className={`text-sm mt-0.5 transition-colors ${activeStep === i ? "text-zinc-400" : "text-zinc-600"}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Right: Interactive Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl" />
        <div className="relative bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden">
          <WindowHeader title="Chalk" />

          {/* Content with cursor */}
          <div className="p-6 min-h-[320px] relative">
            <AnimatedCursor x={cursorPos.x} y={cursorPos.y} clicking={clicking} />
            
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="connect"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-zinc-500 mb-4">Connect your platform</p>
                  {[
                    { name: "Zoom", icon: <ZoomIcon />, color: "text-blue-400" },
                    { name: "Google Meet", icon: <MeetIcon />, color: "text-green-400" },
                    { name: "Upload recording", icon: <UploadIcon />, color: "text-zinc-400" },
                  ].map((platform, i) => (
                    <motion.div
                      key={platform.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className={platform.color}>{platform.icon}</span>
                        <span className="text-sm text-zinc-300">{platform.name}</span>
                      </div>
                      <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="analyze"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center h-[280px] space-y-6"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <p className="text-sm text-zinc-400">Analyzing "Physics - Newton's Laws"</p>
                  </div>
                  
                  {/* Waveform centered */}
                  <div className="flex items-center justify-center gap-1 h-20">
                    {[...Array(32)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 4 }}
                        animate={{ height: 8 + Math.sin(i * 0.4) * 24 + Math.random() * 16 }}
                        transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse", delay: i * 0.03 }}
                        className="w-1 bg-gradient-to-t from-cyan-500/30 to-cyan-400 rounded-full"
                      />
                    ))}
                  </div>

                  <div className="w-full max-w-xs space-y-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 2.5 }}
                      className="h-1 bg-cyan-500/50 rounded-full"
                    />
                    <p className="text-xs text-zinc-600 text-center">Transcribing and analyzing patterns...</p>
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="learn"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-400">Physics - Newton's Laws</p>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Done</span>
                  </div>
                  
                  {/* Key insight - WOW moment */}
                  <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                        </svg>
                      </div>
                      <p className="text-xs text-emerald-400">Key insight</p>
                    </div>
                    <p className="text-sm text-white">
                      Real-world demo = <span className="text-cyan-400">2.5x</span> better retention
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Pushing a book vs. showing equations
                    </p>
                  </div>

                  {/* Compact comparison */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                      <p className="text-xs text-emerald-400">Worked</p>
                      <p className="text-sm text-zinc-300 mt-0.5">"Push this book"</p>
                      <p className="text-lg font-semibold text-emerald-400">89%</p>
                    </div>
                    <div className="p-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                      <p className="text-xs text-zinc-500">Less effective</p>
                      <p className="text-sm text-zinc-400 mt-0.5">"F = ma means..."</p>
                      <p className="text-lg font-semibold text-zinc-500">52%</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Privacy icons
function VideoIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

// Interactive Privacy Section - minimal, elegant
function PrivacySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, [isInView]);

  const steps = [
    { label: "Upload", icon: <VideoIcon />, desc: "Connect your session" },
    { label: "Analyze", icon: <LockIcon />, desc: "Encrypted processing" },
    { label: "Insights", icon: <ChartIcon />, desc: "Text only, no video" },
    { label: "Deleted", icon: <TrashIcon />, desc: "Within 24 hours" },
  ];

  return (
    <div ref={ref} className="relative">
      <div className="relative bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden">
        <WindowHeader title="Data flow" />
        
        <div className="p-8">
          {/* Minimal flow */}
          <div className="flex items-center justify-between gap-2 mb-6">
            {steps.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <motion.div
                  animate={{ 
                    scale: step === i ? 1.1 : 1,
                    opacity: step >= i ? 1 : 0.4
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                    step === i 
                      ? "bg-cyan-500/20 text-cyan-400" 
                      : step > i 
                        ? "bg-zinc-800 text-zinc-400" 
                        : "bg-zinc-900 text-zinc-600"
                  }`}
                >
                  {item.icon}
                </motion.div>
                <p className={`text-xs font-medium ${step >= i ? "text-zinc-300" : "text-zinc-600"}`}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Progress line */}
          <div className="h-0.5 bg-zinc-800 rounded-full mb-6 overflow-hidden">
            <motion.div
              animate={{ width: `${((step + 1) / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          </div>

          {/* Current step */}
          <div className="text-center text-sm text-zinc-400 mb-6">
            {steps[step].desc}
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 text-xs text-zinc-500 pt-4 border-t border-zinc-800/50">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              GDPR
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              SOC 2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metrics Demo with real examples - Spanish lesson
function MetricsDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isInView) setTimeout(() => setShow(true), 300);
  }, [isInView]);

  return (
    <div ref={ref} className="relative">
      <div className="relative bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden">
        <WindowHeader title="Spanish - Past Tense Verbs" />
        
        <div className="p-6 space-y-4">
          {/* Key moment */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-amber-200 font-medium">Breakthrough at 12:15</p>
                <p className="text-xs text-zinc-400">"Hablar becomes hablé" — engagement +280%</p>
              </div>
            </div>
          </motion.div>

          {/* Talk ratio - compact */}
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-zinc-500">Talk ratio</span>
              <span className="text-zinc-400">55% / 45%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={show ? { width: "55%" } : {}}
                transition={{ duration: 1 }}
                className="bg-cyan-500 rounded-full"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={show ? { width: "45%" } : {}}
                transition={{ duration: 1, delay: 0.2 }}
                className="bg-emerald-500/60 rounded-full"
              />
            </div>
            <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Great balance
            </p>
          </div>

          {/* Comparison - compact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={show ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-2"
          >
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
              <p className="text-xs text-emerald-400 mb-1">Worked</p>
              <p className="text-sm text-zinc-300">"Sing the endings!"</p>
              <p className="text-lg font-semibold text-emerald-400 mt-1">91%</p>
            </div>
            <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1">Less effective</p>
              <p className="text-sm text-zinc-400">"Memorize the chart"</p>
              <p className="text-lg font-semibold text-zinc-500 mt-1">38%</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// FAQ
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  
  const items = [
    { q: "How does the analysis work?", a: "Connect Zoom or upload recordings. Our AI transcribes the session, identifies key teaching moments, and measures student engagement through response patterns and question quality." },
    { q: "What makes this different from just reviewing recordings?", a: "We surface the moments that matter. Instead of watching 60 minutes, you see exactly which explanations worked (with timestamps) and why. It's like having a teaching coach watch every session." },
    { q: "Is my students' data safe?", a: "Yes. We only analyze speech patterns and timing — no student faces or personal data. Recordings are deleted within 24 hours. You own all insights." },
  ];

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-zinc-800/50 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-900/30 transition-colors"
          >
            <span className="text-zinc-300">{item.q}</span>
            <svg className={`w-5 h-5 text-zinc-600 transition-transform ${open === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-zinc-500 leading-relaxed">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [count, setCount] = useState(0);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  useEffect(() => {
    fetch("/api/waitlist").then(r => r.json()).then(d => d.count && setCount(d.count)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || status === "loading") return;
    
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setCount(c => c + 1);
      }
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white antialiased">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-cyan-500/[0.07] to-transparent rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-lg border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-white">Chalk</Link>
          <span className="text-xs text-zinc-600">Teaching analytics for tutors</span>
        </div>
      </header>

      {/* Hero */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="min-h-screen flex items-center justify-center px-6 pt-14"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              See what works
              <br />
              <span className="text-zinc-500">in your teaching</span>
            </h1>
            
            <p className="text-lg text-zinc-400 mb-10 max-w-md mx-auto">
              AI analyzes your tutoring sessions. Discover which explanations actually click.
            </p>

            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg"
              >
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-zinc-300">You're on the list</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Join beta
                </button>
              </form>
            )}
            
            {count > 0 && (
              <p className="text-xs text-zinc-600 mt-4">{count} tutors on the waitlist</p>
            )}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 rounded-full border-2 border-zinc-800 flex items-start justify-center p-2"
            >
              <div className="w-1 h-2 bg-zinc-700 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* How it works */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-cyan-400 mb-3">How it works</p>
            <h2 className="text-3xl font-semibold text-white">Three steps to better teaching</h2>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* What you'll see */}
      <section className="py-32 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-cyan-400 mb-3">Real insights</p>
            <h2 className="text-3xl font-semibold text-white">See what you've been missing</h2>
          </div>
          <MetricsDemo />
        </div>
      </section>

      {/* Privacy */}
      <section className="py-32 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-cyan-400 mb-3">Privacy first</p>
            <h2 className="text-3xl font-semibold text-white">Your recordings stay private</h2>
          </div>
          <PrivacySection />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold text-white">Questions</h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 border-t border-zinc-800/50">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-semibold text-white mb-3">Ready to teach smarter?</h2>
          <p className="text-zinc-500 mb-8">Free during beta. No credit card required.</p>
          
          {status === "success" ? (
            <p className="text-zinc-400">We'll email you when we launch</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-zinc-700">© 2025 Chalk</p>
        </div>
      </footer>
    </div>
  );
}
