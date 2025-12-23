import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

import Colors, { spacing, typography, radius, shadows } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Avatar } from '@/components/ui/Avatar';
import {
  PlusIcon,
  ChevronRightIcon,
  XIcon,
  CheckCircleIcon,
  SparklesIcon,
  AlertCircleIcon,
} from '@/components/Icons';
import {
  MATH_TOPICS,
  getTopicsByGrade,
  diagnoseGaps,
  getStrugglesForTopic,
} from '@/services/curriculum/data';
import { GRADE_NAMES, GradeLevel, Topic } from '@/services/curriculum/types';

// Student type
interface Student {
  id: string;
  name: string;
  subject: string;
  grade: GradeLevel;
  currentTopic?: string;
  lessonsCount: number;
  initial: string;
  diagnosis?: {
    gaps: { topic: Topic; severity: 'CRITICAL' | 'MODERATE' | 'MINOR' }[];
    estimatedWeeks: number;
  };
}

const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: '김민수',
    subject: '수학',
    grade: 'MIDDLE_2',
    currentTopic: 'LINEAR-FUNC',
    lessonsCount: 12,
    initial: 'M',
    diagnosis: {
      gaps: [
        { topic: MATH_TOPICS.find(t => t.code === 'COORDINATES')!, severity: 'CRITICAL' },
        { topic: MATH_TOPICS.find(t => t.code === 'LINEAR-EQ-1')!, severity: 'MODERATE' },
      ],
      estimatedWeeks: 6,
    },
  },
  {
    id: '2',
    name: '이서연',
    subject: '영어',
    grade: 'HIGH_1',
    lessonsCount: 8,
    initial: 'S',
  },
  {
    id: '3',
    name: '박준호',
    subject: '수학',
    grade: 'MIDDLE_1',
    currentTopic: 'LINEAR-EQ-1',
    lessonsCount: 5,
    initial: 'J',
  },
];

const GRADE_OPTIONS: GradeLevel[] = [
  'ELEMENTARY_5', 'ELEMENTARY_6',
  'MIDDLE_1', 'MIDDLE_2', 'MIDDLE_3',
  'HIGH_1', 'HIGH_2', 'HIGH_3',
];

