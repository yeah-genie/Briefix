import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';

import Colors, { spacing, typography } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import {
    ChartIcon,
    ShareIcon,
    FireIcon,
    VerifiedBadge,
    CheckCircleIcon,
} from '@/components/Icons';

const { width } = Dimensions.get('window');

// 잔디 데이터 생성 (12주)
const generateCalendarData = () => {
    const days = [];
    for (let i = 0; i < 84; i++) {
        const rand = Math.random();
        days.push(rand > 0.65 ? (rand > 0.85 ? 3 : rand > 0.75 ? 2 : 1) : 0);
    }
    return days;
};

const CALENDAR_DATA = generateCalendarData();

const STATS = {
    totalLessons: 42,
    totalStudents: 5,
    avgLevel: 78,
    streak: 12,
};

export default function PortfolioScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const handleShare = async () => {
        const message = `📚 과외 포트폴리오\n\n${STATS.totalLessons}회 수업 완료\n${STATS.totalStudents}명 학생 관리\n평균 달성도 ${STATS.avgLevel}%\n\n#Chalk 인증 튜터`;
        const url = `kakaotalk://send?text=${encodeURIComponent(message)}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) await Linking.openURL(url);
    };

    const getCalendarColor = (level: number) => {
        if (level === 0) return colors.backgroundSecondary;
        if (level === 1) return 'rgba(16, 185, 129, 0.25)';
        if (level === 2) return 'rgba(16, 185, 129, 0.5)';
        return colors.tint;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Glow effect */}
            <View style={styles.glowContainer}>
                <LinearGradient
                    colors={['rgba(16, 185, 129, 0.12)', 'transparent']}
                    style={styles.glow}
                />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={styles.profileSection}>
                    <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        style={styles.profileAvatar}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.profileInitial}>Y</Text>
                    </LinearGradient>

                    <View style={styles.profileInfo}>
                        <View style={styles.nameRow}>
                            <Text style={[styles.profileName, { color: colors.text }]}>
                                나의 포트폴리오
                            </Text>
                            <VerifiedBadge size={18} />
                        </View>
                        <Text style={[styles.profileBio, { color: colors.textMuted }]}>
                            수학 전문 과외 · {STATS.streak}일 연속 기록 중
                        </Text>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { backgroundColor: colors.backgroundTertiary }]}>
                        <Text style={[styles.statValue, { color: colors.text }]}>
                            {STATS.totalLessons}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                            총 수업
                        </Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: colors.backgroundTertiary }]}>
                        <Text style={[styles.statValue, { color: colors.text }]}>
                            {STATS.totalStudents}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                            학생 수
                        </Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: colors.backgroundTertiary }]}>
                        <Text style={[styles.statValue, { color: colors.tint }]}>
                            {STATS.avgLevel}%
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                            평균 달성
                        </Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: colors.backgroundTertiary }]}>
                        <View style={styles.streakRow}>
                            <FireIcon size={18} color="#F97316" />
                            <Text style={[styles.statValue, { color: '#F97316', marginLeft: 4 }]}>
                                {STATS.streak}
                            </Text>
                        </View>
                        <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                            연속 기록
                        </Text>
                    </View>
                </View>

                {/* Activity Calendar */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                        활동 기록
                    </Text>

                    <View style={[styles.calendarCard, { backgroundColor: colors.backgroundTertiary }]}>
                        <View style={styles.calendarGrid}>
                            {CALENDAR_DATA.map((level, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        styles.calendarCell,
                                        { backgroundColor: getCalendarColor(level) },
                                    ]}
                                />
                            ))}
                        </View>

                        <View style={styles.calendarLegend}>
                            <Text style={[styles.legendText, { color: colors.textMuted }]}>적음</Text>
                            {[0, 1, 2, 3].map(level => (
                                <View
                                    key={level}
                                    style={[styles.legendCell, { backgroundColor: getCalendarColor(level) }]}
                                />
                            ))}
                            <Text style={[styles.legendText, { color: colors.textMuted }]}>많음</Text>
                        </View>
                    </View>
                </View>

                {/* Badges */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                        획득 배지
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.badgesRow}>
                            {[
                                { icon: '🔥', label: '10일 연속', bg: 'rgba(249, 115, 22, 0.15)' },
                                { icon: '📚', label: '첫 수업', bg: 'rgba(96, 165, 250, 0.15)' },
                                { icon: '⭐', label: '성실왕', bg: 'rgba(251, 191, 36, 0.15)' },
                                { icon: '🎯', label: '목표 달성', bg: 'rgba(168, 85, 247, 0.15)' },
                            ].map((badge, idx) => (
                                <View
                                    key={idx}
                                    style={[styles.badge, { backgroundColor: badge.bg }]}
                                >
                                    <Text style={styles.badgeIcon}>{badge.icon}</Text>
                                    <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>
                                        {badge.label}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Share Button */}
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        style={styles.shareButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <ShareIcon size={18} color="#fff" />
                        <Text style={styles.shareButtonText}>포트폴리오 공유하기</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Verified Card */}
                <View
                    style={[
                        styles.verifiedCard,
                        { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.2)' }
                    ]}
                >
                    <View style={styles.verifiedRow}>
                        <CheckCircleIcon size={18} color={colors.tint} />
                        <Text style={[styles.verifiedText, { color: colors.text }]}>
                            Chalk 인증 튜터
                        </Text>
                    </View>
                    <Text style={[styles.verifiedSubtext, { color: colors.textMuted }]}>
                        {STATS.totalLessons}회의 수업 기록이 검증되었습니다
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    glowContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        overflow: 'hidden',
    },
    glow: {
        position: 'absolute',
        top: -100,
        left: '50%',
        marginLeft: -200,
        width: 400,
        height: 300,
        borderRadius: 200,
    },
    content: {
        padding: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: 100,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    profileAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInitial: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
    },
    profileInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    profileName: {
        ...typography.h2,
    },
    profileBio: {
        ...typography.bodySmall,
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    statCard: {
        flex: 1,
        minWidth: (width - spacing.lg * 2 - spacing.sm) / 2 - spacing.sm,
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
    },
    statLabel: {
        ...typography.caption,
        marginTop: 4,
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionLabel: {
        ...typography.caption,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.md,
    },
    calendarCard: {
        padding: spacing.md,
        borderRadius: 12,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    calendarCell: {
        width: 14,
        height: 14,
        borderRadius: 3,
    },
    calendarLegend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: spacing.md,
        gap: 4,
    },
    legendCell: {
        width: 12,
        height: 12,
        borderRadius: 2,
    },
    legendText: {
        ...typography.caption,
        marginHorizontal: 4,
    },
    badgesRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    badge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        minWidth: 80,
    },
    badgeIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    badgeLabel: {
        ...typography.caption,
    },
    shareButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: spacing.md,
    },
    shareButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        gap: spacing.sm,
    },
    shareButtonText: {
        color: '#fff',
        ...typography.body,
        fontWeight: '600',
    },
    verifiedCard: {
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
    },
    verifiedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    verifiedText: {
        ...typography.body,
        fontWeight: '600',
    },
    verifiedSubtext: {
        ...typography.bodySmall,
        marginTop: 4,
        marginLeft: 26,
    },
});
