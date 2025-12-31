"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Student, StudentInsert, Session, SessionInsert } from "@/lib/types/database";

// ===================================
// STUDENT CRUD ACTIONS
// ===================================

export async function getStudents(): Promise<Student[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching students:", error);
        return [];
    }

    return data || [];
}

export async function getSubjects() {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
        .from('kb_subjects')
        .select('id, name')
        .order('name');

    if (error) {
        console.error("Error fetching subjects:", error);
        return [];
    }
    return data || [];
}

export async function getStudent(id: string): Promise<Student | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching student:", error);
        return null;
    }

    return data;
}

export async function createStudent(student: StudentInsert) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("students")
        .insert(student)
        .select()
        .single();

    if (error) {
        console.error("Error creating student:", error);
        return { success: false, error: `Student database error: ${error.message}` };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/students");

    return { success: true, data };
}

export async function registerStudentWithSubject(data: {
    name: string;
    subject_id: string;
    custom_subject_name?: string;
    parent_email?: string;
    notes?: string;
}) {
    const supabase = await createServerSupabaseClient();

    // Try to get authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    let tutorId = user?.id;

    // FALLBACK: If not authenticated, try to find an existing tutor_id from the database
    // This is a temporary measure as requested by the user ("인증 잠시 풀어봐").
    if (!tutorId) {
        console.warn("[Register] No authenticated user found. Attempting fallback tutor_id.");
        const { data: existingStudents } = await supabase
            .from("students")
            .select("tutor_id")
            .limit(1);

        if (existingStudents && existingStudents.length > 0) {
            tutorId = existingStudents[0].tutor_id;
            console.log(`[Register] Using fallback tutor_id from existing student: ${tutorId}`);
        } else {
            // TEMPORARY: Generate a random UUID as tutor_id when no existing data
            // This is a workaround as requested by the user ("인증 잠시 풀어봐").
            tutorId = crypto.randomUUID();
            console.warn(`[Register] No existing students. Using generated tutor_id: ${tutorId}`);
        }
    }

    let finalSubjectId = data.subject_id;

    // 1. Handle Custom Subject
    if (data.subject_id === 'custom' && data.custom_subject_name) {
        const boardId = 'custom';
        const subjectId = data.custom_subject_name.toLowerCase().replace(/\s+/g, '-');

        console.log(`[Register] Creating custom subject: ${data.custom_subject_name} (${subjectId})`);

        // Ensure board exists
        const { error: bError } = await supabase.from('kb_boards').upsert({ id: boardId, name: 'Custom' });
        if (bError) {
            console.error("[Register] Error upserting board:", bError);
            throw new Error(`Board error: ${bError.message}`);
        }

        const { data: newSubject, error: sError } = await supabase
            .from('kb_subjects')
            .upsert({
                id: subjectId,
                board_id: boardId,
                name: data.custom_subject_name,
                icon: 'BookOpen'
            })
            .select()
            .single();

        if (sError) {
            console.error("[Register] Error upserting subject:", sError);
            throw new Error(`Subject error: ${sError.message}`);
        }

        if (newSubject) {
            finalSubjectId = newSubject.id;

            // Create a default Module for the new subject
            const { error: mError } = await supabase.from('kb_modules').upsert({
                id: `${subjectId}-default`,
                subject_id: subjectId,
                name: 'Main Curriculum'
            });

            if (mError) {
                console.error("[Register] Error creating default module:", mError);
                // Continue anyway as module is secondary for student creation
            }
        }
    }

    // 2. Create Student
    return createStudent({
        name: data.name,
        subject_id: finalSubjectId,
        parent_email: data.parent_email,
        notes: data.notes,
        tutor_id: tutorId!
    });
}

export async function updateStudent(id: string, updates: Partial<StudentInsert>): Promise<boolean> {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
        .from("students")
        .update(updates)
        .eq("id", id);

    if (error) {
        console.error("Error updating student:", error);
        return false;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/students");

    return true;
}

export async function deleteStudent(id: string): Promise<boolean> {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting student:", error);
        return false;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/students");

    return true;
}

// ===================================
// SESSION CRUD ACTIONS
// ===================================

export async function getSessions(studentId?: string): Promise<Session[]> {
    const supabase = await createServerSupabaseClient();

    let query = supabase
        .from("sessions")
        .select("*")
        .order("scheduled_at", { ascending: false });

    if (studentId) {
        query = query.eq("student_id", studentId);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching sessions:", error);
        return [];
    }

    return data || [];
}

export async function getSession(id: string): Promise<Session | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching session:", error);
        return null;
    }

    return data;
}

export async function createSession(session: SessionInsert): Promise<Session | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("sessions")
        .insert(session)
        .select()
        .single();

    if (error) {
        console.error("Error creating session:", error);
        return null;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/sessions");

    return data;
}

export async function updateSession(id: string, updates: Partial<SessionInsert>): Promise<boolean> {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
        .from("sessions")
        .update(updates)
        .eq("id", id);

    if (error) {
        console.error("Error updating session:", error);
        return false;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/sessions");

    return true;
}

export async function completeSession(id: string, transcript?: string): Promise<boolean> {
    return updateSession(id, {
        status: "completed",
        transcript,
    });
}

// ===================================
// MASTERY & INSIGHT ACTIONS
// ===================================

export async function getStudentMastery(studentId: string) {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("student_mastery")
        .select("topic_id, score, status")
        .eq("student_id", studentId);

    if (error) {
        console.error("Error fetching student mastery:", error);
        return [];
    }

    // Map database topic_id to the UI's topicId
    return (data || []).map(m => ({
        topicId: m.topic_id,
        level: m.score
    }));
}

export async function getTopicInsights(studentId: string, topicId: string) {
    const supabase = await createServerSupabaseClient();

    // Fetch the latest completed session that covers this topic
    const { data, error } = await supabase
        .from("session_topics")
        .select(`
            evidence,
            future_impact,
            status_after,
            sessions!inner(
                notes,
                transcript,
                scheduled_at
            )
        `)
        .eq("sessions.student_id", studentId)
        .eq("topic_id", topicId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error("Error fetching topic insights:", error);
        return null;
    }

    return {
        text: (Array.isArray(data.sessions) ? data.sessions[0]?.notes : (data.sessions as any)?.notes) || "No recent AI narrative available for this topic.",
        nextSteps: [
            "Review session evidence below",
            "Focus on identified struggle points",
            "Next scheduled session follow-up"
        ],
        evidence: data.evidence ? [data.evidence] : [],
        futureImpact: data.future_impact
    };
}
