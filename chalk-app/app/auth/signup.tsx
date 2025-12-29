import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, typography, spacing, radius } from '@/constants/Colors';
import { layout } from '@/components/ui/Theme';
import { useAuth } from '@/lib/useAuth';
import { MailIcon, LockIcon, UserIcon } from '@/components/Icons';

export default function SignupScreen() {
    const { signUpWithEmail, isLoading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsSubmitting(true);
        const success = await signUpWithEmail(email, password, name);
        if (success) {
            router.replace('/auth/login' as any);
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[layout.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.accent.default} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={layout.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Text style={styles.logo}>✏️ Chalk</Text>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join Chalk to start logging lessons</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <UserIcon size={20} color={colors.text.muted} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor={colors.text.muted}
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoComplete="name"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <MailIcon size={20} color={colors.text.muted} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={colors.text.muted}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <LockIcon size={20} color={colors.text.muted} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={colors.text.muted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="new-password"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <LockIcon size={20} color={colors.text.muted} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor={colors.text.muted}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoComplete="new-password"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.signupBtn, isSubmitting && styles.btnDisabled]}
                        onPress={handleSignup}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.signupBtnText}>Create Account</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
                        <Text style={styles.footerLink}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.xl,
        justifyContent: 'center',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing['2xl'],
    },
    logo: {
        fontSize: 48,
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body,
        color: colors.text.muted,
        textAlign: 'center',
    },
    form: {
        gap: spacing.md,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.default,
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.md,
        ...typography.body,
        color: colors.text.primary,
    },
    signupBtn: {
        backgroundColor: colors.accent.default,
        borderRadius: radius.md,
        padding: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    signupBtnText: {
        ...typography.body,
        color: '#fff',
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing['2xl'],
    },
    footerText: {
        ...typography.body,
        color: colors.text.muted,
    },
    footerLink: {
        ...typography.body,
        color: colors.accent.default,
        fontWeight: '600',
    },
});
