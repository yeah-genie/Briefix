import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { colors, typography, spacing, radius } from '@/constants/Colors';
import { Student, LessonLog } from '@/lib/DataContext';

interface RatingNotificationProps {
    pendingLesson: {
        student: Student;
        topic?: string;
        duration: number;
        date: string;
    } | null;
    onRate: (rating: 'good' | 'okay' | 'struggled') => void;
    onDismiss: () => void;
    autoCloseSeconds?: number;
}

/**
 * Zero-Action 평가 알림
 * 수업 종료 후 앱 열면 바로 보이는 플로팅 카드
 * 이모지 1탭으로 평가 완료
 */
export function RatingNotification({
    pendingLesson,
    onRate,
    onDismiss,
    autoCloseSeconds = 15,
}: RatingNotificationProps) {
    const [slideAnim] = useState(new Animated.Value(-200));
    const [countdown, setCountdown] = useState(autoCloseSeconds);

    useEffect(() => {
        if (pendingLesson) {
            // Slide in
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }).start();

            // Auto-close countdown
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        handleAutoClose();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [pendingLesson]);

    const handleAutoClose = () => {
        // 자동 닫힘 시 기본값 'okay'로 저장
        onRate('okay');
        slideOut();
    };

    const handleRate = (rating: 'good' | 'okay' | 'struggled') => {
        onRate(rating);
        slideOut();
    };

    const slideOut = () => {
        Animated.timing(slideAnim, {
            toValue: -200,
            duration: 200,
            useNativeDriver: true,
        }).start(() => onDismiss());
    };

    if (!pendingLesson) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY: slideAnim }] },
            ]}
        >
            <View style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.studentBadge}>
                        <Text style={styles.studentInitial}>
                            {pendingLesson.student.name.charAt(0)}
                        </Text>
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.title}>
                            {pendingLesson.student.name} 수업 끝!
                        </Text>
                        <Text style={styles.subtitle}>
                            {pendingLesson.topic || '수업'} • {pendingLesson.duration}분
                        </Text>
                    </View>
                    <Text style={styles.countdown}>{countdown}s</Text>
                </View>

                {/* Question */}
                <Text style={styles.question}>오늘 수업 어땠어요?</Text>

                {/* Rating Buttons */}
                <View style={styles.ratingRow}>
                    <TouchableOpacity
                        style={[styles.ratingBtn, styles.ratingGood]}
                        onPress={() => handleRate('good')}
                    >
                        <Text style={styles.ratingEmoji}>😊</Text>
                        <Text style={styles.ratingLabel}>좋았어요</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.ratingBtn, styles.ratingOkay]}
                        onPress={() => handleRate('okay')}
                    >
                        <Text style={styles.ratingEmoji}>😐</Text>
                        <Text style={styles.ratingLabel}>보통</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.ratingBtn, styles.ratingStruggled]}
                        onPress={() => handleRate('struggled')}
                    >
                        <Text style={styles.ratingEmoji}>😢</Text>
                        <Text style={styles.ratingLabel}>어려웠어요</Text>
                    </TouchableOpacity>
                </View>

                {/* Auto-save notice */}
                <Text style={styles.autoSaveNotice}>
                    {countdown}초 후 '보통'으로 자동 저장됩니다
                </Text>
            </View>
        </Animated.View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: spacing.md,
        right: spacing.md,
        zIndex: 1000,
    },
    card: {
        backgroundColor: colors.bg.elevated,
        borderRadius: radius.xl,
        padding: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    studentBadge: {
        width: 44,
        height: 44,
        borderRadius: radius.full,
        backgroundColor: colors.accent.default + '30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    studentInitial: {
        ...typography.h3,
        color: colors.accent.default,
        fontWeight: '700',
    },
    headerText: {
        flex: 1,
        marginLeft: spacing.md,
    },
    title: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '700',
    },
    subtitle: {
        ...typography.small,
        color: colors.text.muted,
        marginTop: 2,
    },
    countdown: {
        ...typography.caption,
        color: colors.text.muted,
        backgroundColor: colors.bg.secondary,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.sm,
    },
    question: {
        ...typography.h3,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    ratingBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
    },
    ratingGood: {
        backgroundColor: colors.status.success + '15',
        borderColor: colors.status.success + '30',
    },
    ratingOkay: {
        backgroundColor: colors.status.warning + '15',
        borderColor: colors.status.warning + '30',
    },
    ratingStruggled: {
        backgroundColor: colors.status.error + '15',
        borderColor: colors.status.error + '30',
    },
    ratingEmoji: {
        fontSize: 32,
        marginBottom: 4,
    },
    ratingLabel: {
        ...typography.small,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    autoSaveNotice: {
        ...typography.caption,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: spacing.md,
    },
});
