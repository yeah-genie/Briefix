<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState, useEffect, useMemo } from 'react';
>>>>>>> 86c950a4a6e75d8d9eca585c0e32854bc3cb3703
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
<<<<<<< HEAD
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { colors, typography, spacing, radius, components } from '@/constants/Colors';
=======
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import Colors, { spacing, typography, radius } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { GlowCard, GradientBorderCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { StudentPicker } from '@/components/ui/StudentPicker';
import { Toast, useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';
import { Avatar } from '@/components/ui/Avatar';
>>>>>>> 86c950a4a6e75d8d9eca585c0e32854bc3cb3703
import {
  SparklesIcon,
  SendIcon,
  PlusIcon,
  CheckCircleIcon,
<<<<<<< HEAD
  XIcon,
  SmileFaceIcon,
  MehFaceIcon,
  SadFaceIcon,
  LightbulbIcon,
  TargetIcon,
  EyeIcon,
  BookOpenIcon,
  RefreshIcon,
  TrashIcon,
} from '@/components/Icons';
import { useData } from '@/lib/DataContext';
import { useZoomAuth } from '@/lib/useZoomAuth';
import { getPastMeetings, meetingsToChalkSessions } from '@/lib/zoomService';

// Rating icons
const RATINGS = [
  { id: 'good' as const, label: 'Got it', Icon: SmileFaceIcon, color: colors.level.high },
  { id: 'okay' as const, label: 'Needs review', Icon: MehFaceIcon, color: colors.level.mid },
  { id: 'struggled' as const, label: 'Struggled', Icon: SadFaceIcon, color: colors.level.low },
];

// Universal struggle types
const STRUGGLES = [
  { id: 'understanding', label: 'Understanding', Icon: LightbulbIcon },
  { id: 'practice', label: 'Practice', Icon: TargetIcon },
  { id: 'memory', label: 'Memory', Icon: BookOpenIcon },
  { id: 'focus', label: 'Focus', Icon: EyeIcon },
];

// Recent topics for autocomplete (will be dynamic later)
const RECENT_TOPICS = ['Quadratic Equations', 'Chapter 5', 'Essay Writing', 'Verb Tenses'];

export default function LogScreen() {
  const { students, addStudent, removeStudent, lessonLogs, addLessonLog, removeLessonLog, getLogsForDate } = useData();
  const { tokens: zoomTokens, isAuthenticated: isZoomAuth, signIn: zoomSignIn } = useZoomAuth();

  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
  const [rating, setRating] = useState<'good' | 'okay' | 'struggled' | null>(null);
  const [struggles, setStruggles] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const today = new Date().toISOString().split('T')[0];
  const todaysLogs = getLogsForDate(today);

  const toggleStruggle = (id: string) => {
    setStruggles(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
=======
  BellIcon,
  ClockIcon,
} from '@/components/Icons';
import { 
  MOCK_STUDENTS, 
  getUpcomingLessonsToday,
  generateAIBriefing,
} from '@/data/mockData';
import { LevelType, GoalCheck, AIBriefing } from '@/data/types';

// 레벨 라벨
const LEVEL_LABELS: Record<LevelType, string> = {
  high: '잘함',
  mid: '보통',
  low: '어려움',
};

export default function TodayScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [goalChecks, setGoalChecks] = useState<GoalCheck[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedFeedback, setPolishedFeedback] = useState('');
  const [step, setStep] = useState(1);
  const [startTime, setStartTime] = useState<string | null>(null);

  const selectedStudent = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
  const upcomingLessons = useMemo(() => getUpcomingLessonsToday(), []);
  
  // AI 브리핑
  const currentBriefing = selectedStudentId 
    ? generateAIBriefing(selectedStudentId) 
    : null;

  useEffect(() => {
    if (selectedStudentId && selectedStudent?.learningGoals) {
      setGoalChecks(selectedStudent.learningGoals.map(g => ({ goalId: g.id, level: null })));
      setStep(2);
      setStartTime(new Date().toTimeString().slice(0, 5));
    }
  }, [selectedStudentId]);

  const handleLevelSelect = (goalId: string, level: LevelType) => {
    setGoalChecks(prev =>
      prev.map(check =>
        check.goalId === goalId ? { ...check, level } : check
      )
    );
>>>>>>> 86c950a4a6e75d8d9eca585c0e32854bc3cb3703
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;
    const newStudent = addStudent({ name: newStudentName.trim() });
    setNewStudentName('');
    setShowAddStudent(false);
    setSelectedStudentId(newStudent.id);
  };

  const handleDeleteStudent = (student: { id: string; name: string }) => {
    Alert.alert('Delete Student', `Remove ${student.name}? This will also delete their scheduled lessons.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          if (selectedStudentId === student.id) setSelectedStudentId(null);
          removeStudent(student.id);
        }
      },
    ]);
  };

  const handleExtractInsights = () => {
    if (!notes.trim()) return;
    setIsExtracting(true);
    setTimeout(() => {
<<<<<<< HEAD
      setAiInsights(`Key observation: Focus on ${topic || 'this topic'} next session. Consider shorter practice sets.`);
      setIsExtracting(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!selectedStudent || !rating) return;

    addLessonLog({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      date: today,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      topic: topic || 'General',
      rating,
      struggles,
      notes,
      aiInsights: aiInsights || undefined,
    });

    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

    // Reset
    setSelectedStudentId(null);
    setTopic('');
    setRating(null);
    setStruggles([]);
    setNotes('');
    setAiInsights(null);
  };

  // Zoom에서 미팅 자동 가져오기
  const syncFromZoom = async () => {
    if (!zoomTokens?.accessToken) {
      Alert.alert(
        'Connect Zoom',
        'Connect your Zoom account to auto-import completed meetings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Connect', onPress: zoomSignIn },
        ]
      );
      return;
    }

    setIsSyncing(true);
    try {
      const meetings = await getPastMeetings(zoomTokens.accessToken, 7);
      const sessions = await meetingsToChalkSessions(zoomTokens.accessToken, meetings);

      let syncedCount = 0;
      for (const session of sessions) {
        // 이미 존재하는 기록인지 확인
        const existing = lessonLogs.find(l =>
          l.date === session.date && l.time === session.time
        );
        if (existing) continue;

        // 학생 찾기 또는 기본 학생
        let student = students.find(s =>
          s.name.toLowerCase().includes(session.studentName.toLowerCase())
        );
        if (!student && students.length > 0) {
          student = students[0];
        }

        addLessonLog({
          studentId: student?.id || 'zoom-import',
          studentName: session.studentName,
          date: session.date,
          time: session.time,
          topic: session.topic,
          rating: 'good',
          struggles: [],
          notes: `[Auto] Imported from Zoom • ${session.duration}min`,
        });
        syncedCount++;
      }

      if (syncedCount > 0) {
        Alert.alert('Synced!', `${syncedCount} sessions imported from Zoom`);
      } else {
        Alert.alert('Up to date', 'No new meetings found');
      }
    } catch (error) {
      console.error('Zoom sync error:', error);
      Alert.alert('Sync Failed', 'Could not sync with Zoom');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteLog = (logId: string, studentName: string) => {
    Alert.alert('Delete Log', `Remove this log for ${studentName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeLessonLog(logId) },
    ]);
  };

  const filteredTopics = RECENT_TOPICS.filter(t =>
    t.toLowerCase().includes(topic.toLowerCase()) && topic.length > 0
  );

  const getRatingIcon = (r: string) => {
    const rating = RATINGS.find(x => x.id === r);
    if (!rating) return null;
    return <rating.Icon size={14} color={rating.color} />;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Log Lesson</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
=======
      setPolishedFeedback(
        `안녕하세요, ${selectedStudent?.parentName || selectedStudent?.name + ' 학부모'}님.\n\n` +
        `오늘 ${selectedStudent?.subject} 수업에서는 ${feedback}\n\n` +
        `궁금하신 점이 있으시면 편하게 말씀해 주세요.\n감사합니다.\n\n- ${selectedStudent?.name} 담당 선생님`
      );
      setIsPolishing(false);
      toast.success('AI 수정 완료', '피드백이 다듬어졌어요');
    }, 1500);
  };

  const handleSend = async () => {
    const message = polishedFeedback || feedback;
    const url = `kakaotalk://send?text=${encodeURIComponent(message)}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        toast.success('전송 완료', '카카오톡으로 이동했어요');
      } else {
        toast.error('전송 실패', '카카오톡을 열 수 없어요');
      }
    } catch (error) {
      toast.error('오류 발생', '다시 시도해주세요');
    }

    handleReset();
  };

  const handleReset = () => {
    setSelectedStudentId(null);
    setFeedback('');
    setPolishedFeedback('');
    setStep(1);
    setGoalChecks([]);
    setStartTime(null);
  };

  const allGoalsChecked = goalChecks.every(c => c.level !== null);
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
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: tabBarHeight },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
>>>>>>> 86c950a4a6e75d8d9eca585c0e32854bc3cb3703
          </Text>
        </Animated.View>

<<<<<<< HEAD
        {/* Today's Logs */}
        {todaysLogs.length > 0 && (
          <View style={styles.todayLogs}>
            <Text style={styles.todayLabel}>Today ({todaysLogs.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {todaysLogs.map(log => (
                <View key={log.id} style={styles.logChip}>
                  {getRatingIcon(log.rating)}
                  <Text style={styles.logChipText}>{log.studentName}</Text>
                  <Text style={styles.logChipTime}>{log.time}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Student Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student</Text>
          <View style={styles.studentList}>
            {students.map(student => {
              const isSelected = selectedStudentId === student.id;
              return (
                <Pressable
                  key={student.id}
                  style={[styles.studentItem, isSelected && styles.studentItemSelected]}
                  onPress={() => setSelectedStudentId(student.id)}
                  onLongPress={() => handleDeleteStudent(student)}
                >
                  <View style={[styles.avatar, isSelected && styles.avatarSelected]}>
                    <Text style={[styles.avatarText, isSelected && styles.avatarTextSelected]}>
                      {student.name[0]}
                    </Text>
                  </View>
                  <Text style={[styles.studentName, isSelected && styles.studentNameSelected]}>
                    {student.name}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable style={styles.addStudentBtn} onPress={() => setShowAddStudent(true)}>
              <PlusIcon size={14} color={colors.accent.default} />
            </Pressable>
          </View>
        </View>

        {/* Topic + Rating */}
        {selectedStudent && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What did you cover?</Text>

            <View style={styles.topicInputWrapper}>
              <TextInput
                style={styles.topicInput}
                placeholder="e.g., Chapter 3, Essay practice..."
                placeholderTextColor={colors.text.muted}
                value={topic}
                onChangeText={(v) => {
                  setTopic(v);
                  setShowTopicSuggestions(v.length > 0);
                }}
                onFocus={() => setShowTopicSuggestions(topic.length > 0)}
                onBlur={() => setTimeout(() => setShowTopicSuggestions(false), 200)}
              />
              {showTopicSuggestions && filteredTopics.length > 0 && (
                <View style={styles.suggestions}>
                  {filteredTopics.map((t, i) => (
                    <Pressable key={i} style={styles.suggestionItem} onPress={() => { setTopic(t); setShowTopicSuggestions(false); }}>
                      <Text style={styles.suggestionText}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <Text style={styles.subLabel}>How did it go?</Text>
            <View style={styles.ratingRow}>
              {RATINGS.map(r => {
                const isSelected = rating === r.id;
                return (
                  <Pressable
                    key={r.id}
                    style={[styles.ratingBtn, isSelected && { backgroundColor: `${r.color}15` }]}
                    onPress={() => setRating(r.id)}
                  >
                    <r.Icon size={28} color={isSelected ? r.color : colors.text.muted} />
                    <Text style={[styles.ratingLabel, isSelected && { color: r.color }]}>{r.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.subLabel}>Where did they struggle? (optional)</Text>
            <View style={styles.struggleRow}>
              {STRUGGLES.map(type => {
                const isSelected = struggles.includes(type.id);
                return (
                  <Pressable
                    key={type.id}
                    style={[styles.struggleChip, isSelected && styles.struggleChipSelected]}
                    onPress={() => toggleStruggle(type.id)}
                  >
                    <type.Icon size={14} color={isSelected ? '#F59E0B' : colors.text.muted} />
                    <Text style={[styles.struggleText, isSelected && styles.struggleTextSelected]}>{type.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Notes */}
        {selectedStudent && rating && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Quick notes..."
              placeholderTextColor={colors.text.muted}
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            {notes.length > 0 && (
              <TouchableOpacity style={styles.extractBtn} onPress={handleExtractInsights} disabled={isExtracting}>
                {isExtracting ? (
                  <ActivityIndicator size="small" color={colors.accent.default} />
                ) : (
                  <>
                    <SparklesIcon size={14} color={colors.accent.default} />
                    <Text style={styles.extractBtnText}>Extract Insights</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {aiInsights && (
              <View style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <CheckCircleIcon size={12} color={colors.accent.default} />
                  <Text style={styles.insightLabel}>AI Insight</Text>
                </View>
                <Text style={styles.insightText}>{aiInsights}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <SendIcon size={14} color={colors.bg.base} />
              <Text style={styles.saveBtnText}>Save Lesson</Text>
            </TouchableOpacity>
          </View>
=======
        {/* 🔔 오늘 예정된 수업 - AI 브리핑 */}
        {upcomingLessons.length > 0 && !selectedStudentId && (
          <Animated.View 
            entering={FadeInDown.delay(150).springify()}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <BellIcon size={16} color={colors.tint} />
              <Text style={[styles.sectionLabel, { color: colors.tint, marginLeft: 6 }]}>
                오늘 예정된 수업
              </Text>
            </View>

            {upcomingLessons.map((lesson, idx) => (
              <Animated.View
                key={lesson.id}
                entering={FadeInDown.delay(200 + idx * 50).springify()}
              >
                <GradientBorderCard style={styles.briefingCard}>
                  <View style={styles.briefingHeader}>
                    <Avatar name={lesson.studentName} size="md" variant="gradient" />
                    <View style={styles.briefingInfo}>
                      <Text style={[styles.briefingName, { color: colors.text }]}>
                        {lesson.studentName}
                      </Text>
                      <View style={styles.briefingTime}>
                        <ClockIcon size={12} color={colors.textMuted} />
                        <Text style={[styles.briefingTimeText, { color: colors.textMuted }]}>
                          {lesson.startTime} - {lesson.endTime}
                        </Text>
                      </View>
                    </View>
                    <NeonButton
                      title="시작"
                      variant="gradient"
                      size="sm"
                      onPress={() => setSelectedStudentId(lesson.studentId)}
                    />
                  </View>

                  {lesson.briefing && (
                    <View style={[styles.briefingContent, { borderTopColor: colors.border }]}>
                      <View style={styles.briefingRow}>
                        <SparklesIcon size={14} color={colors.tint} />
                        <Text style={[styles.briefingLabel, { color: colors.tint }]}>
                          AI 브리핑
                        </Text>
                      </View>
                      
                      <Text style={[styles.briefingText, { color: colors.textSecondary }]}>
                        📚 {lesson.briefing.lastLessonSummary}
                      </Text>
                      
                      {lesson.briefing.reviewPoints.length > 0 && (
                        <Text style={[styles.briefingText, { color: colors.textSecondary }]}>
                          🔄 {lesson.briefing.reviewPoints[0]}
                        </Text>
                      )}
                      
                      {lesson.briefing.tutorHints.length > 0 && (
                        <Text style={[styles.briefingText, { color: colors.tint }]}>
                          💡 {lesson.briefing.tutorHints[0]}
                        </Text>
                      )}
                    </View>
                  )}
                </GradientBorderCard>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {/* Empty State */}
        {MOCK_STUDENTS.length === 0 ? (
          <EmptyState
            type="students"
            title="아직 학생이 없어요"
            description="학생을 먼저 등록하면 수업을 기록할 수 있어요"
            actionLabel="학생 추가하기"
            onAction={() => {}}
          />
        ) : (
          <>
            {/* Step 1: Student Selection */}
            <Animated.View 
              entering={FadeInDown.delay(200).springify()}
              style={styles.section}
            >
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                학생 선택
              </Text>
              
              <StudentPicker
                students={MOCK_STUDENTS}
                selectedId={selectedStudentId}
                onSelect={setSelectedStudentId}
              />
            </Animated.View>

            {/* AI 브리핑 카드 (선택된 학생) */}
            {currentBriefing && step >= 2 && (
              <Animated.View entering={FadeInDown.springify()}>
                <GlowCard variant="neon" glowColor="mint" style={styles.selectedBriefing}>
                  <View style={styles.briefingRow}>
                    <SparklesIcon size={16} color={colors.tint} />
                    <Text style={[styles.briefingLabel, { color: colors.tint }]}>
                      수업 전 브리핑
                    </Text>
                  </View>
                  <Text style={[styles.briefingDetailText, { color: colors.textSecondary }]}>
                    {currentBriefing.lastLessonSummary}
                  </Text>
                  {currentBriefing.tutorHints.map((hint, i) => (
                    <Text key={i} style={[styles.briefingHint, { color: colors.tint }]}>
                      💡 {hint}
                    </Text>
                  ))}
                </GlowCard>
              </Animated.View>
            )}

            {/* Step 2: Goal Checks */}
            {step >= 2 && selectedStudentId && selectedStudent?.learningGoals && (
              <Animated.View 
                entering={FadeInDown.springify()}
                style={styles.section}
              >
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    학습 목표 달성도
                  </Text>
                  <Pressable onPress={handleReset}>
                    <Text style={[styles.resetText, { color: colors.textMuted }]}>
                      초기화
                    </Text>
                  </Pressable>
                </View>

                <GlowCard variant="glass" style={styles.goalCard} contentStyle={{ padding: 0 }}>
                  {selectedStudent.learningGoals.map((goal, idx) => {
                    const check = goalChecks.find(c => c.goalId === goal.id);
                    return (
                      <View
                        key={goal.id}
                        style={[
                          styles.goalRow,
                          idx < selectedStudent.learningGoals!.length - 1 && {
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border
                          }
                        ]}
                      >
                        <Text 
                          style={[styles.goalTitle, { color: colors.text }]}
                          accessibilityLabel={`${goal.title} 달성도`}
                        >
                          {goal.title}
                        </Text>
                        <View style={styles.levelButtons}>
                          {(['high', 'mid', 'low'] as LevelType[]).map((level) => (
                            <LevelButton
                              key={level}
                              level={level}
                              selected={check?.level === level}
                              onPress={() => handleLevelSelect(goal.id, level)}
                              colors={colors}
                            />
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </GlowCard>

                {/* 레벨 범례 */}
                <View style={styles.levelLegend}>
                  {(['high', 'mid', 'low'] as LevelType[]).map((level) => (
                    <View key={level} style={styles.legendItem}>
                      <View style={[
                        styles.legendDot,
                        { backgroundColor: getLevelColor(level, colors) }
                      ]} />
                      <Text style={[styles.legendText, { color: colors.textMuted }]}>
                        {LEVEL_LABELS[level]}
                      </Text>
                    </View>
                  ))}
                </View>

                {allGoalsChecked && (
                  <Animated.View entering={FadeInUp.springify()}>
                    <NeonButton
                      title="피드백 작성하기"
                      variant="outline"
                      glowColor="mint"
                      onPress={() => setStep(3)}
                      icon={<ChevronRightIcon size={18} color={colors.tint} />}
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
                  accessibilityLabel="피드백 입력"
                />

                <NeonButton
                  title="AI로 다듬기"
                  variant="secondary"
                  glowColor="mint"
                  icon={<SparklesIcon size={18} color={colors.tint} />}
                  onPress={handlePolishFeedback}
                  loading={isPolishing}
                  disabled={!feedback.trim()}
                  fullWidth
                  style={{ marginTop: spacing.md }}
                />

                {polishedFeedback && (
                  <Animated.View entering={FadeInUp.springify()}>
                    <GlowCard 
                      variant="neon" 
                      glowColor="mint"
                      style={styles.polishedCard}
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
                    </GlowCard>
                  </Animated.View>
                )}

                <NeonButton
                  title="카카오톡 전송"
                  variant="gradient"
                  glowColor="mint"
                  icon={<SendIcon size={18} color="#fff" />}
                  onPress={handleSend}
                  disabled={!feedback.trim() && !polishedFeedback}
                  fullWidth
                  style={{ marginTop: spacing.lg }}
                />
              </Animated.View>
            )}
          </>
>>>>>>> 86c950a4a6e75d8d9eca585c0e32854bc3cb3703
        )}

      </ScrollView>

      {/* Quick Add Student Modal */}
      <Modal visible={showAddStudent} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.quickModal}>
            <View style={styles.quickModalHeader}>
              <Text style={styles.quickModalTitle}>Add Student</Text>
              <TouchableOpacity onPress={() => setShowAddStudent(false)}>
                <XIcon size={18} color={colors.text.muted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.quickInput}
              placeholder="Name"
              placeholderTextColor={colors.text.muted}
              value={newStudentName}
              onChangeText={setNewStudentName}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.quickSaveBtn, !newStudentName.trim() && styles.quickSaveBtnDisabled]}
              onPress={handleAddStudent}
              disabled={!newStudentName.trim()}
            >
              <Text style={styles.quickSaveBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Toast Notification */}
      {showToast && (
        <View style={styles.toast}>
          <CheckCircleIcon size={16} color="#22C55E" />
          <Text style={styles.toastText}>Lesson saved!</Text>
        </View>
      )}
    </View>
  );
}

// 레벨 버튼
function LevelButton({
  level,
  selected,
  onPress,
  colors,
}: {
  level: LevelType;
  selected: boolean;
  onPress: () => void;
  colors: any;
}) {
  const levelColor = getLevelColor(level, colors);
  const bgColor = selected ? levelColor + '20' : 'transparent';
  const Icon = level === 'high' ? LevelHighIcon : level === 'mid' ? LevelMidIcon : LevelLowIcon;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.levelBtn,
        {
          backgroundColor: bgColor,
          borderColor: selected ? levelColor : 'transparent',
          borderWidth: selected ? 1.5 : 0,
          transform: [{ scale: pressed ? 0.9 : selected ? 1.05 : 1 }],
        },
      ]}
      onPress={onPress}
      accessibilityLabel={`${LEVEL_LABELS[level]} 선택`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Icon size={18} color={selected ? levelColor : colors.textMuted} />
    </Pressable>
  );
}

function getLevelColor(level: LevelType, colors: any) {
  switch (level) {
    case 'high': return colors.levelHigh;
    case 'mid': return colors.levelMid;
    case 'low': return colors.levelLow;
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '좋은 아침이에요 ☀️';
  if (hour < 18) return '좋은 오후에요 🌤️';
  return '좋은 저녁이에요 🌙';
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: colors.bg.base },
  content: { paddingHorizontal: spacing.xl, paddingTop: 52, paddingBottom: 100 },

  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: spacing.lg },
  pageTitle: { ...typography.h1, color: colors.text.primary },
  date: { ...typography.caption, color: colors.text.muted },

  todayLogs: { marginBottom: spacing['2xl'] },
  todayLabel: { ...typography.caption, color: colors.text.muted, marginBottom: spacing.sm },
  logChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.bg.secondary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, marginRight: spacing.sm },
  logChipText: { ...typography.small, color: colors.text.primary },
  logChipTime: { ...typography.caption, color: colors.text.muted },

  section: { marginBottom: spacing['2xl'] },
  sectionTitle: { ...typography.caption, color: colors.text.muted, marginBottom: spacing.md, textTransform: 'uppercase' },
  subLabel: { ...typography.caption, color: colors.text.muted, marginTop: spacing.lg, marginBottom: spacing.sm },

  studentList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  studentItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.full, backgroundColor: colors.bg.secondary },
  studentItemSelected: { backgroundColor: colors.accent.muted },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.bg.tertiary, alignItems: 'center', justifyContent: 'center' },
  avatarSelected: { backgroundColor: colors.accent.default },
  avatarText: { ...typography.caption, fontWeight: '600', color: colors.text.muted },
  avatarTextSelected: { color: colors.bg.base },
  studentName: { ...typography.small, color: colors.text.primary },
  studentNameSelected: { color: colors.accent.default },
  addStudentBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.border.default, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },

  topicInputWrapper: { position: 'relative', zIndex: 10 },
  topicInput: { backgroundColor: colors.bg.secondary, borderRadius: radius.md, padding: spacing.lg, ...typography.body, color: colors.text.primary },
  suggestions: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: colors.bg.tertiary, borderRadius: radius.md, marginTop: spacing.xs, overflow: 'hidden' },
  suggestionItem: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border.light },
  suggestionText: { ...typography.body, color: colors.text.primary },

  ratingRow: { flexDirection: 'row', gap: spacing.md },
  ratingBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg, backgroundColor: colors.bg.secondary, borderRadius: radius.md },
  ratingLabel: { ...typography.caption, color: colors.text.muted, marginTop: spacing.xs },

  struggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  struggleChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.bg.secondary, borderRadius: radius.full },
  struggleChipSelected: { backgroundColor: '#F59E0B20' },
  struggleText: { ...typography.caption, color: colors.text.secondary },
  struggleTextSelected: { color: '#F59E0B' },

  notesInput: { backgroundColor: colors.bg.secondary, borderRadius: radius.md, padding: spacing.lg, ...typography.body, color: colors.text.primary, minHeight: 80, textAlignVertical: 'top' },
  extractBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.md, paddingVertical: spacing.md },
  extractBtnText: { ...typography.small, color: colors.accent.default },

  insightCard: { backgroundColor: colors.accent.subtle, borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.md },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  insightLabel: { ...typography.caption, color: colors.accent.default },
  insightText: { ...typography.small, color: colors.text.secondary, lineHeight: 18 },

  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: components.button.lg, backgroundColor: colors.accent.default, borderRadius: radius.md, marginTop: spacing.xl },
  saveBtnText: { ...typography.body, fontWeight: '600', color: colors.bg.base },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  quickModal: { backgroundColor: colors.bg.secondary, borderRadius: radius.lg, padding: spacing.xl, width: '100%', maxWidth: 320 },
  quickModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  quickModalTitle: { ...typography.h2, color: colors.text.primary },
  quickInput: { backgroundColor: colors.bg.tertiary, borderRadius: radius.md, padding: spacing.lg, ...typography.body, color: colors.text.primary, marginBottom: spacing.md },
  quickSaveBtn: { height: components.button.md, backgroundColor: colors.accent.default, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  quickSaveBtnDisabled: { backgroundColor: colors.bg.tertiary },
  quickSaveBtnText: { ...typography.body, fontWeight: '600', color: colors.bg.base },

  // Toast
  toast: { position: 'absolute', bottom: 100, left: spacing.xl, right: spacing.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.bg.secondary, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: '#22C55E40' },
  toastText: { ...typography.body, color: colors.text.primary },
=======
  container: { flex: 1 },
  glowContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -100, left: -100, right: -100,
    height: 400,
    borderRadius: 200,
  },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: spacing.lg },
  header: { marginBottom: spacing.xl },
  greeting: { ...typography.bodySmall, marginBottom: spacing.xs },
  title: { ...typography.h1, marginBottom: spacing.xs },
  date: { ...typography.body },
  section: { marginBottom: spacing.xxl },
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
  resetText: { ...typography.bodySmall },
  
  // AI Briefing
  briefingCard: { marginBottom: spacing.md },
  briefingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  briefingInfo: { flex: 1, marginLeft: spacing.md },
  briefingName: { ...typography.bodyMedium },
  briefingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  briefingTimeText: { ...typography.caption },
  briefingContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  briefingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  briefingLabel: { ...typography.caption, fontWeight: '600' },
  briefingText: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  selectedBriefing: { marginBottom: spacing.xl },
  briefingDetailText: {
    ...typography.body,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  briefingHint: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },

  // Goals
  goalCard: {},
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  goalTitle: { ...typography.body, flex: 1, marginRight: spacing.md },
  levelButtons: { flexDirection: 'row', gap: spacing.sm },
  levelBtn: {
    width: 36, height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { ...typography.caption },
  
  // Feedback
  feedbackInput: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    lineHeight: 22,
  },
  polishedCard: { marginTop: spacing.md },
  polishedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  polishedLabel: { ...typography.caption, fontWeight: '600' },
  polishedText: { ...typography.bodySmall, lineHeight: 20 },
>>>>>>> 86c950a4a6e75d8d9eca585c0e32854bc3cb3703
});
