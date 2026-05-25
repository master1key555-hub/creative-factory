import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

const FALLBACK: SiteSettings = {
  id: "fallback",
  site_name: "Creative Factory",
  tagline: "Where ideas become iconic.",
  logo_url: null,
  default_og_image: null,
  footer_text: "© Creative Factory. All rights reserved.",
  instagram_url: "#",
  telegram_url: "#",
  facebook_url: "#",
  twitter_url: "#",
  pinterest_url: "#",
  primary_color: "#c9a961",
  secondary_color: "#6b1f2a",
  updated_at: new Date().toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (!data) return FALLBACK;
    return data as SiteSettings;
  } catch {
    return FALLBACK;
  }
}
