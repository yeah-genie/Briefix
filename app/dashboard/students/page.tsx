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
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

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

