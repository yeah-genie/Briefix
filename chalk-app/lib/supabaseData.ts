import { supabase } from './supabase';
import { Student, ScheduledLesson, LessonLog } from './DataContext';

// ============================================================
// STUDENTS CRUD
// ============================================================

export async function fetchStudents(): Promise<Student[]> {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching students:', error);
        return [];
    }

    return (data || []).map(mapSupabaseStudent);
}

export async function createStudent(student: Omit<Student, 'id'>): Promise<Student | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
        .from('students')
        .insert({
            user_id: user.user.id,
            name: student.name,
            subject: student.subject,
            grade: student.grade,
            goal: student.goal,
            parent_contact: student.parentContact,
            color: student.color,
            hourly_rate: student.hourlyRate,
            payment_cycle: student.paymentCycle,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating student:', error);
        return null;
    }

    return mapSupabaseStudent(data);
}

export async function deleteStudent(id: string): Promise<boolean> {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) {
        console.error('Error deleting student:', error);
        return false;
    }
    return true;
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<boolean> {
    const { error } = await supabase
        .from('students')
        .update({
            name: updates.name,
            subject: updates.subject,
            grade: updates.grade,
            goal: updates.goal,
            parent_contact: updates.parentContact,
            color: updates.color,
            hourly_rate: updates.hourlyRate,
            payment_cycle: updates.paymentCycle,
        })
        .eq('id', id);

    if (error) {
        console.error('Error updating student:', error);
        return false;
    }
    return true;
}

// ============================================================
// LESSON LOGS CRUD
// ============================================================

export async function fetchLessonLogs(): Promise<LessonLog[]> {
    const { data, error } = await supabase
        .from('lesson_logs')
        .select('*, students(name)')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching lesson logs:', error);
        return [];
    }

    return (data || []).map(mapSupabaseLessonLog);
}

export async function createLessonLog(log: Omit<LessonLog, 'id'>): Promise<string | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
        .from('lesson_logs')
        .insert({
            user_id: user.user.id,
            student_id: log.studentId,
            date: log.date,
            started_at: new Date().toISOString(),
            duration: log.duration,
            topic: log.topic,
            rating: log.rating,
            struggles: log.struggles,
            notes: log.notes,
            homework_assigned: log.homeworkAssigned,
            homework_completed: log.homeworkCompleted,
            photos: log.photos,
            ai_insights: log.aiInsights,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating lesson log:', error);
        return null;
    }

    return data.id;
}

export async function deleteLessonLog(id: string): Promise<boolean> {
    const { error } = await supabase.from('lesson_logs').delete().eq('id', id);
    if (error) {
        console.error('Error deleting lesson log:', error);
        return false;
    }
    return true;
}

// ============================================================
// SCHEDULED LESSONS CRUD
// ============================================================

export async function fetchScheduledLessons(): Promise<ScheduledLesson[]> {
    const { data, error } = await supabase
        .from('scheduled_lessons')
        .select('*, students(name)')
        .order('day_of_week', { ascending: true });

    if (error) {
        console.error('Error fetching scheduled lessons:', error);
        return [];
    }

    return (data || []).map(mapSupabaseScheduledLesson);
}

export async function createScheduledLesson(lesson: Omit<ScheduledLesson, 'id'>): Promise<string | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
        .from('scheduled_lessons')
        .insert({
            user_id: user.user.id,
            student_id: lesson.studentId,
            day_of_week: lesson.day,
            time: lesson.time,
            duration: lesson.duration,
            subject: lesson.subject,
            recurring: lesson.recurring,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating scheduled lesson:', error);
        return null;
    }

    return data.id;
}

export async function deleteScheduledLesson(id: string): Promise<boolean> {
    const { error } = await supabase.from('scheduled_lessons').delete().eq('id', id);
    if (error) {
        console.error('Error deleting scheduled lesson:', error);
        return false;
    }
    return true;
}

// ============================================================
// DATA MIGRATION (Local -> Supabase)
// ============================================================

export async function migrateLocalData(
    students: Student[],
    lessonLogs: LessonLog[],
    scheduledLessons: ScheduledLesson[]
): Promise<{ students: number; logs: number; schedules: number }> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return { students: 0, logs: 0, schedules: 0 };

    let migratedStudents = 0;
    let migratedLogs = 0;
    let migratedSchedules = 0;

    // Create a map of old student IDs to new Supabase IDs
    const studentIdMap: Record<string, string> = {};

    // Migrate students first
    for (const student of students) {
        const { data, error } = await supabase
            .from('students')
            .insert({
                user_id: user.user.id,
                name: student.name,
                subject: student.subject,
                grade: student.grade,
                goal: student.goal,
                parent_contact: student.parentContact,
                color: student.color,
                hourly_rate: student.hourlyRate,
                payment_cycle: student.paymentCycle,
            })
            .select()
            .single();

        if (!error && data) {
            studentIdMap[student.id] = data.id;
            migratedStudents++;
        }
    }

    // Migrate lesson logs with updated student IDs
    for (const log of lessonLogs) {
        const newStudentId = studentIdMap[log.studentId];
        if (!newStudentId) continue;

        const { error } = await supabase.from('lesson_logs').insert({
            user_id: user.user.id,
            student_id: newStudentId,
            date: log.date,
            duration: log.duration,
            topic: log.topic,
            rating: log.rating,
            struggles: log.struggles,
            notes: log.notes,
            homework_assigned: log.homeworkAssigned,
            homework_completed: log.homeworkCompleted,
            photos: log.photos,
            ai_insights: log.aiInsights,
        });

        if (!error) migratedLogs++;
    }

    // Migrate scheduled lessons
    for (const lesson of scheduledLessons) {
        const newStudentId = studentIdMap[lesson.studentId];
        if (!newStudentId) continue;

        const { error } = await supabase.from('scheduled_lessons').insert({
            user_id: user.user.id,
            student_id: newStudentId,
            day_of_week: lesson.day,
            time: lesson.time,
            duration: lesson.duration,
            subject: lesson.subject,
            recurring: lesson.recurring,
        });

        if (!error) migratedSchedules++;
    }

    return { students: migratedStudents, logs: migratedLogs, schedules: migratedSchedules };
}

// ============================================================
// MAPPERS (Supabase -> Local Types)
// ============================================================

function mapSupabaseStudent(data: any): Student {
    return {
        id: data.id,
        name: data.name,
        subject: data.subject,
        grade: data.grade,
        goal: data.goal,
        parentContact: data.parent_contact,
        color: data.color,
        hourlyRate: data.hourly_rate,
        paymentCycle: data.payment_cycle,
    };
}

function mapSupabaseLessonLog(data: any): LessonLog {
    return {
        id: data.id,
        studentId: data.student_id,
        studentName: data.students?.name || '',
        date: data.date,
        time: data.started_at ? new Date(data.started_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
        duration: data.duration || 60,
        topic: data.topic || '',
        topicId: undefined,
        rating: data.rating || 'okay',
        struggles: data.struggles || [],
        notes: data.notes,
        homeworkAssigned: data.homework_assigned,
        homeworkCompleted: data.homework_completed,
        photos: data.photos,
        zoomRecordingUrl: data.zoom_meeting_id,
        aiInsights: data.ai_insights,
        isPaid: false,
    };
}

function mapSupabaseScheduledLesson(data: any): ScheduledLesson {
    return {
        id: data.id,
        studentId: data.student_id,
        studentName: data.students?.name || '',
        day: data.day_of_week,
        time: data.time,
        duration: data.duration || 60,
        subject: data.subject,
        recurring: data.recurring ?? true,
    };
}
