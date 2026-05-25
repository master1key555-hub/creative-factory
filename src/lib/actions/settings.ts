"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

type Result = { ok: true } | { ok: false; error: string };

function val(formData: FormData, key: string): string | null {
  const v = String(formData.get(key) || "").trim();
  return v ? v : null;
}

export async function updateSettings(formData: FormData): Promise<Result> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .single();
  if (!existing) return { ok: false, error: "Settings row missing." };

  const update = {
    site_name: val(formData, "site_name") || "Creative Factory",
    tagline: val(formData, "tagline"),
    logo_url: val(formData, "logo_url"),
    default_og_image: val(formData, "default_og_image"),
    footer_text: val(formData, "footer_text"),
    instagram_url: val(formData, "instagram_url") || "#",
    telegram_url: val(formData, "telegram_url") || "#",
    facebook_url: val(formData, "facebook_url") || "#",
    twitter_url: val(formData, "twitter_url") || "#",
    pinterest_url: val(formData, "pinterest_url") || "#",
    primary_color: val(formData, "primary_color"),
    secondary_color: val(formData, "secondary_color"),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("site_settings")
    .update(update)
    .eq("id", existing.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}
