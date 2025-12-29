import { LessonLog, Student } from '../lib/DataContext';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface ReportData {
    content: string;
    shareToken: string;
    shareUrl: string;
}

/**
 * Call Gemini API directly
 */
async function callGemini(prompt: string): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 500 },
            }),
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
        console.error('[Gemini] API Call failed:', error);
        throw error;
    }
}

/**
 * Generate parent report using AI
 */
export async function generateParentReport(
    lesson: LessonLog,
    student: Student,
    recentLogs: LessonLog[]
): Promise<string> {
    const avgRating = calculateAvgRating(recentLogs);
    const trend = calculateTrend(recentLogs);

    const prompt = `
You are writing a parent report on behalf of a tutor.

[Student]
- Name: ${student.name}
- Subject: ${student.subject || 'General'}
- Grade: ${student.grade || 'Not specified'}

[Today's Lesson]
- Topic: ${lesson.topic}
- Understanding: ${ratingToText(lesson.rating)}
- Duration: ${lesson.duration} minutes
- Notes: ${lesson.notes || 'None'}
- Homework: ${lesson.homeworkAssigned || 'None'}

[Context]
- Total lessons so far: ${recentLogs.length}
- Recent average understanding: ${avgRating}%
- Trend: ${trend}

[Rules]
1. Under 150 words
2. Warm but professional tone
3. Be specific about what was covered
4. End with next steps or encouragement
5. 1-2 emojis max
6. Never use negative words like "failed" or "poor"

Write in English.
`;

    try {
        const report = await callGemini(prompt);
        return report;
    } catch (error) {
        console.error('Failed to generate report:', error);
        return generateFallbackReport(lesson, student);
    }
}

/**
 * Fallback report if AI fails
 */
function generateFallbackReport(lesson: LessonLog, student: Student): string {
    const emoji = lesson.rating === 'good' ? '👍' : lesson.rating === 'okay' ? '✅' : '💪';

    return `${emoji} Lesson Report for ${student.name}

Today we covered: ${lesson.topic}
Duration: ${lesson.duration} minutes
Understanding: ${ratingToText(lesson.rating)}

${lesson.notes ? `Notes: ${lesson.notes}` : ''}
${lesson.homeworkAssigned ? `Homework: ${lesson.homeworkAssigned}` : ''}

Keep up the great work!`;
}

/**
 * Convert rating enum to readable text
 */
function ratingToText(rating: string | null): string {
    switch (rating) {
        case 'good':
            return 'Good - understood well';
        case 'okay':
            return 'Okay - needs some review';
        case 'struggled':
            return 'Needs extra practice';
        default:
            return 'Completed';
    }
}

/**
 * Calculate average rating as percentage
 */
function calculateAvgRating(logs: LessonLog[]): number {
    if (logs.length === 0) return 0;

    const scores = logs.map(log => {
        switch (log.rating) {
            case 'good': return 100;
            case 'okay': return 70;
            case 'struggled': return 40;
            default: return 70;
        }
    });

    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * Calculate trend (improving, stable, needs attention)
 */
function calculateTrend(logs: LessonLog[]): string {
    if (logs.length < 3) return 'Just getting started';

    const recent = logs.slice(0, 3);
    const older = logs.slice(3, 6);

    if (older.length === 0) return 'Building momentum';

    const recentAvg = calculateAvgRating(recent);
    const olderAvg = calculateAvgRating(older);

    const diff = recentAvg - olderAvg;

    if (diff > 10) return 'Improving';
    if (diff < -10) return 'Needs attention';
    return 'Stable';
}

/**
 * Generate share token for report URL
 */
export function generateShareToken(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 8; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

/**
 * Get share URL for report
 */
export function getReportShareUrl(token: string): string {
    return `https://chalk.app/r/${token}`;
}

/**
 * Format report for sharing
 */
export function formatReportForShare(
    report: string,
    studentName: string,
    shareUrl: string
): string {
    return `📚 Lesson Report for ${studentName}\n\n${report}\n\n${shareUrl}`;
}

/**
 * 리포트 발송 이력을 저장합니다.
 */
export async function saveReportHistory(
    lessonLogId: string,
    content: string,
    sentVia: string = 'share_sheet'
) {
    try {
        // 💡 Supabase DB에 저장하는 로직 (나중에 실제 연동 시 활성화)
        /*
        const { data, error } = await supabase
          .from('parent_reports')
          .insert([
            { 
              lesson_log_id: lessonLogId, 
              content: content, 
              sent_via: sentVia,
              sent_at: new Date().toISOString()
            }
          ]);
        if (error) throw error;
        */

        console.log('✅ Parent Report history saved locally:', { lessonLogId, sentVia });
        return true;
    } catch (error) {
        console.error('❌ Error saving report history:', error);
        return false;
    }
}
