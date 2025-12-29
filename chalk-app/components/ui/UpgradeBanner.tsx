import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors, typography, spacing, radius } from '@/constants/Colors';
import { Card } from './Card';
import { usePlan } from '@/lib/usePlan';
import { startUpgradeFlow } from '@/lib/paymentService';
import { CheckCircleIcon, CrownIcon, SparklesIcon } from '@/components/Icons';

interface UpgradeBannerProps {
    compact?: boolean;
}

export function UpgradeBanner({ compact = false }: UpgradeBannerProps) {
    const { userPlan, isPro, canAddStudent, getReportsRemaining } = usePlan();
    const reportsRemaining = getReportsRemaining();

    if (isPro) return null;

    const handleUpgrade = () => {
        Alert.alert(
            'Upgrade to Pro',
            'Get unlimited students, unlimited reports, and advanced analytics for $12/month.',
            [
                { text: 'Monthly - $12/mo', onPress: () => startUpgradeFlow('monthly') },
                { text: 'Yearly - $99/yr (Save 30%)', onPress: () => startUpgradeFlow('yearly') },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    if (compact) {
        return (
            <TouchableOpacity onPress={handleUpgrade} style={styles.compactBanner}>
                <CrownIcon size={16} color={colors.accent.default} />
                <Text style={styles.compactText}>
                    {reportsRemaining <= 3
                        ? `${reportsRemaining} reports left this month`
                        : 'Upgrade for unlimited'}
                </Text>
                <Text style={styles.compactLink}>Upgrade</Text>
            </TouchableOpacity>
        );
    }

    return (
        <Card style={styles.banner}>
            <View style={styles.header}>
                <CrownIcon size={24} color={colors.accent.default} />
                <Text style={styles.title}>Go Pro</Text>
            </View>

            <Text style={styles.subtitle}>
                Unlock unlimited potential for your tutoring business
            </Text>

            <View style={styles.features}>
                <View style={styles.featureRow}>
                    <CheckCircleIcon size={16} color={colors.status.success} />
                    <Text style={styles.featureText}>Unlimited students (vs 3)</Text>
                </View>
                <View style={styles.featureRow}>
                    <CheckCircleIcon size={16} color={colors.status.success} />
                    <Text style={styles.featureText}>Unlimited reports (vs 10/month)</Text>
                </View>
                <View style={styles.featureRow}>
                    <CheckCircleIcon size={16} color={colors.status.success} />
                    <Text style={styles.featureText}>Advanced analytics dashboard</Text>
                </View>
                <View style={styles.featureRow}>
                    <SparklesIcon size={16} color={colors.status.success} />
                    <Text style={styles.featureText}>Priority support</Text>
                </View>
            </View>

            <View style={styles.pricing}>
                <Text style={styles.price}>$12</Text>
                <Text style={styles.period}>/month</Text>
                <Text style={styles.save}>or $99/year (save 30%)</Text>
            </View>

            <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade}>
                <CrownIcon size={18} color="#fff" />
                <Text style={styles.upgradeBtnText}>Upgrade Now</Text>
            </TouchableOpacity>

            <Text style={styles.guarantee}>7-day free trial • Cancel anytime</Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    banner: {
        margin: spacing.lg,
        padding: spacing.xl,
        backgroundColor: colors.bg.secondary,
        borderWidth: 1,
        borderColor: colors.accent.default + '30',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    title: {
        ...typography.h2,
        color: colors.accent.default,
    },
    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
        marginBottom: spacing.lg,
    },
    features: {
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    featureText: {
        ...typography.body,
        color: colors.text.primary,
    },
    pricing: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: spacing.md,
    },
    price: {
        ...typography.h1,
        color: colors.text.primary,
    },
    period: {
        ...typography.body,
        color: colors.text.muted,
        marginLeft: 2,
    },
    save: {
        ...typography.small,
        color: colors.status.success,
        marginLeft: spacing.md,
    },
    upgradeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.accent.default,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        marginBottom: spacing.sm,
    },
    upgradeBtnText: {
        ...typography.body,
        color: '#fff',
        fontWeight: '700',
    },
    guarantee: {
        ...typography.caption,
        color: colors.text.muted,
        textAlign: 'center',
    },
    // Compact styles
    compactBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.accent.default + '10',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.sm,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    compactText: {
        ...typography.small,
        color: colors.text.secondary,
        flex: 1,
    },
    compactLink: {
        ...typography.small,
        color: colors.accent.default,
        fontWeight: '600',
    },
});
