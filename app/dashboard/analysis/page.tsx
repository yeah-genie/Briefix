import React from 'react';
import { getStudents, getStudentMastery } from '@/lib/actions/crud';
import { fetchSubjectData } from "@/lib/knowledge-graph-server";
import AnalysisClient from './AnalysisClient';

/**
 * Analysis Page (Server Component)
 * Feeds live data to the AnalysisClient
 */
export default async function AnalysisPage() {
    // 1. Fetch Students
    const students = await getStudents();

    if (students.length === 0) {
        return (
            <div className="flex h-screen bg-[#050510] items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-white">No Students Found</h1>
                    <p className="text-white/40">Add students to your roster to view their mastery matrix.</p>
                </div>
            </div>
        );
    }

    // 2. Default to first student for now
    const currentStudent = students[0];
    const initialMastery = await getStudentMastery(currentStudent.id);
    const subject = await fetchSubjectData(currentStudent.subject_id);

    if (!subject) {
        return (
            <div className="flex h-screen bg-[#050510] items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-white">Curriculum Not Found</h1>
                    <p className="text-white/40">The subject '{currentStudent.subject_id}' version 4.0 is not yet initialized in the database.</p>
                </div>
            </div>
        );
    }

    return (
        <AnalysisClient
            initialMastery={initialMastery}
            studentId={currentStudent.id}
            studentName={currentStudent.name}
            subject={subject}
        />
    );
}
