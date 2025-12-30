/**
 * RecordingService (Mobile)
 * expo-av 기반 수업 녹음 서비스
 * 웹의 LessonRecordingService와 동일한 인터페이스
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { supabase } from './supabase';
import { Platform } from 'react-native';

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

export interface RecordingSession {
    id: string;
    studentId: string | null;
    startTime: Date;
    duration: number; // seconds
    state: RecordingState;
}

export interface RecordingEventHandlers {
    onStateChange?: (state: RecordingState) => void;
    onDurationUpdate?: (seconds: number) => void;
    onError?: (error: Error) => void;
    onUploadProgress?: (progress: number) => void;
    onAnalysisReady?: (recordingId: string) => void;
}

class MobileRecordingService {
    private recording: Audio.Recording | null = null;
    private startTime: Date | null = null;
    private durationInterval: ReturnType<typeof setInterval> | null = null;
    private currentSession: RecordingSession | null = null;
    private handlers: RecordingEventHandlers = {};

    /**
     * 오디오 권한 요청 및 설정
     */
    async initialize(): Promise<boolean> {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                this.handlers.onError?.(new Error('마이크 권한이 필요합니다.'));
                return false;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true, // 백그라운드 녹음
                shouldDuckAndroid: true,
            });

            return true;
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            this.handlers.onError?.(new Error('오디오 초기화 실패'));
            return false;
        }
    }

    /**
     * 이벤트 핸들러 설정
     */
    setEventHandlers(handlers: RecordingEventHandlers): void {
        this.handlers = handlers;
    }

    /**
     * 녹음 시작
     */
    async startRecording(studentId: string | null = null): Promise<string | null> {
        const initialized = await this.initialize();
        if (!initialized) return null;

        try {
            const { data: user } = await supabase.auth.getUser();
            if (!user.user) {
                throw new Error('로그인이 필요합니다.');
            }

            // Generate session ID
            const sessionId = Date.now().toString();
            this.startTime = new Date();

            // Create recording record
            await supabase.from('lesson_logs').insert({
                id: sessionId,
                user_id: user.user.id,
                student_id: studentId,
                date: this.startTime.toISOString().split('T')[0],
                duration: 0,
                recording_status: 'recording',
            });

            // Start recording with high quality
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            this.recording = recording;

            // Track session
            this.currentSession = {
                id: sessionId,
                studentId,
                startTime: this.startTime,
                duration: 0,
                state: 'recording',
            };

            // Start duration tracking
            this.startDurationTracking();
            this.handlers.onStateChange?.('recording');

            return sessionId;
        } catch (error) {
            console.error('Failed to start recording:', error);
            this.handlers.onError?.(error as Error);
            return null;
        }
    }

    /**
     * 녹음 일시정지
     */
    async pauseRecording(): Promise<void> {
        if (!this.recording) return;

        try {
            await this.recording.pauseAsync();
            this.stopDurationTracking();
            if (this.currentSession) {
                this.currentSession.state = 'paused';
            }
            this.handlers.onStateChange?.('paused');
        } catch (error) {
            console.error('Failed to pause:', error);
        }
    }

    /**
     * 녹음 재개
     */
    async resumeRecording(): Promise<void> {
        if (!this.recording) return;

        try {
            await this.recording.startAsync();
            this.startDurationTracking();
            if (this.currentSession) {
                this.currentSession.state = 'recording';
            }
            this.handlers.onStateChange?.('recording');
        } catch (error) {
            console.error('Failed to resume:', error);
        }
    }

    /**
     * 녹음 중지 및 저장
     */
    async stopRecording(): Promise<{ uri: string; duration: number } | null> {
        if (!this.recording || !this.currentSession) return null;

        try {
            this.stopDurationTracking();
            await this.recording.stopAndUnloadAsync();

            const uri = this.recording.getURI();
            if (!uri) {
                throw new Error('녹음 파일을 찾을 수 없습니다.');
            }

            const duration = this.currentSession.duration;

            // Upload to Supabase Storage
            await this.uploadRecording(uri);

            this.currentSession.state = 'stopped';
            this.handlers.onStateChange?.('stopped');

            // Trigger analysis
            this.triggerAnalysis(this.currentSession.id);

            return { uri, duration };
        } catch (error) {
            console.error('Failed to stop recording:', error);
            this.handlers.onError?.(error as Error);
            return null;
        }
    }

    /**
     * 녹음 취소
     */
    async cancelRecording(): Promise<void> {
        if (this.recording) {
            try {
                await this.recording.stopAndUnloadAsync();
            } catch { }
        }

        this.stopDurationTracking();

        // Delete record
        if (this.currentSession) {
            await supabase
                .from('lesson_logs')
                .delete()
                .eq('id', this.currentSession.id);
        }

        this.recording = null;
        this.currentSession = null;
        this.handlers.onStateChange?.('idle');
    }

    /**
     * 녹음 파일 업로드
     */
    private async uploadRecording(localUri: string): Promise<string | null> {
        if (!this.currentSession) return null;

        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return null;

        try {
            // Read file as base64
            const base64 = await FileSystem.readAsStringAsync(localUri, {
                encoding: 'base64' as const,
            });

            const fileName = `${user.user.id}/${this.currentSession.id}.m4a`;
            const contentType = Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mp4';

            // Convert base64 to Blob
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: contentType });

            // Upload
            const { error: uploadError } = await supabase.storage
                .from('recordings')
                .upload(fileName, blob, {
                    contentType,
                    upsert: true,
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw uploadError;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('recordings')
                .getPublicUrl(fileName);

            // Update record
            await supabase
                .from('lesson_logs')
                .update({
                    duration: this.currentSession.duration,
                    recording_url: urlData.publicUrl,
                    recording_status: 'processing',
                })
                .eq('id', this.currentSession.id);

            return urlData.publicUrl;
        } catch (error) {
            console.error('Upload failed:', error);
            this.handlers.onError?.(new Error('녹음 업로드 실패'));
            return null;
        }
    }

    /**
     * AI 분석 트리거
     */
    private async triggerAnalysis(recordingId: string): Promise<void> {
        try {
            // Call Supabase Edge Function for analysis
            const { error } = await supabase.functions.invoke('analyze-recording', {
                body: { recordingId },
            });

            if (!error) {
                this.handlers.onAnalysisReady?.(recordingId);
            }
        } catch (error) {
            console.error('Analysis trigger failed:', error);
        }
    }

    /**
     * 시간 추적 시작
     */
    private startDurationTracking(): void {
        this.durationInterval = setInterval(() => {
            if (this.startTime && this.currentSession) {
                const now = new Date();
                this.currentSession.duration = Math.floor(
                    (now.getTime() - this.startTime.getTime()) / 1000
                );
                this.handlers.onDurationUpdate?.(this.currentSession.duration);
            }
        }, 1000);
    }

    /**
     * 시간 추적 중지
     */
    private stopDurationTracking(): void {
        if (this.durationInterval) {
            clearInterval(this.durationInterval);
            this.durationInterval = null;
        }
    }

    /**
     * 현재 세션 정보
     */
    getCurrentSession(): RecordingSession | null {
        return this.currentSession;
    }

    /**
     * 녹음 중인지 확인
     */
    isRecording(): boolean {
        return this.currentSession?.state === 'recording';
    }

    /**
     * 시간 포맷
     */
    static formatDuration(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * 리소스 정리
     */
    cleanup(): void {
        this.stopDurationTracking();
        if (this.recording) {
            this.recording.stopAndUnloadAsync().catch(() => { });
            this.recording = null;
        }
        this.currentSession = null;
    }
}

// Singleton export
export const recordingService = new MobileRecordingService();
export default MobileRecordingService;
