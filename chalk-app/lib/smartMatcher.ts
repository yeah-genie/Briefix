import { Student } from './DataContext';

/**
 * Smart Student Matcher
 * 자동으로 회의/캘린더 정보에서 학생을 매칭
 */

interface MatchResult {
    student: Student | null;
    confidence: number; // 0-1
    source: 'title' | 'participant' | 'schedule' | 'history';
}

/**
 * 회의 정보에서 학생 자동 매칭
 */
export function matchStudentFromMeeting(
    meetingTitle: string,
    participants: string[],
    registeredStudents: Student[],
    scheduledTime?: Date
): MatchResult {
    // 1. 제목에서 학생 이름 추출
    const titleMatch = matchFromTitle(meetingTitle, registeredStudents);
    if (titleMatch.confidence > 0.8) return titleMatch;

    // 2. 참가자에서 학생 매칭
    const participantMatch = matchFromParticipants(participants, registeredStudents);
    if (participantMatch.confidence > 0.7) return participantMatch;

    // 3. 시간대 기반 추론 (화요일 4시 = 지민이)
    if (scheduledTime) {
        const scheduleMatch = matchFromSchedule(scheduledTime, registeredStudents);
        if (scheduleMatch.confidence > 0.6) return scheduleMatch;
    }

    // 매칭 실패
    return { student: null, confidence: 0, source: 'title' };
}

/**
 * 회의 제목에서 학생 이름 추출
 * "지민이 수학" → 지민 매칭
 */
function matchFromTitle(title: string, students: Student[]): MatchResult {
    const normalizedTitle = normalizeKorean(title.toLowerCase());

    for (const student of students) {
        const studentNames = getNameVariants(student.name);

        for (const name of studentNames) {
            if (normalizedTitle.includes(name)) {
                return {
                    student,
                    confidence: 0.9,
                    source: 'title',
                };
            }
        }
    }

    return { student: null, confidence: 0, source: 'title' };
}

/**
 * 참가자 이메일/이름에서 학생 매칭
 */
function matchFromParticipants(participants: string[], students: Student[]): MatchResult {
    for (const participant of participants) {
        const normalized = normalizeKorean(participant.toLowerCase());

        for (const student of students) {
            const studentNames = getNameVariants(student.name);

            for (const name of studentNames) {
                if (normalized.includes(name)) {
                    return {
                        student,
                        confidence: 0.8,
                        source: 'participant',
                    };
                }
            }

            // 이메일에서 이름 추출 시도
            const emailName = participant.split('@')[0].replace(/[0-9._-]/g, '');
            if (emailName.length > 2) {
                const emailMatch = fuzzyMatch(emailName, student.name);
                if (emailMatch > 0.7) {
                    return {
                        student,
                        confidence: emailMatch * 0.8,
                        source: 'participant',
                    };
                }
            }
        }
    }

    return { student: null, confidence: 0, source: 'participant' };
}

/**
 * 스케줄 기반 매칭 (요일+시간 → 학생)
 * TODO: ScheduledLesson 데이터와 연동
 */
function matchFromSchedule(time: Date, students: Student[]): MatchResult {
    // 현재는 placeholder - ScheduledLesson과 연동 필요
    return { student: null, confidence: 0, source: 'schedule' };
}

/**
 * 한글 이름 변형 생성
 * "김지민" → ["김지민", "지민", "지민이", "jimin"]
 */
function getNameVariants(name: string): string[] {
    const variants: string[] = [name.toLowerCase()];

    // 성 제거 (김지민 → 지민)
    if (name.length >= 2) {
        variants.push(name.slice(1).toLowerCase());
        variants.push(name.slice(1).toLowerCase() + '이'); // 지민이
    }

    // 로마자 변환 (간단한 버전)
    const romanized = romanizeKorean(name);
    if (romanized !== name.toLowerCase()) {
        variants.push(romanized);
    }

    return variants;
}

/**
 * 한글 정규화 (ㅈㅣㅁㅣㄴ → 지민)
 */
function normalizeKorean(text: string): string {
    return text
        .replace(/[^\uAC00-\uD7A3a-zA-Z0-9\s]/g, '') // 한글, 영문, 숫자, 공백만
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * 간단한 한글 → 로마자 변환
 */
function romanizeKorean(name: string): string {
    const map: Record<string, string> = {
        '김': 'kim', '이': 'lee', '박': 'park', '최': 'choi', '정': 'jung',
        '강': 'kang', '조': 'cho', '윤': 'yoon', '장': 'jang', '임': 'lim',
        '지': 'ji', '민': 'min', '수': 'su', '영': 'young', '현': 'hyun',
        '준': 'jun', '서': 'seo', '은': 'eun', '유': 'yu', '진': 'jin',
    };

    let result = '';
    for (const char of name) {
        result += map[char] || char;
    }
    return result.toLowerCase();
}

/**
 * 퍼지 문자열 매칭 (0-1)
 */
function fuzzyMatch(a: string, b: string): number {
    const s1 = a.toLowerCase();
    const s2 = b.toLowerCase();

    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;

    // Levenshtein distance 기반 유사도
    const matrix: number[][] = [];

    for (let i = 0; i <= s1.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= s2.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    const distance = matrix[s1.length][s2.length];
    const maxLen = Math.max(s1.length, s2.length);
    return maxLen > 0 ? 1 - distance / maxLen : 1;
}

/**
 * 회의 제목에서 토픽 추출
 * "지민이 수학 - 이차방정식" → "이차방정식"
 */
export function extractTopicFromTitle(title: string): string | null {
    // 패턴: "학생명 과목 - 토픽" 또는 "학생명: 토픽"
    const patterns = [
        /[-–—]\s*(.+)$/,           // "xxx - 토픽" 형식
        /:\s*(.+)$/,               // "xxx: 토픽" 형식
        /\((.+)\)$/,               // "xxx (토픽)" 형식
        /\[(.+)\]$/,               // "xxx [토픽]" 형식
    ];

    for (const pattern of patterns) {
        const match = title.match(pattern);
        if (match && match[1].trim().length > 0) {
            return match[1].trim();
        }
    }

    return null;
}
