// ===================================
// DATABASE TYPES
// Supabase 테이블 타입 정의
// ===================================

export interface Student {
    id: string;
    tutor_id: string;
    name: string;
    subject_id: string;
    parent_email?: string;
    parent_phone?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Session {
    id: string;
    tutor_id: string;
    student_id: string;
    subject_id: string;
    scheduled_at: string;
    duration_minutes?: number;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    transcript?: string;
    transcript_segments?: any[];
    notes?: string;
    recording_url?: string;
    evidence_urls?: string[];
    created_at: string;
    updated_at: string;
}

export interface SessionTopic {
    id: string;
    session_id: string;
    topic_id: string;
    status_before?: 'new' | 'learning' | 'reviewed' | 'mastered';
    status_after?: 'new' | 'learning' | 'reviewed' | 'mastered';
    score_delta?: number;
    evidence?: string;
    created_at: string;
}

export interface StudentMastery {
    id: string;
    student_id: string;
    topic_id: string;
    score: number; // 0-100
    status: 'new' | 'learning' | 'reviewed' | 'mastered';
    last_reviewed_at?: string;
    review_count: number;
    created_at: string;
    updated_at: string;
}

export interface Profile {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
    created_at: string;
}

// ===================================
// INSERT TYPES (without auto-generated fields)
// ===================================

export type StudentInsert = Omit<Student, 'id' | 'created_at' | 'updated_at'>;
export type SessionInsert = Omit<Session, 'id' | 'created_at' | 'updated_at'>;
export type StudentMasteryInsert = Omit<StudentMastery, 'id' | 'created_at' | 'updated_at'>;

// ===================================
// WITH RELATIONS
// ===================================

export interface StudentWithMastery extends Student {
    mastery?: StudentMastery[];
    sessions?: Session[];
}

export interface SessionWithTopics extends Session {
    topics?: SessionTopic[];
    student?: Student;
}
