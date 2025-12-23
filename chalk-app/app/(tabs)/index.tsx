import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

import Colors, { spacing, typography, radius } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Avatar } from '@/components/ui/Avatar';
import {
  LevelHighIcon,
  LevelMidIcon,
  LevelLowIcon,
  SparklesIcon,
  SendIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from '@/components/Icons';

// Mock data
const MOCK_STUDENTS = [
  { id: '1', name: '김민수', subject: '수학', grade: '중2', initial: 'M' },
  { id: '2', name: '이서연', subject: '영어', grade: '고1', initial: 'S' },
  { id: '3', name: '박준호', subject: '수학', grade: '중1', initial: 'J' },
];

const MOCK_OUTCOMES = [
  { id: '1', title: '일차방정식 풀이' },
  { id: '2', title: '인수분해' },
  { id: '3', title: '함수의 개념' },
];

type Level = 'high' | 'mid' | 'low' | null;

interface OutcomeCheck {
  outcomeId: string;
  level: Level;
}

export default function TodayScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [outcomeChecks, setOutcomeChecks] = useState<OutcomeCheck[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedFeedback, setPolishedFeedback] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (selectedStudent) {
      setOutcomeChecks(MOCK_OUTCOMES.map(o => ({ outcomeId: o.id, level: null })));
      setStep(2);
    }
  }, [selectedStudent]);

  const handleLevelSelect = (outcomeId: string, level: Level) => {
    setOutcomeChecks(prev =>
      prev.map(check =>
        check.outcomeId === outcomeId ? { ...check, level } : check
      )
    );
  };

  const handlePolishFeedback = async () => {
    if (!feedback.trim()) return;
    setIsPolishing(true);

    setTimeout(() => {
      const student = MOCK_STUDENTS.find(s => s.id === selectedStudent);
      setPolishedFeedback(
        `안녕하세요, ${student?.name} 학부모님.\n\n` +
        `오늘 수업에서 ${feedback}\n\n` +
        `궁금하신 점이 있으시면 편하게 말씀해 주세요. 감사합니다!`
      );
      setIsPolishing(false);
    }, 1500);
  };

  const handleSend = async () => {
    const message = polishedFeedback || feedback;
    const url = `kakaotalk://send?text=${encodeURIComponent(message)}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);

    // Reset
    setSelectedStudent(null);
    setFeedback('');
    setPolishedFeedback('');
    setStep(1);
  };

  const allOutcomesChecked = outcomeChecks.every(c => c.level !== null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background gradient glow */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={[
            colorScheme === 'dark' ? 'rgba(255, 107, 53, 0.08)' : 'rgba(255, 107, 53, 0.05)',
            'transparent',
          ]}
          style={styles.glowTop}
        />
        <LinearGradient
          colors={[
            'transparent',
            colorScheme === 'dark' ? 'rgba(0, 245, 212, 0.05)' : 'rgba(0, 245, 212, 0.03)',
          ]}
          style={styles.glowBottom}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.header}
        >
          <Text style={[styles.greeting, { color: colors.textMuted }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>오늘의 수업</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {new Date().toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </Text>
        </Animated.View>

        {/* Step 1: Student Selection */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.section}
        >
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            학생 선택
          </Text>

          <View style={styles.studentGrid}>
            {MOCK_STUDENTS.map((student, idx) => (
              <Animated.View
                key={student.id}
                entering={FadeInDown.delay(250 + idx * 50).springify()}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.studentCard,
                    {
                      backgroundColor: selectedStudent === student.id
                        ? colors.tint + '15'
                        : colors.backgroundTertiary,
                      borderColor: selectedStudent === student.id
                        ? colors.tint
                        : colors.border,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                  onPress={() => setSelectedStudent(student.id)}
                >
                  <Avatar 
                    name={student.name} 
                    size="md"
                    variant={selectedStudent === student.id ? 'gradient' : 'ring'}
                    color="orange"
                  />
                  <Text 
                    style={[
                      styles.studentName, 
                      { color: colors.text },
                      selectedStudent === student.id && { color: colors.tint }
                    ]}
                    numberOfLines={1}
                  >
                    {student.name}
                  </Text>
                  <Text style={[styles.studentMeta, { color: colors.textMuted }]}>
                    {student.grade} · {student.subject}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Step 2: Outcome Checks */}
        {step >= 2 && selectedStudent && (
          <Animated.View 
            entering={FadeInDown.springify()}
            style={styles.section}
          >
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
              학습 목표 달성도
            </Text>

            <GlowCard variant="glass" style={styles.outcomeCard}>
              {MOCK_OUTCOMES.map((outcome, idx) => {
                const check = outcomeChecks.find(c => c.outcomeId === outcome.id);
                return (
                  <View
                    key={outcome.id}
                    style={[
                      styles.outcomeRow,
                      idx < MOCK_OUTCOMES.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border
                      }
                    ]}
                  >
                    <Text style={[styles.outcomeTitle, { color: colors.text }]}>
                      {outcome.title}
                    </Text>
                    <View style={styles.levelButtons}>
                      <LevelButton
                        level="high"
                        selected={check?.level === 'high'}
                        onPress={() => handleLevelSelect(outcome.id, 'high')}
                        colors={colors}
                      />
                      <LevelButton
                        level="mid"
                        selected={check?.level === 'mid'}
                        onPress={() => handleLevelSelect(outcome.id, 'mid')}
                        colors={colors}
                      />
                      <LevelButton
                        level="low"
                        selected={check?.level === 'low'}
                        onPress={() => handleLevelSelect(outcome.id, 'low')}
                        colors={colors}
                      />
                    </View>
                  </View>
                );
              })}
            </GlowCard>

            {allOutcomesChecked && (
              <Animated.View entering={FadeInUp.springify()}>
                <NeonButton
                  title="피드백 작성하기"
                  variant="outline"
                  glowColor="mint"
                  onPress={() => setStep(3)}
                  icon={<ChevronRightIcon size={18} color={colors.tintSecondary} />}
                  iconPosition="right"
                  fullWidth
                  style={{ marginTop: spacing.md }}
                />
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* Step 3: Feedback */}
        {step >= 3 && (
          <Animated.View 
            entering={FadeInDown.springify()}
            style={styles.section}
          >
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
              학부모 피드백
            </Text>

            <TextInput
              style={[
                styles.feedbackInput,
                {
                  backgroundColor: colors.backgroundTertiary,
                  color: colors.text,
                  borderColor: feedback ? colors.tint : colors.border,
                },
              ]}
              placeholder="오늘 수업 내용을 간단히 적어주세요..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              value={feedback}
              onChangeText={setFeedback}
            />

            <NeonButton
              title="AI로 다듬기"
              variant="secondary"
              glowColor="purple"
              icon={<SparklesIcon size={18} color={colors.tintAccent} />}
              onPress={handlePolishFeedback}
              loading={isPolishing}
              disabled={!feedback.trim()}
              fullWidth
              style={{ marginTop: spacing.md }}
              textStyle={{ color: colors.tintAccent }}
            />

            {polishedFeedback && (
              <Animated.View entering={FadeInUp.springify()}>
                <GlowCard 
                  variant="neon" 
                  glowColor="mint"
                  style={styles.polishedCard}
                >
                  <View style={styles.polishedHeader}>
                    <CheckCircleIcon size={16} color={colors.tintSecondary} />
                    <Text style={[styles.polishedLabel, { color: colors.tintSecondary }]}>
                      AI 수정 완료
                    </Text>
                  </View>
                  <Text style={[styles.polishedText, { color: colors.textSecondary }]}>
                    {polishedFeedback}
                  </Text>
                </GlowCard>
              </Animated.View>
            )}

            <NeonButton
              title="카카오톡 전송"
              variant="gradient"
              glowColor="orange"
              icon={<SendIcon size={18} color="#fff" />}
              onPress={handleSend}
              disabled={!feedback.trim() && !polishedFeedback}
              fullWidth
              style={{ marginTop: spacing.lg }}
            />
          </Animated.View>
        )}

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Level selection button component
function LevelButton({
  level,
  selected,
  onPress,
  colors,
}: {
  level: 'high' | 'mid' | 'low';
  selected: boolean;
  onPress: () => void;
  colors: any;
}) {
  const getLevelColor = () => {
    switch (level) {
      case 'high': return colors.levelHigh;
      case 'mid': return colors.levelMid;
      case 'low': return colors.levelLow;
    }
  };

  const getLevelBgColor = () => {
    if (!selected) return 'transparent';
    switch (level) {
      case 'high': return colors.levelHigh + '20';
      case 'mid': return colors.levelMid + '20';
      case 'low': return colors.levelLow + '20';
    }
  };

  const Icon = level === 'high' ? LevelHighIcon : level === 'mid' ? LevelMidIcon : LevelLowIcon;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.levelBtn,
        {
          backgroundColor: getLevelBgColor(),
          borderColor: selected ? getLevelColor() : 'transparent',
          borderWidth: selected ? 1.5 : 0,
          transform: [{ scale: pressed ? 0.9 : selected ? 1.05 : 1 }],
        },
      ]}
      onPress={onPress}
    >
      <Icon
        size={20}
        color={selected ? getLevelColor() : colors.textMuted}
      />
    </Pressable>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '좋은 오후에요';
  return '좋은 저녁이에요';
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 60,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  greeting: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.body,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  studentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  studentCard: {
    width: 100,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  studentName: {
    ...typography.bodyMedium,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  studentMeta: {
    ...typography.caption,
    marginTop: 2,
  },
  outcomeCard: {
    padding: 0,
  },
  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  outcomeTitle: {
    ...typography.body,
    flex: 1,
    marginRight: spacing.md,
  },
  levelButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  levelBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackInput: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    lineHeight: 22,
  },
  polishedCard: {
    marginTop: spacing.md,
  },
  polishedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  polishedLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  polishedText: {
    ...typography.bodySmall,
    lineHeight: 20,
  },
});
