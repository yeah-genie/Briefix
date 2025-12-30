import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { colors, radius, spacing, typography } from '@/constants/Colors';
import { Svg, Path, Rect } from 'react-native-svg';
import { transcribeAudio } from '@/services/geminiService';

function MicIcon({ size = 24, color = colors.text.primary, active = false }) {
    const fillColor = active ? colors.status.error : "none";
    const strokeColor = active ? colors.status.error : color;
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="9" y="3" width="6" height="12" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
            <Path d="M5 10V11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11V10" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <Path d="M12 18V22M8 22H16" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </Svg>
    );
}

interface VoiceRecorderProps {
    onTranscription: (text: string) => void;
}

export function VoiceRecorder({ onTranscription }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [duration, setDuration] = useState(0);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const recordingRef = useRef<Audio.Recording | null>(null);

    useEffect(() => {
        // Request permission on mount
        (async () => {
            try {
                const { status } = await Audio.requestPermissionsAsync();
                setPermissionGranted(status === 'granted');
            } catch (error) {
                console.log('Audio permission error:', error);
            }
        })();
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRecording) {
            interval = setInterval(() => setDuration(d => d + 1), 1000);
        } else {
            setDuration(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const startRecording = async () => {
        if (!permissionGranted) {
            Alert.alert('Permission Required', 'Microphone access is needed to record voice memos.');
            return;
        }

        try {
            // Configure audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // Create and start recording
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            recordingRef.current = recording;
            setIsRecording(true);
        } catch (error) {
            console.error('Failed to start recording:', error);
            Alert.alert('Error', 'Failed to start recording. Please try again.');
        }
    };

    const stopRecording = async () => {
        if (!recordingRef.current) return;

        setIsRecording(false);
        setIsProcessing(true);

        try {
            await recordingRef.current.stopAndUnloadAsync();
            const uri = recordingRef.current.getURI();
            if (!uri) throw new Error('No recording URI found');

            console.log('[VoiceRecorder] Recording stopped, URI:', uri);

            // Read the file as base64
            const base64Audio = await FileSystem.readAsStringAsync(uri, {
                encoding: 'base64' as any,
            });

            // Reset audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });

            // Transcribe using Gemini
            const result = await transcribeAudio(base64Audio);

            // Provide the transcription result
            onTranscription(result.text);

        } catch (error) {
            console.error('Failed to process recording:', error);
            Alert.alert('Error', 'Failed to transcribe recording. It will be saved without transcription.');
            onTranscription('[Voice memo recorded - transcription failed]');
        } finally {
            setIsProcessing(false);
            recordingRef.current = null;
        }
    };

    const handleToggleRecord = async () => {
        if (isRecording) {
            await stopRecording();
        } else {
            await startRecording();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>VOICE MEMO</Text>
                {isRecording && (
                    <View style={styles.recordingIndicator}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingText}>{formatTime(duration)}</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                style={[
                    styles.recordButton,
                    isRecording && styles.recordButtonActive,
                    isProcessing && styles.recordButtonProcessing
                ]}
                onPress={handleToggleRecord}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <Text style={styles.processingText}>Saving...</Text>
                ) : (
                    <View style={styles.buttonContent}>
                        <MicIcon size={24} color={isRecording ? colors.status.error : colors.accent.default} active={isRecording} />
                        <Text style={[
                            styles.buttonText,
                            isRecording ? { color: colors.status.error } : { color: colors.accent.default }
                        ]}>
                            {isRecording ? "Stop Recording" : "Tap to Record"}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {!permissionGranted && (
                <Text style={styles.permissionText}>
                    Microphone permission required
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    label: {
        ...typography.caption,
        color: colors.text.muted,
        letterSpacing: 1,
    },
    recordingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.status.error,
    },
    recordingText: {
        ...typography.caption,
        color: colors.status.error,
        fontVariant: ['tabular-nums'],
    },
    // ✨ Hero 스타일 녹음 버튼
    recordButton: {
        backgroundColor: colors.bg.secondary,
        paddingVertical: spacing.xl + spacing.lg, // 더 크게
        paddingHorizontal: spacing.xl,
        borderRadius: radius.xl, // 더 둥글게
        borderWidth: 2,
        borderColor: colors.accent.default,
        alignItems: 'center',
        justifyContent: 'center',
        // 그라디언트 대신 그림자 효과
        shadowColor: colors.accent.default,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    recordButtonActive: {
        borderColor: colors.status.error,
        backgroundColor: `${colors.status.error}15`,
        shadowColor: colors.status.error,
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    recordButtonProcessing: {
        opacity: 0.7,
        borderColor: colors.text.muted,
    },
    buttonContent: {
        flexDirection: 'column', // 세로 배치
        alignItems: 'center',
        gap: spacing.sm,
    },
    buttonText: {
        ...typography.lg, // 더 큰 글씨
        fontWeight: '600',
    },
    processingText: {
        ...typography.sm,
        color: colors.text.secondary,
    },
    permissionText: {
        ...typography.xs,
        color: colors.status.warning,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});
