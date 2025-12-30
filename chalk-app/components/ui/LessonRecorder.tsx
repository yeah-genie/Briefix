import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, typography, spacing, radius } from '@/constants/Colors';
import { recordingService, RecordingState } from '@/lib/recordingService';
import { MicIcon, StopIcon, PauseIcon, PlayIcon } from '@/components/Icons';

interface LessonRecorderProps {
    studentId?: string | null;
    studentName?: string;
    onRecordingComplete?: (recordingId: string, duration: number) => void;
    onAnalysisReady?: (recordingId: string) => void;
}

export function LessonRecorder({
    studentId = null,
    studentName = '학생',
    onRecordingComplete,
    onAnalysisReady,
}: LessonRecorderProps) {
    const [state, setState] = useState<RecordingState>('idle');
    const [duration, setDuration] = useState(0);
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        // Set up event handlers
        recordingService.setEventHandlers({
            onStateChange: setState,
            onDurationUpdate: setDuration,
            onAnalysisReady,
            onError: (error) => {
                console.error('Recording error:', error);
                setState('idle');
            },
        });

        return () => {
            recordingService.cleanup();
        };
    }, []);

    // Pulse animation while recording
    useEffect(() => {
        if (state === 'recording') {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        } else {
            pulseAnim.setValue(1);
        }
    }, [state]);

    const handleStart = async () => {
        const sessionId = await recordingService.startRecording(studentId);
        if (!sessionId) {
            // Handle error
        }
    };

    const handlePause = () => {
        recordingService.pauseRecording();
    };

    const handleResume = () => {
        recordingService.resumeRecording();
    };

    const handleStop = async () => {
        const result = await recordingService.stopRecording();
        if (result) {
            const session = recordingService.getCurrentSession();
            if (session) {
                onRecordingComplete?.(session.id, result.duration);
            }
        }
    };

    const handleCancel = () => {
        recordingService.cancelRecording();
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Idle state - show start button
    if (state === 'idle') {
        return (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                <View style={styles.startIconContainer}>
                    <MicIcon size={32} color="#fff" />
                </View>
                <Text style={styles.startText}>수업 녹음 시작</Text>
                <Text style={styles.startSubtext}>
                    탭 한 번으로 AI가 자동 분석
                </Text>
            </TouchableOpacity>
        );
    }

    // Recording/Paused state
    return (
        <View style={styles.recordingContainer}>
            {/* Pulse indicator */}
            <Animated.View
                style={[
                    styles.pulseOuter,
                    { transform: [{ scale: pulseAnim }] },
                ]}
            />

            {/* Main indicator */}
            <View style={[
                styles.mainIndicator,
                state === 'recording' ? styles.indicatorRecording : styles.indicatorPaused,
            ]}>
                {state === 'recording' ? (
                    <View style={styles.recordingDot} />
                ) : (
                    <PauseIcon size={24} color={colors.status.warning} />
                )}
            </View>

            {/* Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.studentLabel}>{studentName} 수업</Text>
                <Text style={styles.durationText}>{formatDuration(duration)}</Text>
                <Text style={styles.stateText}>
                    {state === 'recording' ? '녹음 중...' : '일시정지'}
                </Text>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                {state === 'recording' ? (
                    <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
                        <PauseIcon size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.controlButton} onPress={handleResume}>
                        <PlayIcon size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.controlButton, styles.stopButton]}
                    onPress={handleStop}
                >
                    <StopIcon size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // Start button
    startButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.xl,
        borderWidth: 2,
        borderColor: colors.accent.default + '40',
        borderStyle: 'dashed',
    },
    startIconContainer: {
        width: 72,
        height: 72,
        borderRadius: radius.full,
        backgroundColor: colors.accent.default,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        shadowColor: colors.accent.default,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    startText: {
        ...typography.h3,
        color: colors.text.primary,
        fontWeight: '700',
        marginBottom: 4,
    },
    startSubtext: {
        ...typography.small,
        color: colors.text.muted,
    },

    // Recording container
    recordingContainer: {
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: colors.bg.elevated,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.status.error + '40',
    },
    pulseOuter: {
        position: 'absolute',
        top: spacing.xl - 8,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.status.error + '20',
    },
    mainIndicator: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    indicatorRecording: {
        backgroundColor: colors.status.error + '30',
        borderWidth: 2,
        borderColor: colors.status.error,
    },
    indicatorPaused: {
        backgroundColor: colors.status.warning + '30',
        borderWidth: 2,
        borderColor: colors.status.warning,
    },
    recordingDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.status.error,
    },

    // Info
    infoContainer: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    studentLabel: {
        ...typography.body,
        color: colors.text.secondary,
        marginBottom: 4,
    },
    durationText: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.text.primary,
        fontVariant: ['tabular-nums'],
    },
    stateText: {
        ...typography.small,
        color: colors.status.error,
        marginTop: 4,
    },

    // Controls
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    controlButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.bg.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    stopButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.status.error,
        borderWidth: 0,
    },
    cancelButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    cancelText: {
        ...typography.small,
        color: colors.text.muted,
    },
});
