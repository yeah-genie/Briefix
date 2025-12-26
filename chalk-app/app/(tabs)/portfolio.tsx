import React, { useEffect, useState } from 'react';
import {
<<<<<<< HEAD
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, typography, spacing, radius, components, gradients } from '@/constants/Colors';
import { ShareIcon, CheckCircleIcon, ZapIcon, BarChartIcon, SearchIcon } from '@/components/Icons';
import { useData } from '@/lib/DataContext';
=======
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import Colors, { spacing, typography, radius } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { GlowCard, GradientBorderCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Avatar } from '@/components/ui/Avatar';
import { Toast, useToast } from '@/components/ui/Toast';
import {
  ShareIcon,
  FireIcon,
  TargetIcon,
  CrownIcon,
  TrendingUpIcon,
  DiamondIcon,
  LockIcon,
  VerifiedBadge,
  CheckCircleIcon,
} from '@/components/Icons';
import { MOCK_BADGES, MOCK_STATS } from '@/data/mockData';
import { Badge } from '@/data/types';
>>>>>>> 86c950a4a6e75d8d9eca585c0e32854bc3cb3703

// Badge components with SVG icons
const QuickResponseBadge = () => (
    <View style={[styles.badgeIcon, { backgroundColor: colors.badge.yellow + '20' }]}>
        <ZapIcon size={18} color={colors.badge.yellow} />
    </View>
);

<<<<<<< HEAD
const ConsistentBadge = () => (
    <View style={[styles.badgeIcon, { backgroundColor: colors.badge.emerald + '20' }]}>
        <BarChartIcon size={18} color={colors.badge.emerald} />
    </View>
);

const DetailedBadge = () => (
    <View style={[styles.badgeIcon, { backgroundColor: colors.badge.blue + '20' }]}>
        <SearchIcon size={18} color={colors.badge.blue} />
    </View>
);

