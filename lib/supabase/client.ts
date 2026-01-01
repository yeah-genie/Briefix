import { createBrowserClient } from "@supabase/ssr";

// ===================================
// SUPABASE CLIENT (Browser)
// ===================================

// Helper to get env vars at runtime (not build time)
function getSupabaseConfig() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        // Return null during build time or when env vars are missing
        return null;
    }

    return { url, key };
}

// Demo mode when no credentials
export function isDemoMode(): boolean {
    return typeof window === 'undefined' || !getSupabaseConfig();
}

// Main client creator for browser-side
export function createBrowserSupabaseClient() {
    const config = getSupabaseConfig();

    if (!config) {
        // During SSR/build, return a mock that won't cause errors
        // This should never be called during build with proper dynamic rendering
        throw new Error('Supabase environment variables not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }

    return createBrowserClient(config.url, config.key);
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
