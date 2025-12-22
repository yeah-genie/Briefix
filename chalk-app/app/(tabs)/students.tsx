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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Colors, { spacing, typography } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import {
    PlusIcon,
    ChevronRightIcon,
    XIcon,
    CheckCircleIcon,
} from '@/components/Icons';

const MOCK_STUDENTS = [
    { id: '1', name: '김민수', subject: '수학', grade: '중2', lessonsCount: 12, initial: 'M' },
    { id: '2', name: '이서연', subject: '영어', grade: '고1', lessonsCount: 8, initial: 'S' },
    { id: '3', name: '박지훈', subject: '수학', grade: '중1', lessonsCount: 5, initial: 'J' },
];

export default function StudentsScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const colors = Colors[colorScheme];

    const [showModal, setShowModal] = useState(false);
    const [newStudent, setNewStudent] = useState({
        name: '',
        subject: '',
        grade: '',
        phone: '',
    });

    const handleAddStudent = () => {
        console.log('Adding:', newStudent);
        setShowModal(false);
        setNewStudent({ name: '', subject: '', grade: '', phone: '' });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Glow */}
            <View style={styles.glowContainer}>
                <LinearGradient
                    colors={['rgba(6, 182, 212, 0.12)', 'transparent']}
                    style={styles.glow}
                />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, { color: colors.text }]}>학생 관리</Text>
                        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                            총 {MOCK_STUDENTS.length}명의 학생
                        </Text>
                    </View>
                </View>

                {/* Student List */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                        내 학생
                    </Text>

                    {MOCK_STUDENTS.map(student => (
                        <TouchableOpacity
                            key={student.id}
                            style={[styles.studentCard, { backgroundColor: colors.backgroundTertiary }]}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={[colors.gradientStart, colors.gradientEnd]}
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
                                <View style={styles.lessonBadge}>
                                    <CheckCircleIcon size={12} color={colors.tint} />
                                    <Text style={[styles.lessonCount, { color: colors.tint }]}>
                                        {student.lessonsCount}회 완료
                                    </Text>
                                </View>
                            </View>

                            <ChevronRightIcon size={20} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowModal(true)}
            >
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    style={styles.fabGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <PlusIcon size={24} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>

            {/* Add Student Modal */}
            <Modal
                visible={showModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.backgroundSecondary }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                새 학생 추가
                            </Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <XIcon size={24} color={colors.textMuted} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>이름</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.backgroundTertiary, color: colors.text }]}
                                placeholder="학생 이름"
                                placeholderTextColor={colors.textMuted}
                                value={newStudent.name}
                                onChangeText={text => setNewStudent(prev => ({ ...prev, name: text }))}
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>과목</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.backgroundTertiary, color: colors.text }]}
                                    placeholder="수학"
                                    placeholderTextColor={colors.textMuted}
                                    value={newStudent.subject}
                                    onChangeText={text => setNewStudent(prev => ({ ...prev, subject: text }))}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>학년</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.backgroundTertiary, color: colors.text }]}
                                    placeholder="중2"
                                    placeholderTextColor={colors.textMuted}
                                    value={newStudent.grade}
                                    onChangeText={text => setNewStudent(prev => ({ ...prev, grade: text }))}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>학부모 연락처</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.backgroundTertiary, color: colors.text }]}
                                placeholder="010-1234-5678"
                                placeholderTextColor={colors.textMuted}
                                value={newStudent.phone}
                                onChangeText={text => setNewStudent(prev => ({ ...prev, phone: text }))}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <TouchableOpacity style={styles.saveButton} onPress={handleAddStudent}>
                            <LinearGradient
                                colors={[colors.gradientStart, colors.gradientEnd]}
                                style={styles.saveButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.saveButtonText}>저장</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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
        paddingBottom: 120,
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
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
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
    lessonBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    lessonCount: {
        ...typography.caption,
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: spacing.lg,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabGradient: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    modalTitle: {
        ...typography.h2,
    },
    inputGroup: {
        marginBottom: spacing.md,
    },
    inputLabel: {
        ...typography.caption,
        marginBottom: spacing.xs,
    },
    inputRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    input: {
        padding: spacing.md,
        borderRadius: 12,
        fontSize: 15,
    },
    saveButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: spacing.md,
    },
    saveButtonGradient: {
        padding: spacing.md,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        ...typography.body,
        fontWeight: '600',
    },
});
