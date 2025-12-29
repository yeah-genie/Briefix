import { Alert, Linking, Platform } from 'react-native';
import { supabase } from './supabase';

// Stripe Product IDs (configure in Stripe Dashboard)
const STRIPE_PRICES = {
    pro_monthly: 'price_chalk_pro_monthly', // $12/month
    pro_yearly: 'price_chalk_pro_yearly',   // $99/year (~$8.25/month)
};

interface CheckoutResult {
    success: boolean;
    url?: string;
    error?: string;
}

/**
 * Create a Stripe Checkout session for upgrading to Pro
 */
export async function createCheckoutSession(
    priceType: 'monthly' | 'yearly' = 'monthly'
): Promise<CheckoutResult> {
    try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
            return { success: false, error: 'Please sign in to upgrade' };
        }

        const priceId = priceType === 'yearly' ? STRIPE_PRICES.pro_yearly : STRIPE_PRICES.pro_monthly;

        // Call Supabase Edge Function to create checkout session
        const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: {
                priceId,
                userId: user.user.id,
                email: user.user.email,
                successUrl: 'chalk://upgrade-success',
                cancelUrl: 'chalk://upgrade-cancel',
            },
        });

        if (error) {
            console.error('Checkout error:', error);
            return { success: false, error: 'Failed to create checkout session' };
        }

        return { success: true, url: data.url };
    } catch (error) {
        console.error('Checkout error:', error);
        return { success: false, error: 'Something went wrong' };
    }
}

/**
 * Open Stripe Customer Portal for managing subscription
 */
export async function openCustomerPortal(): Promise<boolean> {
    try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
            Alert.alert('Error', 'Please sign in to manage subscription');
            return false;
        }

        const { data, error } = await supabase.functions.invoke('customer-portal', {
            body: { userId: user.user.id },
        });

        if (error || !data?.url) {
            Alert.alert('Error', 'Failed to open customer portal');
            return false;
        }

        await Linking.openURL(data.url);
        return true;
    } catch (error) {
        console.error('Portal error:', error);
        return false;
    }
}

/**
 * Process upgrade flow with platform-specific handling
 */
export async function startUpgradeFlow(priceType: 'monthly' | 'yearly' = 'monthly') {
    const result = await createCheckoutSession(priceType);

    if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to start upgrade');
        return;
    }

    if (result.url) {
        try {
            await Linking.openURL(result.url);
        } catch {
            Alert.alert(
                'Open in Browser',
                'Please open this link in your browser to complete the upgrade.',
                [{ text: 'OK' }]
            );
        }
    }
}

/**
 * Verify and sync subscription status with Supabase
 */
export async function syncSubscriptionStatus(): Promise<boolean> {
    try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return false;

        const { data, error } = await supabase.functions.invoke('sync-subscription', {
            body: { userId: user.user.id },
        });

        if (error) {
            console.error('Sync error:', error);
            return false;
        }

        return data?.synced === true;
    } catch (error) {
        console.error('Sync error:', error);
        return false;
    }
}

/**
 * Get subscription info for display
 */
export interface SubscriptionInfo {
    status: 'active' | 'canceled' | 'past_due' | 'none';
    plan: 'free' | 'pro';
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
}

export async function getSubscriptionInfo(): Promise<SubscriptionInfo> {
    try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
            return { status: 'none', plan: 'free' };
        }

        const { data } = await supabase
            .from('users')
            .select('plan, plan_expires_at')
            .eq('id', user.user.id)
            .single();

        if (!data) {
            return { status: 'none', plan: 'free' };
        }

        const isPro = data.plan === 'pro';
        const expiresAt = data.plan_expires_at ? new Date(data.plan_expires_at) : null;
        const isExpired = expiresAt && expiresAt < new Date();

        if (isPro && !isExpired) {
            return {
                status: 'active',
                plan: 'pro',
                currentPeriodEnd: expiresAt || undefined,
            };
        }

        return { status: 'none', plan: 'free' };
    } catch {
        return { status: 'none', plan: 'free' };
    }
}
