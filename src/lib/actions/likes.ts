"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function toggleLike(postId: string, postSlug: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in." };

  const { data: existing } = await supabase
    .from("likes")
    .select("user_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: user.id });
  }
  revalidatePath(`/blog/${postSlug}`);
  return { ok: true };
}
