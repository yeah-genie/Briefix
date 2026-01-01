'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, CheckCircle, Loader2, AlertCircle, Share2, ExternalLink, Camera, Image as ImageIcon, Plus, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { processSessionAudio } from '@/lib/actions/analysis';
import Link from 'next/link';

import type { Student } from '@/lib/types/database';

interface VoiceRecorderProps {
    studentId?: string;
    subjectId?: string;
    students?: Student[];
    onRecordingComplete?: (blob: Blob) => void;
    className?: string;
}

export default function VoiceRecorder({
    studentId: initialStudentId,
    subjectId: initialSubjectId,
    students = [],
    onRecordingComplete,
    className
}: VoiceRecorderProps) {
    const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId || (students.length > 0 ? students[0].id : ''));
    const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId || (students.length > 0 ? students[0].subject_id : ''));

    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Cleanup URLs
    useEffect(() => {
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            imageUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [audioUrl, imageUrls]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newImages = [...images, ...files].slice(0, 3); // Max 3 images
        const newUrls = newImages.map(file => URL.createObjectURL(file));

        setImages(newImages);
        setImageUrls(newUrls);
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newUrls = [...imageUrls];
        URL.revokeObjectURL(newUrls[index]);
        newUrls.splice(index, 1);
        setImageUrls(newUrls);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop());

                // Auto-submit for Zero-Action UX
                setTimeout(() => {
                    submitRecording(blob);
                }, 500);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setIsPaused(false);
            setDuration(0);
            setAudioBlob(null);

            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Failed to start recording:", err);
            alert("Microphone access is required to record sessions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const togglePause = () => {
        if (mediaRecorderRef.current) {
            if (isPaused) {
                mediaRecorderRef.current.resume();
                timerRef.current = setInterval(() => {
                    setDuration(prev => prev + 1);
                }, 1000);
            } else {
                mediaRecorderRef.current.pause();
                if (timerRef.current) clearInterval(timerRef.current);
            }
            setIsPaused(!isPaused);
        }
    };

    const discardRecording = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        setDuration(0);
        setError(null);
        setSuccess(false);
        setSessionId(null);
        setIsCopied(false);
    };

    const copyReportLink = () => {
        if (!sessionId) return;
        const url = `${window.location.origin}/report/${sessionId}`;
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const submitRecording = async (passedBlob?: Blob) => {
        const targetBlob = passedBlob || audioBlob;
        if (!targetBlob || isAnalyzing) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('audio', targetBlob, 'session.webm');
            formData.append('studentId', selectedStudentId);
            formData.append('subjectId', selectedSubjectId);

            // Add multimodal images (P1.3)
            images.forEach((img, i) => {
                formData.append(`image_${i}`, img);
            });
            formData.append('imageCount', images.length.toString());

            const result = await processSessionAudio(formData);

            if (result.success) {
                setSuccess(true);
                setSessionId(result.sessionId);
                if (onRecordingComplete) onRecordingComplete(targetBlob);
            } else {
                setError(result.error || "Failed to analyze session");
            }
        } catch (err: any) {
            console.error("Analysis Error:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className={cn("bg-[#18181b] border border-[#27272a] rounded-2xl p-6 transition-all", className)}>
            {!isRecording && !audioBlob ? (
                <div className="flex flex-col items-center justify-center space-y-6 py-4">
                    {/* Student Selector */}
                    {students.length > 0 && (
                        <div className="w-full px-4 mb-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#71717a] mb-2 block">
                                Recording For Student
                            </label>
                            <select
                                value={selectedStudentId}
                                onChange={(e) => {
                                    const s = students.find(std => std.id === e.target.value);
                                    if (s) {
                                        setSelectedStudentId(s.id);
                                        setSelectedSubjectId(s.subject_id);
                                    }
                                }}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#10b981]/50 transition-colors cursor-pointer appearance-none"
                            >
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.subject_id})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="w-full px-4 space-y-4">
                        {/* Image Metadata Capture (P1.3) */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#71717a]">
                                    Visual Evidence (Max 3)
                                </label>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-[10px] font-black uppercase tracking-widest text-[#10b981] hover:text-emerald-400 transition-colors flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add Image
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                            </div>

                            {imageUrls.length > 0 && (
                                <div className="flex gap-2">
                                    {imageUrls.map((url, i) => (
                                        <div key={i} className="relative group w-14 h-14">
                                            <img src={url} className="w-full h-full object-cover rounded-lg border border-white/10" />
                                            <button
                                                onClick={() => removeImage(i)}
                                                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-4 py-2">
                            <button
                                onClick={startRecording}
                                className="w-16 h-16 bg-[#10b981] text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_#10b98140]"
                            >
                                <Mic size={28} />
                            </button>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-white">Start Recording Session</p>
                                <p className="text-xs text-[#71717a] mt-1">Audio + Visual data for deep analysis</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : isRecording ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center">
                                <span className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping" />
                                <span className="relative w-3 h-3 bg-red-500 rounded-full" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-white/40">Recording Live</span>
                        </div>
                        <span className="text-2xl font-black text-white font-mono">{formatDuration(duration)}</span>
                    </div>

                    {/* Waveform Visualization Placeholder (Simple Pulse for now) */}
                    <div className="h-20 flex items-center justify-center gap-1">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-1 bg-[#10b981] rounded-full transition-all duration-300",
                                    isPaused ? "h-2 opacity-20" : "animate-pulse"
                                )}
                                style={{
                                    height: isPaused ? '8px' : `${Math.random() * 40 + 10}px`,
                                    animationDelay: `${i * 0.05}s`
                                }}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={togglePause}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
                        >
                            {isPaused ? <Play size={20} /> : <Pause size={20} />}
                        </button>
                        <button
                            onClick={stopRecording}
                            className="p-5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg shadow-red-500/20"
                        >
                            <Square size={24} fill="currentColor" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {success ? (
                                <CheckCircle size={14} className="text-[#10b981]" />
                            ) : error ? (
                                <AlertCircle size={14} className="text-red-400" />
                            ) : (
                                <CheckCircle size={14} className="text-white/40" />
                            )}
                            <span className={cn(
                                "text-xs font-black uppercase tracking-widest",
                                success ? "text-[#10b981]" : error ? "text-red-400" : "text-white/40"
                            )}>
                                {success ? "Analysis Complete" : error ? "Analysis Failed" : "Ready for AI Analysis"}
                            </span>
                        </div>
                        <span className="text-sm font-bold text-white/60 font-mono">{formatDuration(duration)}</span>
                    </div>

                    {success ? (
                        <div className="space-y-4">
                            <div className="bg-[#10b981]/10 rounded-2xl p-5 border border-[#10b981]/20">
                                <p className="text-xs text-[#10b981] leading-relaxed font-semibold">
                                    Analysis complete! A shareable report for the student's parents is now ready.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={copyReportLink}
                                    className={cn(
                                        "py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border",
                                        isCopied
                                            ? "bg-[#10b981] border-[#10b981] text-black"
                                            : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                    )}
                                >
                                    {isCopied ? <CheckCircle size={14} /> : <Share2 size={14} />}
                                    {isCopied ? "Copied!" : "Copy Link"}
                                </button>
                                <Link
                                    href={`/report/${sessionId}`}
                                    target="_blank"
                                    className="py-3 px-4 bg-white text-black rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 hover:bg-white/90"
                                >
                                    <ExternalLink size={14} />
                                    View Report
                                </Link>
                            </div>
                        </div>
                    ) : audioUrl && (
                        <audio src={audioUrl} controls className="w-full h-8 opacity-60 rounded-lg filter invert" />
                    )}

                    {error && (
                        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                            <p className="text-xs text-red-400 leading-relaxed">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            onClick={discardRecording}
                            disabled={isAnalyzing}
                            className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm font-bold text-white/60 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                            {success ? "Reset" : "Discard"}
                        </button>
                        {!success && (
                            <button
                                onClick={() => submitRecording()}
                                disabled={isAnalyzing}
                                className="flex-[2] py-3 px-4 bg-[#10b981] hover:bg-emerald-400 text-black rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Analyze Session
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
