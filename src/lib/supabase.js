import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client that injects the Clerk session token
 * into every request for Row Level Security (RLS).
 *
 * Usage (in Server Components / Server Actions):
 *   const { getToken } = await auth();
 *   const supabase = await createClerkSupabaseClient(getToken);
 *
 * Usage (in Client Components):
 *   const { getToken } = useAuth();
 *   const supabase = await createClerkSupabaseClient(getToken);
 */
export async function createClerkSupabaseClient(getToken) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const token = await getToken({ template: "supabase" });

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

/**
 * Creates a Supabase admin client using the service role key.
 * WARNING: Only use server-side for administrative operations.
 */
export function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
