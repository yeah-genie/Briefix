'use client';

import React, { useState, useEffect } from 'react';
import MasteryMatrix from '@/components/analysis/MasteryMatrix';
import TopicInsightPanel from '@/components/analysis/TopicInsightPanel';
import Sidebar from '@/components/layout/Sidebar';
import { Topic, Subject } from '@/lib/knowledge-graph';
import { getTopicInsights } from '@/lib/actions/crud';

interface AnalysisClientProps {
    initialMastery: any[];
    studentId: string;
    studentName: string;
    subject: Subject;
}

export default function AnalysisClient({ initialMastery, studentId, studentName, subject }: AnalysisClientProps) {
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [topicInsights, setTopicInsights] = useState<any>(null);
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);

    // Fetch insights when a topic is selected
    useEffect(() => {
        async function fetchInsights() {
            if (!selectedTopic) {
                setTopicInsights(null);
                return;
            }

            setIsLoadingInsights(true);
            try {
                const insights = await getTopicInsights(studentId, selectedTopic.id);
                setTopicInsights(insights || {
                    text: `No specific session evidence found for ${selectedTopic.name} yet. AI analysis will appear here after your next recorded session.`,
                    nextSteps: ["Record a session mentioning this topic", "Manual review of student's verbal reasoning"],
                    evidence: []
                });
            } catch (err) {
                console.error("Failed to fetch insights:", err);
            } finally {
                setIsLoadingInsights(false);
            }
        }

        fetchInsights();
    }, [selectedTopic, studentId]);

    return (
        <div className="flex h-screen bg-[#050510] overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col p-10 ml-64">
                <header className="mb-10 flex justify-between items-end">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-2.5 h-2.5 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_12px_#10b981]" />
                            <span className="text-[10px] text-[#10b981] font-black uppercase tracking-[0.3em]">Live Intelligence</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">Mastery Board</h1>
                        <p className="text-white/40 text-sm font-semibold tracking-tight">
                            Analyzing <span className="text-white">{studentName}'s</span> progress in {subject.name}
                        </p>
                    </div>

                    <div className="flex items-center space-x-3 bg-white/5 p-1.5 rounded-2xl border border-white/5 shadow-xl">
                        <button className="px-6 py-3 bg-white/10 text-white rounded-xl text-xs font-black transition-all hover:bg-white/15 ring-1 ring-white/10">
                            Current Matrix
                        </button>
                    </div>
                </header>

                <main className="flex-1 min-h-0 relative">
                    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-600/5 blur-[120px] rounded-full -z-10" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/5 blur-[150px] rounded-full -z-10" />

                    <MasteryMatrix
                        subject={subject}
                        mastery={initialMastery}
                        onTopicClick={(topic) => setSelectedTopic(topic)}
                        isCompact={!!selectedTopic}
                    />
                </main>
            </div>

            <TopicInsightPanel
                topic={selectedTopic}
                onClose={() => setSelectedTopic(null)}
                masteryLevel={initialMastery.find(m => m.topicId === selectedTopic?.id)?.level || 0}
                insights={topicInsights || { text: "Loading AI insights...", nextSteps: [], evidence: [] }}
            />
        </div>
    );
}
