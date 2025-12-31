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

export async function createStudent(student: StudentInsert): Promise<Student | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("students")
        .insert(student)
        .select()
        .single();

    if (error) {
        console.error("Error creating student:", error);
        return null;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/students");

    return data;
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
