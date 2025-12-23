import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import Animated, {
  FadeInDown,
  FadeInUp,
  Easing,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import Colors, { spacing, typography, radius } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { GlowCard, GradientBorderCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Avatar } from '@/components/ui/Avatar';
import {
  ShareIcon,
  FireIcon,
  VerifiedBadge,
  CheckCircleIcon,
} from '@/components/Icons';

const { width } = Dimensions.get('window');

// 캘린더 데이터 생성 (12주)
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

const BADGES = [
  { icon: '🔥', label: '10일 연속', color: 'orange', earned: true },
  { icon: '🎯', label: '첫 수업', color: 'mint', earned: true },
  { icon: '👑', label: '성실왕', color: 'purple', earned: true },
  { icon: '📈', label: '목표 달성', color: 'orange', earned: false },
  { icon: '💎', label: '프리미엄', color: 'mint', earned: false },
];

export default function PortfolioScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const handleShare = async () => {
    const message = `📊 과외 포트폴리오\n\n${STATS.totalLessons}회 수업 완료\n${STATS.totalStudents}명 학생 관리\n평균 달성율 ${STATS.avgLevel}%\n\n#Chalk 인증 데이터`;
    const url = `kakaotalk://send?text=${encodeURIComponent(message)}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  const getCalendarColor = (level: number) => {
    if (level === 0) return colors.backgroundTertiary;
    if (level === 1) return colors.tint + '30';
    if (level === 2) return colors.tint + '60';
    return colors.tint;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background gradient */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={[
            colorScheme === 'dark' ? 'rgba(168, 85, 247, 0.06)' : 'rgba(168, 85, 247, 0.03)',
            'transparent',
          ]}
          style={styles.glowTop}
        />
        <LinearGradient
          colors={[
            'transparent',
            colorScheme === 'dark' ? 'rgba(255, 107, 53, 0.04)' : 'rgba(255, 107, 53, 0.02)',
          ]}
          style={styles.glowBottom}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.profileSection}
        >
          <View style={styles.profileCard}>
            <Avatar name="예진" size="xl" variant="gradient" color="purple" />
            
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  나의 포트폴리오
                </Text>
                <VerifiedBadge size={20} />
              </View>
              <Text style={[styles.profileBio, { color: colors.textMuted }]}>
                수학 전문 과외 · {STATS.streak}일 연속 기록 중
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.statsSection}
        >
          <View style={styles.statsGrid}>
            <StatCard
              value={STATS.totalLessons}
              label="총 수업"
              color={colors.tint}
              colors={colors}
              delay={300}
            />
            <StatCard
              value={STATS.totalStudents}
              label="학생 수"
              color={colors.tintSecondary}
              colors={colors}
              delay={400}
            />
            <StatCard
              value={STATS.avgLevel}
              label="평균 달성"
              suffix="%"
              color={colors.tintAccent}
              colors={colors}
              delay={500}
            />
            <StatCard
              value={STATS.streak}
              label="연속 기록"
              icon={<FireIcon size={18} color="#FF6B35" />}
              color="#FF6B35"
              colors={colors}
              delay={600}
            />
          </View>
        </Animated.View>

        {/* Activity Calendar */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={styles.section}
        >
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            활동 기록
          </Text>

          <GlowCard variant="glass">
            <View style={styles.calendarGrid}>
              {CALENDAR_DATA.map((level, idx) => (
                <Animated.View
                  key={idx}
                  entering={FadeInDown.delay(400 + idx * 3).springify()}
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
          </GlowCard>
        </Animated.View>

        {/* Badges */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.section}
        >
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            획득 배지
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.badgesRow}>
              {BADGES.map((badge, idx) => (
                <Animated.View
                  key={idx}
                  entering={FadeInDown.delay(450 + idx * 50).springify()}
                >
                  <View
                    style={[
                      styles.badge,
                      { 
                        backgroundColor: badge.earned 
                          ? getBadgeColor(badge.color, colors) + '20'
                          : colors.backgroundTertiary,
                        borderColor: badge.earned 
                          ? getBadgeColor(badge.color, colors)
                          : colors.border,
                        opacity: badge.earned ? 1 : 0.5,
                      },
                    ]}
                  >
                    <Text style={[styles.badgeIcon, { opacity: badge.earned ? 1 : 0.3 }]}>
                      {badge.icon}
                    </Text>
                    <Text style={[
                      styles.badgeLabel, 
                      { color: badge.earned ? colors.text : colors.textMuted }
                    ]}>
                      {badge.label}
                    </Text>
                    {!badge.earned && (
                      <View style={[styles.lockedOverlay, { backgroundColor: colors.background + 'CC' }]}>
                        <Text style={styles.lockedIcon}>🔒</Text>
                      </View>
                    )}
                  </View>
                </Animated.View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Share Button */}
        <Animated.View 
          entering={FadeInUp.delay(500).springify()}
          style={styles.section}
        >
          <NeonButton
            title="포트폴리오 공유하기"
            variant="gradient"
            glowColor="orange"
            icon={<ShareIcon size={18} color="#fff" />}
            onPress={handleShare}
            fullWidth
          />
        </Animated.View>

        {/* Verified Card */}
        <Animated.View entering={FadeInUp.delay(600).springify()}>
          <GradientBorderCard style={styles.verifiedCard}>
            <View style={styles.verifiedRow}>
              <CheckCircleIcon size={20} color={colors.tintSecondary} />
              <Text style={[styles.verifiedText, { color: colors.text }]}>
                Chalk 인증 데이터
              </Text>
            </View>
            <Text style={[styles.verifiedSubtext, { color: colors.textMuted }]}>
              {STATS.totalLessons}회의 수업 기록이 검증되었습니다
            </Text>
          </GradientBorderCard>
        </Animated.View>

        {/* Bottom padding */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

// Stat Card Component
function StatCard({
  value,
  label,
  suffix = '',
  icon,
  color,
  colors,
  delay,
}: {
  value: number;
  label: string;
  suffix?: string;
  icon?: React.ReactNode;
  color: string;
  colors: any;
  delay: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 1200;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * value);
        
        setDisplayValue(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <GlowCard 
      variant="glass" 
      style={styles.statCard}
      contentStyle={styles.statCardContent}
    >
      <View style={styles.statValueRow}>
        {icon}
        <Text style={[styles.statValue, { color }]}>
          {displayValue}{suffix}
        </Text>
      </View>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>
        {label}
      </Text>
    </GlowCard>
  );
}

function getBadgeColor(color: string, colors: any) {
  switch (color) {
    case 'orange': return colors.tint;
    case 'mint': return colors.tintSecondary;
    case 'purple': return colors.tintAccent;
    default: return colors.tint;
  }
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
    bottom: 0,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    height: 400,
    borderRadius: 200,
  },
  glowBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 60,
  },
  profileSection: {
    marginBottom: spacing.xl,
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
  statsSection: {
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: (width - spacing.lg * 2 - spacing.md) / 2 - spacing.md / 2,
  },
  statCardContent: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  statLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: spacing.md,
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
  badgeIcon: {
    fontSize: 28,
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
  lockedIcon: {
    fontSize: 20,
  },
  verifiedCard: {
    marginTop: spacing.sm,
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
    marginLeft: 28,
  },
});
