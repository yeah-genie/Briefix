import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getStudents, getSubjects } from "@/lib/actions/crud";
import Sidebar from "@/components/layout/Sidebar";
import { StudentList } from "./student-list";

// ===================================
// STUDENTS PAGE (Server Component)
// ===================================

export default async function StudentsPage() {
    let user = null;
    try {
        const supabase = await createServerSupabaseClient();
        const { data } = await supabase.auth.getUser();
        user = data.user;
    } catch (e) {
        console.error("[StudentsPage] Error fetching user:", e);
    }

    if (!user) {
        redirect("/login");
    }

    // Fetch data
    const [students, subjects] = await Promise.all([
        getStudents(),
        getSubjects()
    ]);

    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            <Sidebar />

            {/* Main Content (Client Component below handles interactivity) */}
            <main className="ml-64 p-8">
                <StudentList initialStudents={students} subjects={subjects} />
            </main>
        </div>
    );
}

