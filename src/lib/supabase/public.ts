import { createClient } from "@supabase/supabase-js";

// Anonymous, cookie-free Supabase client for public reads (published posts,
// site settings). Used by Storyblok blocks rendered in the cacheable /cms
// route so they don't pull in `cookies()` and force dynamic rendering.
export function createSupabasePublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
