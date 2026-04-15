import { createClient } from './server'

/**
 * Creates a Supabase admin client using the service role key.
 * WARNING: Only use server-side for administrative operations.
 */
import { createClient as createBaseClient } from '@supabase/supabase-js'

export function createSupabaseAdmin() {
    return createBaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
}
