import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

const SupabaseClientSingleton = {
    instance: createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ) as SupabaseClient,
}

// Freeze the object to prevent modifications
Object.freeze(SupabaseClientSingleton)

export function createClient() {
    return SupabaseClientSingleton.instance
}

export type SupabaseClientType = typeof SupabaseClientSingleton
