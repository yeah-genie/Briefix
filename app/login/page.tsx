"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const supabase = createBrowserSupabaseClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
            setMessage({ type: "success", text: "Check your email for the login link!" });
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Failed to send magic link" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col items-center justify-center px-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]" />

            <div className="w-full max-w-md z-10">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <Image src="/logo.png" alt="Chalk" width={40} height={40} className="rounded-xl shadow-lg shadow-[#10b981]/10" />
                        <span className="text-2xl font-bold tracking-tight">Chalk</span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-[#a1a1aa] text-center">
                        Enter your email to receive a secure login link.
                        <br />No password required.
                    </p>
                </div>

                <div className="bg-[#18181b] border border-[#27272a] p-8 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-80">
                    <div className="space-y-4">
                        <button
                            onClick={async () => {
                                await supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: {
                                        redirectTo: `${window.location.origin}/auth/callback`,
                                    },
                                });
                            }}
                            className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#27272a]"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#18181b] px-2 text-[#71717a]">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#71717a] mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-[#09090b] border border-[#27272a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-[#10b981] transition-all"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 font-semibold rounded-xl hover:bg-[#10b981]/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-[#10b981]/20 border-t-[#10b981] rounded-full animate-spin" />
                                ) : (
                                    "Send Magic Link"
                                )}
                            </button>
                        </form>
                    </div>

                    {message && (
                        <div className={`mt-6 p-4 rounded-xl text-sm flex items-center gap-3 ${message.type === "success"
                            ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                            <span>{message.text}</span>
                        </div>
                    )}
                </div>

                <p className="mt-8 text-center text-sm text-[#71717a]">
                    By signing in, you agree to our{" "}
                    <a href="#" className="underline hover:text-white">Terms of Service</a>.
                </p>
            </div>
        </div>
    );
}