export default function StudentsScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // New student form
  const [step, setStep] = useState(1);
  const [newStudent, setNewStudent] = useState({
    name: '',
    subject: '수학',
    grade: 'MIDDLE_1' as GradeLevel,
    phone: '',
    targetTopic: '',
  });

  // Diagnosis state
  const [diagnosisResult, setDiagnosisResult] = useState<{
    gaps: { topic: Topic; severity: 'CRITICAL' | 'MODERATE' | 'MINOR' }[];
    struggles: string[];
    estimatedWeeks: number;
  } | null>(null);

  const handleStartDiagnosis = () => {
    if (!newStudent.targetTopic) return;

    const gaps = diagnoseGaps(newStudent.targetTopic, []);
    const targetTopic = MATH_TOPICS.find(t => t.code === newStudent.targetTopic);
    const struggles = getStrugglesForTopic(newStudent.targetTopic);

    const totalHours = gaps.reduce((sum, g) => sum + g.topic.estimatedHours, 0) +
      (targetTopic?.estimatedHours || 0);

    setDiagnosisResult({
      gaps,
      struggles: struggles.map(s => s.description),
      estimatedWeeks: Math.ceil(totalHours / 4),
    });

    setStep(3);
  };

  const handleSaveStudent = () => {
    const newId = (students.length + 1).toString();
    const student: Student = {
      id: newId,
      name: newStudent.name,
      subject: newStudent.subject,
      grade: newStudent.grade,
      currentTopic: newStudent.targetTopic,
      lessonsCount: 0,
      initial: newStudent.name.charAt(0),
      diagnosis: diagnosisResult ? {
        gaps: diagnosisResult.gaps,
        estimatedWeeks: diagnosisResult.estimatedWeeks,
      } : undefined,
    };

    setStudents([...students, student]);
    resetModal();
  };

  const resetModal = () => {
    setShowAddModal(false);
    setStep(1);
    setNewStudent({
      name: '',
      subject: '수학',
      grade: 'MIDDLE_1',
      phone: '',
      targetTopic: '',
    });
    setDiagnosisResult(null);
  };

  const gradeTopics = getTopicsByGrade(newStudent.grade);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background glow */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={[
            colorScheme === 'dark' ? 'rgba(0, 245, 212, 0.06)' : 'rgba(0, 245, 212, 0.04)',
            'transparent',
          ]}
          style={styles.glow}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>학생 관리</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                총 {students.length}명의 학생
              </Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={[styles.statNumber, { color: colors.tint }]}>
                {students.reduce((sum, s) => sum + s.lessonsCount, 0)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>총 수업</Text>
            </View>
          </View>
        </Animated.View>

        {/* Student List */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            내 학생
          </Text>

          {students.map((student, idx) => (
            <Animated.View
              key={student.id}
              entering={FadeInDown.delay(150 + idx * 50).springify()}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.studentCard,
                  { 
                    backgroundColor: colors.backgroundTertiary,
                    borderColor: colors.border,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
                onPress={() => {
                  setSelectedStudent(student);
                  setShowDetailModal(true);
                }}
              >
                <Avatar 
                  name={student.name} 
                  size="lg"
                  variant="gradient"
                  color={idx % 3 === 0 ? 'orange' : idx % 3 === 1 ? 'mint' : 'purple'}
                />

                <View style={styles.studentInfo}>
                  <Text style={[styles.studentName, { color: colors.text }]}>
                    {student.name}
                  </Text>
                  <Text style={[styles.studentMeta, { color: colors.textMuted }]}>
                    {GRADE_NAMES[student.grade]} · {student.subject}
                  </Text>

                  <View style={styles.badges}>
                    <View style={[styles.lessonBadge, { backgroundColor: colors.tint + '15' }]}>
                      <CheckCircleIcon size={12} color={colors.tint} />
                      <Text style={[styles.badgeText, { color: colors.tint }]}>
                        {student.lessonsCount}회
                      </Text>
                    </View>

                    {student.diagnosis && student.diagnosis.gaps.length > 0 && (
                      <View style={[styles.gapBadge, { backgroundColor: colors.warning + '15' }]}>
                        <AlertCircleIcon size={12} color={colors.warning} />
                        <Text style={[styles.badgeText, { color: colors.warning }]}>
                          결손 {student.diagnosis.gaps.length}개
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <ChevronRightIcon size={20} color={colors.textMuted} />
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 140 }} />
      </ScrollView>

      {/* FAB */}
      <Animated.View 
        entering={FadeInUp.delay(400).springify()}
        style={styles.fabContainer}
      >
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={styles.fabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <PlusIcon size={26} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Add Student Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={resetModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundElevated }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {step === 1 && '새 학생 추가'}
                {step === 2 && '학습 목표 설정'}
                {step === 3 && '🎯 AI 진단 결과'}
              </Text>
              <TouchableOpacity onPress={resetModal} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <XIcon size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              {[1, 2, 3].map(s => (
                <View
                  key={s}
                  style={[
                    styles.stepDot,
                    { 
                      backgroundColor: s <= step ? colors.tint : colors.border,
                      width: s === step ? 24 : 8,
                    },
                  ]}
                />
              ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <Animated.View entering={FadeInDown.springify()}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textMuted }]}>이름</Text>
                    <TextInput
                      style={[styles.input, { 
                        backgroundColor: colors.backgroundTertiary, 
                        color: colors.text,
                        borderColor: newStudent.name ? colors.tint : colors.border,
                      }]}
                      placeholder="학생 이름"
                      placeholderTextColor={colors.textMuted}
                      value={newStudent.name}
                      onChangeText={text => setNewStudent(prev => ({ ...prev, name: text }))}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textMuted }]}>학년</Text>
                    <View style={styles.gradeGrid}>
                      {GRADE_OPTIONS.map(grade => (
                        <Pressable
                          key={grade}
                          style={[
                            styles.gradeChip,
                            {
                              backgroundColor: newStudent.grade === grade
                                ? colors.tint
                                : colors.backgroundTertiary,
                              borderColor: newStudent.grade === grade
                                ? colors.tint
                                : colors.border,
                            },
                          ]}
                          onPress={() => setNewStudent(prev => ({ ...prev, grade }))}
                        >
                          <Text
                            style={[
                              styles.gradeChipText,
                              { color: newStudent.grade === grade ? '#fff' : colors.text },
                            ]}
                          >
                            {GRADE_NAMES[grade]}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textMuted }]}>학부모 연락처</Text>
                    <TextInput
                      style={[styles.input, { 
                        backgroundColor: colors.backgroundTertiary, 
                        color: colors.text,
                        borderColor: colors.border,
                      }]}
                      placeholder="010-1234-5678"
                      placeholderTextColor={colors.textMuted}
                      value={newStudent.phone}
                      onChangeText={text => setNewStudent(prev => ({ ...prev, phone: text }))}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <NeonButton
                    title="다음: 학습 목표 설정"
                    variant="gradient"
                    glowColor="orange"
                    icon={<ChevronRightIcon size={18} color="#fff" />}
                    iconPosition="right"
                    onPress={() => setStep(2)}
                    disabled={!newStudent.name}
                    fullWidth
                    style={{ marginTop: spacing.lg }}
                  />
                </Animated.View>
              )}

              {/* Step 2: Target Topic Selection */}
              {step === 2 && (
                <Animated.View entering={FadeInDown.springify()}>
                  <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                    {GRADE_NAMES[newStudent.grade]} 과정에서 목표 단원을 선택하세요.
                    {'\n'}AI가 필요한 선수학습을 자동으로 진단합니다.
                  </Text>

                  <View style={styles.topicList}>
                    {gradeTopics.map(topic => (
                      <Pressable
                        key={topic.code}
                        style={[
                          styles.topicCard,
                          {
                            backgroundColor: newStudent.targetTopic === topic.code
                              ? colors.tint + '15'
                              : colors.backgroundTertiary,
                            borderColor: newStudent.targetTopic === topic.code
                              ? colors.tint
                              : colors.border,
                          },
                        ]}
                        onPress={() => setNewStudent(prev => ({ ...prev, targetTopic: topic.code }))}
                      >
                        <View style={styles.topicHeader}>
                          <Text style={[styles.topicName, { color: colors.text }]}>
                            {topic.name}
                          </Text>
                          {newStudent.targetTopic === topic.code && (
                            <CheckCircleIcon size={18} color={colors.tint} />
                          )}
                        </View>
                        <View style={styles.topicMeta}>
                          <Text style={[styles.topicHours, { color: colors.textMuted }]}>
                            약 {topic.estimatedHours}시간
                          </Text>
                          <View style={[styles.difficultyBadge, {
                            backgroundColor: topic.difficulty >= 4
                              ? colors.error + '15'
                              : topic.difficulty >= 3
                                ? colors.warning + '15'
                                : colors.success + '15',
                          }]}>
                            <Text style={{
                              fontSize: 10,
                              color: topic.difficulty >= 4
                                ? colors.error
                                : topic.difficulty >= 3
                                  ? colors.warning
                                  : colors.success,
                            }}>
                              {'★'.repeat(topic.difficulty)}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </View>

                  <NeonButton
                    title="AI 진단 시작"
                    variant="gradient"
                    glowColor="purple"
                    icon={<SparklesIcon size={18} color="#fff" />}
                    onPress={handleStartDiagnosis}
                    disabled={!newStudent.targetTopic}
                    fullWidth
                    style={{ marginTop: spacing.lg }}
                  />
                </Animated.View>
              )}

              {/* Step 3: Diagnosis Result */}
              {step === 3 && diagnosisResult && (
                <Animated.View entering={FadeInDown.springify()}>
                  <GlowCard variant="neon" glowColor="mint" style={styles.resultCard}>
                    <Text style={[styles.resultTitle, { color: colors.tintSecondary }]}>
                      🎯 {newStudent.name} 학생 진단 완료
                    </Text>

                    <View style={styles.resultStats}>
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.text }]}>
                          {diagnosisResult.gaps.length}개
                        </Text>
                        <Text style={[styles.statLabelSmall, { color: colors.textMuted }]}>
                          보충 필요
                        </Text>
                      </View>
                      <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.text }]}>
                          약 {diagnosisResult.estimatedWeeks}주
                        </Text>
                        <Text style={[styles.statLabelSmall, { color: colors.textMuted }]}>
                          예상 기간
                        </Text>
                      </View>
                    </View>
                  </GlowCard>

                  {diagnosisResult.gaps.length > 0 && (
                    <View style={styles.gapsSection}>
                      <Text style={[styles.gapsSectionTitle, { color: colors.text }]}>
                        📚 발견된 결손 단원
                      </Text>

                      {diagnosisResult.gaps.map((gap) => (
                        <View
                          key={gap.topic.code}
                          style={[styles.gapItem, { backgroundColor: colors.backgroundTertiary }]}
                        >
                          <View style={[
                            styles.severityDot,
                            {
                              backgroundColor: gap.severity === 'CRITICAL'
                                ? colors.error
                                : gap.severity === 'MODERATE'
                                  ? colors.warning
                                  : colors.success,
                            },
                          ]} />
                          <View style={styles.gapInfo}>
                            <Text style={[styles.gapName, { color: colors.text }]}>
                              {gap.topic.name}
                            </Text>
                            <Text style={[styles.gapMeta, { color: colors.textMuted }]}>
                              {GRADE_NAMES[gap.topic.grade]} · {gap.topic.estimatedHours}시간
                            </Text>
                          </View>
                          <Text style={[styles.gapSeverity, {
                            color: gap.severity === 'CRITICAL'
                              ? colors.error
                              : gap.severity === 'MODERATE'
                                ? colors.warning
                                : colors.success,
                          }]}>
                            {gap.severity === 'CRITICAL' ? '필수' : gap.severity === 'MODERATE' ? '권장' : '참고'}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {diagnosisResult.struggles.length > 0 && (
                    <View style={styles.tipsSection}>
                      <Text style={[styles.tipsSectionTitle, { color: colors.text }]}>
                        💡 자주 발생하는 어려움
                      </Text>
                      {diagnosisResult.struggles.slice(0, 2).map((struggle, idx) => (
                        <Text
                          key={idx}
                          style={[styles.tipText, { color: colors.textSecondary }]}
                        >
                          • {struggle}
                        </Text>
                      ))}
                    </View>
                  )}

                  <NeonButton
                    title="학생 등록 완료"
                    variant="gradient"
                    glowColor="mint"
                    icon={<CheckCircleIcon size={18} color="#fff" />}
                    onPress={handleSaveStudent}
                    fullWidth
                    style={{ marginTop: spacing.lg }}
                  />
                </Animated.View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Student Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundElevated }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedStudent?.name} 학생
              </Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <XIcon size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {selectedStudent && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailProfile}>
                  <Avatar name={selectedStudent.name} size="xl" variant="gradient" />
                  <Text style={[styles.detailName, { color: colors.text }]}>
                    {selectedStudent.name}
                  </Text>
                  <Text style={[styles.detailMeta, { color: colors.textMuted }]}>
                    {GRADE_NAMES[selectedStudent.grade]} · {selectedStudent.subject}
                  </Text>
                </View>

                <View style={styles.detailStatsRow}>
                  <GlowCard variant="glass" style={styles.detailStatCard}>
                    <Text style={[styles.detailStatValue, { color: colors.tint }]}>
                      {selectedStudent.lessonsCount}
                    </Text>
                    <Text style={[styles.detailStatLabel, { color: colors.textMuted }]}>
                      완료 수업
                    </Text>
                  </GlowCard>
                  <GlowCard variant="glass" style={styles.detailStatCard}>
                    <Text style={[styles.detailStatValue, { color: colors.tintSecondary }]}>
                      {selectedStudent.diagnosis?.estimatedWeeks || 0}주
                    </Text>
                    <Text style={[styles.detailStatLabel, { color: colors.textMuted }]}>
                      예상 기간
                    </Text>
                  </GlowCard>
                </View>

                {selectedStudent.currentTopic && (
                  <View style={styles.currentTopicSection}>
                    <Text style={[styles.sectionLabelSmall, { color: colors.textMuted }]}>
                      현재 학습 단원
                    </Text>
                    <GlowCard variant="neon" glowColor="orange">
                      <Text style={[styles.currentTopicName, { color: colors.text }]}>
                        {MATH_TOPICS.find(t => t.code === selectedStudent.currentTopic)?.name || selectedStudent.currentTopic}
                      </Text>
                    </GlowCard>
                  </View>
                )}

                {selectedStudent.diagnosis && selectedStudent.diagnosis.gaps.length > 0 && (
                  <View style={styles.gapsSection}>
                    <Text style={[styles.sectionLabelSmall, { color: colors.textMuted }]}>
                      진단된 결손
                    </Text>
                    {selectedStudent.diagnosis.gaps.map(gap => (
                      <View
                        key={gap.topic.code}
                        style={[styles.gapItem, { backgroundColor: colors.backgroundTertiary }]}
                      >
                        <View style={[styles.severityDot, {
                          backgroundColor: gap.severity === 'CRITICAL' ? colors.error : colors.warning,
                        }]} />
                        <View style={styles.gapInfo}>
                          <Text style={[styles.gapName, { color: colors.text }]}>
                            {gap.topic.name}
                          </Text>
                          <Text style={[styles.gapMeta, { color: colors.textMuted }]}>
                            {GRADE_NAMES[gap.topic.grade]}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  glowContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 300,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -150,
    left: '50%',
    marginLeft: -250,
    width: 500,
    height: 400,
    borderRadius: 250,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 60,
  },
  header: { marginBottom: spacing.xxl },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: { ...typography.h1 },
  subtitle: { ...typography.body, marginTop: spacing.xs },
  statBadge: {
    alignItems: 'center',
    padding: spacing.md,
  },
  statNumber: {
    ...typography.display,
    fontSize: 36,
  },
  statLabel: {
    ...typography.caption,
    marginTop: 2,
  },
  section: { marginBottom: spacing.xxl },
  sectionLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  sectionLabelSmall: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  studentInfo: { flex: 1, marginLeft: spacing.lg },
  studentName: { ...typography.h3 },
  studentMeta: { ...typography.bodySmall, marginTop: 2 },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  lessonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  gapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  badgeText: { ...typography.caption },
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: spacing.lg,
  },
  fab: {
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadows.lg,
  },
  fabGradient: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: { ...typography.h2 },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  stepDot: {
    height: 8,
    borderRadius: radius.full,
  },
  stepDescription: {
    ...typography.body,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  inputGroup: { marginBottom: spacing.lg },
  inputLabel: { ...typography.label, marginBottom: spacing.sm },
  input: {
    padding: spacing.lg,
    borderRadius: radius.md,
    fontSize: 16,
    borderWidth: 1.5,
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gradeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  gradeChipText: { ...typography.bodySmall, fontWeight: '600' },
  topicList: { gap: spacing.sm },
  topicCard: {
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicName: { ...typography.bodyMedium },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  topicHours: { ...typography.caption },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  resultCard: {
    marginBottom: spacing.lg,
  },
  resultTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  statItem: { alignItems: 'center' },
  statValue: { ...typography.h2 },
  statLabelSmall: { ...typography.caption, marginTop: 4 },
  statDivider: { width: 1, height: 40 },
  gapsSection: { marginBottom: spacing.lg },
  gapsSectionTitle: {
    ...typography.bodyMedium,
    marginBottom: spacing.md,
  },
  gapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  severityDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },
  gapInfo: { flex: 1, marginLeft: spacing.md },
  gapName: { ...typography.body },
  gapMeta: { ...typography.caption, marginTop: 2 },
  gapSeverity: {
    ...typography.caption,
    fontWeight: '700',
  },
  tipsSection: { marginBottom: spacing.lg },
  tipsSectionTitle: {
    ...typography.bodyMedium,
    marginBottom: spacing.sm,
  },
  tipText: {
    ...typography.bodySmall,
    marginBottom: 4,
    lineHeight: 20,
  },
  detailProfile: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  detailName: {
    ...typography.h2,
    marginTop: spacing.md,
  },
  detailMeta: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  detailStatsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  detailStatCard: {
    flex: 1,
    alignItems: 'center',
  },
  detailStatValue: {
    ...typography.h1,
  },
  detailStatLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  currentTopicSection: {
    marginBottom: spacing.xl,
  },
  currentTopicName: {
    ...typography.bodyMedium,
    textAlign: 'center',
  },
});
