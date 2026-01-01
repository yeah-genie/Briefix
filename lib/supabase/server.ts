import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// ===================================
// SUPABASE CLIENT (Server)
// For Server Components & Route Handlers
// ===================================

const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjMxNjgwMDAsImV4cCI6MTk1MDQxNjAwMH0.placeholder';

export async function createServerSupabaseClient() {
    const cookieStore = await cookies();

    // Get and sanitize env vars
    let url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
    let key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

    // Check for "undefined" or "null" strings (common Vercel misconfiguration)
    if (url === "undefined" || url === "null" || !url) url = "";
    if (key === "undefined" || key === "null" || !key) key = "";

    if (!url || !key) {
        if (process.env.NODE_ENV === 'production') {
            console.error(`[Supabase Server] Invalid configuration. URL length: ${url.length}, KEY length: ${key.length}`);
        }
    }

    const finalUrl = url || PLACEHOLDER_URL;
    const finalKey = key || PLACEHOLDER_KEY;

    return createServerClient(
        finalUrl,
        finalKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                        // Server Component에서는 쿠키 설정 불가
                    }
                },
            },
        }
    );
}

// ===================================
// SUPABASE ADMIN CLIENT (Server)
// Bypasses RLS - Use with caution!
// ===================================

export function createAdminSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceKey) {
        console.warn("[Admin Client] SUPABASE_SERVICE_ROLE_KEY not set, falling back to anon key (RLS active)");
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY;
        return createClient(url, anonKey);
    }

    return createClient(url, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
