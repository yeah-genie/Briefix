"use client";

import { useState } from "react";
import { AP_SUBJECTS } from "@/lib/knowledge-graph";

// ===================================
// ADD STUDENT MODAL COMPONENT
// ===================================

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        subject_id: string;
        parent_email?: string;
        notes?: string;
    }) => void;
}

export function AddStudentModal({ isOpen, onClose, onSubmit }: AddStudentModalProps) {
    const [name, setName] = useState("");
    const [subjectId, setSubjectId] = useState(AP_SUBJECTS[0]?.id || "");
    const [parentEmail, setParentEmail] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await onSubmit({
                name: name.trim(),
                subject_id: subjectId,
                parent_email: parentEmail.trim() || undefined,
                notes: notes.trim() || undefined,
            });
            // Reset form
            setName("");
            setSubjectId(AP_SUBJECTS[0]?.id || "");
            setParentEmail("");
            setNotes("");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#18181b] border border-[#27272a] rounded-2xl w-full max-w-md p-6 shadow-xl">
                <h2 className="text-xl font-semibold mb-6">Add New Student</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm text-[#a1a1aa] mb-1.5">
                            Student Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Alex Kim"
                            className="w-full px-4 py-2.5 bg-[#0f0f12] border border-[#27272a] rounded-lg text-white placeholder:text-[#52525b] focus:border-[#10b981] focus:outline-none transition"
                            required
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm text-[#a1a1aa] mb-1.5">
                            Subject *
                        </label>
                        <select
                            value={subjectId}
                            onChange={(e) => setSubjectId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0f0f12] border border-[#27272a] rounded-lg text-white focus:border-[#10b981] focus:outline-none transition"
                        >
                            {AP_SUBJECTS.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Parent Email */}
                    <div>
                        <label className="block text-sm text-[#a1a1aa] mb-1.5">
                            Parent Email (optional)
                        </label>
                        <input
                            type="email"
                            value={parentEmail}
                            onChange={(e) => setParentEmail(e.target.value)}
                            placeholder="parent@email.com"
                            className="w-full px-4 py-2.5 bg-[#0f0f12] border border-[#27272a] rounded-lg text-white placeholder:text-[#52525b] focus:border-[#10b981] focus:outline-none transition"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm text-[#a1a1aa] mb-1.5">
                            Notes (optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any additional notes..."
                            rows={3}
                            className="w-full px-4 py-2.5 bg-[#0f0f12] border border-[#27272a] rounded-lg text-white placeholder:text-[#52525b] focus:border-[#10b981] focus:outline-none transition resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-[#27272a] text-white rounded-lg font-medium hover:bg-[#3f3f46] transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="flex-1 px-4 py-2.5 bg-[#10b981] text-black rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Adding..." : "Add Student"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ===================================
// ADD SESSION MODAL COMPONENT
// ===================================

interface AddSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentId?: string;
    students: { id: string; name: string; subject_id: string }[];
    onSubmit: (data: {
        student_id: string;
        subject_id: string;
        scheduled_at: string;
        duration_minutes?: number;
        notes?: string;
    }) => void;
}

export function AddSessionModal({ isOpen, onClose, studentId, students, onSubmit }: AddSessionModalProps) {
    const [selectedStudentId, setSelectedStudentId] = useState(studentId || students[0]?.id || "");
    const [scheduledAt, setScheduledAt] = useState("");
    const [duration, setDuration] = useState("60");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const selectedStudent = students.find(s => s.id === selectedStudentId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudentId || !scheduledAt) return;

        setLoading(true);
        try {
            await onSubmit({
                student_id: selectedStudentId,
                subject_id: selectedStudent?.subject_id || "",
                scheduled_at: new Date(scheduledAt).toISOString(),
                duration_minutes: parseInt(duration) || undefined,
                notes: notes.trim() || undefined,
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#18181b] border border-[#27272a] rounded-2xl w-full max-w-md p-6 shadow-xl">
                <h2 className="text-xl font-semibold mb-6">Schedule New Session</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Student */}
                    <div>
                        <label className="block text-sm text-[#a1a1aa] mb-1.5">
                            Student *
                        </label>
                        <select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0f0f12] border border-[#27272a] rounded-lg text-white focus:border-[#10b981] focus:outline-none transition"
                        >
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date/Time */}
                    <div>
                        <label className="block text-sm text-[#a1a1aa] mb-1.5">
                            Date & Time *
                        </label>
                        <input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0f0f12] border border-[#27272a] rounded-lg text-white focus:border-[#10b981] focus:outline-none transition"
                            required
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm text-[#a1a1aa] mb-1.5">
                            Duration (minutes)
                        </label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0f0f12] border border-[#27272a] rounded-lg text-white focus:border-[#10b981] focus:outline-none transition"
                        >
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">60 min</option>
                            <option value="90">90 min</option>
                            <option value="120">120 min</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm text-[#a1a1aa] mb-1.5">
                            Notes (optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Topics to cover, homework review, etc."
                            rows={2}
                            className="w-full px-4 py-2.5 bg-[#0f0f12] border border-[#27272a] rounded-lg text-white placeholder:text-[#52525b] focus:border-[#10b981] focus:outline-none transition resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-[#27272a] text-white rounded-lg font-medium hover:bg-[#3f3f46] transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !selectedStudentId || !scheduledAt}
                            className="flex-1 px-4 py-2.5 bg-[#10b981] text-black rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Scheduling..." : "Schedule"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
