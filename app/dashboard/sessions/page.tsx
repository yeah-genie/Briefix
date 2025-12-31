"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AP_SUBJECTS } from "@/lib/knowledge-graph";

// ===================================
// SESSIONS PAGE
// Demo mode with local state
// ===================================

// Demo sessions
const initialSessions = [
    { id: "1", student_name: "Alex Kim", subject: "AP Calculus AB", scheduled_at: "2024-01-15T14:00:00", status: "completed", duration: 60, topics_covered: 3 },
    { id: "2", student_name: "Sarah Lee", subject: "AP Physics 1", scheduled_at: "2024-01-16T10:00:00", status: "scheduled", duration: 45, topics_covered: 0 },
    { id: "3", student_name: "Alex Kim", subject: "AP Calculus AB", scheduled_at: "2024-01-14T15:00:00", status: "completed", duration: 60, topics_covered: 2 },
    { id: "4", student_name: "David Park", subject: "AP Calculus AB", scheduled_at: "2024-01-17T16:00:00", status: "scheduled", duration: 90, topics_covered: 0 },
];

function getStatusBadge(status: string) {
    switch (status) {
        case "completed":
            return <span className="px-2 py-0.5 bg-[#22c55e]/10 text-[#22c55e] text-xs rounded-full">Completed</span>;
        case "scheduled":
            return <span className="px-2 py-0.5 bg-[#3b82f6]/10 text-[#3b82f6] text-xs rounded-full">Scheduled</span>;
        case "in_progress":
            return <span className="px-2 py-0.5 bg-[#f59e0b]/10 text-[#f59e0b] text-xs rounded-full">In Progress</span>;
        default:
            return <span className="px-2 py-0.5 bg-[#71717a]/10 text-[#71717a] text-xs rounded-full">{status}</span>;
    }
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function SessionsPage() {
    const [sessions, setSessions] = useState(initialSessions);
    const [filter, setFilter] = useState<"all" | "scheduled" | "completed">("all");

    const filteredSessions = sessions.filter(s => {
        if (filter === "all") return true;
        return s.status === filter;
    });

    return (
        <div className="min-h-screen">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0f0f12] border-r border-[#27272a] p-4">
                <div className="flex items-center gap-2 mb-8">
                    <Image src="/logo.png" alt="Chalk" width={32} height={32} className="rounded-lg" />
                    <span className="font-semibold text-lg">Chalk</span>
                </div>
                <nav className="space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </Link>
                    <Link href="/dashboard/students" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Students
                    </Link>
                    <Link href="/dashboard/sessions" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#18181b] text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Sessions
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Sessions</h1>
                        <p className="text-[#71717a] text-sm">View and manage tutoring sessions</p>
                    </div>
                    <button className="px-4 py-2.5 bg-[#10b981] text-black rounded-lg font-medium text-sm hover:opacity-90 transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Schedule Session
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {["all", "scheduled", "completed"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as typeof filter)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f
                                    ? "bg-[#10b981] text-black"
                                    : "bg-[#18181b] text-[#a1a1aa] hover:text-white"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Sessions List */}
                <div className="rounded-xl bg-[#18181b] border border-[#27272a] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#27272a]">
                                <th className="text-left px-5 py-4 text-sm font-medium text-[#71717a]">Student</th>
                                <th className="text-left px-5 py-4 text-sm font-medium text-[#71717a]">Subject</th>
                                <th className="text-left px-5 py-4 text-sm font-medium text-[#71717a]">Date</th>
                                <th className="text-left px-5 py-4 text-sm font-medium text-[#71717a]">Time</th>
                                <th className="text-left px-5 py-4 text-sm font-medium text-[#71717a]">Duration</th>
                                <th className="text-left px-5 py-4 text-sm font-medium text-[#71717a]">Status</th>
                                <th className="text-left px-5 py-4 text-sm font-medium text-[#71717a]">Topics</th>
                                <th className="px-5 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#27272a]">
                            {filteredSessions.map((session) => (
                                <tr key={session.id} className="hover:bg-[#1f1f23] transition">
                                    <td className="px-5 py-4">
                                        <span className="font-medium">{session.student_name}</span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-[#a1a1aa]">{session.subject}</td>
                                    <td className="px-5 py-4 text-sm">{formatDate(session.scheduled_at)}</td>
                                    <td className="px-5 py-4 text-sm text-[#a1a1aa]">{formatTime(session.scheduled_at)}</td>
                                    <td className="px-5 py-4 text-sm">{session.duration} min</td>
                                    <td className="px-5 py-4">{getStatusBadge(session.status)}</td>
                                    <td className="px-5 py-4 text-sm">
                                        {session.topics_covered > 0 ? (
                                            <span className="text-[#10b981]">{session.topics_covered} topics</span>
                                        ) : (
                                            <span className="text-[#52525b]">—</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <Link
                                            href={`/dashboard/sessions/${session.id}`}
                                            className="text-sm text-[#10b981] hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredSessions.length === 0 && (
                        <div className="text-center py-12 text-[#71717a]">
                            No sessions found
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
