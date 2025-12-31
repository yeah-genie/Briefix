import { createBrowserClient } from "@supabase/ssr";

// ===================================
// SUPABASE CLIENT (Browser)
// ===================================

// Use a valid URL format for placeholder to avoid build errors
const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjMxNjgwMDAsImV4cCI6MTk1MDQxNjAwMH0.placeholder';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY;

// Demo mode when no credentials
export const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl === PLACEHOLDER_URL;

// Main client creator for browser-side
export function createBrowserSupabaseClient() {
    if (isDemoMode && typeof window !== 'undefined') {
        console.warn('[Supabase] Running in DEMO mode - data will not persist');
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
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
