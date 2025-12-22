import { createClient } from '@supabase/supabase-js';

// Supabase 설정
// 실제 값은 .env 파일에서 관리하거나 Expo의 app.config.js에서 설정
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Student {
    id: string;
    tutor_id: string;
    name: string;
    parent_phone?: string;
    subject?: string;
    grade?: string;
    notes?: string;
    created_at: string;
}

export interface LearningOutcome {
    id: string;
    student_id: string;
    title: string;
    subject?: string;
    template_id?: string;
    sort_order: number;
    is_completed: boolean;
    created_at: string;
}

export interface Lesson {
    id: string;
    student_id: string;
    tutor_id: string;
    date: string;
    duration_minutes?: number;
    feedback_raw?: string;
    feedback_polished?: string;
    sent_to_parent: boolean;
    sent_at?: string;
    created_at: string;
}

export interface OutcomeLog {
    id: string;
    lesson_id: string;
    outcome_id: string;
    level: '상' | '중' | '하';
    notes?: string;
    created_at: string;
}

// Helper functions
export async function getStudents() {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

    if (error) throw error;
    return data as Student[];
}

export async function getStudentOutcomes(studentId: string) {
    const { data, error } = await supabase
        .from('learning_outcomes')
        .select('*')
        .eq('student_id', studentId)
        .eq('is_completed', false)
        .order('sort_order');

    if (error) throw error;
    return data as LearningOutcome[];
}

export async function createLesson(
    studentId: string,
    outcomeLogs: { outcomeId: string; level: '상' | '중' | '하' }[],
    feedbackRaw?: string
) {
    // 1. Create lesson
    const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .insert({
            student_id: studentId,
            feedback_raw: feedbackRaw,
        })
        .select()
        .single();

    if (lessonError) throw lessonError;

    // 2. Create outcome logs
    if (outcomeLogs.length > 0) {
        const logs = outcomeLogs.map(log => ({
            lesson_id: lesson.id,
            outcome_id: log.outcomeId,
            level: log.level,
        }));

        const { error: logsError } = await supabase
            .from('outcome_logs')
            .insert(logs);

        if (logsError) throw logsError;
    }

    return lesson as Lesson;
}

export async function getTodayLessons() {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('lessons')
        .select(`
      *,
      students (name, subject, grade)
    `)
        .eq('date', today)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getLessonStats() {
    const { data, error } = await supabase
        .from('lessons')
        .select('id, date, created_at')
        .order('date', { ascending: false });

    if (error) throw error;
    return data;
}
