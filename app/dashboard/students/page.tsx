"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AP_SUBJECTS } from "@/lib/knowledge-graph";
import { AddStudentModal } from "@/components/modals";

// ===================================
// STUDENTS PAGE
// Demo mode with local state
// ===================================

// Demo students
const initialStudents = [
    { id: "1", name: "Alex Kim", subject_id: "ap-calc-ab", score: 72, sessions: 12, parent_email: "parent@email.com" },
    { id: "2", name: "Sarah Lee", subject_id: "ap-physics-1", score: 85, sessions: 8, parent_email: "" },
    { id: "3", name: "David Park", subject_id: "ap-calc-ab", score: 45, sessions: 5, parent_email: "david.parent@email.com" },
];

function getSubjectName(subjectId: string): string {
    return AP_SUBJECTS.find(s => s.id === subjectId)?.name || subjectId;
}

function getScoreColor(score: number): string {
    if (score >= 80) return "text-[#22c55e]";
    if (score >= 60) return "text-[#10b981]";
    if (score >= 40) return "text-[#f59e0b]";
    if (score >= 20) return "text-[#ef4444]";
    return "text-[#71717a]";
}

export default function StudentsPage() {
    const [students, setStudents] = useState(initialStudents);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddStudent = (data: { name: string; subject_id: string; parent_email?: string; notes?: string }) => {
        const newStudent = {
            id: Date.now().toString(),
            name: data.name,
            subject_id: data.subject_id,
            score: 0,
            sessions: 0,
            parent_email: data.parent_email || "",
        };
        setStudents([newStudent, ...students]);
    };

    const handleDeleteStudent = (id: string) => {
        if (confirm("Are you sure you want to delete this student?")) {
            setStudents(students.filter(s => s.id !== id));
        }
    };

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
                    <Link href="/dashboard/students" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#18181b] text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Students
                    </Link>
                    <Link href="/dashboard/sessions" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition">
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
                        <h1 className="text-2xl font-bold">Students</h1>
                        <p className="text-[#71717a] text-sm">Manage your students and track their progress</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2.5 bg-[#10b981] text-black rounded-lg font-medium text-sm hover:opacity-90 transition flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Student
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search students..."
                        className="w-full max-w-md px-4 py-2.5 bg-[#18181b] border border-[#27272a] rounded-lg text-white placeholder:text-[#52525b] focus:border-[#10b981] focus:outline-none transition"
                    />
                </div>

                {/* Students Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.map((student) => (
                        <div
                            key={student.id}
                            className="p-5 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] transition"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#27272a] rounded-full flex items-center justify-center">
                                        <span className="text-lg font-medium">{student.name[0]}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{student.name}</h3>
                                        <p className="text-sm text-[#71717a]">{getSubjectName(student.subject_id)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteStudent(student.id)}
                                    className="p-1.5 text-[#71717a] hover:text-[#ef4444] transition"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-[#71717a] mb-1">Mastery</p>
                                    <p className={`text-xl font-bold ${getScoreColor(student.score)}`}>
                                        {student.score}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#71717a] mb-1">Sessions</p>
                                    <p className="text-xl font-bold">{student.sessions}</p>
                                </div>
                            </div>

                            <Link
                                href={`/dashboard/students/${student.id}`}
                                className="block w-full text-center py-2 bg-[#27272a] text-white rounded-lg text-sm font-medium hover:bg-[#3f3f46] transition"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}

                    {filteredStudents.length === 0 && (
                        <div className="col-span-full text-center py-12 text-[#71717a]">
                            {searchQuery ? "No students found" : "No students yet. Add your first student!"}
                        </div>
                    )}
                </div>
            </main>

            {/* Add Student Modal */}
            <AddStudentModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddStudent}
            />
        </div>
    );
}
