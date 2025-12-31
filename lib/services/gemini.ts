"use server";

import { AP_SUBJECTS, findTopicByCode, type Topic } from "@/lib/knowledge-graph";

// ===================================
// GEMINI TOPIC EXTRACTION SERVICE
// 전사 → 토픽 추출 + 이해도 평가
// ===================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Types
export interface ExtractedTopic {
    topicId: string;
    topicName: string;
    status: 'new' | 'learning' | 'reviewed' | 'mastered';
    confidence: number; // 0-100
    evidence: string; // 관련 문장
}

export interface ExtractionResult {
    success: boolean;
    topics: ExtractedTopic[];
    summary?: string;
    error?: string;
}

// ===================================
// TOPIC EXTRACTION PROMPT
// ===================================

function buildExtractionPrompt(transcript: string, subjectId: string): string {
    const subject = AP_SUBJECTS.find(s => s.id === subjectId);
    if (!subject) {
        return '';
    }

    // Get all topic codes and names for this subject
    const topicList = subject.topics
        .map(t => `- ${t.id}: ${t.name}`)
        .join('\n');

    return `You are an expert AP tutor analyzing a tutoring session transcript.

SUBJECT: ${subject.name}

AVAILABLE TOPICS (use ONLY these topic IDs):
${topicList}

TRANSCRIPT:
"""
${transcript}
"""

TASK: Analyze the transcript and identify which topics were covered. For each topic:
1. Determine the student's understanding level based on their responses
2. Extract a direct quote as evidence

UNDERSTANDING LEVELS:
- "new": Topic introduced but student shows confusion or no prior knowledge
- "learning": Student understands basics but makes errors or needs hints
- "reviewed": Student recalls and applies concepts with minor mistakes
- "mastered": Student explains correctly, solves problems independently

RESPOND IN THIS EXACT JSON FORMAT:
{
    "topics": [
        {
            "topicId": "calc-1-2",
            "status": "learning",
            "confidence": 75,
            "evidence": "Student said: 'So the limit is when x approaches...'"
        }
    ],
    "summary": "Brief 1-2 sentence summary of what was covered"
}

RULES:
- Only include topics that were actually discussed
- Use EXACT topic IDs from the list above
- Confidence is how certain you are about the status (0-100)
- Evidence must be a direct quote or paraphrase from the transcript
- Return empty topics array if no relevant topics found
`;
}

// ===================================
// CALL GEMINI API
// ===================================

export async function extractTopicsFromTranscript(
    transcript: string,
    subjectId: string
): Promise<ExtractionResult> {
    // Check for API key
    if (!GEMINI_API_KEY) {
        console.warn('[Gemini] No API key - returning demo data');
        return getDemoExtractionResult(subjectId);
    }

    const prompt = buildExtractionPrompt(transcript, subjectId);
    if (!prompt) {
        return {
            success: false,
            topics: [],
            error: 'Invalid subject ID',
        };
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.2, // Low for consistency
                    topP: 0.8,
                    maxOutputTokens: 2048,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse JSON from response
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        const subject = AP_SUBJECTS.find(s => s.id === subjectId);

        // Validate and enrich topic data
        const validatedTopics: ExtractedTopic[] = [];
        for (const topic of parsed.topics || []) {
            const foundTopic = subject?.topics.find(t => t.id === topic.topicId);
            if (foundTopic) {
                validatedTopics.push({
                    topicId: topic.topicId,
                    topicName: foundTopic.name,
                    status: topic.status || 'new',
                    confidence: Math.min(100, Math.max(0, topic.confidence || 50)),
                    evidence: topic.evidence || '',
                });
            }
        }

        return {
            success: true,
            topics: validatedTopics,
            summary: parsed.summary,
        };
    } catch (error) {
        console.error('[Gemini] Extraction error:', error);
        return {
            success: false,
            topics: [],
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ===================================
// DEMO MODE (when no API key)
// ===================================

function getDemoExtractionResult(subjectId: string): ExtractionResult {
    // Return demo topics based on subject
    if (subjectId === 'ap-calc-ab') {
        return {
            success: true,
            topics: [
                {
                    topicId: 'calc-1-2',
                    topicName: 'Defining Limits and Using Limit Notation',
                    status: 'learning',
                    confidence: 80,
                    evidence: 'Student practiced limit notation with several examples',
                },
                {
                    topicId: 'calc-1-8',
                    topicName: 'Continuity',
                    status: 'reviewed',
                    confidence: 70,
                    evidence: 'Reviewed continuity conditions and identified discontinuities',
                },
            ],
            summary: 'Covered limit notation and continuity concepts. Student showing good progress on limits.',
        };
    }

    if (subjectId === 'ap-physics-1') {
        return {
            success: true,
            topics: [
                {
                    topicId: 'phys-1-2',
                    topicName: 'Displacement, Velocity, and Acceleration',
                    status: 'learning',
                    confidence: 75,
                    evidence: 'Practiced velocity and acceleration problems',
                },
            ],
            summary: 'Focused on kinematics fundamentals. Student needs more practice with acceleration.',
        };
    }

    return {
        success: true,
        topics: [],
        summary: 'No specific topics identified in this session.',
    };
}

// ===================================
// MASTERY SCORE CALCULATION
// ===================================

const STATUS_SCORES: Record<string, number> = {
    'new': 10,
    'learning': 35,
    'reviewed': 65,
    'mastered': 90,
};

const TIME_DECAY_RATE = 0.05; // 5% per week

export function calculateNewScore(
    currentScore: number,
    newStatus: 'new' | 'learning' | 'reviewed' | 'mastered',
    confidence: number,
    daysSinceLastReview?: number
): number {
    // Apply time decay if applicable
    let decayedScore = currentScore;
    if (daysSinceLastReview && daysSinceLastReview > 0) {
        const weeksElapsed = daysSinceLastReview / 7;
        const decay = Math.pow(1 - TIME_DECAY_RATE, weeksElapsed);
        decayedScore = currentScore * decay;
    }

    // Calculate target score from new status
    const targetScore = STATUS_SCORES[newStatus] || 0;

    // Blend with confidence weight
    const confidenceWeight = confidence / 100;
    const newScore = decayedScore + (targetScore - decayedScore) * confidenceWeight * 0.5;

    // Clamp to 0-100
    return Math.round(Math.min(100, Math.max(0, newScore)));
}

export function getStatusFromScore(score: number): 'new' | 'learning' | 'reviewed' | 'mastered' {
    if (score >= 80) return 'mastered';
    if (score >= 55) return 'reviewed';
    if (score >= 25) return 'learning';
    return 'new';
}
