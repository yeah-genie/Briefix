import Link from "next/link";
import Image from "next/image";
import { AP_CALCULUS_AB, getUnits, getTopicsByUnit } from "@/lib/knowledge-graph";

// ===================================
// CHALK DASHBOARD
// Student and Progress Management
// ===================================

// Demo data for student mastery
const demoStudents = [
    { id: "1", name: "Alex Kim", subject: "AP Calculus AB", score: 72, sessions: 12 },
    { id: "2", name: "Sarah Lee", subject: "AP Physics 1", score: 85, sessions: 8 },
    { id: "3", name: "David Park", subject: "AP Calculus AB", score: 45, sessions: 5 },
];

// Demo mastery data
const demoMastery: Record<string, number> = {
    "calc-1": 90, // Limits
    "calc-2": 75, // Differentiation Def
    "calc-3": 60, // Diff Advanced
    "calc-4": 45, // Contextual
    "calc-5": 30, // Analytical
    "calc-6": 15, // Integration
    "calc-7": 0,  // Diff Eq
    "calc-8": 0,  // Int Apps
};

function getScoreColor(score: number): string {
    if (score >= 80) return "bg-[#22c55e]";
    if (score >= 60) return "bg-[#10b981]";
    if (score >= 40) return "bg-[#f59e0b]";
    if (score >= 20) return "bg-[#ef4444]";
    return "bg-[#3f3f46]";
}

function getScoreTextColor(score: number): string {
    if (score >= 80) return "text-[#22c55e]";
    if (score >= 60) return "text-[#10b981]";
    if (score >= 40) return "text-[#f59e0b]";
    if (score >= 20) return "text-[#ef4444]";
    return "text-[#71717a]";
}

export default function Dashboard() {
    const calcUnits = getUnits(AP_CALCULUS_AB);

    return (
        <div className="min-h-screen">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0f0f12] border-r border-[#27272a] p-4">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <Image src="/logo.png" alt="Chalk" width={32} height={32} className="rounded-lg" />
                    <span className="font-semibold text-lg">Chalk</span>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#18181b] text-white"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/students"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Students
                    </Link>
                    <Link
                        href="/dashboard/sessions"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Sessions
                    </Link>
                    <Link
                        href="/dashboard/analytics"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analytics
                    </Link>
                </nav>

                {/* Bottom: Settings */}
                <div className="absolute bottom-4 left-4 right-4">
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p className="text-[#71717a] text-sm">Track student progress and session analytics at a glance</p>
                    </div>
                    <button className="px-4 py-2.5 bg-[#10b981] text-black rounded-lg font-medium text-sm hover:opacity-90 transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Session
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="p-5 rounded-xl bg-[#18181b] border border-[#27272a]">
                        <p className="text-[#71717a] text-sm mb-1">Total Students</p>
                        <p className="text-2xl font-bold">3</p>
                    </div>
                    <div className="p-5 rounded-xl bg-[#18181b] border border-[#27272a]">
                        <p className="text-[#71717a] text-sm mb-1">Sessions This Week</p>
                        <p className="text-2xl font-bold">8</p>
                    </div>
                    <div className="p-5 rounded-xl bg-[#18181b] border border-[#27272a]">
                        <p className="text-[#71717a] text-sm mb-1">Avg. Mastery</p>
                        <p className="text-2xl font-bold text-[#10b981]">67%</p>
                    </div>
                    <div className="p-5 rounded-xl bg-[#18181b] border border-[#27272a]">
                        <p className="text-[#71717a] text-sm mb-1">Topics Analyzed</p>
                        <p className="text-2xl font-bold">24</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Students List */}
                    <div className="col-span-2">
                        <div className="rounded-xl bg-[#18181b] border border-[#27272a] overflow-hidden">
                            <div className="px-5 py-4 border-b border-[#27272a] flex items-center justify-between">
                                <h2 className="font-semibold">Students</h2>
                                <Link href="/dashboard/students" className="text-sm text-[#10b981]">View All</Link>
                            </div>
                            <div className="divide-y divide-[#27272a]">
                                {demoStudents.map((student) => (
                                    <Link
                                        key={student.id}
                                        href={`/dashboard/students/${student.id}`}
                                        className="flex items-center justify-between p-5 hover:bg-[#1f1f23] transition"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#27272a] rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium">{student.name[0]}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{student.name}</p>
                                                <p className="text-sm text-[#71717a]">{student.subject}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className={`font-semibold ${getScoreTextColor(student.score)}`}>{student.score}%</p>
                                                <p className="text-xs text-[#71717a]">{student.sessions} sessions</p>
                                            </div>
                                            <svg className="w-5 h-5 text-[#3f3f46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Knowledge Map Preview */}
                    <div className="col-span-1">
                        <div className="rounded-xl bg-[#18181b] border border-[#27272a]">
                            <div className="px-5 py-4 border-b border-[#27272a]">
                                <h2 className="font-semibold">AP Calculus AB Knowledge Map</h2>
                                <p className="text-xs text-[#71717a] mt-1">Alex Kim</p>
                            </div>
                            <div className="p-5 space-y-3">
                                {calcUnits.map((unit) => {
                                    const score = demoMastery[unit.id] || 0;
                                    const topics = getTopicsByUnit(AP_CALCULUS_AB, unit.id);

                                    return (
                                        <div key={unit.id}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-sm truncate pr-2">{unit.name}</span>
                                                <span className={`text-xs font-medium ${getScoreTextColor(score)}`}>{score}%</span>
                                            </div>
                                            <div className="h-2 bg-[#27272a] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${getScoreColor(score)} transition-all duration-500`}
                                                    style={{ width: `${score}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-[#52525b] mt-1">{topics.length} topics</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
