"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AP_SUBJECTS } from "@/lib/knowledge-graph";
import { AddStudentModal } from "@/components/modals";
import { registerStudentWithSubject, deleteStudent } from "@/lib/actions/crud";
import type { Student } from "@/lib/types/database";

interface StudentListProps {
    initialStudents: Student[];
    subjects: { id: string; name: string }[];
}

export function StudentList({ initialStudents, subjects }: StudentListProps) {
    const router = useRouter();
    const [students, setStudents] = useState(initialStudents);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const getSubjectName = (subjectId: string): string => {
        return subjects.find(s => s.id === subjectId)?.name ||
            AP_SUBJECTS.find(s => s.id === subjectId)?.name ||
            subjectId;
    }

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleAddStudent = async (data: any) => {
        const result = await registerStudentWithSubject(data);

        if (result.success && result.data) {
            setStudents([result.data, ...students]);
            router.refresh();
        }
        return result;
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            const success = await deleteStudent(id);
            if (success) {
                setStudents(students.filter(s => s.id !== id));
            }
        }
    };

    return (
        <>
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
                                onClick={() => handleDelete(student.id, student.name)}
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
                                <p className={`text-xl font-bold ${getScoreColor(0)}`}>
                                    0%
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-[#71717a] mb-1">Actions</p>
                                <p className="text-xl font-bold">—</p>
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



            {/* Add Student Modal */}
            <AddStudentModal
                isOpen={showAddModal}
                subjects={subjects}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddStudent}
            />
        </>
    );
}

function getScoreColor(score: number): string {
    if (score >= 80) return "text-[#22c55e]";
    if (score >= 60) return "text-[#10b981]";
    if (score >= 40) return "text-[#f59e0b]";
    if (score >= 20) return "text-[#ef4444]";
    return "text-[#71717a]";
}
