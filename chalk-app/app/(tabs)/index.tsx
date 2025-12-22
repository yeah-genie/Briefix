import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';

import Colors, { spacing, typography } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
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
  { id: '3', name: '박지훈', subject: '수학', grade: '중1', initial: 'J' },
];

const MOCK_OUTCOMES = [
  { id: '1', title: '이차방정식 풀이' },
  { id: '2', title: '인수분해' },
  { id: '3', title: '함수의 개념' },
];

type Level = 'high' | 'mid' | 'low' | null;

interface OutcomeCheck {
  outcomeId: string;
  level: Level;
}

export default function TodayScreen() {
  const colorScheme = useColorScheme() ?? 'dark'; // 기본 다크모드
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
        `궁금하신 점이 있으시면 편하게 말씀해 주세요. 감사합니다.`
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

  const selectedStudentData = MOCK_STUDENTS.find(s => s.id === selectedStudent);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header gradient glow */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.15)', 'transparent']}
          style={styles.glow}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>오늘의 수업</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {new Date().toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </Text>
        </View>

        {/* Step 1: Student Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            학생 선택
          </Text>

          {MOCK_STUDENTS.map(student => (
            <TouchableOpacity
              key={student.id}
              style={[
                styles.studentCard,
                {
                  backgroundColor: colors.backgroundTertiary,
                  borderColor: selectedStudent === student.id
                    ? colors.tint
                    : colors.border,
                  borderWidth: selectedStudent === student.id ? 1.5 : 1,
                },
              ]}
              onPress={() => setSelectedStudent(student.id)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={
                  selectedStudent === student.id
                    ? [colors.gradientStart, colors.gradientEnd]
                    : [colors.backgroundSecondary, colors.backgroundSecondary]
                }
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.avatarText}>{student.initial}</Text>
              </LinearGradient>

              <View style={styles.studentInfo}>
                <Text style={[styles.studentName, { color: colors.text }]}>
                  {student.name}
                </Text>
                <Text style={[styles.studentMeta, { color: colors.textMuted }]}>
                  {student.grade} · {student.subject}
                </Text>
              </View>

              <ChevronRightIcon size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Step 2: Outcome Checks */}
        {step >= 2 && selectedStudent && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
              학습 목표 달성도
            </Text>

            <View style={[styles.outcomeCard, { backgroundColor: colors.backgroundTertiary }]}>
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
                      <TouchableOpacity
                        style={[
                          styles.levelBtn,
                          check?.level === 'high' && styles.levelBtnActive,
                          check?.level === 'high' && { backgroundColor: 'rgba(52, 211, 153, 0.15)' }
                        ]}
                        onPress={() => handleLevelSelect(outcome.id, 'high')}
                      >
                        <LevelHighIcon
                          size={20}
                          color={check?.level === 'high' ? colors.levelHigh : colors.textMuted}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.levelBtn,
                          check?.level === 'mid' && styles.levelBtnActive,
                          check?.level === 'mid' && { backgroundColor: 'rgba(96, 165, 250, 0.15)' }
                        ]}
                        onPress={() => handleLevelSelect(outcome.id, 'mid')}
                      >
                        <LevelMidIcon
                          size={20}
                          color={check?.level === 'mid' ? colors.levelMid : colors.textMuted}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.levelBtn,
                          check?.level === 'low' && styles.levelBtnActive,
                          check?.level === 'low' && { backgroundColor: 'rgba(251, 191, 36, 0.15)' }
                        ]}
                        onPress={() => handleLevelSelect(outcome.id, 'low')}
                      >
                        <LevelLowIcon
                          size={20}
                          color={check?.level === 'low' ? colors.levelLow : colors.textMuted}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.nextButton, { borderColor: colors.border }]}
              onPress={() => setStep(3)}
            >
              <Text style={[styles.nextButtonText, { color: colors.text }]}>
                피드백 작성하기
              </Text>
              <ChevronRightIcon size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Feedback */}
        {step >= 3 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
              학부모 피드백
            </Text>

            <TextInput
              style={[
                styles.feedbackInput,
                {
                  backgroundColor: colors.backgroundTertiary,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="오늘 수업 내용을 간단히 적어주세요..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              value={feedback}
              onChangeText={setFeedback}
            />

            <TouchableOpacity
              style={[
                styles.polishButton,
                { backgroundColor: colors.backgroundTertiary, borderColor: colors.border },
              ]}
              onPress={handlePolishFeedback}
              disabled={isPolishing || !feedback.trim()}
            >
              {isPolishing ? (
                <ActivityIndicator color={colors.tint} size="small" />
              ) : (
                <>
                  <SparklesIcon size={18} color={colors.tint} />
                  <Text style={[styles.polishButtonText, { color: colors.text }]}>
                    AI로 다듬기
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {polishedFeedback && (
              <View
                style={[
                  styles.polishedCard,
                  { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.2)' }
                ]}
              >
                <View style={styles.polishedHeader}>
                  <CheckCircleIcon size={16} color={colors.tint} />
                  <Text style={[styles.polishedLabel, { color: colors.tint }]}>
                    AI 수정 완료
                  </Text>
                </View>
                <Text style={[styles.polishedText, { color: colors.textSecondary }]}>
                  {polishedFeedback}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
            >
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                style={styles.sendButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <SendIcon size={18} color="#fff" />
                <Text style={styles.sendButtonText}>카카오톡 전송</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
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
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  studentInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  studentName: {
    ...typography.body,
    fontWeight: '600',
  },
  studentMeta: {
    ...typography.caption,
    marginTop: 2,
  },
  outcomeCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  outcomeTitle: {
    ...typography.body,
    flex: 1,
  },
  levelButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  levelBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBtnActive: {
    transform: [{ scale: 1.1 }],
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  nextButtonText: {
    ...typography.body,
    fontWeight: '500',
  },
  feedbackInput: {
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  polishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  polishButtonText: {
    ...typography.body,
    fontWeight: '500',
  },
  polishedCard: {
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
    borderWidth: 1,
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
  sendButton: {
    marginTop: spacing.lg,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  sendButtonText: {
    color: '#fff',
    ...typography.body,
    fontWeight: '600',
  },
});
