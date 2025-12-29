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

export default function LoginScreen() {
    const { signInWithEmail, signInWithGoogle, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEmailLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setIsSubmitting(true);
        const success = await signInWithEmail(email, password);
        if (success) {
            router.replace('/(tabs)' as any);
        }
        setIsSubmitting(false);
    };

    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        await signInWithGoogle();
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
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                </View>

                <View style={styles.form}>
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
                            autoComplete="password"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.loginBtn, isSubmitting && styles.btnDisabled]}
                        onPress={handleEmailLogin}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginBtnText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.googleBtn}
                        onPress={handleGoogleLogin}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.googleBtnText}>🔗 Continue with Google</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/auth/signup' as any)}>
                        <Text style={styles.footerLink}>Sign Up</Text>
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
    loginBtn: {
        backgroundColor: colors.accent.default,
        borderRadius: radius.md,
        padding: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    loginBtnText: {
        ...typography.body,
        color: '#fff',
        fontWeight: '700',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border.default,
    },
    dividerText: {
        ...typography.caption,
        color: colors.text.muted,
        marginHorizontal: spacing.md,
    },
    googleBtn: {
        backgroundColor: colors.bg.secondary,
        borderRadius: radius.md,
        padding: spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    googleBtnText: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '600',
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
