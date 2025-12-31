import { createBrowserClient } from "@supabase/ssr";

// ===================================
// SUPABASE CLIENT (Browser)
// ===================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Demo mode when no credentials
export const isDemoMode = !supabaseUrl || supabaseUrl === 'your_supabase_project_url';

// Main client creator for browser-side
export function createBrowserSupabaseClient() {
    if (isDemoMode) {
        console.warn('[Supabase] Running in DEMO mode - data will not persist');
    }

    return createBrowserClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder-key'
    );
}

export function createClient() {
    return createBrowserSupabaseClient();
}

// Singleton client for client components
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
    if (!browserClient) {
        browserClient = createClient();
    }
    return browserClient;
}
