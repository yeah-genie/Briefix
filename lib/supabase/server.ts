import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// ===================================
// SUPABASE CLIENT (Server)
// For Server Components & Route Handlers
// ===================================

// Valid placeholder values for build time
const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjMxNjgwMDAsImV4cCI6MTk1MDQxNjAwMH0.placeholder';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY;

export async function createServerSupabaseClient() {
    const cookieStore = await cookies();

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
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
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!serviceKey) {
        console.warn("[Admin Client] SUPABASE_SERVICE_ROLE_KEY not set, using anon key");
        return createClient(supabaseUrl, supabaseAnonKey);
    }

    return createClient(supabaseUrl, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
