import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './useAuth';

export type PlanType = 'free' | 'pro';

export interface UserPlan {
    plan: PlanType;
    planExpiresAt: Date | null;
    maxStudents: number;
    maxReportsPerMonth: number;
    features: {
        aiReports: boolean;
        advancedAnalytics: boolean;
        publicProfile: boolean;
        prioritySupport: boolean;
    };
}

const FREE_PLAN: UserPlan = {
    plan: 'free',
    planExpiresAt: null,
    maxStudents: 3,
    maxReportsPerMonth: 10,
    features: {
        aiReports: true,
        advancedAnalytics: false,
        publicProfile: true,
        prioritySupport: false,
    },
};

const PRO_PLAN: UserPlan = {
    plan: 'pro',
    planExpiresAt: null,
    maxStudents: Infinity,
    maxReportsPerMonth: Infinity,
    features: {
        aiReports: true,
        advancedAnalytics: true,
        publicProfile: true,
        prioritySupport: true,
    },
};

export function usePlan() {
    const { user, isAuthenticated } = useAuth();
    const [userPlan, setUserPlan] = useState<UserPlan>(FREE_PLAN);
    const [isLoading, setIsLoading] = useState(true);
    const [reportsSentThisMonth, setReportsSentThisMonth] = useState(0);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchUserPlan();
            fetchReportCount();
        } else {
            setUserPlan(FREE_PLAN);
            setIsLoading(false);
        }
    }, [user, isAuthenticated]);

    const fetchUserPlan = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('users')
                .select('plan, plan_expires_at')
                .eq('id', user.id)
                .single();

            if (error) {
                console.log('User plan not found, using free plan');
                setUserPlan(FREE_PLAN);
            } else if (data) {
                const isPro = data.plan === 'pro';
                const isExpired = data.plan_expires_at && new Date(data.plan_expires_at) < new Date();

                if (isPro && !isExpired) {
                    setUserPlan({
                        ...PRO_PLAN,
                        planExpiresAt: data.plan_expires_at ? new Date(data.plan_expires_at) : null,
                    });
                } else {
                    setUserPlan(FREE_PLAN);
                }
            }
        } catch (error) {
            console.error('Error fetching user plan:', error);
            setUserPlan(FREE_PLAN);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReportCount = async () => {
        if (!user) return;

        try {
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

            const { count, error } = await supabase
                .from('parent_reports')
                .select('*', { count: 'exact', head: true })
                .gte('sent_at', firstDayOfMonth);

            if (!error && count !== null) {
                setReportsSentThisMonth(count);
            }
        } catch (error) {
            console.error('Error fetching report count:', error);
        }
    };

    const canAddStudent = (currentStudentCount: number): boolean => {
        return currentStudentCount < userPlan.maxStudents;
    };

    const canSendReport = (): boolean => {
        return reportsSentThisMonth < userPlan.maxReportsPerMonth;
    };

    const getReportsRemaining = (): number => {
        return Math.max(0, userPlan.maxReportsPerMonth - reportsSentThisMonth);
    };

    const incrementReportCount = () => {
        setReportsSentThisMonth(prev => prev + 1);
    };

    return {
        userPlan,
        isLoading,
        isPro: userPlan.plan === 'pro',
        canAddStudent,
        canSendReport,
        getReportsRemaining,
        reportsSentThisMonth,
        incrementReportCount,
        refresh: () => {
            fetchUserPlan();
            fetchReportCount();
        },
    };
}
