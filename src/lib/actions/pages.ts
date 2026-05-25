"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

type Result = { ok: true } | { ok: false; error: string };

export async function updatePage(
  slug: string,
  formData: FormData,
): Promise<Result> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const supabase = await createSupabaseServerClient();
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "");
  const seo_title = String(formData.get("seo_title") || "").trim() || null;
  const seo_description =
    String(formData.get("seo_description") || "").trim() || null;
  if (!title) return { ok: false, error: "Title is required." };
  const { error } = await supabase
    .from("pages")
    .upsert(
      {
        slug,
        title,
        content,
        seo_title,
        seo_description,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/pages");
  return { ok: true };
}
