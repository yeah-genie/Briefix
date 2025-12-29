import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors, typography, spacing, radius } from '@/constants/Colors';
import { Card } from './Card';
import { LessonLog, Student } from '@/lib/DataContext';
import { TrendingUpIcon, TargetIcon, LightbulbIcon, FireIcon } from '@/components/Icons';

interface AnalyticsDashboardProps {
    students: Student[];
    lessonLogs: LessonLog[];
}

interface StudentAnalytics {
    student: Student;
    totalLessons: number;
    averageRating: number;
    topTopics: { topic: string; count: number }[];
    lessonsThisMonth: number;
    growthTrend: 'up' | 'down' | 'stable';
    struggles: string[];
}

export function AnalyticsDashboard({ students, lessonLogs }: AnalyticsDashboardProps) {
    // Calculate analytics for each student
    const studentAnalytics: StudentAnalytics[] = students.map(student => {
        const logs = lessonLogs.filter(l => l.studentId === student.id);

        // Average rating
        const ratingMap = { good: 3, okay: 2, struggled: 1 };
        const avgRating = logs.length > 0
            ? logs.reduce((sum, l) => sum + (ratingMap[l.rating] || 2), 0) / logs.length
            : 0;

        // Top topics
        const topicCount: Record<string, number> = {};
        logs.forEach(l => {
            if (l.topic) topicCount[l.topic] = (topicCount[l.topic] || 0) + 1;
        });
        const topTopics = Object.entries(topicCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([topic, count]) => ({ topic, count }));

        // Lessons this month
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lessonsThisMonth = logs.filter(l => new Date(l.date) >= firstOfMonth).length;

        // Growth trend (compare last 5 lessons to previous 5)
        const recent5 = logs.slice(0, 5);
        const prev5 = logs.slice(5, 10);
        const recentAvg = recent5.length > 0
            ? recent5.reduce((sum, l) => sum + (ratingMap[l.rating] || 2), 0) / recent5.length
            : 0;
        const prevAvg = prev5.length > 0
            ? prev5.reduce((sum, l) => sum + (ratingMap[l.rating] || 2), 0) / prev5.length
            : recentAvg;
        const growthTrend = recentAvg > prevAvg + 0.3 ? 'up' : recentAvg < prevAvg - 0.3 ? 'down' : 'stable';

        // Collect struggles
        const struggles: string[] = [];
        logs.forEach(l => {
            if (l.struggles) struggles.push(...l.struggles);
        });

        return {
            student,
            totalLessons: logs.length,
            averageRating: avgRating,
            topTopics,
            lessonsThisMonth,
            growthTrend,
            struggles: [...new Set(struggles)].slice(0, 5),
        };
    });

    // Overall stats
    const totalLessons = lessonLogs.length;
    const totalHours = Math.round(lessonLogs.reduce((sum, l) => sum + (l.duration || 60), 0) / 60);
    const avgRatingOverall = lessonLogs.length > 0
        ? lessonLogs.reduce((sum, l) => sum + ({ good: 3, okay: 2, struggled: 1 }[l.rating] || 2), 0) / lessonLogs.length
        : 0;

    const getRatingColor = (rating: number) => {
        if (rating >= 2.5) return colors.status.success;
        if (rating >= 1.5) return colors.status.warning;
        return colors.status.error;
    };

    const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
        if (trend === 'up') return '📈';
        if (trend === 'down') return '📉';
        return '➡️';
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Overall Stats */}
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
                <Card style={styles.statCard}>
                    <FireIcon size={24} color={colors.accent.default} />
                    <Text style={styles.statValue}>{totalLessons}</Text>
                    <Text style={styles.statLabel}>Total Lessons</Text>
                </Card>
                <Card style={styles.statCard}>
                    <TargetIcon size={24} color={colors.accent.default} />
                    <Text style={styles.statValue}>{totalHours}h</Text>
                    <Text style={styles.statLabel}>Total Hours</Text>
                </Card>
                <Card style={styles.statCard}>
                    <TrendingUpIcon size={24} color={getRatingColor(avgRatingOverall)} />
                    <Text style={[styles.statValue, { color: getRatingColor(avgRatingOverall) }]}>
                        {avgRatingOverall.toFixed(1)}
                    </Text>
                    <Text style={styles.statLabel}>Avg Rating</Text>
                </Card>
            </View>

            {/* Per-Student Analytics */}
            <Text style={styles.sectionTitle}>Student Insights</Text>
            {studentAnalytics.map(analytics => (
                <Card key={analytics.student.id} style={styles.studentCard}>
                    <View style={styles.studentHeader}>
                        <View style={[styles.studentAvatar, { backgroundColor: analytics.student.color || colors.accent.default + '30' }]}>
                            <Text style={styles.studentInitial}>
                                {analytics.student.name.charAt(0)}
                            </Text>
                        </View>
                        <View style={styles.studentInfo}>
                            <Text style={styles.studentName}>{analytics.student.name}</Text>
                            <Text style={styles.studentSubject}>{analytics.student.subject || 'No subject'}</Text>
                        </View>
                        <Text style={styles.trendEmoji}>{getTrendIcon(analytics.growthTrend)}</Text>
                    </View>

                    <View style={styles.analyticsRow}>
                        <View style={styles.analyticsItem}>
                            <Text style={styles.analyticsValue}>{analytics.totalLessons}</Text>
                            <Text style={styles.analyticsLabel}>Lessons</Text>
                        </View>
                        <View style={styles.analyticsItem}>
                            <Text style={[styles.analyticsValue, { color: getRatingColor(analytics.averageRating) }]}>
                                {analytics.averageRating.toFixed(1)}
                            </Text>
                            <Text style={styles.analyticsLabel}>Rating</Text>
                        </View>
                        <View style={styles.analyticsItem}>
                            <Text style={styles.analyticsValue}>{analytics.lessonsThisMonth}</Text>
                            <Text style={styles.analyticsLabel}>This Month</Text>
                        </View>
                    </View>

                    {analytics.topTopics.length > 0 && (
                        <View style={styles.topicsRow}>
                            <LightbulbIcon size={14} color={colors.text.muted} />
                            <Text style={styles.topicsLabel}>Top topics:</Text>
                            {analytics.topTopics.map((t, i) => (
                                <Text key={i} style={styles.topicChip}>{t.topic}</Text>
                            ))}
                        </View>
                    )}

                    {analytics.struggles.length > 0 && (
                        <View style={styles.strugglesRow}>
                            <Text style={styles.strugglesLabel}>Areas to improve:</Text>
                            <Text style={styles.strugglesText}>{analytics.struggles.join(', ')}</Text>
                        </View>
                    )}
                </Card>
            ))}

            {studentAnalytics.length === 0 && (
                <Card style={styles.emptyCard}>
                    <Text style={styles.emptyText}>Add students and record lessons to see analytics</Text>
                </Card>
            )}

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.lg,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.md,
        marginTop: spacing.lg,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.lg,
        gap: spacing.xs,
    },
    statValue: {
        ...typography.h2,
        color: colors.text.primary,
    },
    statLabel: {
        ...typography.caption,
        color: colors.text.muted,
    },
    studentCard: {
        marginBottom: spacing.md,
        padding: spacing.lg,
    },
    studentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    studentAvatar: {
        width: 40,
        height: 40,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    studentInitial: {
        ...typography.body,
        fontWeight: '700',
        color: colors.accent.default,
    },
    studentInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    studentName: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text.primary,
    },
    studentSubject: {
        ...typography.small,
        color: colors.text.muted,
    },
    trendEmoji: {
        fontSize: 20,
    },
    analyticsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border.default,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.default,
    },
    analyticsItem: {
        alignItems: 'center',
    },
    analyticsValue: {
        ...typography.h3,
        color: colors.text.primary,
    },
    analyticsLabel: {
        ...typography.caption,
        color: colors.text.muted,
        marginTop: 2,
    },
    topicsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginTop: spacing.md,
    },
    topicsLabel: {
        ...typography.small,
        color: colors.text.muted,
        marginLeft: spacing.xs,
    },
    topicChip: {
        ...typography.small,
        color: colors.accent.default,
        backgroundColor: colors.accent.default + '20',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.sm,
    },
    strugglesRow: {
        marginTop: spacing.sm,
    },
    strugglesLabel: {
        ...typography.caption,
        color: colors.status.warning,
        marginBottom: 2,
    },
    strugglesText: {
        ...typography.small,
        color: colors.text.secondary,
    },
    emptyCard: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        ...typography.body,
        color: colors.text.muted,
        textAlign: 'center',
    },
});
