import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './useAuth';
import { supabase } from './supabase';
import { matchStudentFromMeeting, extractTopicFromTitle } from './smartMatcher';
import { Student } from './DataContext';

interface CalendarEvent {
    id: string;
    summary: string;
    start: { dateTime: string };
    end: { dateTime: string };
    attendees?: { email: string; displayName?: string }[];
    hangoutLink?: string; // Google Meet link
}

interface PendingLesson {
    eventId: string;
    student: Student;
    topic: string | null;
    duration: number;
    date: string;
    time: string;
}

const STORAGE_KEY = '@chalk_pending_lessons';
const LAST_SYNC_KEY = '@chalk_last_calendar_sync';

/**
 * Zero-Action Google Calendar 연동
 * 캘린더 이벤트 (특히 Google Meet)가 종료되면 자동으로 수업 기록 생성
 */
export function useAutoLessonDetection(students: Student[]) {
    const { user, isAuthenticated } = useAuth();
    const [pendingLessons, setPendingLessons] = useState<PendingLesson[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    // Load pending lessons from storage
    useEffect(() => {
        loadPendingLessons();
    }, []);

    // Check for completed lessons when app opens
    useEffect(() => {
        if (isAuthenticated && students.length > 0) {
            checkForCompletedLessons();
        }
    }, [isAuthenticated, students]);

    const loadPendingLessons = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setPendingLessons(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load pending lessons:', error);
        }
    };

    const savePendingLessons = async (lessons: PendingLesson[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
            setPendingLessons(lessons);
        } catch (error) {
            console.error('Failed to save pending lessons:', error);
        }
    };

    /**
     * Google Calendar에서 최근 종료된 회의 확인
     */
    const checkForCompletedLessons = useCallback(async () => {
        if (isChecking) return;
        setIsChecking(true);

        try {
            const lastSync = await AsyncStorage.getItem(LAST_SYNC_KEY);
            const lastSyncTime = lastSync ? new Date(lastSync) : new Date(Date.now() - 24 * 60 * 60 * 1000);

            // Fetch recent calendar events from Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('get-calendar-events', {
                body: {
                    timeMin: lastSyncTime.toISOString(),
                    timeMax: new Date().toISOString(),
                },
            });

            if (error) {
                console.log('Calendar fetch error:', error);
                return;
            }

            const events: CalendarEvent[] = data?.events || [];
            const now = new Date();
            const newPending: PendingLesson[] = [];

            for (const event of events) {
                // Skip if not a Google Meet
                if (!event.hangoutLink) continue;

                // Skip if not ended yet
                const endTime = new Date(event.end.dateTime);
                if (endTime > now) continue;

                // Skip if already processed
                const existingIndex = pendingLessons.findIndex(p => p.eventId === event.id);
                if (existingIndex >= 0) continue;

                // Try to match a student
                const participants = event.attendees?.map(a => a.displayName || a.email) || [];
                const matchResult = matchStudentFromMeeting(
                    event.summary || '',
                    participants,
                    students,
                    new Date(event.start.dateTime)
                );

                if (matchResult.student && matchResult.confidence > 0.5) {
                    const startTime = new Date(event.start.dateTime);
                    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

                    newPending.push({
                        eventId: event.id,
                        student: matchResult.student,
                        topic: extractTopicFromTitle(event.summary || ''),
                        duration,
                        date: startTime.toISOString().split('T')[0],
                        time: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    });
                }
            }

            if (newPending.length > 0) {
                await savePendingLessons([...pendingLessons, ...newPending]);
            }

            await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
        } catch (error) {
            console.error('Failed to check calendar:', error);
        } finally {
            setIsChecking(false);
        }
    }, [students, pendingLessons, isChecking]);

    /**
     * 평가 완료 후 pending에서 제거
     */
    const markAsRated = useCallback(async (eventId: string) => {
        const updated = pendingLessons.filter(p => p.eventId !== eventId);
        await savePendingLessons(updated);
    }, [pendingLessons]);

    /**
     * 가장 최근 pending lesson 가져오기
     */
    const getNextPendingLesson = useCallback((): PendingLesson | null => {
        return pendingLessons.length > 0 ? pendingLessons[0] : null;
    }, [pendingLessons]);

    return {
        pendingLessons,
        isChecking,
        checkForCompletedLessons,
        markAsRated,
        getNextPendingLesson,
        hasPendingLessons: pendingLessons.length > 0,
    };
}

/**
 * 수업 기록 자동 생성 (평가 포함)
 */
export function createAutoLessonLog(
    pending: PendingLesson,
    rating: 'good' | 'okay' | 'struggled'
) {
    return {
        studentId: pending.student.id,
        studentName: pending.student.name,
        date: pending.date,
        time: pending.time,
        duration: pending.duration,
        topic: pending.topic || 'General',
        rating,
        struggles: [],
        notes: `[Auto] Google Meet 수업 자동 기록`,
    };
}
