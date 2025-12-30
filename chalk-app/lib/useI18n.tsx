import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

type Language = 'en' | 'ko';

interface Translations {
    // Common
    save: string;
    cancel: string;
    close: string;
    delete: string;
    edit: string;
    add: string;
    share: string;
    copy: string;

    // Navigation
    home: string;
    schedule: string;
    portfolio: string;
    profile: string;

    // Lesson Log
    selectStudent: string;
    addStudent: string;
    topicOptional: string;
    recentTopics: string;
    howDidItGo: string;
    good: string;
    okay: string;
    struggled: string;
    skipRating: string;
    notes: string;
    homework: string;
    saveLesson: string;

    // Report
    generateReport: string;
    generatingReport: string;
    shareReport: string;
    copyReport: string;
    reportGenerated: string;

    // Plan
    freePlan: string;
    proPlan: string;
    studentsLimit: string;
    reportsLimit: string;
    upgradeNow: string;

    // Profile
    logOut: string;
    exportData: string;
    manageStudents: string;
    integrations: string;

    // Empty States
    noStudents: string;
    noLessons: string;
    noSchedule: string;

    // Recording
    startRecording: string;
    stopRecording: string;
    pauseRecording: string;
    resumeRecording: string;
    recording: string;
    paused: string;
    recordingComplete: string;
    aiAutoAnalysis: string;
    micPermissionRequired: string;
    loginRequired: string;
    recordingSaveFailed: string;
    lesson: string;
}

const EN: Translations = {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    share: 'Share',
    copy: 'Copy',

    home: 'Home',
    schedule: 'Schedule',
    portfolio: 'Portfolio',
    profile: 'Profile',

    selectStudent: 'Select Student',
    addStudent: 'Add Student',
    topicOptional: 'Topic (Optional)',
    recentTopics: 'Recent Topics',
    howDidItGo: 'How did it go?',
    good: 'Good',
    okay: 'Okay',
    struggled: 'Struggled',
    skipRating: 'Skip rating',
    notes: 'Notes',
    homework: 'Homework',
    saveLesson: 'Save Lesson',

    generateReport: 'Generate Report',
    generatingReport: 'Generating AI Report...',
    shareReport: 'Share Report',
    copyReport: 'Copy Report',
    reportGenerated: 'Report generated!',

    freePlan: 'Free Plan',
    proPlan: 'Pro Plan',
    studentsLimit: '{count}/{max} students',
    reportsLimit: '{count}/{max} reports this month',
    upgradeNow: 'Upgrade Now',

    logOut: 'Log Out',
    exportData: 'Export Data',
    manageStudents: 'Manage Students',
    integrations: 'Integrations',

    noStudents: 'No students yet',
    noLessons: 'No lessons recorded',
    noSchedule: 'No scheduled lessons',

    // Recording
    startRecording: 'Start Recording',
    stopRecording: 'Stop',
    pauseRecording: 'Pause',
    resumeRecording: 'Resume',
    recording: 'Recording...',
    paused: 'Paused',
    recordingComplete: 'Recording complete',
    aiAutoAnalysis: 'AI auto-analysis with one tap',
    micPermissionRequired: 'Microphone permission required',
    loginRequired: 'Login required',
    recordingSaveFailed: 'Failed to save recording',
    lesson: 'Lesson',
};

const KO: Translations = {
    save: '저장',
    cancel: '취소',
    close: '닫기',
    delete: '삭제',
    edit: '수정',
    add: '추가',
    share: '공유',
    copy: '복사',

    home: '홈',
    schedule: '스케줄',
    portfolio: '포트폴리오',
    profile: '프로필',

    selectStudent: '학생 선택',
    addStudent: '학생 추가',
    topicOptional: '주제 (선택)',
    recentTopics: '최근 주제',
    howDidItGo: '수업은 어땠나요?',
    good: '좋음',
    okay: '보통',
    struggled: '어려움',
    skipRating: '평가 건너뛰기',
    notes: '메모',
    homework: '숙제',
    saveLesson: '수업 저장',

    generateReport: '리포트 생성',
    generatingReport: 'AI 리포트 생성 중...',
    shareReport: '리포트 공유',
    copyReport: '리포트 복사',
    reportGenerated: '리포트가 생성되었습니다!',

    freePlan: '무료 플랜',
    proPlan: '프로 플랜',
    studentsLimit: '{count}/{max}명 학생',
    reportsLimit: '이번 달 {count}/{max}개 리포트',
    upgradeNow: '업그레이드',

    logOut: '로그아웃',
    exportData: '데이터 내보내기',
    manageStudents: '학생 관리',
    integrations: '연동 서비스',

    noStudents: '아직 학생이 없습니다',
    noLessons: '기록된 수업이 없습니다',
    noSchedule: '예정된 수업이 없습니다',

    // Recording
    startRecording: '수업 녹음 시작',
    stopRecording: '중지',
    pauseRecording: '일시정지',
    resumeRecording: '재개',
    recording: '녹음 중...',
    paused: '일시정지',
    recordingComplete: '녹음 완료',
    aiAutoAnalysis: '탭 한 번으로 AI가 자동 분석',
    micPermissionRequired: '마이크 권한이 필요합니다',
    loginRequired: '로그인이 필요합니다',
    recordingSaveFailed: '녹음 저장에 실패했습니다',
    lesson: '수업',
};

const TRANSLATIONS: Record<Language, Translations> = { en: EN, ko: KO };

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
    formatString: (key: keyof Translations, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = '@chalk_language';

function getDeviceLanguage(): Language {
    try {
        let locale = 'en';
        if (Platform.OS === 'ios') {
            locale = NativeModules.SettingsManager?.settings?.AppleLocale ||
                NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] || 'en';
        } else if (Platform.OS === 'android') {
            locale = NativeModules.I18nManager?.localeIdentifier || 'en';
        }
        return locale.startsWith('ko') ? 'ko' : 'en';
    } catch {
        return 'en';
    }
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(getDeviceLanguage());

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then(saved => {
            if (saved === 'en' || saved === 'ko') {
                setLanguageState(saved);
            }
        });
    }, []);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        await AsyncStorage.setItem(STORAGE_KEY, lang);
    };

    const formatString = (key: keyof Translations, params?: Record<string, string | number>): string => {
        let result = TRANSLATIONS[language][key];
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                result = result.replace(`{${k}}`, String(v));
            });
        }
        return result;
    };

    return (
        <I18nContext.Provider value={{
            language,
            setLanguage,
            t: TRANSLATIONS[language],
            formatString,
        }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        // Return default English if not in provider
        return {
            language: 'en' as Language,
            setLanguage: () => { },
            t: EN,
            formatString: (key: keyof Translations, params?: Record<string, string | number>) => {
                let result = EN[key];
                if (params) {
                    Object.entries(params).forEach(([k, v]) => {
                        result = result.replace(`{${k}}`, String(v));
                    });
                }
                return result;
            },
        };
    }
    return context;
}
