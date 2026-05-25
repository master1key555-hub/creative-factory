"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

type Result = { ok: true; id?: string } | { ok: false; error: string };

function parseTags(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function createPost(formData: FormData): Promise<Result> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const supabase = await createSupabaseServerClient();
  const title = String(formData.get("title") || "").trim();
  if (!title) return { ok: false, error: "Title is required." };
  const slug =
    String(formData.get("slug") || "").trim() || slugify(title);
  const excerpt = String(formData.get("excerpt") || "").trim() || null;
  const content = String(formData.get("content") || "");
  const cover_url = String(formData.get("cover_url") || "").trim() || null;
  const tags = parseTags(formData.get("tags"));
  const status = (String(formData.get("status") || "draft") as "draft" | "published");
  const seo_title = String(formData.get("seo_title") || "").trim() || null;
  const seo_description = String(formData.get("seo_description") || "").trim() || null;
  const og_image_url = String(formData.get("og_image_url") || "").trim() || null;
  const author_name = String(formData.get("author_name") || "").trim() || null;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      slug,
      excerpt,
      content,
      cover_url,
      tags,
      status,
      seo_title,
      seo_description,
      og_image_url,
      author_name,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/posts");
  return { ok: true, id: data?.id };
}

export async function updatePost(
  id: string,
  formData: FormData,
): Promise<Result> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const supabase = await createSupabaseServerClient();
  const title = String(formData.get("title") || "").trim();
  if (!title) return { ok: false, error: "Title is required." };
  const slug = String(formData.get("slug") || "").trim() || slugify(title);
  const excerpt = String(formData.get("excerpt") || "").trim() || null;
  const content = String(formData.get("content") || "");
  const cover_url = String(formData.get("cover_url") || "").trim() || null;
  const tags = parseTags(formData.get("tags"));
  const status = (String(formData.get("status") || "draft") as "draft" | "published");
  const seo_title = String(formData.get("seo_title") || "").trim() || null;
  const seo_description = String(formData.get("seo_description") || "").trim() || null;
  const og_image_url = String(formData.get("og_image_url") || "").trim() || null;
  const author_name = String(formData.get("author_name") || "").trim() || null;

  const { data: existing } = await supabase
    .from("posts")
    .select("published_at, status")
    .eq("id", id)
    .single();

  const published_at =
    status === "published"
      ? existing?.published_at || new Date().toISOString()
      : null;

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      slug,
      excerpt,
      content,
      cover_url,
      tags,
      status,
      seo_title,
      seo_description,
      og_image_url,
      author_name,
      published_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/posts");
  return { ok: true };
}

export async function deletePost(id: string) {
  try {
    await requireAdmin();
  } catch {
    return;
  }
  const supabase = await createSupabaseServerClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}