export default function PortfolioScreen() {
    const { students, lessonLogs, scheduledLessons } = useData();

    // Calculate stats
    const totalLessons = lessonLogs.length;
    const totalStudents = students.length;
    const goodLessons = lessonLogs.filter(l => l.rating === 'good').length;
    const retentionRate = totalLessons > 0 ? Math.round((goodLessons / totalLessons) * 100) : 0;

    // Recent activity (last 5 logs)
    const recentActivity = lessonLogs.slice(0, 5);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `📚 My Tutoring Portfolio\n\n✅ ${totalLessons}+ sessions completed\n👥 ${totalStudents} students\n🎯 ${retentionRate}% success rate\n\nPowered by Chalk`,
            });
        } catch (error) {
            console.log('Share error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Hero Banner with Gradient */}
                <LinearGradient
                    colors={gradients.hero as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroBanner}
                >
                    <View style={styles.heroOverlay} />
                </LinearGradient>

                {/* Profile Card - overlapping banner */}
                <View style={styles.profileSection}>
                    <View style={styles.profileCard}>
                        {/* Avatar with verified badge */}
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>Y</Text>
                            </View>
                            <View style={styles.verifiedBadge}>
                                <CheckCircleIcon size={16} color="#FFFFFF" />
                            </View>
                        </View>

                        <Text style={styles.profileName}>Your Name</Text>
                        <Text style={styles.profileTitle}>Private Tutor</Text>

                        {/* Subject tags */}
                        <View style={styles.subjectTags}>
                            <View style={styles.subjectTag}>
                                <Text style={styles.subjectTagText}>Math</Text>
                            </View>
                            <View style={styles.subjectTag}>
                                <Text style={styles.subjectTagText}>Science</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.primaryBtn}>
                                <Text style={styles.primaryBtnText}>Inquire for Lessons</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.secondaryRow}>
                            <TouchableOpacity style={styles.secondaryBtn}>
                                <Text style={styles.secondaryBtnText}>Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.secondaryBtn} onPress={handleShare}>
                                <ShareIcon size={14} color={colors.text.secondary} />
                                <Text style={styles.secondaryBtnText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Stats Bar */}
                    <View style={styles.statsBar}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>SESSIONS</Text>
                            <Text style={styles.statValue}>{totalLessons}+</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>RETENTION</Text>
                            <Text style={styles.statValue}>{retentionRate}%</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>STUDENTS</Text>
                            <Text style={styles.statValue}>{totalStudents}</Text>
                        </View>
                    </View>

                    {/* Verified Badges */}
                    <View style={styles.badgesCard}>
                        <Text style={styles.cardTitle}>Verified Reputation</Text>

                        <View style={styles.badgeRow}>
                            <QuickResponseBadge />
                            <View style={styles.badgeInfo}>
                                <Text style={styles.badgeTitle}>Quick Response</Text>
                                <Text style={styles.badgeDesc}>Replies in &lt; 15 mins</Text>
                            </View>
                        </View>

                        <View style={styles.badgeRow}>
                            <ConsistentBadge />
                            <View style={styles.badgeInfo}>
                                <Text style={styles.badgeTitle}>Consistent</Text>
                                <Text style={styles.badgeDesc}>{scheduledLessons.length}+ sessions/week</Text>
                            </View>
                        </View>

                        <View style={styles.badgeRow}>
                            <DetailedBadge />
                            <View style={styles.badgeInfo}>
                                <Text style={styles.badgeTitle}>Detailed</Text>
                                <Text style={styles.badgeDesc}>High report quality</Text>
                            </View>
                        </View>
                    </View>

                    {/* Session Activity Timeline */}
                    <View style={styles.activityCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Verified Session Activity</Text>
                            <Text style={styles.cardSubtitle}>REAL-TIME</Text>
                        </View>

                        <View style={styles.timeline}>
                            {recentActivity.length === 0 ? (
                                <Text style={styles.emptyText}>No sessions yet</Text>
                            ) : (
                                recentActivity.map((log, idx) => (
                                    <View key={log.id} style={styles.timelineItem}>
                                        <View style={styles.timelineDot}>
                                            <View style={styles.timelineDotInner} />
                                        </View>
                                        {idx < recentActivity.length - 1 && <View style={styles.timelineLine} />}
                                        <View style={styles.timelineContent}>
                                            <View style={styles.timelineHeader}>
                                                <Text style={styles.timelineStudent}>
                                                    {log.studentName.split(' ')[0][0]}.
                                                    {log.studentName.split(' ')[1]?.[0] || ''}.
                                                </Text>
                                                <Text style={styles.timelineTime}>{log.date}</Text>
                                            </View>
                                            <Text style={styles.timelineTopic}>{log.topic}</Text>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>

                        <Text style={styles.privacyNote}>
                            Privacy: Student identities are anonymized. Data verified via session logs.
                        </Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg.base },
    content: { paddingBottom: 100 },

    // Hero Banner
    heroBanner: {
        height: 160,
        position: 'relative',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },

    // Profile Section
    profileSection: {
        marginTop: -80,
        paddingHorizontal: spacing.lg,
    },

    // Profile Card
    profileCard: {
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.xl,
        padding: spacing['2xl'],
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: radius.lg,
        backgroundColor: colors.accent.default,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: colors.bg.secondary,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: colors.accent.default,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.bg.secondary,
    },
    profileName: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    profileTitle: {
        ...typography.body,
        color: colors.accent.default,
        fontWeight: '600',
        marginBottom: spacing.md,
    },
    subjectTags: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    subjectTag: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        backgroundColor: colors.bg.tertiary,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    subjectTagText: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    actionRow: {
        width: '100%',
        marginBottom: spacing.sm,
    },
    primaryBtn: {
        height: components.button.lg,
        backgroundColor: colors.accent.default,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        ...typography.body,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    secondaryRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        width: '100%',
    },
    secondaryBtn: {
        flex: 1,
        height: components.button.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        backgroundColor: colors.bg.tertiary,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    secondaryBtnText: {
        ...typography.small,
        color: colors.text.secondary,
    },

    // Stats Bar
    statsBar: {
        flexDirection: 'row',
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.xl,
        padding: spacing.xl,
        marginTop: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        ...typography.caption,
        color: colors.text.muted,
        marginBottom: spacing.xs,
    },
    statValue: {
        ...typography.stat,
        color: colors.text.primary,
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.border.default,
        marginHorizontal: spacing.md,
    },

    // Badges Card
    badgesCard: {
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.xl,
        padding: spacing.xl,
        marginTop: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    cardTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.lg,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.bg.tertiary,
        borderRadius: radius.lg,
        marginBottom: spacing.sm,
    },
    badgeIcon: {
        width: 40,
        height: 40,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeInfo: {
        marginLeft: spacing.md,
    },
    badgeTitle: {
        ...typography.small,
        color: colors.text.primary,
        fontWeight: '600',
    },
    badgeDesc: {
        ...typography.caption,
        color: colors.text.muted,
    },

    // Activity Card
    activityCard: {
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.xl,
        padding: spacing.xl,
        marginTop: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    cardSubtitle: {
        ...typography.caption,
        color: colors.text.muted,
    },
    timeline: {
        position: 'relative',
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
        position: 'relative',
    },
    timelineDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.bg.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    timelineDotInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.accent.default,
    },
    timelineLine: {
        position: 'absolute',
        left: 15,
        top: 32,
        bottom: -spacing.lg,
        width: 2,
        backgroundColor: colors.border.default,
    },
    timelineContent: {
        flex: 1,
        backgroundColor: colors.bg.tertiary,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    timelineStudent: {
        ...typography.small,
        color: colors.text.primary,
        fontWeight: '600',
    },
    timelineTime: {
        ...typography.caption,
        color: colors.accent.default,
    },
    timelineTopic: {
        ...typography.caption,
        color: colors.text.muted,
        fontStyle: 'italic',
    },
    emptyText: {
        ...typography.body,
        color: colors.text.muted,
        textAlign: 'center',
        paddingVertical: spacing.xl,
    },
    privacyNote: {
        ...typography.caption,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: spacing.lg,
    },
=======
// 이번 주 수업 데이터 (월~일)
const WEEKLY_DATA = [
  { day: '월', count: 3, date: 23 },
  { day: '화', count: 2, date: 24 },
  { day: '수', count: 0, date: 25 },
  { day: '목', count: 4, date: 26 },
  { day: '금', count: 2, date: 27 },
  { day: '토', count: 1, date: 28 },
  { day: '일', count: 0, date: 29 },
];

// 월별 수업 요약
const MONTHLY_SUMMARY = {
  thisMonth: { lessons: 18, students: 5, hours: 27 },
  lastMonth: { lessons: 15, students: 4, hours: 22.5 },
  growth: 20, // 퍼센트
};

// 배지 아이콘 맵핑
const BADGE_ICONS: Record<Badge['icon'], React.FC<{ size: number; color: string }>> = {
  fire: FireIcon,
  target: TargetIcon,
  crown: CrownIcon,
  trending: TrendingUpIcon,
  diamond: DiamondIcon,
  star: FireIcon,
  award: CrownIcon,
};

export default function PortfolioScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const maxCount = Math.max(...WEEKLY_DATA.map(d => d.count), 1);
  const todayIndex = 1; // 화요일 (0-indexed)

  const handleShare = async () => {
    const message = `📊 과외 포트폴리오\n\n이번 달 ${MONTHLY_SUMMARY.thisMonth.lessons}회 수업 완료\n${MOCK_STATS.totalStudents}명 학생 관리\n${MOCK_STATS.streak}일 연속 기록 중\n\n#Chalk 인증 데이터`;
    const url = `kakaotalk://send?text=${encodeURIComponent(message)}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        toast.success('공유 완료', '카카오톡으로 이동했어요');
      } else {
        toast.info('복사 완료', '메시지가 클립보드에 복사되었어요');
      }
    } catch (error) {
      toast.error('오류 발생', '다시 시도해주세요');
    }
  };

  const tabBarHeight = 64 + Math.max(insets.bottom, 16) + 20;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Toast */}
      <Toast
        visible={toast.toast.visible}
        type={toast.toast.type}
        title={toast.toast.title}
        message={toast.toast.message}
        onDismiss={toast.hideToast}
      />

      {/* Background */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={[
            colorScheme === 'dark' ? 'rgba(0, 212, 170, 0.08)' : 'rgba(0, 212, 170, 0.05)',
            'transparent',
          ]}
          style={styles.glowTop}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: tabBarHeight },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.profileSection}
        >
          <View style={styles.profileCard}>
            <Avatar name="예진" size="xl" variant="gradient" color="mint" />
            
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  나의 포트폴리오
                </Text>
                <VerifiedBadge size={20} color={colors.tint} />
              </View>
              <Text style={[styles.profileBio, { color: colors.textMuted }]}>
                수학 전문 과외 · {MOCK_STATS.streak}일 연속 기록 중
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* 연속 기록 스트릭 카드 */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <GradientBorderCard style={styles.streakCard}>
            <View style={styles.streakContent}>
              <View style={styles.streakIconWrap}>
                <FireIcon size={32} color={colors.tint} />
              </View>
              <View style={styles.streakInfo}>
                <Text style={[styles.streakNumber, { color: colors.tint }]}>
                  {MOCK_STATS.streak}일
                </Text>
                <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
                  연속 수업 기록
                </Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={[styles.streakBadgeText, { color: colors.tint }]}>
                  최고 기록!
                </Text>
              </View>
            </View>
          </GradientBorderCard>
        </Animated.View>

        {/* 이번 주 수업 활동 - 막대 그래프 */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
              이번 주 수업
            </Text>
            <Text style={[styles.sectionValue, { color: colors.tint }]}>
              {WEEKLY_DATA.reduce((sum, d) => sum + d.count, 0)}회
            </Text>
          </View>

          <GlowCard variant="glass">
            <View style={styles.weeklyChart}>
              {WEEKLY_DATA.map((item, idx) => {
                const barHeight = item.count > 0 
                  ? Math.max((item.count / maxCount) * 80, 8) 
                  : 4;
                const isToday = idx === todayIndex;
                
                return (
                  <View key={item.day} style={styles.chartColumn}>
                    {/* 수업 횟수 */}
                    {item.count > 0 && (
                      <Text style={[styles.chartCount, { color: colors.tint }]}>
                        {item.count}
                      </Text>
                    )}
                    
                    {/* 막대 */}
                    <View style={styles.barContainer}>
                      <Animated.View
                        entering={FadeInUp.delay(250 + idx * 50).springify()}
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            backgroundColor: item.count > 0 
                              ? isToday ? colors.tint : colors.tint + '80'
                              : colors.backgroundTertiary,
                            borderRadius: radius.sm,
                          },
                        ]}
                      />
                    </View>
                    
                    {/* 요일 */}
                    <Text style={[
                      styles.chartDay,
                      { 
                        color: isToday ? colors.tint : colors.textMuted,
                        fontWeight: isToday ? '700' : '500',
                      }
                    ]}>
                      {item.day}
                    </Text>
                    
                    {/* 오늘 표시 */}
                    {isToday && (
                      <View style={[styles.todayDot, { backgroundColor: colors.tint }]} />
                    )}
                  </View>
                );
              })}
            </View>
          </GlowCard>
        </Animated.View>

        {/* 월별 수업 요약 */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
              12월 수업 현황
            </Text>
            <View style={[styles.growthBadge, { backgroundColor: colors.brandMuted }]}>
              <TrendingUpIcon size={14} color={colors.tint} />
              <Text style={[styles.growthText, { color: colors.tint }]}>
                +{MONTHLY_SUMMARY.growth}%
              </Text>
            </View>
          </View>

          <View style={styles.monthlyGrid}>
            <GlowCard variant="glass" style={styles.monthlyCard}>
              <Text style={[styles.monthlyValue, { color: colors.tint }]}>
                {MONTHLY_SUMMARY.thisMonth.lessons}
              </Text>
              <Text style={[styles.monthlyLabel, { color: colors.textMuted }]}>
                수업 횟수
              </Text>
              <Text style={[styles.monthlyCompare, { color: colors.textMuted }]}>
                지난달 {MONTHLY_SUMMARY.lastMonth.lessons}회
              </Text>
            </GlowCard>

            <GlowCard variant="glass" style={styles.monthlyCard}>
              <Text style={[styles.monthlyValue, { color: colors.tint }]}>
                {MONTHLY_SUMMARY.thisMonth.students}
              </Text>
              <Text style={[styles.monthlyLabel, { color: colors.textMuted }]}>
                담당 학생
              </Text>
              <Text style={[styles.monthlyCompare, { color: colors.textMuted }]}>
                지난달 {MONTHLY_SUMMARY.lastMonth.students}명
              </Text>
            </GlowCard>

            <GlowCard variant="glass" style={styles.monthlyCard}>
              <Text style={[styles.monthlyValue, { color: colors.tint }]}>
                {MONTHLY_SUMMARY.thisMonth.hours}
              </Text>
              <Text style={[styles.monthlyLabel, { color: colors.textMuted }]}>
                총 시간
              </Text>
              <Text style={[styles.monthlyCompare, { color: colors.textMuted }]}>
                지난달 {MONTHLY_SUMMARY.lastMonth.hours}시간
              </Text>
            </GlowCard>
          </View>
        </Animated.View>

        {/* 누적 통계 */}
        <Animated.View 
          entering={FadeInDown.delay(350).springify()}
          style={styles.section}
        >
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            누적 통계
          </Text>
          
          <GlowCard variant="neon" glowColor="mint">
            <View style={styles.totalStats}>
              <View style={styles.totalStatItem}>
                <Text style={[styles.totalStatValue, { color: colors.tint }]}>
                  {MOCK_STATS.totalLessons}
                </Text>
                <Text style={[styles.totalStatLabel, { color: colors.textMuted }]}>
                  총 수업
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.totalStatItem}>
                <Text style={[styles.totalStatValue, { color: colors.tint }]}>
                  {MOCK_STATS.totalStudents}
                </Text>
                <Text style={[styles.totalStatLabel, { color: colors.textMuted }]}>
                  총 학생
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.totalStatItem}>
                <Text style={[styles.totalStatValue, { color: colors.tint }]}>
                  {MOCK_STATS.avgLevel}%
                </Text>
                <Text style={[styles.totalStatLabel, { color: colors.textMuted }]}>
                  평균 달성
                </Text>
              </View>
            </View>
          </GlowCard>
        </Animated.View>

        {/* 획득 배지 */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.section}
        >
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            획득 배지
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.badgesRow}>
              {MOCK_BADGES.map((badge, idx) => {
                const IconComponent = BADGE_ICONS[badge.icon];
                
                return (
                  <Animated.View
                    key={badge.id}
                    entering={FadeInDown.delay(450 + idx * 50).springify()}
                  >
                    <View
                      style={[
                        styles.badge,
                        { 
                          backgroundColor: badge.earned 
                            ? colors.brandMuted
                            : colors.backgroundTertiary,
                          borderColor: badge.earned 
                            ? colors.tint
                            : colors.border,
                        },
                      ]}
                      accessibilityLabel={`${badge.label} 배지${badge.earned ? ', 획득함' : ', 미획득'}`}
                    >
                      <View style={[
                        styles.badgeIconContainer,
                        { opacity: badge.earned ? 1 : 0.4 }
                      ]}>
                        <IconComponent 
                          size={28} 
                          color={badge.earned ? colors.tint : colors.textMuted} 
                        />
                      </View>
                      <Text style={[
                        styles.badgeLabel, 
                        { color: badge.earned ? colors.text : colors.textMuted }
                      ]}>
                        {badge.label}
                      </Text>
                      
                      {!badge.earned && (
                        <View style={[styles.lockedOverlay, { backgroundColor: colors.background + 'DD' }]}>
                          <LockIcon size={20} color={colors.textMuted} />
                        </View>
                      )}
                    </View>
                  </Animated.View>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>

        {/* 공유 버튼 */}
        <Animated.View 
          entering={FadeInUp.delay(500).springify()}
          style={styles.section}
        >
          <NeonButton
            title="포트폴리오 공유하기"
            variant="gradient"
            glowColor="mint"
            icon={<ShareIcon size={18} color="#fff" />}
            onPress={handleShare}
            fullWidth
          />
        </Animated.View>

        {/* 인증 카드 */}
        <Animated.View entering={FadeInUp.delay(550).springify()}>
          <View style={[styles.verifiedCard, { backgroundColor: colors.brandMuted, borderColor: colors.tint + '30' }]}>
            <View style={styles.verifiedRow}>
              <CheckCircleIcon size={18} color={colors.tint} />
              <Text style={[styles.verifiedText, { color: colors.text }]}>
                Chalk 인증 데이터
              </Text>
            </View>
            <Text style={[styles.verifiedSubtext, { color: colors.textMuted }]}>
              {MOCK_STATS.totalLessons}회의 수업 기록이 검증되었습니다
            </Text>
          </View>
        </Animated.View>
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
    height: 400,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -150,
    left: -100,
    right: -100,
    height: 400,
    borderRadius: 200,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  profileSection: {
    marginBottom: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.lg,
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
    ...typography.body,
    marginTop: spacing.xs,
  },
  streakCard: {
    marginBottom: spacing.xl,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  streakLabel: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  streakBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  streakBadgeText: {
    ...typography.caption,
    fontWeight: '700',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  sectionValue: {
    ...typography.bodyMedium,
    fontWeight: '700',
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: spacing.md,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartCount: {
    ...typography.caption,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: 24,
  },
  bar: {
    width: '100%',
  },
  chartDay: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: spacing.xs,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  growthText: {
    ...typography.caption,
    fontWeight: '700',
  },
  monthlyGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  monthlyCard: {
    flex: 1,
  },
  monthlyValue: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  monthlyLabel: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  monthlyCompare: {
    ...typography.caption,
    fontSize: 10,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  totalStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  totalStatValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  totalStatLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  badge: {
    width: 90,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
  },
  badgeIconContainer: {
    marginBottom: spacing.sm,
  },
  badgeLabel: {
    ...typography.caption,
    textAlign: 'center',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  verifiedText: {
    ...typography.bodyMedium,
  },
  verifiedSubtext: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
    marginLeft: 26,
  },
>>>>>>> 86c950a4a6e75d8d9eca585c0e32854bc3cb3703
});
