// Curriculum data for structured topic selection
// Organized by subject and level

export interface CurriculumTopic {
    id: string;
    name: string;
    nameKr: string;
    category: string;
    level: 'basic' | 'intermediate' | 'advanced';
}

export interface Curriculum {
    subject: string;
    subjectKr: string;
    topics: CurriculumTopic[];
}

export const CURRICULUM_DATA: Curriculum[] = [
    {
        subject: 'Math',
        subjectKr: '수학',
        topics: [
            // Basic
            { id: 'math-1', name: 'Numbers & Operations', nameKr: '수와 연산', category: 'Arithmetic', level: 'basic' },
            { id: 'math-2', name: 'Fractions', nameKr: '분수', category: 'Arithmetic', level: 'basic' },
            { id: 'math-3', name: 'Decimals', nameKr: '소수', category: 'Arithmetic', level: 'basic' },
            { id: 'math-4', name: 'Ratios & Proportions', nameKr: '비와 비율', category: 'Arithmetic', level: 'basic' },
            // Intermediate
            { id: 'math-5', name: 'Linear Equations', nameKr: '일차방정식', category: 'Algebra', level: 'intermediate' },
            { id: 'math-6', name: 'Quadratic Equations', nameKr: '이차방정식', category: 'Algebra', level: 'intermediate' },
            { id: 'math-7', name: 'Functions', nameKr: '함수', category: 'Algebra', level: 'intermediate' },
            { id: 'math-8', name: 'Geometry Basics', nameKr: '기초 기하', category: 'Geometry', level: 'intermediate' },
            { id: 'math-9', name: 'Triangles & Circles', nameKr: '삼각형과 원', category: 'Geometry', level: 'intermediate' },
            // Advanced
            { id: 'math-10', name: 'Polynomials', nameKr: '다항식', category: 'Algebra', level: 'advanced' },
            { id: 'math-11', name: 'Trigonometry', nameKr: '삼각함수', category: 'Trigonometry', level: 'advanced' },
            { id: 'math-12', name: 'Calculus Intro', nameKr: '미적분 기초', category: 'Calculus', level: 'advanced' },
            { id: 'math-13', name: 'Statistics', nameKr: '통계', category: 'Statistics', level: 'advanced' },
            { id: 'math-14', name: 'Probability', nameKr: '확률', category: 'Statistics', level: 'advanced' },
        ],
    },
    {
        subject: 'English',
        subjectKr: '영어',
        topics: [
            // Basic
            { id: 'eng-1', name: 'Vocabulary Building', nameKr: '어휘 학습', category: 'Vocabulary', level: 'basic' },
            { id: 'eng-2', name: 'Basic Grammar', nameKr: '기초 문법', category: 'Grammar', level: 'basic' },
            { id: 'eng-3', name: 'Sentence Structure', nameKr: '문장 구조', category: 'Grammar', level: 'basic' },
            { id: 'eng-4', name: 'Reading Comprehension', nameKr: '독해 기초', category: 'Reading', level: 'basic' },
            // Intermediate
            { id: 'eng-5', name: 'Verb Tenses', nameKr: '동사 시제', category: 'Grammar', level: 'intermediate' },
            { id: 'eng-6', name: 'Essay Writing', nameKr: '에세이 작성', category: 'Writing', level: 'intermediate' },
            { id: 'eng-7', name: 'Paragraph Structure', nameKr: '단락 구성', category: 'Writing', level: 'intermediate' },
            { id: 'eng-8', name: 'Listening Practice', nameKr: '듣기 연습', category: 'Listening', level: 'intermediate' },
            // Advanced
            { id: 'eng-9', name: 'Advanced Grammar', nameKr: '고급 문법', category: 'Grammar', level: 'advanced' },
            { id: 'eng-10', name: 'Critical Reading', nameKr: '비판적 독해', category: 'Reading', level: 'advanced' },
            { id: 'eng-11', name: 'Argumentative Writing', nameKr: '논술', category: 'Writing', level: 'advanced' },
            { id: 'eng-12', name: 'Speaking Practice', nameKr: '말하기 연습', category: 'Speaking', level: 'advanced' },
        ],
    },
    {
        subject: 'Science',
        subjectKr: '과학',
        topics: [
            // Basic
            { id: 'sci-1', name: 'Scientific Method', nameKr: '과학적 방법', category: 'General', level: 'basic' },
            { id: 'sci-2', name: 'Matter & Energy', nameKr: '물질과 에너지', category: 'Physics', level: 'basic' },
            { id: 'sci-3', name: 'Living Things', nameKr: '생물', category: 'Biology', level: 'basic' },
            // Intermediate
            { id: 'sci-4', name: 'Forces & Motion', nameKr: '힘과 운동', category: 'Physics', level: 'intermediate' },
            { id: 'sci-5', name: 'Chemical Reactions', nameKr: '화학 반응', category: 'Chemistry', level: 'intermediate' },
            { id: 'sci-6', name: 'Cells & DNA', nameKr: '세포와 DNA', category: 'Biology', level: 'intermediate' },
            // Advanced
            { id: 'sci-7', name: 'Electricity & Magnetism', nameKr: '전기와 자기', category: 'Physics', level: 'advanced' },
            { id: 'sci-8', name: 'Organic Chemistry', nameKr: '유기화학', category: 'Chemistry', level: 'advanced' },
            { id: 'sci-9', name: 'Evolution & Ecology', nameKr: '진화와 생태계', category: 'Biology', level: 'advanced' },
        ],
    },
    {
        subject: 'Korean',
        subjectKr: '국어',
        topics: [
            // Basic
            { id: 'kor-1', name: 'Reading Comprehension', nameKr: '독해', category: 'Reading', level: 'basic' },
            { id: 'kor-2', name: 'Basic Writing', nameKr: '기초 작문', category: 'Writing', level: 'basic' },
            { id: 'kor-3', name: 'Grammar Basics', nameKr: '문법 기초', category: 'Grammar', level: 'basic' },
            // Intermediate
            { id: 'kor-4', name: 'Essay Structure', nameKr: '글의 구조', category: 'Writing', level: 'intermediate' },
            { id: 'kor-5', name: 'Literature Analysis', nameKr: '문학 분석', category: 'Literature', level: 'intermediate' },
            { id: 'kor-6', name: 'Poetry', nameKr: '시', category: 'Literature', level: 'intermediate' },
            // Advanced
            { id: 'kor-7', name: 'Classical Literature', nameKr: '고전문학', category: 'Literature', level: 'advanced' },
            { id: 'kor-8', name: 'Critical Essay', nameKr: '비평문', category: 'Writing', level: 'advanced' },
            { id: 'kor-9', name: 'Debate & Rhetoric', nameKr: '토론과 수사학', category: 'Speaking', level: 'advanced' },
        ],
    },
    {
        subject: 'Music',
        subjectKr: '음악',
        topics: [
            { id: 'mus-1', name: 'Basic Theory', nameKr: '기초 이론', category: 'Theory', level: 'basic' },
            { id: 'mus-2', name: 'Piano Practice', nameKr: '피아노 연습', category: 'Practice', level: 'intermediate' },
            { id: 'mus-3', name: 'Vocal Training', nameKr: '보컬 트레이닝', category: 'Practice', level: 'intermediate' },
        ],
    },
    {
        subject: 'Art',
        subjectKr: '미술',
        topics: [
            { id: 'art-1', name: 'Drawing Basics', nameKr: '드로잉 기초', category: 'Practice', level: 'basic' },
            { id: 'art-2', name: 'Color Theory', nameKr: '색채학', category: 'Theory', level: 'intermediate' },
            { id: 'art-3', name: 'Oil Painting', nameKr: '유화', category: 'Practice', level: 'advanced' },
        ],
    },
    {
        subject: 'Coding',
        subjectKr: '코딩',
        topics: [
            { id: 'cod-1', name: 'Logic & Loops', nameKr: '로직과 반복문', category: 'Basics', level: 'basic' },
            { id: 'cod-2', name: 'Web Development', nameKr: '웹 개발', category: 'Web', level: 'intermediate' },
            { id: 'cod-3', name: 'Data Structures', nameKr: '자료구조', category: 'CS', level: 'advanced' },
        ],
    },
    {
        subject: 'General',
        subjectKr: '일반',
        topics: [
            { id: 'gen-1', name: 'Review Previous Lesson', nameKr: '지난 수업 복습', category: 'General', level: 'basic' },
            { id: 'gen-2', name: 'Homework Check', nameKr: '숙제 확인', category: 'General', level: 'basic' },
            { id: 'gen-3', name: 'Concept Introduction', nameKr: '개념 도입', category: 'General', level: 'intermediate' },
            { id: 'gen-4', name: 'Practice Problems', nameKr: '연습 문제', category: 'General', level: 'intermediate' },
            { id: 'gen-5', name: 'Test Preparation', nameKr: '시험 대비', category: 'General', level: 'advanced' },
        ],
    },
];

// Get topics for a specific subject
export function getTopicsForSubject(subject: string): CurriculumTopic[] {
    const curriculum = CURRICULUM_DATA.find(c =>
        c.subject.toLowerCase() === subject.toLowerCase() ||
        c.subjectKr === subject
    );
    return curriculum?.topics || [];
}

// Get all subjects
export function getAllSubjects(): { name: string; nameKr: string }[] {
    return CURRICULUM_DATA.map(c => ({ name: c.subject, nameKr: c.subjectKr }));
}

// Get topics by level
export function getTopicsByLevel(subject: string, level: 'basic' | 'intermediate' | 'advanced'): CurriculumTopic[] {
    return getTopicsForSubject(subject).filter(t => t.level === level);
}
