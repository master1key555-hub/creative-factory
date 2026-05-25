"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

export async function addComment(
  postId: string,
  postSlug: string,
  content: string,
): Promise<Result> {
  const text = (content || "").trim();
  if (!text) return { ok: false, error: "Comment cannot be empty." };
  if (text.length > 2000) return { ok: false, error: "Comment is too long." };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in to comment." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, banned")
    .eq("id", user.id)
    .single();
  if (profile?.banned) return { ok: false, error: "Account suspended." };

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    author_name: profile?.full_name || user.email?.split("@")[0] || "Anonymous",
    author_avatar: profile?.avatar_url || null,
    content: text,
  });
  if (error) return { ok: false, error: "Could not post comment." };
  revalidatePath(`/blog/${postSlug}`);
  return { ok: true };
}

export async function deleteComment(id: string, postSlug: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("comments").delete().eq("id", id);
  revalidatePath(`/blog/${postSlug}`);
}
